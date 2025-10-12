'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Auto } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface AutoCardProps {
  auto: Auto
  index?: number
}

export default function AutoCard({ auto, index = 0 }: AutoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white border border-gray-100 hover:border-[#802223] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg"
    >
      {/* Imagen real del vehículo - Optimizada para mostrar el auto */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={auto.imagen}
          alt={`${auto.marca} ${auto.modelo} ${auto.año}`}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          loading={index > 2 ? 'lazy' : 'eager'}
        />
        {auto.destacado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 bg-[#802223] text-white px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            Destacado
          </motion.div>
        )}
        {auto.kilometraje === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            0 KM
          </motion.div>
        )}
        {auto.kilometraje > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            {auto.kilometraje.toLocaleString('es-CL')} km
          </motion.div>
        )}
      </div>
      
      <div className="p-6">
        {/* Marca y Modelo */}
        <h3 className="text-xl font-light text-[#161b39] mb-1 tracking-wide">
          {auto.marca}
        </h3>
        <p className="text-2xl font-semibold text-[#161b39] mb-4">
          {auto.modelo}
        </p>

        {/* Año */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            📅 {auto.año}
          </span>
        </div>

        {/* Precio */}
        <div className="mb-6">
          <p className="text-3xl font-light text-[#802223]">
            {formatPrice(auto.precio)}
          </p>
        </div>

        {/* Botón */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={`/autos/${auto.id}`}
            className="block w-full bg-[#161b39] hover:bg-[#802223] text-white text-center py-3 text-sm font-medium tracking-wider uppercase transition-all"
          >
            Ver Detalles
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
