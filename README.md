# RealCars Company - Automotora Premium

Sitio web de lujo para automotora especializada en vehículos premium de alta gama.

## 🏆 Características Premium

- **Diseño Minimalista y Elegante**: Interfaz limpia con enfoque en el contenido
- **Paleta de Colores Exclusiva**: Rojo burgundy (#802223), Navy (#161b39) y tonos claros
- **Tipografía Premium**: Fuentes elegantes con spacing generoso
- **Experiencia de Usuario Superior**: Navegación intuitiva y fluida
- **Responsive Design**: Perfecto en todos los dispositivos

## 🎨 Diseño

### Paleta de Colores
- **Primary Red**: `#802223` - Burgundy/Vino
- **Navy Blue**: `#161b39` - Azul oscuro profundo
- **Light Grey**: `#f2f2f4` - Gris claro elegante
- **White**: `#ffffff` - Blanco puro
- **Accent Gold**: `#d4af37` - Dorado (acento)

### Principios de Diseño
- Minimalismo y espacio en blanco generoso
- Jerarquía visual clara
- Animaciones sutiles y elegantes
- Contenido centrado en la calidad
- Enfoque en la experiencia premium

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **Estilos**: Tailwind CSS 4 con configuración personalizada
- **Animaciones**: Framer Motion 12.23.22
- **Íconos**: Lucide React
- **TypeScript**: 5.x

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📁 Estructura

```
realcarscompany-web/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx           # Home premium
│   │   │   ├── autos/page.tsx     # Catálogo de lujo
│   │   │   ├── contacto/page.tsx  # Contacto elegante
│   │   │   └── layout.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx           # Dashboard premium
│   │   │   └── autos/page.tsx
│   │   ├── global.css             # Estilos + paleta custom
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Header.tsx             # Nav minimalista
│   │   ├── Footer.tsx             # Footer elegante
│   │   └── AutoCard.tsx           # Card premium
│   └── lib/
│       ├── types.ts
│       ├── constants.ts
│       ├── data.ts
│       ├── utils.ts
│       └── seo.ts
└── public/
    └── images/
        └── brand/
            └── logo.png
```

## ✨ Páginas

### Públicas
- **Home** (`/`) - Hero premium con gradientes, estadísticas y CTA
- **Catálogo** (`/autos`) - Grid de vehículos con diseño de lujo
- **Contacto** (`/contacto`) - Formulario elegante con info de contacto

### Administración
- **Dashboard** (`/admin`) - Panel de control minimalista
- **Gestión de Autos** (`/admin/autos`) - Administración del inventario

## 🎯 Características del Diseño

### Header
- Logo premium en esquina superior izquierda
- Navegación minimalista con uppercase tracking
- Sticky header con backdrop blur
- CTA destacado "Contáctanos"

### Cards de Autos
- Diseño limpio con bordes sutiles
- Hover effects elegantes
- Badge "Destacado" para vehículos especiales
- Información clara y jerárquica
- Tipografía light/semibold mix

### Hero Section
- Gradiente burgundy a navy
- Tipografía grande y espaciada
- CTAs contrastantes
- Pattern background sutil

### Footer
- Diseño en grid de 4 columnas
- Logo invertido para fondo oscuro
- Enlaces organizados
- Información de contacto clara

## 🚀 Características Técnicas

- **SEO Optimizado**: Meta tags premium y OpenGraph
- **Performance**: Optimización de imágenes Next.js
- **Accesibilidad**: Labels semánticos y aria-labels
- **Responsive**: Mobile-first approach
- **TypeScript**: Type-safe en todo el código

## 🔧 Próximas Mejoras

- [ ] Página de detalle de vehículo individual
- [ ] Galería de imágenes 360°
- [ ] Filtros avanzados (marca, precio, año)
- [ ] Comparador de vehículos
- [ ] Sistema de favoritos
- [ ] Integración WhatsApp Business
- [ ] Calculadora de financiamiento
- [ ] Blog de noticias automotrices
- [ ] Backend con PostgreSQL
- [ ] Panel de admin con autenticación

## 🎨 Filosofía de Diseño

> "La elegancia es refinamiento sin ostentación"

Este sitio refleja los valores de una automotora premium:
- **Sofisticación** sin excesos
- **Claridad** en la comunicación
- **Calidad** sobre cantidad
- **Atención** al detalle
- **Experiencia** memorable

## 📝 Licencia

Proyecto privado - RealCars Company © 2025

---

**Desarrollado con excelencia para RealCars Company** 🏆
