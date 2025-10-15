// Servicio de Pagos con Khipu
// Integración con la pasarela de pagos chilena

import { apiClient, type ApiResponse } from '../client'

export interface KhipuPaymentData {
  subject: string // Título del pago (ej: "Tickets Sorteo Mercedes-Benz")
  amount: number // Monto en pesos chilenos
  currency: 'CLP' // Siempre CLP para Khipu
  notify_url?: string // URL de notificación (webhook)
  return_url?: string // URL de retorno después del pago
  cancel_url?: string // URL si cancela el pago
  transaction_id?: string // ID único de la transacción
  custom?: string // Datos personalizados (JSON stringificado)
  body?: string // Descripción detallada
  payer_email?: string // Email del pagador
  payer_name?: string // Nombre del pagador
  expires_date?: string // Fecha de expiración
}

export interface KhipuPaymentResponse {
  payment_id: string // ID del pago en Khipu
  payment_url: string // URL para redirigir al usuario
  simplified_transfer_url: string // URL simplificada
  transfer_url: string // URL de transferencia
  app_url: string // URL para app móvil
  ready_for_terminal: boolean
  notification_token: string
  receiver_id: string
  conciliation_date: string
  subject: string
  amount: number
  currency: string
  status: 'pending' | 'verified' | 'done' | 'expired'
  status_detail: string
}

export interface CompraTicketData {
  sorteoId: string
  cantidad: number // Cantidad de tickets
  comprador: {
    nombre: string
    email: string
    telefono: string
    rut?: string // RUT chileno (opcional)
  }
}

export interface OrdenCompra {
  id: string
  sorteoId: string
  cantidad: number
  total: number
  comprador: {
    nombre: string
    email: string
    telefono: string
    rut?: string
  }
  tickets: string[] // IDs de los tickets generados
  estado: 'pendiente' | 'pagado' | 'expirado' | 'cancelado'
  khipuPaymentId?: string
  khipuPaymentUrl?: string
  fechaCreacion: string
  fechaPago?: string
}

export interface TicketSorteo {
  id: string
  numero: string // Número del ticket (ej: "00001")
  sorteoId: string
  ordenId: string
  comprador: string
  estado: 'activo' | 'usado' | 'ganador'
  fechaCompra: string
}

class PagosService {
  private endpoint = '/pagos'

  /**
   * Crear orden de compra de tickets
   */
  async crearOrden(data: CompraTicketData): Promise<ApiResponse<OrdenCompra>> {
    return apiClient.post<OrdenCompra>(`${this.endpoint}/tickets/orden`, data)
  }

  /**
   * Iniciar pago con Khipu
   */
  async iniciarPagoKhipu(
    ordenId: string,
    returnUrl?: string,
    cancelUrl?: string
  ): Promise<ApiResponse<KhipuPaymentResponse>> {
    return apiClient.post<KhipuPaymentResponse>(
      `${this.endpoint}/khipu/iniciar`,
      {
        ordenId,
        returnUrl: returnUrl || `${window.location.origin}/sorteos/pago/exito`,
        cancelUrl: cancelUrl || `${window.location.origin}/sorteos/pago/cancelado`,
      }
    )
  }

  /**
   * Verificar estado del pago en Khipu
   */
  async verificarPago(
    paymentId: string
  ): Promise<ApiResponse<KhipuPaymentResponse>> {
    return apiClient.get<KhipuPaymentResponse>(
      `${this.endpoint}/khipu/verificar/${paymentId}`
    )
  }

  /**
   * Obtener orden por ID
   */
  async obtenerOrden(ordenId: string): Promise<ApiResponse<OrdenCompra>> {
    return apiClient.get<OrdenCompra>(`${this.endpoint}/tickets/orden/${ordenId}`)
  }

  /**
   * Obtener tickets del usuario por email
   */
  async obtenerMisTickets(
    email: string
  ): Promise<ApiResponse<TicketSorteo[]>> {
    return apiClient.get<TicketSorteo[]>(
      `${this.endpoint}/tickets/mis-tickets?email=${email}`
    )
  }

  /**
   * Verificar tickets por orden
   */
  async obtenerTicketsPorOrden(
    ordenId: string
  ): Promise<ApiResponse<TicketSorteo[]>> {
    return apiClient.get<TicketSorteo[]>(
      `${this.endpoint}/tickets/orden/${ordenId}/tickets`
    )
  }

  /**
   * Reenviar email con tickets
   */
  async reenviarEmail(ordenId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.endpoint}/tickets/reenviar-email`, {
      ordenId,
    })
  }

  /**
   * Webhook de Khipu (solo backend)
   * Este endpoint es llamado por Khipu cuando cambia el estado del pago
   */
  async webhookKhipu(notificationToken: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.endpoint}/khipu/webhook`, {
      notification_token: notificationToken,
    })
  }
}

export const pagosService = new PagosService()


