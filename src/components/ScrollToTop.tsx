'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Componente que asegura que la página se desplace al inicio
 * cada vez que cambia la ruta o se recarga la página
 */
export default function ScrollToTop() {
    const pathname = usePathname()

    useEffect(() => {
        // Scroll al inicio inmediatamente al cambiar de ruta
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Instantáneo en cambio de ruta
        })
    }, [pathname])

    useEffect(() => {
        // Scroll al inicio cuando se carga/recarga la página
        window.scrollTo(0, 0)

        // Deshabilitar la restauración automática del scroll del navegador
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }

        // Asegurar que el scroll esté al inicio después de que todo cargue
        const handleLoad = () => {
            window.scrollTo(0, 0)
        }

        // Asegurar scroll al inicio en cada interacción de navegación
        const handleBeforeUnload = () => {
            window.scrollTo(0, 0)
        }

        window.addEventListener('load', handleLoad)
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('load', handleLoad)
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

    return null
}
