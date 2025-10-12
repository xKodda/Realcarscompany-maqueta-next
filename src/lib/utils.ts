import { clsx, type ClassValue } from 'clsx'

// Función para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Formatear precios en pesos chilenos
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price)
}

// Formatear fechas
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}



