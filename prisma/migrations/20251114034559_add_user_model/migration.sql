-- AlterTable
ALTER TABLE "Auto" ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'CLP',
ADD COLUMN     "engine" TEXT,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locationCity" TEXT,
ADD COLUMN     "mainImageUrl" TEXT,
ADD COLUMN     "mileageKm" INTEGER,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "price" DECIMAL(65,30),
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'available',
ADD COLUMN     "title" TEXT,
ADD COLUMN     "traction" TEXT,
ADD COLUMN     "transmission" TEXT,
ADD COLUMN     "year" INTEGER;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicleId" TEXT NOT NULL,

    CONSTRAINT "VehicleImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Auto" ADD CONSTRAINT "Auto_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleImage" ADD CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Auto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
