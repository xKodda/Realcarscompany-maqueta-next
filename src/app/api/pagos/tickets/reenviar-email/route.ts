import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ordenId } = body

    if (!ordenId) {
      return NextResponse.json(
        { success: false, error: 'Debe indicar la orden a reenviar' },
        { status: 400 },
      )
    }

    const orden = await prisma.ordenCompra.findUnique({
      where: { id: ordenId },
      include: { tickets: true },
    })

    if (!orden) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 },
      )
    }

    // Aquí se integrará el servicio de emails (SendGrid, Resend, etc.)
    console.info('📧 Reenvío de tickets solicitado', {
      ordenId,
      email: orden.compradorEmail,
      tickets: orden.tickets.map((ticket) => ticket.numero),
    })

    return NextResponse.json({
      success: true,
      message: 'El correo de confirmación será reenviado en breve.',
    })
  } catch (error) {
    console.error('Reenviar email error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al reenviar el correo de tickets' },
      { status: 500 },
    )
  }
}






