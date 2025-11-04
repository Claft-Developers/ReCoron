-- AlterTable
ALTER TABLE "api_key" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "APILog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "apiKeyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" "Method" NOT NULL,
    "requestHeaders" JSONB,
    "requestBody" TEXT,
    "responseStatus" INTEGER NOT NULL,
    "responseHeaders" JSONB,
    "responseBody" TEXT,
    "durationMs" INTEGER NOT NULL,

    CONSTRAINT "APILog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "APILog_apiKeyId_idx" ON "APILog"("apiKeyId");

-- AddForeignKey
ALTER TABLE "APILog" ADD CONSTRAINT "APILog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_key"("id") ON DELETE CASCADE ON UPDATE CASCADE;
