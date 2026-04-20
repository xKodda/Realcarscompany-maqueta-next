'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
    label: string
    href: string
    active?: boolean
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[]
}

export default function Breadcrumbs({ items: customItems }: BreadcrumbsProps) {
    const pathname = usePathname()

    // Si no se pasan items, generarlos automáticamente del pathname
    const generateItems = (): BreadcrumbItem[] => {
        const paths = pathname.split('/').filter(Boolean)
        const items: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }]

        let currentPath = ''
        paths.forEach((path, index) => {
            currentPath += `/${path}`
            const isLast = index === paths.length - 1

            // Mapeo de nombres para rutas amigables
            const labels: Record<string, string> = {
                'autos': 'Catálogo',
                'servicios': 'Servicios',
                'consignacion': 'Consignación',
                'monzza': 'Colección Monzza',
                'contacto': 'Contacto',
                'sorteos': 'Sorteos',
            }

            const label = labels[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')

            items.push({
                label,
                href: currentPath,
                active: isLast
            })
        })

        return items
    }

    const items = customItems || generateItems()

    // JSON-LD for Breadcrumbs
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `https://realcarscompany.cl${item.href}`
        }))
    }

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center space-x-2 text-xs font-light text-gray-400 uppercase tracking-widest">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        {index > 0 && <span className="mx-2 text-gray-300">/</span>}
                        {item.active ? (
                            <span className="text-gray-900 font-medium">{item.label}</span>
                        ) : (
                            <Link href={item.href} className="hover:text-[#161b39] transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
