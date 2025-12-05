'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { consultasService } from '@/lib/api/services/consultas.service'
import { useScrollLock } from '@/hooks/useScrollLock'

interface MonzzaInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MonzzaInfoModal({ isOpen, onClose }: MonzzaInfoModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validar email
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      return
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    setIsSubmitting(true)

    try {
      // Enviar como consulta de tipo monzza
      const response = await consultasService.create({
        nombre: 'Interesado en Monzza',
        email: email.trim(),
        telefono: '',
        mensaje: 'Solicitud de información sobre el lanzamiento de Monzza. Desea recibir avisos y actualizaciones.',
        tipo: 'sorteo'
      })

      if (response.success) {
        setShowSuccess(true)
        setEmail('')
        // Cerrar modal después de 3 segundos
        setTimeout(() => {
          setShowSuccess(false)
          onClose()
        }, 3000)
      } else {
        setError(response.error || 'Error al enviar. Por favor intenta nuevamente.')
      }
    } catch (err) {
      console.error('Error al enviar email:', err)
      setError('Error al conectar con el servidor. Por favor intenta más tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }, [email, onClose])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setEmail('')
      setError(null)
      setShowSuccess(false)
      onClose()
    }
  }, [isSubmitting, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose()
    }
  }, [handleClose, isSubmitting])

  // Bloquear scroll cuando el modal está abierto
  useScrollLock(isOpen)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="monzza-modal-title"
        style={{ isolation: 'isolate' }}
      >
        {/* Backdrop con múltiples capas para mejor efecto en móvil */}
        {/* Capa base sólida - completamente opaca en móvil para ocultar el fondo */}
        <div className="absolute inset-0 bg-black" style={{ zIndex: -1 }} />
        {/* Capa de blur para desktop - no afecta si no se soporta */}
        <div className="absolute inset-0 backdrop-blur-xl sm:backdrop-blur-lg" style={{ zIndex: -1 }} />
        {/* Capa adicional de oscurecimiento para desktop */}
        <div className="absolute inset-0 bg-black/50 sm:bg-black/30" style={{ zIndex: -1 }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative bg-white max-w-md w-full rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#161b39] via-[#1d2447] to-[#802223] px-6 py-5 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_50%,rgba(212,175,55,0.15),rgba(0,0,0,0)_65%)]" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="inline-block mb-2 px-3 py-1 border border-white/30 bg-white/10 backdrop-blur-sm text-xs uppercase tracking-wider rounded-full">
                    Próximamente
                  </div>
                  <h2
                    id="monzza-modal-title"
                    className="text-2xl font-light tracking-tight"
                  >
                    MONZZA
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-white/70 hover:text-white transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Cerrar modal"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {showSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#161b39] mb-2">
                  ¡Perfecto!
                </h3>
                <p className="text-gray-600 mb-1">
                  Te mantendremos informado sobre el lanzamiento de <strong>MONZZA</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Recibirás un email con todas las novedades
                </p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-light text-[#161b39] mb-3 tracking-tight">
                    Sé el primero en conocer
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    Próximamente lanzaremos <strong className="text-[#802223]">MONZZA</strong>, nuestra promoción comercial exclusiva.
                  </p>
                  <p className="text-sm text-gray-500">
                    Ingresa tu correo y te notificaremos cuando esté disponible. También recibirás información sobre los primeros sorteos.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
                      role="alert"
                    >
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label
                      htmlFor="monzza-email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="monzza-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError(null)
                      }}
                      placeholder="tu@correo.com"
                      required
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#802223] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 placeholder:text-gray-400 ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                      aria-invalid={!!error}
                      aria-describedby={error ? 'email-error' : undefined}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="w-full bg-gradient-to-r from-[#802223] to-[#6b1d1e] hover:from-[#6b1d1e] hover:to-[#802223] text-white px-6 py-3 rounded-lg font-medium tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      'Quiero estar informado'
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Al registrarte, aceptas recibir comunicaciones sobre MONZZA.
                  Puedes cancelar tu suscripción en cualquier momento.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence >
  )
}
