'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CONTACTO } from '@/lib/constants'
import CompraTicketsModal from '@/components/CompraTicketsModal'
import { useScrollLock } from '@/hooks/useScrollLock'

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

// Función de seguridad para sanitizar texto
const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return ''
  // Remover caracteres potencialmente peligrosos pero mantener emojis seguros
  return text
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000)
}

// Función de seguridad para sanitizar URLs
const sanitizeUrl = (url: string): string => {
  if (typeof url !== 'string') return ''
  // Solo permitir URLs relativas o absolutas válidas
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return ''
}

// Función para generar URL de WhatsApp de forma segura
const generateWhatsAppUrl = (message: string): string => {
  const sanitized = sanitizeText(message)
  const encoded = encodeURIComponent(sanitized)
  return `https://wa.me/${CONTACTO.whatsapp}?text=${encoded}`
}

export default function SorteosPageClient() {
  const [selectedSorteo, setSelectedSorteo] = useState<Sorteo | null>(null)
  const [showCompraModal, setShowCompraModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)

  // Datos de ejemplo - estos vendrán del backend más adelante
  const sorteos: Sorteo[] = useMemo(() => [
    {
      id: '1',
      titulo: 'Gran Sorteo Moto 2025',
      descripcion: '¡Compra tus tickets y participa por esta increíble moto! Sorteo en vivo con notario público.',
      imagen: '/images/brand/moto2.jpeg',
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
  ], [])

  const handleSorteoClick = useCallback((sorteo: Sorteo) => {
    setSelectedSorteo(sorteo)
    setShowCompraModal(true)
  }, [])

  const handleViewDetails = useCallback((sorteo: Sorteo) => {
    setSelectedSorteo(sorteo)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedSorteo(null)
    setShowCompraModal(false)
  }, [])

  const handleCloseGallery = useCallback(() => {
    setShowGalleryModal(false)
  }, [])


  const whatsappUrl = useMemo(() =>
    generateWhatsAppUrl('Hola, tengo dudas sobre los sorteos.'),
    []
  )

  const whatsappUrlEmpty = useMemo(() =>
    generateWhatsAppUrl('Hola, quisiera información sobre futuros sorteos.'),
    []
  )

  // Bloquear scroll cuando cualquier modal está abierto
  useScrollLock(!!(selectedSorteo || showCompraModal || showGalleryModal))

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section
        className="bg-gradient-to-br from-[#161b39] via-[#1d2447] to-[#802223] text-white py-16 sm:py-20 md:py-24"
        aria-label="Encabezado de sorteos"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-block mb-4 px-4 py-1.5 border border-white/30 text-white text-xs tracking-wider uppercase">
              Tu oportunidad de ganar
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Sorteos <span className="font-semibold">premium</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 font-light leading-relaxed">
              Participa en nuestros sorteos exclusivos y gana increíbles premios
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sorteos Activos */}
      <section
        className="py-16 sm:py-20 md:py-24 bg-white"
        aria-label="Sorteos disponibles"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-6">

          <div className="max-w-5xl mx-auto">
            <div className="grid gap-6 sm:gap-8 grid-cols-1">
              {sorteos.map((sorteo, index) => {
                const isDisabled = sorteo.ticketsVendidos >= sorteo.totalTickets
                const sanitizedTitulo = sanitizeText(sorteo.titulo)
                const sanitizedPremio = sanitizeText(sorteo.premio)
                const sanitizedImagen = sanitizeUrl(sorteo.imagen)

                return (
                  <motion.article
                    key={sorteo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Imagen */}
                      <div
                        className="relative overflow-hidden cursor-pointer bg-gray-50 h-64 sm:h-80 lg:h-full min-h-[400px]"
                        onClick={() => setShowGalleryModal(true)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Ver galería de ${sanitizedTitulo}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setShowGalleryModal(true)
                          }
                        }}
                      >
                        {sanitizedImagen && (
                          <Image
                            src={sanitizedImagen}
                            alt={`${sanitizedTitulo} - ${sanitizedPremio}`}
                            fill
                            className="object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            quality={90}
                            priority={index === 0}
                            loading={index === 0 ? 'eager' : 'lazy'}
                          />
                        )}

                        {/* Badge de estado */}
                        <div
                          className={`absolute top-2 right-2 px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wider uppercase rounded-full shadow-lg ${sorteo.estado === 'activo'
                            ? 'bg-green-500 text-white'
                            : sorteo.estado === 'proximo'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-500 text-white'
                            }`}
                          aria-label={`Estado: ${sorteo.estado}`}
                        >
                          <span className="hidden sm:inline">
                            {sorteo.estado === 'activo' ? '🔥 Activo' : sorteo.estado === 'proximo' ? '🎯 Próximamente' : 'Finalizado'}
                          </span>
                          <span className="sm:hidden">
                            {sorteo.estado === 'activo' ? '🔥' : sorteo.estado === 'proximo' ? '🎯' : '✓'}
                          </span>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                          {/* Título y premio */}
                          <header className="mb-6">
                            <h3 className="text-2xl sm:text-3xl font-light text-[#161b39] mb-2 tracking-tight">
                              {sanitizedTitulo}
                            </h3>
                            <p className="text-xl sm:text-2xl text-[#802223] font-semibold">
                              {sanitizedPremio}
                            </p>
                          </header>

                          {/* Precio */}
                          <div className="mb-6 pb-6 border-b border-gray-200">
                            <span className="text-sm text-gray-500 uppercase tracking-wider font-light mb-2 block">
                              Precio por ticket
                            </span>
                            <span className="text-3xl sm:text-4xl font-bold text-[#802223]">
                              ${sorteo.precioTicket.toLocaleString('es-CL')}
                            </span>
                          </div>

                          {/* Info adicional */}
                          <div className="mb-6 space-y-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#802223] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(sorteo.ticketsVendidos / sorteo.totalTickets) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Botones */}
                        <div className="space-y-3">
                          {sorteo.estado !== 'finalizado' && (
                            <button
                              onClick={() => handleSorteoClick(sorteo)}
                              disabled={isDisabled}
                              aria-label={isDisabled ? 'Tickets agotados' : `Comprar tickets para ${sanitizedTitulo}`}
                              aria-disabled={isDisabled}
                              className={`w-full py-4 text-base font-semibold tracking-wider uppercase transition-all duration-300 rounded-lg disabled:cursor-not-allowed disabled:opacity-70 ${isDisabled
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-gradient-to-r from-[#802223] to-[#6b1d1e] hover:from-[#6b1d1e] hover:to-[#802223] text-white shadow-md hover:shadow-lg'
                                }`}
                            >
                              {isDisabled ? 'Agotado' : 'Comprar Tickets'}
                            </button>
                          )}

                          <button
                            onClick={() => handleViewDetails(sorteo)}
                            aria-label={`Ver detalles de ${sanitizedTitulo}`}
                            className="w-full py-3 text-sm font-medium tracking-wide text-[#161b39] hover:text-[#802223] border-2 border-gray-200 hover:border-[#802223] rounded-lg transition-all duration-300"
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>

          {/* Mensaje cuando no hay sorteos */}
          {sorteos.length === 0 && (
            <div className="text-center py-12 sm:py-16 md:py-20" role="status" aria-live="polite">
              <div className="text-5xl sm:text-6xl mb-4" aria-hidden="true">🎁</div>
              <h3 className="text-xl sm:text-2xl font-light text-[#161b39] mb-2">
                No hay sorteos disponibles
              </h3>
              <p className="text-base sm:text-lg text-gray-600 font-light mb-6 max-w-md mx-auto px-4">
                Pronto lanzaremos nuevos sorteos increíbles. ¡Mantente atento!
              </p>
              <a
                href={whatsappUrlEmpty}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium tracking-wider uppercase transition-all rounded-lg"
                aria-label="Contactar por WhatsApp para información sobre sorteos futuros"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>Notificarme</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Cómo participar */}
      <section
        className="py-16 sm:py-20 md:py-24 bg-[#161b39] text-white relative"
        aria-label="Cómo participar en los sorteos"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <header className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 tracking-tight">
                ¿Cómo <span className="font-semibold">participar?</span>
              </h2>
              <p className="text-lg text-white/80 font-light max-w-2xl mx-auto">
                Es muy sencillo, solo sigue estos pasos
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { step: 1, title: 'Compra Tickets', desc: 'Elige la cantidad y completa el formulario' },
                { step: 2, title: 'Paga con Khipu', desc: 'Transferencia bancaria segura e instantánea' },
                { step: 3, title: 'Recibe Tickets', desc: 'Tus números llegarán a tu email' },
                { step: 4, title: '¡Sorteo en Vivo!', desc: 'Transmitido por Instagram con notario' },
              ].map((item, idx) => (
                <div key={item.step} className="text-center group">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center text-2xl sm:text-3xl font-light group-hover:bg-[#802223] transition-all duration-300"
                    aria-label={`Paso ${item.step}`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed px-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        className="py-16 sm:py-20 md:py-24 bg-gray-50"
        aria-label="Contacto para consultas"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#161b39] mb-4 tracking-tight">
              ¿Tienes <span className="font-semibold">dudas?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
              Contáctanos por WhatsApp y resolveremos todas tus consultas sobre el sorteo
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 text-base sm:text-lg font-medium tracking-wider uppercase transition-all duration-300 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                aria-label="Contactar por WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal de detalles del sorteo */}
      <AnimatePresence>
        {selectedSorteo && !showCompraModal && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <header className="flex justify-between items-start mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
                  <h3
                    id="modal-title"
                    className="text-xl sm:text-2xl md:text-3xl font-light text-[#161b39] tracking-tight pr-2"
                  >
                    {sanitizeText(selectedSorteo.titulo)}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-[#802223] transition-colors text-2xl sm:text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 flex-shrink-0"
                    aria-label="Cerrar modal"
                  >
                    ×
                  </button>
                </header>

                <div className="space-y-4 sm:space-y-6">
                  {/* Info del premio */}
                  <div className="bg-gradient-to-br from-[#f8f8f9] to-white p-4 sm:p-6 border-l-4 border-[#802223] shadow-sm">
                    <p className="text-xs text-gray-500 mb-2 tracking-wider uppercase font-medium">Premio</p>
                    <p className="text-xl sm:text-2xl font-light text-[#161b39] mb-3 sm:mb-4 tracking-tight">
                      {sanitizeText(selectedSorteo.premio)}
                    </p>
                    <div className="inline-flex items-center gap-2">
                      <p className="text-gray-500 text-xs uppercase tracking-wider">Precio por ticket:</p>
                      <p className="text-base sm:text-lg font-semibold text-[#802223]">
                        ${selectedSorteo.precioTicket.toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>

                  <section>
                    <h4 className="text-base sm:text-lg font-medium text-[#161b39] mb-2 sm:mb-3">Requisitos</h4>
                    <ul className="space-y-1.5 sm:space-y-2" role="list">
                      {selectedSorteo.requisitos.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#802223] mt-1 font-medium" aria-hidden="true">•</span>
                          <span className="text-sm sm:text-base text-gray-700 font-light">{sanitizeText(req)}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-base sm:text-lg font-medium text-[#161b39] mb-2 sm:mb-3">Mecánica del sorteo</h4>
                    <ol className="space-y-1.5 sm:space-y-2" role="list">
                      {selectedSorteo.mecanica.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3">
                          <span className="text-[#802223] font-medium flex-shrink-0">{idx + 1}.</span>
                          <span className="text-sm sm:text-base text-gray-700 font-light">{sanitizeText(step)}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <div className="pt-4 sm:pt-6 border-t flex flex-col sm:flex-row gap-3">
                    {selectedSorteo.estado !== 'finalizado' && selectedSorteo.ticketsVendidos < selectedSorteo.totalTickets && (
                      <button
                        onClick={() => setShowCompraModal(true)}
                        className="flex-1 bg-[#802223] hover:bg-[#6b1d1e] text-white text-center py-3 sm:py-4 text-sm font-medium tracking-wider uppercase transition-all rounded-lg"
                        aria-label="Comprar tickets ahora"
                      >
                        Comprar tickets ahora
                      </button>
                    )}
                    <a
                      href={generateWhatsAppUrl(`Hola, tengo dudas sobre el sorteo: ${selectedSorteo.titulo}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-center py-3 sm:py-4 text-sm font-medium tracking-wider uppercase transition-all inline-flex items-center justify-center gap-2 rounded-lg"
                      aria-label="Consultar por WhatsApp"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span>Consultar</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de compra de tickets */}
      <AnimatePresence>
        {selectedSorteo && showCompraModal && (
          <CompraTicketsModal
            sorteo={selectedSorteo}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* Modal de galería de fotos */}
      <AnimatePresence>
        {showGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
            onClick={handleCloseGallery}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white max-w-6xl w-full max-h-[95vh] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#161b39] to-[#802223]">
                <div className="flex justify-between items-center">
                  <h3
                    id="gallery-title"
                    className="text-xl sm:text-2xl font-light text-white tracking-tight"
                  >
                    Galería de <span className="font-semibold">imágenes</span>
                  </h3>
                  <button
                    onClick={handleCloseGallery}
                    className="text-white/80 hover:text-white text-2xl sm:text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Cerrar galería"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(95vh-100px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    '/images/brand/moto2.jpeg',
                    '/images/brand/moto1.jpeg',
                    '/images/brand/moto3.jpeg',
                    '/images/brand/moto4.jpeg'
                  ].map((imagen, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full overflow-hidden rounded-xl border-2 border-gray-200 hover:border-[#802223] transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
                    >
                      <Image
                        src={sanitizeUrl(imagen)}
                        alt={`Moto - Vista ${idx + 1}`}
                        fill
                        className="object-contain object-center group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-gray-50 to-white"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                        quality={90}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        priority={idx === 0}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8 text-center border-t border-gray-200 pt-6 sm:pt-8">
                  <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 font-light">
                    Esta moto puede ser tuya. ¡Compra tus tickets y participa!
                  </p>
                  <button
                    onClick={() => {
                      handleCloseGallery()
                      if (sorteos[0]) {
                        handleSorteoClick(sorteos[0])
                      }
                    }}
                    className="bg-gradient-to-r from-[#802223] to-[#6b1d1e] hover:from-[#6b1d1e] hover:to-[#802223] text-white px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base font-medium tracking-wider uppercase transition-all rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    aria-label="Comprar tickets ahora"
                  >
                    Comprar Tickets Ahora
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
