-- CreateEnum
CREATE TYPE "Type" AS ENUM ('AUTO', 'MANUAL');

-- AlterTable
ALTER TABLE "RunningLog" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'AUTO';
