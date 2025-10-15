# 🚗 RealCars Company - Automotora Premium

Sistema web completo para automotora de lujo con sistema de sorteos y pagos integrados.

## 🎯 Características Principales

### 🚘 Catálogo de Vehículos
- Listado de autos premium con filtros avanzados
- Página de detalle con galería interactiva
- Información completa de especificaciones
- Estados: Disponible, Reservado, Vendido

### 🎰 Sistema de Sorteos (con Khipu)
- Compra de tickets online
- Pago seguro vía transferencia bancaria (Khipu)
- Envío automático de tickets por email
- Barra de progreso de tickets vendidos
- Sorteos supervisados por notario

### 📱 Funcionalidades
- Integración con WhatsApp
- Formulario de contacto
- Página de seminuevos
- Información de showroom en arriendo
- Diseño responsive (mobile-first)

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **React:** 19.1.0
- **Styling:** Tailwind CSS 4
- **Animaciones:** Framer Motion 12.23
- **Iconos:** Lucide React
- **Estado:** Zustand 5.0
- **TypeScript:** 5.x

### Backend (Preparado)
- **Pagos:** Khipu (pasarela chilena)
- **Base de datos:** PostgreSQL
- **Email:** Resend
- **Storage:** AWS S3 / Cloudinary
- **Caché:** Redis

## 🚀 Inicio Rápido

### Prerrequisitos
```bash
Node.js 18+ 
npm o pnpm
```

### Instalación

```bash
# Clonar el repositorio
cd realcarscompany-web

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local

# Editar .env.local con tus valores
# (Por ahora puedes dejarlo por defecto para modo DEMO)

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
realcarscompany-web/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (marketing)/       # Rutas públicas
│   │   │   ├── page.tsx       # Home
│   │   │   ├── autos/         # Catálogo
│   │   │   ├── sorteos/       # Sistema de sorteos
│   │   │   ├── seminuevos/    # Seminuevos
│   │   │   ├── showroom/      # Showroom
│   │   │   └── contacto/      # Contacto
│   │   ├── admin/             # Panel admin (protegido)
│   │   ├── layout.tsx         # Layout raíz
│   │   └── global.css         # Estilos globales
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── AutoCard.tsx
│   │   ├── CompraTicketsModal.tsx
│   │   ├── Filters.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   │
│   ├── lib/                   # Lógica de negocio
│   │   ├── api/              # Servicios API
│   │   │   ├── client.ts     # Cliente HTTP
│   │   │   └── services/
│   │   │       ├── autos.service.ts
│   │   │       ├── consultas.service.ts
│   │   │       ├── sorteos.service.ts
│   │   │       └── pagos.service.ts  # Khipu
│   │   ├── constants.ts      # Constantes
│   │   ├── types.ts          # TypeScript types
│   │   ├── utils.ts          # Utilidades
│   │   └── data.ts           # Datos mock
│   │
│   └── hooks/                # Custom hooks
│       ├── useAutos.ts
│       ├── useConsultas.ts
│       ├── useSorteos.ts
│       └── usePagos.ts       # Hooks de Khipu
│
├── public/                   # Assets estáticos
│   ├── images/
│   └── robots.txt
│
├── .env.local.example       # Template de variables
├── KHIPU_SETUP.md          # Guía de integración Khipu
├── MEJORAS.md              # Roadmap y mejoras
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Páginas Disponibles

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Home con autos destacados | ✅ |
| `/autos` | Catálogo completo con filtros | ✅ |
| `/autos/[id]` | Detalle de auto con galería | ✅ |
| `/seminuevos` | Vehículos seminuevos | ✅ |
| `/sorteos` | Sistema de sorteos con compra | ✅ |
| `/showroom` | Showroom en arriendo | ✅ |
| `/contacto` | Formulario de contacto | ✅ |
| `/admin` | Panel de administración | ⏳ |

## 🧪 Probar el Sistema

### Modo DEMO (sin backend)
El proyecto incluye un modo DEMO que te permite probar toda la UI y flujo de compra sin necesidad de backend:

1. Inicia el servidor: `npm run dev`
2. Ve a http://localhost:3000/sorteos
3. Click en "Comprar tickets"
4. Completa el formulario
5. Verás una simulación del proceso

### Con Backend Real
Para usar Khipu real, sigue la guía en [KHIPU_SETUP.md](./KHIPU_SETUP.md)

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (Turbopack)

# Producción
npm run build        # Build para producción
npm run start        # Servidor de producción

# Linting
npm run lint         # ESLint
```

## 🔐 Variables de Entorno

Copia `.env.local.example` a `.env.local` y configura:

```bash
# URLs
NEXT_PUBLIC_SITE_URL=https://realcarscompany.cl
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Khipu (Sistema de pagos)
KHIPU_RECEIVER_ID=your-receiver-id
KHIPU_SECRET=your-secret
NEXT_PUBLIC_KHIPU_RETURN_URL=http://localhost:3000/sorteos/pago/exito
NEXT_PUBLIC_KHIPU_CANCEL_URL=http://localhost:3000/sorteos/pago/cancelado

# Base de datos
DATABASE_URL=postgresql://...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@realcarscompany.cl

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=realcarscompany-images

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Ver `.env.local.example` para la lista completa.

## 💳 Sistema de Pagos (Khipu)

Este proyecto usa **Khipu**, la pasarela de pagos líder en Chile que permite cobrar mediante transferencia bancaria.

### Características:
- ✅ Transferencia bancaria instantánea
- ✅ Sin necesidad de tarjetas
- ✅ Comisión competitiva (~2.9%)
- ✅ API simple y robusta
- ✅ Webhooks para notificaciones

### Setup:
1. Registrarse en https://khipu.com
2. Obtener credenciales
3. Seguir guía en [KHIPU_SETUP.md](./KHIPU_SETUP.md)

## 📧 Sistema de Emails

Los tickets se envían automáticamente por email después del pago. Servicios recomendados:

- **Resend** (recomendado) - resend.com
- **SendGrid** - sendgrid.com
- **Amazon SES** - aws.amazon.com/ses

## 🗄️ Base de Datos

### Esquema Principal (PostgreSQL)

```sql
-- Autos
CREATE TABLE autos (
  id UUID PRIMARY KEY,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  año INTEGER,
  precio DECIMAL(10,2),
  -- ... más campos
);

-- Sorteos
CREATE TABLE sorteos (
  id UUID PRIMARY KEY,
  titulo VARCHAR(200),
  premio VARCHAR(200),
  precio_ticket DECIMAL(10,2),
  total_tickets INTEGER,
  tickets_vendidos INTEGER,
  fecha_sorteo TIMESTAMP,
  estado VARCHAR(20),
  -- ... más campos
);

-- Órdenes de compra
CREATE TABLE ordenes (
  id UUID PRIMARY KEY,
  sorteo_id UUID REFERENCES sorteos(id),
  comprador_nombre VARCHAR(200),
  comprador_email VARCHAR(200),
  comprador_telefono VARCHAR(50),
  cantidad INTEGER,
  total DECIMAL(10,2),
  estado VARCHAR(20), -- pendiente, pagado, expirado
  khipu_payment_id VARCHAR(100),
  -- ... más campos
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  numero VARCHAR(10) UNIQUE,
  orden_id UUID REFERENCES ordenes(id),
  sorteo_id UUID REFERENCES sorteos(id),
  estado VARCHAR(20), -- activo, usado, ganador
  -- ... más campos
);
```

## 🎯 Roadmap

### ✅ Completado
- [x] Diseño UI/UX premium
- [x] Catálogo de autos con filtros
- [x] Sistema de sorteos con Khipu
- [x] Modal de compra de tickets
- [x] Integración WhatsApp
- [x] Responsive design
- [x] Galería de imágenes interactiva
- [x] Servicios API preparados
- [x] Hooks personalizados
- [x] TypeScript 100%

### 🔄 En Progreso
- [ ] Backend API (NestJS/Express)
- [ ] Panel de administración
- [ ] Sistema de autenticación
- [ ] Envío de emails automático

### 📋 Próximamente
- [ ] Comparación de vehículos
- [ ] Favoritos (wishlist)
- [ ] Sistema de notificaciones
- [ ] Blog / Noticias
- [ ] Chat en vivo
- [ ] App móvil (React Native)

## 🤝 Contribuir

Este es un proyecto privado de RealCars Company. Para contribuir:

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Código propietario © 2025 RealCars Company. Todos los derechos reservados.

## 📞 Contacto

**RealCars Company**
- Website: https://realcarscompany.cl
- Email: contacto@realcarscompany.cl
- WhatsApp: +56 9 8777 5463
- Instagram: [@realcarscompanycl](https://instagram.com/realcarscompanycl)

**Desarrollo**
- Desarrollado por [Clikium](https://clikium.cl)

---

## 🎉 Estado del Proyecto

```
Progreso General: ████████░░ 85%

Frontend:    ██████████ 100%
Backend:     ████░░░░░░  40%
Testing:     ██████░░░░  60%
Deploy:      ████░░░░░░  40%
```

**Última actualización:** Octubre 2025

---

<div align="center">
  <strong>🚗 Excelencia Automotriz desde 2010 🏆</strong>
  <br>
  <em>RealCars Company - Santiago, Chile</em>
</div>
