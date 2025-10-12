// Configuración SEO para RealCars Company - Automotora Premium
import type { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: {
    template: '%s | RealCars Company',
    default: 'RealCars Company - Automotora Premium de Lujo',
  },
  description: 'Automotora especializada en vehículos premium y de lujo en Chile. Excelencia, calidad y servicio personalizado desde hace más de 15 años.',
  keywords: [
    'automotora lujo',
    'autos premium',
    'vehículos exclusivos',
    'autos de lujo chile',
    'automotora premium',
    'vehículos alta gama',
    'compra autos lujo',
  ],
  authors: [{ name: 'RealCars Company' }],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://realcarscompany.cl',
    siteName: 'RealCars Company',
    title: 'RealCars Company - Automotora Premium de Lujo',
    description: 'Especialistas en vehículos premium y de lujo. Calidad, excelencia y servicio personalizado.',
  },
}
