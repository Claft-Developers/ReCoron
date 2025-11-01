import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// デバッグ: auth オブジェクトの確認
console.log("Auth handler initialized:", !!auth);
console.log("Available routes:", Object.keys(auth.api || {}));

export const { POST, GET } = toNextJsHandler(auth);
