"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

type Job = {
    id: string;
    name: string;
};

type LogFilterProps = {
    jobs: Job[];
};

export function LogFilter({ jobs }: LogFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [jobId, setJobId] = useState(searchParams.get("jobId") || "");
    const [type, setType] = useState(searchParams.get("type") || "");

    useEffect(() => {
        setJobId(searchParams.get("jobId") || "");
        setType(searchParams.get("type") || "");
    }, [searchParams]);

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (jobId && jobId !== "all") params.set("jobId", jobId);
        if (type && type !== "all") params.set("type", type);
        
        router.push(`/logs?${params.toString()}`);
    };

    const handleReset = () => {
        setJobId("all");
        setType("all");
        router.push("/logs");
    };

    const hasActiveFilters = (jobId && jobId !== "all") || (type && type !== "all");

    return (
        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold">フィルター</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* ジョブ選択 */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        ジョブ
                    </label>
                    <Select value={jobId} onValueChange={setJobId}>
                        <SelectTrigger className="w-full bg-white/[0.05] border-white/10 text-white">
                            <SelectValue placeholder="すべてのジョブ" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10">
                            <SelectItem value="all" className="text-white">すべてのジョブ</SelectItem>
                            {jobs.map((job) => (
                                <SelectItem key={job.id} value={job.id} className="text-white">
                                    {job.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 実行タイプ選択 */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        実行タイプ
                    </label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-full bg-white/[0.05] border-white/10 text-white">
                            <SelectValue placeholder="すべて" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/10">
                            <SelectItem value="all" className="text-white">すべて</SelectItem>
                            <SelectItem value="auto" className="text-white">自動実行</SelectItem>
                            <SelectItem value="manual" className="text-white">手動実行</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={handleFilter}
                    className="bg-white text-black hover:bg-gray-200"
                >
                    <Filter className="w-4 h-4 mr-2" />
                    適用
                </Button>
                {hasActiveFilters && (
                    <Button
                        onClick={handleReset}
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-white/[0.05]"
                    >
                        <X className="w-4 h-4 mr-2" />
                        リセット
                    </Button>
                )}
            </div>

            {/* アクティブフィルター表示 */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                        {jobId && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm">
                                <span className="text-gray-400">ジョブ:</span>
                                <span className="text-blue-400">
                                    {jobs.find(j => j.id === jobId)?.name || jobId}
                                </span>
                            </div>
                        )}
                        {type && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm">
                                <span className="text-gray-400">タイプ:</span>
                                <span className="text-purple-400">
                                    {type === "auto" ? "自動実行" : "手動実行"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
