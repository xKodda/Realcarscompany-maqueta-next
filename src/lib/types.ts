// Tipos principales del proyecto RealCars Company - Automotora

export interface Auto {
  id: string
  marca: string
  modelo: string
  año: number
  precio: number
  kilometraje: number
  transmision: 'Manual' | 'Automática'
  combustible: 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido'
  litrosMotor?: string
  color: string
  imagen: string
  vehicleImages?: { id: number; imageUrl: string; position: number }[]
  descripcion: string
  caracteristicas: string[]
  estado: 'disponible' | 'vendido' | 'reservado'
  destacado?: boolean
  slug?: string
  createdAt?: string
  updatedAt?: string
}

export interface Consulta {
  id: string
  nombre: string
  email: string
  telefono: string
  mensaje: string
  autoId?: string
  createdAt: string
}

export interface ContactoForm {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}

export interface NavigationItem {
  label: string
  href: string
  comingSoon?: boolean
}
