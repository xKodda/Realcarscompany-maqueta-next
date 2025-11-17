// Cliente API para RealCars Company
// Este archivo prepara la estructura para el backend futuro

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: unknown
}

class ApiClient {
  private baseURL: string
  private requestQueue: Map<string, Promise<ApiResponse<any>>> = new Map()

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  // Generar token CSRF básico
  private generateCSRFToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Headers de seguridad
  private getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-CSRF-Token': this.generateCSRFToken(),
    }
  }

  // Validar URL para prevenir ataques
  private validateUrl(url: string): boolean {
    try {
      // Permitir URLs relativas (común en Next.js)
      if (url.startsWith('/')) {
        // Validar que no contenga caracteres peligrosos
        if (url.includes('javascript:') || url.includes('data:') || url.includes('<') || url.includes('>')) {
          return false
        }
        return true
      }

      // Para URLs absolutas, validar protocolo
      const urlObj = new URL(url)
      // Solo permitir HTTPS en producción
      if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
        return false
      }
      return ['http:', 'https:'].includes(urlObj.protocol)
    } catch {
      // Si no es una URL válida ni relativa, rechazar
      return false
    }
  }

  // Rate limiting básico
  private async checkRateLimit(endpoint: string): Promise<boolean> {
    const key = `api_rate_limit_${endpoint}`
    const now = Date.now()
    const windowMs = 60000 // 1 minuto
    const maxRequests = 10

    try {
      const stored = localStorage.getItem(key)
      if (!stored) {
        localStorage.setItem(key, JSON.stringify([now]))
        return true
      }

      const timestamps: number[] = JSON.parse(stored)
      const validTimestamps = timestamps.filter(
        (timestamp) => now - timestamp < windowMs
      )

      if (validTimestamps.length >= maxRequests) {
        return false
      }

      validTimestamps.push(now)
      localStorage.setItem(key, JSON.stringify(validTimestamps))
      return true
    } catch {
      return true
    }
  }

  // Timeout para requests
  private async requestWithTimeout<T>(
    url: string,
    options: RequestInit,
    timeoutMs: number = 10000
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Validar endpoint
      if (!endpoint || typeof endpoint !== 'string') {
        throw new Error('Endpoint inválido')
      }

      // Sanitizar endpoint
      const sanitizedEndpoint = endpoint.replace(/[<>]/g, '').replace(/javascript:/gi, '')
      
      // Verificar rate limiting
      if (!(await this.checkRateLimit(sanitizedEndpoint))) {
        throw new Error('Demasiadas peticiones. Intenta nuevamente en un momento.')
      }

      // Verificar si ya hay una petición en curso para el mismo endpoint
      const requestKey = `${options.method || 'GET'}_${sanitizedEndpoint}`
      if (this.requestQueue.has(requestKey)) {
        return await this.requestQueue.get(requestKey)!
      }

      const url = `${this.baseURL}${sanitizedEndpoint}`
      
      // Validar URL
      if (!this.validateUrl(url)) {
        throw new Error('URL no válida')
      }

      const headers = {
        'Content-Type': 'application/json',
        ...this.getSecurityHeaders(),
        ...options.headers,
      }

      // Crear promesa de request
      const requestPromise = this.requestWithTimeout(url, {
        ...options,
        headers,
      }).then(async (response) => {
        // Limpiar de la cola
        this.requestQueue.delete(requestKey)

        let data: any
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            data = await response.json()
          } else {
            data = await response.text()
          }
        } catch (parseError) {
          throw new Error('Error al procesar la respuesta del servidor')
        }

        if (!response.ok) {
          throw {
            message: data.message || data.error || `Error ${response.status}: ${response.statusText}`,
            status: response.status,
            details: data,
          }
        }

        // Si la respuesta ya tiene la estructura { success, data }, extraer el data correctamente
        if (data && typeof data === 'object' && 'success' in data) {
          const apiResponse = data as { success: boolean; data?: any; error?: string }
          // Si success es true y hay data, devolver la estructura correcta
          if (apiResponse.success && apiResponse.data !== undefined) {
            return {
              success: true,
              data: apiResponse.data as T,
            }
          }
          // Si success es false, devolver el error
          return {
            success: false,
            error: apiResponse.error || 'Error en la respuesta del servidor',
          }
        }

        // Si no tiene la estructura, envolverla en la estructura estándar
        return {
          success: true,
          data: data as T,
        }
      }).catch((error) => {
        // Limpiar de la cola en caso de error
        this.requestQueue.delete(requestKey)
        throw error
      })

      // Agregar a la cola
      this.requestQueue.set(requestKey, requestPromise)

      return await requestPromise

    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      
      // Determinar tipo de error
      let errorMessage = 'Error desconocido'
      if (error instanceof Error) {
        if (error.message === 'Request timeout') {
          errorMessage = 'La petición tardó demasiado tiempo. Verifica tu conexión.'
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu internet.'
        } else {
          errorMessage = error.message
        }
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as ApiError).message
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  // GET
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  // POST
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // PATCH
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // DELETE
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()

// Helper para manejar errores
export function handleApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message
  }
  return 'Ha ocurrido un error. Por favor, intenta nuevamente.'
}


