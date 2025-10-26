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

            {/* Servicio 3 - Detallado de Automóviles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 text-[#802223] mb-6 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#161b39] mb-3 tracking-wide">
                Servicios de Detallado
              </h3>
              <p className="text-gray-600 font-light mb-4">
                Servicios profesionales de detallado automotriz para mantener tu vehículo en perfecto estado. Lavado premium, encerado y tratamientos especializados.
              </p>
              <Link
                href="/contacto"
                className="text-[#802223] hover:text-[#6b1d1e] font-medium text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Cotizar servicio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            {/* Servicio 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 text-[#802223] mb-6 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#161b39] mb-3 tracking-wide">
                Certificación
              </h3>
              <p className="text-gray-600 font-light mb-4">
                Inspección técnica completa de 150 puntos para garantizar la calidad de cada vehículo.
              </p>
              <Link
                href="/contacto"
                className="text-[#802223] hover:text-[#6b1d1e] font-medium text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Más info
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            {/* Servicio 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 text-[#802223] mb-6 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#161b39] mb-3 tracking-wide">
                Post-Venta
              </h3>
              <p className="text-gray-600 font-light mb-4">
                Servicio de mantenimiento, repuestos y asistencia continua para tu tranquilidad.
              </p>
              <Link
                href="/contacto"
                className="text-[#802223] hover:text-[#6b1d1e] font-medium text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Contactar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>

            {/* Servicio 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 text-[#802223] mb-6 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#161b39] mb-3 tracking-wide">
                Showroom
              </h3>
              <p className="text-gray-600 font-light mb-4">
                Espacio premium disponible para arriendo. Ideal para exhibir tu marca o productos.
              </p>
              <Link
                href="/showroom"
                className="text-[#802223] hover:text-[#6b1d1e] font-medium text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Ver espacio
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proceso de Atención */}
      <section className="py-20 bg-[#161b39] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
              Nuestro <span className="font-semibold">Proceso</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-12 font-light">
              Atención personalizada en cada paso del camino
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">01</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Consulta</h3>
                <p className="text-white/60 font-light text-sm">Escuchamos tus necesidades</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">02</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Asesoría</h3>
                <p className="text-white/60 font-light text-sm">Te guiamos en la mejor opción</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">03</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Cotización</h3>
                <p className="text-white/60 font-light text-sm">Propuesta personalizada</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">04</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Entrega</h3>
                <p className="text-white/60 font-light text-sm">Seguimiento continuo</p>
              </div>
            </div>
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
