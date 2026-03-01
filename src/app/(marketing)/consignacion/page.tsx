import type { Metadata } from 'next'
import ConsignacionClient from './ConsignacionClient'

export const metadata: Metadata = {
  title: 'Consignación de Vehículos | Vende tu Auto de Lujo con Expertos',
  description: 'Vende tu vehículo de lujo de forma segura y profesional. En RealCars Company nos encargamos de todo el proceso de consignación, desde la fotografía hasta la venta final.',
  keywords: ['consignacion autos lujo', 'vende tu auto chile', 'gestion de venta vehiculos premium', 'comprobamos tu auto santiago'],
  openGraph: {
    title: 'Consignación de Vehículos Premium - RealCars Company',
    description: 'Vende tu auto de lujo sin complicaciones. Red de compradores calificados y servicio integral.',
    images: ['/images/brand/consignacion1.jpg'],
  }
}

export default function ConsignacionPage() {
  return <ConsignacionClient />
}
