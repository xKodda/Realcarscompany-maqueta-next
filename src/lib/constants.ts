// Constantes del proyecto RealCars Company - Automotora Premium

import type { NavigationItem } from './types'

export const SITE_NAME = 'RealCars Company'
export const SITE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://realcarscompany.cl'
export const ACTIVE_SORTEO_ID = 'MONZZA-01 - Ducati Monster' // Cambiar esto cuando inicie una nueva campaña

// Array inmutable para evitar problemas de hidratación
const navigationItemsData: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/autos' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Consignación', href: '/consignacion' },
  { label: 'Colección Monzza', href: '/monzza' },
  { label: 'Contacto', href: '/contacto' },
]

export const NAVIGATION_ITEMS: readonly NavigationItem[] = Object.freeze(navigationItemsData) as readonly NavigationItem[]

export const ADMIN_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Dashboard', href: '/admin' },
  // { label: 'CRM / Leads', href: '/admin/crm' },
  { label: 'Vehículos', href: '/admin/vehicles' },
  // { label: 'Ventas Monzza', href: '/admin/monzza' },
]

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/realcarscompanycl/',
  facebook: 'https://www.facebook.com/realcarscompany',
}

export const CONTACTO = {
  email: 'Realcarscompanyspa@gmail.com',
  telefono: '+56 9 6130 4115',
  whatsapp: '+56961304115',
  direccion: 'Santiago, Chile',
  horario: {
    lunesViernes: '9:00 - 17:00',
    sabado: 'Cerrado',
    domingo: 'Cerrado',
  },
}

// Lista de marcas disponibles para filtros
export const MARCAS_DISPONIBLES = [
  'BMW',
  'JEEP',
  'Land Rover',
  'Mercedes-Benz',
  'Toyota',
  'Audi',
  'Porsche',
  'Volvo',
  'Lexus',
  'Range Rover',
  'Ford',
  'Chevrolet',
  'Nissan',
  'Honda',
  'Mazda',
  'Hyundai',
  'Kia',
  'Volkswagen',
  'Peugeot',
  'Renault',
]