import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    serverErrorResponse,
    notFoundResponse,
} from "@/utils/response";

interface Context {
    params: Promise<{ [key: string]: string }>;
}

export const GET = ((req: NextRequest, context: Context) => withAuth(req, async (req, type, payload, context) => {
    try {
        const { jobId } = await context!.params;
        const userId = type === "session"
            ? payload.user.id
            : (payload as Record<string, any>).userId as string;

        const job = await prisma.job.findUnique({
            where: { id: jobId, userId },
        });
        if (job) {
            return successResponse(job);
        }

        return notFoundResponse("未実装です");
    } catch (error) {
        console.error("Failed to get job:", error);
        return serverErrorResponse();
    }
}, context));

export const DELETE = ((req: NextRequest, context: Context) => withAuth(req, async (req, type, payload, context) => {
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

        await prisma.job.delete({
            where: { id: jobId, userId },
        });

        return successResponse("ジョブを削除しました");
    } catch (error) {
        console.error("Failed to delete job:", error);
        return serverErrorResponse();
    }
}, context));