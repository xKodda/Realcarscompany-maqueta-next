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
    imagen: auto.imagen,
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const url = new URL(request.url)
  const limitParam = url.searchParams.get('limit')
  const limit = Math.min(Number(limitParam) || 3, 12)

  try {
    const { id } = await params
    const current = await prisma.auto.findUnique({
      where: { id },
    })

    if (!current) {
      return NextResponse.json(
        { success: false, error: 'Vehículo no encontrado' },
        { status: 404 },
      )
    }

    const similares = await prisma.auto.findMany({
      where: {
        id: { not: id },
        estado: 'disponible', // Solo mostrar vehículos disponibles
        OR: [
          { marca: current.marca },
          { combustible: current.combustible },
          {
            precio: {
              gte: current.precio * 0.8,
              lte: current.precio * 1.2,
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: similares.map(serializeAuto),
    })
  } catch (error) {
    console.error('Autos similares error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener vehículos similares' },
      { status: 500 },
    )
  }
}


