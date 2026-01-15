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
    // Map vehicleImages to simple array of strings for compatibility if needed, 
    // or just pass the objects. The frontend likely expects 'imagenes' as strings based on legacy code,
    // but the new admin form sends 'vehicleImages'.
    // Let's provide both for maximum compatibility.
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
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const auto = await prisma.auto.findUnique({
      where: { id },
      include: {
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    })

    if (!auto) {
      return NextResponse.json(
        { success: false, error: 'Vehículo no encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: serializeAuto(auto),
    })
  } catch (error) {
    console.error('Auto GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener el vehículo' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()

    // First update the scalar fields
    const auto = await prisma.auto.update({
      where: { id },
      data: {
        marca: body.marca,
        modelo: body.modelo,
        anio: typeof body.año === 'number' ? body.año : undefined,
        precio: typeof body.precio === 'number' ? body.precio : undefined,
        kilometraje:
          typeof body.kilometraje === 'number' ? body.kilometraje : undefined,
        transmision: body.transmision,
        combustible: body.combustible,
        color: body.color,

        descripcion: body.descripcion,
        caracteristicas: Array.isArray(body.caracteristicas)
          ? body.caracteristicas
          : undefined,
        estado: body.estado,
        destacado: typeof body.destacado === 'boolean' ? body.destacado : undefined,
      },
    })

    // Handle images if provided
    if (Array.isArray(body.imagenes)) {
      // 1. Delete existing images
      await prisma.vehicleImage.deleteMany({
        where: { vehicleId: id },
      })

      // 2. Create new images
      if (body.imagenes.length > 0) {
        await prisma.vehicleImage.createMany({
          data: body.imagenes.map((url: string, index: number) => ({
            vehicleId: id,
            imageUrl: url,
            position: index,
          })),
        })
      }
    }

    // Fetch updated auto with images
    const updatedAuto = await prisma.auto.findUnique({
      where: { id },
      include: {
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: serializeAuto(updatedAuto),
    })
  } catch (error) {
    console.error('Auto PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el vehículo' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // Images will be deleted by cascade usually, but explicit delete is safer if cascade isn't set up
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: id },
    })

    await prisma.auto.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Vehículo eliminado correctamente',
    })
  } catch (error) {
    console.error('Auto DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar el vehículo' },
      { status: 500 },
    )
  }
}


