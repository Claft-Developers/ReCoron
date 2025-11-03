import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import {
    successResponse,
    serverErrorResponse,
    notFoundResponse,
} from "@/utils/response";

interface Context {
    params: Promise<{ [key: string]: string }>;
}

export const POST = ((req: NextRequest, context: Context) => withAuth(req, async (req, type, payload, context) => {
    try {
        const { jobId } = await context!.params;
        const userId = type === "session"
            ? payload.user.id
            : (payload as Record<string, any>).userId as string;
        const job = await prisma.job.findUnique({
            where: { id: jobId, userId },
        });
        if (!job) {
            return notFoundResponse("ジョブが見つかりません");
        }
        const uri = job.url;
        const headers = (job.headers || {}) as Record<string, string>;
        const body = job.body || undefined;

        const response = await fetch(uri, {
            method: job.method,
            headers,
            body,
        });
        const responseBody = await response.text();
        const status = response.status;
        const responseHeaders = Object.fromEntries(response.headers.entries());
        const responseData = {
            status,
            headers: responseHeaders,
            body: responseBody,
            ok: response.ok,
        };

        return successResponse({
            response: responseData,
            job,
        });
    } catch (error) {
        console.error("Failed to get job:", error);
        return serverErrorResponse();
    }
}, context));