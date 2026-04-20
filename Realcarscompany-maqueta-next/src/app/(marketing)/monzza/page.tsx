import { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import MonzzaPageClient from './MonzzaPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Promoción Comercial MONZZA',
  description: 'Compra la imagen digital MONZZA y entra a la promoción por la Moto MV Agusta TVF3 RC.',
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