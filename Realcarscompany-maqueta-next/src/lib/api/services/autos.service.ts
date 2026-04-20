// Servicio de API para Autos
// Preparado para conectar con el backend futuro

import { apiClient, type ApiResponse } from '../client'
import type { Auto } from '@/lib/types'

export interface AutoFilters {
  marca?: string
  modelo?: string
  añoMin?: number
  añoMax?: number
  precioMin?: number
  precioMax?: number
  kilometrajeMax?: number
  transmision?: 'Manual' | 'Automática'
  combustible?: 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido'
  estado?: 'disponible' | 'vendido' | 'reservado'
  destacado?: boolean
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AutosResponse {
  autos: Auto[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class AutosService {
  private endpoint = '/autos'

  // Obtener todos los autos con filtros y paginación
  async getAll(
    filters?: AutoFilters,
    pagination?: PaginationParams
  ): Promise<ApiResponse<AutosResponse>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value))
        }
      })
    }

    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value))
        }
      })
    }

    return apiClient.get<AutosResponse>(
      `${this.endpoint}?${params.toString()}`
    )
  }

  // Obtener un auto por ID
  async getById(id: string): Promise<ApiResponse<Auto>> {
    return apiClient.get<Auto>(`${this.endpoint}/${id}`)
  }

  // Buscar autos
  async search(query: string): Promise<ApiResponse<Auto[]>> {
    const response = await apiClient.get<Auto[]>(
      `${this.endpoint}/search?q=${encodeURIComponent(query)}`,
    )

    if (response.success && response.data) {
      // El cliente API ahora maneja correctamente la estructura { success, data }
      // response.data debería ser directamente el array de autos
      return response
    }

    return {
      success: false,
      error: response.error || 'Error al buscar autos',
    }
  }

  // Obtener autos destacados
  async getFeatured(): Promise<ApiResponse<Auto[]>> {
    return apiClient.get<Auto[]>(`${this.endpoint}/featured`)
  }

  // Obtener autos similares
  async getSimilar(id: string, limit = 3): Promise<ApiResponse<Auto[]>> {
    return apiClient.get<Auto[]>(`${this.endpoint}/${id}/similar?limit=${limit}`)
  }

  // Crear un auto (admin)
  async create(data: Omit<Auto, 'id'>): Promise<ApiResponse<Auto>> {
    return apiClient.post<Auto>(this.endpoint, data)
  }

  // Actualizar un auto (admin)
  async update(id: string, data: Partial<Auto>): Promise<ApiResponse<Auto>> {
    return apiClient.put<Auto>(`${this.endpoint}/${id}`, data)
  }

  // Eliminar un auto (admin)
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  // Subir imágenes (admin)
  async uploadImages(
    id: string,
    images: File[]
  ): Promise<ApiResponse<{ urls: string[] }>> {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append('images', image)
    })

    return fetch(`${this.endpoint}/${id}/images`, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json())
  }
}

export const autosService = new AutosService()


