'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar si ya está autenticado
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/me')
        if (response.ok) {
          router.push('/admin')
          router.refresh()
        }
      } catch {
        // No autenticado, continuar con el login
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión')
        setIsLoading(false)
        return
      }

      // Redirigir a admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err) {
      console.error('Login error:', err)
      setError('Error al conectar con el servidor')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f2f2f4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/brand/realcarscompanylogo.png"
              alt="RealCars Company"
              width={200}
              height={67}
              className="h-12 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light text-[#161b39] mb-2 tracking-tight">
            Admin <span className="font-semibold">Login</span>
          </h1>
          <p className="text-sm text-gray-600 font-light">
            Acceso exclusivo para administradores
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
                placeholder="admin@realcarscompany.cl"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#161b39] hover:bg-[#802223] text-white py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#802223] transition-colors"
          >
            ← Volver al sitio
          </Link>
        </div>

        {/* Info de credenciales (solo para desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <p className="font-medium mb-2">🔐 Credenciales de prueba:</p>
            <p>Email: <strong>admin@realcarscompany.cl</strong></p>
            <p>Password: <strong>Admin123!</strong></p>
          </div>
        )}
      </div>
    </div>
  )
}

