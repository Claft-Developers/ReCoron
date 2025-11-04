type APIKeyScopes = "read:logs" | "write:logs" | "read:jobs" | "write:jobs" | "read:keys" | "write:keys";

interface APIKey {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    expiresAt: string | null;
    scopes: APIKeyScopes[];
}

// 新規作成時のレスポンス用（トークン文字列を含む）
interface APIKeyWithToken extends APIKey {
    token: string; // 実際のJWT文字列
}

// JWTペイロード用
interface APIKeyPayload {
    keyId: string; // APIKeyのid
    userId: string;
    scopes: APIKeyScopes[];
    iat?: number; // issued at
    exp?: number; // expiration time
}

export type { APIKey, APIKeyWithToken, APIKeyPayload, APIKeyScopes };