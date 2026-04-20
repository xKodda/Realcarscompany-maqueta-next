import type { Metadata } from 'next'
import ContactoClient from './ContactoClient'

export const metadata: Metadata = {
  title: 'Contacto | Agenda tu Visita o Consúltanos',
  description: 'Contáctanos para agendar una visita a nuestro showroom o para consultas sobre venta y consignación de vehículos de lujo en Santiago, Chile.',
  keywords: ['contacto automotora', 'donde estamos', 'telefono realcars company', 'comprar autos de lujo santiago'],
}

export default function ContactoPage() {
  return <ContactoClient />
}
