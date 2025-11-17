'use client'

import Link from 'next/link'
import Pagination from '@/components/Pagination'

interface RecentAuto {
  id: string
  marca: string
  modelo: string
  anio: number
  precio: number
  estado: string
}

interface RecentInventoryProps {
  autos: RecentAuto[]
  total: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
}

export default function RecentInventory({
  autos,
  total,
  currentPage,
  totalPages,
  itemsPerPage,
}: RecentInventoryProps) {
  return (
    <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-light text-[#161b39] tracking-tight">
          Inventario <span className="font-semibold">Reciente</span>
        </h2>
        {totalPages > 1 && (
          <Link
            href="/admin/vehicles"
            className="text-sm text-[#802223] hover:underline mt-2 sm:mt-0"
          >
            Ver todos →
          </Link>
        )}
      </div>
      
      <div className="space-y-2 sm:space-y-3 mb-6">
        {autos.length === 0 ? (
          <p className="text-gray-500 text-sm font-light text-center py-8">
            No hay vehículos registrados
          </p>
        ) : (
          autos.map((auto) => (
            <Link
              key={auto.id}
              href={`/admin/vehicles/${auto.id}`}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-[#f2f2f4] hover:bg-gray-100 transition-colors touch-manipulation"
            >
              <div className="flex-1 mb-2 sm:mb-0">
                <p className="font-medium text-[#161b39] text-sm sm:text-base">
                  {auto.marca} {auto.modelo} {auto.anio}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-light">
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                  }).format(auto.precio)}
                </p>
              </div>
              <span
                className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full ${
                  auto.estado === 'disponible'
                    ? 'bg-green-100 text-green-800'
                    : auto.estado === 'vendido'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {auto.estado}
              </span>
            </Link>
          ))
        )}
      </div>

      {/* Paginación para inventario reciente */}
      {totalPages > 1 && (
        <div className="pt-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            itemsPerPage={itemsPerPage}
            baseUrl="/admin"
            className="text-sm"
          />
        </div>
      )}
    </div>
  )
}

