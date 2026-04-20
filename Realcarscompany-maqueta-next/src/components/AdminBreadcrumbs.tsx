'use client'

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[]
  showBackButton?: boolean
  onBack?: () => void
}

export default function AdminBreadcrumbs({ 
  items, 
  showBackButton = true, 
  onBack 
}: AdminBreadcrumbsProps) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm">
        <Link 
          href="/admin" 
          className="text-gray-500 hover:text-[#802223] transition-colors touch-manipulation flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="hidden sm:inline">Admin</span>
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {item.current ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : item.href ? (
              <Link 
                href={item.href}
                className="text-gray-500 hover:text-[#802223] transition-colors touch-manipulation"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Botón de volver */}
      {showBackButton && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#802223] transition-colors touch-manipulation px-3 py-2 rounded-lg hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Volver</span>
        </button>
      )}
    </div>
  )
}
