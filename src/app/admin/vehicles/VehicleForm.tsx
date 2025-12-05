'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

  const [formData, setFormData] = useState({
    marca: vehicle?.marca || '',
    modelo: vehicle?.modelo || '',
    anio: vehicle?.anio || new Date().getFullYear(),
    precio: vehicle?.precio || 0,
    kilometraje: vehicle?.kilometraje || 0,
    transmision: vehicle?.transmision || 'Automática',
    combustible: vehicle?.combustible || 'Gasolina',
    litrosMotor: (vehicle as any)?.litrosMotor || (vehicle as any)?.engine || '',
    color: vehicle?.color || '',
    imagen: vehicle?.imagen || '',
    descripcion: vehicle?.descripcion || '',
    estado: vehicle?.estado || 'disponible',
    destacado: vehicle?.destacado || false,
    // Extended fields
    bodyType: (vehicle as any)?.bodyType || '',
    traction: (vehicle as any)?.traction || '',
    locationCity: (vehicle as any)?.locationCity || '',
    condition: (vehicle as any)?.condition || 'Nuevo',
    shortDescription: (vehicle as any)?.shortDescription || '',
  })

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
  const brandOptions = [
    'Aston Martin',
    'Audi',
    'Bentley',
    'BMW',
    'Cadillac',
    'Ferrari',
    'Ford',
    'Jaguar',
    'Lamborghini',
    'Land Rover',
    'Lexus',
    'Maserati',
    'McLaren',
    'Mercedes-Benz',
    'Porsche',
    'Range Rover',
    'Rolls-Royce',
    'Tesla',
    'Volvo'
  ]
  const colorOptions = [
    'Blanco','Negro','Gris','Plata','Azul','Rojo','Verde','Amarillo','Naranja','Café','Beige'
  ]
  const bodyTypeOptions = [
    'Sedán','SUV','Hatchback','Coupé','Pickup','Convertible','Wagon','Van'
  ]
  const tractionOptions = ['FWD','RWD','AWD','4x4']
  const cityOptions = [
    'Santiago','Providencia','Las Condes','La Florida','Maipú','Ñuñoa','Vitacura','Puente Alto',
    'Valparaíso','Viña del Mar','Concepción','Antofagasta','La Serena','Temuco','Iquique','Rancagua'
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Autoasignar imagen principal desde la galería si está vacía
      if (!formData.imagen && imageUrls.length > 0) {
        setFormData((prev) => ({ ...prev, imagen: imageUrls[0] }))
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
      if (!formData.imagen && imageUrls.length === 0) missing.push('Imagen principal')

      // Límite razonable de galería
      if (imageUrls.length > 12) {
        setIsSubmitting(false)
        setError('La galería admite máximo 12 imágenes.')
        return
      }

      if (missing.length > 0) {
        setIsSubmitting(false)
        setError(
          `Faltan campos obligatorios: ${missing.join(', ')}. Por favor complétalos.`
        )
        return
      }

      const url = isEditing
        ? `/api/admin/vehicles/${vehicle.id}`
        : '/api/admin/vehicles'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imagenes: imageUrls,
          caracteristicas: [],
        }),
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


  const uploadFiles = async (files: File[]) => {
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Error al subir imágenes')
    }
    return data.urls as string[]
  }

  const handlePickMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    try {
      setIsSubmitting(true)
      const urls = await uploadFiles([e.target.files[0]])
      setFormData({ ...formData, imagen: urls[0] })
    } catch (err: any) {
      setError(err.message || 'No se pudo subir la imagen')
    } finally {
      setIsSubmitting(false)
      e.target.value = ''
    }
  }

  const handlePickGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    try {
      setIsSubmitting(true)
      const urls = await uploadFiles(Array.from(e.target.files))
      setImageUrls([...(imageUrls || []), ...urls])
    } catch (err: any) {
      setError(err.message || 'No se pudieron subir las imágenes')
    } finally {
      setIsSubmitting(false)
      e.target.value = ''
    }
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Basic Information */}
        <h2 className="text-xl font-medium text-[#161b39] border-b border-gray-200 pb-2">
          Información Básica
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.marca
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="">Selecciona una marca</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.anio}
              onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio (CLP) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={displayPrecio}
              onChange={handlePrecioChange}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kilometraje <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={displayKilometraje}
              onChange={handleKilometrajeChange}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmisión <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.transmision}
              onChange={(e) =>
                setFormData({ ...formData, transmision: e.target.value })
              }
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.transmision
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="Automática">Automática</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combustible <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.combustible}
              onChange={(e) =>
                setFormData({ ...formData, combustible: e.target.value })
              }
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.combustible
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.color
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="" disabled>Selecciona un color</option>
              {colorOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <h2 className="text-xl font-medium text-[#161b39] border-b border-gray-200 pb-2 mt-8">
          Información Adicional
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Carrocería
            </label>
            <select
              value={formData.bodyType}
              onChange={(e) =>
                setFormData({ ...formData, bodyType: e.target.value })
              }
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.bodyType
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="">Selecciona tipo</option>
              {bodyTypeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Litros del Motor
            </label>
            <input
              type="text"
              inputMode="text"
              value={displayLitrosMotor}
              onChange={handleLitrosMotorChange}
              placeholder="Ej: 2.0T, 3.0, 4.0L"
              className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">Formato: 2.0T, 3.0, 4.0L, 2.5 (puede usar punto o coma)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracción
            </label>
            <select
              value={formData.traction}
              onChange={(e) =>
                setFormData({ ...formData, traction: e.target.value })
              }
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.traction
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="">Selecciona tracción</option>
              {tractionOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <select
              value={formData.locationCity}
              onChange={(e) =>
                setFormData({ ...formData, locationCity: e.target.value })
              }
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.locationCity
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="">Selecciona ciudad</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condición
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.condition
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Seminuevo">Seminuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <h2 className="text-xl font-medium text-[#161b39] border-b border-gray-200 pb-2 mt-8">
          Imágenes
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen Principal <span className="text-red-500">*</span>
          </label>
          {formData.imagen ? (
            <div className="flex items-center gap-4">
              {/* Vista previa simple */}
              <img
                src={formData.imagen}
                alt="Imagen principal"
                className="w-24 h-24 object-cover border border-gray-200"
              />
              <label className="inline-flex">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePickMainImage}
                  className="hidden"
                />
                <span className="px-4 py-3 border-2 border-gray-300 text-gray-700 hover:border-[#802223] hover:text-[#802223] cursor-pointer">
                  Reemplazar imagen
                </span>
              </label>
            </div>
          ) : (
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePickMainImage}
                className="hidden"
              />
              <span className="px-4 py-3 border-2 border-dashed border-gray-300 text-gray-700 hover:border-[#802223] hover:text-[#802223] cursor-pointer w-full text-center">
                Cargar imagen principal
              </span>
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cargar imágenes adicionales
          </label>
          <div className="mb-3">
            <label className="inline-flex">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handlePickGallery}
                className="hidden"
              />
              <span className="px-4 py-3 border-2 border-gray-300 text-gray-700 hover:border-[#802223] hover:text-[#802223] cursor-pointer">
                Cargar imágenes
              </span>
            </label>
          </div>
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="border border-gray-200 p-2 relative bg-white">
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-28 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 hover:bg-red-700"
                    aria-label="Eliminar imagen"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Corta
          </label>
          <textarea
            rows={2}
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            placeholder="Breve descripción para mostrar en listados"
            className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
          />
        </div>

        {/* Status & Options */}
        <h2 className="text-xl font-medium text-[#161b39] border-b border-gray-200 pb-2 mt-8">
          Estado y Opciones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className={`w-full px-4 py-3 border transition-all duration-200 outline-none text-sm font-light ${
                formData.estado
                  ? 'border-[#802223] bg-[#802223]/5 text-[#161b39] shadow-sm'
                  : 'border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] text-gray-700'
              }`}
            >
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.destacado}
                onChange={(e) =>
                  setFormData({ ...formData, destacado: e.target.checked })
                }
                className="w-4 h-4 text-[#802223] border-gray-300 rounded focus:ring-[#802223]"
              />
              <span className="text-sm font-medium text-gray-700">
                Marcar como destacado
              </span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#161b39] hover:bg-[#802223] text-white py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? 'Guardando...'
              : isEditing
              ? 'Actualizar Vehículo'
              : 'Crear Vehículo'}
          </button>
          <Link
            href="/admin/vehicles"
            className="flex-1 border-2 border-gray-300 text-gray-700 hover:border-[#802223] hover:text-[#802223] text-center py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  )
}

