'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

interface VehicleImage {
  id: number
  imageUrl: string
  position: number
}

interface CreatedBy {
  id: number
  name: string
  email: string
}

interface Vehicle {
  id: string
  slug: string
  marca: string
  modelo: string
  anio: number
  precio: number
  estado: string
  imagen: string
  createdAt: Date
  createdBy: CreatedBy | null
  vehicleImages: VehicleImage[]
}

interface VehiclesTableProps {
  vehicles: Vehicle[]
  currentPage: number
  totalPages: number
  total: number
  status?: string
  search?: string
}

export default function VehiclesTable({
  vehicles,
  currentPage,
  totalPages,
  total,
}: VehiclesTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data?.error || 'Error al eliminar vehículo'
        console.error('Delete error:', errorMessage, data)
        alert(`Error: ${errorMessage}`)
        return
      }

      // Verificar que la respuesta sea exitosa
      if (data.success) {
        // Forzar recarga completa de la página para asegurar que se actualice
        router.refresh()
        // También hacer un refresh del router después de un pequeño delay
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        throw new Error(data.error || 'Error al eliminar vehículo')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Error al eliminar el vehículo: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setDeletingId(null)
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white border border-gray-100 p-8 sm:p-16 text-center">
        <p className="text-gray-500 text-base sm:text-lg font-light mb-6">
          No hay vehículos registrados
        </p>
        <Link
          href="/admin/vehicles/new"
          className="bg-[#802223] hover:bg-[#6b1d1e] text-white px-6 sm:px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation inline-flex items-center justify-center gap-2"
        >
          <span className="text-lg">📁</span>
          Agregar Primer Vehículo
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100">

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4 p-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
            <div className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                {vehicle.imagen ? (
                  <Image
                    src={vehicle.imagen}
                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 rounded flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {vehicle.marca} {vehicle.modelo}
                </h3>
                <p className="text-sm text-gray-500">{vehicle.anio}</p>
                <p className="text-[#802223] font-medium mt-1">
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                  }).format(vehicle.precio)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span
                className={`px-2.5 py-1 text-xs font-semibold tracking-wider uppercase rounded-full ${vehicle.estado === 'disponible'
                    ? 'bg-green-100 text-green-800'
                    : vehicle.estado === 'vendido'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {vehicle.estado}
              </span>

              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/vehicles/${vehicle.id}/edit`}
                  className="text-sm font-medium text-[#161b39]"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  disabled={deletingId === vehicle.id}
                  className="text-sm font-medium text-red-600 disabled:opacity-50"
                >
                  {deletingId === vehicle.id ? '...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Vehículo
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16">
                      {vehicle.imagen ? (
                        <Image
                          src={vehicle.imagen}
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          width={64}
                          height={64}
                          className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded"
                          onError={(e) => {
                            // Si la imagen falla, mostrar un placeholder
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyOC42ODYzIDIwIDI2IDIyLjY4NjMgMjYgMjZDMjYgMjkuMzEzNyAyOC42ODYzIDMyIDMyIDMyQzM1LjMxMzcgMzIgMzggMjkuMzEzNyAzOCAyNkMzOCAyMi42ODYzIDM1LjMxMzcgMjAgMzIgMjBaTTMyIDM2QzI1LjM3MjYgMzYgMjAgNDEuMzcyNiAyMCA0OEgyMEMyMCA1NC42Mjc0IDI1LjM3MjYgNjAgMzIgNjBDMzguNjI3NCA2MCA0NCA1NC42Mjc0IDQ0IDQ4SDQ0QzQ0IDQxLjM3MjYgMzguNjI3NCAzNiAzMiAzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-200 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.marca} {vehicle.modelo}
                      </div>
                      <div className="text-xs text-gray-500">
                        {vehicle.anio}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                  }).format(vehicle.precio)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-full ${vehicle.estado === 'disponible'
                        ? 'bg-green-100 text-green-800'
                        : vehicle.estado === 'vendido'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {vehicle.estado}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/vehicles/${vehicle.id}/edit`}
                    className="inline-flex items-center gap-1 text-[#161b39] hover:text-[#802223] transition-colors underline-offset-2 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    disabled={deletingId === vehicle.id}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 underline-offset-2 hover:underline"
                  >
                    {deletingId === vehicle.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 sm:px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * 20) + 1} a{' '}
            {Math.min(currentPage * 20, total)} de {total} vehículos
          </div>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/vehicles?page=${currentPage - 1}`}
                className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-50"
              >
                Anterior
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/admin/vehicles?page=${currentPage + 1}`}
                className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-50"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
