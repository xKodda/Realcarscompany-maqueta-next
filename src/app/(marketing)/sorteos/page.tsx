import { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import SorteosPageClient from './SorteosPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Sorteos Premium - Monzza',
  description: 'Participa en nuestros sorteos exclusivos y gana increíbles premios. Sorteos transparentes con notario público. Compra tus tickets de forma segura.',
  keywords: [
    'sorteos chile',
    'sorteos de autos',
    'sorteos de motos',
    'monzza sorteos',
    'sorteos premium',
    'sorteos transparentes',
    'comprar tickets sorteo',
    'sorteos en vivo',
  ],
  alternates: {
    canonical: '/sorteos',
  },
  openGraph: {
    title: 'Sorteos Premium - Monzza | RealCars Company',
    description: 'Participa en nuestros sorteos exclusivos y gana increíbles premios. Sorteos transparentes con notario público.',
    url: `${SITE_URL}/sorteos`,
    siteName: 'RealCars Company',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/brand/moto2.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Sorteos Premium Monzza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sorteos Premium - Monzza',
    description: 'Participa en nuestros sorteos exclusivos y gana increíbles premios.',
    images: [`${SITE_URL}/images/brand/moto1.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function SorteosPage() {
  return <SorteosPageClient />
}