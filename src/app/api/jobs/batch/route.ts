import { NextRequest } from "next/server";
import { Prisma, User } from "@prisma/client";
import { APIKeyPayload } from "@/types/key";
import { createCronJob } from "@/lib/job";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import {
    createdResponse,
    validationErrorResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from "@/utils/response";
import { getAuth } from "@/lib/auth";
import { checkJobCreationLimit, recordJobCreation } from "@/utils/usage-tracking";

export const POST = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        // ユーザーIDを取得
        const auth = getAuth(payload);
        const userId = auth.userId;
        const [user, body]: [User | null, Prisma.JobCreateInput[]] = await Promise.all([
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

        if (!(typeof body === "object" && "length" in body)) {
            return validationErrorResponse("リクエストボディは配列である必要があります");
        }

        if (body.length === 0) {
            return validationErrorResponse("少なくとも1つのジョブを指定してください");
        }

        // 新しい使用量追跡システムでチェック
        const limitCheck = await checkJobCreationLimit(userId, user.plan);
        if (!limitCheck.allowed) {
            return validationErrorResponse(limitCheck.message || "ジョブ作成の上限に達しています");
        }

        // バッチ作成の場合、追加するジョブ数も考慮
        const currentJobCount = await prisma.job.count({ where: { userId } });
        if (currentJobCount + body.length > limitCheck.maxJobs) {
            return validationErrorResponse(
                `リクエストされたジョブ数 (${body.length} 件) を作成すると、` +
                `プランの上限 (${limitCheck.maxJobs} 件) を超えてしまいます。` +
                `現在のジョブ数: ${currentJobCount} 件`
            );
        }

        const jobs = body.map((job) => createCronJob(job, user));
        const createdJobs = await Promise.all(jobs);

        // 各ジョブの作成を記録
        await Promise.all(createdJobs.map(job => recordJobCreation(userId, job.id)));

        return createdResponse({
            count: createdJobs.length,
            jobs: createdJobs
        }, `${createdJobs.length} 件のジョブを作成しました`);
    } catch (error) {
        console.error("Batch job creation error:", error);
        return serverErrorResponse("ジョブの一括作成中にエラーが発生しました");
    }
}));