/*
  Warnings:

  - Added the required column `difficulty` to the `JobRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `JobRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobRole" ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL;
