/*
  Warnings:

  - A unique constraint covering the columns `[paystackReference]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paystackReference" TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "instructorId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_paystackReference_key" ON "Enrollment"("paystackReference");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
