'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AutoCard from '@/components/AutoCard'
import AddAutoModal from '@/components/AddAutoModal'
import AdminBreadcrumbs from '@/components/AdminBreadcrumbs'
import { autos } from '@/lib/data'

export default function AdminAutosPage() {
  const router = useRouter()
  const [selectedAuto, setSelectedAuto] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddAuto = async (autoData: any) => {
    try {
      // Aquí iría la lógica para guardar el auto
      console.log('Guardando auto:', autoData)
      // await autoService.create(autoData)
      alert('Auto agregado exitosamente!')
    } catch (error) {
      console.error('Error al guardar auto:', error)
      alert('Error al guardar el auto')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const breadcrumbItems = [
    { label: 'Autos', current: true }
  ]

  return (
    <div>
      {/* Breadcrumbs y navegación */}
      <AdminBreadcrumbs 
        items={breadcrumbItems}
        onBack={handleBack}
      />

      {/* Header optimizado para móvil */}
      <div className="mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] mb-2 tracking-tight">
              Gestión de <span className="font-semibold">Autos</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-light">
              Administra el inventario de vehículos premium
            </p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#802223] hover:bg-[#6b1d1e] text-white px-4 sm:px-6 lg:px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation flex items-center justify-center gap-2"
          >
            <span className="text-lg">📁</span>
            <span className="hidden sm:inline">Agregar Auto</span>
            <span className="sm:hidden">+ Auto</span>
          </button>
        </div>
      </div>

      {/* Stats optimizadas para móvil */}
      <div className="bg-white border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          <div className="border-l-4 border-green-600 pl-3 sm:pl-6">
            <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1">Disponibles</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#161b39]">
              {autos.filter((a) => a.estado === 'disponible').length}
            </p>
          </div>
          <div className="border-l-4 border-[#802223] pl-3 sm:pl-6">
            <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1">Vendidos</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#161b39]">
              {autos.filter((a) => a.estado === 'vendido').length}
            </p>
          </div>
          <div className="border-l-4 border-yellow-600 pl-3 sm:pl-6">
            <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1">Reservados</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#161b39]">
              {autos.filter((a) => a.estado === 'reservado').length}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de autos optimizado para móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {autos.map((auto) => (
          <div key={auto.id} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <AutoCard auto={auto} />
            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={() => setSelectedAuto(auto.id)}
                  className="flex-1 bg-[#161b39] hover:bg-[#802223] text-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all touch-manipulation flex items-center justify-center gap-1"
                >
                  <span>✏️</span>
                  <span className="hidden sm:inline">Editar</span>
                  <span className="sm:hidden">Editar</span>
                </button>
                <button className="flex-1 border-2 border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all touch-manipulation flex items-center justify-center gap-1">
                  <span>🗑️</span>
                  <span className="hidden sm:inline">Eliminar</span>
                  <span className="sm:hidden">Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {autos.length === 0 && (
        <div className="bg-white border border-gray-100 p-8 sm:p-16 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-gray-500 text-base sm:text-lg font-light mb-6">
            No hay autos registrados
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#802223] hover:bg-[#6b1d1e] text-white px-6 sm:px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation flex items-center justify-center gap-2 mx-auto"
          >
            <span className="text-lg">📁</span>
            Agregar Primer Auto
          </button>
        </div>
      )}

      {/* Modal para agregar auto */}
      <AddAutoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAuto}
      />
    </div>
  )
}
