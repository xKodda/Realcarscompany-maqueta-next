import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import AdminBreadcrumbs from '@/components/AdminBreadcrumbs'
import VehiclesTable from './VehiclesTable'

interface PageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    page?: string
  }>
}

export default async function AdminVehiclesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const status = params.status
  const search = params.search
  const page = parseInt(params.page || '1', 10)
  const limit = 20
  const skip = (page - 1) * limit

  // Build filters
  const where: any = {}
  if (status) {
    where.estado = status
  }
  if (search) {
    where.OR = [
      { marca: { contains: search, mode: 'insensitive' } },
      { modelo: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Fetch vehicles
  const [vehicles, total] = await Promise.all([
    prisma.auto.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicleImages: {
          orderBy: { position: 'asc' },
        },
      },
    }),
    prisma.auto.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  // Fetch statistics
  const [totalCount, disponibleCount, reservadoCount, vendidoCount] =
    await Promise.all([
      prisma.auto.count(),
      prisma.auto.count({ where: { estado: 'disponible' } }),
      prisma.auto.count({ where: { estado: 'reservado' } }),
      prisma.auto.count({ where: { estado: 'vendido' } }),
    ])

  const breadcrumbItems = [{ label: 'Vehículos', current: true }]

  // Convert Prisma Decimal and ensure plain objects for client component
  const vehiclesPlain = vehicles.map((v: any) => ({
    ...v,
    // Convert potential Prisma.Decimal to number or remove if null
    price: v.price != null ? Number(v.price) : null,
    createdAt: new Date(v.createdAt),
    updatedAt: new Date(v.updatedAt),
  }))

  return (
    <div>
      <AdminBreadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] mb-2 tracking-tight">
              Gestión de <span className="font-semibold">Vehículos</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-light">
              Administra el inventario de vehículos premium
            </p>
          </div>

          <Link
            href="/admin/vehicles/new"
            className="bg-[#802223] hover:bg-[#6b1d1e] text-white px-4 sm:px-6 lg:px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation flex items-center justify-center gap-2 rounded-none"
          >
            <span className="text-lg">📁</span>
            <span className="hidden sm:inline">Agregar Vehículo</span>
            <span className="sm:hidden">+ Vehículo</span>
          </Link>
        </div>

        {/* Toolbar de filtros y búsqueda */}
        <form
          method="GET"
          className="bg-white border border-gray-100 px-4 py-4 sm:px-6 sm:py-5 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4"
        >
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide">
              Buscar
            </label>
            <div className="flex">
              <input
                type="text"
                name="search"
                defaultValue={search || ''}
                placeholder="Marca, modelo o slug..."
                className="w-full px-3 py-2 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-4 bg-[#161b39] text-white text-sm tracking-wider uppercase hover:bg-[#802223] transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2 tracking-wide">
              Estado
            </label>
            <select
              name="status"
              defaultValue={status || ''}
              className="w-full px-3 py-2 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            >
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
        </form>
      </div>

      {/* Stats */}
      <div className="bg-white border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          <div className="border-l-4 border-green-600 pl-3 sm:pl-6">
            <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1">
              Disponibles
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#161b39]">
              {disponibleCount}
            </p>
          </div>
          <div className="border-l-4 border-[#802223] pl-3 sm:pl-6">
            <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1">
              Vendidos
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#161b39]">
              {vendidoCount}
            </p>
          </div>
          <div className="border-l-4 border-yellow-600 pl-3 sm:pl-6">
            <p className="text-xs sm:text-sm tracking-wider uppercase text-gray-600 mb-1">
              Reservados
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#161b39]">
              {reservadoCount}
            </p>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <VehiclesTable
        vehicles={vehiclesPlain}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        status={status}
        search={search}
      />
    </div>
  )
}

