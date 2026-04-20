import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'El email es requerido' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user || user.role !== 'admin' || !user.isActive) {
      // Retornar éxito incluso si no existe para no exponer emails
      return NextResponse.json({ success: true, message: 'Si el correo existe, se han enviado las instrucciones.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #161b39 0%, #802223 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Recuperación de Contraseña</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Has solicitado restablecer tu contraseña para el panel de administración.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #802223; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Restablecer Contraseña</a>
            </div>
            <p style="font-size: 14px; color: #666;">Este enlace expirará en 1 hora.</p>
            <p style="font-size: 14px; color: #666;">Si no solicitaste esto, puedes ignorar este correo con seguridad.</p>
          </div>
        </body>
      </html>
    `

    const { error } = await resend.emails.send({
      from: 'RealCars Admin <contacto@realcarscompany.cl>',
      to: user.email,
      subject: 'Recuperar Contraseña - Admin RealCars',
      html: htmlContent
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Si el correo existe, se han enviado las instrucciones.' })
  } catch (error) {
    console.error('Recover password error:', error)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
