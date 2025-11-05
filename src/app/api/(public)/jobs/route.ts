import { APIKeyPayload } from "@/types/key";
import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import {
    createdResponse,
    successResponse,
    validationErrorResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from "@/utils/response";
import { getAuth } from "@/lib/auth";
import { createCronJob } from "@/lib/job";
import { checkJobCreationLimit, recordJobCreation } from "@/utils/usage-tracking";



export const POST = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        // ユーザーIDを取得
        const auth = getAuth(payload);
        const userId = auth.userId;

        const [user, body] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
            }),
            req.json()
        ]);
        // ユーザーが存在しない = アカウントが削除された
        if (!user) {
            return unauthorizedResponse("ユーザーアカウントが存在しません");
        }
        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("write:jobs")) {
                return unauthorizedResponse("このAPIキーにはジョブ作成の権限がありません");
            }
        }

        // 新しい使用量追跡システムでチェック
        const limitCheck = await checkJobCreationLimit(userId, user.plan);
        if (!limitCheck.allowed) {
            return validationErrorResponse(limitCheck.message || "ジョブ作成の上限に達しています");
        }

        const result = await createCronJob(body, user);

        // ジョブ作成を記録
        await recordJobCreation(userId, result.id);

        return createdResponse(result);
    } catch (error) {
        console.error("Failed to create job:", error);
        return serverErrorResponse("ジョブの作成に失敗しました");
    }
}));

export const GET = ((req: NextRequest) => withAuth(req, async (_, payload) => {
    try {
        // ユーザーIDを取得
        const auth = getAuth(payload);
        
        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("read:jobs")) {
                return unauthorizedResponse("このAPIキーにはジョブ読み取りの権限がありません");
            }
        }

        const jobs = await prisma.job.findMany({
            where: {
                userId: auth.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return successResponse(jobs);
    } catch (error) {
        console.error("Failed to fetch jobs:", error);
        return serverErrorResponse("ジョブの取得に失敗しました");
    }
}));