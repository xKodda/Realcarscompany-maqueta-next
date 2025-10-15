// Hook personalizado para manejar consultas y contacto
// Preparado para conectar con el backend futuro

import { useState } from 'react'
import { consultasService, type CreateConsultaData } from '@/lib/api/services'
import type { Consulta, ContactoForm } from '@/lib/types'

export function useConsulta() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const enviarConsulta = async (data: CreateConsultaData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await consultasService.create(data)

      if (response.success) {
        setSuccess(true)
        return response.data
      } else {
        setError(response.error || 'Error al enviar la consulta')
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
    enviarConsulta,
    loading,
    error,
    success,
    reset,
  }
}

export function useContactoForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const enviarContacto = async (data: ContactoForm) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await consultasService.sendContactEmail(data)

      if (response.success) {
        setSuccess(true)
        return true
      } else {
        setError(response.error || 'Error al enviar el mensaje')
        return false
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
      return false
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
    enviarContacto,
    loading,
    error,
    success,
    reset,
  }
}

export function useConsultasList() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const fetchConsultas = async (currentPage = page, limit = 10) => {
    setLoading(true)
    setError(null)

    try {
      const response = await consultasService.getAll(currentPage, limit)

      if (response.success && response.data) {
        setConsultas(response.data.consultas)
        setTotal(response.data.total)
      } else {
        setError(response.error || 'Error al cargar las consultas')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    id: string,
    estado: 'pendiente' | 'respondido' | 'cerrado'
  ) => {
    try {
      const response = await consultasService.updateStatus(id, estado)
      
      if (response.success) {
        // Actualizar la lista local
        setConsultas(
          consultas.map((c) => (c.id === id ? { ...c, estado } : c))
        )
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const deleteConsulta = async (id: string) => {
    try {
      const response = await consultasService.delete(id)
      
      if (response.success) {
        setConsultas(consultas.filter((c) => c.id !== id))
        return true
      }
      return false
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return {
    consultas,
    loading,
    error,
    total,
    page,
    setPage,
    fetchConsultas,
    updateStatus,
    deleteConsulta,
  }
}


