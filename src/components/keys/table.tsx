"use client";
import { APIKey } from "@prisma/client";
import { Copy, Eye, EyeOff, Trash2, MoreVertical, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatDate } from "@/utils/date";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    apiKeys: APIKey[];
}

export function APIKeysTable({ apiKeys }: Props) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const isExpired = (expiresAt: Date | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

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
                        {apiKeys.map((key) => {
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
        </div>
    );
}