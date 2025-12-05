import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import AutosPageClient from './AutosPageClient'
import type { Auto } from '@/lib/types'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: Promise<{
    page?: string
    marca?: string
    modelo?: string
    precioMin?: string
    precioMax?: string
    añoMin?: string
    añoMax?: string
    transmision?: string
    combustible?: string
  }>
}

const ITEMS_PER_PAGE = 12

function serializeAuto(auto: any): Auto {
  return {
    id: auto.id,
    slug: auto.slug,
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
    imagenes: auto.imagenes || [],
    descripcion: auto.descripcion,
    caracteristicas: auto.caracteristicas || [],
    estado: auto.estado as 'disponible' | 'vendido' | 'reservado',
    destacado: auto.destacado || false,
    createdAt: auto.createdAt.toISOString(),
  }
}

async function getAutos(searchParams: any) {
  try {
    // Verificar que DATABASE_URL esté disponible
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured, returning empty autos')
      return {
        autos: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
      }
    }

    const page = parseInt(searchParams.page || '1', 10)
    const skip = (page - 1) * ITEMS_PER_PAGE

    // Construir filtros
    const where: any = {
      NOT: { estado: 'vendido' }, // mostrar disponibles y reservados
    }

    if (searchParams.marca) {
      where.marca = { contains: searchParams.marca, mode: 'insensitive' }
    }
    if (searchParams.modelo) {
      where.modelo = { contains: searchParams.modelo, mode: 'insensitive' }
    }
    if (searchParams.precioMin || searchParams.precioMax) {
      where.precio = {}
      if (searchParams.precioMin) {
        where.precio.gte = parseFloat(searchParams.precioMin)
      }
      if (searchParams.precioMax) {
        where.precio.lte = parseFloat(searchParams.precioMax)
      }
    }
    if (searchParams.añoMin || searchParams.añoMax) {
      where.anio = {}
      if (searchParams.añoMin) {
        where.anio.gte = parseInt(searchParams.añoMin, 10)
      }
      if (searchParams.añoMax) {
        where.anio.lte = parseInt(searchParams.añoMax, 10)
      }
    }
    if (searchParams.transmision) {
      where.transmision = searchParams.transmision
    }
    if (searchParams.combustible) {
      where.combustible = searchParams.combustible
    }

    // Obtener total y autos
    const [total, autos] = await Promise.all([
      prisma.auto.count({ where }),
      prisma.auto.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: ITEMS_PER_PAGE,
      }),
    ])

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    return {
      autos: autos.map(serializeAuto),
      total,
      currentPage: page,
      totalPages,
    }
  } catch (error) {
    console.error('Error fetching autos:', error)
    // En caso de error, retornar datos vacíos para que la página siga funcionando
    return {
      autos: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
    }
  }
}

export default async function AutosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { autos, total, currentPage, totalPages } = await getAutos(params)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AutosPageClient
        initialAutos={autos}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </Suspense>
  )
}
