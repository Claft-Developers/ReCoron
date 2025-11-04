"use client";
import { APIKey } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Trash2, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Edit, X } from "lucide-react";
import { formatDate } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface Props {
    apiKeys: APIKey[];
}

const ITEMS_PER_PAGE = 10;

export function APIKeysTable({ apiKeys }: Props) {
    const router = useRouter();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingKey, setEditingKey] = useState<APIKey | null>(null);
    const [editName, setEditName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

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

    const openEditModal = (key: APIKey) => {
        setEditingKey(key);
        setEditName(key.name);
    };

    const closeEditModal = () => {
        setEditingKey(null);
        setEditName("");
        setIsUpdating(false);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingKey || !editName.trim()) {
            toast.error("APIキー名を入力してください");
            return;
        }

        if (editName === editingKey.name) {
            toast.info("変更がありません");
            closeEditModal();
            return;
        }

        setIsUpdating(true);

        try {
            const response = await fetch(`/api/keys/${editingKey.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editName.trim(),
                    scopes: editingKey.scopes,
                }),
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || "APIキーの更新に失敗しました");
            }

            toast.success("APIキーを更新しました");
            closeEditModal();
            router.refresh();
        } catch (error: any) {
            console.error("Failed to update API key:", error);
            toast.error(error.message || "APIキーの更新に失敗しました");
        } finally {
            setIsUpdating(false);
        }
    };

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
        <>
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
                                                onClick={() => openEditModal(key)}
                                                className="p-2 rounded hover:bg-white/5 transition-colors"
                                                title="編集"
                                            >
                                                <Edit className="w-4 h-4 text-blue-400" />
                                            </button>
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

        {/* 編集モーダル */}
        {editingKey && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className="bg-black border border-white/20 rounded-xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                <Edit className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">APIキー名を編集</h2>
                                <p className="text-xs text-gray-400">ID: {editingKey.id.slice(0, 12)}...</p>
                            </div>
                        </div>
                        <button
                            onClick={closeEditModal}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                            disabled={isUpdating}
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleUpdate} className="p-6 space-y-4">
                        <div>
                            <Label htmlFor="edit-name" className="text-sm font-medium mb-2 block text-gray-300">
                                APIキー名 <span className="text-red-400">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="例: Production API Key"
                                className="bg-black/50 border-white/10"
                                required
                                disabled={isUpdating}
                                autoFocus
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                ℹ️ セキュリティ上の理由により、スコープの変更はできません
                            </p>
                        </div>

                        {/* 現在のスコープ表示 */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <p className="text-xs text-gray-400 mb-2">現在のスコープ:</p>
                            <div className="flex flex-wrap gap-2">
                                {editingKey.scopes.map((scope) => (
                                    <span
                                        key={scope}
                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    >
                                        {scope}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeEditModal}
                                className="flex-1"
                                disabled={isUpdating}
                            >
                                キャンセル
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-white text-black hover:bg-gray-200"
                                disabled={isUpdating || !editName.trim() || editName === editingKey.name}
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        更新中...
                                    </>
                                ) : (
                                    "更新"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
    );
}