'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CONTACTO } from '@/lib/constants'

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header de página premium */}
      <section className="bg-gradient-to-br from-[#161b39] via-[#1d2447] to-[#802223] py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl text-center mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
              Nuestros <span className="font-semibold">servicios</span>
            </h1>
            <p className="text-xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
              Soluciones integrales para todas tus necesidades automotrices, 
              con el compromiso de excelencia que nos caracteriza.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#161b39] mb-4">
              Soluciones <span className="font-semibold">integrales</span>
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Ofrecemos una gama completa de servicios para satisfacer todas tus necesidades automotrices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Servicio 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 text-[#802223] mb-6 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#161b39] mb-3 tracking-wide">
                Venta de Vehículos de Lujo
              </h3>
              <p className="text-gray-600 font-light mb-4">
                Vehículos de lujo de las mejores marcas, cuidadosamente seleccionados y certificados para ofrecerte calidad y confianza.
              </p>
              <Link
                href="/autos"
                className="text-[#802223] hover:text-[#6b1d1e] font-medium text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Ver catálogo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            {/* Servicio 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 text-[#802223] mb-6 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#161b39] mb-3 tracking-wide">
                Financiamiento
              </h3>
              <p className="text-gray-600 font-light mb-4">
                Opciones de financiamiento flexibles y competitivas para hacer realidad tu vehículo ideal.
              </p>
              <Link
                href="/contacto"
                className="text-[#802223] hover:text-[#6b1d1e] font-medium text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Consultar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            {/* Servicio 3 - Consignación */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 text-[#802223] mb-6 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#161b39] mb-3 tracking-wide">
                Consignación
              </h3>
              <p className="text-gray-600 font-light mb-4">
                Vende tu vehículo sin complicaciones. Nos encargamos de todo el proceso mientras tú te relajas.
              </p>
              <Link
                href="/consignacion"
                className="text-[#802223] hover:text-[#6b1d1e] font-medium text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Más información
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#f2f2f4]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light text-[#161b39] mb-4">
              ¿Cómo podemos ayudarte?
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light">
              Contáctanos y te asesoraremos en lo que necesites
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center bg-[#802223] hover:bg-[#6b1d1e] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                Enviar mensaje
              </Link>
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, me gustaría conocer más sobre sus servicios.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
