import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const orderId = 'RC-JO7VCH5EB';
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { tickets: true }
  });

  if (!order) {
    console.error('Order not found');
    return;
  }

  const cantidadStickers = order.cantidad || 1;
  const ticketsIds = [];
  const ticketsData = [];
  
  if (order.estado !== 'pagado') {
      for (let i = 0; i < cantidadStickers; i++) {
          const uniqueId = `RC-TKT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          ticketsIds.push(uniqueId);
          ticketsData.push({
              numero: uniqueId,
              estado: 'activo'
          });
      }

      await prisma.order.update({
          where: { id: orderId },
          data: {
              estado: 'pagado',
              fechaPago: new Date(),
              tickets: {
                  create: ticketsData
              }
          }
      });
      console.log('Database updated to pagado and tickets generated:', ticketsIds);
  } else {
      console.log('Order was already marked as paid');
      ticketsIds.push(...order.tickets.map(t => t.numero));
  }

  console.log(`Sending email for order ${orderId} to ${order.emailComprador}...`);

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

  const cartSingle = cantidadStickers === 1 ? 1 : 0;
  const cartPack = cantidadStickers > 1 ? 1 : 0;
  const attachments = [];

  if (cartSingle > 0 || cartPack === 0) { 
      const singlePath = path.join(process.cwd(), 'public/images/stickers/IMAGEN DE 3000.png');
      if (fs.existsSync(singlePath)) {
          attachments.push({
              filename: 'Imagen_Monzza_Principal.png',
              content: fs.readFileSync(singlePath)
          });
      }
  }

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

  try {
    const { data, error } = await resend.emails.send({
        from: 'RealCars Company <contacto@realcarscompany.cl>',
        to: order.emailComprador,
        subject: 'Tus Imágenes Digitales Monzza - RealCars',
        html: htmlEmail,
        attachments: attachments.length > 0 ? attachments : undefined
    });

    if (error) {
      console.error('Resend Error:', error);
    } else {
      console.log(`✅ Email Enviado Exitosamente a ${order.emailComprador}`, data);
    }
  } catch (emailError) {
      console.error('No se pudo enviar email de confirmación (Resend):', emailError);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
