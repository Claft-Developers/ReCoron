import type { APIKeyPayload } from "@/types/key";
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

// JWT秘密鍵の検証
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
}

const secret = new TextEncoder().encode(JWT_SECRET);

// 署名用のJWT発行（有効期限を設定可能に）
async function signJWT(
    payload: APIKeyPayload, 
    expiresAt?: string | Date | null
): Promise<string> {
    const jwt = new SignJWT(payload as unknown as JWTPayload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setJti(crypto.randomUUID()); // JWT ID (一意性を持たせる)

    // 有効期限の設定
    if (expiresAt) {
        if (typeof expiresAt === "string") {
            jwt.setExpirationTime(expiresAt);
        } else {
            jwt.setExpirationTime(Math.floor(expiresAt.getTime() / 1000));
        }
    } else {
        // デフォルトで1年の有効期限
        jwt.setExpirationTime("1y");
    }

    return await jwt.sign(secret);
}

// JWT検証（有効期限、署名、構造をチェック）
async function verifyJWT(token: string): Promise<APIKeyPayload | null> {
    try {
        const { payload } = await jwtVerify<APIKeyPayload>(token, secret, {
            algorithms: ["HS256"],
            // クロックトレランス: 時刻のずれを許容（秒単位）
            clockTolerance: 10,
        });

        // 必須フィールドの検証
        if (!payload.keyId || !payload.userId || !payload.scopes) {
            console.error("JWT payload missing required fields");
            return null;
        }

        // スコープが配列であることを確認
        if (!Array.isArray(payload.scopes) || payload.scopes.length === 0) {
            console.error("JWT payload has invalid scopes");
            return null;
        }

        return payload as APIKeyPayload;
    } catch (e) {
        console.error("JWT verification failed:", e);
        return null;
    }
}

// 暗号学的に安全なランダムキー生成
function generateRandomKey(length: number = 32): string {
    // より安全な文字セット（base62）
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    // バイアスを最小化するため、モジュロ演算ではなく範囲内の値のみを使用
    let result = '';
    for (let i = 0; i < array.length; i++) {
        // 256 / 62 = 4.12... なので、248までの値のみを使用（62 * 4 = 248）
        // これにより、バイアスが大幅に減少
        if (array[i] < 248) {
            result += chars[array[i] % chars.length];
        } else {
            // 範囲外の値が出た場合は再生成
            const newArray = new Uint8Array(1);
            crypto.getRandomValues(newArray);
            array[i] = newArray[0];
            i--; // もう一度同じインデックスを処理
        }
    }
    
    return result;
}

// トークンハッシュ生成（DBに保存用）
async function hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export { signJWT, verifyJWT, generateRandomKey, hashToken };