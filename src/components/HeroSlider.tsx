'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import MonzzaCollage from './MonzzaCollage'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  cta: {
    primary: { text: string; href: string }
    secondary: { text: string; href: string }
  }
  badge?: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Lujo en cada',
    subtitle: 'detalle',
    description:
      'Descubre nuestra exclusiva colección de vehículos de lujo, donde la elegancia se encuentra con el rendimiento.',
    image: '/images/brand/banner2.jpeg',
    badge: 'Excelencia Automotriz',
    cta: {
      primary: { text: 'Explorar catálogo', href: '/autos' },
      secondary: { text: 'Agendar visita', href: '/contacto' }
    }
  },
  {
    id: 2,
    title: 'Proyecto MONZZA',
    subtitle: '',
    description:
      'La nueva plataforma de sorteos exclusivos de lujo.\nPropiedades, autos, joyas, relojes de alta gama y más.',
    image: '/images/brand/showroom1.jpeg',
    badge: 'Próximo Lanzamiento',
    cta: {
      primary: { text: 'Conocer más', href: '/contacto' },
      secondary: { text: 'Mantenerme informado', href: '/contacto' }
    }
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((p) => (p + 1) % slides.length)
    setIsAutoPlaying(false)
  }
  const prevSlide = () => {
    setCurrentSlide((p) => (p - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }
  const goToSlide = (i: number) => {
    setCurrentSlide(i)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative overflow-hidden text-white">
      {/* background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F2C] via-[#141A36] to-[#541313]" />
        {/* radial vignette para foco en centro-izquierda */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_25%_45%,rgba(255,255,255,0.12),rgba(0,0,0,0)_50%)]" />
      </div>

      {/* capa de slides (imagen o collage) */}
      <div className="relative h-[100vh] sm:h-[90vh] md:h-[72vh] min-h-[600px] sm:min-h-[500px] md:min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {currentSlide === 1 ? (
              <MonzzaCollage />
            ) : (
              <>
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  fill
                  className="object-cover opacity-55"
                  priority={currentSlide === 0}
                  sizes="100vw"
                  quality={75}
                />
                {/* overlay de cohesión de color */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F2C]/55 via-[#0A0F2C]/30 to-[#541313]/55" />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* contenido */}
        <div className="container relative z-20 mx-auto h-full px-3 sm:px-4 md:px-6">
          <div className="flex h-full items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-12 backdrop-blur-md"
              >
                 {/* badge */}
                 <div className="mb-4 sm:mb-6 inline-block border border-white/30 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 text-xs uppercase tracking-[0.2em]">
                   {slides[currentSlide].badge}
                 </div>

                {/* título */}
                <h1 className="mb-3 sm:mb-4 md:mb-5 text-2xl sm:text-3xl md:text-6xl leading-[1.05] tracking-tight">
                  <span className="block font-extrabold text-xl sm:text-2xl md:text-5xl">
                    {slides[currentSlide].title}
                  </span>
                  <span
                    className="block font-black text-xl sm:text-2xl md:text-5xl mt-1"
                    style={{
                      textShadow: '0 6px 28px rgba(0,0,0,.35)'
                    }}
                  >
                    {slides[currentSlide].subtitle}
                  </span>
                </h1>

                {/* descripción */}
                <div className="mb-6 sm:mb-8 md:mb-10 max-w-2xl text-sm sm:text-base md:text-xl leading-relaxed text-white/90">
                  {slides[currentSlide].description.split('\n').map((line, i) => (
                    <p key={i} className={i === 0 ? 'mb-1' : ''}>
                      {line}
                    </p>
                  ))}
                </div>

                 {/* CTAs */}
                 <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:gap-4">
                   <Link
                     href={slides[currentSlide].cta.primary.href}
                     className="inline-block border-2 border-white bg-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-[#161b39] transition-all hover:bg-[#802223] hover:border-[#802223] hover:text-white text-center touch-manipulation"
                   >
                     {slides[currentSlide].cta.primary.text}
                   </Link>
                   <Link
                     href={slides[currentSlide].cta.secondary.href}
                     className="inline-block border-2 border-white/70 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-white hover:border-white hover:text-[#161b39] text-center touch-manipulation"
                   >
                     {slides[currentSlide].cta.secondary.text}
                   </Link>
                 </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* flechas */}
        <button
          onClick={prevSlide}
          aria-label="Anterior"
          className="absolute left-3 sm:left-6 top-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition hover:bg-white/20 touch-manipulation"
        >
          <motion.svg whileHover={{ x: -2 }} className="mx-auto h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </motion.svg>
        </button>
        <button
          onClick={nextSlide}
          aria-label="Siguiente"
          className="absolute right-3 sm:right-6 top-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition hover:bg-white/20 touch-manipulation"
        >
          <motion.svg whileHover={{ x: 2 }} className="mx-auto h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </button>

        {/* dots */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 -translate-x-1/2 flex gap-2 sm:gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all touch-manipulation ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>

        {/* barra progreso */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/15">
          <motion.div
            key={currentSlide}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 8, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-[#7A1F20] via-[#D4AF37] to-[#E8D8A0]"
          />
        </div>

      </div>
    </section>
  )
}
