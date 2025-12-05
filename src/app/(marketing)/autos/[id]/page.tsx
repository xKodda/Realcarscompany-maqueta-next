import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
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
    // Verificar que DATABASE_URL esté disponible
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured')
      return null
    }

    const auto = await prisma.auto.findUnique({
      where: { id },
      include: {
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    })

    if (!auto) {
      return null
    }

  // Transform to match Auto type
  const imageGallery = auto.vehicleImages.length > 0
    ? [auto.imagen, ...auto.vehicleImages.map(img => img.imageUrl)]
    : auto.imagenes.length > 0
    ? [auto.imagen, ...auto.imagenes]
    : [auto.imagen]

  return {
    id: auto.id,
    slug: auto.slug,
    marca: auto.marca,
    modelo: auto.modelo,
    año: auto.anio,
    precio: auto.precio,
    kilometraje: auto.kilometraje,
    transmision: auto.transmision as 'Manual' | 'Automática',
    combustible: auto.combustible as
      | 'Gasolina'
      | 'Diesel'
      | 'Eléctrico'
      | 'Híbrido',
    litrosMotor: (auto.litrosMotor && auto.litrosMotor.trim() !== '') ? auto.litrosMotor : undefined,
    color: auto.color,
    imagen: auto.imagen,
    imagenes: imageGallery,
    descripcion: auto.descripcion,
    caracteristicas: auto.caracteristicas,
    estado: auto.estado as 'disponible' | 'vendido' | 'reservado',
    destacado: auto.destacado,
    createdAt: auto.createdAt.toISOString(),
  }
  } catch (error) {
    console.error('Error fetching auto:', error)
    return null
  }
}

export default async function AutoDetailPage({ params }: AutoPageProps) {
  const { id } = await params
  const auto = await getAuto(id)

  if (!auto) {
    notFound()
  }

  return <AutoDetailClient auto={auto} />
}
