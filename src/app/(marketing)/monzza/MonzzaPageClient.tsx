'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function MonzzaPageClient() {
  return (
    <div className="h-screen bg-[#050505] font-sans flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background Image / Texture */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/brand/moto2.jpeg"
          alt="Monzza Fondo"
          fill
          className="object-cover opacity-60 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* Brand Logo Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="inline-block relative">
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white select-none">
              MONZZA
            </h1>
            <div className="h-2 w-full bg-[#802223] absolute bottom-2 left-0 skew-x-[-15deg]" />
          </div>
          <p className="mt-4 text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase">
            Digital Collection
          </p>
        </motion.div>

        {/* Coming Soon Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="h-px w-24 bg-white/20 mx-auto" />

          <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
            Próximamente
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Estamos preparando una experiencia exclusiva para los amantes de la velocidad.
            <br />
            <span className="text-white font-medium">Sé parte del club RealCars.</span>
          </p>

          <div className="pt-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300 uppercase tracking-widest text-sm"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer / Decorative Elements */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/10 text-xs tracking-[0.3em] uppercase">RealCars Company &copy; 2025</p>
      </div>
    </div>
  )
}
