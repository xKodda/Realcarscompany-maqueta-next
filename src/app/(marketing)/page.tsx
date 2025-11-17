import FeaturedAutosSection from '@/components/FeaturedAutosSection'
import HeroSliderWrapper from '@/components/HeroSliderWrapper'
import SafePurchaseSection from '@/components/SafePurchaseSection'
import WhyChooseUsSection from '@/components/WhyChooseUsSection'
import FinalCTASection from '@/components/FinalCTASection'
import { prisma } from '@/lib/prisma'
import type { Auto } from '@/lib/types'

// Forzar renderizado dinámico para evitar errores durante el build
export const dynamic = 'force-dynamic'
export const revalidate = 0

function serializeAuto(auto: any): Auto {
  return {
    id: auto.id,
    marca: auto.marca,
    modelo: auto.modelo,
    año: auto.anio,
    precio: Number(auto.precio),
    kilometraje: auto.kilometraje,
    transmision: auto.transmision as 'Manual' | 'Automática',
    combustible: auto.combustible as 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido',
    color: auto.color,
    imagen: auto.imagen,
    imagenes: auto.imagenes || [],
    descripcion: auto.descripcion,
    caracteristicas: auto.caracteristicas || [],
    estado: auto.estado as 'disponible' | 'vendido' | 'reservado',
    destacado: auto.destacado || false,
    slug: auto.slug,
  }
}

async function getFeaturedAutos() {
  try {
    const autos = await prisma.auto.findMany({
      where: {
        destacado: true,
        estado: 'disponible',
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    })

    return autos.map(serializeAuto)
  } catch (error) {
    console.error('Error fetching featured autos:', error)
    return []
  }
}

export default async function Home() {
  // Obtener autos destacados desde la base de datos
  const autosDestacados = await getFeaturedAutos()

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <HeroSliderWrapper />

      {/* Autos Destacados */}
      <FeaturedAutosSection autos={autosDestacados} />

      {/* Compra tu auto de manera segura */}
      <SafePurchaseSection />

      {/* Por qué elegirnos */}
      <WhyChooseUsSection />

      {/* CTA Final */}
      <FinalCTASection />
    </div>
  )
}