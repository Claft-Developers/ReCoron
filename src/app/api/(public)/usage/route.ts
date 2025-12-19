import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import {
    successResponse,
    serverErrorResponse,
} from "@/utils/response";

/**
 * ユーザーの使用量統計を取得するエンドポイント
 * GET /api/usage
 */
export const GET = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        const auth = getAuth(payload);
        const userId = auth.userId;

        // 現在の年月
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // 今日の日付
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 並列でデータを取得
        const [todayHistory, [
            monthlyUsage,
            dailyUsage,
            currentJobs,
            currentApiKeys,
        ]] = await Promise.all([
            // 今日のリソース履歴
            prisma.resourceHistory.groupBy({
                by: ['resourceType', 'action'],
                where: {
                    userId,
                    createdAt: {
                        gte: today,
                    },
                },
                _count: true,
            }),
            prisma.$transaction([
                // 今月の使用量
                prisma.monthlyUsage.findUnique({
                    where: {
                        userId_year_month: { userId, year, month },
                    },
                }),
                // 今日の使用量
                prisma.dailyUsage.findUnique({
                    where: {
                        userId_date: { userId, date: today },
                    },
                }),
                // 現在のジョブ数
                prisma.job.count({
                    where: { userId },
                }),
                // 現在のAPIキー数
                prisma.aPIKey.count({
                    where: { userId },
                }),
            ])
        ]);

        // リソース履歴を整形
        const todayResourceActivity = {
            jobsCreated: 0,
            jobsDeleted: 0,
            apiKeysCreated: 0,
            apiKeysDeleted: 0,
        };

        todayHistory.forEach((item) => {
            const key = `${item.resourceType.toLowerCase()}s${item.action === 'CREATED' ? 'Created' : 'Deleted'}` as keyof typeof todayResourceActivity;
            todayResourceActivity[key] = item._count;
        });

        return successResponse({
            current: {
                jobs: currentJobs,
                apiKeys: currentApiKeys,
            },
            monthly: {
                year,
                month,
                executions: monthlyUsage?.totalExecutions || 0,
                apiCalls: monthlyUsage?.totalApiCalls || 0,
                billedAmount: monthlyUsage?.billedAmount || 0,
                paid: monthlyUsage?.paid || false,
            },
            daily: {
                date: today,
                executions: dailyUsage?.executions || 0,
                apiCalls: dailyUsage?.apiCalls || 0,
                peakJobCount: dailyUsage?.peakJobCount || 0,
                peakApiKeyCount: dailyUsage?.peakApiKeyCount || 0,
            },
            todayActivity: todayResourceActivity,
        });
    } catch (error) {
        console.error("Error in GET /api/usage:", error);
        return serverErrorResponse("使用量の取得に失敗しました");
    }
}));
