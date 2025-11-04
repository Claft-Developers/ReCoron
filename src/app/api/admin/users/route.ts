import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-middleware";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from "@/utils/response";

/**
 * 管理者用: ユーザー一覧を取得
 * GET /api/admin/users
 */
export async function GET(req: NextRequest) {
    try {
        // セッション認証（管理者チェック）
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return unauthorizedResponse('認証が必要です');
        }

        const adminStatus = await isAdmin(session.user.id);
        if (!adminStatus) {
            return unauthorizedResponse('管理者権限が必要です');
        }

        // ユーザー一覧を取得
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                plan: true,
                isAdmin: true,
                createdAt: true,
                _count: {
                    select: {
                        jobs: true,
                        apiKeys: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return successResponse(users);
    } catch (error) {
        console.error("Error in GET /api/admin/users:", error);
        return serverErrorResponse("ユーザー一覧の取得に失敗しました");
    }
}
