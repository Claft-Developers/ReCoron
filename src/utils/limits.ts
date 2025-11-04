/**
 * @deprecated このファイルは非推奨です。新しい使用量追跡システムは usage-tracking.ts を使用してください。
 * 
 * 以下の関数は後方互換性のために残されていますが、今後削除される予定です：
 * - checkJobCreationLimit -> usage-tracking.ts の同名関数を使用
 * - checkScheduleInterval -> usage-tracking.ts の同名関数を使用  
 * - checkJobExecutionLimit -> usage-tracking.ts の同名関数を使用
 * - checkApiCallLimit -> usage-tracking.ts の同名関数を使用
 */

import { Job, Plan } from '@prisma/client';
import { PRICING_TIERS } from '@/constants/plan';
import { CronExpressionParser } from 'cron-parser';
import { prisma } from '@/lib/prisma';

function getPlanLimits(plan: Plan) {
    const info = PRICING_TIERS.find((tier) => tier.id.toUpperCase() === plan)!;
    return info.limit;
}

/**
 * @deprecated usage-tracking.ts の checkScheduleInterval を使用してください
 * スケジュールの実行間隔をチェック
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
 * @deprecated 不要 - 月初めのカウントリセットは新システムでは不要です
 * 月初めにすべてのジョブのカウントをリセット
 */
export async function resetMonthlyJobCounts(): Promise<void> {
    console.warn('resetMonthlyJobCounts is deprecated and no longer needed with the new usage tracking system');
    // 何もしない - 新システムでは月次使用量は MonthlyUsage テーブルで管理
}