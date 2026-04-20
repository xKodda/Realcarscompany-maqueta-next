'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  if (!token) {
    return (
      <div className="text-center p-6 bg-white border border-gray-100 shadow-sm">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded mb-6">
          <p>Enlace de recuperación inválido o faltante.</p>
        </div>
        <Link
          href="/admin/recuperar-contrasena"
          className="inline-block bg-[#161b39] hover:bg-[#802223] text-white py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all"
        >
          Volver a solicitar
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ type: 'idle', message: '' })

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Las contraseñas no coinciden' })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error || 'Error al restablecer' })
        setIsLoading(false)
        return
      }

      setStatus({ type: 'success', message: 'Tu contraseña ha sido actualizada exitosamente.' })
      setIsLoading(false)
      
      // Opcional: Redirigir al login después de un momento
      setTimeout(() => {
        router.push('/admin/login')
      }, 3000)
    } catch (err) {
      console.error('Reset error:', err)
      setStatus({ type: 'error', message: 'Error al conectar con el servidor' })
      setIsLoading(false)
    }
  }

  if (status.type === 'success') {
    return (
      <div className="text-center bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded mb-6">
          <p>{status.message}</p>
        </div>
        <p className="text-sm text-gray-600 mb-6">Serás redirigido al login en unos segundos...</p>
        <Link
          href="/admin/login"
          className="inline-block bg-[#161b39] hover:bg-[#802223] text-white py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all"
        >
          Ir al Login ahora
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Nueva Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 focus:border-[#802223] focus:ring-1 focus:ring-[#802223] outline-none transition-colors"
            placeholder="Confirma la nueva contraseña"
            disabled={isLoading}
          />
        </div>

        {status.type === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded">
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#161b39] hover:bg-[#802223] text-white py-3 px-6 text-sm font-medium tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
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
            Nueva <span className="font-semibold">Contraseña</span>
          </h1>
          <p className="text-sm text-gray-600 font-light">
            Ingresa tu nueva contraseña para el panel
          </p>
        </div>

        <Suspense fallback={<div className="text-center p-8 bg-white border border-gray-100 shadow-sm">Cargando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
