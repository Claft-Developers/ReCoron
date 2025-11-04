-- CreateTable
CREATE TABLE "monthly_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "totalApiCalls" INTEGER NOT NULL DEFAULT 0,
    "billedAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "executions" INTEGER NOT NULL DEFAULT 0,
    "apiCalls" INTEGER NOT NULL DEFAULT 0,
    "peakJobCount" INTEGER NOT NULL DEFAULT 0,
    "peakApiKeyCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monthly_usage_userId_idx" ON "monthly_usage"("userId");

-- CreateIndex
CREATE INDEX "monthly_usage_year_month_idx" ON "monthly_usage"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_usage_userId_year_month_key" ON "monthly_usage"("userId", "year", "month");

-- CreateIndex
CREATE INDEX "resource_history_userId_resourceType_idx" ON "resource_history"("userId", "resourceType");

-- CreateIndex
CREATE INDEX "resource_history_createdAt_idx" ON "resource_history"("createdAt");

-- CreateIndex
CREATE INDEX "daily_usage_userId_idx" ON "daily_usage"("userId");

-- CreateIndex
CREATE INDEX "daily_usage_date_idx" ON "daily_usage"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_usage_userId_date_key" ON "daily_usage"("userId", "date");

-- AddForeignKey
ALTER TABLE "monthly_usage" ADD CONSTRAINT "monthly_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_history" ADD CONSTRAINT "resource_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_usage" ADD CONSTRAINT "daily_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
