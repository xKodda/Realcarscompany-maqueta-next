import Link from 'next/link'
import Image from 'next/image'
import { NAVIGATION_ITEMS, CONTACTO, SOCIAL_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-[#161b39] text-white">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Logo y descripción */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="inline-block bg-white p-3 sm:p-4 rounded-lg shadow-lg mb-4 sm:mb-6">
              <Image
                src="/images/brand/realcarscompanylogo.png"
                alt="RealCars Company"
                width={200}
                height={70}
                className="h-12 sm:h-16 w-auto"
              />
            </div>
            <p className="text-white/70 font-light leading-relaxed mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              Excelencia automotriz desde hace más de 10 años. Especialistas en vehículos premium de alta gama en Santiago de Chile.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 hover:border-[#802223] hover:bg-[#802223] flex items-center justify-center transition-all group touch-manipulation"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Enlaces */}
          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase mb-4 sm:mb-6 text-white/90">
              Navegación
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-[#802223] transition-colors font-light text-sm touch-manipulation"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contacto */}
          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase mb-4 sm:mb-6 text-white/90">
              Contacto
            </h4>
            <div className="space-y-2 sm:space-y-3 text-white/70 font-light text-sm">
              <p className="flex items-start gap-2">
                <span className="text-[#802223]">📧</span>
                {CONTACTO.email}
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#802223]">📞</span>
                {CONTACTO.telefono}
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#802223]">📍</span>
                {CONTACTO.direccion}
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright y créditos */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p className="text-white/60 text-xs sm:text-sm font-light">
                &copy; {new Date().getFullYear()} RealCars Company. Todos los derechos reservados.
              </p>
              <span className="hidden sm:block text-white/20">•</span>
              <p className="text-white/40 text-xs font-light">
                Preview - Maqueta para Real Cars Company
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p className="text-white/60 text-xs sm:text-sm font-light">
                Diseñado para la excelencia
              </p>
              <div className="hidden sm:block h-4 w-px bg-white/20"></div>
              <a
                href="https://clikium.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 text-xs font-light hover:text-white/60 transition-colors touch-manipulation"
              >
                Desarrollado por{' '}
                <span className="text-[#802223] hover:text-[#d4af37] transition-colors font-medium">
                  Clikium
                </span>
              </a>
              <div className="hidden sm:block h-4 w-px bg-white/20"></div>
              <Link
                href="/admin"
                className="text-white/40 hover:text-[#802223] text-xs font-light transition-colors touch-manipulation"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
