'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    // Mostrar siempre al recargar
    setShouldShow(true)
    
    // Ocultar después de 2.5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // No renderizar nada si no debe mostrarse
  if (!shouldShow) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="text-center px-6">
            {/* Logo animado */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-12"
            >
              <Image
                src="/images/brand/realcarscompanylogo.png"
                alt="RealCars Company"
                width={400}
                height={130}
                className="h-24 md:h-32 w-auto mx-auto"
                priority
              />
            </motion.div>

            {/* Línea decorativa */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
              className="h-px bg-[#802223]/20 max-w-md mx-auto mb-10"
            />

            {/* Eslogan animado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="space-y-2"
            >
              <p className="text-[#161b39] text-xl md:text-2xl font-light tracking-wide">
                Movemos sueños,
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                className="text-[#802223] text-xl md:text-2xl font-light tracking-wide"
              >
                aceleramos oportunidades
              </motion.p>
            </motion.div>

            {/* Loader sutil */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
              className="mt-12"
            >
              <div className="flex justify-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-[#802223]/40 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-[#802223]/40 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-[#802223]/40 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
