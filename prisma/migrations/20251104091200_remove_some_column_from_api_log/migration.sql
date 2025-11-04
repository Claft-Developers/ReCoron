/*
  Warnings:

  - You are about to drop the column `durationMs` on the `APILog` table. All the data in the column will be lost.
  - You are about to drop the column `responseBody` on the `APILog` table. All the data in the column will be lost.
  - You are about to drop the column `responseHeaders` on the `APILog` table. All the data in the column will be lost.
  - You are about to drop the column `responseStatus` on the `APILog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "APILog" DROP COLUMN "durationMs",
DROP COLUMN "responseBody",
DROP COLUMN "responseHeaders",
DROP COLUMN "responseStatus";
