'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import AutoCard from '@/components/AutoCard'
import { autos } from '@/lib/data'
import { CONTACTO } from '@/lib/constants'

const HeroSlider = dynamic(() => import('@/components/HeroSlider'), {
  loading: () => (
    <div className="h-[85vh] md:h-[72vh] min-h-[500px] md:min-h-[520px] bg-gradient-to-br from-[#0A0F2C] via-[#141A36] to-[#541313]" />
  ),
})

export default function Home() {
  const autosDestacados = autos.filter(auto => auto.destacado)

  return (
    <div className="bg-white">
      {/* Hero Slider Premium */}
      <HeroSlider />

      {/* Autos Destacados */}
      {autosDestacados.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block mb-4 px-4 py-1.5 border border-[#802223] text-[#802223] text-xs tracking-[0.2em] uppercase">
                Colección exclusiva
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-[#161b39] mb-4 tracking-tight">
                Vehículos <span className="font-semibold">destacados</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Una selección cuidadosa de los mejores vehículos de nuestra colección
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {autosDestacados.map((auto, index) => (
                <AutoCard key={auto.id} auto={auto} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Por qué elegirnos - Premium */}
      <section className="py-16 md:py-24 bg-[#161b39] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4 tracking-tight">
              La <span className="font-semibold bg-gradient-to-r from-white to-[#d4af37] bg-clip-text text-transparent">excelencia</span> nos define
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto font-light">
              Más que una automotora, somos tu aliado en la búsqueda de la perfección
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: '✨',
                title: 'Calidad Premium',
                description: 'Cada vehículo es meticulosamente inspeccionado para garantizar los más altos estándares'
              },
              {
                icon: '🛡️',
                title: 'Garantía Extendida',
                description: 'Protección completa y tranquilidad para tu inversión'
              },
              {
                icon: '👔',
                title: 'Servicio Personalizado',
                description: 'Asesoría experta y atención exclusiva en cada paso del proceso'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 group-hover:border-[#802223] transition-colors duration-300">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-light mb-3 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-white/70 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Premium */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-light text-[#161b39] mb-6 tracking-tight">
              Comienza tu experiencia <span className="font-semibold text-[#802223]">premium</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 font-light leading-relaxed">
              Visita nuestro showroom o agenda una cita privada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/autos"
                className="inline-block bg-[#802223] hover:bg-[#6b1d1e] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                Ver colección
              </Link>
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, me gustaría obtener más información.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contactar ahora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
