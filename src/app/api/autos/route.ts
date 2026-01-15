import { NextResponse } from 'next/server'
import { Prisma, type Auto } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const DEFAULT_LIMIT = 12
const MAX_LIMIT = 60

function toBoolean(value: string | null): boolean | undefined {
  if (value === null) return undefined
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function toNumber(value: string | null): number | undefined {
  if (value === null) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

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
    vehicleImages: auto.vehicleImages,
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
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const page = Math.max(1, toNumber(searchParams.get('page')) ?? 1)
  const limitParam = toNumber(searchParams.get('limit')) ?? DEFAULT_LIMIT
  const limit = Math.min(Math.max(limitParam, 1), MAX_LIMIT)
  const skip = (page - 1) * limit

  const filters: Prisma.AutoWhereInput = {}

  const search = searchParams.get('search')
  const marca = searchParams.get('marca')
  const modelo = searchParams.get('modelo')
  const transmision = searchParams.get('transmision')
  const combustible = searchParams.get('combustible')
  const estado = searchParams.get('estado')
  const destacado = toBoolean(searchParams.get('destacado'))
  const precioMin = toNumber(searchParams.get('precioMin'))
  const precioMax = toNumber(searchParams.get('precioMax'))
  const añoMin = toNumber(searchParams.get('añoMin')) ?? toNumber(searchParams.get('anioMin'))
  const añoMax = toNumber(searchParams.get('añoMax')) ?? toNumber(searchParams.get('anioMax'))
  const kilometrajeMax = toNumber(searchParams.get('kilometrajeMax'))

  if (search) {
    filters.OR = [
      { marca: { contains: search, mode: 'insensitive' } },
      { modelo: { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
      { color: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (marca) {
    filters.marca = { equals: marca, mode: 'insensitive' }
  }

  if (modelo) {
    filters.modelo = { equals: modelo, mode: 'insensitive' }
  }

  if (transmision) {
    filters.transmision = { equals: transmision, mode: 'insensitive' }
  }

  if (combustible) {
    filters.combustible = { equals: combustible, mode: 'insensitive' }
  }

  if (estado) {
    filters.estado = estado as Prisma.AutoScalarWhereInput['estado']
  }

  if (typeof destacado === 'boolean') {
    filters.destacado = destacado
  }

  if (typeof precioMin === 'number' || typeof precioMax === 'number') {
    filters.precio = {}
    if (typeof precioMin === 'number') {
      filters.precio.gte = precioMin
    }
    if (typeof precioMax === 'number') {
      filters.precio.lte = precioMax
    }
  }

  if (typeof añoMin === 'number' || typeof añoMax === 'number') {
    filters.anio = {}
    if (typeof añoMin === 'number') {
      filters.anio.gte = añoMin
    }
    if (typeof añoMax === 'number') {
      filters.anio.lte = añoMax
    }
  }

  if (typeof kilometrajeMax === 'number') {
    filters.kilometraje = { lte: kilometrajeMax }
  }

  try {
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') as Prisma.SortOrder) || 'desc'

    const [total, autos] = await prisma.$transaction([
      prisma.auto.count({ where: filters }),
      prisma.auto.findMany({
        where: filters,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        include: { vehicleImages: { orderBy: { position: 'asc' } } },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        autos: autos.map(serializeAuto),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (error) {
    console.error('Autos GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener los vehículos' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const requiredFields = [
      'marca',
      'modelo',
      'año',
      'precio',
      'kilometraje',
      'transmision',
      'combustible',
      'color',

      'descripcion',
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `El campo ${field} es obligatorio` },
          { status: 400 },
        )
      }
    }

    const slugBase = `${body.marca}-${body.modelo}-${body.año}`
    let slug = slugBase
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    let suffix = 1
    // Garantizar slug único
    while (await prisma.auto.findUnique({ where: { slug } })) {
      slug = `${slug}-${suffix}`
      suffix += 1
    }

    const images = Array.isArray(body.imagenes) ? body.imagenes : []

    const created = await prisma.auto.create({
      data: {
        slug,
        marca: body.marca,
        modelo: body.modelo,
        anio: Number(body.año),
        precio: Number(body.precio),
        kilometraje: Number(body.kilometraje),
        transmision: body.transmision,
        combustible: body.combustible,
        color: body.color,

        descripcion: body.descripcion,
        caracteristicas: Array.isArray(body.caracteristicas) ? body.caracteristicas : [],
        estado: body.estado ?? 'disponible',
        destacado: Boolean(body.destacado),
        vehicleImages: {
          create: images.map((url: string, index: number) => ({
            imageUrl: url,
            position: index,
          })),
        },
      },
      include: {
        vehicleImages: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: serializeAuto(created),
    })
  } catch (error) {
    console.error('Autos POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear el vehículo' },
      { status: 500 },
    )
  }
}

