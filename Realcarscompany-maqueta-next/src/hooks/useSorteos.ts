// Hook personalizado para manejar sorteos
// Preparado para conectar con el backend futuro

import { useState, useEffect } from 'react'
import { sorteosService, type Sorteo, type Ganador } from '@/lib/api/services'

export function useSorteos(options: { activeOnly?: boolean } = {}) {
  const { activeOnly = false } = options

  const [sorteos, setSorteos] = useState<Sorteo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSorteos = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = activeOnly
          ? await sorteosService.getActive()
          : await sorteosService.getAll()

        if (response.success && response.data) {
          setSorteos(response.data)
        } else {
          setError(response.error || 'Error al cargar los sorteos')
        }
      } catch (err) {
        setError('Error al conectar con el servidor')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSorteos()
  }, [activeOnly])

  return { sorteos, loading, error }
}

export function useSorteo(id: string) {
  const [sorteo, setSorteo] = useState<Sorteo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSorteo = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await sorteosService.getById(id)

        if (response.success && response.data) {
          setSorteo(response.data)
        } else {
          setError(response.error || 'Sorteo no encontrado')
        }
      } catch (err) {
        setError('Error al conectar con el servidor')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSorteo()
    }
  }, [id])

  return { sorteo, loading, error }
}

export function useParticiparSorteo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const participar = async (
    sorteoId: string,
    data: {
      nombre: string
      email: string
      telefono: string
      acepta_terminos: boolean
    }
  ) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await sorteosService.participate(sorteoId, data)

      if (response.success) {
        setSuccess(true)
        return response.data
      } else {
        setError(response.error || 'Error al registrar la participación')
        return null
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  return {
    participar,
    loading,
    error,
    success,
    reset,
  }
}

export function useGanadores(year?: number) {
  const [ganadores, setGanadores] = useState<Ganador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGanadores = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await sorteosService.getWinners(year)

        if (response.success && response.data) {
          setGanadores(response.data)
        } else {
          setError(response.error || 'Error al cargar los ganadores')
        }
      } catch (err) {
        setError('Error al conectar con el servidor')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGanadores()
  }, [year])

  return { ganadores, loading, error }
}


