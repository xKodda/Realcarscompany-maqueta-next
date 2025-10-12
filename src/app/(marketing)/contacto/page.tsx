'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CONTACTO } from '@/lib/constants'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', formData)
    alert('Gracias por contactarnos. Un asesor se comunicará contigo pronto.')
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#f2f2f4] py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-block mb-4 px-4 py-1.5 border border-[#802223] text-[#802223] text-xs tracking-[0.2em] uppercase">
              Estamos para ti
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-[#161b39] mb-6 tracking-tight">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
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
            <h2 className="text-3xl font-light text-[#161b39] mb-8">
              Información de <span className="font-semibold">contacto</span>
            </h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#802223] flex items-center justify-center text-white">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wider uppercase text-gray-600 mb-1">Email</h3>
                  <p className="text-lg text-[#161b39]">{CONTACTO.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#802223] flex items-center justify-center text-white">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wider uppercase text-gray-600 mb-1">Teléfono</h3>
                  <p className="text-lg text-[#161b39]">{CONTACTO.telefono}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#802223] flex items-center justify-center text-white">
                  <span className="text-xl">📍</span>
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
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#802223] focus:outline-none transition-colors"
                />
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
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#802223] focus:outline-none transition-colors"
                />
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
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#802223] focus:outline-none transition-colors"
                />
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
                  required
                  rows={6}
                  placeholder="Cuéntanos qué tipo de vehículo buscas..."
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#802223] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#802223] hover:bg-[#6b1d1e] text-white py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
