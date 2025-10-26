'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useAutoSearch } from '@/hooks/useAutos'
import type { Auto } from '@/lib/types'

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { query, setQuery, results, loading } = useAutoSearch()
  
  // Manejar clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Actualizar query cuando cambia searchQuery
  useEffect(() => {
    setQuery(searchQuery)
  }, [searchQuery, setQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsOpen(true)
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

  return (
    <div ref={searchRef} className="relative flex-1 max-w-lg mx-4">
      {/* Input de búsqueda */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar vehículo..."
          className="w-full px-4 py-2 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#802223] focus:border-transparent text-sm text-[#161b39] placeholder-gray-400 transition-all"
          aria-label="Buscar vehículos"
        />
        
        {/* Icono de búsqueda */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#802223] transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      <AnimatePresence>
        {isOpen && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-[#802223]"></div>
                <p className="mt-2">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  {results.length} {results.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
                </div>
                {results.map((auto) => (
                  <Link
                    key={auto.id}
                    href={`/autos/${auto.id}`}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={auto.imagen}
                          alt={`${auto.marca} ${auto.modelo}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#161b39] text-sm truncate">
                          {auto.marca} {auto.modelo}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {auto.año} • {auto.kilometraje.toLocaleString('es-CL')} km
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
              <div className="p-6 text-center">
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
                <p className="mt-2 text-sm text-gray-500">No se encontraron vehículos</p>
                <p className="text-xs text-gray-400 mt-1">Intenta con otra búsqueda</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

