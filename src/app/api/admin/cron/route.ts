import { CronExpressionParser } from "cron-parser";
import { prisma } from "@/lib/prisma";
import { Job } from "@prisma/client";
import { Prisma } from "@prisma/client";

async function executeCronJobs(job: Job) {
    const now = new Date();
    const interval = CronExpressionParser.parse(job.schedule, { 
        tz: job.timezone || "Asia/Tokyo", 
        currentDate: job.nextRunAt || now 
    });
    const nextRun = interval.next().toDate();

    // ジョブの次回実行時刻を更新
    await prisma.job.update({
        where: { id: job.id },
        data: { nextRunAt: nextRun }
    });

    
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

        startedAt: new Date(),
        finishedAt: new Date(),
    };

    try {
        const response = await fetch(url, {
            method: job.method,
            headers: headers,
            body: body,
        });
        payload.status = response.status;
        payload.responseHeaders = Object.fromEntries(response.headers.entries());
        payload.responseBody = await response.text();

        console.log(`Job ${job.id} executed with status: ${response.status}`);
    } catch (error) {
        console.error(`Job ${job.id} execution failed:`, error);
        payload.status = 0;
        payload.responseBody = String(error);
    } finally {
        payload.finishedAt = new Date();
        payload.durationMs = payload.finishedAt.getTime() - now.getTime();

        await prisma.runningLog.create({ data: payload });
    }
}

export async function GET() {
    // ここに Cron ジョブのロジックを実装
    const now = new Date();
    const dueJobs = await prisma.job.findMany({
        where: {
            nextRunAt: { lte: now },
            enabled: true,
        },
    });
    const jobPromises = dueJobs.map((job) => executeCronJobs(job));
    await Promise.all(jobPromises);
    
    return new Response("Cron job triggered", { status: 200 });
}