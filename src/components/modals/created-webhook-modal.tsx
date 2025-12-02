"use client";

import { useState } from "react";
import { Copy, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    webhook: {
        id: string;
        jobId: string;
        endpoint: string;
        secret: string;
        createdAt: Date;
    };
    onClose: () => void;
}

export function CreatedWebhookModal({ webhook, onClose }: Props) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg max-w-2xl w-full p-6">
                <div className="flex items-start gap-3 mb-6">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Webhookが作成されました</h2>
                        <p className="text-sm text-gray-400">
                            以下のシークレットキーは今回のみ表示されます。必ず安全な場所に保存してください。
                        </p>
                    </div>
                </div>

                {/* Warning Box */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-200">
                            <p className="font-semibold mb-1">重要: シークレットキーを保存してください</p>
                            <p>
                                このシークレットキーは二度と表示されません。
                                署名検証に必要なため、必ず安全な場所に保存してください。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Webhook ID */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Webhook ID
                    </label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                        <code className="flex-1 text-sm font-mono text-white break-all">
                            {webhook.id}
                        </code>
                        <button
                            onClick={() => copyToClipboard(webhook.id, "id")}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors flex-shrink-0"
                            title="コピー"
                        >
                            {copiedField === "id" ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Endpoint */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        エンドポイント
                    </label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                        <code className="flex-1 text-sm font-mono text-white break-all">
                            {webhook.endpoint}
                        </code>
                        <button
                            onClick={() => copyToClipboard(webhook.endpoint, "endpoint")}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors flex-shrink-0"
                            title="コピー"
                        >
                            {copiedField === "endpoint" ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Secret (Highlighted) */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-amber-400 mb-2">
                        シークレットキー (署名検証用) *
                    </label>
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                        <code className="flex-1 text-sm font-mono text-white break-all">
                            {webhook.secret}
                        </code>
                        <button
                            onClick={() => copyToClipboard(webhook.secret, "secret")}
                            className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 rounded transition-colors flex-shrink-0"
                            title="コピー"
                        >
                            {copiedField === "secret" ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-amber-400 mt-2">
                        * このキーを環境変数として安全に保存し、Webhook署名の検証に使用してください
                    </p>
                </div>

                {/* Documentation Link */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-300 mb-2">
                        Webhookの署名検証方法については、ドキュメントをご確認ください:
                    </p>
                    <a
                        href="/docs/webhooks-api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                        Webhook API ドキュメント →
                    </a>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={onClose}
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        完了
                    </Button>
                </div>
            </div>
        </div>
    );
}
