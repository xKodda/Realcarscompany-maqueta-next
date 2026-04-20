import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function serializeAuto(auto: any) {
  return {
    id: auto.id,
    marca: auto.marca,
    modelo: auto.modelo,
    año: auto.anio,
    precio: auto.precio,
    kilometraje: auto.kilometraje,
    transmision: auto.transmision,
    combustible: auto.combustible,
    color: auto.color,
    imagen: auto.vehicleImages?.[0]?.imageUrl || '',
    imagenes: auto.vehicleImages ? auto.vehicleImages.map((img: any) => img.imageUrl) : [],
    vehicleImages: auto.vehicleImages || [],
    descripcion: auto.descripcion,
    caracteristicas: auto.caracteristicas,
    estado: auto.estado,
    destacado: auto.destacado,
    slug: auto.slug,
    createdAt: auto.createdAt,
    updatedAt: auto.updatedAt,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({
      success: true,
      data: [],
    })
  }

  try {
    const autos = await prisma.auto.findMany({
      where: {
        estado: 'disponible', // Solo mostrar vehículos disponibles
        OR: [
          { marca: { contains: query, mode: 'insensitive' } },
          { modelo: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } },
          { color: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: autos.map(serializeAuto),
    })
  } catch (error) {
    console.error('Autos search error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al buscar vehículos' },
      { status: 500 },
    )
  }
}


