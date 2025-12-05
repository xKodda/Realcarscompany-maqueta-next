'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function SafePurchaseSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        {/* Header de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-block mb-3 sm:mb-4 md:mb-6 px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-[#161b39] rounded-xl md:rounded-2xl shadow-lg">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white">
              Compra tu auto de manera <span className="font-semibold">segura</span>
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed px-4">
            Tu tranquilidad es nuestra prioridad. Te acompañamos en cada paso del proceso de compra
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Columna izquierda - Imágenes */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/10] group"
            >
              <Image
                src="https://i.pinimg.com/1200x/54/28/01/542801808cbac541af30a78bb9b3887e.jpg"
                alt="Negociación de compra de vehículo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                <p className="text-xs sm:text-sm font-medium">Asesoría personalizada</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/10] group"
            >
              <Image
                src="https://i.pinimg.com/1200x/6a/9a/66/6a9a661a89881207fcc24bf0c16e5bf5.jpg"
                alt="Inspección técnica de vehículo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                <p className="text-xs sm:text-sm font-medium">Inspección técnica</p>
              </div>
            </motion.div>
          </div>

          {/* Columna derecha - Contenido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-6 sm:space-y-8">
              {/* Opciones de Pago */}
              <div className="flex gap-4 sm:gap-6 items-start p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#161b39] rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#161b39] mb-2 sm:mb-3">Opciones de Pago</h3>
                  <p className="text-gray-600 leading-relaxed mb-2 sm:mb-3 text-sm sm:text-base">
                    Te ofrecemos múltiples alternativas de financiamiento. Nuestros asesores te ayudarán a encontrar la opción que mejor se adapte a tu presupuesto.
                  </p>
                  <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                    <li>• Financiamiento directo</li>
                    <li>• Crédito automotriz</li>
                    <li>• Pago al contado</li>
                  </ul>
                </div>
              </div>

              {/* Inspección Completa */}
              <div className="flex gap-6 items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#161b39] rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#161b39] mb-3">Inspección Completa</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    Cada vehículo es sometido a una inspección técnica exhaustiva por mecánicos certificados, garantizando su óptimo funcionamiento.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Inspección exhaustiva en todos los sistemas</li>
                    <li>• Certificación mecánica</li>
                    <li>• Garantía incluida</li>
                  </ul>
                </div>
              </div>

              {/* Transparencia Total */}
              <div className="flex gap-6 items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#161b39] rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#161b39] mb-3">Transparencia Total</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    Acceso completo al historial del vehículo, incluyendo reportes de accidentes, mantenimientos realizados y estado legal actualizado.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Historial completo</li>
                    <li>• Sin multas pendientes</li>
                    <li>• Documentación legal</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link 
                href="/autos"
                className="inline-flex items-center gap-2 bg-[#802223] hover:bg-[#6b1d1e] text-white px-8 py-4 text-lg font-medium tracking-wider uppercase transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Comprar un auto
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

