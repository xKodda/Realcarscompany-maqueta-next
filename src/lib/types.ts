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
  color: string
  imagen: string
  imagenes?: string[]
  descripcion: string
  caracteristicas: string[]
  estado: 'disponible' | 'vendido' | 'reservado'
  destacado?: boolean
}

export interface ContactoForm {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}

export interface Consulta {
  id: string
  autoId?: string
  nombre: string
  email: string
  telefono: string
  mensaje: string
  fecha: string
  estado: 'pendiente' | 'respondido' | 'cerrado'
}
