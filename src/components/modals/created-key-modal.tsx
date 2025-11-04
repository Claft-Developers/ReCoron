"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Props {
    token: string;
    onClose: () => void;
}

export function CreatedKeyModal({ token, onClose }: Props) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const copyToken = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        toast.success("トークンをコピーしました");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDone = () => {
        onClose();
        router.push("/keys");
    };

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
                                    {token}
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
