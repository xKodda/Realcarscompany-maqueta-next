// Servicio de API para Consultas y Contacto
// Preparado para conectar con el backend futuro

import { apiClient, type ApiResponse } from '../client'
import type { Consulta, ContactoForm } from '@/lib/types'

export interface CreateConsultaData {
  autoId?: string
  nombre: string
  email: string
  telefono: string
  mensaje: string
  tipo?: 'general' | 'auto' | 'showroom' | 'sorteo'
}

export interface ConsultasResponse {
  consultas: Consulta[]
  total: number
  page: number
  limit: number
}

class ConsultasService {
  private endpoint = '/consultas'

  // Crear una consulta
  async create(data: CreateConsultaData): Promise<ApiResponse<Consulta>> {
    return apiClient.post<Consulta>(this.endpoint, {
      ...data,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
    })
  }

  // Obtener todas las consultas (admin)
  async getAll(page = 1, limit = 10): Promise<ApiResponse<ConsultasResponse>> {
    return apiClient.get<ConsultasResponse>(
      `${this.endpoint}?page=${page}&limit=${limit}`
    )
  }

  // Obtener una consulta por ID (admin)
  async getById(id: string): Promise<ApiResponse<Consulta>> {
    return apiClient.get<Consulta>(`${this.endpoint}/${id}`)
  }

  // Actualizar estado de consulta (admin)
  async updateStatus(
    id: string,
    estado: 'pendiente' | 'respondido' | 'cerrado'
  ): Promise<ApiResponse<Consulta>> {
    return apiClient.patch<Consulta>(`${this.endpoint}/${id}/status`, { estado })
  }

  // Responder consulta (admin)
  async respond(
    id: string,
    respuesta: string
  ): Promise<ApiResponse<Consulta>> {
    return apiClient.post<Consulta>(`${this.endpoint}/${id}/respond`, {
      respuesta,
    })
  }

  // Eliminar consulta (admin)
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  // Enviar email de contacto directo
  async sendContactEmail(data: ContactoForm): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/contact/email', data)
  }

  // Notificar por WhatsApp
  async notifyWhatsApp(
    phoneNumber: string,
    message: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/contact/whatsapp', {
      phoneNumber,
      message,
    })
  }
}

export const consultasService = new ConsultasService()


