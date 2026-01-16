'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BRAND_MODELS, COMMON_FEATURES, generateDescription } from './vehicle-data'

interface VehicleImage {
  id: number
  imageUrl: string
  position: number
}

interface Vehicle {
  id: string
  marca: string
  modelo: string
  anio: number
  precio: number
  kilometraje: number
  transmision: string
  combustible: string
  color: string
  litrosMotor?: string | null
  imagen: string
  imagenes: string[]
  descripcion: string
  caracteristicas: string[]
  estado: string
  destacado: boolean
  vehicleImages: VehicleImage[]
}

interface VehicleFormProps {
  vehicle?: Vehicle
}

export default function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter()
  const isEditing = !!vehicle

  // Initialize selected features from existing vehicle data
  const initialCommonFeatures = vehicle?.caracteristicas?.filter(c => COMMON_FEATURES.includes(c)) || []
  const initialCustomFeatures = vehicle?.caracteristicas?.filter(c => !COMMON_FEATURES.includes(c)).join(', ') || ''

  const [formData, setFormData] = useState({
    marca: vehicle?.marca || '',
    modelo: vehicle?.modelo || '',
    anio: vehicle?.anio || new Date().getFullYear(),
    precio: vehicle?.precio || 0,
    kilometraje: vehicle?.kilometraje || 0,
    transmision: vehicle?.transmision || 'Automática',
    combustible: vehicle?.combustible || 'Gasolina',
    litrosMotor: vehicle?.litrosMotor || '',
    color: vehicle?.color || '',
    imagen: vehicle?.imagen || '',
    descripcion: vehicle?.descripcion || '',
    estado: vehicle?.estado || 'disponible',
    destacado: vehicle?.destacado || false,
  })

  // Separate state for features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialCommonFeatures)
  const [customFeatures, setCustomFeatures] = useState(initialCustomFeatures)

  const [imageUrls, setImageUrls] = useState<string[]>(
    vehicle?.vehicleImages?.map((img) => img.imageUrl) ||
    vehicle?.imagenes ||
    []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [displayPrecio, setDisplayPrecio] = useState(
    new Intl.NumberFormat('es-CL').format(formData.precio || 0)
  )
  const [displayKilometraje, setDisplayKilometraje] = useState(
    new Intl.NumberFormat('es-CL').format(formData.kilometraje || 0)
  )
  const [displayLitrosMotor, setDisplayLitrosMotor] = useState(formData.litrosMotor || '')

  const [isUploadingImages, setIsUploadingImages] = useState(false)

  // Available models for the selected brand
  const [availableModels, setAvailableModels] = useState<string[]>([])

  useEffect(() => {
    if (formData.marca && BRAND_MODELS[formData.marca]) {
      setAvailableModels(BRAND_MODELS[formData.marca])
    } else {
      setAvailableModels([])
    }
  }, [formData.marca])

  const brandOptions = Object.keys(BRAND_MODELS).sort();

  const colorOptions = [
    'Blanco', 'Negro', 'Gris', 'Plata', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Naranja', 'Café', 'Beige', 'Bronce', 'Grafito'
  ]
  const years = Array.from({ length: (new Date().getFullYear() + 1) - 1990 + 1 }, (_, i) => (new Date().getFullYear() + 1) - i).filter(y => y >= 1990)

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const numeric = raw ? parseInt(raw, 10) : 0
    setFormData({ ...formData, precio: numeric })
    setDisplayPrecio(new Intl.NumberFormat('es-CL').format(numeric))
  }

  const handleKilometrajeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const numeric = raw ? parseInt(raw, 10) : 0
    setFormData({ ...formData, kilometraje: numeric })
    setDisplayKilometraje(new Intl.NumberFormat('es-CL').format(numeric))
  }

  const handleLitrosMotorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, litrosMotor: value })
    setDisplayLitrosMotor(value)
  }

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature))
    } else {
      setSelectedFeatures([...selectedFeatures, feature])
    }
  }

  const handleGenerateDescription = () => {
    const desc = generateDescription(formData, selectedFeatures);
    setFormData({ ...formData, descripcion: desc });
  }

  const handlePrincipalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImages(true)
    setError('')

    try {
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`La imagen excede los 5MB`)
        setIsUploadingImages(false)
        return
      }

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        throw new Error('Error al subir la imagen')
      }

      const data = await response.json()
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, imagen: data.url }))
      }
    } catch (error) {
      console.error('Error uploading principal image:', error)
      setError('Error al subir la imagen principal. Intenta nuevamente.')
    } finally {
      setIsUploadingImages(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImages(true)
    setError('')

    try {
      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`La imagen "${file.name}" excede los 5MB`)
          setIsUploadingImages(false)
          return
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Error al subir la imagen')
        }

        const data = await response.json()
        if (data.success && data.url) {
          uploadedUrls.push(data.url)
        }
      }

      setImageUrls((prev) => [...prev, ...uploadedUrls])
    } catch (error) {
      console.error('Error uploading images:', error)
      setError('Error al subir las imágenes. Intenta nuevamente.')
    } finally {
      setIsUploadingImages(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Preparar imagen principal - si está vacía, usar la primera de la galería
      let imagenPrincipal = formData.imagen
      if (!imagenPrincipal && imageUrls.length > 0) {
        imagenPrincipal = imageUrls[0]
      }

      // Validaciones del formulario (cliente) para feedback inmediato
      const missing: string[] = []
      const isEmpty = (v: any) =>
        v === undefined || v === null || (typeof v === 'string' && v.trim() === '')

      if (isEmpty(formData.marca)) missing.push('Marca')
      if (isEmpty(formData.modelo)) missing.push('Modelo')
      if (!formData.anio) missing.push('Año')
      if (!formData.precio || formData.precio < 0) missing.push('Precio')
      if (formData.kilometraje === undefined || formData.kilometraje < 0)
        missing.push('Kilometraje')
      if (isEmpty(formData.transmision)) missing.push('Transmisión')
      if (isEmpty(formData.combustible)) missing.push('Combustible')
      if (isEmpty(formData.color)) missing.push('Color')
      if (isEmpty(formData.descripcion)) missing.push('Descripción')
      if (!imagenPrincipal && imageUrls.length === 0) missing.push('Imagen principal')

      // Límite razonable de galería
      if (imageUrls.length > 12) {
        setIsSubmitting(false)
        setError('La galería admite máximo 12 imágenes.')
        return
      }

      if (missing.length > 0) {
        setIsSubmitting(false)
        setError(
          `Para publicar la unidad, completa: ${missing.join(', ')}.`
        )
        return
      }

      const url = isEditing
        ? `/api/admin/vehicles/${vehicle.id}`
        : '/api/admin/vehicles'
      const method = isEditing ? 'PUT' : 'POST'

      // Combine selected common features with custom ones
      const combinedFeatures = [
        ...selectedFeatures,
        ...customFeatures.split(',').map(c => c.trim()).filter(c => c.length > 0)
      ];

      // Datos a enviar
      const dataToSend = {
        ...formData,
        imagen: imagenPrincipal,
        imagenes: imageUrls,
        caracteristicas: combinedFeatures,
      }

      console.log('Enviando datos:', {
        imagenPrincipal: dataToSend.imagen,
        cantidadImagenes: dataToSend.imagenes.length,
        imagenes: dataToSend.imagenes,
        features: combinedFeatures
      })

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (!response.ok) {
        // Mostrar mensaje específico desde el backend si existe
        const backendMsg =
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(', ') : '') ||
          ''
        throw new Error(
          backendMsg || `Error al guardar el vehículo (código ${response.status})`
        )
      }

      router.push('/admin/vehicles')
      router.refresh()
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Error al guardar el vehículo')
      setIsSubmitting(false)
    }
  }




  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-20">
      {/* Header flotante con acciones principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#161b39] tracking-tight">
            {isEditing ? 'Gestión de Unidad' : 'Nuevo Ingreso'}
          </h1>
          <p className="text-gray-500 mt-1 font-light text-sm">
            {isEditing
              ? `Editando ficha técnica: ${vehicle.marca} ${vehicle.modelo}`
              : 'Completa la ficha técnica para publicar un vehículo en el catálogo.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/vehicles"
            className="text-gray-500 hover:text-[#161b39] px-4 py-2 text-sm font-medium transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#161b39] hover:bg-[#2a3055] text-white px-6 py-2.5 rounded-full text-sm font-medium tracking-wide shadow-lg shadow-[#161b39]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{isEditing ? 'Guardar Cambios' : 'Publicar Unidad'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA PRINCIPAL (Izquierda) */}
        <div className="lg:col-span-2 space-y-6">

          {/* CARD 1: Información Esencial */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-[#161b39]">Datos del Vehículo</h2>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Marca del Vehículo</label>
                <select
                  required
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none"
                >
                  <option value="">Seleccionar Fabricante</option>
                  {brandOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Modelo</label>
                <input
                  type="text"
                  required
                  list="model-options"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none"
                  placeholder="Ej. X5, Clase C, 911"
                />
                <datalist id="model-options">
                  {availableModels.map((model) => (
                    <option key={model} value={model} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Año</label>
                <select
                  required
                  value={formData.anio}
                  onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Transmisión</label>
                <select
                  required
                  value={formData.transmision}
                  onChange={(e) => setFormData({ ...formData, transmision: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none"
                >
                  <option value="Automática">Automática</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Combustible</label>
                <select
                  required
                  value={formData.combustible}
                  onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Color Exterior</label>
                <select
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none"
                >
                  <option value="" disabled>Seleccionar color</option>
                  {colorOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Motor (cc / litros)</label>
                <input
                  type="text"
                  value={displayLitrosMotor}
                  onChange={handleLitrosMotorChange}
                  placeholder="Ej: 3.0 Turbo"
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: Descripción y Equipamiento */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-medium text-[#161b39]">Detalle y Equipamiento</h2>
              <button
                type="button"
                onClick={handleGenerateDescription}
                className="text-xs text-[#802223] hover:text-[#5e191a] font-medium flex items-center gap-1 bg-[#802223]/5 px-3 py-1.5 rounded-full transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generar con IA
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descripción Comercial</label>
                <textarea
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none resize-y text-sm leading-relaxed"
                  placeholder="Redacta una descripción atractiva del vehículo..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Equipamiento Destacado</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COMMON_FEATURES.map((feature) => (
                    <label
                      key={feature}
                      className={`flex items-center p-3 text-sm rounded-lg cursor-pointer transition-all border ${selectedFeatures.includes(feature)
                          ? 'border-[#802223] bg-[#802223]/5 text-[#802223] font-medium shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 text-gray-600 bg-white'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${selectedFeatures.includes(feature) ? 'bg-[#802223] border-[#802223]' : 'border-gray-300'
                        }`}>
                        {selectedFeatures.includes(feature) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      {feature}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Equipamiento Adicional</label>
                <input
                  type="text"
                  value={customFeatures}
                  onChange={(e) => setCustomFeatures(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none text-sm"
                  placeholder="Techo panorámico, Audio Bose, Llantas 20... (separar por comas)"
                />
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA LATERAL (Derecha) */}
        <div className="space-y-6">

          {/* CARD 3: Valoración y Estado */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-[#161b39]">Comercialización</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Precio de Venta (CLP)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={displayPrecio}
                    onChange={handlePrecioChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none font-medium text-lg text-[#161b39]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kilometraje Actual</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={displayKilometraje}
                    onChange={handleKilometrajeChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#161b39]/10 focus:border-[#161b39] transition-all outline-none font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">km</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Estado de Publicación</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {['disponible', 'reservado', 'vendido'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, estado: status })}
                      className={`flex-1 py-2 text-xs font-medium uppercase tracking-wide rounded-md transition-all ${formData.estado === status
                          ? status === 'disponible' ? 'bg-green-100 text-green-700 shadow-sm' :
                            status === 'reservado' ? 'bg-yellow-100 text-yellow-700 shadow-sm' : 'bg-red-100 text-red-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.destacado ? 'bg-[#161b39] border-[#161b39]' : 'bg-white border-gray-300'}`}>
                    {formData.destacado && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-700">Destacar en Portada</span>
                </label>
              </div>
            </div>
          </div>

          {/* CARD 4: Multimedia */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-[#161b39]">Galería de Fotos</h2>
            </div>
            <div className="p-6 space-y-6">

              {/* Imagen Principal */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Foto de Portada</label>

                {formData.imagen ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden group shadow-md">
                    <img src={formData.imagen} alt="Portada" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imagen: '' })}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-[#802223] rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100 gap-2 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePrincipalImageUpload}
                      disabled={isUploadingImages}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-gray-200 group-hover:bg-[#802223]/10 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-[#802223]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Subir Portada</span>
                  </label>
                )}
              </div>

              {/* Galería Restante */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Galería ({imageUrls.length})</label>
                  <label className="text-xs text-[#802223] font-medium cursor-pointer hover:underline flex items-center gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploadingImages}
                      className="hidden"
                    />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Agregar Fotos
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden group bg-gray-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-white hover:text-red-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {imageUrls.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-gray-400 text-xs italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      Sin imágenes adicionales
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Error Message Floating */}
      {error && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-white border-l-4 border-red-500 shadow-xl rounded-lg p-4 animate-slide-up z-50">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Atención</p>
              <p className="mt-1 text-xs text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button onClick={() => setError('')} className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <span className="sr-only">Cerrar</span>
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </form>
  )
}
