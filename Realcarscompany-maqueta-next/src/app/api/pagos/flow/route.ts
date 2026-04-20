import { NextRequest, NextResponse } from 'next/server';
import { createFlowPayment } from '@/lib/flow';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { total, email, nombre, ordenId, metadata } = body;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const cantidad = metadata?.tickets || 1;
        const subjectText = cantidad === 1 ? '1 Imagen Digital Monzza' : `${cantidad} Imágenes Digitales Monzza`;

        // Guardar la orden en Prisma usando el modelo Order existente
        try {
            await prisma.order.create({
                data: {
                    id: ordenId,
                    sorteoId: 'MONZZA-MOTO',
                    sorteoTitulo: 'Promoción Comercial MONZZA',
                    cantidad: cantidad,
                    total: total,
                    precioUnitario: Math.round(total / cantidad),
                    estado: 'pendiente',
                    nombreComprador: nombre,
                    emailComprador: email,
                    telefonoComprador: metadata?.telefono || 'N/A',
                    rutComprador: metadata?.rut || null,
                }
            });
        } catch (dbError) {
            console.error('Error guardando en Prisma DB:', dbError);
            throw new Error('Error al registrar la orden en la base de datos');
        }

        const params = {
            commerceOrder: ordenId,
            subject: `${subjectText} - RealCars`,
            currency: 'CLP',
            amount: total,
            email: email,
            urlConfirmation: `${baseUrl}/api/pagos/flow/confirmacion`,
            urlReturn: `${baseUrl}/pago/exito?orden=${ordenId}`,
        };

        const flowResponse = await createFlowPayment(params);

        if (flowResponse.url && flowResponse.token) {
            const redirectUrl = `${flowResponse.url}?token=${flowResponse.token}`;
            return NextResponse.json({ success: true, url: redirectUrl });
        } else {
            console.error('Flow error response:', flowResponse);
            return NextResponse.json({
                success: false,
                error: flowResponse.message || 'Error al generar link de pago'
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Payment API error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
