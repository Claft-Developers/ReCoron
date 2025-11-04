"use client";
import { APIKey } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Trash2, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/date";


interface Props {
    apiKeys: APIKey[];
}

const ITEMS_PER_PAGE = 10;

export function APIKeysTable({ apiKeys }: Props) {
    const router = useRouter();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(apiKeys.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentKeys = apiKeys.slice(startIndex, endIndex);

    const copyToClipboard = ((text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    });

    const isExpired = ((expiresAt: Date | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    });

    const goToPage = ((page: number) => {
        setCurrentPage(page);
    });

    const handleDelete = (async (keyId: string) => {
        if (!confirm("本当にこのAPIキーを削除しますか？この操作は取り消せません。")) {
            return;
        }

        const toastId = toast.loading("APIキーを削除中...");

        try {
            const response = await fetch(`/api/keys/${keyId}`, {
                method: "DELETE",
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || "APIキーの削除に失敗しました");
            }

            toast.success("APIキーを削除しました", { id: toastId });
            router.refresh();
        } catch (error: any) {
            console.error("Failed to delete API key:", error);
            toast.error(error.message || "APIキーの削除に失敗しました", { id: toastId });
        }
    });

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                        <tr className="text-left text-sm text-gray-400">
                            <th className="px-6 py-4 font-medium">名前</th>
                            <th className="px-6 py-4 font-medium">スコープ</th>
                            <th className="px-6 py-4 font-medium">ステータス</th>
                            <th className="px-6 py-4 font-medium">作成日</th>
                            <th className="px-6 py-4 font-medium">有効期限</th>
                            <th className="px-6 py-4 font-medium">最終使用</th>
                            <th className="px-6 py-4 font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentKeys.map((key) => {
                            const expired = isExpired(key.expiresAt);
                            return (
                                <tr
                                    key={key.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-200">{key.name}</div>
                                                <div className="text-xs text-gray-500">ID: {key.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {key.scopes.map((scope) => (
                                                <span
                                                    key={scope}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                >
                                                    {scope}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {expired ? (
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                <XCircle className="w-3 h-3" />
                                                期限切れ
                                            </div>
                                        ) : key.enabled ? (
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                <CheckCircle2 className="w-3 h-3" />
                                                有効
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                                <XCircle className="w-3 h-3" />
                                                無効
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-300">
                                            {formatDate(key.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {key.expiresAt ? (
                                                <>
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className={`text-sm ${expired ? "text-red-400" : "text-gray-300"}`}>
                                                        {formatDate(key.expiresAt)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-500">なし</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-300">
                                            {key.lastUsed ? formatDate(key.lastUsed) : "未使用"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(key.id, key.id)}
                                                className="p-2 rounded hover:bg-white/5 transition-colors"
                                                title="IDをコピー" >
                                                {copiedId === key.id ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(key.id)}
                                                className="p-2 rounded hover:bg-white/5 transition-colors text-red-400"
                                                title="削除"
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

            {/* ページネーション */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                    <div className="text-sm text-gray-400">
                        全 {apiKeys.length} 件中 {startIndex + 1} - {Math.min(endIndex, apiKeys.length)} 件を表示
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // 最初の2ページ、最後の2ページ、現在のページ周辺2ページを表示
                                const showPage = 
                                    page <= 2 || 
                                    page > totalPages - 2 || 
                                    (page >= currentPage - 1 && page <= currentPage + 1);
                                
                                const showEllipsis = 
                                    (page === 3 && currentPage > 4) || 
                                    (page === totalPages - 2 && currentPage < totalPages - 3);

                                if (showEllipsis) {
                                    return (
                                        <span key={page} className="px-2 text-gray-500">
                                            ...
                                        </span>
                                    );
                                }

                                if (!showPage) return null;

                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`min-w-[2rem] h-8 px-3 rounded text-sm transition-colors ${
                                            currentPage === page
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-white/5 text-gray-300"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}