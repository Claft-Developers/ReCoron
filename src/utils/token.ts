import type { APIKeyPayload } from "@/types/key";
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key");

async function signJWT(payload: APIKeyPayload): Promise<string> {
    return await new SignJWT(payload as unknown as JWTPayload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secret);
}

async function verifyJWT(token: string): Promise<APIKeyPayload | null> {
    try {
        const { payload } = await jwtVerify<APIKeyPayload>(token, secret);
        return payload as APIKeyPayload;
    } catch (e) {
        console.error("JWT verification failed:", e);
        return null;
    }
}

export { signJWT, verifyJWT };