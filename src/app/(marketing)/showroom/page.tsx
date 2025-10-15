'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SHOWROOM_INFO, CONTACTO } from '@/lib/constants'

export default function ShowroomPage() {
  const showroomImages = [
    {
      src: '/images/brand/showroom1.jpeg',
      alt: 'Showroom RealCars Company - Vista principal',
      title: 'Vista Principal del Showroom',
      description: 'Espacio amplio con iluminación profesional'
    },
    {
      src: '/images/brand/showroom2.jpeg',
      alt: 'Showroom RealCars Company - Área de exhibición',
      title: 'Área de Exhibición',
      description: 'Zona dedicada para presentación de vehículos'
    },
    {
      src: '/images/brand/showroom3.jpeg',
      alt: 'Showroom RealCars Company - Vista completa',
      title: 'Vista Completa del Espacio',
      description: 'Perspectiva total del showroom disponible'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
              Showroom <span className="font-semibold">en arriendo</span>
            </h1>
            <p className="text-xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
              Espacio de {SHOWROOM_INFO.espacioDisponible} disponible dentro de nuestras instalaciones de alta gama. 
              Ubicación estratégica y prestigio garantizado.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Información del Showroom - Simplificado */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Galería */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="inline-block mb-4 px-4 py-1.5 border border-[#802223] text-[#802223] text-xs tracking-[0.2em] uppercase">
                  Espacio premium
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-[#161b39] mb-4 tracking-tight">
                  {SHOWROOM_INFO.espacioDisponible} <span className="font-semibold">disponibles</span>
                </h2>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  Ubicación estratégica en {SHOWROOM_INFO.ubicacion} ideal para marcas automotrices y accesorios premium
                </p>
              </motion.div>

              <div className="space-y-6">
                {showroomImages.map((image, index) => (
                  <div key={index} className="group">
                    <div className="relative h-72 md:h-80 overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={75}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Características y Ventajas combinadas */}
            <div className="flex flex-col">
              <div className="bg-[#f2f2f4] p-8 mb-8">
                <h3 className="text-2xl font-light text-[#161b39] mb-6 tracking-tight">
                  ¿Qué <span className="font-semibold">incluye?</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {SHOWROOM_INFO.caracteristicas.slice(0, 6).map((caracteristica, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-[#802223] mt-1">✓</span>
                      <span className="text-gray-700 font-light">{caracteristica}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#161b39] text-white p-8 mb-8">
                <h3 className="text-2xl font-light mb-6 tracking-tight">
                  Ventajas <span className="font-semibold">principales</span>
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">👥</span>
                      <h4 className="text-lg font-medium">Alto tráfico</h4>
                    </div>
                    <p className="text-white/70 text-sm font-light">
                      Flujo constante de clientes premium
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">⭐</span>
                      <h4 className="text-lg font-medium">Prestigio</h4>
                    </div>
                    <p className="text-white/70 text-sm font-light">
                      Asocia tu marca con excelencia automotriz
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🤝</span>
                      <h4 className="text-lg font-medium">Sinergias</h4>
                    </div>
                    <p className="text-white/70 text-sm font-light">
                      Colaboración con marcas del sector
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-100 p-8">
                <h3 className="text-xl font-medium text-[#161b39] mb-6">
                  Información de contacto
                </h3>
                <div className="space-y-3 text-sm mb-6">
                  <p className="text-gray-600">
                    <span className="font-medium text-[#161b39]">Email:</span> {CONTACTO.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-[#161b39]">Teléfono:</span> {CONTACTO.telefono}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, me interesa el showroom en arriendo. ¿Podrían darme más información?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 text-sm font-medium tracking-wider uppercase transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light text-[#161b39] mb-6 tracking-tight">
              ¿Interesado en este <span className="font-semibold text-[#802223]">espacio?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 font-light leading-relaxed">
              Agenda una visita para conocer el showroom y todas sus posibilidades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, me gustaría agendar una visita al showroom.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Agendar visita
              </a>
              <a
                href="/contacto"
                className="inline-block border-2 border-[#161b39] text-[#161b39] hover:bg-[#161b39] hover:text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                Formulario de contacto
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
