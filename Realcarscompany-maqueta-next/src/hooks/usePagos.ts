// Hook personalizado para manejar pagos con Khipu
// Sistema de compra de tickets para sorteos

import { useState } from 'react'
import {
  pagosService,
  type CompraTicketData,
  type OrdenCompra,
  type TicketSorteo,
} from '@/lib/api/services/pagos.service'

export function useComprarTickets() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orden, setOrden] = useState<OrdenCompra | null>(null)

  const comprar = async (data: CompraTicketData) => {
    setLoading(true)
    setError(null)
    setOrden(null)

    try {
      // Crear orden real usando la API
      const ordenResponse = await pagosService.crearOrden(data)

      if (!ordenResponse.success || !ordenResponse.data) {
        throw new Error(ordenResponse.error || 'Error al crear la orden')
      }

      const ordenData = ordenResponse.data.orden
      const ticketsData = ordenResponse.data.tickets || []

      const orden: OrdenCompra = {
        id: ordenData.id,
        sorteoId: ordenData.sorteoId || null,
        cantidad: ordenData.cantidad,
        total: ordenData.total,
        precioUnitario: ordenData.precioUnitario || ordenData.total / ordenData.cantidad,
        currency: ordenData.currency || 'CLP',
        comprador: ordenData.comprador,
        tickets: ticketsData.map((t: any) => t.numero),
        estado: ordenData.estado as 'pendiente' | 'pagado' | 'expirado' | 'cancelado',
        createdAt: ordenData.createdAt,
        updatedAt: ordenData.updatedAt || ordenData.createdAt,
      }

      setOrden(orden)

      // Iniciar pago con Flow (Pendiente de implementar)
      /* 
      const pagoResponse = await pagosService.iniciarPagoFlow(orden.id)
      
      if (!pagoResponse.success || !pagoResponse.data) {
        // Handle error
      }
      
      if (pagoResponse.data.paymentUrl) {
         window.location.href = pagoResponse.data.paymentUrl
         return
      }
      */

      // Por ahora solo retornamos la orden creada para que el componente decida qué hacer
      return orden

    } catch (err) {
      // Extraer mensaje de error más específico
      let errorMessage = 'Error al procesar la compra'

      if (err instanceof Error) {
        errorMessage = err.message || errorMessage
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String((err as any).message) || errorMessage
      }

      setError(errorMessage)
      console.error('Error en comprar tickets:', {
        error: err,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setOrden(null)
    setLoading(false)
  }

  return {
    comprar,
    loading,
    error,
    orden,
    reset,
  }
}

// Hook de verificación eliminado temporalmente hasta implementar Flow
/*
export function useVerificarPago(paymentId: string | null) {
  // ...
}
*/

export function useMisTickets() {
  const [tickets, setTickets] = useState<TicketSorteo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarTickets = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await pagosService.obtenerMisTickets(email)

      if (response.success && response.data) {
        setTickets(response.data)
        return response.data
      } else {
        setError(response.error || 'Error al cargar los tickets')
        return []
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }

  const reenviarEmail = async (ordenId: string) => {
    try {
      const response = await pagosService.reenviarEmail(ordenId)
      return response.success
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return {
    tickets,
    loading,
    error,
    cargarTickets,
    reenviarEmail,
  }
}

export function useOrden(ordenId: string | null) {
  const [orden, setOrden] = useState<OrdenCompra | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarOrden = async () => {
    if (!ordenId) return

    setLoading(true)
    setError(null)

    try {
      const response = await pagosService.obtenerOrden(ordenId)

      if (response.success && response.data) {
        // Convertir OrdenCompraDetalle a OrdenCompra
        const ordenData: OrdenCompra = {
          ...response.data,
          tickets: response.data.tickets?.map(t => typeof t === 'string' ? t : t.numero) || [],
        }
        setOrden(ordenData)
        return ordenData
      } else {
        setError(response.error || 'Error al cargar la orden')
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

  return {
    orden,
    loading,
    error,
    cargarOrden,
  }
}

