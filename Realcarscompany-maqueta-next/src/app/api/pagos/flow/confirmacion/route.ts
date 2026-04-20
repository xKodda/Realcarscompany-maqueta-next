import { NextRequest, NextResponse } from 'next/server';
import { getFlowPaymentStatus } from '@/lib/flow';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const token = formData.get('token') as string;

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 400 });
        }

        const flowStatus = await getFlowPaymentStatus(token);

        if (!flowStatus || flowStatus.error) {
            console.error('Flow status error:', flowStatus);
            return NextResponse.json({ error: 'Error verificando pago' }, { status: 500 });
        }

        const ordenId = flowStatus.commerceOrder;
        
        if (flowStatus.status === 2 || flowStatus.status === '2') {
            const { prisma } = await import('@/lib/prisma');
            const order = await prisma.order.findUnique({
                where: { id: ordenId },
                include: { tickets: true }
            });

            if (!order) {
                console.error('Order not found in DB:', ordenId);
                return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
            }

            if (order.estado !== 'pagado') {
                const cantidadStickers = order.cantidad || 1;
                const ticketsIds: string[] = [];
                const ticketsData = [];
                for (let i = 0; i < cantidadStickers; i++) {
                    const uniqueId = `RC-TKT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
                    ticketsIds.push(uniqueId);
                    ticketsData.push({
                        numero: uniqueId,
                        estado: 'activo'
                    });
                }

                // Update using Prisma
                try {
                    await prisma.order.update({
                        where: { id: ordenId },
                        data: {
                            estado: 'pagado',
                            fechaPago: new Date(),
                            tickets: {
                                create: ticketsData
                            }
                        }
                    });
                } catch (updateError) {
                    console.error('Error updating order:', updateError);
                    return NextResponse.json({ error: 'Error actualizando orden' }, { status: 500 });
                }

                // Enviar email con Resend
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://realcarscompany.cl';
                    const idsHtml = ticketsIds.map(tkt => `<div style="background-color: #802223; color: white; padding: 10px 15px; border-radius: 6px; margin-bottom: 10px; font-family: monospace; letter-spacing: 1px; font-size: 16px; text-align: center; font-weight: bold;">${tkt}</div>`).join('');
                    
                    const htmlEmail = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                    </head>
                    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0a0f1d; color: #ffffff; padding: 20px;">
                        <div style="background-color: #111526; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; border: 1px solid #2a2f4c;">
                            <div style="text-align: center; padding: 40px 20px; border-bottom: 2px solid #802223; background: linear-gradient(to bottom, #161b39, #0a0f1d);">
                                <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 2px; margin: 0;">COLECCIÓN DIGITAL <span style="font-weight: bold;">MONZZA.</span></h1>
                            </div>
                            <div style="padding: 40px 30px;">
                                <p style="font-size: 18px; margin-bottom: 20px; color: #e2e8f0;">Hola <strong>${order.nombreComprador || 'Cliente Premium'}</strong>,</p>
                                <p style="line-height: 1.6; color: #94a3b8; font-size: 14px;">Confirmamos el pago exitoso de tu orden de compra correspondiente a la colección oficial Monzza. Adjunto encontrarás la imagen digital y tus identificadores únicos validados y operativos.</p>
                                
                                <div style="margin: 30px 0; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                    <img src="${baseUrl}/images/brand/moto1.jpeg" alt="Promoción comercial MONZZA" style="display: block; width: 100%; height: auto; object-fit: cover; max-height: 250px;" />
                                </div>

                                <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                    <p style="margin-top:0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">IDs Oficiales (${cantidadStickers} Imágenes Digitales)</p>
                                    ${idsHtml}
                                </div>
                                
                                <p style="line-height: 1.6; color: #94a3b8; font-size: 13px;">Conservaremos este registro asociado a tu RUT (ID Comercial). Tu participación como beneficio accesorio ha sido confirmada en nuestros registros.</p>
                            </div>
                            <div style="text-align: center; font-size: 11px; color: #64748b; padding: 30px; background-color: #0f1423;">
                                &copy; ${new Date().getFullYear()} RealCars Company.<br/>Proceso validado comercialmente mediante Flow Chile y regulaciones comerciales vigentes.
                            </div>
                        </div>
                    </body>
                    </html>
                    `;

                    // Preparar los stickers como archivos adjuntos
                    const cartSingle = cantidadStickers === 1 ? 1 : 0;
                    const cartPack = cantidadStickers > 1 ? 1 : 0;

                    const attachments = [];

                    // 1. Imagen individual (3000)
                    if (cartSingle > 0 || cartPack === 0) { 
                        const singlePath = path.join(process.cwd(), 'public/images/stickers/IMAGEN DE 3000.png');
                        if (fs.existsSync(singlePath)) {
                            attachments.push({
                                filename: 'Imagen_Monzza_Principal.png',
                                content: fs.readFileSync(singlePath)
                            });
                        }
                    }

                    // 2. Pack de 4 Imágenes (10000)
                    if (cartPack > 0) {
                        for (let j = 1; j <= 4; j++) {
                            const packPath = path.join(process.cwd(), `public/images/stickers/PACK 4 IMAGENES${j}.png`);
                            if (fs.existsSync(packPath)) {
                                attachments.push({
                                    filename: `Imagen_Monzza_Pack_${j}.png`,
                                    content: fs.readFileSync(packPath)
                                });
                            }
                        }
                    }

                    await resend.emails.send({
                        from: 'RealCars Company <contacto@realcarscompany.cl>',
                        to: order.emailComprador,
                        subject: 'Tus Imágenes Digitales Monzza - RealCars',
                        html: htmlEmail,
                        attachments: attachments.length > 0 ? attachments : undefined
                    });

                    console.log(`✅ Email Enviado Exitosamente a ${order.emailComprador}`);
                } catch (emailError) {
                    console.error('No se pudo enviar email de confirmación (Resend):', emailError);
                }

                console.log(`✅ Pago completado y ${cantidadStickers} BD updates OK para la orden ${ordenId}`);
            }
        } else {
            const { prisma } = await import('@/lib/prisma');
            await prisma.order.update({
                where: { id: ordenId },
                data: { estado: 'rechazado' }
            });
        }


        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Flow Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
