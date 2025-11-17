import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getKhipuPayment, verifyKhipuWebhookSignature } from '@/lib/khipu'

async function extractNotificationToken(request: Request) {
  const contentType = request.headers.get('content-type') || ''

  // Guardar el cuerpo original para verificación de firma
  const clonedRequest = request.clone()

  if (contentType.includes('application/json')) {
    const json = await clonedRequest.json().catch(() => null)
    if (!json) return null
    return {
      token: json.notification_token || json.notificationToken || null,
      rawBody: JSON.stringify(json),
    }
  }

  const rawBody = await clonedRequest.text()
  if (!rawBody) return { token: null, rawBody: '' }

  try {
    const params = new URLSearchParams(rawBody)
    return {
      token: params.get('notification_token') || params.get('notificationToken'),
      rawBody,
    }
  } catch {
    return { token: null, rawBody: '' }
  }
}

export async function POST(request: Request) {
  try {
    // Extraer el token de notificación y el cuerpo original
    const result = await extractNotificationToken(request)
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Token de notificación inválido' },
        { status: 400 },
      )
    }

    const { token: notificationToken, rawBody } = result

    if (!notificationToken) {
      return NextResponse.json(
        { success: false, error: 'Token de notificación inválido' },
        { status: 400 },
      )
    }

    // Verificar la firma del webhook (seguridad)
    const signature = request.headers.get('X-Khipu-Signature') || ''
    const apiVersion = request.headers.get('X-Khipu-Api-Version') || '1.3'

    // Verificar firma si está configurado en producción
    if (process.env.NODE_ENV === 'production' && signature) {
      const isValid = verifyKhipuWebhookSignature(
        notificationToken,
        signature,
        apiVersion,
      )

      if (!isValid) {
        console.error('Webhook Khipu: Firma inválida', {
          notificationToken,
          signature,
        })
        return NextResponse.json(
          { success: false, error: 'Firma de webhook inválida' },
          { status: 401 },
        )
      }
    }

    // Buscar el pago por notification token
    const pago = await prisma.pagoKhipu.findFirst({
      where: { notificationToken },
      include: { orden: true },
    })

    if (!pago || !pago.khipuPaymentId) {
      console.warn('Webhook Khipu sin pago asociado', notificationToken)
      // Responder OK para evitar que Khipu reenvíe el webhook
      return NextResponse.json({ success: true })
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
      // Actualizar el pago
      await tx.pagoKhipu.update({
        where: { id: pago.id },
        data: {
          status: mappedStatus,
          statusDetail: khipuPayment.status_detail,
          receiverId: khipuPayment.receiver_id,
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
          updatedAt: new Date(),
        },
      })

      // Si el pago fue completado, actualizar la orden
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

        // Aquí podrías enviar un email de confirmación, etc.
        console.log(`✅ Pago completado - Orden ${pago.ordenId}`)
      } else if (
        khipuPayment.status === 'expired' ||
        khipuPayment.status === 'cancelled'
      ) {
        // Si el pago expiró o fue cancelado, marcar orden como correspondiente
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook Khipu error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar el webhook de Khipu' },
      { status: 500 },
    )
  }
}

