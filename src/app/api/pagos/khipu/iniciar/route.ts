import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createKhipuPayment, generateTransactionId } from '@/lib/khipu'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ordenId, returnUrl, cancelUrl } = body

    if (!ordenId) {
      return NextResponse.json(
        { success: false, error: 'Debe indicar una orden válida' },
        { status: 400 },
      )
    }

    const orden = await prisma.ordenCompra.findUnique({
      where: { id: ordenId },
    })

    if (!orden) {
      return NextResponse.json(
        { success: false, error: 'Orden no encontrada' },
        { status: 404 },
      )
    }

    if (orden.estado === 'pagado') {
      return NextResponse.json(
        { success: false, error: 'La orden ya se encuentra pagada' },
        { status: 400 },
      )
    }

    const transactionId = generateTransactionId()

    const subject = orden.sorteoTitulo
      ? `Sorteo ${orden.sorteoTitulo}`
      : 'Compra de tickets RealCars Company'

    const pago = await prisma.pagoKhipu.create({
      data: {
        transactionId,
        amount: orden.total,
        currency: orden.currency,
        status: 'pending',
        subject,
        returnUrl: returnUrl ?? null,
        cancelUrl: cancelUrl ?? null,
        ordenId: orden.id,
      },
    })

    // Construir URL de notificación del webhook
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : ''
    const notifyUrl =
      process.env.KHIPU_NOTIFY_URL ||
      `${baseUrl}/api/pagos/khipu/webhook`

    if (!notifyUrl || notifyUrl === '/api/pagos/khipu/webhook') {
      console.warn(
        '⚠️ KHIPU_NOTIFY_URL no configurada. El webhook no funcionará correctamente.',
      )
    }

    const paymentResponse = await createKhipuPayment({
      subject,
      amount: orden.total,
      transactionId,
      currency: orden.currency,
      returnUrl,
      cancelUrl,
      notifyUrl,
      custom: {
        ordenId: orden.id,
        pagoId: pago.id,
      },
      payerEmail: orden.compradorEmail,
      payerName: orden.compradorNombre,
    })

    await prisma.$transaction([
      prisma.pagoKhipu.update({
        where: { id: pago.id },
        data: {
          khipuPaymentId: paymentResponse.payment_id,
          status: paymentResponse.status ?? 'pending',
          statusDetail: paymentResponse.status_detail ?? null,
          notificationToken: paymentResponse.notification_token ?? null,
          receiverId: paymentResponse.receiver_id ?? null,
          readyForTerminal: paymentResponse.ready_for_terminal ?? false,
          conciliationDate: paymentResponse.conciliation_date
            ? new Date(paymentResponse.conciliation_date)
            : null,
          metadata: paymentResponse,
          paymentUrl: paymentResponse.payment_url,
          simplifiedTransferUrl: paymentResponse.simplified_transfer_url,
          transferUrl: paymentResponse.transfer_url,
          appUrl: paymentResponse.app_url,
        },
      }),
      prisma.ordenCompra.update({
        where: { id: orden.id },
        data: {
          khipuPaymentUrl: paymentResponse.payment_url,
          khipuSimplifiedTransferUrl: paymentResponse.simplified_transfer_url,
          khipuTransferUrl: paymentResponse.transfer_url,
          khipuAppUrl: paymentResponse.app_url,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        paymentId: paymentResponse.payment_id,
        paymentUrl: paymentResponse.payment_url,
        simplifiedTransferUrl: paymentResponse.simplified_transfer_url,
        transferUrl: paymentResponse.transfer_url,
        appUrl: paymentResponse.app_url,
        notificationToken: paymentResponse.notification_token,
        transactionId,
      },
    })
  } catch (error) {
    console.error('Iniciar pago Khipu error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al iniciar el pago con Khipu',
      },
      { status: 500 },
    )
  }
}

