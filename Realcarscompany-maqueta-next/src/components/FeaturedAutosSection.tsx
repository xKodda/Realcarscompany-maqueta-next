'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AutoCard from '@/components/AutoCard'
import type { Auto } from '@/lib/types'

interface FeaturedAutosSectionProps {
  autos: Auto[] | null
}

export default function FeaturedAutosSection({ autos }: FeaturedAutosSectionProps) {
  if (!autos) {
    return (
      <section className="py-16 sm:py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 text-red-800 p-8 rounded-lg max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-3">No pudimos cargar los vehículos</h3>
            <p className="mb-6 opacity-80">Estamos teniendo problemas temporales, por favor intenta nuevamente.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#802223] text-white rounded-full hover:bg-[#6b1d1e] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20 md:py-32 bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-light text-[#161b39] mb-4 sm:mb-6 tracking-tight">
            Últimos <span className="font-semibold">agregados</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed px-4">
            Los vehículos más recientes que hemos agregado a nuestro inventario
          </p>
        </motion.div>

        {autos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {autos.map((auto, index) => (
              <AutoCard key={auto.id} auto={auto} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="max-w-xl mx-auto px-4">
              <h3 className="text-xl sm:text-2xl font-light text-[#161b39] mb-3">
                Inventario Actualizándose
              </h3>
              <p className="text-gray-500 font-light text-lg">
                Por ahora no tenemos vehículos publicados, pero pronto habrá novedades.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/autos"
            className="inline-flex items-center gap-2 bg-[#802223] hover:bg-[#6b1d1e] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium tracking-wider uppercase transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 touch-manipulation"
          >
            Ver todos los autos
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

