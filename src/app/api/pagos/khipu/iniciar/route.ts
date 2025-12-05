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
        'KHIPU_NOTIFY_URL no configurada. El webhook no funcionará correctamente.',
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
    // Log detallado del error para debugging
    let errorMessage = 'Error al iniciar el pago con Khipu'
    let errorDetails: any = {}
    
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }
      
      // Mensajes más específicos según el tipo de error
      if (error.message.includes('KHIPU_RECEIVER_ID') || error.message.includes('KHIPU_SECRET')) {
        errorMessage = 'Configuración de Khipu incompleta. Contacta al administrador.'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Error de conexión con el servicio de pagos. Intenta nuevamente.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'La solicitud tardó demasiado tiempo. Intenta nuevamente.'
      }
    } else if (typeof error === 'object' && error !== null) {
      try {
        errorDetails = JSON.parse(JSON.stringify(error))
        if ('message' in error) {
          errorMessage = String((error as any).message) || errorMessage
        }
      } catch {
        errorDetails = { error: String(error) }
      }
    }
    
    console.error('Iniciar pago Khipu error:', {
      error: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

