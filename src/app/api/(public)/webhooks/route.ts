import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { getAuth } from "@/lib/auth";
import {
    successResponse,
    serverErrorResponse,
    createdResponse
} from "@/utils/response";


export const GET = (async (req: NextRequest) => withAuth(req, async (req, payload) => {
    const auth = getAuth(payload);
    try {
        
}));

export const POST = (async (req: NextRequest) => withAuth(req, async (req, payload) => {
    const auth = getAuth(payload);

    try {

    } catch (error) {
        console.error("Error in POST /api/webhooks:", error);
        return serverErrorResponse("Webhookの作成に失敗しました");
    }

    return createdResponse("Webhookが作成されました");
}));