import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getKhipuPayment } from '@/lib/khipu'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  try {
    const { paymentId } = await params

    const pago = await prisma.pagoKhipu.findFirst({
      where: {
        OR: [{ khipuPaymentId: paymentId }, { transactionId: paymentId }],
      },
      include: {
        orden: true,
      },
    })

    if (!pago) {
      return NextResponse.json(
        { success: false, error: 'Pago no encontrado' },
        { status: 404 },
      )
    }

    if (!pago.khipuPaymentId) {
      return NextResponse.json(
        { success: false, error: 'El pago aún no cuenta con un ID de Khipu' },
        { status: 400 },
      )
    }

    const khipuPayment = await getKhipuPayment(pago.khipuPaymentId)

    // Mapear estados de Khipu al enum de Prisma
    const mapKhipuStatusToPagoEstado = (khipuStatus: string | undefined): 'pending' | 'verified' | 'done' | 'expired' | 'cancelled' => {
      if (!khipuStatus) return pago.status as 'pending' | 'verified' | 'done' | 'expired' | 'cancelled'
      
      const statusLower = khipuStatus.toLowerCase()
      if (statusLower === 'done' || statusLower === 'verified') {
        return 'verified'
      } else if (statusLower === 'expired') {
        return 'expired'
      } else if (statusLower === 'cancelled') {
        return 'cancelled'
      }
      return 'pending'
    }

    const mappedStatus = mapKhipuStatusToPagoEstado(khipuPayment.status)

    await prisma.$transaction(async (tx) => {
      await tx.pagoKhipu.update({
        where: { id: pago.id },
        data: {
          status: mappedStatus,
          statusDetail: khipuPayment.status_detail,
          receiverId: khipuPayment.receiver_id,
          notificationToken: khipuPayment.notification_token,
          readyForTerminal: Boolean(khipuPayment.ready_for_terminal),
          conciliationDate: khipuPayment.conciliation_date
            ? new Date(khipuPayment.conciliation_date)
            : null,
          payerEmail: khipuPayment.payer_email,
          payerName: khipuPayment.payer_name,
          metadata: khipuPayment,
          paymentUrl: khipuPayment.payment_url,
          simplifiedTransferUrl: khipuPayment.simplified_transfer_url,
          transferUrl: khipuPayment.transfer_url,
          appUrl: khipuPayment.app_url,
          expiresAt: khipuPayment.expires_date
            ? new Date(khipuPayment.expires_date)
            : null,
        },
      })

      // Actualizar orden si el pago fue completado
      if (
        khipuPayment.status === 'done' ||
        khipuPayment.status === 'verified'
      ) {
        await tx.ordenCompra.update({
          where: { id: pago.ordenId! },
          data: {
            estado: 'pagado',
            fechaPago: new Date(khipuPayment.paid_at || Date.now()),
            updatedAt: new Date(),
          },
        })
      } else if (
        khipuPayment.status === 'expired' ||
        khipuPayment.status === 'cancelled'
      ) {
        const ordenEstado =
          khipuPayment.status === 'expired' ? 'expirado' : 'cancelado'
        await tx.ordenCompra.update({
          where: { id: pago.ordenId! },
          data: {
            estado: ordenEstado,
            updatedAt: new Date(),
          },
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: khipuPayment,
    })
  } catch (error) {
    console.error('Verificar pago Khipu error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al verificar el pago en Khipu',
      },
      { status: 500 },
    )
  }
}




