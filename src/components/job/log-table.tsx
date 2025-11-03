"use client";

import { CheckCircle2, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/utils/date";
import { useState } from "react";
import type { RunningLog } from "@prisma/client";

type LogWithJob = RunningLog & {
    job: {
        name: string;
        url: string;
        method: string;
    } | null;
};

type LogsTableProps = {
    logs: LogWithJob[];
    showJobName?: boolean;
};

export function LogsTable({ logs, showJobName = false }: LogsTableProps) {
    const [expandedLog, setExpandedLog] = useState<string | null>(null);

    const toggleExpand = (logId: string) => {
        setExpandedLog(expandedLog === logId ? null : logId);
    };

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                        <tr className="text-left text-sm text-gray-400">
                            <th className="px-6 py-4 font-medium">ステータス</th>
                            {showJobName && <th className="px-6 py-4 font-medium">ジョブ名</th>}
                            <th className="px-6 py-4 font-medium">URL</th>
                            <th className="px-6 py-4 font-medium">実行時刻</th>
                            <th className="px-6 py-4 font-medium">実行時間</th>
                            <th className="px-6 py-4 font-medium">HTTPステータス</th>
                            <th className="px-6 py-4 font-medium">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <>
                                <tr
                                    key={log.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {log.successful ? (
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-sm">成功</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500">
                                                    <XCircle className="w-4 h-4" />
                                                    <span className="text-sm">失敗</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    {showJobName && (
                                        <td className="px-6 py-4">
                                            {log.job ? (
                                                <>
                                                    <div className="font-medium">{log.job.name}</div>
                                                    <div className="text-sm text-gray-400">{log.job.method}</div>
                                                </>
                                            ) : (
                                                <div className="text-sm text-gray-500 italic">削除されたジョブ</div>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-300 max-w-xs truncate">
                                                {log.url}
                                            </span>
                                            <a
                                                href={log.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <Clock className="w-4 h-4" />
                                            {formatDate(log.finishedAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-300">{log.durationMs}ms</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div
                                            className={`text-sm font-mono ${
                                                log.status >= 200 && log.status < 300
                                                    ? "text-green-400"
                                                    : log.status >= 400
                                                      ? "text-red-500"
                                                      : "text-yellow-500"
                                            }`}
                                        >
                                            {log.status || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleExpand(log.id)}
                                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                                        >
                                            {expandedLog === log.id ? (
                                                <>
                                                    <ChevronUp className="w-4 h-4" />
                                                    閉じる
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-4 h-4" />
                                                    表示
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                                {expandedLog === log.id && (
                                    <tr className="bg-white/[0.01] border-b border-white/5">
                                        <td colSpan={showJobName ? 7 : 6} className="px-6 py-4">
                                            <div className="space-y-4">
                                                {/* Response Headers */}
                                                {log.responseHeaders && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-2 text-gray-300">
                                                            レスポンスヘッダー
                                                        </h4>
                                                        <pre className="bg-black/50 rounded p-3 text-xs overflow-x-auto">
                                                            <code className="text-gray-400">
                                                                {JSON.stringify(
                                                                    log.responseHeaders,
                                                                    null,
                                                                    2
                                                                )}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                )}
                                                {/* Response Body */}
                                                {log.responseBody && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-2 text-gray-300">
                                                            レスポンスボディ
                                                        </h4>
                                                        <pre className="bg-black/50 rounded p-3 text-xs overflow-x-auto max-h-64">
                                                            <code className="text-gray-400">
                                                                {log.responseBody}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}