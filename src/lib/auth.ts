import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

console.log("Auth config:", {
    hasDatabase: !!prisma,
    baseURL: process.env.BETTER_AUTH_URL,
    hasSecret: !!process.env.BETTER_AUTH_SECRET,
    githubClientId: !!process.env.GITHUB_CLIENT_ID,
    googleClientId: !!process.env.GOOGLE_CLIENT_ID,
});

export const auth = betterAuth({
    // DB アダプタ（Prisma）
    database: prismaAdapter(prisma, { provider: "postgresql" }),

    // ソーシャル（GitHub）プロバイダ
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }
    },

    // Email/Password を併用したい場合
    emailAndPassword: { 
        enabled: true,
        requireEmailVerification: false, // 本番環境では true にすることを推奨
    },

    // Next.js の Cookie・URL 検知など
    plugins: [nextCookies()],

    // ベースURL（Edge やプロキシ配下で不正検知が出る場合は明示）
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-key-for-development-only",
});