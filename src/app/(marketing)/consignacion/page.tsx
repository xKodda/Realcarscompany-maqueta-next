'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CONTACTO } from '@/lib/constants'
import { useFormValidation } from '@/hooks/useFormValidation'
import { consultasService } from '@/lib/api/services/consultas.service'

// Funciones de utilidad para formateo
const formatNumber = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '')
  if (!numericValue) return ''
  return parseInt(numericValue, 10).toLocaleString('es-CL')
}

const parseNumber = (value: string): string => {
  return value.replace(/[^0-9]/g, '')
}

const formatPhoneDisplay = (digits: string): string => {
  if (!digits) return ''
  // Mostrar solo los 8 dígitos sin espacios adicionales
  return digits.slice(0, 8)
}

const parsePhoneDigits = (value: string): string => {
  // Extraer solo los dígitos (después del prefijo +56 9)
  return value.replace(/[^0-9]/g, '').slice(-8)
}

export default function ConsignacionPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    marca: '',
    modelo: '',
    año: '',
    kilometraje: '',
    precioEsperado: '',
    mensaje: '',
  })

  const [displayValues, setDisplayValues] = useState({
    kilometraje: '',
    precioEsperado: '',
    telefonoDigits: '', // Solo los 8 dígitos después de +56 9
  })

  const [showSuccess, setShowSuccess] = useState(false)

  const {
    errors,
    isSubmitting,
    validateField,
    submitForm,
    clearErrors
  } = useFormValidation()

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // Validar tamaño y tipo si es necesario
      const validFiles = newFiles.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
        const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
        return isValidType && isValidSize
      })

      setImages(prev => [...prev, ...validFiles])

      // Crear previews
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      // Liberar URL del objeto eliminado
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    // Preparar datos con valores numéricos parseados
    const submitData = {
      ...formData,
      kilometraje: parseNumber(formData.kilometraje),
      precioEsperado: parseNumber(formData.precioEsperado),
      telefono: formData.telefono, // Ya viene formateado como 569xxxxxxxx
    }

    const success = await submitForm(submitData, async (sanitizedData) => {
      try {
        const kilometrajeFormatted = sanitizedData.kilometraje
          ? parseInt(sanitizedData.kilometraje, 10).toLocaleString('es-CL')
          : ''
        const precioFormatted = sanitizedData.precioEsperado
          ? parseInt(sanitizedData.precioEsperado, 10).toLocaleString('es-CL')
          : ''

        const mensajeCompleto = `
Consignación de Vehículo
Marca: ${sanitizedData.marca}
Modelo: ${sanitizedData.modelo}
Año: ${sanitizedData.año}
Kilometraje: ${kilometrajeFormatted} km
Precio Esperado: $${precioFormatted}

Mensaje:
${sanitizedData.mensaje}
        `.trim()

        // Convertir imágenes a base64
        const processedImages = await Promise.all(images.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
          })
        }))

        const response = await consultasService.create({
          nombre: sanitizedData.nombre,
          email: sanitizedData.email,
          telefono: sanitizedData.telefono,
          mensaje: mensajeCompleto,
          tipo: 'consignacion',
          imagenes: processedImages
        })

        if (response.success) {
          setShowSuccess(true)
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            marca: '',
            modelo: '',
            año: '',
            kilometraje: '',
            precioEsperado: '',
            mensaje: '',
          })
          setDisplayValues({
            kilometraje: '',
            precioEsperado: '',
            telefonoDigits: '',
          })

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
      //
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Manejo especial para campos numéricos y teléfono
    if (name === 'kilometraje') {
      const numericValue = parseNumber(value)
      const formatted = formatNumber(numericValue)
      setFormData({
        ...formData,
        [name]: numericValue,
      })
      setDisplayValues({
        ...displayValues,
        kilometraje: formatted,
      })
      validateField(name, numericValue)
    } else if (name === 'precioEsperado') {
      const numericValue = parseNumber(value)
      const formatted = formatNumber(numericValue)
      setFormData({
        ...formData,
        [name]: numericValue,
      })
      setDisplayValues({
        ...displayValues,
        precioEsperado: formatted,
      })
      validateField(name, numericValue)
    } else if (name === 'telefono') {
      // Solo permitir números, máximo 8 dígitos
      const digits = parsePhoneDigits(value)
      const formatted = formatPhoneDisplay(digits)
      // Guardar número completo con prefijo para backend
      const fullNumber = digits ? `569${digits}` : ''
      setFormData({
        ...formData,
        [name]: fullNumber,
      })
      setDisplayValues({
        ...displayValues,
        telefonoDigits: formatted,
      })
      validateField(name, fullNumber)
    } else if (name === 'año') {
      // Solo permitir números, máximo 4 dígitos
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 4)
      const currentYear = new Date().getFullYear()
      const minYear = 1900
      const maxYear = currentYear + 1

      // Validar rango si tiene 4 dígitos
      if (numericValue.length === 4) {
        const yearNum = parseInt(numericValue, 10)
        if (yearNum < minYear || yearNum > maxYear) {
          // No actualizar si está fuera de rango
          return
        }
      }

      setFormData({
        ...formData,
        [name]: numericValue,
      })
      validateField(name, numericValue)
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
      validateField(name as keyof typeof formData, value)
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'telefono') {
      const digits = parsePhoneDigits(value)
      const formatted = formatPhoneDisplay(digits)
      const fullNumber = digits ? `569${digits}` : ''
      setFormData({
        ...formData,
        [name]: fullNumber,
      })
      setDisplayValues({
        ...displayValues,
        telefonoDigits: formatted,
      })
      validateField(name, fullNumber)
    } else {
      validateField(name as keyof typeof formData, value)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Hero con imagen */}
      <section className="relative h-[75vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/brand/consignacion1.jpg"
            alt="Consignación de vehículos de lujo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#161b39]/85 via-[#1d2447]/80 to-[#802223]/85"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-center mx-auto text-white"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight">
              Consignación de <span className="font-semibold">Vehículos</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Vende tu vehículo sin complicaciones
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sección con imagen */}
      <section className="py-20 md:py-28 bg-[#f2f2f4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[450px] rounded-lg overflow-hidden order-2 lg:order-1"
            >
              <Image
                src="/images/brand/showroom3.jpeg"
                alt="Showroom RealCars Company"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-light text-[#161b39] mb-6 leading-tight">
                Red de <span className="font-semibold">Compradores Calificados</span>
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Conexión directa con compradores serios que buscan vehículos de alta gama. Sin intermediarios innecesarios, sin pérdida de tiempo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galería de imágenes con textos breves */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[380px] rounded-lg overflow-hidden group"
            >
              <Image
                src="/images/brand/consignacion3.jpg"
                alt="Fotografía profesional"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-2">Fotografía Profesional</h3>
                  <p className="text-sm font-light">Alta calidad visual para maximizar el atractivo de tu vehículo.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative h-[380px] rounded-lg overflow-hidden group"
            >
              <Image
                src="/images/brand/consignacion4.jpg"
                alt="Publicidad multiplataforma"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-2">Exposición Estratégica</h3>
                  <p className="text-sm font-light">Visibilidad en múltiples canales especializados.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[380px] rounded-lg overflow-hidden group"
            >
              <Image
                src="/images/brand/showroom1.jpeg"
                alt="Showroom exclusivo"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-2">Showroom Exclusivo</h3>
                  <p className="text-sm font-light">Presentación en ambiente profesional.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative h-[380px] rounded-lg overflow-hidden group"
            >
              <Image
                src="/images/brand/consignacion2.jpg"
                alt="Gestión completa"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-2">Servicio Integral</h3>
                  <p className="text-sm font-light">Desde la valorización hasta la entrega final.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-20 md:py-28 bg-[#f2f2f4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >

              <h2 className="text-4xl md:text-5xl font-light text-[#161b39] mb-6">
                Un especialista te contactará para coordinar la evaluación de tu vehículo.
              </h2>
              <p className="text-sm text-gray-500 font-light">
                <span className="text-[#802223]">*</span> Campos obligatorios
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 space-y-6 shadow-sm border border-gray-100">
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
                        ¡Solicitud enviada exitosamente! Un asesor se comunicará contigo en breve.
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`w-full px-4 py-3 border transition-colors ${errors.nombre
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#802223]'
                        } focus:outline-none bg-white`}
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="telefono"
                      className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                    >
                      Teléfono *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                        +56 9
                      </span>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={displayValues.telefonoDigits}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="123456788"
                        maxLength={8}
                        inputMode="numeric"
                        className={`w-full pl-16 pr-4 py-3 border transition-colors ${errors.telefono
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#802223]'
                          } focus:outline-none bg-white`}
                      />
                    </div>
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                    )}
                  </div>
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
                    className={`w-full px-4 py-3 border transition-colors ${errors.email
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#802223]'
                      } focus:outline-none bg-white`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="marca"
                      className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                    >
                      Marca *
                    </label>
                    <input
                      type="text"
                      id="marca"
                      name="marca"
                      value={formData.marca}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Ej: BMW"
                      className={`w-full px-4 py-3 border transition-colors ${errors.marca
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#802223]'
                        } focus:outline-none bg-white`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modelo"
                      className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                    >
                      Modelo *
                    </label>
                    <input
                      type="text"
                      id="modelo"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Ej: Serie 3"
                      className={`w-full px-4 py-3 border transition-colors ${errors.modelo
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#802223]'
                        } focus:outline-none bg-white`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="año"
                      className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                    >
                      Año *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="año"
                      name="año"
                      value={formData.año}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      minLength={4}
                      maxLength={4}
                      placeholder="2020"
                      pattern="[0-9]{4}"
                      className={`w-full px-4 py-3 border transition-colors ${errors.año
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#802223]'
                        } focus:outline-none bg-white`}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Año entre 1900 y {new Date().getFullYear() + 1}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="kilometraje"
                      className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                    >
                      Kilometraje *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        id="kilometraje"
                        name="kilometraje"
                        value={displayValues.kilometraje}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="50.000"
                        className={`w-full px-4 py-3 border transition-colors ${errors.kilometraje
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#802223]'
                          } focus:outline-none bg-white`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        km
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="precioEsperado"
                      className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                    >
                      Precio Esperado (CLP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="precioEsperado"
                        name="precioEsperado"
                        value={displayValues.precioEsperado}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="15.000.000"
                        className={`w-full pl-8 pr-4 py-3 border transition-colors ${errors.precioEsperado
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#802223]'
                          } focus:outline-none bg-white`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mensaje"
                    className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
                  >
                    Información Adicional
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    placeholder="Cuéntanos sobre el estado de tu vehículo, accesorios, historia, etc..."
                    className={`w-full px-4 py-3 border transition-colors resize-none ${errors.mensaje
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#802223]'
                      } focus:outline-none bg-white`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2">
                    Fotografías del Vehículo
                  </label>

                  <div className="space-y-4">
                    {/* Botón de carga */}
                    <div className="relative">
                      <input
                        type="file"
                        id="imagenes"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="imagenes"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#802223] hover:bg-gray-50 transition-all group"
                      >
                        <div className="flex flex-col items-center space-y-2 py-2">
                          <svg className="w-8 h-8 text-gray-400 group-hover:text-[#802223] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500 group-hover:text-[#802223] transition-colors">
                            Haga clic para adjuntar imágenes (Máx 5MB por foto)
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200">
                            <Image
                              src={preview}
                              alt={`Vista previa ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-sm font-medium tracking-wider uppercase transition-all ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#802223] hover:bg-[#6b1d1e]'
                    } text-white`}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar información'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Tu información es 100% confidencial. Un especialista te contactará para coordinar una sesión y entregarte un análisis de mercado actualizado, sin la presión de una venta tradicional.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

