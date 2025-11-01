"use client";
import type { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Play, Pause, Trash2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";



type JobTableRowProps = {
    job: Job;
};

export function JobTableRow({ job }: JobTableRowProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleEnabled = async () => {
        setIsToggling(true);
        const toastId = `toggle-job-${job.id}`;
        toast.loading("ジョブを更新しています...", { id: toastId });
        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: !job.enabled }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "ジョブの更新に失敗しました");
            }

            toast.success(job.enabled ? "ジョブを停止しました" : "ジョブを有効化しました", { id: toastId, description: undefined });
            router.refresh();
        } catch (error) {
            console.error("Failed to toggle job:", error);
            const message = error instanceof Error ? error.message : null;
            toast.error("ジョブの更新に失敗しました", { description: message, id: toastId });
        } finally {
            setIsToggling(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`ジョブ "${job.name}" を削除してもよろしいですか？`)) {
            return;
        }

        setIsDeleting(true);
        const toastId = `delete-job-${job.id}`;
        toast.loading("ジョブを削除しています...", { id: toastId });
        try {
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "ジョブの削除に失敗しました");
            }

            toast.success("ジョブを削除しました", { id: toastId, description: undefined });
            router.refresh();
        } catch (error) {
            console.error("Failed to delete job:", error);
            const message = error instanceof Error ? error.message : null;
            toast.error("ジョブの削除に失敗しました", { description: message, id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRunNow = async () => {
        const toastId = `run-job-${job.id}`;
        toast.loading("ジョブを実行しています...", { id: toastId });
        try {
            const response = await fetch(`/api/jobs/${job.id}/run`, {
                method: "POST",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "ジョブの実行に失敗しました");
            }

            toast.success("ジョブを実行しました", { id: toastId, description: undefined });
            router.refresh();
        } catch (error) {
            console.error("Failed to run job:", error);
            const message = error instanceof Error ? error.message : null;
            toast.error("ジョブの実行に失敗しました", { description: message, id: toastId });
        }
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
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
                <div className="text-sm text-gray-400">{job.method}</div>
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
                    <div className="text-gray-300">{job.count} 回</div>
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
                        onClick={handleRunNow}
                        title="今すぐ実行"
                    >
                        <Play className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={handleToggleEnabled}
                        disabled={isToggling}
                        title={job.enabled ? "停止" : "有効化"}
                    >
                        {job.enabled ? (
                            <Pause className="w-4 h-4" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="削除"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
