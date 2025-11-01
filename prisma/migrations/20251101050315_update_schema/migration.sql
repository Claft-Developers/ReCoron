/*
  Warnings:

  - The `method` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userId` on the `RunningLog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "method",
ADD COLUMN     "method" "Method" NOT NULL DEFAULT 'GET';

-- AlterTable
ALTER TABLE "RunningLog" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_enabled_nextRunAt_idx" ON "Job"("enabled", "nextRunAt");

-- CreateIndex
CREATE INDEX "RunningLog_jobId_idx" ON "RunningLog"("jobId");

-- CreateIndex
CREATE INDEX "RunningLog_createdAt_idx" ON "RunningLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningLog" ADD CONSTRAINT "RunningLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
