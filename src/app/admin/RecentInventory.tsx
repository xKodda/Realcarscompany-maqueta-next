'use client'

import Link from 'next/link'
import Image from 'next/image'
import Pagination from '@/components/Pagination'

interface RecentAuto {
  id: string
  marca: string
  modelo: string
  anio: number
  precio: number
  estado: string
  imagen: string
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
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
      
      <div className="space-y-2 mb-4">
        {autos.length === 0 ? (
          <p className="text-gray-500 text-sm font-light text-center py-8">
            No hay vehículos registrados
          </p>
        ) : (
          autos.map((auto) => (
            <Link
              key={auto.id}
              href={`/admin/vehicles/${auto.id}/edit`}
              className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-[#f2f2f4] hover:bg-gray-100 transition-colors touch-manipulation group"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden bg-gray-200">
                <Image
                  src={auto.imagen || '/images/placeholder.jpg'}
                  alt={`${auto.marca} ${auto.modelo}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 80px, 96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#161b39] text-sm sm:text-base truncate">
                  {auto.marca} {auto.modelo} {auto.anio}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-light">
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    maximumFractionDigits: 0,
                  }).format(auto.precio)}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-medium tracking-wider uppercase rounded-full flex-shrink-0 ${
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
        <div className="pt-3 border-t border-gray-200">
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

