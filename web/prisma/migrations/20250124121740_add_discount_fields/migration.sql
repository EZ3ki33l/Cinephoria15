-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isRecurrent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);
