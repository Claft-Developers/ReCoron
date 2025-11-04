import { headers } from "next/headers";
import { ArrowLeft, Activity } from "lucide-react";
import { LogsTable } from "@/components/job/log-table";
import { LogFilter } from "@/components/job/log-filter";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface Context {
    searchParams: Promise<{
        jobId?: string;
        type?: "auto" | "manual";
    }>;
}

export default async function CronLogsPage(context: Context) {
    const [session, params] = await Promise.all([
        auth.api.getSession({
            headers: await headers(),
        }),
        context.searchParams,
    ]);
    const jobId = params.jobId;
    const userId = session!.user.id;
    const type = params.type;

    const [job, logs, allJobs] = await Promise.all([
        jobId ? prisma.job.findUnique({
            where: {
                id: jobId ? jobId : undefined,
                userId: userId,
            }
        }) : Promise.resolve(null),

        prisma.runningLog.findMany({
            where: {
                ...(jobId && { jobId: jobId }),  // jobIdがある場合のみ追加
                user: { id: userId },
                ...(type && { type: type.toUpperCase() as "AUTO" | "MANUAL" }), // typeがある場合のみ追加
            },
            include: {
                job: {
                    select: {
                        name: true,
                        url: true,
                        method: true,
                    },
                },
            },
            orderBy: { finishedAt: "desc" },
            take: 100, // 最新100件まで
        }),

        prisma.job.findMany({
            where: { userId: userId },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        })
    ]);
    console.log("logs:", logs);

    // 統計情報の計算
    const totalLogs = logs.length;
    const successfulLogs = logs.filter((log) => log.successful).length;
    const failedLogs = totalLogs - successfulLogs;
    const avgDuration =
        totalLogs > 0
            ? Math.round(logs.reduce((sum, log) => sum + log.durationMs, 0) / totalLogs)
            : 0;
    const successRate = totalLogs > 0 ? ((successfulLogs / totalLogs) * 100).toFixed(1) : "0.0";

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/jobs">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        戻る
                                    </Button>
                                </Link>
                            </div>
                            <h1 className="text-2xl font-bold mb-1">
                                {job ? `${job.name} - 実行ログ` : "実行ログ"}
                            </h1>
                            <p className="text-sm text-gray-400">
                                {job
                                    ? `${job.method} ${job.url}`
                                    : "すべてのジョブの実行履歴を表示"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">総実行回数</div>
                            <div className="text-3xl font-bold">{totalLogs}</div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">成功</div>
                            <div className="text-3xl font-bold text-green-400">{successfulLogs}</div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">失敗</div>
                            <div className="text-3xl font-bold text-red-500">{failedLogs}</div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">平均実行時間</div>
                            <div className="text-3xl font-bold">{avgDuration}ms</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="px-8 py-6 border-b border-white/10">
                <LogFilter jobs={allJobs} />
            </div>

            {/* Logs Table */}
            <div className="px-8 py-6">
                {logs.length === 0 ? (
                    <div className="bg-white/[0.02] border border-white/10 rounded-lg p-12 text-center">
                        <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">実行ログがありません</h3>
                        <p className="text-gray-400">
                            ジョブが実行されると、ここにログが表示されます。
                        </p>
                    </div>
                ) : (
                    <LogsTable logs={logs} showJobName={!jobId} />
                )}
            </div>
        </div>
    );
}