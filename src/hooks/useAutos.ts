// Hook personalizado para manejar autos
// Preparado para conectar con el backend futuro

import { useState, useEffect } from 'react'
import { autosService, type AutoFilters, type PaginationParams } from '@/lib/api/services'
import type { Auto } from '@/lib/types'

export interface UseAutosOptions {
  filters?: AutoFilters
  pagination?: PaginationParams
  autoFetch?: boolean
}

export function useAutos(options: UseAutosOptions = {}) {
  const { filters, pagination, autoFetch = true } = options

  const [autos, setAutos] = useState<Auto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(pagination?.page || 1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchAutos = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await autosService.getAll(filters, { ...pagination, page })
      
      if (response.success && response.data) {
        setAutos(response.data.autos)
        setTotal(response.data.total)
        setTotalPages(response.data.totalPages)
      } else {
        setError(response.error || 'Error al cargar los autos')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchAutos()
  }

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchAutos()
    }
  }, [page, JSON.stringify(filters)])

  return {
    autos,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch,
    nextPage,
    prevPage,
    goToPage,
  }
}

export function useAuto(id: string) {
  const [auto, setAuto] = useState<Auto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuto = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await autosService.getById(id)
        
        if (response.success && response.data) {
          setAuto(response.data)
        } else {
          setError(response.error || 'Auto no encontrado')
        }
      } catch (err) {
        setError('Error al conectar con el servidor')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAuto()
    }
  }, [id])

  return { auto, loading, error }
}

export function useAutoSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Auto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (searchQuery?: string) => {
    const q = searchQuery || query
    if (!q || q.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await autosService.search(q)
      
      if (response.success && response.data) {
        setResults(response.data)
      } else {
        setError(response.error || 'Error en la búsqueda')
        setResults([])
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      setResults([])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        search()
      } else {
        setResults([])
      }
    }, 300) // Debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [query])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
  }
}


