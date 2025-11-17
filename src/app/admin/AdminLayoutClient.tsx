'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ADMIN_NAVIGATION_ITEMS } from '@/lib/constants'

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f2f2f4]">
      {/* Header móvil optimizado */}
      <nav className="bg-[#161b39] text-white border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/brand/realcarscompanylogo.png"
                  alt="RealCars Company"
                  width={150}
                  height={50}
                  className="h-8 sm:h-10 w-auto"
                />
              </Link>
              <span className="hidden sm:block text-xs sm:text-sm text-white/60 border-l border-white/20 pl-3 sm:pl-6 tracking-wider uppercase">
                Admin
              </span>
            </div>
            
            {/* Navegación desktop */}
            <ul className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {ADMIN_NAVIGATION_ITEMS.map((item) => (
                <li key={item.href} className="relative">
                  {item.comingSoon ? (
                    <span className="text-white/40 cursor-not-allowed text-xs xl:text-sm font-medium tracking-wide uppercase flex items-center gap-2">
                      {item.label}
                      <span className="text-[10px] xl:text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/60">
                        Próximamente
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white/80 hover:text-[#802223] transition-colors text-xs xl:text-sm font-medium tracking-wide uppercase"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Botones de acción */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="hidden sm:block text-xs sm:text-sm text-white/60 hover:text-white transition-colors tracking-wide"
              >
                ← Volver
              </Link>
              
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors tracking-wide"
              >
                Cerrar Sesión
              </button>
              
              {/* Botón hamburguesa móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white p-2 touch-manipulation"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <motion.svg
                  animate={isMobileMenuOpen ? 'open' : 'closed'}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    variants={{
                      closed: { d: 'M4 6h16M4 12h16M4 18h16' },
                      open: { d: 'M6 18L18 6M6 6l12 12' }
                    }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    transition={{ duration: 0.2 }}
                  />
                </motion.svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-white/10 bg-[#161b39]"
            >
              <div className="container mx-auto px-3 sm:px-6 py-4">
                <ul className="space-y-1">
                  {ADMIN_NAVIGATION_ITEMS.map((item) => (
                    <li key={item.href}>
                      {item.comingSoon ? (
                        <span
                          className="block px-3 py-3 text-white/40 cursor-not-allowed text-sm font-medium tracking-wide uppercase border-l-2 border-transparent flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">
                            Próximamente
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase border-l-2 border-transparent hover:border-[#802223] touch-manipulation"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li className="pt-2 border-t border-white/10">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-3 text-white/60 hover:text-white transition-colors text-sm tracking-wide touch-manipulation"
                    >
                      ← Volver al sitio
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-3 text-white/60 hover:text-white transition-colors text-sm tracking-wide touch-manipulation"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Contenido principal optimizado para móvil */}
      <main className="container mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
    </div>
  )
}

