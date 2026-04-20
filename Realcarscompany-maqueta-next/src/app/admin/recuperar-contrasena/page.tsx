'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RecoverPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ type: 'idle', message: '' })
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/recover-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error || 'Error al solicitar recuperación' })
        setIsLoading(false)
        return
      }

      setStatus({ type: 'success', message: 'Te hemos enviado un correo con las instrucciones para recuperar tu contraseña.' })
      setIsLoading(false)
    } catch (err) {
      console.error('Recovery error:', err)
      setStatus({ type: 'error', message: 'Error al conectar con el servidor' })
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
            Recuperar <span className="font-semibold">Contraseña</span>
          </h1>
          <p className="text-sm text-gray-600 font-light">
            Ingresa tu correo para recibir las instrucciones
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
          {status.type === 'success' ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded mb-6">
                <p>{status.message}</p>
              </div>
              <Link
                href="/admin/login"
                className="inline-block bg-[#161b39] hover:bg-[#802223] text-white py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all"
              >
                Volver al Login
              </Link>
            </div>
          ) : (
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

              {/* Error Message */}
              {status.type === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
                  {status.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#161b39] hover:bg-[#802223] text-white py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-sm text-gray-600 hover:text-[#802223] transition-colors"
          >
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}
