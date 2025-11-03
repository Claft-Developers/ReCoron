-- DropForeignKey
ALTER TABLE "public"."RunningLog" DROP CONSTRAINT "RunningLog_jobId_fkey";

-- AlterTable
ALTER TABLE "RunningLog" ALTER COLUMN "jobId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RunningLog" ADD CONSTRAINT "RunningLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
