import crypto from 'crypto'

const KHIPU_BASE_URL = process.env.KHIPU_BASE_URL || 'https://khipu.com/api/2.0'

function getAuthHeader() {
  const receiverId = process.env.KHIPU_RECEIVER_ID
  const secret = process.env.KHIPU_SECRET

  if (!receiverId || !secret) {
    throw new Error(
      'Faltan variables de entorno KHIPU_RECEIVER_ID o KHIPU_SECRET. Configúralas para habilitar los pagos.',
    )
  }

  const credentials = Buffer.from(`${receiverId}:${secret}`).toString('base64')
  return `Basic ${credentials}`
}

/**
 * Verifica la firma del webhook de Khipu usando HMAC SHA256
 * @param notificationToken - Token de notificación recibido
 * @param apiVersion - Versión de la API (por defecto '1.3')
 * @param notificationSignature - Firma recibida en el header 'X-Khipu-Signature'
 * @returns true si la firma es válida, false en caso contrario
 */
export function verifyKhipuWebhookSignature(
  notificationToken: string,
  notificationSignature: string,
  apiVersion: string = '1.3',
): boolean {
  const secret = process.env.KHIPU_SECRET

  if (!secret) {
    console.error('KHIPU_SECRET no configurado para verificar webhook')
    return false
  }

  if (!notificationSignature) {
    return false
  }

  // Construir el mensaje para verificar (según documentación de Khipu)
  const message = `api_version=${apiVersion}&notification_token=${notificationToken}`

  // Calcular HMAC SHA256
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(message)
  const calculatedSignature = hmac.digest('hex')

  // Comparar firmas (comparación segura para evitar timing attacks)
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'hex'),
    Buffer.from(notificationSignature, 'hex'),
  )
}

export function generateTransactionId(prefix = 'rc-khipu'): string {
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 24)
  return `${prefix}-${random}`
}

interface CreatePaymentPayload {
  subject: string
  amount: number
  currency?: string
  transactionId: string
  returnUrl?: string
  cancelUrl?: string
  notifyUrl?: string
  body?: string
  custom?: Record<string, unknown>
  payerEmail?: string
  payerName?: string
  expiresDate?: string
}

export async function createKhipuPayment(payload: CreatePaymentPayload) {
  const response = await fetch(`${KHIPU_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: payload.subject,
      amount: payload.amount,
      currency: payload.currency || 'CLP',
      transaction_id: payload.transactionId,
      return_url: payload.returnUrl,
      cancel_url: payload.cancelUrl,
      notify_url: payload.notifyUrl,
      body: payload.body,
      custom: payload.custom ? JSON.stringify(payload.custom) : undefined,
      payer_email: payload.payerEmail,
      payer_name: payload.payerName,
      expires_date: payload.expiresDate,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(
      data?.message || `Error al crear el pago en Khipu (${response.status})`,
    )
  }

  return response.json()
}

export async function getKhipuPayment(paymentId: string) {
  const response = await fetch(`${KHIPU_BASE_URL}/payments/${paymentId}`, {
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(
      data?.message ||
        `Error al obtener el pago de Khipu (${response.status})`,
    )
  }

  return response.json()
}

/**
 * Valida las credenciales de Khipu verificando la configuración
 */
export function validateKhipuConfig(): { valid: boolean; error?: string } {
  const receiverId = process.env.KHIPU_RECEIVER_ID
  const secret = process.env.KHIPU_SECRET

  if (!receiverId) {
    return {
      valid: false,
      error: 'KHIPU_RECEIVER_ID no está configurado',
    }
  }

  if (!secret) {
    return {
      valid: false,
      error: 'KHIPU_SECRET no está configurado',
    }
  }

  return { valid: true }
}


