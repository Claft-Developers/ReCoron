import { Prisma, Job, Type } from "@prisma/client";
import { CronExpressionParser } from "cron-parser";
import { prisma } from "@/lib/prisma";

const TIMEOUT = 10 * 1000; // 10秒

export async function executeCronJob(job: Job, type: Type = Type.AUTO) {
    const now = new Date();
    const interval = CronExpressionParser.parse(job.schedule, { 
        tz: job.timezone || "Asia/Tokyo", 
        currentDate: job.nextRunAt || now 
    });
    const nextRun = interval.next().toDate();

    // ジョブの次回実行時刻を更新
    if (type === Type.AUTO) {
        await prisma.job.update({
            where: { id: job.id },
            data: { nextRunAt: nextRun }
        });
    }

    
    const url = job.url;
    const headers = (job.headers || {}) as Record<string, string>;
    const body = job.body || undefined;

    const payload: Prisma.RunningLogCreateInput = {
        job: { connect: { id: job.id } },
        
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

        await prisma.runningLog.create({ data: payload });

        await prisma.job.update({
            where: { id: job.id },
            data: { 
                lastRunAt: lastRunAt,
                count: { increment: 1 },
                failureCount: payload.successful ? { increment: 0 } : { increment: 1 },
            },
        });

        return payload;
    }
}