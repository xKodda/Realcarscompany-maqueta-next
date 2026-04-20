'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FinalCTASection() {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-light text-[#161b39] mb-6 tracking-tight">
            ¿Listo para encontrar tu <span className="font-semibold">auto ideal?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
            Contáctanos hoy mismo y descubre por qué somos la mejor opción para tu próxima compra
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/autos"
              className="inline-flex items-center justify-center gap-2 bg-[#802223] hover:bg-[#6b1d1e] text-white px-10 py-4 text-lg font-medium tracking-wider uppercase transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Ver catálogo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#161b39] text-[#161b39] hover:bg-[#161b39] hover:text-white px-10 py-4 text-lg font-medium tracking-wider uppercase transition-all duration-300 rounded-2xl"
            >
              Contactar
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

