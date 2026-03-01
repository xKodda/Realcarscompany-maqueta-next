import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import ScrollToTop from '@/components/ScrollToTop'
import './global.css'


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#161b39',
}

// Metadata con headers de seguridad
export const metadata: Metadata = {
  title: {
    template: '%s | RealCars Company - Automotora Premium en Chile',
    default: 'RealCars Company - Automotora Premium de Lujo en Chile',
  },
  description: 'Venta y consignación de vehículos premium y de lujo en Chile. Concesionario especializado con excelencia automotriz y servicio personalizado en Santiago.',
  keywords: [
    'automotora lujo chile', 'autos premium santiago', 'vehículos exclusivos',
    'autos de lujo chile', 'automotora premium', 'vehículos alta gama',
    'concesionario premium', 'venta autos lujo santiago', 'consignacion vehiculos premium',
    'BMW chile', 'Mercedes-Benz chile', 'Audi santiago', 'Porsche chile', 'Ferrari chile'
  ],
  authors: [{ name: 'RealCars Company' }],
  creator: 'RealCars Company',
  publisher: 'RealCars Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://realcarscompany.cl'),
  alternates: {
    canonical: '/',
    languages: {
      'es-CL': 'https://realcarscompany.cl',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://realcarscompany.cl',
    siteName: 'RealCars Company',
    title: 'RealCars Company - Automotora Premium de Lujo',
    description: 'Especialistas en vehículos premium y de lujo en Chile. Calidad, excelencia y servicio personalizado garantizado.',
    images: [
      {
        url: '/images/brand/realcarscompanylogo.png',
        width: 1200,
        height: 630,
        alt: 'RealCars Company - Automotora Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealCars Company - Automotora Premium de Lujo',
    description: 'Venta de vehículos premium y de lujo en Chile.',
    images: ['/images/brand/realcarscompanylogo.png'],
    creator: '@realcarscompany',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/brand/realcarscompanylogo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/brand/realcarscompanylogo.png', type: 'image/png' },
    ],
    shortcut: '/images/brand/realcarscompanylogo.png',
  },
  verification: {
    google: 'google-site-verification-id', // Reemplazar con ID real
  },
  other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'apple-mobile-web-app-title': 'RealCars',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data core
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'RealCars Company',
    legalName: 'RealCars Company SpA',
    description: 'Automotora premium especializada en vehículos de lujo y alta gama en Chile.',
    url: 'https://realcarscompany.cl',
    logo: 'https://realcarscompany.cl/images/brand/realcarscompanylogo.png',
    image: 'https://realcarscompany.cl/images/brand/realcarscompanylogo.png',
    telephone: '+56961304115',
    email: 'Realcarscompanyspa@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Santiago, Chile',
      addressLocality: 'Santiago',
      addressRegion: 'Metropolitana',
      postalCode: '1000000',
      addressCountry: 'CL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -33.4489,
      longitude: -70.6693,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      }
    ],
    sameAs: [
      'https://www.instagram.com/realcarscompanycl/',
      'https://www.facebook.com/realcarscompany',
    ],
    priceRange: '$$$$',
  }

  const searchJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://realcarscompany.cl',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://realcarscompany.cl/autos?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/brand/realcarscompanylogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/brand/realcarscompanylogo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchJsonLd) }}
        />
      </head>
      <body className="antialiased bg-white text-[#161b39]">
        <ScrollToTop />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

