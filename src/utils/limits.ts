import { Job, Plan } from '@prisma/client';
import { PRICING_TIERS } from '@/constants/plan';
import { CronExpressionParser } from 'cron-parser';
import { prisma } from '@/lib/prisma';

function getPlanLimits(plan: Plan) {
    const info = PRICING_TIERS.find((tier) => tier.id.toUpperCase() === plan)!;
    return info.limit;
}

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

export function checkJobExecutionLimit(job: Job, userPlan: Plan): boolean {
    const limits = getPlanLimits(userPlan);
    
    // 無制限プランの場合はtrueを返す
    if (limits.maxExecutions === Infinity) {
        return true;
    }
    
    // 月間実行回数が上限未満の場合はtrueを返す
    return job.count < limits.maxExecutions;
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