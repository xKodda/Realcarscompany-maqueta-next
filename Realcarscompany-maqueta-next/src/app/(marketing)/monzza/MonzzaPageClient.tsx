'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const TICKET_OFFERS = [
  { id: 'single', name: '1 Imagen Digital', quantity: 1, price: 3000 },
  { id: 'pack', name: 'Pack (4 Imágenes)', quantity: 4, price: 10000 }
]

const REGIONES_Y_COMUNAS: Record<string, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'].sort((a, b) => a.localeCompare(b)),
  'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'].sort((a, b) => a.localeCompare(b)),
  'Antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'].sort((a, b) => a.localeCompare(b)),
  'Atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'].sort((a, b) => a.localeCompare(b)),
  'Coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paihuano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'].sort((a, b) => a.localeCompare(b)),
  'Valparaíso': ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana'].sort((a, b) => a.localeCompare(b)),
  'Región Metropolitana': ['Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Santiago', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'].sort((a, b) => a.localeCompare(b)),
  "O'Higgins": ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'].sort((a, b) => a.localeCompare(b)),
  'Maule': ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'].sort((a, b) => a.localeCompare(b)),
  'Ñuble': ['Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Quirihue', 'Ránquil', 'Treguaco', 'Bulnes', 'Chillán Viejo', 'Chillán', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay', 'Coihueco', 'Ñiquén', 'San Carlos', 'San Fabián', 'San Nicolás'].sort((a, b) => a.localeCompare(b)),
  'Biobío': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Alto Biobío'].sort((a, b) => a.localeCompare(b)),
  'La Araucanía': ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'].sort((a, b) => a.localeCompare(b)),
  'Los Ríos': ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'].sort((a, b) => a.localeCompare(b)),
  'Los Lagos': ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'].sort((a, b) => a.localeCompare(b)),
  'Aysén': ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', "O'Higgins", 'Tortel', 'Chile Chico', 'Río Ibáñez'].sort((a, b) => a.localeCompare(b)),
  'Magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'].sort((a, b) => a.localeCompare(b))
}

export default function MonzzaPageClient() {
  const router = useRouter()
  // Estado para manejar cantidades arbitrarias
  const [cart, setCart] = useState<{ single: number, pack: number }>({
    single: 1,
    pack: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState('/images/brand/moto1.jpeg')
  
  const [formData, setFormData] = useState({
    rut: '', nombre: '', apellidos: '', email: '',
    telefono: '', region: '', comuna: '', direccion: '',
    acceptTerms: false
  })

  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([])

  useEffect(() => {
    if (formData.region && REGIONES_Y_COMUNAS[formData.region]) {
      setComunasDisponibles(REGIONES_Y_COMUNAS[formData.region])
      setFormData(prev => ({ ...prev, comuna: '' }))
    } else {
      setComunasDisponibles([])
    }
  }, [formData.region])

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase()
    if (value.length > 1) {
      const dv = value.slice(-1)
      let cuerpo = value.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      value = `${cuerpo}-${dv}`
    }
    setFormData({ ...formData, rut: value })
  }

  const updateCart = (id: string, delta: number) => {
    setCart(prev => ({
      ...prev,
      [id as keyof typeof prev]: Math.max(0, prev[id as keyof typeof prev] + delta)
    }))
  }

  const totalTickets = (cart.single * 1) + (cart.pack * 4)
  const totalPrice = (cart.single * 3000) + (cart.pack * 10000)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (totalTickets === 0) {
      setError('Debes seleccionar al menos una imagen digital.')
      return
    }
    if (!formData.rut || !formData.acceptTerms) {
      setError('Verifica el RUT y los términos.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const ordenId = 'RC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      const completePhone = `+569${formData.telefono}`

      const response = await fetch('/api/pagos/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: totalPrice,
          email: formData.email,
          nombre: `${formData.nombre} ${formData.apellidos}`,
          ordenId: ordenId,
          metadata: {
            rut: formData.rut,
            tickets: totalTickets,
            cart_single: cart.single,
            cart_pack: cart.pack,
            telefono: completePhone,
            direccion: `${formData.direccion}, ${formData.comuna}, ${formData.region}`
          }
        })
      })

      const data = await response.json()
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Error al conectar con Flow')
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Error inesperado.')
      setLoading(false)
    }
  }

  // Gallery Array
  const gallery = [1, 2, 3]

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-white">
      
      {/* LEFT PANEL: Gallery & Info */}
      <div className="lg:w-[55%] 2xl:w-[60%] bg-[#0a0f1d] p-8 pt-16 lg:p-16 xl:p-24 2xl:p-32 text-white flex flex-col justify-center relative min-h-[50vh] lg:min-h-[calc(100vh-80px)]">
        <button onClick={() => router.push('/')} className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#d1d5db] hover:text-white transition font-bold z-10">
          <ChevronLeft className="w-4 h-4" /> Volver al Inicio
        </button>
            <div className="shrink-0">
              <span className="inline-block px-2.5 py-1 bg-white/10 text-white/90 text-[10px] uppercase tracking-widest font-bold rounded mb-5">
                Sorteo de la moto Italiana
              </span>
              <h1 className="text-3xl xl:text-5xl font-light tracking-tight mb-3">
                Promoción comercial <strong className="font-bold">MONZZA</strong>
              </h1>
              <p className="text-sm xl:text-base text-gray-300 font-light leading-relaxed mb-6 max-w-md">
                Compra la imagen digital MONZZA y entra a la promoción por la Moto MV Agusta TVF3 RC.
              </p>
            </div>

            {/* Dynamic Expanded Gallery */}
            <div className="w-full flex flex-col gap-4 lg:gap-6 mt-8 xl:mt-12">
              <div className="w-full relative rounded-2xl overflow-hidden group aspect-[4/3] lg:aspect-[16/10] shadow-2xl border border-white/5">
                <Image src={mainImage} alt="MV Agusta" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
              </div>
              <div className="grid grid-cols-4 gap-3 lg:gap-4 shrink-0">
                {[
                  '/images/brand/moto1.jpeg',
                  '/images/brand/moto2.jpeg',
                  '/images/brand/moto3.jpeg',
                  '/images/brand/moto4.jpeg'
                ].map((img, i) => (
                  <button key={i} type="button" onClick={() => setMainImage(img)} className={`relative rounded-xl overflow-hidden border aspect-[4/3] group transition-all ${mainImage === img ? 'border-white opacity-100 ring-1 ring-white' : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'}`}>
                    <Image src={img} alt={`Detalle moto ${i + 1}`} fill sizes="(max-width: 1024px) 25vw, 15vw" className={`object-cover transition-opacity ${mainImage === img ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>
            </div>
            
          </div>

      {/* RIGHT PANEL: Extremely Compact Form */}
      <div className="lg:w-[45%] 2xl:w-[40%] p-8 lg:p-16 xl:p-24 2xl:p-32 flex flex-col justify-center bg-white relative">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#161b39]">Detalle de tu compra</h2>
              <p className="text-xs text-gray-500 mt-1">Asegura la exactitud de tus datos para la correcta emisión de tu comprobante.</p>
            </div>

            {error && <div className="text-xs bg-red-50 text-red-600 p-3 rounded-md mb-6 border border-red-100">{error}</div>}

            <form onSubmit={handlePayment} className="space-y-4">
              
              {/* COMPACT PACKAGE SELECTION WITH STEPPERS */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {TICKET_OFFERS.map(offer => {
                  const count = cart[offer.id as keyof typeof cart]
                  return (
                    <div 
                      key={offer.id} 
                      className={`border p-3 rounded-xl transition-all flex flex-col items-center justify-center text-center
                        ${count > 0 ? 'border-[#802223] bg-[#802223]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}
                      `}
                    >
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider ${count > 0 ? 'text-[#802223]' : 'text-gray-500'}`}>{offer.name}</h4>
                      <p className={`text-sm mt-1 mb-2.5 font-medium ${count > 0 ? 'text-[#161b39]' : 'text-gray-400'}`}>${offer.price.toLocaleString('es-CL')}</p>
                      
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                        <button type="button" onClick={() => updateCart(offer.id, -1)} className="w-8 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors font-bold text-lg leading-none">-</button>
                        <span className="text-xs font-bold w-4 text-center">{count}</span>
                        <button type="button" onClick={() => updateCart(offer.id, 1)} className="w-8 h-6 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors font-bold text-lg leading-none">+</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* DENSE GRID FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                
                {/* RUT (ID) */}
                <div className="md:col-span-2">
                  <label className="block flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    <span>RUT (Comprador) *</span> 
                  </label>
                  <input required maxLength={12} placeholder="12.345.678-9" className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-[#802223] focus:bg-white outline-none transition-colors" value={formData.rut} onChange={handleRutChange} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Nombres *</label>
                  <input required className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-[#802223] focus:bg-white outline-none" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Apellidos *</label>
                  <input required className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-[#802223] focus:bg-white outline-none" value={formData.apellidos} onChange={e => setFormData({ ...formData, apellidos: e.target.value })} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email *</label>
                  <input required type="email" className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-[#802223] focus:bg-white outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Teléfono Móvil *</label>
                  <div className="flex h-10 rounded-md overflow-hidden bg-gray-50 border border-gray-200 focus-within:border-[#802223] focus-within:bg-white transition-colors">
                    <div className="flex items-center px-2.5 bg-gray-100 border-r border-gray-200 shrink-0">
                      <span className="text-sm mr-1.5">🇨🇱</span><span className="text-xs font-semibold text-gray-600">+56 9</span>
                    </div>
                    <input required type="tel" maxLength={8} placeholder="12345678" className="w-full h-full px-3 text-sm outline-none bg-transparent" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })} />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Región *</label>
                  <select required className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-[#802223] focus:bg-white outline-none" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })}>
                    <option value="" disabled>Seleccione...</option>
                    {Object.keys(REGIONES_Y_COMUNAS).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Comuna *</label>
                  <select required disabled={!formData.region} className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-[#802223] focus:bg-white outline-none disabled:bg-gray-100 disabled:text-gray-400" value={formData.comuna} onChange={e => setFormData({ ...formData, comuna: e.target.value })}>
                    <option value="" disabled>Seleccione...</option>
                    {comunasDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Dirección Exacta *</label>
                  <input required placeholder="Ej. Avenida Las Condes 1234, Depto 4" className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-[#802223] focus:bg-white outline-none" value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })} />
                </div>
              </div>

              {/* TERMS */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-gray-50 rounded-md border border-gray-200/60">
                  <input type="checkbox" required className="mt-0.5" checked={formData.acceptTerms} onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })} />
                  <span className="text-xs text-gray-500 leading-snug">
                    Acepto y declaro haber leído los <a href="/docs/MONZZA_Terminos_y_Condiciones.pdf" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="font-semibold text-gray-700 hover:text-[#802223] underline decoration-gray-300 hover:decoration-[#802223] transition-colors">Términos y Condiciones</a>, así como las <a href="/docs/MONZZA_Bases_Legales.pdf" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="font-semibold text-gray-700 hover:text-[#802223] underline decoration-gray-300 hover:decoration-[#802223] transition-colors">Bases Legales</a>.
                  </span>
                </label>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="submit"
                disabled={loading || totalTickets === 0}
                className={`w-full mt-4 h-12 rounded-lg text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${loading || totalTickets === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#161b39] hover:bg-[#111] text-white shadow-lg shadow-blue-900/10'}`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                    <span className="normal-case tracking-normal">Redirigiendo a pago seguro...</span>
                  </>
                ) : (
                  <>Comprar {totalTickets} Imágenes (${totalPrice.toLocaleString('es-CL')})</>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                Transacción Cifrada Comercial
              </div>
            </form>
      </div>
    </div>
  )
}
