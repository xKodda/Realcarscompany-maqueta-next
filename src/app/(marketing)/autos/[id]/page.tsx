import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import AutoDetailClient from './AutoDetailClient'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AutoPageProps {
  params: Promise<{
    id: string
  }>
}

async function getAuto(id: string) {
  try {
    const auto = await prisma.auto.findUnique({
      where: { id },
      include: {
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    })

    if (!auto) return null

    return {
      id: auto.id,
      slug: auto.slug,
      marca: auto.marca,
      modelo: auto.modelo,
      año: auto.anio,
      precio: auto.precio,
      kilometraje: auto.kilometraje,
      transmision: auto.transmision as 'Manual' | 'Automática',
      combustible: auto.combustible as 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido',
      litrosMotor: (auto.litrosMotor && auto.litrosMotor.trim() !== '') ? auto.litrosMotor : undefined,
      color: auto.color,
      imagen: auto.vehicleImages?.[0]?.imageUrl || '',
      vehicleImages: auto.vehicleImages,
      descripcion: auto.descripcion,
      caracteristicas: auto.caracteristicas,
      estado: auto.estado as 'disponible' | 'vendido' | 'reservado',
      destacado: auto.destacado,
      createdAt: auto.createdAt.toISOString(),
      updatedAt: auto.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching auto:', error)
    return null
  }
}

export async function generateMetadata({ params }: AutoPageProps): Promise<Metadata> {
  const { id } = await params
  const auto = await getAuto(id)

  if (!auto) {
    return {
      title: 'Vehículo no encontrado',
    }
  }

  const title = `${auto.marca} ${auto.modelo} ${auto.año} | RealCars Company`
  const description = `Compra este ${auto.marca} ${auto.modelo} ${auto.año} con ${auto.kilometraje.toLocaleString()} km. Precio: $${auto.precio.toLocaleString()}. ${auto.transmision}, ${auto.combustible}. Garantía y calidad premium.`
  const imageUrl = auto.vehicleImages?.[0]?.imageUrl || '/images/og-default.jpg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${auto.marca} ${auto.modelo}`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function AutoDetailPage({ params }: AutoPageProps) {
  const { id } = await params
  const auto = await getAuto(id)

  if (!auto) {
    notFound()
  }

  // Structured Data (JSON-LD) for Vehicle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${auto.marca} ${auto.modelo} ${auto.año}`,
    image: auto.vehicleImages?.map((img) => img.imageUrl) || [],
    description: auto.descripcion,
    brand: {
      '@type': 'Brand',
      name: auto.marca,
    },
    model: auto.modelo,
    vehicleConfiguration: `${auto.transmision} ${auto.combustible}`,
    productionDate: auto.año,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: auto.kilometraje,
      unitCode: 'KMT',
    },
    offers: {
      '@type': 'Offer',
      price: auto.precio,
      priceCurrency: 'CLP',
      availability: auto.estado === 'disponible' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'AutomotiveBusiness',
        name: 'RealCars Company',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AutoDetailClient auto={auto} />
    </>
  )
}
