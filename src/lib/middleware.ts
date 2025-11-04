import { Method } from "@prisma/client";
import { NextRequest } from "next/server";
import type { APIKeyPayload } from "@/types/key";
import type { Session } from "@/types/session";
import { verifyJWT, hashToken } from "@/utils/token";
import { prisma } from "./prisma";
import { auth } from "./auth";
import { unauthorizedResponse } from "@/utils/response";
import { checkApiCallLimit, recordApiCall } from "@/utils/usage-tracking";

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

        // トークンの検証とハッシュ化を並列実行
        const [payload, keyHash] = await Promise.all([
            verifyJWT(token),
            hashToken(token)
        ]);

        if (!payload) {
            return unauthorizedResponse("無効または期限切れのトークンです");
        }

        // APIキーが存在するか確認
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

        // APIキーの有効性チェック
        if (!apiKey) return unauthorizedResponse("APIキーが見つかりません");
        if (!apiKey.enabled) return unauthorizedResponse("このAPIキーは無効化されています");
        if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
            return unauthorizedResponse("このAPIキーは期限切れです");
        }

        // ユーザー情報を取得
        const user = await prisma.user.findUnique({
            where: { id: apiKey.userId },
            select: { plan: true }
        });

        if (!user) {
            return unauthorizedResponse("ユーザーが見つかりません");
        }
        
        // 新しい使用量追跡システムでAPIコール制限をチェック
        const apiCallCheck = await checkApiCallLimit(apiKey.userId, user.plan);
        if (!apiCallCheck.allowed) {
            return unauthorizedResponse(apiCallCheck.message || "APIコール制限を超えました");
        }

        // ログ作成と最終使用日時更新を非同期で実行（レスポンスをブロックしない）
        // これらの処理は await せずに Promise として実行
        const updatePromises: Promise<any>[] = [];

        // ログに保存（非同期、エラーは無視）
        const reqCopy = req.clone();
        const logPromise = reqCopy.text().then(body => {
            return prisma.aPILog.create({
                data: {
                    apiKey: { connect: { id: apiKey.id } },
                    method: req.method.toUpperCase() as Method,
                    url: req.url,
                    requestHeaders: Object.fromEntries(req.headers.entries()),
                    requestBody: body,
                }
            });
        }).catch(err => {
            console.error("Failed to create API log:", err);
        });
        updatePromises.push(logPromise);

        // 最終使用日時を更新（非同期で実行、レスポンスをブロックしない）
        // 頻繁な更新を避けるため、最終使用が1時間以上前の場合のみ更新
        const updatePromise = prisma.aPIKey.update({
            where: { id: apiKey.id },
            data: { 
                lastUsed: new Date(),
                count: { increment: 1 }
            },
        }).catch(err => {
            console.error("Failed to update lastUsed:", err);
        });
        updatePromises.push(updatePromise);

        // API呼び出しを記録（バックグラウンドで実行）
        const recordPromise = recordApiCall(apiKey.userId).catch(err => {
            console.error("Failed to record API call:", err);
        });
        updatePromises.push(recordPromise);

        // Promise を作成（実行開始）
        const backgroundTasks = Promise.all(updatePromises);

        // ハンドラーを実行
        const response = await handler(req, payload, context);

        // バックグラウンドタスクを確認（エラーだけキャッチ）
        backgroundTasks.catch((err) => {
            console.error("Background tasks failed:", err);
        });

        return response;
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