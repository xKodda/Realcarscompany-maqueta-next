'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFormValidation } from '@/hooks/useFormValidation'

interface AddAutoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

interface AutoFormData {
  marca: string
  modelo: string
  año: string
  precio: string
  kilometraje: string
  combustible: string
  transmision: string
  color: string
  descripcion: string
}

export default function AddAutoModal({ isOpen, onClose, onSubmit }: AddAutoModalProps) {
  const [formData, setFormData] = useState<AutoFormData>({
    marca: '',
    modelo: '',
    año: '',
    precio: '',
    kilometraje: '',
    combustible: '',
    transmision: '',
    color: '',
    descripcion: ''
  })

  const [photos, setPhotos] = useState<File[]>([])
  const [mainPhoto, setMainPhoto] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { errors, isSubmitting, validateField, submitForm } = useFormValidation()

  const handleInputChange = (field: keyof AutoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>, isMain = false) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB en bytes
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.')
        return
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Formato de archivo no válido. Solo se permiten JPG, PNG y WebP.')
        return
      }

      if (isMain) {
        setMainPhoto(file)
      } else {
        setPhotos(prev => [...prev, file])
      }
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await submitForm(formData, async (sanitizedData) => {
      const autoData = {
        ...sanitizedData,
        photos,
        mainPhoto,
        estado: 'disponible',
        destacado: false
      }
      await onSubmit(autoData)
      onClose()
    })

    if (success) {
      // Reset form
      setFormData({
        marca: '',
        modelo: '',
        año: '',
        precio: '',
        kilometraje: '',
        combustible: '',
        transmision: '',
        color: '',
        descripcion: ''
      })
      setPhotos([])
      setMainPhoto(null)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-lg max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header móvil */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-[#161b39] flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <span>Agregar Auto</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl touch-manipulation p-1"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Foto principal - Prioridad móvil */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                📸 Foto Principal *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-[#802223] transition-colors">
                {mainPhoto ? (
                  <div className="space-y-2">
                    <div className="w-full h-32 sm:h-40 bg-gray-100 rounded flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(mainPhoto)}
                        alt="Preview"
                        className="max-w-full max-h-full object-cover rounded"
                      />
                    </div>
                    <p className="text-sm text-gray-600 truncate">{mainPhoto.name}</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => setMainPhoto(null)}
                        className="text-red-600 text-sm touch-manipulation px-2 py-1 rounded hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#802223] text-sm touch-manipulation px-2 py-1 rounded hover:bg-gray-50"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📁</div>
                    <p className="text-sm text-gray-600">
                      Selecciona una foto de alta calidad
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoCapture(e, true)}
                      className="hidden"
                      id="main-photo"
                    />
                    <label
                      htmlFor="main-photo"
                      className="bg-[#802223] text-white px-4 py-2 rounded text-sm font-medium tracking-wider uppercase cursor-pointer touch-manipulation inline-block"
                    >
                      📁 Cargar Foto
                    </label>
                    <p className="text-xs text-gray-500">
                      Formatos: JPG, PNG, WebP (máx. 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Campos básicos en grid móvil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca *
                </label>
                <input
                  type="text"
                  value={formData.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none text-base ${
                    errors.marca ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#802223]'
                  }`}
                  placeholder="Ej: Mercedes"
                />
                {errors.marca && (
                  <p className="mt-1 text-sm text-red-600">{errors.marca}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none text-base ${
                    errors.modelo ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#802223]'
                  }`}
                  placeholder="Ej: C63 AMG"
                />
                {errors.modelo && (
                  <p className="mt-1 text-sm text-red-600">{errors.modelo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año *
                </label>
                <input
                  type="number"
                  value={formData.año}
                  onChange={(e) => handleInputChange('año', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none text-base ${
                    errors.año ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#802223]'
                  }`}
                  placeholder="2024"
                  min="1990"
                  max="2025"
                />
                {errors.año && (
                  <p className="mt-1 text-sm text-red-600">{errors.año}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (CLP) *
                </label>
                <input
                  type="number"
                  value={formData.precio}
                  onChange={(e) => handleInputChange('precio', e.target.value)}
                  className={`w-full px-3 py-2 border rounded focus:outline-none text-base ${
                    errors.precio ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#802223]'
                  }`}
                  placeholder="50000000"
                  min="0"
                />
                {errors.precio && (
                  <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kilometraje
                </label>
                <input
                  type="number"
                  value={formData.kilometraje}
                  onChange={(e) => handleInputChange('kilometraje', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#802223] text-base"
                  placeholder="15000"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#802223] text-base"
                  placeholder="Negro"
                />
              </div>
            </div>

            {/* Fotos adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📷 Fotos Adicionales (Opcional)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Puedes agregar hasta 6 fotos adicionales para mostrar diferentes ángulos del vehículo
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-[#802223] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`photo-${i}`}
                      onChange={(e) => handlePhotoCapture(e, false)}
                    />
                    <label
                      htmlFor={`photo-${i}`}
                      className="w-full h-full flex items-center justify-center cursor-pointer touch-manipulation"
                    >
                      <span className="text-2xl text-gray-400">📁</span>
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Preview de fotos adicionales */}
              {photos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{photos.length} fotos seleccionadas</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {photos.map((photo, index) => (
                      <div key={index} className="flex-shrink-0 relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs touch-manipulation"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#802223] text-base resize-none"
                rows={3}
                placeholder="Descripción del vehículo..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descripcion.length}/500 caracteres
              </p>
            </div>

            {/* Botones de acción - Optimizados para móvil */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 py-3 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#802223] hover:bg-[#6b1d1e] disabled:bg-gray-400 text-white py-3 text-sm font-medium tracking-wider uppercase transition-all touch-manipulation flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Guardar Auto
                  </>
                )}
              </button>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
