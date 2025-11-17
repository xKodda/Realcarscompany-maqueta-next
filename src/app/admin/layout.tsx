import { headers } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener la ruta actual
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || headersList.get('referer') || ''
  
  // Si es la ruta de login, renderizar sin el layout de admin para evitar loops
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  // Verificar autenticación para otras rutas
  const user = await getCurrentUser()

  // Si no hay usuario autenticado, renderizar sin el layout de admin
  // (las páginas individuales manejarán sus propios redirects)
  if (!user) {
    return <>{children}</>
  }

  // Si está autenticado, usar el layout completo de admin
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
