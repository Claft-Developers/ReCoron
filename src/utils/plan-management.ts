import { Plan } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PRICING_TIERS } from '@/constants/plan';
import { CronExpressionParser } from 'cron-parser';

/**
 * プランの制限値を取得
 */
function getPlanLimits(plan: Plan) {
    const info = PRICING_TIERS.find((tier) => tier.id.toUpperCase() === plan)!;
    return info.limit;
}

/**
 * プラン変更時の処理
 * - ジョブ数が制限を超える場合、古いジョブから無効化
 * - 実行間隔が制限を満たさないジョブを無効化
 * - APIキー数が制限を超える場合、古いキーから無効化
 */
export async function handlePlanChange(userId: string, newPlan: Plan, oldPlan: Plan) {
    const newLimits = getPlanLimits(newPlan);
    const oldLimits = getPlanLimits(oldPlan);

    const results = {
        plan: {
            old: oldPlan,
            new: newPlan,
        },
        jobs: {
            total: 0,
            disabled: 0,
            disabledByCount: 0,
            disabledByInterval: 0,
            disabledJobIds: [] as string[],
        },
        apiKeys: {
            total: 0,
            disabled: 0,
            disabledKeyIds: [] as string[],
        },
    };

    // プランがダウングレードされた場合のみ処理
    const isDowngrade = isDowngrading(oldPlan, newPlan);

    if (!isDowngrade) {
        console.log(`Plan upgraded from ${oldPlan} to ${newPlan}. No restrictions applied.`);
        return results;
    }

    console.log(`Plan downgraded from ${oldPlan} to ${newPlan}. Applying restrictions...`);

    // 1. ジョブの制限チェックと無効化
    await handleJobRestrictions(userId, newLimits, results);

    // 2. APIキーの制限チェックと無効化
    await handleApiKeyRestrictions(userId, results);

    return results;
}

/**
 * プランがダウングレードされたかチェック
 */
function isDowngrading(oldPlan: Plan, newPlan: Plan): boolean {
    const planOrder = { FREE: 0, HOBBY: 1, PRO: 2 };
    return planOrder[oldPlan] > planOrder[newPlan];
}

/**
 * ジョブの制限を適用
 */
async function handleJobRestrictions(
    userId: string,
    newLimits: ReturnType<typeof getPlanLimits>,
    results: ReturnType<typeof handlePlanChange> extends Promise<infer T> ? T : never
) {
    // すべての有効なジョブを取得（古い順）
    const jobs = await prisma.job.findMany({
        where: {
            userId,
            enabled: true,
        },
        orderBy: {
            createdAt: 'asc', // 古い順
        },
    });

    results.jobs.total = jobs.length;

    const jobsToDisable: string[] = [];
    const jobsToDisableByInterval: string[] = [];

    // 実行間隔の制限チェック
    for (const job of jobs) {
        try {
            const interval = CronExpressionParser.parse(job.schedule, { tz: job.timezone });
            const next = interval.next().toDate();
            const after = interval.next().toDate();
            const intervalMinutes = Math.floor((after.getTime() - next.getTime()) / (1000 * 60));

            // 新しいプランの最小実行間隔を満たさない場合
            if (intervalMinutes < newLimits.maxScheduling) {
                jobsToDisableByInterval.push(job.id);
                console.log(
                    `Job "${job.name}" (${job.id}) will be disabled: ` +
                    `interval ${intervalMinutes}min < minimum ${newLimits.maxScheduling}min`
                );
            }
        } catch (error) {
            console.error(`Failed to parse cron for job ${job.id}:`, error);
        }
    }

    // ジョブ数の制限チェック
    if (jobs.length > newLimits.maxJobs) {
        // 実行間隔で無効化されないジョブの中から、古い順に無効化
        const activeJobs = jobs.filter(job => !jobsToDisableByInterval.includes(job.id));
        const excessCount = activeJobs.length - newLimits.maxJobs;

        if (excessCount > 0) {
            const jobsToDisableByCount = activeJobs.slice(0, excessCount).map(j => j.id);
            jobsToDisable.push(...jobsToDisableByCount);
            results.jobs.disabledByCount = jobsToDisableByCount.length;

            console.log(
                `${excessCount} jobs will be disabled due to job count limit ` +
                `(${jobs.length} > ${newLimits.maxJobs})`
            );
        }
    }

    // 実行間隔による無効化
    jobsToDisable.push(...jobsToDisableByInterval);
    results.jobs.disabledByInterval = jobsToDisableByInterval.length;

    // ジョブを無効化
    if (jobsToDisable.length > 0) {
        await prisma.job.updateMany({
            where: {
                id: { in: jobsToDisable },
            },
            data: {
                enabled: false,
            },
        });

        results.jobs.disabled = jobsToDisable.length;
        results.jobs.disabledJobIds = jobsToDisable;

        console.log(`Disabled ${jobsToDisable.length} jobs`);
    }
}

/**
 * APIキーの制限を適用
 */
async function handleApiKeyRestrictions(
    userId: string,
    results: ReturnType<typeof handlePlanChange> extends Promise<infer T> ? T : never
) {
    const maxApiKeys = 10; // 固定値

    // すべての有効なAPIキーを取得（古い順）
    const apiKeys = await prisma.aPIKey.findMany({
        where: {
            userId,
            enabled: true,
        },
        orderBy: {
            createdAt: 'asc', // 古い順
        },
    });

    results.apiKeys.total = apiKeys.length;

    // APIキー数の制限チェック
    if (apiKeys.length > maxApiKeys) {
        const excessCount = apiKeys.length - maxApiKeys;
        const keysToDisable = apiKeys.slice(0, excessCount).map(k => k.id);

        await prisma.aPIKey.updateMany({
            where: {
                id: { in: keysToDisable },
            },
            data: {
                enabled: false,
            },
        });

        results.apiKeys.disabled = keysToDisable.length;
        results.apiKeys.disabledKeyIds = keysToDisable;

        console.log(
            `Disabled ${keysToDisable.length} API keys due to limit ` +
            `(${apiKeys.length} > ${maxApiKeys})`
        );
    }
}

/**
 * ユーザーのプランを変更（管理者用）
 */
export async function changeUserPlan(userId: string, newPlan: Plan) {
    // 現在のプランを取得
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    const oldPlan = user.plan;

    // プランが同じ場合はスキップ
    if (oldPlan === newPlan) {
        console.log(`User ${userId} already has plan ${newPlan}`);
        return {
            changed: false,
            oldPlan,
            newPlan,
        };
    }

    // プラン変更時の制限適用
    const restrictions = await handlePlanChange(userId, newPlan, oldPlan);

    // プランを更新
    await prisma.user.update({
        where: { id: userId },
        data: { plan: newPlan },
    });

    console.log(`Changed plan for user ${userId}: ${oldPlan} -> ${newPlan}`);

    return {
        changed: true,
        oldPlan,
        newPlan,
        restrictions,
    };
}

/**
 * 無効化されたジョブを確認
 */
export async function getDisabledJobs(userId: string) {
    const jobs = await prisma.job.findMany({
        where: {
            userId,
            enabled: false,
        },
        orderBy: {
            updatedAt: 'desc',
        },
        select: {
            id: true,
            name: true,
            schedule: true,
            url: true,
            updatedAt: true,
        },
    });

    return jobs;
}

/**
 * 無効化されたAPIキーを確認
 */
export async function getDisabledApiKeys(userId: string) {
    const keys = await prisma.aPIKey.findMany({
        where: {
            userId,
            enabled: false,
        },
        orderBy: {
            updatedAt: 'desc',
        },
        select: {
            id: true,
            name: true,
            updatedAt: true,
        },
    });

    return keys;
}

/**
 * プラン変更の影響をシミュレート（実際には変更しない）
 */
export async function simulatePlanChange(userId: string, newPlan: Plan) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    const oldPlan = user.plan;
    const newLimits = getPlanLimits(newPlan);

    // 現在の状態を取得
    const [jobs, apiKeys] = await Promise.all([
        prisma.job.findMany({
            where: { userId, enabled: true },
            orderBy: { createdAt: 'asc' },
        }),
        prisma.aPIKey.findMany({
            where: { userId, enabled: true },
            orderBy: { createdAt: 'asc' },
        }),
    ]);

    const simulation = {
        currentPlan: oldPlan,
        newPlan,
        isDowngrade: isDowngrading(oldPlan, newPlan),
        jobs: {
            current: jobs.length,
            limit: newLimits.maxJobs,
            willBeDisabled: Math.max(0, jobs.length - newLimits.maxJobs),
            jobsToDisable: [] as Array<{ id: string; name: string; reason: string }>,
        },
        apiKeys: {
            current: apiKeys.length,
            limit: 10,
            willBeDisabled: Math.max(0, apiKeys.length - 10),
            keysToDisable: [] as Array<{ id: string; name: string }>,
        },
    };

    if (!simulation.isDowngrade) {
        return simulation;
    }

    // ジョブのシミュレーション
    const jobsToDisable: Array<{ id: string; name: string; reason: string }> = [];

    // 実行間隔チェック
    for (const job of jobs) {
        try {
            const interval = CronExpressionParser.parse(job.schedule, { tz: job.timezone });
            const next = interval.next().toDate();
            const after = interval.next().toDate();
            const intervalMinutes = Math.floor((after.getTime() - next.getTime()) / (1000 * 60));

            if (intervalMinutes < newLimits.maxScheduling) {
                jobsToDisable.push({
                    id: job.id,
                    name: job.name,
                    reason: `実行間隔 ${intervalMinutes}分 < 最小 ${newLimits.maxScheduling}分`,
                });
            }
        } catch (error) {
            // Cron解析エラー
        }
    }

    // ジョブ数チェック
    const activeJobs = jobs.filter(
        job => !jobsToDisable.find(j => j.id === job.id)
    );

    if (activeJobs.length > newLimits.maxJobs) {
        const excessCount = activeJobs.length - newLimits.maxJobs;
        const jobsByCount = activeJobs.slice(0, excessCount);

        jobsByCount.forEach(job => {
            jobsToDisable.push({
                id: job.id,
                name: job.name,
                reason: `ジョブ数制限超過（上限: ${newLimits.maxJobs}個）`,
            });
        });
    }

    simulation.jobs.willBeDisabled = jobsToDisable.length;
    simulation.jobs.jobsToDisable = jobsToDisable;

    // APIキーのシミュレーション
    if (apiKeys.length > 10) {
        const excessCount = apiKeys.length - 10;
        simulation.apiKeys.keysToDisable = apiKeys.slice(0, excessCount).map(key => ({
            id: key.id,
            name: key.name,
        }));
    }

    return simulation;
}
