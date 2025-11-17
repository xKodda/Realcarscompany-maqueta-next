'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CONTACTO } from '@/lib/constants'
import CompraTicketsModal from '@/components/CompraTicketsModal'

interface Sorteo {
  id: string
  titulo: string
  descripcion: string
  imagen: string
  premio: string
  fechaInicio: string
  fechaFin: string
  fechaSorteo: string
  estado: 'activo' | 'proximo' | 'finalizado'
  totalTickets: number
  ticketsVendidos: number
  precioTicket: number
  requisitos: string[]
  mecanica: string[]
}

export default function SorteosPage() {
  const [selectedSorteo, setSelectedSorteo] = useState<Sorteo | null>(null)
  const [showCompraModal, setShowCompraModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)

  // Datos de ejemplo - estos vendrán del backend más adelante
  const sorteos: Sorteo[] = [
    {
      id: '1',
          titulo: 'Gran Sorteo Moto 2025',
      descripcion: '¡Compra tus tickets y participa por esta increíble moto! Sorteo en vivo con notario público.',
      imagen: '/images/brand/moto1.jpeg',
          premio: 'Moto 0km',
      fechaInicio: '2025-01-15',
      fechaFin: '2025-04-30',
      fechaSorteo: '2025-04-30T20:00:00',
      estado: 'activo',
      totalTickets: 5000,
      ticketsVendidos: 1250,
      precioTicket: 3000,
      requisitos: [
        'Ser mayor de 18 años',
        'Residir en Chile',
        'Tener licencia de conducir clase C vigente',
        'Comprar al menos 1 ticket',
        'Proporcionar datos válidos para contacto',
      ],
      mecanica: [
        'Compra tus tickets de forma segura a través de Khipu (transferencia bancaria)',
        'Recibirás tus números de tickets por correo electrónico inmediatamente',
        'Cada ticket tiene un número único y consecutivo',
        'El sorteo se realizará en vivo por Instagram el 30 de abril a las 20:00 hrs',
        'El número ganador será seleccionado de forma aleatoria y transparente',
        'El ganador será contactado de inmediato por teléfono y email',
        'El ganador tiene 48 horas para confirmar y reclamar su premio',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#161b39] via-[#1d2447] to-[#802223] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-block mb-4 px-4 py-1.5 border border-white/30 text-white text-xs tracking-[0.2em] uppercase">
              Tu oportunidad de ganar
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Sorteos <span className="font-semibold">premium</span>
            </h1>
            <p className="text-xl text-white/80 font-light leading-relaxed">
              Participa en nuestros sorteos exclusivos y gana increíbles premios. 
              ¡Tu próxima moto te está esperando!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sorteos Activos */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-6 px-8 py-4 bg-[#161b39] rounded-2xl shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
                Sorteos <span className="font-semibold">disponibles</span>
              </h2>
            </div>
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Revisa los sorteos activos y próximos. ¡La suerte está de tu lado!
            </p>
          </motion.div>

          <div className={`grid gap-6 max-w-5xl mx-auto ${
            sorteos.length === 1 
              ? 'grid-cols-1 max-w-md' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {sorteos.map((sorteo, index) => (
              <motion.div
                key={sorteo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100 max-w-sm mx-auto"
              >
                {/* Imagen sin fondo - solo la imagen */}
                <div className="relative h-48 sm:h-52 overflow-hidden cursor-pointer bg-transparent" onClick={() => setShowGalleryModal(true)}>
                  <Image
                    src={sorteo.imagen}
                    alt={sorteo.titulo}
                    fill
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={90}
                  />
                  
                  {/* Badge de estado flotante */}
                  <div className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold tracking-wider uppercase rounded-full shadow-lg ${
                    sorteo.estado === 'activo' 
                      ? 'bg-green-500 text-white' 
                      : sorteo.estado === 'proximo'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {sorteo.estado === 'activo' ? '🔥 Activo' : sorteo.estado === 'proximo' ? '🎯 Próximamente' : 'Finalizado'}
                  </div>
                </div>

                {/* Contenido compacto */}
                <div className="p-4">
                  {/* Título y premio */}
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-light text-[#161b39] mb-1 tracking-tight">
                      {sorteo.titulo}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#802223] font-medium">
                      {sorteo.premio}
                    </p>
                  </div>

                  {/* Información clave compacta */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-2.5 bg-[#f8f8f9] rounded-lg border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider font-light">Precio</p>
                      <p className="text-lg font-bold text-[#802223]">
                        ${sorteo.precioTicket.toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div className="text-center p-2.5 bg-[#f8f8f9] rounded-lg border border-gray-100">
                      <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider font-light">Disponibles</p>
                      <p className="text-lg font-bold text-[#161b39]">
                        {(sorteo.totalTickets - sorteo.ticketsVendidos).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>

                  {/* Botón principal */}
                  {sorteo.estado !== 'finalizado' && (
                    <button
                      onClick={() => {
                        setSelectedSorteo(sorteo)
                        setShowCompraModal(true)
                      }}
                      disabled={sorteo.ticketsVendidos >= sorteo.totalTickets}
                      className={`w-full py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-lg mb-2 ${
                        sorteo.ticketsVendidos >= sorteo.totalTickets
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#802223] to-[#6b1d1e] hover:from-[#6b1d1e] hover:to-[#802223] text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {sorteo.ticketsVendidos >= sorteo.totalTickets ? 'Agotado' : 'Comprar Tickets'}
                    </button>
                  )}
                  
                  {/* Botón secundario */}
                  <button
                    onClick={() => setSelectedSorteo(sorteo)}
                    className="w-full py-2 text-xs font-medium tracking-wide text-[#161b39] hover:text-[#802223] border border-gray-200 hover:border-[#802223] rounded-lg transition-all duration-300"
                  >
                    Ver detalles
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mensaje cuando no hay sorteos */}
          {sorteos.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-2xl font-light text-[#161b39] mb-2">
                No hay sorteos disponibles
              </h3>
              <p className="text-gray-600 font-light mb-6">
                Pronto lanzaremos nuevos sorteos increíbles. ¡Mantente atento!
              </p>
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, quisiera información sobre futuros sorteos.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Notificarme
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Cómo participar */}
      <section className="py-20 md:py-32 bg-[#161b39] text-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-20">
              <div className="inline-block mb-8 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
                <h2 className="text-4xl md:text-6xl font-light mb-2 tracking-tight">
                  ¿Cómo <span className="font-semibold">participar?</span>
                </h2>
              </div>
              <p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
                Es muy sencillo, solo sigue estos pasos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-light group-hover:bg-[#802223] transition-all duration-300">
                  1
                </div>
                <h3 className="text-xl font-medium mb-3">Compra Tickets</h3>
                <p className="text-white/70 font-light leading-relaxed">
                  Elige la cantidad y completa el formulario
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-light group-hover:bg-[#802223] transition-all duration-300">
                  2
                </div>
                <h3 className="text-xl font-medium mb-3">Paga con Khipu</h3>
                <p className="text-white/70 font-light leading-relaxed">
                  Transferencia bancaria segura e instantánea
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-light group-hover:bg-[#802223] transition-all duration-300">
                  3
                </div>
                <h3 className="text-xl font-medium mb-3">Recibe Tickets</h3>
                <p className="text-white/70 font-light leading-relaxed">
                  Tus números llegarán a tu email
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-light group-hover:bg-[#802223] transition-all duration-300">
                  4
                </div>
                <h3 className="text-xl font-medium mb-3">¡Sorteo en Vivo!</h3>
                <p className="text-white/70 font-light leading-relaxed">
                  Transmitido por Instagram con notario
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-8 px-8 py-4 bg-[#802223] rounded-2xl shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight">
                ¿Tienes <span className="font-semibold">dudas?</span>
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Contáctanos por WhatsApp y resolveremos todas tus consultas sobre el sorteo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, tengo dudas sobre los sorteos.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-12 py-5 text-lg font-medium tracking-wider uppercase transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contactar por WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal de detalles del sorteo */}
      {selectedSorteo && !showCompraModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSorteo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-3xl font-light text-[#161b39] tracking-tight">
                  {selectedSorteo.titulo}
                </h3>
                <button
                  onClick={() => setSelectedSorteo(null)}
                  className="text-gray-400 hover:text-[#802223] transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Info del premio */}
                <div className="bg-gradient-to-br from-[#f8f8f9] to-white p-6 border-l-4 border-[#802223] shadow-sm">
                  <p className="text-xs text-gray-500 mb-2 tracking-wider uppercase font-medium">Premio</p>
                  <p className="text-2xl font-light text-[#161b39] mb-4 tracking-tight">{selectedSorteo.premio}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Precio por ticket</p>
                      <p className="text-lg font-semibold text-[#802223]">${selectedSorteo.precioTicket.toLocaleString('es-CL')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tickets disponibles</p>
                      <p className="text-lg font-semibold text-[#161b39]">
                        {(selectedSorteo.totalTickets - selectedSorteo.ticketsVendidos).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-[#161b39] mb-3">Requisitos</h4>
                  <ul className="space-y-2">
                    {selectedSorteo.requisitos.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#802223] mt-1">✓</span>
                        <span className="text-gray-700 font-light">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-[#161b39] mb-3">Mecánica del sorteo</h4>
                  <ol className="space-y-2">
                    {selectedSorteo.mecanica.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#802223] font-medium">{idx + 1}.</span>
                        <span className="text-gray-700 font-light">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-6 border-t flex gap-3">
                  {selectedSorteo.estado !== 'finalizado' && selectedSorteo.ticketsVendidos < selectedSorteo.totalTickets && (
                    <button
                      onClick={() => setShowCompraModal(true)}
                      className="flex-1 bg-[#802223] hover:bg-[#6b1d1e] text-white text-center py-4 text-sm font-medium tracking-wider uppercase transition-all"
                    >
                      Comprar tickets ahora
                    </button>
                  )}
                  <a
                    href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(`Hola, tengo dudas sobre el sorteo: ${selectedSorteo.titulo}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-center py-4 text-sm font-medium tracking-wider uppercase transition-all inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Consultar
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

          {/* Modal de compra de tickets */}
          {selectedSorteo && showCompraModal && (
            <CompraTicketsModal
              sorteo={selectedSorteo}
              onClose={() => {
                setShowCompraModal(false)
                setSelectedSorteo(null)
              }}
            />
          )}

          {/* Modal de galería de fotos */}
          {showGalleryModal && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowGalleryModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-light text-[#161b39] tracking-tight">
                      Galería de <span className="font-semibold">imágenes</span>
                    </h3>
                    <button
                      onClick={() => setShowGalleryModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-3xl"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      '/images/brand/moto1.jpeg',
                      '/images/brand/moto2.jpeg', 
                      '/images/brand/moto3.jpeg',
                      '/images/brand/moto4.jpeg'
                    ].map((imagen, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200 hover:border-[#802223] transition-colors"
                      >
                        <Image
                          src={imagen}
                          alt={`Moto - Vista ${idx + 1}`}
                          fill
                          className="object-contain object-center hover:scale-105 transition-transform duration-300 bg-gray-50"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          quality={75}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-4">
                      Esta moto puede ser tuya. ¡Compra tus tickets y participa!
                    </p>
                    <button
                      onClick={() => {
                        setShowGalleryModal(false)
                        setSelectedSorteo(sorteos[0])
                        setShowCompraModal(true)
                      }}
                      className="bg-[#802223] hover:bg-[#6b1d1e] text-white px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all"
                    >
                      Comprar Tickets Ahora
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )
    }

