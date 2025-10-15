// Exportación centralizada de todos los servicios

export * from './autos.service'
export * from './consultas.service'
export * from './sorteos.service'
export * from './pagos.service'

// Re-exportar el cliente para acceso directo si es necesario
export { apiClient, handleApiError } from '../client'
export type { ApiResponse, ApiError } from '../client'

