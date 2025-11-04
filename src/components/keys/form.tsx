"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2, Key, AlertCircle } from "lucide-react";

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
    const [copied, setCopied] = useState(false);

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

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "APIキーの作成に失敗しました");
            }

            const data = await response.json();
            setGeneratedToken(data.token);
            toast.success("APIキーを作成しました");
        } catch (error: any) {
            console.error("Failed to create API key:", error);
            toast.error(error.message || "APIキーの作成に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToken = () => {
        if (generatedToken) {
            navigator.clipboard.writeText(generatedToken);
            setCopied(true);
            toast.success("トークンをコピーしました");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDone = () => {
        router.push("/keys");
    };

    // モーダル表示中
    if (generatedToken) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className="bg-black border border-white/20 rounded-xl max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="border-b border-white/10 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">APIキーを作成しました</h2>
                                <p className="text-sm text-gray-400">セキュリティのため、このトークンは一度しか表示されません</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 space-y-6">
                        {/* Warning Alert */}
                        <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-yellow-200 mb-1">
                                        🔒 重要: このトークンを安全に保管してください
                                    </p>
                                    <p className="text-xs text-yellow-300/80 leading-relaxed">
                                        このトークンは二度と表示されません。紛失した場合は、新しいAPIキーを作成する必要があります。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Token Display */}
                        <div>
                            <Label className="text-sm font-medium mb-3 block text-gray-300">
                                あなたのAPIトークン
                            </Label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative bg-white/[0.02] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                                    <code className="text-sm text-gray-200 break-all font-mono leading-relaxed block">
                                        {generatedToken}
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                💡 <span className="font-medium text-gray-300">使い方:</span> APIリクエストのAuthorizationヘッダーに
                                <code className="mx-1 px-1.5 py-0.5 bg-black/50 rounded text-blue-400 font-mono">Bearer {"{token}"}</code>
                                の形式で含めてください。
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/10 px-8 py-6">
                        <div className="flex gap-3">
                            <Button
                                onClick={copyToken}
                                variant="outline"
                                className="flex-1 h-11 border-white/10 hover:bg-white/5"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                                        <span className="text-green-400">コピー済み</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        トークンをコピー
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleDone}
                                className="flex-1 h-11 bg-white text-black hover:bg-gray-200 font-medium"
                            >
                                完了して一覧に戻る
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
