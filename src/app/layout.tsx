import type { Metadata, Viewport } from 'next'
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
  keywords: ['automotora lujo', 'autos premium', 'vehículos exclusivos', 'autos de lujo chile', 'automotora premium', 'vehículos alta gama', 'concesionario premium'],
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
    images: [
      {
        url: '/images/brand/realcarscompanylogo.png',
        width: 1200,
        height: 630,
        alt: 'RealCars Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealCars Company - Automotora Premium',
    description: 'Especialistas en vehículos premium y de lujo en Chile',
    images: ['/images/brand/realcarscompanylogo.png'],
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
  return (
    <html lang="es">
      <body className="antialiased bg-white text-[#161b39]">
        {children}
      </body>
    </html>
  )
}
