import { Job, Plan } from '@prisma/client';
import { PRICING_TIERS } from '@/constants/plan';
import { CronExpressionParser } from 'cron-parser';
import { prisma } from '@/lib/prisma';

function getPlanLimits(plan: Plan) {
    const info = PRICING_TIERS.find((tier) => tier.id.toUpperCase() === plan)!;
    return info.limit;
}
/**
 * ジョブ作成の制限をチェック
 * @param userId ユーザーID
 * @param userPlan ユーザープラン
 * @returns ジョブ作成の許可状況
 */
export async function checkJobCreationLimit(userId: string, userPlan: Plan): Promise<{
    allowed: boolean;
    currentCount: number;
    maxJobs: number;
    message?: string;
}> {
    const currentCount = await prisma.job.count({
        where: { userId },
    });

    const limits = getPlanLimits(userPlan);
    const allowed = currentCount < limits.maxJobs;

    return {
        allowed,
        currentCount,
        maxJobs: limits.maxJobs,
        message: allowed
            ? undefined
            : `プランの上限 (${limits.maxJobs} 件) に達しています。現在のジョブ数: ${currentCount} 件`,
    };
}

/**
 * スケジュールの実行間隔をチェック
 * @param schedule スケジュール文字列
 * @param userPlan ユーザープラン
 * @returns 実行間隔の許可状況
 */
export function checkScheduleInterval(schedule: string, userPlan: Plan): {
    allowed: boolean;
    intervalMinutes: number;
    minInterval: number;
    message?: string;
} {
    const limits = getPlanLimits(userPlan);

    try {
        const interval = CronExpressionParser.parse(schedule);
        const now = new Date();
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

/**
 * ジョブ実行の制限をチェック
 * @param job ジョブ情報
 * @param userPlan ユーザープラン
 * @returns 実行の許可状況
 */
export function checkJobExecutionLimit(job: Job, userPlan: Plan): boolean {
    const limits = getPlanLimits(userPlan);
    
    // 無制限プランの場合はtrueを返す
    if (limits.maxExecutions === Infinity) {
        return true;
    }
    
    // 月間実行回数が上限未満の場合はtrueを返す
    return job.count < limits.maxExecutions;
}

export async function checkApiCallLimit(userId: string): Promise<boolean> {
    const [keys, user] = await Promise.all([
        prisma.aPIKey.findMany({
            where: { userId },
            select: {
                count: true,
            },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { plan: true },
        }),
    ]);
    if (!user) return false;

    const totalCalls = keys.reduce((sum, key) => sum + key.count, 0);

    const limits = getPlanLimits(user.plan);
    const maxApi = limits.maxApiCalls;

    return totalCalls < maxApi;
}

/**
 * 月初めにすべてのジョブのカウントをリセット
 * Cronジョブで毎月1日に実行することを想定
 */
export async function resetMonthlyJobCounts(): Promise<void> {
    await prisma.job.updateMany({
        data: {
            count: 0,
        },
    });
}