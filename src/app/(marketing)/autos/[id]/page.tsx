import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { autos } from '@/lib/data'
import { CONTACTO } from '@/lib/constants'
import { formatPrice, formatDate } from '@/lib/utils'

interface AutoPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: AutoPageProps): Promise<Metadata> {
  const { id } = await params
  const auto = autos.find(a => a.id === id)
  
  if (!auto) {
    return {
      title: 'Auto no encontrado',
    }
  }

  return {
    title: `${auto.marca} ${auto.modelo} ${auto.año}`,
    description: auto.descripcion,
  }
}

export default async function AutoDetailPage({ params }: AutoPageProps) {
  const { id } = await params
  const auto = autos.find(a => a.id === id)

  if (!auto) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-[#f2f2f4] py-6">
        <div className="container mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-[#802223] transition-colors">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/autos" className="text-gray-600 hover:text-[#802223] transition-colors">
              Catálogo
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#161b39] font-medium">
              {auto.marca} {auto.modelo}
            </span>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen del vehículo */}
          <div>
            <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-sm">
              <Image
                src={auto.imagen}
                alt={`${auto.marca} ${auto.modelo}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                priority
              />
              {auto.destacado && (
                <div className="absolute top-6 left-6 bg-[#802223] text-white px-4 py-2 text-sm font-medium tracking-wider uppercase">
                  Destacado
                </div>
              )}
              {auto.kilometraje === 0 && (
                <div className="absolute top-6 right-6 bg-green-600 text-white px-4 py-2 text-sm font-medium tracking-wider uppercase">
                  0 KM
                </div>
              )}
            </div>
          </div>

          {/* Información del vehículo */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-light text-[#161b39] mb-2 tracking-tight">
                {auto.marca}
              </h1>
              <p className="text-5xl font-semibold text-[#161b39] mb-4">
                {auto.modelo}
              </p>
              <p className="text-2xl font-light text-[#802223] mb-6">
                {formatPrice(auto.precio)}
              </p>
            </div>

            {/* Especificaciones principales */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#f2f2f4] p-4">
                <p className="text-sm text-gray-600 mb-1">Año</p>
                <p className="text-lg font-medium text-[#161b39]">{auto.año}</p>
              </div>
              <div className="bg-[#f2f2f4] p-4">
                <p className="text-sm text-gray-600 mb-1">Kilometraje</p>
                <p className="text-lg font-medium text-[#161b39]">
                  {auto.kilometraje === 0 ? '0 KM' : `${auto.kilometraje.toLocaleString('es-CL')} km`}
                </p>
              </div>
              <div className="bg-[#f2f2f4] p-4">
                <p className="text-sm text-gray-600 mb-1">Transmisión</p>
                <p className="text-lg font-medium text-[#161b39]">{auto.transmision}</p>
              </div>
              <div className="bg-[#f2f2f4] p-4">
                <p className="text-sm text-gray-600 mb-1">Combustible</p>
                <p className="text-lg font-medium text-[#161b39]">{auto.combustible}</p>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-[#161b39] mb-4">Descripción</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                {auto.descripcion}
              </p>
            </div>

            {/* Características */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-[#161b39] mb-4">Características</h3>
              <div className="grid grid-cols-1 gap-2">
                {auto.caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[#802223] text-sm">✓</span>
                    <span className="text-gray-700 font-light">{caracteristica}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(`Hola, me interesa el ${auto.marca} ${auto.modelo} ${auto.año}. ¿Está disponible?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 text-sm font-medium tracking-wider uppercase transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Consultar
              </a>
              <Link
                href="/contacto"
                className="flex-1 border-2 border-[#161b39] text-[#161b39] hover:bg-[#161b39] hover:text-white text-center py-4 text-sm font-medium tracking-wider uppercase transition-all inline-flex items-center justify-center"
              >
                Formulario
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA para ver más autos */}
      <section className="py-16 bg-[#f2f2f4]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-[#161b39] mb-4">
            ¿Te interesa otro vehículo?
          </h2>
          <p className="text-lg text-gray-600 mb-8 font-light">
            Explora nuestra colección completa de vehículos premium
          </p>
          <Link
            href="/autos"
            className="inline-block bg-[#802223] hover:bg-[#6b1d1e] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-all"
          >
            Ver todos los autos
          </Link>
        </div>
      </section>
    </div>
  )
}



