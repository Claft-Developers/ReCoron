import { Plan } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PRICING_TIERS } from '@/constants/plan';

/**
 * 現在の年月を取得
 */
function getCurrentYearMonth(): { year: number; month: number } {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1, // 0-11 -> 1-12
    };
}

/**
 * 今日の日付を取得（時刻を0:00:00に設定）
 */
function getTodayDate(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
}

/**
 * プランの制限値を取得
 */
function getPlanLimits(plan: Plan) {
    const info = PRICING_TIERS.find((tier) => tier.id.toUpperCase() === plan)!;
    return info.limit;
}

/**
 * リソース履歴を記録
 */
async function recordResourceHistory(
    userId: string,
    resourceType: 'JOB' | 'API_KEY',
    resourceId: string,
    action: 'CREATED' | 'DELETED'
) {
    await prisma.resourceHistory.create({
        data: {
            userId,
            resourceType,
            resourceId,
            action,
        },
    });
}

/**
 * 月次使用量を取得または作成
 */
async function getOrCreateMonthlyUsage(userId: string) {
    const { year, month } = getCurrentYearMonth();

    const usage = await prisma.monthlyUsage.upsert({
        where: {
            userId_year_month: { userId, year, month },
        },
        update: {},
        create: {
            userId,
            year,
            month,
            totalExecutions: 0,
            totalApiCalls: 0,
        },
    });

    return usage;
}

/**
 * 日次使用量を取得または作成
 */
async function getOrCreateDailyUsage(userId: string) {
    const date = getTodayDate();

    const usage = await prisma.dailyUsage.upsert({
        where: {
            userId_date: { userId, date },
        },
        update: {},
        create: {
            userId,
            date,
            executions: 0,
            apiCalls: 0,
            peakJobCount: 0,
            peakApiKeyCount: 0,
        },
    });

    return usage;
}

/**
 * ジョブ作成の制限をチェック（新システム）
 */
export async function checkJobCreationLimit(userId: string, userPlan: Plan): Promise<{
    allowed: boolean;
    currentCount: number;
    todayCreatedCount: number;
    todayDeletedCount: number;
    maxJobs: number;
    message?: string;
}> {
    const limits = getPlanLimits(userPlan);
    const today = getTodayDate();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 現在のジョブ数を取得
    const currentCount = await prisma.job.count({
        where: { userId },
    });

    // 今日作成・削除されたジョブ数を取得
    const [todayCreated, todayDeleted] = await prisma.$transaction([
        prisma.resourceHistory.count({
            where: {
                userId,
                resourceType: 'JOB',
                action: 'CREATED',
                createdAt: { gte: today, lt: tomorrow },
            },
        }),
        prisma.resourceHistory.count({
            where: {
                userId,
                resourceType: 'JOB',
                action: 'DELETED',
                createdAt: { gte: today, lt: tomorrow },
            },
        }),
    ]);

    // 今日の総活動数（作成+削除）でチェック
    // 削除して再作成を繰り返すことを防ぐ
    const totalTodayActivity = todayCreated + todayDeleted;
    const allowed = currentCount < limits.maxJobs && totalTodayActivity < limits.maxJobs * 2;

    return {
        allowed,
        currentCount,
        todayCreatedCount: todayCreated,
        todayDeletedCount: todayDeleted,
        maxJobs: limits.maxJobs,
        message: allowed
            ? undefined
            : currentCount >= limits.maxJobs
                ? `プランの上限 (${limits.maxJobs} 件) に達しています。現在のジョブ数: ${currentCount} 件`
                : `本日のジョブ作成・削除活動が上限に達しています。明日再度お試しください。`,
    };
}

/**
 * ジョブ作成を記録
 */
export async function recordJobCreation(userId: string, jobId: string) {
    const currentJobCount = await prisma.job.count({ where: { userId } });
    const dailyUsage = await getOrCreateDailyUsage(userId);

    // トランザクション内で複数の操作を実行
    await prisma.$transaction([
        prisma.resourceHistory.create({
            data: {
                userId,
                resourceType: 'JOB',
                resourceId: jobId,
                action: 'CREATED',
            },
        }),
        ...(currentJobCount > dailyUsage.peakJobCount
            ? [prisma.dailyUsage.update({
                where: { id: dailyUsage.id },
                data: { peakJobCount: currentJobCount },
            })]
            : []
        ),
    ]);
}

/**
 * ジョブ削除を記録
 */
export async function recordJobDeletion(userId: string, jobId: string) {
    await recordResourceHistory(userId, 'JOB', jobId, 'DELETED');
}

/**
 * APIキー作成の制限をチェック（新システム）
 */
export async function checkApiKeyCreationLimit(userId: string, userPlan: Plan): Promise<{
    allowed: boolean;
    currentCount: number;
    todayCreatedCount: number;
    todayDeletedCount: number;
    message?: string;
}> {
    const today = getTodayDate();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 現在のAPIキー数を取得
    const currentCount = await prisma.aPIKey.count({
        where: { userId },
    });

    // 今日作成・削除されたAPIキー数を取得
    const [todayCreated, todayDeleted] = await prisma.$transaction([
        prisma.resourceHistory.count({
            where: {
                userId,
                resourceType: 'API_KEY',
                action: 'CREATED',
                createdAt: { gte: today, lt: tomorrow },
            },
        }),
        prisma.resourceHistory.count({
            where: {
                userId,
                resourceType: 'API_KEY',
                action: 'DELETED',
                createdAt: { gte: today, lt: tomorrow },
            },
        }),
    ]);

    // APIキーは最大10個までとし、今日の活動は20回まで
    const maxApiKeys = 10;
    const maxDailyActivity = 20;
    const totalTodayActivity = todayCreated + todayDeleted;
    const allowed = currentCount < maxApiKeys && totalTodayActivity < maxDailyActivity;

    return {
        allowed,
        currentCount,
        todayCreatedCount: todayCreated,
        todayDeletedCount: todayDeleted,
        message: allowed
            ? undefined
            : currentCount >= maxApiKeys
                ? `APIキーの上限 (${maxApiKeys} 件) に達しています。`
                : `本日のAPIキー作成・削除活動が上限に達しています。明日再度お試しください。`,
    };
}

/**
 * APIキー作成を記録
 */
export async function recordApiKeyCreation(userId: string, apiKeyId: string) {
    const currentApiKeyCount = await prisma.aPIKey.count({ where: { userId } });
    const dailyUsage = await getOrCreateDailyUsage(userId);

    // トランザクション内で複数の操作を実行
    await prisma.$transaction([
        prisma.resourceHistory.create({
            data: {
                userId,
                resourceType: 'API_KEY',
                resourceId: apiKeyId,
                action: 'CREATED',
            },
        }),
        ...(currentApiKeyCount > dailyUsage.peakApiKeyCount
            ? [prisma.dailyUsage.update({
                where: { id: dailyUsage.id },
                data: { peakApiKeyCount: currentApiKeyCount },
            })]
            : []
        ),
    ]);
}

/**
 * APIキー削除を記録
 */
export async function recordApiKeyDeletion(userId: string, apiKeyId: string) {
    await recordResourceHistory(userId, 'API_KEY', apiKeyId, 'DELETED');
}

/**
 * ジョブ実行の制限をチェック
 */
export async function checkJobExecutionLimit(userId: string, userPlan: Plan): Promise<{
    allowed: boolean;
    currentMonthExecutions: number;
    maxExecutions: number;
    message?: string;
}> {
    const limits = getPlanLimits(userPlan);
    const usage = await getOrCreateMonthlyUsage(userId);

    // 無制限プランの場合
    if (limits.maxExecutions === Infinity) {
        return {
            allowed: true,
            currentMonthExecutions: usage.totalExecutions,
            maxExecutions: Infinity,
        };
    }

    const allowed = usage.totalExecutions < limits.maxExecutions;

    return {
        allowed,
        currentMonthExecutions: usage.totalExecutions,
        maxExecutions: limits.maxExecutions,
        message: allowed
            ? undefined
            : `月間実行回数の上限 (${limits.maxExecutions} 回) に達しています。現在: ${usage.totalExecutions} 回`,
    };
}

/**
 * ジョブ実行を記録
 */
export async function recordJobExecution(userId: string) {
    const { year, month } = getCurrentYearMonth();
    const date = getTodayDate();

    // トランザクション内で月次と日次の使用量を同時に更新
    await prisma.$transaction([
        prisma.monthlyUsage.upsert({
            where: {
                userId_year_month: { userId, year, month },
            },
            update: {
                totalExecutions: { increment: 1 },
            },
            create: {
                userId,
                year,
                month,
                totalExecutions: 1,
                totalApiCalls: 0,
            },
        }),
        prisma.dailyUsage.upsert({
            where: {
                userId_date: { userId, date },
            },
            update: {
                executions: { increment: 1 },
            },
            create: {
                userId,
                date,
                executions: 1,
                apiCalls: 0,
                peakJobCount: 0,
                peakApiKeyCount: 0,
            },
        }),
    ]);
}

/**
 * API呼び出しの制限をチェック
 */
export async function checkApiCallLimit(userId: string, userPlan: Plan): Promise<{
    allowed: boolean;
    todayApiCalls: number;
    maxDailyApiCalls: number;
    message?: string;
}> {
    const limits = getPlanLimits(userPlan);
    const dailyUsage = await getOrCreateDailyUsage(userId);

    const allowed = dailyUsage.apiCalls < limits.maxApiCalls;

    return {
        allowed,
        todayApiCalls: dailyUsage.apiCalls,
        maxDailyApiCalls: limits.maxApiCalls,
        message: allowed
            ? undefined
            : `本日のAPI呼び出し上限 (${limits.maxApiCalls} 回) に達しています。現在: ${dailyUsage.apiCalls} 回`,
    };
}

/**
 * API呼び出しを記録
 */
export async function recordApiCall(userId: string) {
    const { year, month } = getCurrentYearMonth();
    const date = getTodayDate();

    // トランザクション内で月次と日次の使用量を同時に更新
    await prisma.$transaction([
        prisma.monthlyUsage.upsert({
            where: {
                userId_year_month: { userId, year, month },
            },
            update: {
                totalApiCalls: { increment: 1 },
            },
            create: {
                userId,
                year,
                month,
                totalExecutions: 0,
                totalApiCalls: 1,
            },
        }),
        prisma.dailyUsage.upsert({
            where: {
                userId_date: { userId, date },
            },
            update: {
                apiCalls: { increment: 1 },
            },
            create: {
                userId,
                date,
                executions: 0,
                apiCalls: 1,
                peakJobCount: 0,
                peakApiKeyCount: 0,
            },
        }),
    ]);
}

/**
 * スケジュールの実行間隔をチェック（既存の機能を維持）
 */
export function checkScheduleInterval(schedule: string, userPlan: Plan): {
    allowed: boolean;
    intervalMinutes: number;
    minInterval: number;
    message?: string;
} {
    const limits = getPlanLimits(userPlan);

    try {
        const CronParser = require('cron-parser');
        const interval = CronParser.parseExpression(schedule);
        const next = interval.next().toDate();
        const after = interval.next().toDate();

        const intervalMs = after.getTime() - next.getTime();
        const intervalMinutes = Math.floor(intervalMs / (1000 * 60));

        const allowed = intervalMinutes >= limits.maxScheduling;

        return {
            allowed,
            intervalMinutes,
            minInterval: limits.maxScheduling,
            message: allowed
                ? undefined
                : `このプランでは最小実行間隔は ${limits.maxScheduling} 分です。指定された間隔: ${intervalMinutes} 分`,
        };
    } catch (error) {
        return {
            allowed: false,
            intervalMinutes: 0,
            minInterval: limits.maxScheduling,
            message: '無効なCron式です',
        };
    }
}
