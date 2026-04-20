'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import SearchBar from './SearchBar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Memoizar los items de navegación para evitar problemas de hidratación
  const navigationItems = useMemo(() => NAVIGATION_ITEMS, [])

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
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
            {navigationItems.map((item) => (
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
                {navigationItems.map((item) => (
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
