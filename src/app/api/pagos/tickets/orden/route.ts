import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type OrdenResponse = {
  orden: {
    id: string
    sorteoId: string | null
    sorteoTitulo: string | null
    cantidad: number
    total: number
    precioUnitario: number
    currency: string
    comprador: {
      nombre: string
      email: string
      telefono: string
      rut?: string | null
    }
    estado: string
    createdAt: Date
  }
  tickets: Array<{
    id: string
    numero: string
    sorteoId: string
    estado: string
    fechaCompra: Date
  }>
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { sorteoId, sorteoTitulo, cantidad, precioTicket, currency = 'CLP', comprador } = body

    if (!sorteoId || !cantidad || !precioTicket || !comprador) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos para crear la orden' },
        { status: 400 },
      )
    }

    if (!comprador.nombre || !comprador.email || !comprador.telefono) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos del comprador' },
        { status: 400 },
      )
    }

    if (cantidad < 1) {
      return NextResponse.json(
        { success: false, error: 'La cantidad mínima de tickets es 1' },
        { status: 400 },
      )
    }

    const total = Math.round(Number(precioTicket) * Number(cantidad))
    const unitPrice = Math.round(Number(precioTicket))

    const lastTicket = await prisma.ticketSorteo.findFirst({
      where: { sorteoId },
      orderBy: { numero: 'desc' },
    })

    const lastNumber = lastTicket ? parseInt(lastTicket.numero, 10) || 0 : 0
    const ticketsToCreate = Array.from({ length: cantidad }, (_, index) => {
      const sequential = lastNumber + index + 1
      const numero = String(sequential).padStart(6, '0')

      return {
        numero,
        sorteoId,
        comprador: comprador.nombre,
        estado: 'activo' as const,
      }
    })

    const result = await prisma.$transaction(async (tx) => {
      const orden = await tx.ordenCompra.create({
        data: {
          sorteoId,
          sorteoTitulo: sorteoTitulo ?? null,
          cantidad,
          total,
          precioUnitario: unitPrice,
          currency,
          compradorNombre: comprador.nombre,
          compradorEmail: comprador.email,
          compradorTelefono: comprador.telefono,
          compradorRut: comprador.rut ?? null,
          estado: 'pendiente',
        },
      })

      const tickets = await Promise.all(
        ticketsToCreate.map((ticket) =>
          tx.ticketSorteo.create({
            data: {
              numero: ticket.numero,
              sorteoId: ticket.sorteoId,
              comprador: ticket.comprador,
              estado: ticket.estado,
              ordenId: orden.id,
            },
          }),
        ),
      )

      return { orden, tickets }
    })

    const payload: OrdenResponse = {
      orden: {
        id: result.orden.id,
        sorteoId: result.orden.sorteoId,
        sorteoTitulo: result.orden.sorteoTitulo,
        cantidad: result.orden.cantidad,
        total: result.orden.total,
        precioUnitario: result.orden.precioUnitario,
        currency: result.orden.currency,
        comprador: {
          nombre: result.orden.compradorNombre,
          email: result.orden.compradorEmail,
          telefono: result.orden.compradorTelefono,
          rut: result.orden.compradorRut,
        },
        estado: result.orden.estado,
        createdAt: result.orden.createdAt,
      },
      tickets: result.tickets.map((ticket) => ({
        id: ticket.id,
        numero: ticket.numero,
        sorteoId: ticket.sorteoId,
        estado: ticket.estado,
        fechaCompra: ticket.fechaCompra,
      })),
    }

    return NextResponse.json({
      success: true,
      data: payload,
    })
  } catch (error) {
    console.error('Crear orden error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear la orden de compra' },
      { status: 500 },
    )
  }
}


