import { NextResponse } from 'next/server'
import type { Auto } from '@prisma/client'
import { prisma } from '@/lib/prisma'

function serializeAuto(auto: Auto) {
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
    imagenes: auto.imagenes,
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
        imagen: body.imagen,
        imagenes: Array.isArray(body.imagenes) ? body.imagenes : undefined,
        descripcion: body.descripcion,
        caracteristicas: Array.isArray(body.caracteristicas)
          ? body.caracteristicas
          : undefined,
        estado: body.estado,
        destacado: typeof body.destacado === 'boolean' ? body.destacado : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      data: serializeAuto(auto),
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


