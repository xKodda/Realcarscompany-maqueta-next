'use client'

import React, { Suspense } from 'react';
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

function ExitoContent() {
    const searchParams = useSearchParams()
    const ordenId = searchParams.get('orden')

    return (
        <div className="min-h-screen bg-[#161b39] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full text-center p-8 md:p-12"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-black text-[#161b39] mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-500 mb-8">
                    Tu compra ha sido procesada correctamente.
                    <br />
                    Hemos enviado los detalles a tu correo.
                </p>

                {ordenId && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">ID de Orden</p>
                        <p className="font-mono text-lg font-bold text-[#802223]">{ordenId}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Link
                        href="/monzza"
                        className="w-full py-3 bg-[#161b39] text-white font-bold rounded-lg hover:bg-[#2a3055] transition-colors"
                    >
                        Volver a Monzza
                    </Link>
                    <Link
                        href="/"
                        className="w-full py-3 text-gray-500 font-medium hover:text-[#161b39] transition-colors"
                    >
                        Ir al Inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default function PagoExitoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#161b39] flex items-center justify-center"><p className='text-white'>Cargando...</p></div>}>
            <ExitoContent />
        </Suspense>
    )
}
