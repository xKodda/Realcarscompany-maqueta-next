import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CRMPage() {
    const interactions: any[] = [] // await prisma.interaction.findMany({...}) disabled for production commit

    return (
        <div>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] mb-2 tracking-tight">
                        CRM / Leads
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 font-light">
                        Gestión de clientes y consultas recientes
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-medium">
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Mensaje</th>
                                <th className="px-6 py-4">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {interactions.map((interaction) => (
                                <tr key={interaction.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(interaction.createdAt).toLocaleDateString('es-CL')} <br />
                                        <span className="text-xs text-gray-400">{new Date(interaction.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-[#161b39]">{interaction.client.name}</div>
                                        <div className="text-xs text-gray-500">{interaction.client.email}</div>
                                        <div className="text-xs text-gray-500">{interaction.client.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${interaction.type === 'consignacion' ? 'bg-blue-50 text-blue-700' :
                                            interaction.type === 'auto' ? 'bg-green-50 text-green-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {interaction.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm text-gray-600 line-clamp-2" title={interaction.content}>
                                            {interaction.content}
                                        </p>
                                        {interaction.metadata && (interaction as any).metadata.imagenesCount > 0 && (
                                            <span className="inline-block mt-1 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                📷 {(interaction as any).metadata.imagenesCount} fotos
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium uppercase tracking-wide">
                                        <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                                            {interaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {interactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-light">
                                        No hay interacciones registradas aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
