import { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import MonzzaPageClient from './MonzzaPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Colección Digital Monzza',
  description: 'Adquiere tu Imagen Digital Coleccionable oficial de la Colección Monzza. Participa en promociones exclusivas y sé parte del club RealCars.',
  keywords: [
    'monzza',
    'coleccionables digitales',
    'arte digital autos',
    'realcars monzza',
    'imágenes exclusivas',
  ],
  alternates: {
    canonical: '/monzza',
  },
}

export default function MonzzaPage() {
  return <MonzzaPageClient />
}