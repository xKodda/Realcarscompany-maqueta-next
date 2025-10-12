import Link from 'next/link'
import Image from 'next/image'
import { ADMIN_NAVIGATION_ITEMS } from '@/lib/constants'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f2f2f4]">
      <nav className="bg-[#161b39] text-white border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/">
                <Image
                  src="/images/brand/realcarscompanylogo.png"
                  alt="RealCars Company"
                  width={150}
                  height={50}
                  className="h-10 w-auto brightness-0 invert"
                />
              </Link>
              <span className="text-sm text-white/60 border-l border-white/20 pl-6 tracking-wider uppercase">
                Panel de Administración
              </span>
            </div>
            
            <ul className="flex items-center space-x-8">
              {ADMIN_NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-[#802223] transition-colors text-sm font-medium tracking-wide uppercase"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors tracking-wide"
            >
              ← Volver al sitio
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
