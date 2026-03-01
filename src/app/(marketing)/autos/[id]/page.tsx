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

import Breadcrumbs from '@/components/Breadcrumbs'

export async function generateMetadata({ params }: AutoPageProps): Promise<Metadata> {
  const { id } = await params
  const auto = await getAuto(id)

  if (!auto) {
    return {
      title: 'Vehículo no encontrado',
    }
  }

  const title = `${auto.marca} ${auto.modelo} ${auto.año} - Venta Autos de Lujo Chile`
  const description = `Descubre este espectacular ${auto.marca} ${auto.modelo} ${auto.año} con ${auto.kilometraje.toLocaleString()} km. Disponible en RealCars Company, automotora de lujo en Santiago. Precio: $${auto.precio.toLocaleString()}. ${auto.transmision}, ${auto.combustible}.`
  const imageUrl = auto.vehicleImages?.[0]?.imageUrl || '/images/og-default.jpg'
  const canonicalUrl = `https://realcarscompany.cl/autos/${auto.id}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${auto.marca} ${auto.modelo} en RealCars Company`,
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

  // Structured Data (JSON-LD) for Vehicle - Extended version
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
    vehicleTransmission: auto.transmision,
    fuelType: auto.combustible,
    color: auto.color,
    offers: {
      '@type': 'Offer',
      price: auto.precio,
      priceCurrency: 'CLP',
      url: `https://realcarscompany.cl/autos/${auto.id}`,
      availability: auto.estado === 'disponible' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      itemCondition: 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'AutoDealer',
        name: 'RealCars Company',
        url: 'https://realcarscompany.cl'
      },
    },
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/autos' },
    { label: `${auto.marca} ${auto.modelo}`, href: `/autos/${auto.id}`, active: true }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <AutoDetailClient auto={auto} />
    </div>
  )
}

