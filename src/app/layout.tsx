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
    template: '%s | RealCars Company',
    default: 'RealCars Company - Automotora Premium de Lujo',
  },
  description: 'Automotora especializada en vehículos premium y de lujo. Excelencia automotriz con más de 15 años de experiencia en Santiago, Chile.',
  keywords: ['automotora lujo', 'autos premium', 'vehículos exclusivos', 'autos de lujo chile', 'automotora premium', 'vehículos alta gama', 'concesionario premium', 'venta autos lujo santiago', 'consignacion vehiculos premium'],
  authors: [{ name: 'RealCars Company' }],
  creator: 'RealCars Company',
  publisher: 'RealCars Company',
  metadataBase: new URL('https://realcarscompany.cl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://realcarscompany.cl',
    siteName: 'RealCars Company',
    title: 'RealCars Company - Automotora Premium de Lujo',
    description: 'Especialistas en vehículos premium y de lujo. Calidad, excelencia y servicio personalizado.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealCars Company - Automotora Premium',
    description: 'Especialistas en vehículos premium y de lujo en Chile',
  },
  robots: {
    index: true,
    follow: true,
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
      { url: '/images/brand/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/brand/realcarscompanylogo.png', type: 'image/png' },
    ],
    shortcut: '/images/brand/realcarscompanylogo.png',
  },
  verification: {
    // Agregar códigos de verificación cuando estén disponibles
    // google: 'tu-código-aquí',
    // yandex: 'tu-código-aquí',
  },
  // Headers de seguridad adicionales
  other: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: 'RealCars Company',
    description: 'Automotora premium especializada en vehículos de lujo en Chile',
    url: 'https://realcarscompany.cl',
    logo: 'https://realcarscompany.cl/images/brand/realcarscompanylogo.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santiago',
      addressCountry: 'CL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56-9-6130-4115',
      contactType: 'Customer Service',
      email: 'Realcarscompanyspa@gmail.com',
      availableLanguage: 'Spanish',
    },
    sameAs: [
      'https://www.instagram.com/realcarscompanycl/',
      'https://www.facebook.com/realcarscompany',
    ],
  }

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/images/brand/realcarscompanylogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/brand/realcarscompanylogo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
