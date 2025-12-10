import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const body = await request.json()

    // Check if vehicle exists
    const existing = await prisma.auto.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }

    // Update vehicle
    const vehicle = await prisma.auto.update({
      where: { id },
      data: {
        marca: body.marca,
        modelo: body.modelo,
        anio: parseInt(body.anio),
        precio: parseInt(body.precio),
        kilometraje: parseInt(body.kilometraje),
        transmision: body.transmision,
        combustible: body.combustible,
        litrosMotor: (body.litrosMotor && body.litrosMotor.trim() !== '') ? body.litrosMotor.trim() : null,
        color: body.color,
        imagen: body.imagen,
        descripcion: body.descripcion,
        caracteristicas: Array.isArray(body.caracteristicas)
          ? body.caracteristicas
          : [],
        estado: body.estado || 'disponible',
        destacado: Boolean(body.destacado),
        // Extended fields
        title: body.title || `${body.marca} ${body.modelo}`,
        brand: body.brand || body.marca,
        model: body.model || body.modelo,
        year: parseInt(body.anio),
        price: new Prisma.Decimal(body.precio),
        currency: body.currency || 'CLP',
        mileageKm: parseInt(body.kilometraje),
        fuelType: body.fuelType || body.combustible,
        transmission: body.transmission || body.transmision,
        bodyType: body.bodyType || null,
        engine: body.litrosMotor || body.engine || null,
        traction: body.traction || null,
        locationCity: body.locationCity || null,
        condition: body.condition || null,
        status: body.status || 'available',
        mainImageUrl: body.imagen,
        shortDescription: body.shortDescription || null,
        isFeatured: Boolean(body.destacado),
        updatedAt: new Date(),
      },
    })

    // Delete existing images and create new ones
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: vehicle.id },
    })

    if (Array.isArray(body.imagenes) && body.imagenes.length > 0) {
      await prisma.vehicleImage.createMany({
        data: body.imagenes
          .filter((url: string) => url && url.trim())
          .map((url: string, index: number) => ({
            vehicleId: vehicle.id,
            imageUrl: url,
            position: index,
          })),
      })
    }

    return NextResponse.json({ success: true, data: vehicle })
  } catch (error) {
    console.error('Update vehicle error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el vehículo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params

    // Verificar que el vehículo existe antes de intentar eliminarlo
    const vehicle = await prisma.auto.findUnique({
      where: { id },
    })

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar imágenes relacionadas primero (si hay cascade, esto no es necesario, pero es más seguro)
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: id },
    })

    // Delete vehicle
    await prisma.auto.delete({
      where: { id },
    })

    console.log(`Vehículo ${id} eliminado exitosamente`)

    return NextResponse.json({
      success: true,
      message: 'Vehículo eliminado exitosamente'
    })
  } catch (error) {
    console.error('Delete vehicle error:', error)

    // Proporcionar más información sobre el error
    let errorMessage = 'Error al eliminar el vehículo'
    if (error instanceof Error) {
      errorMessage = error.message
      // Si es un error de Prisma, dar más detalles
      if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'No se puede eliminar el vehículo porque tiene relaciones con otros registros'
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

