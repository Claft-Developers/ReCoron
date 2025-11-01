import type { Session } from "@/types/session";
import { NextRequest } from "next/server";
import { verifyJWT } from "@/utils/token";
import { auth } from "./auth";
import { unauthorizedResponse } from "../utils/response";

// ハンドラー関数のオーバーロード定義
type AuthHandler = {
    (req: NextRequest, type: "session", payload: Session): Promise<Response>;
    (req: NextRequest, type: "token", payload: Record<string, any>): Promise<Response>;
};

export async function withAuth(req: NextRequest, handler: AuthHandler) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        if (session) {
            return handler(req, "session", session);
        }
        return unauthorizedResponse();
    }
    
    // トークンの検証
    const payload = await verifyJWT(token);
    if (!payload) {
        return unauthorizedResponse("無効なトークンです");
    }
    
    return handler(req, "token", payload);
}