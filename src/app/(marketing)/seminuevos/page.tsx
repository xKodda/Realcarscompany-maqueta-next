'use client'

import { motion } from 'framer-motion'
import AutoCard from '@/components/AutoCard'
import { autos } from '@/lib/data'
import { CONTACTO } from '@/lib/constants'

export default function SeminuevosPage() {
  // Filtrar autos con kilometraje > 0 (seminuevos)
  const seminuevos = autos.filter(auto => auto.kilometraje > 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Header de página premium */}
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
              Vehículos <span className="font-semibold">seminuevos</span>
            </h1>
            <p className="text-xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto">
              Cada vehículo seminuevo pasa por un riguroso proceso de inspección 
              y certificación para garantizar los más altos estándares de calidad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Beneficios de Seminuevos */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#161b39] mb-8">
              Beneficios <span className="font-semibold">exclusivos</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#802223] text-white mx-auto mb-4 flex items-center justify-center text-2xl">
                ✓
              </div>
              <h3 className="text-lg font-medium text-[#161b39] mb-2 tracking-wide">
                Certificación completa
              </h3>
              <p className="text-gray-600 font-light">
                Inspección técnica completa de 150 puntos
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#802223] text-white mx-auto mb-4 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h3 className="text-lg font-medium text-[#161b39] mb-2 tracking-wide">
                Garantía completa
              </h3>
              <p className="text-gray-600 font-light">
                Hasta 2 años de garantía incluida
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#802223] text-white mx-auto mb-4 flex items-center justify-center text-2xl">
                📋
              </div>
              <h3 className="text-lg font-medium text-[#161b39] mb-2 tracking-wide">
                Historial completo
              </h3>
              <p className="text-gray-600 font-light">
                Documentación completa y transparente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de autos seminuevos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-[#161b39] mb-4 tracking-tight">
              Nuestra <span className="font-semibold">Selección</span>
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Vehículos seminuevos cuidadosamente seleccionados y certificados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seminuevos.map((auto) => (
              <AutoCard key={auto.id} auto={auto} />
            ))}
          </div>

          {seminuevos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg font-light mb-6">
                Actualmente no tenemos vehículos seminuevos disponibles
              </p>
              <a
                href="/autos"
                className="inline-block bg-[#802223] hover:bg-[#6b1d1e] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                Ver Catálogo Completo
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Proceso de Certificación */}
      <section className="py-20 bg-[#161b39] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-6 tracking-tight">
              Proceso de <span className="font-semibold">Certificación</span>
            </h2>
            <p className="text-xl text-white/70 mb-12 font-light">
              Cada vehículo pasa por nuestro riguroso proceso de calidad
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">01</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Inspección</h3>
                <p className="text-white/60 font-light text-sm">Revisión técnica completa</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">02</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Reparación</h3>
                <p className="text-white/60 font-light text-sm">Mantenimiento preventivo</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">03</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Certificación</h3>
                <p className="text-white/60 font-light text-sm">Aprobación de calidad</p>
              </div>

              <div className="text-center">
                <div className="text-5xl font-light text-[#802223] mb-2">04</div>
                <h3 className="text-sm tracking-widest uppercase mb-2">Garantía</h3>
                <p className="text-white/60 font-light text-sm">Protección extendida</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#f2f2f4]">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light text-[#161b39] mb-4">
              ¿Interesado en un seminuevo premium?
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light">
              Agenda una visita y conoce nuestros vehículos certificados
            </p>
            <a
              href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, me interesan los vehículos seminuevos. ¿Pueden darme más información?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Agendar visita
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}



