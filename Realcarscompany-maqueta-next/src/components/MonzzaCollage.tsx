'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const motoImages = [
  '/images/brand/moto1.jpeg',
  '/images/brand/moto2.jpeg',
  '/images/brand/moto3.jpeg',
  '/images/brand/moto4.jpeg'
]

export default function MonzzaCollage() {
  return (
    <>
      {/* fondo base consistente con el hero */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F2C] via-[#141A36] to-[#541313]" />
        {/* capa oro muy sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_50%,rgba(212,175,55,0.10),rgba(0,0,0,0)_65%)]" />
      </div>

      {/* contenedor del collage */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center md:justify-end px-4 md:px-10">
        <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-12 gap-3 md:gap-5">
          {/* imagen principal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
            className="md:col-span-7 relative rounded-xl md:rounded-2xl ring-1 ring-white/10 shadow-2xl overflow-hidden"
          >
            <div className="aspect-[16/10]">
              <Image
                src={motoImages[0]}
                alt="Sorteo MONZZA - Premio principal"
                fill
                className="object-cover"
                quality={75}
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 60vw, 45vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
          </motion.div>

          {/* columna de miniaturas - solo visible en tablet+ */}
          <div className="hidden md:grid md:col-span-5 grid-rows-3 gap-3 md:gap-5">
            {[motoImages[1], motoImages[2], motoImages[3]].map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 + i * 0.12 }}
                className="relative overflow-hidden rounded-xl md:rounded-2xl ring-1 ring-white/10 shadow-xl"
              >
                <div className="aspect-[16/9]">
                  <Image
                    src={src}
                    alt={`Sorteo MONZZA ${i + 2}`}
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 1024px) 30vw, 22vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* degradado lateral para integrar con el bloque de texto */}
      <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#0A0F2C]/65 via-[#0A0F2C]/20 to-transparent" />
    </>
  )
}
