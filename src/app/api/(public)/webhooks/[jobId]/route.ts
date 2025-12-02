import { NextRequest } from "next/server";
import type { APIKeyPayload } from "@/types/key";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { getAuth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import {
    successResponse,
    serverErrorResponse,
    notFoundResponse,
    unauthorizedResponse
} from "@/utils/response";


interface Context {
    params: Promise<{ jobId: string }>;
}

export const GET = (async (req: NextRequest, context: Context) => withAuth(req, async (req, payload) => {
    const auth = getAuth(payload);
    if (auth.type === "apiKey") {
        const token = auth.payload as APIKeyPayload;
        if (!token.scopes.includes("read:logs")) {
            return unauthorizedResponse("このAPIキーにはWebhookの読み取り権限がありません");
        }
    }
    const { jobId } = await context.params;

    try {
        const webhook = await prisma.webhookJobs.findFirst({
            where: { jobId, userId: auth.userId }
        });
        if (!webhook) return notFoundResponse("指定されたWebhookが存在しません");
        
        return successResponse(webhook);
    } catch (error) {
        console.error(`Error in GET /api/webhooks/${jobId}:`, error);
        return serverErrorResponse("Webhookの取得に失敗しました");
    }
}, context));

interface WebhookUpdateBody {
    endpoint?: string;
    headers?: Record<string, string>;
}

export const PUT = (async (req: NextRequest, context: Context) => withAuth(req, async (req, payload) => {
    const auth = getAuth(payload);
    if (auth.type === "apiKey") {
        const token = auth.payload as APIKeyPayload;
        if (!token.scopes.includes("write:logs")) {
            return unauthorizedResponse("このAPIキーにはWebhookの更新権限がありません");
        }
    }

    const { jobId } = await context.params;

    try {
        const body: WebhookUpdateBody = await req.json();
        const { endpoint, headers } = body;

        const webhook = await prisma.webhookJobs.findFirst({
            where: { jobId, userId: auth.userId }
        });
        if (!webhook) return notFoundResponse("指定されたWebhookが存在しません");
        
        const updatedWebhook = await prisma.webhookJobs.update({
            where: { id: webhook.id },
            data: {
                endpoint: endpoint ?? webhook.endpoint,
                headers: (headers ?? webhook.headers) as Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput,
            }
        });
        return successResponse(updatedWebhook);
    } catch (error) {
        console.error(`Error parsing request body in PUT /api/webhooks/${jobId}:`, error);
        return serverErrorResponse("Webhookの更新に失敗しました");
    }
}, context));

export const DELETE = (async (req: NextRequest, context: Context) => withAuth(req, async (req, payload) => {
    const auth = getAuth(payload);
    if (auth.type === "apiKey") {
        const token = auth.payload as APIKeyPayload;
        if (!token.scopes.includes("write:logs")) {
            return unauthorizedResponse("このAPIキーにはWebhookの削除権限がありません");
        }
    }

    const { jobId } = await context.params;

    try {
        const webhook = await prisma.webhookJobs.findFirst({
            where: { jobId, userId: auth.userId }
        });
        if (!webhook) return notFoundResponse("指定されたWebhookが存在しません");
        
        await prisma.webhookJobs.delete({
            where: { id: webhook.id }
        });

        return successResponse({ message: "Webhookを削除しました" });
    } catch (error) {
        console.error(`Error in DELETE /api/webhooks/${jobId}:`, error);
        return serverErrorResponse("Webhookの削除に失敗しました");
    }
}, context));