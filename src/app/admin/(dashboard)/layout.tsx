import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar autenticación
  const user = await getCurrentUser()

  // Si no hay usuario, redirigir al login
  // Esto protege TODAS las rutas bajo (dashboard)
  if (!user) {
    redirect('/admin/login')
  }

  // Si está autenticado, usar el layout completo de admin
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
