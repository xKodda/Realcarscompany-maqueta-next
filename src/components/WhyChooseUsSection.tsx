'use client'

import { motion } from 'framer-motion'

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 md:py-32 bg-[#161b39] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
            La <span className="font-semibold">excelencia</span> nos define
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
            Más que una automotora, somos tu aliado en la búsqueda de la perfección
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              icon: '✨',
              title: 'Calidad Garantizada',
              description: 'Cada vehículo es meticulosamente inspeccionado para garantizar los más altos estándares'
            },
            {
              icon: '🛡️',
              title: 'Garantía Completa',
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
              className="text-center group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-[#802223] flex items-center justify-center rounded-xl">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-medium mb-4 tracking-wide">
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
  )
}

