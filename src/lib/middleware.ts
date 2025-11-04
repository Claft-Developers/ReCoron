import type { APIKeyPayload } from "@/types/key";
import type { Session } from "@/types/session";
import { NextRequest } from "next/server";
import { verifyJWT } from "@/utils/token";
import { auth } from "./auth";
import { unauthorizedResponse } from "../utils/response";

// ハンドラー関数のオーバーロード定義
interface Context {
    params: Promise<{ [key: string]: string }>;
}

type AuthHandler = {
    (req: NextRequest, type: "session", payload: Session, context?: Context): Promise<Response>;
    (req: NextRequest, type: "token", payload: APIKeyPayload, context?: Context): Promise<Response>;
};



export async function withAuth(req: NextRequest, handler: AuthHandler, context?: Context) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        if (session) {
            return handler(req, "session", session, context);
        }
        return unauthorizedResponse();
    }
    
    // トークンの検証
    const payload = await verifyJWT(token);
    if (!payload) {
        return unauthorizedResponse("無効なトークンです");
    }
    
    return handler(req, "token", payload, context);
}