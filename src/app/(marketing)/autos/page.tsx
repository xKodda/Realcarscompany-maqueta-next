'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import AutoCard from '@/components/AutoCard'
import { autos } from '@/lib/data'
import { CONTACTO } from '@/lib/constants'
import type { Auto } from '@/lib/types'

const Filters = dynamic(() => import('@/components/Filters'), {
  ssr: false,
  loading: () => (
    <div className="bg-white border-b border-gray-100 h-16 animate-pulse" />
  ),
})

export default function AutosPage() {
  const [filteredAutos, setFilteredAutos] = useState<Auto[]>(autos)
  return (
    <div className="min-h-screen bg-white">
      {/* Header de página premium */}
      <section className="bg-[#f2f2f4] py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-block mb-4 px-4 py-1.5 border border-[#802223] text-[#802223] text-xs tracking-[0.2em] uppercase">
              Colección Exclusiva
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-[#161b39] mb-6 tracking-tight">
              Catálogo <span className="font-semibold">premium</span>
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Descubre cada detalle de nuestra selecta colección de vehículos de lujo, 
              cuidadosamente seleccionados para los más exigentes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtros avanzados */}
      <Filters autos={autos} onFilteredAutos={setFilteredAutos} />

      {/* Grid de autos */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Contador de resultados */}
          <div className="mb-8">
            <p className="text-gray-600 font-light">
              Mostrando {filteredAutos.length} de {autos.length} vehículos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredAutos.map((auto, index) => (
              <AutoCard key={auto.id} auto={auto} index={index} />
            ))}
          </div>

          {filteredAutos.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-medium text-[#161b39] mb-2">
                  No se encontraron vehículos
                </h3>
                <p className="text-gray-500 font-light">
                  Intenta ajustar los filtros de búsqueda para encontrar tu vehículo ideal
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-[#f2f2f4]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light text-[#161b39] mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light">
              Contáctanos y te ayudaremos a encontrar tu vehículo ideal
            </p>
            <a
              href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, no encuentro lo que busco. ¿Pueden ayudarme?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contactar asesor
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
