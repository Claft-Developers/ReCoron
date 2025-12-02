"use client";
import { WebhookJobs, Job } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, CheckCircle2, XCircle, ExternalLink, ChevronLeft, ChevronRight, Edit, Eye } from "lucide-react";
import { formatDate } from "@/utils/date";

interface WebhookWithJob extends WebhookJobs {
    job: {
        id: string;
        name: string;
        enabled: boolean;
        url: string;
        method: string;
    };
}

interface Props {
    webhooks: WebhookWithJob[];
}

const ITEMS_PER_PAGE = 10;

export function WebhooksTable({ webhooks }: Props) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [showingSecret, setShowingSecret] = useState<string | null>(null);

    const totalPages = Math.ceil(webhooks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentWebhooks = webhooks.slice(startIndex, endIndex);

    const goToPage = ((page: number) => {
        setCurrentPage(page);
    });

    const toggleSecretVisibility = (webhookId: string) => {
        setShowingSecret(showingSecret === webhookId ? null : webhookId);
    };

    const handleDelete = (async (jobId: string) => {
        if (!confirm("本当にこのWebhookを削除しますか？この操作は取り消せません。")) {
            return;
        }

        const toastId = toast.loading("Webhookを削除中...");

        try {
            const response = await fetch(`/api/webhooks/${jobId}`, {
                method: "DELETE",
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Webhookの削除に失敗しました");
            }

            toast.success("Webhookを削除しました", { id: toastId });
            router.refresh();
        } catch (error: any) {
            console.error("Failed to delete webhook:", error);
            toast.error(error.message || "Webhookの削除に失敗しました", { id: toastId });
        }
    });

    const getHostname = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    return (
        <>
        <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                        <tr className="text-left text-sm text-gray-400">
                            <th className="px-6 py-4 font-medium">ジョブ名</th>
                            <th className="px-6 py-4 font-medium">エンドポイント</th>
                            <th className="px-6 py-4 font-medium">ジョブステータス</th>
                            <th className="px-6 py-4 font-medium">シークレット</th>
                            <th className="px-6 py-4 font-medium">作成日</th>
                            <th className="px-6 py-4 font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentWebhooks.map((webhook) => {
                            return (
                                <tr
                                    key={webhook.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                >
                                    {/* Job Name */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">
                                                {webhook.job.name}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">
                                                {webhook.job.method}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {webhook.job.url.length > 40 
                                                ? webhook.job.url.substring(0, 40) + '...' 
                                                : webhook.job.url}
                                        </div>
                                    </td>

                                    {/* Endpoint */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-300">
                                                {getHostname(webhook.endpoint)}
                                            </span>
                                            <a
                                                href={webhook.endpoint}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {webhook.endpoint.length > 40 
                                                ? webhook.endpoint.substring(0, 40) + '...' 
                                                : webhook.endpoint}
                                        </div>
                                    </td>

                                    {/* Job Status */}
                                    <td className="px-6 py-4">
                                        {webhook.job.enabled ? (
                                            <div className="flex items-center gap-2 text-green-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-sm">有効</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-400">
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-sm">無効</span>
                                            </div>
                                        )}
                                    </td>

                                    {/* Secret */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleSecretVisibility(webhook.id)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                                title={showingSecret === webhook.id ? "シークレットを隠す" : "シークレットを表示"}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {showingSecret === webhook.id && (
                                                <span className="text-xs font-mono text-gray-400">
                                                    {webhook.secret.substring(0, 16)}...
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Created At */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-400">
                                            {formatDate(webhook.createdAt)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(webhook.jobId)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                title="Webhookを削除"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                    <div className="text-sm text-gray-400">
                        {startIndex + 1} - {Math.min(endIndex, webhooks.length)} / {webhooks.length} 件
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="text-sm text-gray-400">
                            {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}
