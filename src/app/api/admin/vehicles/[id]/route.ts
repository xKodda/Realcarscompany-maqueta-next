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

        descripcion: body.descripcion,
        caracteristicas: Array.isArray(body.caracteristicas)
          ? body.caracteristicas
          : [],
        estado: body.estado || 'disponible',
        destacado: Boolean(body.destacado),

        updatedAt: new Date(),
      },
    })

    // Delete existing images and create new ones
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: vehicle.id },
    })

    console.log('Imágenes recibidas:', {
      cantidad: body.imagenes?.length || 0,
      urls: body.imagenes
    })

    // Create vehicle images
    // Combine main image (body.imagen) and gallery (body.imagenes)
    let allImages: string[] = []
    if (body.imagen) allImages.push(body.imagen)
    if (Array.isArray(body.imagenes)) allImages.push(...body.imagenes)

    // Remove duplicates
    allImages = [...new Set(allImages)].filter(url => url && url.trim())

    if (allImages.length > 0) {
      await prisma.vehicleImage.createMany({
        data: allImages.map((url: string, index: number) => ({
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

    // Obtener las imágenes antes de eliminar los registros
    const images = await prisma.vehicleImage.findMany({
      where: { vehicleId: id },
    })

    // Extraer los paths de las URLs para eliminar de Supabase
    // URL ejemplo: https://jrj...supabase.co/storage/v1/object/public/VehiclesImage/file.jpg
    const imagePaths = images.map(img => {
      const parts = img.imageUrl.split('/VehiclesImage/')
      return parts.length > 1 ? parts[1] : null
    }).filter(path => path !== null) as string[]

    // También verificar si el campo antiguo 'imagen' tiene algo y agregarlo si es de supabase
    if (vehicle.imagen && vehicle.imagen.includes('/VehiclesImage/')) {
      const parts = vehicle.imagen.split('/VehiclesImage/')
      if (parts.length > 1) {
        imagePaths.push(parts[1])
      }
    }

    // Eliminar de Supabase Storage
    if (imagePaths.length > 0) {
      const { supabaseAdmin } = await import('@/lib/supabase')
      const storageClient = supabaseAdmin || (await import('@/lib/supabase')).supabase

      const { error: storageError } = await storageClient.storage
        .from('VehiclesImage')
        .remove(imagePaths)

      if (storageError) {
        console.error('Error removing images from storage:', storageError)
        // No detenemos el proceso, pero logueamos el error
      } else {
        console.log(`Eliminadas ${imagePaths.length} imágenes del storage.`)
      }
    }

    // Eliminar imágenes relacionadas de la BD
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: id },
    })

    // Delete vehicle
    await prisma.auto.delete({
      where: { id },
    })

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
