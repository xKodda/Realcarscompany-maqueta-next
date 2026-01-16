import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { Prisma } from '@prisma/client'

function toSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'marca',
      'modelo',
      'anio',
      'precio',
      'kilometraje',
      'transmision',
      'combustible',
      'color',

      'descripcion',
    ]

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `El campo ${field} es obligatorio` },
          { status: 400 }
        )
      }
    }

    // Generate slug
    const slugBase = `${body.marca}-${body.modelo}-${body.anio}`
    let slug = toSlug(slugBase)
    let suffix = 1
    while (await prisma.auto.findUnique({ where: { slug } })) {
      slug = `${toSlug(slugBase)}-${suffix}`
      suffix += 1
    }

    // Create vehicle
    const vehicle = await prisma.auto.create({
      data: {
        slug,
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

        createdById: user.id,
      },
    })

    // Create vehicle images
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
  } catch (error: any) {
    console.error('SERVER ERROR - Create vehicle:', {
      message: error.message,
      stack: error.stack,
      error
    })
    return NextResponse.json(
      { error: `[DATABASE_SAVE_ERROR] Error al crear el vehículo: ${error.message || 'Error interno'}` },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth()
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      )
    }

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

