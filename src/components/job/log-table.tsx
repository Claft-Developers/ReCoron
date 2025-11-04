"use client";

import { CheckCircle2, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
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

const ITEMS_PER_PAGE = 10;

export function LogsTable({ logs, showJobName = false }: LogsTableProps) {
    const [expandedLog, setExpandedLog] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentLogs = logs.slice(startIndex, endIndex);

    const toggleExpand = (logId: string) => {
        setExpandedLog(expandedLog === logId ? null : logId);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        setExpandedLog(null); // ページ変更時に展開を閉じる
    };

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/10">
                        <tr className="text-left text-sm text-gray-400">
                            <th className="px-6 py-4 font-medium">ステータス</th>
                            <th className="px-6 py-4 font-medium">実行タイプ</th>
                            {showJobName && <th className="px-6 py-4 font-medium">ジョブ名</th>}
                            <th className="px-6 py-4 font-medium">URL</th>
                            <th className="px-6 py-4 font-medium">実行時刻</th>
                            <th className="px-6 py-4 font-medium">実行時間</th>
                            <th className="px-6 py-4 font-medium">HTTPステータス</th>
                            <th className="px-6 py-4 font-medium">詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.map((log) => (
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
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            log.type === "AUTO" 
                                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                        }`}>
                                            {log.type === "AUTO" ? "自動" : "手動"}
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
                                        <td colSpan={showJobName ? 8 : 7} className="px-6 py-4">
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
            
            {/* ページネーション */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                    <div className="text-sm text-gray-400">
                        全 {logs.length} 件中 {startIndex + 1} - {Math.min(endIndex, logs.length)} 件を表示
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