import { useEffect } from 'react'

/**
 * Hook personalizado para hacer scroll al inicio de la página
 * Útil para componentes específicos que necesitan hacer scroll al montarse
 */
export function useScrollToTop(dependencies: any[] = []) {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }, dependencies)
}

/**
 * Hook para hacer scroll al inicio de forma instantánea
 */
export function useScrollToTopInstant(dependencies: any[] = []) {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        })
    }, dependencies)
}
