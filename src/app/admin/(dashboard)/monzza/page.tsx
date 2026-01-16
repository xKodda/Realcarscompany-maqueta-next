import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getSales() {
    return [] as any[]
    /* await prisma.ordenCompra.findMany({
        where: {
            // Opcional: filtrar solo pagos de Monzza si hubiera otros tipos de órdenes
            // Por ahora todas las OrdenCompra son de Monzza
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limitar a las últimas 100 para rendimiento inicial
        include: {
            flowTransactions: {
                select: {
                    token: true,
                    paymentMethod: true,
                    status: true
                }
            }
        }
    }) */
}

// Stats helper
function calculateStats(sales: any[]) {
    const paidSales = sales.filter(s => s.estado === 'pagado')
    const totalRevenue = paidSales.reduce((acc, curr) => acc + curr.total, 0)
    const totalOrders = paidSales.length

    return {
        revenue: totalRevenue,
        totalOrders,
        pendingOrders: sales.filter(s => s.estado === 'pendiente').length
    }
}

export default async function MonzzaSalesPage() {
    const sales = await getSales()
    const stats = calculateStats(sales)

    return (
        <div className="space-y-8">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#161b39] mb-2">Ventas Monzza</h1>
                    <p className="text-gray-500">Gestión de órdenes de compra e imágenes digitales.</p>
                </div>

                <div className="flex gap-3">
                    <a
                        href="/api/admin/monzza/export"
                        target="_blank"
                        className="bg-[#161b39] hover:bg-[#2a3055] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exportar Nómina Oficial
                    </a>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Ingresos Totales</p>
                    <div className="text-3xl font-bold text-[#161b39]">
                        ${stats.revenue.toLocaleString('es-CL')}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Ventas Exitosas</p>
                    <div className="text-3xl font-bold text-green-600">
                        {stats.totalOrders}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Pendientes de Pago</p>
                    <div className="text-3xl font-bold text-yellow-600">
                        {stats.pendingOrders}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-400 font-medium tracking-wider">
                                <th className="p-4">ID Orden</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">RUT</th>
                                <th className="p-4">Monto / Producto</th>
                                <th className="p-4">Pago</th>
                                <th className="p-4">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">
                                        No hay ventas registradas aún.
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-mono text-xs text-gray-500">
                                            {sale.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(sale.createdAt).toLocaleDateString('es-CL', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-[#161b39]">{sale.compradorNombre}</div>
                                            <div className="text-xs text-gray-400">{sale.compradorEmail}</div>
                                        </td>
                                        <td className="p-4 font-mono text-gray-600">
                                            {sale.compradorRut || '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-[#161b39]">
                                                ${sale.total.toLocaleString('es-CL')}
                                            </span>
                                            <div className="text-xs text-gray-400">
                                                {sale.total >= 20000 ? 'Gold' : sale.total >= 10000 ? 'Silver' : 'Standard'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500 capitalize">
                                            {sale.flowTransactions?.[0]?.paymentMethod || 'Flow'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${sale.estado === 'pagado'
                                                    ? 'bg-green-100 text-green-800'
                                                    : sale.estado === 'pendiente'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {sale.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
