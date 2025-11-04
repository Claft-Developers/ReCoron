import { NextRequest } from "next/server";
import { Prisma, User, Job } from "@prisma/client";
import { APIKeyPayload } from "@/types/key";
import { PRICING_TIERS } from "@/constants/plan";
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

interface UserWith extends User {
    jobs: Job[];
}

export const POST = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        // ユーザーIDを取得
        const auth = getAuth(payload);
        const userId = auth.userId;
        const [user, body]: [UserWith | null, Prisma.JobCreateInput[]] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                include: { jobs: true }
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

        const planInfo = PRICING_TIERS.find(plan => plan.id.toUpperCase() === user.plan)!;
        if (user.jobs.length >= planInfo.limit.maxJobs) {
            return validationErrorResponse(`現在のプラン (${user.plan}) では、最大ジョブ数 (${planInfo.limit.maxJobs} 件) に達しています`);
        }

        if (!(typeof body === "object" && "length" in body)) {
            return validationErrorResponse("リクエストボディは配列である必要があります");
        }

        if (body.length === 0) {
            return validationErrorResponse("少なくとも1つのジョブを指定してください");
        }

        if (user.jobs.length + body.length > planInfo.limit.maxJobs) {
            return validationErrorResponse(
                `リクエストされたジョブ数 (${body.length} 件) を作成すると、` +
                `プランの上限 (${planInfo.limit.maxJobs} 件) を超えてしまいます。` +
                `現在のジョブ数: ${user.jobs.length} 件`
            );
        }

        const jobs = body.map((job) => createCronJob(job, user));
        const createdJobs = await Promise.all(jobs);

        return createdResponse({
            count: createdJobs.length,
            jobs: createdJobs
        }, `${createdJobs.length} 件のジョブを作成しました`);
    } catch (error) {
        console.error("Batch job creation error:", error);
        return serverErrorResponse("ジョブの一括作成中にエラーが発生しました");
    }
}));