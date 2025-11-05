import { APIKeyPayload } from "@/types/key";
import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    serverErrorResponse,
    notFoundResponse,
    unauthorizedResponse,
} from "@/utils/response";
import { getAuth } from "@/lib/auth";
import { recordJobDeletion } from "@/utils/usage-tracking";

interface Context {
    params: Promise<{ [key: string]: string }>;
}

export const GET = ((req: NextRequest, context: Context) => withAuth(req, async (req, payload, context) => {
    try {
        const { jobId } = await context!.params;
        const auth = getAuth(payload);

        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("read:jobs")) {
                return unauthorizedResponse("このAPIキーにはジョブ読み取りの権限がありません");
            }
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId, userId: auth.userId },
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

export const DELETE = ((req: NextRequest, context: Context) => withAuth(req, async (req, payload, context) => {
    try {
        const { jobId } = await context!.params;
        const auth = getAuth(payload);

        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("write:jobs")) {
                return unauthorizedResponse("このAPIキーにはジョブ削除の権限がありません");
            }
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId, userId: auth.userId },
        });

        if (!job) {
            return notFoundResponse("ジョブが見つかりません");
        }

        await prisma.job.delete({
            where: { id: jobId, userId: auth.userId },
        });

        // ジョブ削除を記録
        await recordJobDeletion(auth.userId, jobId);

        return successResponse(null, "ジョブを削除しました");
    } catch (error) {
        console.error("Failed to delete job:", error);
        return serverErrorResponse();
    }
}, context));

export const PATCH = ((req: NextRequest, context: Context) => withAuth(req, async (req, payload, context) => {
    try {
        const { jobId } = await context!.params;
        const auth = getAuth(payload);

        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("write:jobs")) {
                return unauthorizedResponse("このAPIキーにはジョブ更新の権限がありません");
            }
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId, userId: auth.userId },
        });

        if (!job) {
            return notFoundResponse("ジョブが見つかりません");
        }

        const updateData = await req.json();

        const updatedJob = await prisma.job.update({
            where: { id: jobId, userId: auth.userId },
            data: updateData,
        });

        return successResponse(updatedJob);
    } catch (error) {
        console.error("Failed to update job:", error);
        return serverErrorResponse();
    }
}, context));
