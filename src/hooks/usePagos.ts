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
      // MODO DEMO: Simular respuesta para presentación
      console.log('🎯 MODO DEMO - Datos de compra:', data)
      console.log('💰 Total a pagar:', data.cantidad * 3000) // Precio de ejemplo
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Crear orden simulada
      const ordenSimulada: OrdenCompra = {
        id: `demo-orden-${Date.now()}`,
        sorteoId: data.sorteoId,
        cantidad: data.cantidad,
        total: data.cantidad * 3000,
        comprador: data.comprador,
        tickets: Array.from({ length: data.cantidad }, (_, i) => `ticket-${Date.now()}-${i + 1}`),
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString(),
      }

      setOrden(ordenSimulada)
      
      alert(`
🎯 MODO DEMO - Compra Simulada

✅ Datos recibidos correctamente:
• Sorteo: ${data.sorteoId}
• Cantidad: ${data.cantidad} tickets
• Comprador: ${data.comprador.nombre}
• Email: ${data.comprador.email}
• Total: $${(data.cantidad * 3000).toLocaleString('es-CL')} CLP

📱 Para presentación:
• El sistema está listo para integración con pasarelas de pago
• Todos los formularios y validaciones funcionan correctamente
• La UI está optimizada para móviles
• El backend puede implementarse fácilmente

📝 Los datos se muestran en la consola del navegador.
      `)
      
      return {
        orden: ordenSimulada,
        pago: null,
      }
    } catch (err) {
      setError('Error al procesar la compra')
      console.error(err)
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

export function useVerificarPago(paymentId: string | null) {
  const [verificando, setVerificando] = useState(false)
  const [estado, setEstado] = useState<
    'pending' | 'verified' | 'done' | 'expired' | null
  >(null)
  const [error, setError] = useState<string | null>(null)

  const verificar = async () => {
    if (!paymentId) return

    setVerificando(true)
    setError(null)

    try {
      const response = await pagosService.verificarPago(paymentId)

      if (response.success && response.data) {
        setEstado(response.data.status)
        return response.data
      } else {
        setError(response.error || 'Error al verificar el pago')
        return null
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
      return null
    } finally {
      setVerificando(false)
    }
  }

  return {
    verificar,
    verificando,
    estado,
    error,
  }
}

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
        setOrden(response.data)
        return response.data
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

