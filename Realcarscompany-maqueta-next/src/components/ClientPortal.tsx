'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ClientPortalProps {
  children: React.ReactNode
  selector?: string
}

/**
 * Client-side portal component for rendering children outside the normal DOM hierarchy
 * Useful for modals, tooltips, and overlays
 */
export function ClientPortal({
  children,
  selector = 'body',
}: ClientPortalProps) {
  const [mounted, setMounted] = useState(false)
  const [container, setContainer] = useState<Element | null>(null)

  useEffect(() => {
    setMounted(true)
    const element = document.querySelector(selector)
    setContainer(element)
    
    // Fallback to body if selector not found
    if (!element) {
      setContainer(document.body)
    }

    return () => {
      setMounted(false)
      setContainer(null)
    }
  }, [selector])

  if (!mounted || !container) {
    return null
  }

  return createPortal(children, container)
}

