import { NextRequest } from "next/server";
import { withAuth } from "@/lib/middleware";
import { getAuth } from "@/lib/auth";
import { Plan } from "@prisma/client";
import {
    successResponse,
    validationErrorResponse,
    serverErrorResponse,
} from "@/utils/response";
import {
    changeUserPlan,
    simulatePlanChange,
    getDisabledJobs,
    getDisabledApiKeys,
} from "@/utils/plan-management";

/**
 * プラン変更をシミュレート
 * GET /api/plan/simulate?plan=HOBBY
 */
export const GET = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        const auth = getAuth(payload);
        const { searchParams } = new URL(req.url);
        const newPlan = searchParams.get('plan')?.toUpperCase() as Plan | null;

        if (!newPlan || !['FREE', 'HOBBY', 'PRO'].includes(newPlan)) {
            return validationErrorResponse('有効なプランを指定してください: FREE, HOBBY, PRO');
        }

        const simulation = await simulatePlanChange(auth.userId, newPlan);

        return successResponse(simulation, 'プラン変更のシミュレーション結果');
    } catch (error) {
        console.error("Error in GET /api/plan/simulate:", error);
        return serverErrorResponse("シミュレーションに失敗しました");
    }
}));

/**
 * プランを変更
 * POST /api/plan
 * Body: { plan: "HOBBY" }
 */
export const POST = ((req: NextRequest) => withAuth(req, async (req, payload) => {
    try {
        const auth = getAuth(payload);
        const body = await req.json();
        const newPlan = body.plan?.toUpperCase() as Plan | null;

        if (!newPlan || !['FREE', 'HOBBY', 'PRO'].includes(newPlan)) {
            return validationErrorResponse('有効なプランを指定してください: FREE, HOBBY, PRO');
        }

        const result = await changeUserPlan(auth.userId, newPlan);

        if (!result.changed) {
            return successResponse(result, '既に指定されたプランです');
        }

        // 無効化されたリソースの情報を追加
        const [disabledJobs, disabledApiKeys] = await Promise.all([
            getDisabledJobs(auth.userId),
            getDisabledApiKeys(auth.userId),
        ]);

        return successResponse(
            {
                ...result,
                disabledResources: {
                    jobs: disabledJobs,
                    apiKeys: disabledApiKeys,
                },
            },
            `プランを ${result.oldPlan} から ${result.newPlan} に変更しました`
        );
    } catch (error) {
        console.error("Error in POST /api/plan:", error);
        return serverErrorResponse("プラン変更に失敗しました");
    }
}));
