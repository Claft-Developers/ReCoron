import { NextRequest } from "next/server";
import { PRICING_TIERS } from "@/constants/plan";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    unauthorizedResponse
} from "@/utils/response";
import { Plan } from "@prisma/client";

const TOKEN = process.env.CRON_SECRET;
const PLAN_RESET_MAP: { [key: string]: Plan } = {
    daily: "FREE",
    weekly: "HOBBY",
    monthly: "PRO",
};

export async function DELETE(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (token !== TOKEN) {
        return unauthorizedResponse("Invalid admin token");
    }
    const type = req.nextUrl.searchParams.get("type") as "daily" | "weekly" | "monthly";

    // 月次リセット処理
    const planName = PLAN_RESET_MAP[type];
    const planInfo = PRICING_TIERS.find((tier) => tier.id.toUpperCase() === planName)!;
    const users = await prisma.user.findMany({
        where: {
            plan: planName
        },
        select: { id: true, plan: true, logs: true },
    });

    // これはログを消すプログラム
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - planInfo.limit.maxLogsDays);

    const resetPromises = users.map((user) => {
        return prisma.runningLog.deleteMany({
            where: { userId: user.id, createdAt: { lte: cutoffDate } }
        });
    });
    await Promise.all(resetPromises);

    return successResponse(null, "Monthly job counts reset");
}