'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CONTACTO } from '@/lib/constants'
import { useFormValidation } from '@/hooks/useFormValidation'
import { consultasService } from '@/lib/api/services/consultas.service'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })

  const [showSuccess, setShowSuccess] = useState(false)
  
  const {
    errors,
    isSubmitting,
    validateField,
    submitForm,
    clearErrors
  } = useFormValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    const success = await submitForm(formData, async (sanitizedData) => {
      try {
        // Enviar consulta a través del servicio
        const response = await consultasService.create({
          nombre: sanitizedData.nombre,
          email: sanitizedData.email,
          telefono: sanitizedData.telefono,
          mensaje: sanitizedData.mensaje,
          tipo: 'general'
        })

        if (response.success) {
          setShowSuccess(true)
          setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
          
          // Ocultar mensaje de éxito después de 5 segundos
          setTimeout(() => setShowSuccess(false), 5000)
        } else {
          throw new Error(response.error || 'Error al enviar el formulario')
        }
      } catch (error) {
        console.error('Error al enviar consulta:', error)
        throw error
      }
    })

    if (!success) {
      // Los errores ya se manejan en el hook
      console.log('Formulario no válido:', errors)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Validar campo en tiempo real
    validateField(name as keyof typeof formData, value)
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    validateField(name as keyof typeof formData, value)
  }

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
              Contáctanos
            </h1>
            <p className="text-xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
              Nuestro equipo de expertos está listo para ayudarte a encontrar 
              el vehículo perfecto para ti.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* Información de contacto */}
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-[#161b39] mb-8">
              Información de <span className="font-semibold">contacto</span>
            </h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-[#802223]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wider uppercase text-gray-600 mb-1">Email</h3>
                  <p className="text-lg text-[#161b39]">{CONTACTO.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-[#802223]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wider uppercase text-gray-600 mb-1">Teléfono</h3>
                  <p className="text-lg text-[#161b39]">{CONTACTO.telefono}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-[#802223]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wider uppercase text-gray-600 mb-1">Dirección</h3>
                  <p className="text-lg text-[#161b39]">{CONTACTO.direccion}</p>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-[#f2f2f4] p-8">
              <h3 className="text-xl font-light text-[#161b39] mb-6">Horario de Atención</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-light">Lunes a Viernes</span>
                  <span className="font-medium">{CONTACTO.horario.lunesViernes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light">Sábados</span>
                  <span className="font-medium">{CONTACTO.horario.sabado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light">Domingos</span>
                  <span className="font-medium">{CONTACTO.horario.domingo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div>
            <h2 className="text-3xl font-light text-[#161b39] mb-8">
              Envíanos un <span className="font-semibold">mensaje</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mensaje de éxito */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">
                      ¡Mensaje enviado exitosamente! Un asesor se comunicará contigo pronto.
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Error general */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{errors.general}</span>
                  </div>
                </motion.div>
              )}

              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                >
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  maxLength={100}
                  className={`w-full px-4 py-3 border transition-colors ${
                    errors.nombre 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#802223]'
                  } focus:outline-none`}
                  aria-invalid={!!errors.nombre}
                  aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                />
                {errors.nombre && (
                  <p id="nombre-error" className="mt-1 text-sm text-red-600">
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  maxLength={254}
                  className={`w-full px-4 py-3 border transition-colors ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#802223]'
                  } focus:outline-none`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                >
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  maxLength={15}
                  placeholder="+56 9 1234 5678"
                  className={`w-full px-4 py-3 border transition-colors ${
                    errors.telefono 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#802223]'
                  } focus:outline-none`}
                  aria-invalid={!!errors.telefono}
                  aria-describedby={errors.telefono ? 'telefono-error' : undefined}
                />
                {errors.telefono && (
                  <p id="telefono-error" className="mt-1 text-sm text-red-600">
                    {errors.telefono}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="mensaje"
                  className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                >
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  rows={6}
                  maxLength={1000}
                  placeholder="Cuéntanos qué tipo de vehículo buscas..."
                  className={`w-full px-4 py-3 border transition-colors resize-none ${
                    errors.mensaje 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-[#802223]'
                  } focus:outline-none`}
                  aria-invalid={!!errors.mensaje}
                  aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.mensaje && (
                    <p id="mensaje-error" className="text-sm text-red-600">
                      {errors.mensaje}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.mensaje.length}/1000 caracteres
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-sm font-medium tracking-wider uppercase transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#802223] hover:bg-[#6b1d1e]'
                } text-white`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
