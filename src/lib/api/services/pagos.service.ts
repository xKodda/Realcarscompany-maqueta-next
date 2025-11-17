// Servicio de Pagos con Khipu
// Integración con la pasarela de pagos chilena

import { apiClient, type ApiResponse } from '../client'

export interface CompraTicketData {
  sorteoId: string
  cantidad: number // Cantidad de tickets
  precioTicket: number
  currency?: string
  sorteoTitulo?: string
  comprador: {
    nombre: string
    email: string
    telefono: string
    rut?: string // RUT chileno (opcional)
  }
}

export interface OrdenCompra {
  id: string
  sorteoId: string | null
  sorteoTitulo?: string | null
  cantidad: number
  total: number
  precioUnitario: number
  currency: string
  comprador: {
    nombre: string
    email: string
    telefono: string
    rut?: string
  }
  tickets?: string[]
  estado: 'pendiente' | 'pagado' | 'expirado' | 'cancelado'
  khipuPaymentUrl?: string
  khipuSimplifiedTransferUrl?: string
  khipuTransferUrl?: string
  khipuAppUrl?: string
  createdAt: string
  updatedAt: string
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

export interface PagoKhipuResumen {
  id: string
  transactionId: string
  khipuPaymentId?: string | null
  amount: number
  currency: string
  status: string
  statusDetail?: string | null
  receiverId?: string | null
  notificationToken?: string | null
  paymentUrl?: string | null
  simplifiedTransferUrl?: string | null
  transferUrl?: string | null
  appUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface CrearOrdenResponse {
  orden: OrdenCompra
  tickets: TicketSorteo[]
}

export interface OrdenCompraDetalle extends Omit<OrdenCompra, 'tickets'> {
  tickets: TicketSorteo[]
  pagos: PagoKhipuResumen[]
}

class PagosService {
  private endpoint = '/pagos'

  /**
   * Crear orden de compra de tickets
   */
  async crearOrden(data: CompraTicketData): Promise<ApiResponse<CrearOrdenResponse>> {
    return apiClient.post<CrearOrdenResponse>(`${this.endpoint}/tickets/orden`, data)
  }

  /**
   * Iniciar pago con Khipu
   */
  async iniciarPagoKhipu(
    ordenId: string,
    returnUrl?: string,
    cancelUrl?: string
  ): Promise<ApiResponse<any>> {
    return apiClient.post(
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
  ): Promise<ApiResponse<any>> {
    return apiClient.get(
      `${this.endpoint}/khipu/verificar/${paymentId}`
    )
  }

  /**
   * Obtener orden por ID
   */
  async obtenerOrden(ordenId: string): Promise<ApiResponse<OrdenCompraDetalle>> {
    return apiClient.get<OrdenCompraDetalle>(`${this.endpoint}/tickets/orden/${ordenId}`)
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


