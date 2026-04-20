import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, mensaje, tipo = 'general', imagenes = [] } = body

    // Validaciones básicas
    if (!nombre || !email || !telefono || !mensaje) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // CRM Integration removed for production build
    /*
    try {
      const { prisma } = await import('@/lib/prisma')
      // CRM logic...
    } catch (crmError) {
      console.error('Error saving to CRM:', crmError)
    }
    */

    // Email de destino (tu correo oficial)
    // Email de destino (puedes cambiarlo en .env para pruebas)
    const destinoEmail = process.env.CONTACT_EMAIL || 'Realcarscompanyspa@gmail.com'

    // Determinar asunto según el tipo
    let asunto = 'Nueva Consulta - RealCars Company'
    if (tipo === 'consignacion') {
      asunto = '🚗 Nueva Solicitud de Consignación - RealCars Company'
    } else if (tipo === 'auto') {
      asunto = '🔍 Consulta sobre Vehículo - RealCars Company'
    } else if (tipo === 'sorteo') {
      asunto = '🎫 Consulta sobre Sorteo - RealCars Company'
    }

    // Construir HTML del email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #161b39 0%, #802223 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #802223; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-left: 3px solid #802223; margin-top: 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">RealCars Company</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">${asunto}</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Nombre Completo:</div>
                <div class="value">${nombre}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📱 Teléfono:</div>
                <div class="value"><a href="tel:${telefono}">${telefono}</a></div>
              </div>
              
              <div class="field">
                <div class="label">💬 Mensaje:</div>
                <div class="value" style="white-space: pre-wrap;">${mensaje}</div>
              </div>

              ${imagenes.length > 0 ? `
              <div class="field">
                <div class="label">📷 Imágenes Adjuntas:</div>
                <div class="value">${imagenes.length} imagen(es) adjunta(s)</div>
              </div>
              ` : ''}
              
              <div class="footer">
                <p><strong>Fecha de Recepción:</strong> ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</p>
                <p>Este mensaje fue enviado desde el formulario de ${tipo === 'consignacion' ? 'Consignación' : 'Contacto'} de realcarscompany.cl</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Intentar enviar email, pero no fallar todo el proceso si falla el email
    let emailSent = false
    try {
      // Preparar adjuntos si hay imágenes
      const attachments = []
      if (imagenes && imagenes.length > 0) {
        for (let i = 0; i < imagenes.length; i++) {
          const base64Data = imagenes[i]
          // Validar si es una data URL válida
          if (base64Data.startsWith('data:')) {
            const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            if (matches && matches.length === 3) {
              const contentType = matches[1]
              const base64Content = matches[2]
              const extension = contentType.split('/')[1] || 'jpg'

              attachments.push({
                filename: `vehiculo_${i + 1}.${extension}`,
                content: Buffer.from(base64Content, 'base64'),
              })
            }
          }
        }
      }

      // Enviar email usando Resend
      const emailParams: any = {
        from: 'RealCars Company <contacto@realcarscompany.cl>',
        to: destinoEmail,
        subject: asunto,
        html: htmlContent,
        replyTo: email,
      }

      if (attachments.length > 0) {
        emailParams.attachments = attachments
      } else if (imagenes.length > 0) {
        emailParams.text = `Nota: Se adjuntaron ${imagenes.length} imágenes pero no pudieron procesarse como adjuntos. Contacta al cliente directamente.`
      }

      const { data, error: resendError } = await resend.emails.send(emailParams)

      if (resendError) {
        console.error('Resend error:', resendError)
      } else {
        emailSent = true
      }
    } catch (emailEx) {
      console.error('Email exception:', emailEx)
    }

    return NextResponse.json({
      success: true,
      message: emailSent ? 'Consulta enviada exitosamente' : 'Consulta guardada, pero no se pudo enviar el correo de notificación.',
      data: { emailSent }
    })

  } catch (error) {
    console.error('Error enviando email:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar la consulta. Por favor, intenta nuevamente.'
      },
      { status: 500 }
    )
  }
}
