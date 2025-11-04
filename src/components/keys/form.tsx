"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Key } from "lucide-react";
import { CreatedKeyModal } from "@/components/modals/created-key-modal";

const AVAILABLE_SCOPES = [
    { id: "read:jobs", label: "ジョブ読み取り", description: "ジョブ情報の取得" },
    { id: "write:jobs", label: "ジョブ書き込み", description: "ジョブの作成・更新・削除・実行" },
    { id: "read:keys", label: "APIキー読み取り", description: "APIキー情報の取得" },
    { id: "write:keys", label: "APIキー書き込み", description: "APIキーの作成・削除" },
];

export function CreateAPIKeyForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);

    const toggleScope = (scopeId: string) => {
        setSelectedScopes(prev =>
            prev.includes(scopeId)
                ? prev.filter(s => s !== scopeId)
                : [...prev, scopeId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error("APIキー名を入力してください");
            return;
        }

        if (selectedScopes.length === 0) {
            toast.error("少なくとも1つのスコープを選択してください");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/keys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    scopes: selectedScopes,
                }),
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || "APIキーの作成に失敗しました");
            }

            setGeneratedToken(data.data.token);
            toast.success("APIキーを作成しました");
        } catch (error: any) {
            console.error("Failed to create API key:", error);
            toast.error(error.message || "APIキーの作成に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setGeneratedToken(null);
    };

    // モーダル表示中
    if (generatedToken) {
        return <CreatedKeyModal token={generatedToken} onClose={closeModal} />;
    }

    // フォーム表示
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* API Key Name */}
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    基本情報
                </h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                            APIキー名 <span className="text-red-400">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例: Production API Key"
                            className="bg-black/50 border-white/10"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            このAPIキーを識別するための名前を入力してください
                        </p>
                    </div>
                </div>
            </div>

            {/* Scopes */}
            <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">
                    アクセス権限 <span className="text-red-400">*</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                    このAPIキーに付与する権限を選択してください
                </p>
                <div className="space-y-3">
                    {AVAILABLE_SCOPES.map((scope) => (
                        <label
                            key={scope.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedScopes.includes(scope.id)
                                    ? "bg-blue-500/10 border-blue-500/50"
                                    : "bg-black/30 border-white/10 hover:border-white/20"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedScopes.includes(scope.id)}
                                onChange={() => toggleScope(scope.id)}
                                className="mt-1"
                            />
                            <div className="flex-1">
                                <div className="font-medium text-sm">{scope.label}</div>
                                <div className="text-xs text-gray-400 mt-1">{scope.description}</div>
                                <code className="text-xs text-purple-400 mt-1 inline-block">{scope.id}</code>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/keys")}
                    className="flex-1"
                    disabled={isLoading}
                >
                    キャンセル
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-white text-black hover:bg-gray-200"
                    disabled={isLoading || selectedScopes.length === 0}
                >
                    {isLoading ? (
                        <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            作成中...
                        </>
                    ) : (
                        "APIキーを作成"
                    )}
                </Button>
            </div>
        </form>
    );
}
