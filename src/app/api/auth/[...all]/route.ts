import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// デバッグ: auth オブジェクトの確認

export const { POST, GET } = toNextJsHandler(auth);