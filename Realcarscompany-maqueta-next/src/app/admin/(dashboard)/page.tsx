import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import RecentInventory from './RecentInventory'

interface PageProps {
  searchParams: Promise<{
    page?: string
  }>
}

const ITEMS_PER_PAGE = 10

export default async function AdminDashboard({ searchParams }: PageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const skip = (page - 1) * ITEMS_PER_PAGE

  // Fetch statistics from database
  let totalAutos = 0
  let autosDisponibles = 0
  let autosReservados = 0
  let autosVendidos = 0
  let recentAutos: any[] = []
  let totalCount = 0

  try {
    const results = await Promise.all([
      prisma.auto.count(),
      prisma.auto.count({ where: { estado: 'disponible' } }),
      prisma.auto.count({ where: { estado: 'reservado' } }),
      prisma.auto.count({ where: { estado: 'vendido' } }),
      prisma.auto.findMany({
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          marca: true,
          modelo: true,
          anio: true,
          precio: true,
          estado: true,
          vehicleImages: {
            take: 1,
            orderBy: { position: 'asc' },
            select: { imageUrl: true }
          },
        },
      }),
      prisma.auto.count(),
    ])

    totalAutos = results[0]
    autosDisponibles = results[1]
    autosReservados = results[2]
    autosVendidos = results[3]
    recentAutos = results[4].map((auto: any) => ({
      ...auto,
      imagen: auto.vehicleImages?.[0]?.imageUrl || ''
    }))
    totalCount = results[5]
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
    // Continuar con valores por defecto (0 y arrays vacíos)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const stats = [
    {
      title: 'Total Autos',
      value: totalAutos,
      color: 'bg-[#161b39]',
      link: '/admin/vehicles',
    },
    {
      title: 'Disponibles',
      value: autosDisponibles,
      color: 'bg-green-600',
      link: '/admin/vehicles?status=disponible',
    },
    {
      title: 'Reservados',
      value: autosReservados,
      color: 'bg-yellow-600',
      link: '/admin/vehicles?status=reservado',
    },
    {
      title: 'Vendidos',
      value: autosVendidos,
      color: 'bg-[#802223]',
      link: '/admin/vehicles?status=vendido',
    },
  ]

  return (
    <div>
      {/* Header optimizado para móvil */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Panel de control - Real Cars Company
        </p>
      </div>

      {/* Stats cards optimizadas para móvil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="bg-white border border-gray-100 hover:border-[#802223] p-3 sm:p-6 transition-all group touch-manipulation"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1 sm:mb-2">
                  {stat.title}
                </p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] group-hover:text-[#802223] transition-colors">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-white opacity-20 group-hover:opacity-100 transition-opacity mt-2 sm:mt-0`}
              >
                <span className="text-sm sm:text-lg lg:text-2xl">📊</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid optimizado para móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Acciones rápidas - Prioridad móvil */}
        <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden group">
          <div className="absolute inset-0">
            <Image
              src="/images/brand/showroom3.jpeg"
              alt="Showroom"
              fill
              className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-light text-[#161b39] mb-4 sm:mb-6 tracking-tight">
              Acciones <span className="font-semibold">Rápidas</span>
            </h2>
            <div className="space-y-2">
              <Link
                href="/admin/vehicles"
                className="block w-full bg-[#161b39] hover:bg-[#802223] text-white text-center py-3 sm:py-4 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation relative z-10"
              >
                Gestionar Vehículos
              </Link>
            </div>
          </div>
        </div>

        {/* Resumen de inventario */}
        <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-light text-[#161b39] mb-3 sm:mb-4 tracking-tight">
            Resumen de <span className="font-semibold">Inventario</span>
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm sm:text-base text-gray-600 font-light">
                Disponibles:
              </span>
              <span className="font-semibold text-green-600 text-base sm:text-lg">
                {autosDisponibles}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm sm:text-base text-gray-600 font-light">
                Reservados:
              </span>
              <span className="font-semibold text-yellow-600 text-base sm:text-lg">
                {autosReservados}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-sm sm:text-base text-gray-600 font-light">
                Vendidos:
              </span>
              <span className="font-semibold text-[#802223] text-base sm:text-lg">
                {autosVendidos}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#161b39] font-medium text-sm sm:text-base">
                Total:
              </span>
              <span className="font-semibold text-[#161b39] text-xl sm:text-2xl">
                {totalAutos}
              </span>
            </div>
          </div>
        </div>

        {/* Inventario reciente - Ocupa todo el ancho en móvil */}
        <RecentInventory
          autos={recentAutos}
          total={totalCount}
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  )
}
