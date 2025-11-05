import { NextRequest } from "next/server";
import type { APIKeyPayload } from "@/types/key";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { getAuth } from "@/lib/auth";
import { generateRandomKey } from "@/utils/token";
import {
    successResponse,
    serverErrorResponse,
    notFoundResponse,
    createdResponse,
    unauthorizedResponse
} from "@/utils/response";



export const GET = (async (req: NextRequest) => withAuth(req, async (req, payload) => {
    const auth = getAuth(payload);
    if (auth.type === "apiKey") {
        const token = auth.payload as APIKeyPayload;
        if (!token.scopes.includes("read:logs")) {
            return unauthorizedResponse("このAPIキーにはWebhookの読み取り権限がありません");
        }
    }

    try {
        const webhooks = await prisma.webhookJobs.findMany({
            where: { userId: auth.userId }
        });
        return successResponse(webhooks);
    } catch (error) {
        console.error("Error in GET /api/webhooks:", error);
        return serverErrorResponse("Webhookの取得に失敗しました");
    }
}));

interface WebhookRequestBody {
    jobId: string;
    endpoint: string;
    headers?: Record<string, string>;
}

export const POST = (async (req: NextRequest) => withAuth(req, async (req, payload) => {
    const auth = getAuth(payload);
    if (auth.type === "apiKey") {
        const token = auth.payload as APIKeyPayload;
        if (!token.scopes.includes("write:logs")) {
            return unauthorizedResponse("このAPIキーにはWebhookの作成権限がありません");
        }
    }

    try {
        const body: WebhookRequestBody = await req.json();
        const { jobId, endpoint, headers } = body;

        const job = await prisma.job.findUnique({
            where: { id: jobId, userId: auth.userId },
            select: { id: true }
        });
        if (!job) {
            return notFoundResponse("指定されたジョブが存在しません");
        }

        // Webhook署名検証用のシークレットを生成
        const secret = generateRandomKey(32);
        const webhook = await prisma.webhookJobs.create({
            data: {
                jobId: job.id,
                userId: auth.userId,
                endpoint,
                secret,
                headers,
            }
        });
        return createdResponse(webhook);
    } catch (error) {
        console.error("Error in POST /api/webhooks:", error);
        return serverErrorResponse("Webhookの作成に失敗しました");
    }
}));