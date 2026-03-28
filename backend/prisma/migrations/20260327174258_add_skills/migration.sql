/*
  Warnings:

  - Made the column `summary` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "skills" JSONB,
ALTER COLUMN "summary" SET NOT NULL;
