'use client'

import { useState, useEffect } from 'react'

/**
 * Botón flotante que aparece cuando el usuario hace scroll hacia abajo
 * y permite volver rápidamente al inicio de la página
 */
export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            // Mostrar el botón cuando se ha bajado más de 300px
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 bg-[#802223] hover:bg-[#6b1d1e] text-white p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group"
                    aria-label="Volver arriba"
                    title="Volver arriba"
                >
                    <svg
                        className="w-5 h-5 md:w-6 md:h-6 transform group-hover:-translate-y-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    )
}
