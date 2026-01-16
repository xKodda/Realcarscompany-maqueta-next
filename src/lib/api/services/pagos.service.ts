// Servicio de Pagos
// Integración con pasarelas de pago

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

export interface CrearOrdenResponse {
  orden: OrdenCompra
  tickets: TicketSorteo[]
}

export interface OrdenCompraDetalle extends Omit<OrdenCompra, 'tickets'> {
  tickets: TicketSorteo[]
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

  // Métodos para Flow (Placeholder si se requieren implementar aquí o en otro servicio)
}

export const pagosService = new PagosService()


