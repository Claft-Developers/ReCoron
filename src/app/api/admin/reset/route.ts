import { NextRequest } from "next/server";
import { resetMonthlyJobCounts } from "@/utils/limits";
import {
    successResponse,
    unauthorizedResponse
} from "@/utils/response";

const TOKEN = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (token !== TOKEN) {
        return unauthorizedResponse("Invalid admin token");
    }

    // 月次リセット処理
    await resetMonthlyJobCounts();

    return successResponse(null, "Monthly job counts reset");
}

