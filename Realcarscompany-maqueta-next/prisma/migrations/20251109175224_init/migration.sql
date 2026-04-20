-- CreateEnum
CREATE TYPE "AutoEstado" AS ENUM ('disponible', 'vendido', 'reservado');

-- CreateEnum
CREATE TYPE "AdminRol" AS ENUM ('SUPERADMIN');

-- CreateEnum
CREATE TYPE "OrdenEstado" AS ENUM ('pendiente', 'pagado', 'expirado', 'cancelado');

-- CreateEnum
CREATE TYPE "TicketEstado" AS ENUM ('activo', 'usado', 'ganador');

-- CreateEnum
CREATE TYPE "PagoEstado" AS ENUM ('pending', 'verified', 'done', 'expired', 'cancelled');

-- CreateTable
CREATE TABLE "Auto" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "transmision" TEXT NOT NULL,
    "combustible" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "imagenes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "descripcion" TEXT NOT NULL,
    "caracteristicas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estado" "AutoEstado" NOT NULL DEFAULT 'disponible',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRol" NOT NULL DEFAULT 'SUPERADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" TEXT NOT NULL,
    "sorteoId" TEXT,
    "cantidad" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "compradorNombre" TEXT NOT NULL,
    "compradorEmail" TEXT NOT NULL,
    "compradorTelefono" TEXT NOT NULL,
    "compradorRut" TEXT,
    "estado" "OrdenEstado" NOT NULL DEFAULT 'pendiente',
    "khipuPaymentUrl" TEXT,
    "khipuSimplifiedTransferUrl" TEXT,
    "khipuTransferUrl" TEXT,
    "khipuAppUrl" TEXT,
    "fechaPago" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketSorteo" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "sorteoId" TEXT NOT NULL,
    "comprador" TEXT NOT NULL,
    "estado" "TicketEstado" NOT NULL DEFAULT 'activo',
    "fechaCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ordenId" TEXT NOT NULL,

    CONSTRAINT "TicketSorteo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoKhipu" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "khipuPaymentId" TEXT,
    "subject" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CLP',
    "status" "PagoEstado" NOT NULL DEFAULT 'pending',
    "statusDetail" TEXT,
    "returnUrl" TEXT,
    "cancelUrl" TEXT,
    "notificationToken" TEXT,
    "receiverId" TEXT,
    "readyForTerminal" BOOLEAN NOT NULL DEFAULT false,
    "conciliationDate" TIMESTAMP(3),
    "payerEmail" TEXT,
    "payerName" TEXT,
    "customData" JSONB,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ordenId" TEXT,

    CONSTRAINT "PagoKhipu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auto_slug_key" ON "Auto"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TicketSorteo_numero_key" ON "TicketSorteo"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "PagoKhipu_transactionId_key" ON "PagoKhipu"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoKhipu_khipuPaymentId_key" ON "PagoKhipu"("khipuPaymentId");

-- AddForeignKey
ALTER TABLE "TicketSorteo" ADD CONSTRAINT "TicketSorteo_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenCompra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoKhipu" ADD CONSTRAINT "PagoKhipu_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenCompra"("id") ON DELETE SET NULL ON UPDATE CASCADE;
