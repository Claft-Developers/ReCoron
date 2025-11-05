import { APIKeyPayload } from "@/types/key";
import { type NextRequest } from "next/server";
import { executeCronJob } from "@/lib/job";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import {
    successResponse,
    serverErrorResponse,
    notFoundResponse,
    unauthorizedResponse,
} from "@/utils/response";
import { getAuth } from "@/lib/auth";

interface Context {
    params: Promise<{ [key: string]: string }>;
}

export const POST = ((req: NextRequest, context: Context) => withAuth(req, async (req, payload, context) => {
    try {
        const { jobId } = await context!.params;
        const auth = getAuth(payload);

        if (auth.type === "apiKey") {
            const scopes = (auth.payload as APIKeyPayload).scopes;
            if (!scopes.includes("write:jobs")) {
                return unauthorizedResponse("このAPIキーにはジョブ実行の権限がありません");
            }
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId, userId: auth.userId },
        });
        if (!job) {
            return notFoundResponse("ジョブが見つかりません");
        }
        const result = await executeCronJob(job, "MANUAL");

        return successResponse({
            job,
            result,
        });
    } catch (error) {
        console.error("Failed to get job:", error);
        return serverErrorResponse();
    }
}, context));