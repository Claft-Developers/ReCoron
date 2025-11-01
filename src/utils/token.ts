import { JWK, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key");

async function signJWT(payload: Record<string, any>): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secret);
}

async function verifyJWT(token: string): Promise<Record<string, any> | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as Record<string, any>;
    } catch (e) {
        console.error("JWT verification failed:", e);
        return null;
    }
}

export { signJWT, verifyJWT };