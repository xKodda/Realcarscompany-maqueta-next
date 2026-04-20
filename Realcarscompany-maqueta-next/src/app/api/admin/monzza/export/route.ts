import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as xlsx from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const ordenes = await prisma.order.findMany({
            where: { estado: 'pagado' },
            orderBy: { createdAt: 'desc' },
            include: { tickets: true }
        });

        // Preparar la data para el CRM expandiendo un ticket por línea
        const exportData = ordenes.flatMap((orden) => {
            const tickets = orden.tickets || [];
            
            // Si por error no tiene tickets asignados en array, al menos poner 1 fila por orden
            if (tickets.length === 0) {
                return [{
                    "Nombre": orden.nombreComprador || '',
                    "RUT": orden.rutComprador || '',
                    "ID": "-",
                    "Fecha de compra": orden.createdAt ? new Date(orden.createdAt).toLocaleString('es-CL', { timeZone: 'America/Santiago' }) : '',
                }];
            }

            return tickets.map((tkt: any) => {
                return {
                    "Nombre": orden.nombreComprador || '',
                    "RUT": orden.rutComprador || '',
                    "ID": tkt.numero || tkt.id,
                    "Fecha de compra": orden.createdAt ? new Date(orden.createdAt).toLocaleString('es-CL', { timeZone: 'America/Santiago' }) : '',
                };
            });
        });

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(exportData);

        // Adjust column widths purely for better visual experience in Excel
        worksheet['!cols'] = [
            { wch: 30 }, // Nombre
            { wch: 15 }, // RUT
            { wch: 35 }, // ID Ticket
            { wch: 25 }, // Fecha de compra
        ];

        xlsx.utils.book_append_sheet(workbook, worksheet, 'Participantes');

        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        return new Response(excelBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': 'attachment; filename="Exportacion_Participantes_Monzza.xlsx"',
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
    } catch (e: any) {
        console.error('Failed to export', e);
        return NextResponse.json({ error: e.message || 'Error occurred' }, { status: 500 });
    }
}
