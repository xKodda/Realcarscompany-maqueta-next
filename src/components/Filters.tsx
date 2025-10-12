'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Auto } from '@/lib/types'

interface FiltersProps {
  autos: Auto[]
  onFilteredAutos: (filteredAutos: Auto[]) => void
}

interface FilterState {
  search: string
  marca: string
  precioMin: number
  precioMax: number
  añoMin: number
  añoMax: number
  kilometraje: string
  destacado: boolean | null
  transmision: string
  combustible: string
}

export default function Filters({ autos, onFilteredAutos }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    marca: '',
    precioMin: 0,
    precioMax: 50000000,
    añoMin: 2020,
    añoMax: 2024,
    kilometraje: '',
    destacado: null,
    transmision: '',
    combustible: ''
  })

  // Obtener valores únicos para los filtros
  const marcas = [...new Set(autos.map(auto => auto.marca))].sort()
  const transmisiones = [...new Set(autos.map(auto => auto.transmision))].sort()
  const combustibles = [...new Set(autos.map(auto => auto.combustible))].sort()
  const años = [...new Set(autos.map(auto => auto.año))].sort()

  // Aplicar filtros
  useEffect(() => {
    const filtered = autos.filter(auto => {
      // Búsqueda por texto
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchText = `${auto.marca} ${auto.modelo} ${auto.color}`.toLowerCase()
        if (!searchText.includes(searchTerm)) return false
      }

      // Filtro por marca
      if (filters.marca && auto.marca !== filters.marca) return false

      // Filtro por precio
      if (auto.precio < filters.precioMin || auto.precio > filters.precioMax) return false

      // Filtro por año
      if (auto.año < filters.añoMin || auto.año > filters.añoMax) return false

      // Filtro por kilometraje
      if (filters.kilometraje) {
        if (filters.kilometraje === '0' && auto.kilometraje !== 0) return false
        if (filters.kilometraje === 'seminuevo' && (auto.kilometraje === 0 || auto.kilometraje > 50000)) return false
        if (filters.kilometraje === 'usado' && auto.kilometraje <= 50000) return false
      }

      // Filtro por destacado
      if (filters.destacado !== null && auto.destacado !== filters.destacado) return false

      // Filtro por transmisión
      if (filters.transmision && auto.transmision !== filters.transmision) return false

      // Filtro por combustible
      if (filters.combustible && auto.combustible !== filters.combustible) return false

      return true
    })

    onFilteredAutos(filtered)
  }, [filters, autos, onFilteredAutos])

  const resetFilters = () => {
    setFilters({
      search: '',
      marca: '',
      precioMin: 0,
      precioMax: 50000000,
      añoMin: 2020,
      añoMax: 2024,
      kilometraje: '',
      destacado: null,
      transmision: '',
      combustible: ''
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const activeFiltersCount = [
    filters.search,
    filters.marca,
    filters.transmision,
    filters.combustible,
    filters.kilometraje,
    filters.destacado !== null,
    filters.precioMin > 0,
    filters.precioMax < 50000000,
  ].filter(Boolean).length

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-6">
        {/* Barra de control compacta */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-3 md:py-4 gap-3">
          {/* Búsqueda rápida */}
          <div className="flex-1 max-w-full sm:max-w-md">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar por marca, modelo..."
              className="w-full px-3 md:px-4 py-2 border border-gray-200 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors text-sm"
            />
          </div>

          {/* Botones de control */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 border border-gray-200 hover:border-[#802223] text-[#161b39] hover:text-[#802223] transition-colors text-xs md:text-sm font-medium whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filtros avanzados</span>
              <span className="sm:hidden">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#802223] text-white text-xs px-1.5 md:px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs md:text-sm text-gray-600 hover:text-[#802223] transition-colors px-2"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pb-4 md:pb-6 bg-[#f2f2f4] -mx-6 px-4 md:px-6 pt-4 md:pt-6 space-y-4 md:space-y-6">

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                  {/* Filtro por marca */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider">
                      Marca
                    </label>
                    <select
                      value={filters.marca}
                      onChange={(e) => setFilters(prev => ({ ...prev, marca: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors text-sm bg-white"
                    >
                      <option value="">Todas</option>
                      {marcas.map(marca => (
                        <option key={marca} value={marca}>{marca}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por transmisión */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider">
                      Transmisión
                    </label>
                    <select
                      value={filters.transmision}
                      onChange={(e) => setFilters(prev => ({ ...prev, transmision: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors text-sm bg-white"
                    >
                      <option value="">Todas</option>
                      {transmisiones.map(transmision => (
                        <option key={transmision} value={transmision}>{transmision}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por combustible */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider">
                      Combustible
                    </label>
                    <select
                      value={filters.combustible}
                      onChange={(e) => setFilters(prev => ({ ...prev, combustible: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors text-sm bg-white"
                    >
                      <option value="">Todos</option>
                      {combustibles.map(combustible => (
                        <option key={combustible} value={combustible}>{combustible}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por kilometraje */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider">
                      Kilometraje
                    </label>
                    <select
                      value={filters.kilometraje}
                      onChange={(e) => setFilters(prev => ({ ...prev, kilometraje: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors text-sm bg-white"
                    >
                      <option value="">Todos</option>
                      <option value="0">0 KM</option>
                      <option value="seminuevo">Seminuevo (&lt; 50k)</option>
                      <option value="usado">Usado (&gt; 50k)</option>
                    </select>
                  </div>

                  {/* Filtro por destacado */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider">
                      Destacados
                    </label>
                    <select
                      value={filters.destacado === null ? '' : filters.destacado.toString()}
                      onChange={(e) => setFilters(prev => ({ ...prev, destacado: e.target.value === '' ? null : e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-gray-200 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors text-sm bg-white"
                    >
                      <option value="">Todos</option>
                      <option value="true">Solo destacados</option>
                    </select>
                  </div>
                </div>

                {/* Filtros con sliders */}
                <div className="bg-white p-3 md:p-4 border border-gray-200">
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {/* Filtro de precio con slider */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-3 uppercase tracking-wider">
                        Precio: <span className="text-[#802223] font-semibold">{formatPrice(filters.precioMin)} - {formatPrice(filters.precioMax)}</span>
                      </label>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500 mb-1 block">Mínimo</span>
                          <input
                            type="range"
                            min="0"
                            max="50000000"
                            step="1000000"
                            value={filters.precioMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, precioMin: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 mb-1 block">Máximo</span>
                          <input
                            type="range"
                            min="0"
                            max="50000000"
                            step="1000000"
                            value={filters.precioMax}
                            onChange={(e) => setFilters(prev => ({ ...prev, precioMax: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Filtro de año con slider */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-3 uppercase tracking-wider">
                        Año: <span className="text-[#802223] font-semibold">{filters.añoMin} - {filters.añoMax}</span>
                      </label>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500 mb-1 block">Desde</span>
                          <input
                            type="range"
                            min="2020"
                            max="2024"
                            step="1"
                            value={filters.añoMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, añoMin: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 mb-1 block">Hasta</span>
                          <input
                            type="range"
                            min="2020"
                            max="2024"
                            step="1"
                            value={filters.añoMax}
                            onChange={(e) => setFilters(prev => ({ ...prev, añoMax: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
