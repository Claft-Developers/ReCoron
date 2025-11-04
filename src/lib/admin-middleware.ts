import { NextRequest } from "next/server";
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
 * 管理者セッション認証（Cookie ベース）
 * 将来的に管理者ダッシュボードUIで使用
 */
export function isAdmin(email: string): boolean {
    // 環境変数から管理者メールアドレスのリストを取得
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
    return adminEmails.includes(email);
}
