import { headers } from "next/headers";
import { Plus, Clock } from "lucide-react";
import { JobTableRow } from "@/components/job/job-table-row";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function JobsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const jobs = await prisma.job.findMany({
        where: { userId: session!.user.id },
        include: {
            runningLogs: { 
                select: { id: true, successful: true },
            }
        },
        orderBy: { lastRunAt: "desc" },
    });


    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Cron Jobs</h1>
                            <p className="text-sm text-gray-400">
                                スケジュールされたタスクを管理
                            </p>
                        </div>
                        <Link href="/jobs/new">
                            <Button className="bg-white text-black hover:bg-gray-200">
                                <Plus className="w-4 h-4 mr-2" />
                                新しいジョブ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">総ジョブ数</div>
                            <div className="text-3xl font-bold">{jobs.length}</div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">有効なジョブ</div>
                            <div className="text-3xl font-bold">
                                {jobs.filter(j => j.enabled).length}
                            </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">総実行回数</div>
                            <div className="text-3xl font-bold">
                                {jobs.reduce((sum, j) => sum + j.runningLogs.length, 0)}
                            </div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">失敗回数</div>
                            <div className="text-3xl font-bold text-red-500">
                                {jobs.reduce((sum, j) => sum + j.runningLogs.filter(log => !log.successful).length, 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="px-8 py-6">
                <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-white/10">
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="px-6 py-4 font-medium">ステータス</th>
                                    <th className="px-6 py-4 font-medium">ジョブ名</th>
                                    <th className="px-6 py-4 font-medium">エンドポイント</th>
                                    <th className="px-6 py-4 font-medium">スケジュール</th>
                                    <th className="px-6 py-4 font-medium">実行回数</th>
                                    <th className="px-6 py-4 font-medium">次回実行</th>
                                    <th className="px-6 py-4 font-medium">アクション</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {jobs.map((job) => (
                                    <tr
                                        key={job.id}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {job.enabled ? (
                                                    <div className="flex items-center gap-2 text-green-500">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span className="text-sm">有効</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Pause className="w-4 h-4" />
                                                        <span className="text-sm">停止</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{job.name}</div>
                                            <div className="text-sm text-gray-400">
                                                {job.method}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-300 max-w-xs truncate">
                                                {job.url}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Clock className="w-4 h-4" />
                                                {job.schedule}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="text-gray-300">
                                                    {job.count} 回
                                                </div>
                                                {job.failureCount > 0 && (
                                                    <div className="flex items-center gap-1 text-red-500">
                                                        <XCircle className="w-3 h-3" />
                                                        {job.failureCount} 失敗
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-300">
                                                {formatDate(job.nextRunAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Pause className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))} */}
                                {jobs.map((job) => (
                                    <JobTableRow key={job.id} job={job} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {jobs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex h-16 w-16 rounded-full bg-white/5 items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            まだジョブがありません
                        </h3>
                        <p className="text-gray-400 mb-6">
                            最初のCron Jobを作成して、タスクを自動化しましょう
                        </p>
                        <Link href="/jobs/new">
                            <Button className="bg-white text-black hover:bg-gray-200">
                                <Plus className="w-4 h-4 mr-2" />
                                新しいジョブを作成
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

