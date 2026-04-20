-- AlterTable
ALTER TABLE "PagoKhipu" ADD COLUMN     "appUrl" TEXT,
ADD COLUMN     "paymentUrl" TEXT,
ADD COLUMN     "simplifiedTransferUrl" TEXT,
ADD COLUMN     "transferUrl" TEXT,
ALTER COLUMN "subject" DROP NOT NULL;
