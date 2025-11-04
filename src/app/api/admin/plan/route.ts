import { NextRequest } from "next/server";
import { Plan } from "@prisma/client";
import {
    successResponse,
    validationErrorResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from "@/utils/response";
import {
    changeUserPlan,
    simulatePlanChange,
    getDisabledJobs,
    getDisabledApiKeys,
} from "@/utils/plan-management";

/**
 * 管理者用: ユーザーのプラン変更をシミュレート
 * GET /api/admin/plan?userId=xxx&plan=HOBBY
 * 
 * 注意: この実装では簡易的な認証チェックのみです。
 * 本番環境では適切な管理者認証を実装してください。
 */
export async function GET(req: NextRequest) {
    try {
        // TODO: 管理者認証チェックを実装
        const adminToken = req.headers.get('X-Admin-Token');
        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return unauthorizedResponse('管理者権限が必要です');
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const newPlan = searchParams.get('plan')?.toUpperCase() as Plan | null;

        if (!userId) {
            return validationErrorResponse('userIdを指定してください');
        }

        if (!newPlan || !['FREE', 'HOBBY', 'PRO'].includes(newPlan)) {
            return validationErrorResponse('有効なプランを指定してください: FREE, HOBBY, PRO');
        }

        const simulation = await simulatePlanChange(userId, newPlan);

        return successResponse(simulation, 'プラン変更のシミュレーション結果');
    } catch (error) {
        console.error("Error in GET /api/admin/plan:", error);
        return serverErrorResponse("シミュレーションに失敗しました");
    }
}

/**
 * 管理者用: ユーザーのプランを変更
 * POST /api/admin/plan
 * Headers: X-Admin-Token: xxx
 * Body: { userId: "xxx", plan: "HOBBY" }
 * 
 * 注意: この実装では簡易的な認証チェックのみです。
 * 本番環境では適切な管理者認証を実装してください。
 */
export async function POST(req: NextRequest) {
    try {
        // TODO: 管理者認証チェックを実装
        const adminToken = req.headers.get('X-Admin-Token');
        if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
            return unauthorizedResponse('管理者権限が必要です');
        }

        const body = await req.json();
        const { userId, plan: newPlan } = body;

        if (!userId) {
            return validationErrorResponse('userIdを指定してください');
        }

        if (!newPlan || !['FREE', 'HOBBY', 'PRO'].includes(newPlan.toUpperCase())) {
            return validationErrorResponse('有効なプランを指定してください: FREE, HOBBY, PRO');
        }

        const result = await changeUserPlan(userId, newPlan.toUpperCase() as Plan);

        if (!result.changed) {
            return successResponse(result, '既に指定されたプランです');
        }

        // 無効化されたリソースの情報を追加
        const [disabledJobs, disabledApiKeys] = await Promise.all([
            getDisabledJobs(userId),
            getDisabledApiKeys(userId),
        ]);

        return successResponse(
            {
                ...result,
                userId,
                disabledResources: {
                    jobs: disabledJobs,
                    apiKeys: disabledApiKeys,
                },
            },
            `ユーザー ${userId} のプランを ${result.oldPlan} から ${result.newPlan} に変更しました`
        );
    } catch (error) {
        console.error("Error in POST /api/admin/plan:", error);
        if (error instanceof Error && error.message === 'User not found') {
            return validationErrorResponse('ユーザーが見つかりません');
        }
        return serverErrorResponse("プラン変更に失敗しました");
    }
}
