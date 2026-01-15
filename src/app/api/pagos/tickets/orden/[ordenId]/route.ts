import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ordenId: string }> },
) {
  try {
    const { ordenId } = await params
    const orden = await prisma.ordenCompra.findUnique({
      where: { id: ordenId },
      include: {
        tickets: true,
        // pagos: true, // Legacy relation removed
      },
    })

    if (!orden) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: orden.id,
        sorteoId: orden.sorteoId,
        sorteoTitulo: orden.sorteoTitulo,
        cantidad: orden.cantidad,
        total: orden.total,
        precioUnitario: orden.precioUnitario,
        currency: orden.currency,
        estado: orden.estado,
        comprador: {
          nombre: orden.compradorNombre,
          email: orden.compradorEmail,
          telefono: orden.compradorTelefono,
          rut: orden.compradorRut,
        },
        // These fields might also be missing if Khipu update wasn't applied, keeping them for now if they exist on model
        // khipuPaymentUrl: orden.khipuPaymentUrl, 
        // khipuSimplifiedTransferUrl: orden.khipuSimplifiedTransferUrl,
        // khipuTransferUrl: orden.khipuTransferUrl,
        // khipuAppUrl: orden.khipuAppUrl,
        fechaPago: orden.fechaPago,
        createdAt: orden.createdAt,
        updatedAt: orden.updatedAt,
        tickets: orden.tickets.map((ticket) => ({
          id: ticket.id,
          numero: ticket.numero,
          sorteoId: ticket.sorteoId,
          estado: ticket.estado,
          fechaCompra: ticket.fechaCompra,
        })),
        pagos: [],
      },
    })
  } catch (error) {
    console.error('Obtener orden error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener la orden' },
      { status: 500 },
    )
  }
}



