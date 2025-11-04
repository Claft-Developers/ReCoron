import { Prisma, Job, Type, User, Method } from "@prisma/client";
import { CronExpressionParser } from "cron-parser";
import { PRICING_TIERS } from "@/constants/plan";
import { prisma } from "@/lib/prisma";
import { count } from "console";

const TIMEOUT = 10 * 1000; // 10秒

export async function executeCronJob(job: Job, type: Type = Type.AUTO) {
    const now = new Date();
    const interval = CronExpressionParser.parse(job.schedule, {
        tz: job.timezone || "Asia/Tokyo",
        currentDate: job.nextRunAt || now
    });
    const nextRun = interval.next().toDate();


    const url = job.url;
    const headers = (job.headers || {}) as Record<string, string>;
    const body = job.body || undefined;
    const payload: Prisma.RunningLogCreateInput = {
        job: { connect: { id: job.id } },
        user: { connect: { id: job.userId } },

        url,
        responseHeaders: {},
        responseBody: "",
        status: 0,
        durationMs: 0,

        successful: false,
        type,

        startedAt: new Date(),
        finishedAt: new Date(),
    };

    try {
        // タイムアウト設定 (30秒)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch(url, {
            method: job.method,
            headers: headers,
            body: body,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        payload.status = response.status;
        payload.responseHeaders = Object.fromEntries(response.headers.entries());
        payload.responseBody = await response.text();
        payload.successful = true;

        console.log(`Job ${job.id} executed with status: ${response.status}`);
    } catch (error) {
        console.error(`Job ${job.id} execution failed:`, error);
        payload.status = 0;
        if (error instanceof Error && error.name === 'AbortError') {
            payload.responseBody = `Request timeout (${TIMEOUT / 1000}s)`;
        } else {
            payload.responseBody = String(error);
        }
    } finally {
        const lastRunAt = new Date();
        payload.finishedAt = lastRunAt;
        payload.durationMs = payload.finishedAt.getTime() - now.getTime();
        
        const updatePayload = {
            lastRunAt,
        }
        if (type === Type.AUTO) {
            Object.assign(updatePayload, { nextRunAt: nextRun });
        }

        void (async () => { // 非同期で実行
            try {
                await Promise.all([
                    prisma.runningLog.create({ data: payload }),
                    prisma.job.update({
                        where: { id: job.id },
                        data: updatePayload,
                    }),
                ]);
            } catch (e) {
                console.error('Failed to persist job result', e);
            }
        })();


        return payload;
    }
}

export async function createCronJob(data: Prisma.JobCreateInput, user: User): Promise<Job> {
    const { name, url, method, schedule, timezone = "Asia/Tokyo", headers: customHeaders, body: requestBody } = data;
    const planInfo = PRICING_TIERS.find(plan => plan.id.toUpperCase() === user.plan)!;

    // バリデーション
    if (!name || !url || !method || !schedule) {
        throw new Error("必須フィールドが不足しています");
    }

    // URLの検証
    try {
        new URL(url);
    } catch {
        throw new Error("無効なURLです");
    }

    // Cron式の簡易検証 (5つのフィールドがあるか)
    const cronParts = schedule.trim().split(/\s+/);
    if (cronParts.length !== 5) {
        throw new Error("無効なCron形式です。5つのフィールド (分 時 日 月 曜日) が必要です");
    }
    let nextRunAt: Date;
    try {
        const interval = CronExpressionParser.parse(schedule, { tz: timezone });
        const next = interval.next().getTime();
        const next2 = interval.next().getTime();
        const delay = planInfo.limit.maxScheduling * 60 * 1000; // ミリ秒単位

        if (next2 - next < delay) {
            throw new Error(`${user.plan}プランでは、次回実行時刻は${Math.floor(delay / 1000 / 60)}分以上間隔を空ける必要があります`);
        }

        nextRunAt = new Date(next);
        nextRunAt.setSeconds(0, 0); // 秒とミリ秒を0にセット
    } catch {
        throw new Error("無効なCron形式です。正しいCron式を指定してください");
    }

    // カスタムヘッダーのバリデーション
    let parsedHeaders = null;
    if (customHeaders) {
        try {
            parsedHeaders = typeof customHeaders === "string"
                ? JSON.parse(customHeaders)
                : customHeaders;
        } catch {
            throw new Error("カスタムヘッダーは有効なJSON形式である必要があります");
        }
    }

    // ジョブを作成
    const job = await prisma.job.create({
        data: {
            name,
            url,
            method: method as Method,
            schedule,
            timezone,
            headers: parsedHeaders,
            body: requestBody || null,
            enabled: true,
            nextRunAt,
            userId: user.id,
        },
    });

    return job;
}