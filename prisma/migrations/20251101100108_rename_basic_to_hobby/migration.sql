/*
  Warnings:

  - The values [BASIC] on the enum `Plan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Plan_new" AS ENUM ('FREE', 'HOBBY', 'PRO');
ALTER TABLE "public"."user" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TYPE "Plan" RENAME TO "Plan_old";
ALTER TYPE "Plan_new" RENAME TO "Plan";
DROP TYPE "public"."Plan_old";
ALTER TABLE "user" ALTER COLUMN "plan" SET DEFAULT 'FREE';
COMMIT;
