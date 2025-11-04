/*
  Warnings:

  - You are about to drop the column `count` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `failureCount` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "count",
DROP COLUMN "failureCount";
