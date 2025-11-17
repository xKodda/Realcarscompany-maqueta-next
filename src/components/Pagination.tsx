'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
  itemsPerPage: number
  baseUrl?: string
  className?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  baseUrl = '',
  className = '',
}: PaginationProps) {
  const searchParams = useSearchParams()
  
  // Construir URL con parámetros existentes
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  // Calcular rango de items mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, total)

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1)

      // Calcular inicio y fin del rango central
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar si estamos cerca del inicio
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1)
      }

      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - 3, 2)
      }

      // Agregar ellipsis antes si es necesario
      if (start > 2) {
        pages.push('...')
      }

      // Agregar páginas del rango central
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Agregar ellipsis después si es necesario
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Siempre mostrar última página
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Información de resultados */}
      <div className="text-sm text-gray-600 font-light">
        Mostrando <span className="font-medium text-[#161b39]">{startItem}</span> a{' '}
        <span className="font-medium text-[#161b39]">{endItem}</span> de{' '}
        <span className="font-medium text-[#161b39]">{total}</span> vehículos
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón Anterior */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-[#802223] hover:text-white hover:border-[#802223] transition-all duration-200 text-sm font-light tracking-wide"
          >
            Anterior
          </Link>
        ) : (
          <span className="px-3 py-2 border border-gray-200 text-gray-400 cursor-not-allowed text-sm font-light">
            Anterior
          </span>
        )}

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-gray-400 text-sm"
                >
                  ...
                </span>
              )
            }

            const pageNum = page as number
            const isActive = pageNum === currentPage

            return (
              <Link
                key={pageNum}
                href={buildUrl(pageNum)}
                className={`min-w-[40px] px-3 py-2 text-center text-sm font-light tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#802223] text-white border border-[#802223]'
                    : 'border border-gray-300 text-gray-700 hover:bg-[#802223]/10 hover:border-[#802223]'
                }`}
              >
                {pageNum}
              </Link>
            )
          })}
        </div>

        {/* Botón Siguiente */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-[#802223] hover:text-white hover:border-[#802223] transition-all duration-200 text-sm font-light tracking-wide"
          >
            Siguiente
          </Link>
        ) : (
          <span className="px-3 py-2 border border-gray-200 text-gray-400 cursor-not-allowed text-sm font-light">
            Siguiente
          </span>
        )}
      </div>
    </div>
  )
}

