import { NextRequest } from "next/server";
import { executeCronJob } from "@/lib/job";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    unauthorizedResponse
} from "@/utils/response";
import pLimit from "p-limit";

const TOKEN = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (token !== TOKEN) {
        return unauthorizedResponse("Invalid cron token");
    }
    
    // 通常のCronジョブ実行
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

    return successResponse({ message: "Cron job triggered" }, "Cron job triggered");
}