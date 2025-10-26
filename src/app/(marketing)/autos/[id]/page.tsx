'use client'

import { useState, use } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { autos } from '@/lib/data'
import { CONTACTO } from '@/lib/constants'
import { formatPrice, formatDate } from '@/lib/utils'

interface AutoPageProps {
  params: Promise<{
    id: string
  }>
}

export default function AutoDetailPage({ params }: AutoPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  
  const { id } = use(params)
  const auto = autos.find(a => a.id === id)

  if (!auto) {
    notFound()
  }

  // Crear galería de imágenes (imagen principal + imágenes adicionales si existen)
  const imageGallery = auto.imagenes 
    ? [auto.imagen, ...auto.imagenes] 
    : [auto.imagen]

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? imageGallery.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === imageGallery.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-[#f2f2f4] py-6">
        <div className="container mx-auto px-6">
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-sm"
          >
            <Link href="/" className="text-gray-600 hover:text-[#802223] transition-colors">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/autos" className="text-gray-600 hover:text-[#802223] transition-colors">
              Catálogo
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#161b39] font-medium">
              {auto.marca} {auto.modelo}
            </span>
          </motion.nav>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes mejorada */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Imagen principal */}
            <div 
              className="relative h-96 lg:h-[500px] overflow-hidden rounded-sm mb-4 cursor-pointer group"
              onClick={() => setIsGalleryOpen(true)}
            >
              <Image
                src={imageGallery[selectedImageIndex]}
                alt={`${auto.marca} ${auto.modelo} - vista ${selectedImageIndex + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                priority
              />
              
              {/* Overlay con zoom icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full">
                  <svg className="w-6 h-6 text-[#161b39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </div>

              {/* Badges */}
              {auto.destacado && (
                <div className="absolute top-6 left-6 bg-[#802223] text-white px-4 py-2 text-sm font-medium tracking-wider uppercase shadow-lg">
                  Destacado
                </div>
              )}

              {/* Controles de navegación si hay más de una imagen */}
              {imageGallery.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-6 h-6 text-[#161b39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Imagen siguiente"
                  >
                    <svg className="w-6 h-6 text-[#161b39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Indicador de imagen actual */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                    {selectedImageIndex + 1} / {imageGallery.length}
                  </div>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {imageGallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {imageGallery.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 overflow-hidden rounded-sm transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-[#802223]' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={img}
                      alt={`${auto.marca} ${auto.modelo} - miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Información del vehículo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-light text-[#161b39] mb-2 tracking-tight"
              >
                {auto.marca}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-semibold text-[#161b39] mb-4"
              >
                {auto.modelo}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-light text-[#802223] mb-4"
              >
                {formatPrice(auto.precio)}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span className={`px-3 py-1 text-xs font-medium tracking-wider uppercase ${
                  auto.estado === 'disponible' 
                    ? 'bg-green-100 text-green-700' 
                    : auto.estado === 'reservado'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {auto.estado === 'disponible' ? '✓ Disponible' : auto.estado === 'reservado' ? '⏰ Reservado' : '✕ Vendido'}
                </span>
              </motion.div>
            </div>

            {/* Especificaciones principales */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <div className="bg-[#f2f2f4] p-4 hover:bg-[#e8e8ea] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#802223]">📅</span>
                  <p className="text-xs text-gray-600 tracking-wider uppercase">Año</p>
                </div>
                <p className="text-lg font-medium text-[#161b39]">{auto.año}</p>
              </div>
              <div className="bg-[#f2f2f4] p-4 hover:bg-[#e8e8ea] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#802223]">📏</span>
                  <p className="text-xs text-gray-600 tracking-wider uppercase">Kilometraje</p>
                </div>
                <p className="text-lg font-medium text-[#161b39]">
                  {auto.kilometraje.toLocaleString('es-CL')} km
                </p>
              </div>
              <div className="bg-[#f2f2f4] p-4 hover:bg-[#e8e8ea] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#802223]">⚙️</span>
                  <p className="text-xs text-gray-600 tracking-wider uppercase">Transmisión</p>
                </div>
                <p className="text-lg font-medium text-[#161b39]">{auto.transmision}</p>
              </div>
              <div className="bg-[#f2f2f4] p-4 hover:bg-[#e8e8ea] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#802223]">⛽</span>
                  <p className="text-xs text-gray-600 tracking-wider uppercase">Combustible</p>
                </div>
                <p className="text-lg font-medium text-[#161b39]">{auto.combustible}</p>
              </div>
              <div className="bg-[#f2f2f4] p-4 hover:bg-[#e8e8ea] transition-colors col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#802223]">🎨</span>
                  <p className="text-xs text-gray-600 tracking-wider uppercase">Color</p>
                </div>
                <p className="text-lg font-medium text-[#161b39]">{auto.color}</p>
              </div>
            </motion.div>

            {/* Descripción */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-xl font-medium text-[#161b39] mb-4 flex items-center gap-2">
                <span className="text-[#802223]">📝</span>
                Descripción
              </h3>
              <p className="text-gray-700 font-light leading-relaxed">
                {auto.descripcion}
              </p>
            </motion.div>

            {/* Características */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <h3 className="text-xl font-medium text-[#161b39] mb-4 flex items-center gap-2">
                <span className="text-[#802223]">⭐</span>
                Características Premium
              </h3>
              <div className="grid grid-cols-1 gap-3 bg-[#f2f2f4] p-6 rounded-sm">
                {auto.caracteristicas.map((caracteristica, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + (index * 0.05) }}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-[#802223] text-sm mt-1 group-hover:scale-110 transition-transform">✓</span>
                    <span className="text-gray-700 font-light">{caracteristica}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Botones de acción */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(`Hola, me interesa el ${auto.marca} ${auto.modelo} ${auto.año}. ¿Está disponible?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 text-sm font-medium tracking-wider uppercase transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Consultar por WhatsApp
              </motion.a>
              <Link
                href="/contacto"
                className="flex-1 border-2 border-[#161b39] text-[#161b39] hover:bg-[#161b39] hover:text-white text-center py-4 text-sm font-medium tracking-wider uppercase transition-all inline-flex items-center justify-center"
              >
                Formulario de contacto
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CTA para ver más autos */}
      <section className="py-16 bg-[#f2f2f4]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light text-[#161b39] mb-4">
              ¿Te interesa otro vehículo?
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light">
              Explora nuestra colección completa de vehículos premium
            </p>
            <Link
              href="/autos"
              className="inline-block bg-[#802223] hover:bg-[#6b1d1e] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all shadow-lg hover:shadow-xl"
            >
              Ver todos los autos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal de galería fullscreen */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsGalleryOpen(false)}
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-[#802223] text-4xl z-10 transition-colors"
              aria-label="Cerrar galería"
            >
              ×
            </button>

            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative w-full h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={imageGallery[selectedImageIndex]}
                  alt={`${auto.marca} ${auto.modelo} - vista ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={90}
                />
              </motion.div>

              {imageGallery.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all"
                    aria-label="Imagen siguiente"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full">
                    {selectedImageIndex + 1} / {imageGallery.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
