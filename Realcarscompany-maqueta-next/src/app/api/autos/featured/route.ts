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

export async function GET() {
  try {
    const autos = await prisma.auto.findMany({
      where: {
        destacado: true,
        estado: 'disponible', // Solo mostrar vehículos disponibles
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
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
    console.error('Autos featured error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener los vehículos destacados' },
      { status: 500 },
    )
  }
}


