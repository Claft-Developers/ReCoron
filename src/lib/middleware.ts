import type { APIKeyPayload } from "@/types/key";
import type { Session } from "@/types/session";
import { NextRequest } from "next/server";
import { verifyJWT, hashToken } from "@/utils/token";
import { prisma } from "./prisma";
import { auth } from "./auth";
import { unauthorizedResponse } from "../utils/response";

// ハンドラー関数のオーバーロード定義
interface Context {
    params: Promise<{ [key: string]: string }>;
}

type AuthHandler = (
    req: NextRequest, 
    payload: Session | APIKeyPayload, 
    context?: Context
) => Promise<Response>;



export async function withAuth(req: NextRequest, handler: AuthHandler, context?: Context) {
    const authHeader = req.headers.get("Authorization");
    
    // Authorizationヘッダーの検証
    if (authHeader) {
        // Bearer形式のチェック
        if (!authHeader.startsWith("Bearer ")) {
            return unauthorizedResponse("Authorization ヘッダーは 'Bearer <token>' 形式である必要があります");
        }

        const token = authHeader.substring(7); // "Bearer "を削除

        // トークンの基本的な検証（空文字、長さチェック）
        if (!token || token.length < 10) {
            return unauthorizedResponse("無効なトークン形式です");
        }

        // JWT形式の簡易チェック（xxx.yyy.zzz）
        const parts = token.split('.');
        if (parts.length !== 3) {
            return unauthorizedResponse("無効なJWT形式です");
        }

        // トークンの検証
        const payload = await verifyJWT(token);
        if (!payload) {
            return unauthorizedResponse("無効または期限切れのトークンです");
        }

        // APIキーが存在するか確認
        const keyHash = await hashToken(token);
        const apiKey = await prisma.aPIKey.findUnique({
            where: { keyHash },
            select: { 
                id: true, 
                enabled: true, 
                userId: true,
                expiresAt: true,
                lastUsed: true,
            },
        });

        // APIキーの存在確認
        if (!apiKey) {
            return unauthorizedResponse("APIキーが見つかりません");
        }

        // 有効化状態の確認
        if (!apiKey.enabled) {
            return unauthorizedResponse("このAPIキーは無効化されています");
        }

        // 有効期限の確認
        if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
            return unauthorizedResponse("このAPIキーは期限切れです");
        }

        // 最終使用日時を更新（非同期で実行、レスポンスをブロックしない）
        // 頻繁な更新を避けるため、最終使用が1時間以上前の場合のみ更新
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (!apiKey.lastUsed || new Date(apiKey.lastUsed) < oneHourAgo) {
            prisma.aPIKey.update({
                where: { id: apiKey.id },
                data: { lastUsed: new Date() },
            }).catch(err => {
                console.error("Failed to update lastUsed:", err);
            });
        }

        return handler(req, payload, context);
    }
    
    // セッション認証にフォールバック
    const session = await auth.api.getSession({
        headers: req.headers,
    });
    
    if (session) {
        return handler(req, session, context);
    }
    
    return unauthorizedResponse("認証が必要です");
}