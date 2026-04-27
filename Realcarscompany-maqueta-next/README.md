# 🚗 RealCars Company - Automotora Premium

Sistema web completo para automotora de lujo con sistema de venta de imágenes digitales, promoción comercial y pagos integrados.

## 🎯 Características Principales

### 🚘 Catálogo de Vehículos
- Listado de autos premium con diseño sofisticado.
- Página de detalle con galería interactiva y especificaciones completas.
- Panel de gestión para inventario y estados del vehículo (Disponible, Vendido).

### 🎰 Sistema de Promoción Monzza
- Venta automatizada de "Imágenes Digitales" (Tickets promocionales).
- Pago seguro integrado con **Flow Chile** (Webpay, MACH, Servipag, transferencia bancaria).
- Generación automática de IDs de participación únicos y enlazados al RUT.
- Envío automático de correos electrónicos con las imágenes adjuntas a través de **Resend**.

### 📱 Funcionalidades Extra
- Contacto directo vía WhatsApp.
- Base de datos de clientes y órdenes unificada en un CRM básico administrativo.
- Diseño de alto impacto y totalmente responsivo (mobile-first).

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Librería UI:** React 19+
- **Estilos:** Tailwind CSS 4
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Lenguaje:** TypeScript 5.x

### Backend y Servicios
- **Framework:** Next.js API Routes (Serverless)
- **Base de Datos:** PostgreSQL (alojada en Supabase)
- **ORM:** Prisma Client
- **Pagos:** API REST de Flow Chile (Creación de pagos y Webhooks de confirmación)
- **Emailing:** Resend API

## 🚀 Inicio Rápido

### Prerrequisitos
```bash
Node.js 18+ 
npm o pnpm
```

### Instalación Local

```bash
# Clonar y/o entrar al directorio
cd Realcarscompany-maqueta-next

# Instalar dependencias
npm install

# Copiar variables de entorno (si aplica)
cp .env.example .env
```

Editar `.env` con las credenciales de tu proyecto (Supabase, Flow, Resend).

```bash
# Sincronizar Prisma con la base de datos
npx prisma generate
npx prisma db push

# Iniciar servidor de desarrollo con Turbopack
npm run dev
```

El sitio estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto Destacada

```
realcarscompany-web/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (marketing)/       # Rutas públicas (Inicio, Monzza, Autos, Contacto)
│   │   ├── admin/             # Panel admin (protegido) con Dashboard y CRM
│   │   ├── api/               # Endpoints del Backend
│   │   │   └── pagos/flow/    # Lógica de Integración y Webhooks de Flow
│   │   ├── layout.tsx         # Layout principal
│   │   └── global.css         # Estilos globales
│   │
│   ├── components/            # Componentes reutilizables (Formularios, Tarjetas, Modales)
│   ├── lib/                   # Configuración y utilidades de servidor
│   │   ├── prisma.ts          # Inicialización de Prisma Client
│   │   ├── flow.ts            # Utilidades de criptografía (HMAC-SHA256) para Flow
│   │   └── supabase.ts        # Cliente nativo de Supabase
│
├── prisma/                    # Modelos de base de datos PostgreSQL
│   └── schema.prisma
├── public/                    # Assets estáticos (logos, imágenes, stickers adjuntos)
└── tailwind.config.ts         # Configuración de sistema de diseño
```

## 🔐 Variables de Entorno Clave

Configuraciones necesarias en tu archivo `.env`:

```env
# Base de datos Supabase (Prisma)
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."

# Supabase Cliente
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Integración Email
RESEND_API_KEY="re_..."

# Integración Pasarela Flow
FLOW_API_KEY="..."
FLOW_SECRET_KEY="..."
FLOW_URL="https://www.flow.cl/api"

# URL base para webhooks y redirecciones
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Cambiar en Producción
```

## 💳 Flujo del Sistema de Pagos (Flow)

Este proyecto está integrado oficialmente con **Flow Chile**. El proceso de compra automatizado es el siguiente:
1. El usuario llena el formulario y elige la cantidad de imágenes digitales en `/monzza`.
2. Se registra la `Orden` en estado `pendiente` dentro de PostgreSQL.
3. Se firma la petición de pago y se redirige al cliente a la plataforma segura de Flow.
4. Una vez realizado el pago, Flow notifica al servidor vía POST al webhook oculto `api/pagos/flow/confirmacion`.
5. El sistema procesa la notificación (retornando HTTP 200 a Flow), actualiza la orden en la base de datos a `pagado`, genera los "tickets" asignados, y dispara la confirmación por correo usando **Resend** con los archivos adjuntos incluidos.
6. El usuario visualiza la pantalla de "Pago Exitoso" (`/pago/exito`) en el navegador.

## 🎯 Estado y Roadmap

### ✅ Implementado y Funcional
- [x] Diseño UI/UX premium responsivo
- [x] Landing promocional "Monzza" y Catálogo de Autos
- [x] Base de datos en PostgreSQL con Prisma Schema (Vehículos, Órdenes, Tickets)
- [x] Integración completa de pagos con Flow Chile (Checkouts y Webhooks)
- [x] Envío de correos automatizados con Resend (incluyendo adjuntos)
- [x] Panel de administración básico (Dashboard / CRM de órdenes)

### 🔄 En Progreso / Tareas Futuras
- [ ] Seguridad estricta y Autenticación para el panel de administración (`/admin`).
- [ ] CRUD completo y subida de imágenes optimizada para nuevos Vehículos desde el Admin.
- [ ] Exportación avanzada de bases de datos desde el CRM.

## 📝 Licencia

Código propietario © 2026 RealCars Company. Todos los derechos reservados.

## 📞 Contacto

**RealCars Company**
- Website: https://realcarscompany.cl
- Email: contacto@realcarscompany.cl

**Desarrollo**
- Desarrollado y administrado por [Clikium](https://clikium.cl)
