type APIKeyScopes = "read:logs" | "write:logs" | "read:jobs" | "write:jobs" | "read:keys" | "write:keys";

// JWTペイロード用
interface APIKeyPayload {
    keyId: string; // APIKeyのid
    userId: string;
    scopes: APIKeyScopes[];
    
    iat?: number; // issued at
    exp?: number; // expiration time
    jti?: string; // JWT ID（一意性を持たせる）
}

export type { APIKeyPayload, APIKeyScopes };