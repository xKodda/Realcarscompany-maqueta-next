import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminBreadcrumbs from '@/components/AdminBreadcrumbs'
import VehicleForm from '../../VehicleForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: PageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  const { id } = await params

  // Fetch vehicle with images
  const vehicle = await prisma.auto.findUnique({
    where: { id },
    include: {
      vehicleImages: {
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!vehicle) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'Vehículos', href: '/admin/vehicles' },
    { label: 'Editar Vehículo', current: true },
  ]

  return (
    <div>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] mb-2 tracking-tight">
          Editar <span className="font-semibold">Vehículo</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Actualiza la información del vehículo
        </p>
      </div>

      <VehicleForm vehicle={vehicle} />
    </div>
  )
}

