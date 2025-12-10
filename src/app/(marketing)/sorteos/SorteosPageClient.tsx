'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SorteosPageClient() {
  return (
    <div className="min-h-screen bg-[#161b39] flex items-center justify-center relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/brand/moto2.jpeg"
          alt="Monzza Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#161b39] via-[#161b39]/90 to-[#802223]/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo or Brand Name */}
          <div className="mb-8">
            <span className="text-[#802223] font-bold tracking-[0.2em] text-xl md:text-2xl uppercase mb-2 block">
              RealCars Company presenta
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-4 italic">
              MONZZA
            </h1>
            <div className="h-1 w-32 bg-[#802223] mx-auto rounded-full" />
          </div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl md:text-5xl font-light text-white mb-8 tracking-wide"
          >
            PRÓXIMAMENTE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Estamos preparando una experiencia de sorteos premium única.
            Muy pronto podrás participar por vehículos exclusivos con total transparencia y seguridad.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-16"
          >
            <Link
              href="/"
              className="inline-block bg-[#802223] hover:bg-[#6b1d1e] text-white px-8 py-4 text-sm font-medium tracking-wider uppercase transition-all shadow-lg hover:shadow-xl rounded-sm hover:-translate-y-1"
            >
              Volver al Inicio
            </Link>
          </motion.div>

          {/* Gallery Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="w-full max-w-5xl mx-auto"
          >
            <h3 className="text-xl md:text-2xl text-white/80 font-light mb-8 uppercase tracking-widest border-t border-white/10 pt-8 mt-8">
              Adelanto Exclusivo: <span className="text-[#802223] font-semibold">Moto 2025</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                '/images/brand/moto2.jpeg',
                '/images/brand/moto1.jpeg',
                '/images/brand/moto3.jpeg',
                '/images/brand/moto4.jpeg'
              ].map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-square overflow-hidden rounded-lg border border-white/10 shadow-lg cursor-pointer group"
                >
                  <Image
                    src={img}
                    alt={`Adelanto Sorteo Monzza ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
            <p className="text-white/40 text-[10px] md:text-xs mt-6 uppercase tracking-[0.2em] font-light">
              Imágenes referenciales del modelo a sortear • Sujeto a disponibilidad
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
