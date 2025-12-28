import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-middleware";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from "@/utils/response";
import { Plan } from "@prisma/client";

/**
 * 管理者用: システム統計情報を取得
 * GET /api/admin/stats
 */
export async function GET(req: NextRequest) {
    try {
        // セッション認証（管理者チェック）
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return unauthorizedResponse('認証が必要です');
        }

        const adminStatus = await isAdmin(session.user.id);
        if (!adminStatus) {
            return unauthorizedResponse('管理者権限が必要です');
        }

        // 統計情報を並列で取得
        const [
            totalUsers,
            totalJobs,
            totalApiKeys,
            totalExecutions,
            planCounts
        ] = await prisma.$transaction([
            prisma.user.count(),
            prisma.job.count(),
            prisma.aPIKey.count(),
            prisma.runningLog.count(),
            prisma.user.groupBy({
                by: ['plan'],
                _count: { _all: true },
                orderBy: { plan: 'asc' },
            })
        ]);

        // プラン分布を整形
        const planDistribution: Record<Plan, number> = {
            FREE: 0,
            HOBBY: 0,
            PRO: 0,
        };

        planCounts.forEach((item) => {
            if (item.plan) {
                const count =
                    typeof item._count === "object" && item._count !== null && typeof (item._count as any)._all === "number"
                        ? (item._count as { _all?: number })._all ?? 0
                        : 0;
                planDistribution[item.plan as Plan] = count;
            }
        });

        return successResponse({
            totalUsers,
            totalJobs,
            totalApiKeys,
            totalExecutions,
            planDistribution,
        });
    } catch (error) {
        console.error("Error in GET /api/admin/stats:", error);
        return serverErrorResponse("統計情報の取得に失敗しました");
    }
}
