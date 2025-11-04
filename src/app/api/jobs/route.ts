import { APIKeyPayload } from "@/types/key";
import { Session } from "@/types/session";
import { NextRequest } from "next/server";
import { Method } from "@prisma/client";
import { CronExpressionParser } from "cron-parser";
import { PRICING_TIERS } from "@/constants/plan";
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



export const POST = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        // ユーザーIDを取得
        const auth = getAuth(payload);
        const userId = auth.userId;

        const [user, body] = await Promise.all([
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

        const { name, url, method, schedule, timezone = "Asia/Tokyo", headers: customHeaders, body: requestBody } = body;

        // バリデーション
        if (!name || !url || !method || !schedule) {
            return validationErrorResponse("必須フィールドが不足しています");
        }

        // URLの検証
        try {
            new URL(url);
        } catch {
            return validationErrorResponse("無効なURLです");
        }

        // Cron式の簡易検証 (5つのフィールドがあるか)
        const cronParts = schedule.trim().split(/\s+/);
        if (cronParts.length !== 5) {
            return validationErrorResponse("無効なCron形式です。5つのフィールド (分 時 日 月 曜日) が必要です");
        }
        let nextRunAt: Date;
        try {
            const interval = CronExpressionParser.parse(schedule, { tz: timezone });
            const next = interval.next().getTime();
            const next2 = interval.next().getTime();
            const delay = planInfo.limit.maxScheduling * 60 * 1000; // ミリ秒単位

            if (next2 - next < delay) {
                return validationErrorResponse(`${user.plan}プランでは、次回実行時刻は${Math.floor(delay / 1000 / 60)}分以上間隔を空ける必要があります`);
            }
            
            nextRunAt = new Date(next);
            nextRunAt.setSeconds(0, 0); // 秒とミリ秒を0にセット
        } catch {
            return validationErrorResponse("無効なCron形式です。正しいCron式を指定してください");
        }

        // カスタムヘッダーのバリデーション
        let parsedHeaders = null;
        if (customHeaders) {
            try {
                parsedHeaders = typeof customHeaders === "string" 
                    ? JSON.parse(customHeaders) 
                    : customHeaders;
            } catch {
                return validationErrorResponse("カスタムヘッダーは有効なJSON形式である必要があります");
            }
        }

        // ジョブを作成
        const job = await prisma.job.create({
            data: {
                name,
                url,
                method: method as Method,
                schedule,
                timezone,
                headers: parsedHeaders,
                body: requestBody || null,
                enabled: true,
                nextRunAt,
                userId,
            },
        });

        return createdResponse(job);
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