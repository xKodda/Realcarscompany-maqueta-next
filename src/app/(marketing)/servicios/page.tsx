import type { Metadata } from 'next'
import ServiciosClient from './ServiciosClient'

export const metadata: Metadata = {
  title: 'Nuestros Servicios | Venta, Financiamiento y Consignación',
  description: 'Conoce los servicios premium de RealCars Company: Venta de vehículos de lujo, financiamiento automotriz a medida y consignación profesional en Santiago.',
  keywords: ['servicios automotora', 'financiamiento autos lujo', 'consignacion premium santiago', 'venta vehiculos certificados'],
  openGraph: {
    title: 'Servicios Automotrices Premium - RealCars Company',
    description: 'Soluciones integrales para la compra y venta de autos de lujo en Chile.',
    type: 'website',
  }
}

export default function ServiciosPage() {
  return <ServiciosClient />
}
