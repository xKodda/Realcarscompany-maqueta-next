import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ordenId: string }> },
) {
  try {
    const { ordenId } = await params
    const tickets = await prisma.ticketSorteo.findMany({
      where: { ordenId },
      orderBy: { fechaCompra: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: tickets.map((ticket) => ({
        id: ticket.id,
        numero: ticket.numero,
        sorteoId: ticket.sorteoId,
        estado: ticket.estado,
        fechaCompra: ticket.fechaCompra,
      })),
    })
  } catch (error) {
    console.error('Obtener tickets por orden error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener los tickets' },
      { status: 500 },
    )
  }
}


