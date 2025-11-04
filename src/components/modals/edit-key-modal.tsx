"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APIKey } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, X } from "lucide-react";

interface Props {
    apiKey: APIKey;
    onClose: () => void;
}

export function EditKeyModal({ apiKey, onClose }: Props) {
    const router = useRouter();
    const [editName, setEditName] = useState(apiKey.name);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editName.trim()) {
            toast.error("APIキー名を入力してください");
            return;
        }

        if (editName === apiKey.name) {
            toast.info("変更がありません");
            onClose();
            return;
        }

        setIsUpdating(true);

        try {
            const response = await fetch(`/api/keys/${apiKey.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editName.trim(),
                    scopes: apiKey.scopes,
                }),
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || "APIキーの更新に失敗しました");
            }

            toast.success("APIキーを更新しました");
            onClose();
            router.refresh();
        } catch (error: any) {
            console.error("Failed to update API key:", error);
            toast.error(error.message || "APIキーの更新に失敗しました");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
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
                            <p className="text-xs text-gray-400">ID: {apiKey.id.slice(0, 12)}...</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        disabled={isUpdating}
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                            {apiKey.scopes.map((scope) => (
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
                            onClick={onClose}
                            className="flex-1"
                            disabled={isUpdating}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-white text-black hover:bg-gray-200"
                            disabled={isUpdating || !editName.trim() || editName === apiKey.name}
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
    );
}
