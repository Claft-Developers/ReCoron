import { type NextRequest } from "next/server";
import { executeCronJob } from "@/lib/job";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import {
    successResponse,
    serverErrorResponse,
    notFoundResponse,
} from "@/utils/response";

interface Context {
    params: Promise<{ [key: string]: string }>;
}

export const POST = ((req: NextRequest, context: Context) => withAuth(req, async (req, type, payload, context) => {
    try {
        const { jobId } = await context!.params;
        const userId = type === "session"
            ? payload.user.id
            : (payload as Record<string, any>).userId as string;
        const job = await prisma.job.findUnique({
            where: { id: jobId, userId },
        });
        if (!job) {
            return notFoundResponse("ジョブが見つかりません");
        }
        const result = await executeCronJob(job, "MANUAL");

        return successResponse({
            job,
            result,
        });
    } catch (error) {
        console.error("Failed to get job:", error);
        return serverErrorResponse();
    }
}, context));