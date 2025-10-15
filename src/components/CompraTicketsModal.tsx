'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useComprarTickets } from '@/hooks/usePagos'

interface Sorteo {
  id: string
  titulo: string
  premio: string
  precioTicket: number
  totalTickets: number
  ticketsVendidos: number
}

interface Props {
  sorteo: Sorteo
  onClose: () => void
}

export default function CompraTicketsModal({ sorteo, onClose }: Props) {
  const { comprar, loading, error } = useComprarTickets()
  
  const [cantidad, setCantidad] = useState(1)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rut: '',
    aceptaTerminos: false,
  })

  const ticketsDisponibles = sorteo.totalTickets - sorteo.ticketsVendidos
  const total = cantidad * sorteo.precioTicket

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones')
      return
    }

    const resultado = await comprar({
      sorteoId: sorteo.id,
      cantidad,
      comprador: {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        rut: formData.rut || undefined,
      },
    })

    if (resultado) {
      // El usuario será redirigido a Khipu automáticamente
      // No cerramos el modal hasta que se complete la redirección
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-light text-[#161b39] tracking-tight mb-2">
                Comprar Tickets
              </h3>
              <p className="text-gray-600">{sorteo.titulo}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resumen del sorteo */}
            <div className="bg-[#f2f2f4] p-6 border-l-4 border-[#802223]">
              <p className="text-xs text-gray-600 mb-2 tracking-wider uppercase">Premio</p>
              <p className="text-xl font-medium text-[#161b39] mb-4">{sorteo.premio}</p>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Precio por ticket</p>
                  <p className="text-lg font-bold text-[#802223]">
                    ${sorteo.precioTicket.toLocaleString('es-CL')}
                  </p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <p className="text-gray-600">Disponibles</p>
                  <p className="text-lg font-bold text-[#161b39]">
                    {ticketsDisponibles.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>

            {/* Cantidad de tickets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuántos tickets quieres comprar?
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-12 h-12 border-2 border-gray-300 hover:border-[#802223] text-gray-700 hover:text-[#802223] font-bold text-xl transition-all"
                  disabled={loading}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={ticketsDisponibles}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Math.min(ticketsDisponibles, parseInt(e.target.value) || 1)))}
                  className="flex-1 text-center text-2xl font-bold text-[#161b39] border-2 border-gray-300 focus:border-[#802223] focus:outline-none py-2 px-4"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setCantidad(Math.min(ticketsDisponibles, cantidad + 1))}
                  className="w-12 h-12 border-2 border-gray-300 hover:border-[#802223] text-gray-700 hover:text-[#802223] font-bold text-xl transition-all"
                  disabled={loading}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Máximo {ticketsDisponibles} tickets disponibles
              </p>
            </div>

            {/* Datos del comprador */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-[#161b39]">Tus datos</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:outline-none transition-colors"
                  placeholder="Juan Pérez"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recibirás tus tickets en este correo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:outline-none transition-colors"
                  placeholder="+56 9 1234 5678"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RUT (opcional)
                </label>
                <input
                  type="text"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:outline-none transition-colors"
                  placeholder="12.345.678-9"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Total */}
            <div className="bg-[#161b39] text-white p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg">Total a pagar:</span>
                <span className="text-3xl font-bold">
                  ${total.toLocaleString('es-CL')}
                </span>
              </div>
              <p className="text-white/70 text-sm">
                {cantidad} ticket{cantidad > 1 ? 's' : ''} × ${sorteo.precioTicket.toLocaleString('es-CL')}
              </p>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terminos"
                checked={formData.aceptaTerminos}
                onChange={(e) => setFormData({ ...formData, aceptaTerminos: e.target.checked })}
                className="mt-1"
                disabled={loading}
              />
              <label htmlFor="terminos" className="text-sm text-gray-600">
                Acepto los términos y condiciones del sorteo. Confirmo que soy mayor de 18 años y resido en Chile. 
                El sorteo se realizará en vivo y será supervisado por notario público.
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 text-sm font-medium tracking-wider uppercase transition-all"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#802223] hover:bg-[#6b1d1e] text-white py-4 text-sm font-medium tracking-wider uppercase transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Comprar Tickets
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Sistema listo para integración con pasarelas de pago (modo demo)
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}


