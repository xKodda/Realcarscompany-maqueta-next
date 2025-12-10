// Middleware de seguridad para RealCars Company
// Protección adicional para rutas y headers

import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Headers de seguridad
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  }

  // Aplicar headers de seguridad
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Protección contra clickjacking
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('X-Frame-Options', 'DENY')
  }

  // Simulacion de Rate Limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Validar User-Agent malicioso
  const maliciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
  ]

  if (maliciousPatterns.some(pattern => pattern.test(userAgent))) {
    // Permitir bots legítimos (acción silenciosa)
  }

  // Protección contra ataques de path traversal
  const path = request.nextUrl.pathname
  if (path.includes('..') || path.includes('~') || path.includes('\\')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // Validar parámetros de query maliciosos
  const searchParams = request.nextUrl.searchParams
  const maliciousQueryPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /expression\s*\(/i,
  ]

  for (const [key, value] of searchParams.entries()) {
    if (maliciousQueryPatterns.some(pattern => pattern.test(value))) {
      console.log(`[SECURITY] Malicious query parameter detected: ${key}=${value}`)
      return new NextResponse('Bad Request', { status: 400 })
    }
  }

  // Headers adicionales para API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  // CORS headers para desarrollo
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
