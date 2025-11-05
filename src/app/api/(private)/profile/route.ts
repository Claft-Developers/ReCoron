import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from "@/utils/response";

/**
 * ユーザープロフィール取得
 * GET /api/user/profile
 */
export async function GET(req: NextRequest) {
    try {
        // セッション認証
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return unauthorizedResponse('認証が必要です');
        }

        // ユーザー情報を取得
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                plan: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return unauthorizedResponse('ユーザーが見つかりません');
        }

        return successResponse(user);
    } catch (error) {
        console.error("Error in GET /api/user/profile:", error);
        return serverErrorResponse("プロフィールの取得に失敗しました");
    }
}
