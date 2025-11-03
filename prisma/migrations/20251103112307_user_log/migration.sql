/*
  Warnings:

  - Added the required column `user_id` to the `RunningLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RunningLog" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RunningLog" ADD CONSTRAINT "RunningLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
