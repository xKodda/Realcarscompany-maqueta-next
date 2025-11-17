import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AdminBreadcrumbs from '@/components/AdminBreadcrumbs'
import VehicleForm from '../VehicleForm'

export default async function NewVehiclePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  const breadcrumbItems = [
    { label: 'Vehículos', href: '/admin/vehicles' },
    { label: 'Nuevo Vehículo', current: true },
  ]

  return (
    <div>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#161b39] mb-2 tracking-tight">
          Agregar <span className="font-semibold">Vehículo</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Completa el formulario para agregar un nuevo vehículo al inventario
        </p>
      </div>

      <VehicleForm />
    </div>
  )
}

