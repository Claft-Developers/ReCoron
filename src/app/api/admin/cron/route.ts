import type { Prisma, Job } from "@prisma/client";
import { CronExpressionParser } from "cron-parser";
import { executeCronJob } from "@/lib/job";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    serverErrorResponse,
} from "@/utils/response";

import pLimit from "p-limit";

export async function GET() {
    // ここに Cron ジョブのロジックを実装
    const now = new Date();
    const limit = pLimit(5); // 同時実行数を5に制限
    const dueJobs = await prisma.job.findMany({
        where: {
            nextRunAt: { lte: now },
            enabled: true,
        },
    });
    const jobPromises = dueJobs.map((job) => limit(() => executeCronJob(job)));
    await Promise.all(jobPromises);

    return successResponse({ message: "Cron job triggered" });
}