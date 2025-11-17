'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import SearchBar from './SearchBar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="hidden border-b border-gray-200 bg-[#161b39] text-white lg:block">
        <div className="container mx-auto flex items-center justify-end gap-6 px-6 py-2 text-xs font-medium tracking-wide">
          <a
            href="tel:+56987775463"
            className="flex items-center gap-2 transition-colors hover:text-[#25D366]"
          >
            <span className="sr-only">Llamar a RealCars Company</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 5.25c0-1.243 1.007-2.25 2.25-2.25h1.086c.746 0 1.41.497 1.607 1.215l.723 2.536a1.75 1.75 0 01-.401 1.644l-.982.983a15.963 15.963 0 006.928 6.928l.983-.982a1.75 1.75 0 011.644-.401l2.536.723c.718.197 1.215.861 1.215 1.607v1.086A2.25 2.25 0 0118.75 21h-1c-8.284 0-15-6.716-15-15v-.75z"
              />
            </svg>
            +56 9 8777 5463
          </a>
          <a
            href="https://wa.me/56987775463"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-[#25D366]"
          >
            <span className="sr-only">Abrir WhatsApp de RealCars Company</span>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
      <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5" aria-label="Navegación principal">
        <div className="flex items-center justify-between gap-4">
          <Link 
            href="/" 
            className="flex items-center transition-opacity hover:opacity-80 flex-shrink-0"
            aria-label="Ir al inicio - RealCars Company"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/images/brand/realcarscompanylogo.png"
              alt="RealCars Company - Automotora Premium"
              width={180}
              height={60}
              className="h-10 sm:h-12 md:h-14 w-auto"
              priority
            />
          </Link>
          
          {/* Buscador - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg">
            <SearchBar />
          </div>
          
          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center space-x-8 xl:space-x-10 flex-shrink-0">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[#161b39] hover:text-[#802223] transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Hamburger Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-[#161b39] p-2 touch-manipulation flex-shrink-0"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <motion.svg
              animate={isMenuOpen ? 'open' : 'closed'}
              className="w-6 h-6"
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 mt-2"
            >
              {/* Buscador - Mobile */}
              <div className="md:hidden px-4 py-3 border-b border-gray-100">
                <SearchBar />
              </div>
              
              <ul className="py-3 space-y-1">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-[#161b39] hover:bg-[#f2f2f4] hover:text-[#802223] transition-colors text-sm font-medium tracking-wide uppercase border-l-2 border-transparent hover:border-[#802223] touch-manipulation"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
