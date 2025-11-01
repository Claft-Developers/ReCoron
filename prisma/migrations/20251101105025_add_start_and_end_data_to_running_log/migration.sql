/*
  Warnings:

  - Added the required column `startedAt` to the `RunningLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RunningLog" ADD COLUMN     "finishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL;
