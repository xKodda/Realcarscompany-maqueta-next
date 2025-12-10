import type { Metadata } from 'next'
import FeaturedAutosSection from '@/components/FeaturedAutosSection'
import HeroSliderWrapper from '@/components/HeroSliderWrapper'
import SafePurchaseSection from '@/components/SafePurchaseSection'
import WhyChooseUsSection from '@/components/WhyChooseUsSection'
import FinalCTASection from '@/components/FinalCTASection'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/constants'
import type { Auto } from '@/lib/types'

// Forzar renderizado dinámico para evitar errores durante el build
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'RealCars Company - Automotora premium especializada en vehículos de lujo en Chile. Descubre nuestra colección de autos premium, servicios de consignación y sorteos exclusivos. Últimos vehículos agregados al inventario.',
  keywords: [
    'automotora lujo chile',
    'autos premium santiago',
    'vehículos de lujo',
    'automotora premium',
    'concesionario autos lujo',
    'venta autos premium',
    'autos de segunda mano premium',
    'vehículos exclusivos chile',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RealCars Company - Automotora Premium de Lujo',
    description: 'Descubre nuestra exclusiva colección de vehículos de lujo y servicios premium. Últimos vehículos agregados a nuestro inventario.',
    url: `${SITE_URL}/`,
    siteName: 'RealCars Company',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/brand/realcarscompanylogo.png`,
        width: 1200,
        height: 630,
        alt: 'RealCars Company - Automotora Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealCars Company - Automotora Premium de Lujo',
    description: 'Descubre nuestra exclusiva colección de vehículos de lujo. Últimos vehículos agregados.',
    images: [`${SITE_URL}/images/brand/realcarscompanylogo.png`],
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

function serializeAuto(auto: any): Auto {
  return {
    id: auto.id,
    marca: auto.marca,
    modelo: auto.modelo,
    año: auto.anio,
    precio: Number(auto.precio),
    kilometraje: auto.kilometraje,
    transmision: auto.transmision as 'Manual' | 'Automática',
    combustible: auto.combustible as 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido',
    litrosMotor: auto.litrosMotor || undefined,
    color: auto.color,
    imagen: auto.imagen,
    vehicleImages: auto.vehicleImages,
    descripcion: auto.descripcion,
    caracteristicas: auto.caracteristicas || [],
    estado: auto.estado as 'disponible' | 'vendido' | 'reservado',
    destacado: auto.destacado || false,
    slug: auto.slug,
    createdAt: auto.createdAt?.toISOString(),
  }
}

async function getLatestAutos() {
  try {
    // Obtener los últimos 4 vehículos agregados a la base de datos
    const autos = await prisma.auto.findMany({
      where: {
        estado: 'disponible',
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: {
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    })

    return autos.map(serializeAuto)
  } catch (error) {
    console.error('Error fetching latest autos:', error)
    return null
  }
}

export default async function Home() {
  // Obtener los últimos 4 vehículos agregados desde la base de datos
  const ultimosAutos = await getLatestAutos()

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <HeroSliderWrapper />

      {/* Últimos Vehículos Agregados */}
      <FeaturedAutosSection autos={ultimosAutos} />

      {/* Compra tu auto de manera segura */}
      <SafePurchaseSection />

      {/* Por qué elegirnos */}
      <WhyChooseUsSection />

      {/* CTA Final */}
      <FinalCTASection />
    </div>
  )
}
