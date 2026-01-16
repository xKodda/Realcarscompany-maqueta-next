'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Productos: Packs de Imágenes Digitales (Simplificado)
const PRODUCTOS = [
  { value: 3000, label: '1 Imagen Digital', description: '1 Participación Promocional', quantity: 1 },
  { value: 10000, label: 'Pack 4 Imágenes', description: '4 Participaciones Promocionales', quantity: 4, popular: true },
]

export default function MonzzaPageClient() {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState<number>(10000)

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Formatear RUT: X.XXX.XXX-X
  const formatRut = (rut: string) => {
    // 1. Limpiar caracteres no válidos
    const clean = rut.replace(/[^0-9kK]/g, '')

    // 2. Si es muy corto, devolvemos limpio
    if (clean.length <= 1) return clean

    // 3. Separar cuerpo y dígito verificador
    const body = clean.slice(0, -1)
    const dv = clean.slice(-1)

    // 4. Formatear cuerpo con puntos (opcional, pero se ve mejor)
    let formattedBody = ''
    for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
      formattedBody = body.charAt(i) + ((j > 0 && j % 3 === 0) ? '.' : '') + formattedBody
    }

    return `${formattedBody}-${dv}`
  }

  // Limpiar RUT para envío: 12345678-9
  const cleanRutForSubmit = (formatted: string) => {
    // Quitamos puntos, dejamos guion
    return formatted.replace(/\./g, '')
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const cleanRut = cleanRutForSubmit(formData.rut)

    if (cleanRut.length < 8) {
      setError('El RUT ingresado no es válido')
      setIsSubmitting(false)
      return
    }

    if (!selectedAmount) {
      setError('Debes seleccionar un producto')
      setIsSubmitting(false)
      return
    }

    const selectedProduct = PRODUCTOS.find(p => p.value === selectedAmount)
    const quantity = selectedProduct?.quantity || 1

    try {
      const response = await fetch('/api/pagos/flow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: selectedAmount,
          descripcion: `Compra ${quantity} Imágenes Digitales Monzza - ${cleanRut}`,
          email: formData.email,
          nombre: formData.nombre,
          telefono: formData.telefono,
          rut: cleanRut // Enviamos RUT limpio (12345678-k)
        })
      })

      const data = await response.json()

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        throw new Error(data.error || 'Error al iniciar pago')
      }

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error desconocido')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen bg-[#161b39] font-sans overflow-hidden flex flex-col md:flex-row">

      {/* LEFT COLUMN: Visuals (60%) */}
      <div className="relative w-full md:w-[60%] h-[40vh] md:h-full bg-black">
        {/* Main Background Image */}
        <Image
          src="/images/brand/moto2.jpeg"
          alt="Monzza Incentive"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        {/* Gallery Overlay (Bottom Left) */}
        <div className="absolute bottom-6 left-6 right-6 z-10 hidden md:block">
          <h1 className="text-6xl font-black text-white italic tracking-tighter mb-2">MONZZA</h1>
          <p className="text-xl text-gray-300 font-light mb-6 max-w-md">
            Adquiere tu <span className="text-white font-medium">Imagen Digital Coleccionable</span> y accede al beneficio promocional exclusivo.
          </p>

          <div className="flex gap-3">
            {[
              '/images/brand/moto1.jpeg',
              '/images/brand/moto3.jpeg',
              '/images/brand/moto4.jpeg'
            ].map((img, idx) => (
              <div key={idx} className="w-20 h-20 relative rounded-lg overflow-hidden border border-white/20 hover:border-white/80 transition-all cursor-pointer">
                <Image src={img} alt="Thumb" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Title Overlay */}
        <div className="absolute bottom-4 left-4 z-10 md:hidden">
          <h1 className="text-4xl font-black text-white italic tracking-tighter">MONZZA</h1>
        </div>
      </div>

      {/* RIGHT COLUMN: Action Form (40%) */}
      <div className="w-full md:w-[40%] h-[60vh] md:h-full bg-white relative flex flex-col justify-center p-6 md:p-12 overflow-y-auto">

        <div className="max-w-md mx-auto w-full">
          <h3 className="text-[#161b39] font-bold text-xl md:text-2xl mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#802223] block"></span>
            Compra Rápida
          </h3>

          <form onSubmit={handlePayment} className="space-y-5">

            {/* Product Selection */}
            <div className="grid grid-cols-2 gap-3">
              {PRODUCTOS.map((prod) => (
                <button
                  key={prod.value}
                  type="button"
                  onClick={() => setSelectedAmount(prod.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${selectedAmount === prod.value
                    ? 'border-[#802223] bg-[#802223]/5'
                    : 'border-gray-100'
                    }`}
                >
                  <div className={`font-bold text-lg ${selectedAmount === prod.value ? 'text-[#802223]' : 'text-gray-900'
                    }`}>
                    ${prod.value.toLocaleString('es-CL')}
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-1">
                    {prod.quantity} {prod.quantity > 1 ? 'Imágenes' : 'Imagen'}
                  </div>
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <input
                required
                type="text"
                name="rut"
                placeholder="RUT (12345678-9)"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: formatRut(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#802223] text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#802223] text-sm"
                />
                <input
                  required
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#802223] text-sm"
                />
              </div>
              <input
                required
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#802223] text-sm"
              />
            </div>

            {/* Error & Submit */}
            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#802223] hover:bg-[#691c1d] text-white font-bold tracking-widest uppercase rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? 'Procesando...' : `Pagar $${selectedAmount.toLocaleString('es-CL')}`}
            </button>

            <p className="text-[10px] text-center text-gray-400">
              Pagos seguros vía Flow • Ley 19.496
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
