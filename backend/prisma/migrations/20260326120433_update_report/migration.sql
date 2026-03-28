/*
  Warnings:

  - You are about to alter the column `avgScore` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recommendation" TEXT,
ADD COLUMN     "strengths" TEXT[],
ADD COLUMN     "weaknesses" TEXT[],
ALTER COLUMN "summary" DROP NOT NULL,
ALTER COLUMN "avgScore" SET DATA TYPE INTEGER;
