import Link from 'next/link'
import { autos } from '@/lib/data'

export default function AdminDashboard() {
  const autosDisponibles = autos.filter((a) => a.estado === 'disponible').length
  const autosVendidos = autos.filter((a) => a.estado === 'vendido').length
  const autosReservados = autos.filter((a) => a.estado === 'reservado').length
  const totalAutos = autos.length

  const stats = [
    {
      title: 'Total Autos',
      value: totalAutos,
      color: 'bg-[#161b39]',
      link: '/admin/autos',
    },
    {
      title: 'Disponibles',
      value: autosDisponibles,
      color: 'bg-green-600',
      link: '/admin/autos',
    },
    {
      title: 'Reservados',
      value: autosReservados,
      color: 'bg-yellow-600',
      link: '/admin/autos',
    },
    {
      title: 'Vendidos',
      value: autosVendidos,
      color: 'bg-[#802223]',
      link: '/admin/autos',
    },
  ]

  return (
    <div>
      {/* Header optimizado para móvil */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Panel de control - Real Cars Company
        </p>
      </div>

      {/* Stats cards optimizadas para móvil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="bg-white border border-gray-100 hover:border-[#802223] p-3 sm:p-6 transition-all group touch-manipulation"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1 sm:mb-2">{stat.title}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] group-hover:text-[#802223] transition-colors">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-white opacity-20 group-hover:opacity-100 transition-opacity mt-2 sm:mt-0`}>
                <span className="text-sm sm:text-lg lg:text-2xl">📊</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid optimizado para móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Acciones rápidas - Prioridad móvil */}
        <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-light text-[#161b39] mb-4 sm:mb-6 tracking-tight">
            Acciones <span className="font-semibold">Rápidas</span>
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/autos"
              className="block w-full bg-[#161b39] hover:bg-[#802223] text-white text-center py-3 sm:py-4 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation"
            >
              📱 Gestionar Inventario
            </Link>
            <button className="block w-full border-2 border-[#161b39] text-[#161b39] hover:bg-[#161b39] hover:text-white text-center py-3 sm:py-4 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation">
              📁 Agregar Nuevo Auto
            </button>
          </div>
        </div>

        {/* Resumen de inventario */}
        <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-light text-[#161b39] mb-4 sm:mb-6 tracking-tight">
            Resumen de <span className="font-semibold">Inventario</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-100">
              <span className="text-sm sm:text-base text-gray-600 font-light">Disponibles:</span>
              <span className="font-semibold text-green-600 text-base sm:text-lg">{autosDisponibles}</span>
            </div>
            <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-100">
              <span className="text-sm sm:text-base text-gray-600 font-light">Reservados:</span>
              <span className="font-semibold text-yellow-600 text-base sm:text-lg">{autosReservados}</span>
            </div>
            <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-100">
              <span className="text-sm sm:text-base text-gray-600 font-light">Vendidos:</span>
              <span className="font-semibold text-[#802223] text-base sm:text-lg">{autosVendidos}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#161b39] font-medium text-sm sm:text-base">Total:</span>
              <span className="font-semibold text-[#161b39] text-xl sm:text-2xl">{totalAutos}</span>
            </div>
          </div>
        </div>

        {/* Inventario reciente - Ocupa todo el ancho en móvil */}
        <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 lg:col-span-2">
          <h2 className="text-xl sm:text-2xl font-light text-[#161b39] mb-4 sm:mb-6 tracking-tight">
            Inventario <span className="font-semibold">Reciente</span>
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {autos.slice(0, 5).map((auto) => (
              <div
                key={auto.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-[#f2f2f4] hover:bg-gray-100 transition-colors touch-manipulation"
              >
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="font-medium text-[#161b39] text-sm sm:text-base">
                    {auto.marca} {auto.modelo} {auto.año}
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
