// Constantes del proyecto RealCars Company - Automotora Premium

import type { NavigationItem } from './types'

export const SITE_NAME = 'RealCars Company'
export const SITE_URL = 'https://realcarscompany.cl'

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/autos' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Monzza', href: '/sorteos' },
  { label: 'Showroom', href: '/showroom' },
  { label: 'Contacto', href: '/contacto' },
]

export const ADMIN_NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Vehículos', href: '/admin/vehicles' },
  { label: 'Sorteos', href: '/admin/sorteos', comingSoon: true },
  { label: 'Usuarios', href: '/admin/usuarios', comingSoon: true },
]

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/realcarscompanycl/',
  facebook: 'https://www.facebook.com/realcarscompany',
}

export const CONTACTO = {
  email: 'contacto@realcarscompany.cl',
  telefono: '+56 9 8777 5463',
  whatsapp: '+56987775463',
  direccion: 'Santiago, Chile',
  horario: {
    lunesViernes: '9:00 - 17:00',
    sabado: 'Cerrado',
    domingo: 'Cerrado',
  },
}

export const SHOWROOM_INFO = {
  titulo: 'Showroom Premium',
  descripcion: 'Espacio exclusivo disponible para arriendo dentro de nuestras instalaciones',
  ubicacion: 'Santiago, Chile',
  espacioDisponible: '70 m²',
  caracteristicas: [
    'Ubicación estratégica de alto tráfico',
    'Iluminación profesional LED',
    'Sistema de seguridad 24/7',
    'Estacionamiento exclusivo',
    'Área de exhibición premium',
    'Oficina privada equipada',
    'Baño privado',
    'Acceso independiente',
  ],
  serviciosIncluidos: [
    'Internet de alta velocidad',
    'Sistema de climatización',
    'Servicio de limpieza',
    'Mantenimiento incluido',
  ],
}