import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { unauthorizedResponse } from "@/utils/response";

/**
 * 管理者認証ミドルウェア
 * X-Admin-Token ヘッダーをチェック
 */
export async function withAdminAuth<T>(
    req: NextRequest,
    handler: (req: NextRequest) => Promise<T>
): Promise<T | Response> {
    const adminToken = req.headers.get('X-Admin-Token');
    
    if (!adminToken || adminToken !== process.env.ADMIN_SECRET_TOKEN) {
        return unauthorizedResponse('管理者権限が必要です');
    }

    return handler(req);
}

/**
 * 管理者セッション認証（データベースベース）
 * ユーザーのisAdminフィールドをチェック
 */
export async function isAdmin(userId: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isAdmin: true },
        });
        return user?.isAdmin ?? false;
    } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
    }
}
