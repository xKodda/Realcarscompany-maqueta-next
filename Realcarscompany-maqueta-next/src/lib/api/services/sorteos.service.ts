// Servicio de API para Sorteos
// Preparado para conectar con el backend futuro

import { apiClient, type ApiResponse } from '../client'

export interface Sorteo {
  id: string
  titulo: string
  descripcion: string
  imagen: string
  premio: string
  fechaInicio: string
  fechaFin: string
  fechaSorteo: string // Fecha del sorteo en vivo
  estado: 'activo' | 'proximo' | 'finalizado'
  participantes?: number
  totalTickets: number // Total de tickets disponibles
  ticketsVendidos: number // Tickets ya vendidos
  precioTicket: number // Precio por ticket en CLP
  requisitos: string[]
  mecanica: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Participacion {
  id: string
  sorteoId: string
  nombre: string
  email: string
  telefono: string
  fecha: string
  estado: 'pendiente' | 'confirmado' | 'ganador'
}

export interface Ganador {
  id: string
  nombre: string
  ciudad: string
  premio: string
  sorteo: string
  fecha: string
  testimonio?: string
  imagen?: string
}

class SorteosService {
  private endpoint = '/sorteos'

  // Obtener todos los sorteos
  async getAll(): Promise<ApiResponse<Sorteo[]>> {
    return apiClient.get<Sorteo[]>(this.endpoint)
  }

  // Obtener sorteos activos
  async getActive(): Promise<ApiResponse<Sorteo[]>> {
    return apiClient.get<Sorteo[]>(`${this.endpoint}?estado=activo`)
  }

  // Obtener un sorteo por ID
  async getById(id: string): Promise<ApiResponse<Sorteo>> {
    return apiClient.get<Sorteo>(`${this.endpoint}/${id}`)
  }

  // Participar en un sorteo
  async participate(
    sorteoId: string,
    data: {
      nombre: string
      email: string
      telefono: string
      acepta_terminos: boolean
    }
  ): Promise<ApiResponse<Participacion>> {
    return apiClient.post<Participacion>(
      `${this.endpoint}/${sorteoId}/participar`,
      data
    )
  }

  // Obtener ganadores
  async getWinners(year?: number): Promise<ApiResponse<Ganador[]>> {
    const endpoint = year
      ? `/ganadores?year=${year}`
      : '/ganadores'
    return apiClient.get<Ganador[]>(endpoint)
  }

  // Crear sorteo (admin)
  async create(data: Omit<Sorteo, 'id'>): Promise<ApiResponse<Sorteo>> {
    return apiClient.post<Sorteo>(this.endpoint, data)
  }

  // Actualizar sorteo (admin)
  async update(id: string, data: Partial<Sorteo>): Promise<ApiResponse<Sorteo>> {
    return apiClient.put<Sorteo>(`${this.endpoint}/${id}`, data)
  }

  // Eliminar sorteo (admin)
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  // Seleccionar ganador (admin)
  async selectWinner(sorteoId: string): Promise<ApiResponse<Ganador>> {
    return apiClient.post<Ganador>(`${this.endpoint}/${sorteoId}/winner`)
  }

  // Obtener participantes de un sorteo (admin)
  async getParticipants(
    sorteoId: string
  ): Promise<ApiResponse<Participacion[]>> {
    return apiClient.get<Participacion[]>(
      `${this.endpoint}/${sorteoId}/participantes`
    )
  }
}

export const sorteosService = new SorteosService()

