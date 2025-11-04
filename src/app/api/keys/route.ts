import { APIKeyPayload } from "@/types/key";
import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import {
    unauthorizedResponse,
    successResponse,
    createdResponse,
    serverErrorResponse,
    validationErrorResponse,
} from "@/utils/response";
import { signJWT, generateRandomKey, hashToken } from "@/utils/token";
import { checkApiKeyCreationLimit, recordApiKeyCreation } from "@/utils/usage-tracking";


export const GET = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        const auth = getAuth(payload);
        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("read:keys")) {
                return unauthorizedResponse("このAPIキーにはキー読み取りの権限がありません");
            }
        }
        const keys = await prisma.aPIKey.findMany({
            where: { userId: auth.userId },
        });
        return successResponse(keys);

    } catch (error) {
        console.error("Error in GET /api/keys:", error);
        return serverErrorResponse("サーバーエラーが発生しました。");
    }
}));

export const POST = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        const auth = getAuth(payload);
        if (auth.type === "apiKey") {
            const apiScopes = (auth.payload as APIKeyPayload).scopes;
            if (!apiScopes.includes("write:keys")) {
                return unauthorizedResponse("このAPIキーにはキー作成の権限がありません");
            }
        }

        // ユーザー情報を取得
        const user = await prisma.user.findUnique({
            where: { id: auth.userId },
        });

        if (!user) {
            return unauthorizedResponse("ユーザーが見つかりません");
        }

        // 新しい使用量追跡システムでチェック
        const limitCheck = await checkApiKeyCreationLimit(auth.userId, user.plan);
        if (!limitCheck.allowed) {
            return validationErrorResponse(limitCheck.message || "APIキー作成の上限に達しています");
        }

        const body = await req.json();
        const { name, scopes } = body;

        scopes?.forEach((scope: string) => {
            if (!["read:jobs", "write:jobs", "read:logs", "write:logs", "read:keys", "write:keys"].includes(scope)) {
                return validationErrorResponse(`無効なスコープが指定されました: ${scope}`);
            }
        });

        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const token = await signJWT({
            keyId: generateRandomKey(16),
            userId: auth.userId,
            scopes: scopes || [],
        }, expiresAt);
        const keyHash = await hashToken(token);

        const newKey = await prisma.aPIKey.create({
            data: {
                keyHash,
                name: name || "New API Key",
                userId: auth.userId,
                scopes: scopes || [],
                enabled: true,
                expiresAt,
            },
        });

        // APIキー作成を記録
        await recordApiKeyCreation(auth.userId, newKey.id);

        return createdResponse({ apiKey: newKey, token });
    } catch (error) {
        console.error("Error in POST /api/keys:", error);
        return serverErrorResponse("サーバーエラーが発生しました。");
    }
}));