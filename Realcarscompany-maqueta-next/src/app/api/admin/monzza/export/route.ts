import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import * as xlsx from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data: ordenes, error } = await supabaseAdmin
            .from('ordenes_monzza')
            .select('*')
            .eq('estado', 'pagado')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching data for export:', error);
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }

        // Preparar la data para el CRM expandiendo un ticket por línea
        const exportData = (ordenes || []).flatMap((orden) => {
            const tickets = orden.tickets || [];
            
            // Si por error no tiene tickets asignados en array, al menos poner 1 fila por orden
            if (tickets.length === 0) {
                return [{
                    "ID Único de Chance": "-",
                    "Nombre": orden.nombre || '',
                    "RUT": orden.metadata?.rut || '',
                    "Email": orden.email || '',
                    "Ciudad / Comuna": orden.metadata?.direccion?.split(',')[1]?.trim() || 'Desconocido',
                    "Dirección Completa": orden.metadata?.direccion || '',
                    "Teléfono": orden.metadata?.telefono || '',
                    "Monto Total Orden": orden.total || 0,
                    "Fecha de Compra": orden.created_at ? new Date(orden.created_at).toLocaleDateString('es-CL') : '',
                    "ID Orden Flow": orden.id || ''
                }];
            }

            return tickets.map((tktId: string) => {
                return {
                    "ID Único de Chance": tktId,
                    "Nombre": orden.nombre || '',
                    "RUT": orden.metadata?.rut || '',
                    "Email": orden.email || '',
                    "Ciudad / Comuna": orden.metadata?.direccion?.split(',')[1]?.trim() || 'Desconocido',
                    "Dirección Completa": orden.metadata?.direccion || '',
                    "Teléfono": orden.metadata?.telefono || '',
                    "Monto Total Orden": orden.total || 0,
                    "Fecha de Compra": orden.created_at ? new Date(orden.created_at).toLocaleDateString('es-CL') : '',
                    "ID Orden Flow": orden.id || ''
                };
            });
        });

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(exportData);

        // Adjust column widths purely for better visual experience in Excel
        worksheet['!cols'] = [
            { wch: 25 }, // ID Ticket
            { wch: 30 }, // Nombre
            { wch: 15 }, // RUT
            { wch: 35 }, // Email
            { wch: 20 }, // Ciudad
            { wch: 45 }, // Direccion
            { wch: 15 }, // Telefono
            { wch: 15 }, // Total
            { wch: 15 }, // Fecha
            { wch: 20 }  // ID Flow
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
