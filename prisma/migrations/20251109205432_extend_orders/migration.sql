/*
  Warnings:

  - Added the required column `precioUnitario` to the `OrdenCompra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrdenCompra" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'CLP',
ADD COLUMN     "precioUnitario" INTEGER NOT NULL,
ADD COLUMN     "sorteoTitulo" TEXT;
