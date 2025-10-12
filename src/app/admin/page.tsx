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
      <div className="mb-10">
        <h1 className="text-4xl font-light text-[#161b39] mb-2 tracking-tight">
          Dashboard <span className="font-semibold">Premium</span>
        </h1>
        <p className="text-gray-600 font-light">
          Panel de control - RealCars Company
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="bg-white border border-gray-100 hover:border-[#802223] p-6 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm tracking-wider uppercase text-gray-600 mb-2">{stat.title}</p>
                <p className="text-4xl font-light text-[#161b39] group-hover:text-[#802223] transition-colors">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-14 h-14 flex items-center justify-center text-white opacity-20 group-hover:opacity-100 transition-opacity`}>
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 p-8">
          <h2 className="text-2xl font-light text-[#161b39] mb-6 tracking-tight">
            Acciones <span className="font-semibold">Rápidas</span>
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/autos"
              className="block w-full bg-[#161b39] hover:bg-[#802223] text-white text-center py-4 text-sm font-medium tracking-wider uppercase transition-all"
            >
              Gestionar Inventario
            </Link>
            <button className="block w-full border-2 border-[#161b39] text-[#161b39] hover:bg-[#161b39] hover:text-white text-center py-4 text-sm font-medium tracking-wider uppercase transition-all">
              + Agregar Nuevo Auto
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8">
          <h2 className="text-2xl font-light text-[#161b39] mb-6 tracking-tight">
            Resumen de <span className="font-semibold">Inventario</span>
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-light">Autos Disponibles:</span>
              <span className="font-semibold text-green-600 text-lg">{autosDisponibles}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-light">Autos Reservados:</span>
              <span className="font-semibold text-yellow-600 text-lg">{autosReservados}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600 font-light">Autos Vendidos:</span>
              <span className="font-semibold text-[#802223] text-lg">{autosVendidos}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#161b39] font-medium">Total:</span>
              <span className="font-semibold text-[#161b39] text-2xl">{totalAutos}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 lg:col-span-2">
          <h2 className="text-2xl font-light text-[#161b39] mb-6 tracking-tight">
            Inventario <span className="font-semibold">Reciente</span>
          </h2>
          <div className="space-y-3">
            {autos.slice(0, 5).map((auto) => (
              <div
                key={auto.id}
                className="flex justify-between items-center p-4 bg-[#f2f2f4] hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-[#161b39]">
                    {auto.marca} {auto.modelo} {auto.año}
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                    }).format(auto.precio)}
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 text-xs font-medium tracking-wider uppercase ${
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
