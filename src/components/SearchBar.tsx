'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAutoSearch } from '@/hooks/useAutos'
import type { Auto } from '@/lib/types'
import { ClientPortal } from '@/components/ClientPortal'

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { setQuery, results, loading } = useAutoSearch()

  // Cerrar al hacer clic fuera (solo afecta al dropdown desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Actualizar query cuando cambia searchQuery
  useEffect(() => {
    setQuery(searchQuery)
  }, [searchQuery, setQuery])

  // Bloquear scroll en móvil cuando el buscador está abierto
  useEffect(() => {
    if (isOpen && searchQuery.trim()) {
      // Solo bloquear en móvil
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        const scrollY = window.scrollY
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'
        document.body.style.overflow = 'hidden'

        return () => {
          const scrollYRestored = parseInt(document.body.style.top || '0', 10) * -1
          document.body.style.position = ''
          document.body.style.top = ''
          document.body.style.width = ''
          document.body.style.overflow = ''
          window.scrollTo(0, scrollYRestored || scrollY)
        }
      }
    }
  }, [isOpen, searchQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setIsOpen(value.trim().length > 0)
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setSearchQuery('')
  }

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const getImageUrl = (auto: Auto): string => {
    if (auto.imagen) return auto.imagen
    if (auto.vehicleImages && auto.vehicleImages.length > 0) {
      return auto.vehicleImages[0].imageUrl
    }
    return '/images/brand/realcarscompanylogo.png'
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-lg mx-4">
      {/* Input de búsqueda (uno solo para todo) */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchQuery.trim()) setIsOpen(true)
          }}
          placeholder="Buscar vehículo..."
          className="w-full px-4 py-2 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#802223] focus:border-transparent text-sm text-[#161b39] placeholder-gray-400 transition-all"
          aria-label="Buscar vehículos"
        />

        {/* Icono de búsqueda */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Icono de limpiar */}
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#802223] transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* --------- DESKTOP: dropdown normal --------- */}
      <AnimatePresence>
        {isOpen && searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="hidden md:block absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[60vh] overflow-y-auto z-[9999]"
          >
            {loading ? (
              <div className="p-6 text-center bg-white">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#802223]" />
                <p className="mt-4 text-sm font-medium text-gray-700">
                  Buscando...
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="bg-white">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  {results.length}{' '}
                  {results.length === 1
                    ? 'vehículo encontrado'
                    : 'vehículos encontrados'}
                </div>

                {results.map((auto: Auto) => (
                  <Link
                    key={auto.id}
                    href={`/autos/${auto.id}`}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={getImageUrl(auto)}
                          alt={`${auto.marca} ${auto.modelo}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#161b39] text-sm truncate">
                          {auto.marca} {auto.modelo}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {auto.año} •{' '}
                          {auto.kilometraje.toLocaleString('es-CL')} km
                        </p>
                        <p className="text-sm font-bold text-[#802223] mt-1">
                          {formatPrice(auto.precio)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-white">
                <svg
                  className="mx-auto h-10 w-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-3 text-sm font-medium text-gray-600">
                  No se encontraron vehículos
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Intenta con otra búsqueda
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------- MÓVIL: overlay fullscreen usando PORTAL --------- */}
      <ClientPortal>
        <AnimatePresence>
          {isOpen && searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[99999] bg-white md:hidden flex flex-col"
            >
              {/* Header móvil */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <Image
                  src="/images/brand/realcarscompanylogo.png"
                  alt="RealCars Company"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setSearchQuery('')
                  }}
                  className="text-[#161b39] hover:text-[#802223] transition-colors p-2 -mr-2"
                  aria-label="Cerrar búsqueda"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Input móvil */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Buscar vehículo..."
                    className="w-full px-4 py-3 pl-10 pr-10 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#802223] focus:border-[#802223] text-base text-[#161b39] placeholder-gray-400"
                    aria-label="Buscar vehículos"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        inputRef.current?.focus()
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#802223] transition-colors"
                      aria-label="Limpiar búsqueda"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {!loading && results.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-[#161b39] uppercase tracking-wider">
                    {results.length}{' '}
                    {results.length === 1
                      ? 'VEHÍCULO ENCONTRADO'
                      : 'VEHÍCULOS ENCONTRADOS'}
                  </p>
                )}
              </div>

              {/* Resultados móvil */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center bg-white">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#802223]" />
                    <p className="mt-4 text-base font-medium text-gray-700">
                      Buscando...
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="bg-white">
                    {results.map((auto: Auto) => (
                      <Link
                        key={auto.id}
                        href={`/autos/${auto.id}`}
                        onClick={handleResultClick}
                        className="block px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={getImageUrl(auto)}
                              alt={`${auto.marca} ${auto.modelo}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#161b39] text-base truncate">
                              {auto.marca} {auto.modelo}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {auto.año} •{' '}
                              {auto.kilometraje.toLocaleString('es-CL')} km
                            </p>
                            <p className="text-base font-bold text-[#802223] mt-1.5">
                              {formatPrice(auto.precio)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-3 text-base font-medium text-gray-600">
                      No se encontraron vehículos
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Intenta con otra búsqueda
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ClientPortal>
    </div>
  )
}
