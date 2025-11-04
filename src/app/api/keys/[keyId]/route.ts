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

interface Context {
    params: Promise<{ [jobId: string]: string }>;
}

export const GET = ((req: NextRequest, context: Context) => withAuth(req, async (req, payload, context) => {
    try {
        const { keyId } = await context!.params;
        const auth = getAuth(payload);
        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("read:keys")) {
                return unauthorizedResponse("このAPIキーにはキー読み取りの権限がありません");
            }
        }
        const key = await prisma.aPIKey.findUnique({
            where: { id: keyId, userId: auth.userId },
        });
        if (key) {
            return successResponse(key);
        }
        return notFoundResponse("APIキーが見つかりません");
    } catch (error) {
        console.error("Failed to get API key:", error);
        return serverErrorResponse();
    }
}, context));

export const DELETE = ((req: NextRequest, context: Context) => withAuth(req, async (req, payload, context) => {
    try {
        const { keyId } = await context!.params;
        const auth = getAuth(payload);
        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("write:keys")) {
                return unauthorizedResponse("このAPIキーにはキー削除の権限がありません");
            }
        }
        await prisma.aPIKey.deleteMany({
            where: { id: keyId, user: { id: auth.userId } },
        });
        return successResponse({ message: "APIキーが削除されました" });
    } catch (error) {
        console.error("Failed to delete API key:", error);
        return serverErrorResponse();
    }
}, context));
