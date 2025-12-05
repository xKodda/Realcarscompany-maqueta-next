import { useEffect } from 'react'

/**
 * Hook para bloquear el scroll del body cuando un modal está abierto
 * @param isLocked - Si es true, bloquea el scroll. Si es false, lo desbloquea.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      // Aplicar estilos para bloquear scroll en body y html
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = `-${scrollX}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      // También bloquear en el elemento html
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.position = 'fixed'
      document.documentElement.style.width = '100%'
      
      return () => {
        // Restaurar estilos cuando se desbloquea
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        
        document.documentElement.style.overflow = ''
        document.documentElement.style.position = ''
        document.documentElement.style.width = ''
        
        // Restaurar posición de scroll
        window.scrollTo(scrollX, scrollY)
      }
    }
  }, [isLocked])
}





