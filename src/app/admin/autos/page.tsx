import AutoCard from '@/components/AutoCard'
import { autos } from '@/lib/data'

export default function AdminAutosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-light text-[#161b39] mb-2 tracking-tight">
            Gestión de <span className="font-semibold">Autos</span>
          </h1>
          <p className="text-gray-600 font-light">
            Administra el inventario de vehículos premium
          </p>
        </div>
        
        <button className="bg-[#802223] hover:bg-[#6b1d1e] text-white px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all">
          + Agregar Auto
        </button>
      </div>

      <div className="bg-white border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-green-600 pl-6">
            <p className="text-sm tracking-wider uppercase text-gray-600 mb-1">Disponibles</p>
            <p className="text-3xl font-light text-[#161b39]">
              {autos.filter((a) => a.estado === 'disponible').length}
            </p>
          </div>
          <div className="border-l-4 border-[#802223] pl-6">
            <p className="text-sm tracking-wider uppercase text-gray-600 mb-1">Vendidos</p>
            <p className="text-3xl font-light text-[#161b39]">
              {autos.filter((a) => a.estado === 'vendido').length}
            </p>
          </div>
          <div className="border-l-4 border-yellow-600 pl-6">
            <p className="text-sm tracking-wider uppercase text-gray-600 mb-1">Reservados</p>
            <p className="text-3xl font-light text-[#161b39]">
              {autos.filter((a) => a.estado === 'reservado').length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {autos.map((auto) => (
          <div key={auto.id}>
            <AutoCard auto={auto} />
            <div className="mt-3 flex gap-2">
              <button className="flex-1 bg-[#161b39] hover:bg-[#802223] text-white px-4 py-3 text-sm font-medium tracking-wider uppercase transition-all">
                Editar
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600 px-4 py-3 text-sm font-medium tracking-wider uppercase transition-all">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {autos.length === 0 && (
        <div className="bg-white border border-gray-100 p-16 text-center">
          <p className="text-gray-500 text-lg font-light mb-6">
            No hay autos registrados
          </p>
          <button className="bg-[#802223] hover:bg-[#6b1d1e] text-white px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all">
            Agregar Primer Auto
          </button>
        </div>
      )}
    </div>
  )
}
