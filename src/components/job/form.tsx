"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

const TIMEZONES = [
    { value: "Asia/Tokyo", label: "日本 (JST, UTC+9)" },
    { value: "UTC", label: "協定世界時 (UTC)" },
    { value: "America/New_York", label: "ニューヨーク (EST/EDT, UTC-5/-4)" },
    { value: "America/Los_Angeles", label: "ロサンゼルス (PST/PDT, UTC-8/-7)" },
    { value: "Europe/London", label: "ロンドン (GMT/BST, UTC+0/+1)" },
    { value: "Europe/Paris", label: "パリ (CET/CEST, UTC+1/+2)" },
    { value: "Asia/Shanghai", label: "上海 (CST, UTC+8)" },
    { value: "Asia/Hong_Kong", label: "香港 (HKT, UTC+8)" },
    { value: "Asia/Singapore", label: "シンガポール (SGT, UTC+8)" },
    { value: "Australia/Sydney", label: "シドニー (AEDT/AEST, UTC+11/+10)" },
] as const;

export function CreateJobForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        method: "GET" as typeof HTTP_METHODS[number],
        schedule: "",
        timezone: "Asia/Tokyo",
        headers: "",
        body: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = "create-job";
        toast.loading("ジョブを作成中です...", { id: toastId });

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    headers: formData.headers ? JSON.parse(formData.headers) : undefined,
                    body: formData.body || undefined,
                }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error("Error data:", data);
                throw new Error(data.message || "ジョブの作成に失敗しました");
            }

            toast.success("ジョブを作成しました", { id: toastId, description: undefined });
            router.push("/jobs");
            router.refresh();
        } catch (error) {
            console.error("Failed to create job:", error);
            const message = error instanceof Error ? error.message : null;
            toast.error("ジョブの作成に失敗しました", { description: message, id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">基本情報</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">ジョブ名 *</Label>
                            <Input
                                id="name"
                                placeholder="例: Daily Backup"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-white/[0.02] border-white/10 text-white"
                            />
                            <p className="text-xs text-gray-400">
                                わかりやすいジョブ名を付けてください
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">エンドポイントURL *</Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://api.example.com/endpoint"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                required
                                className="bg-white/[0.02] border-white/10 text-white"
                            />
                            <p className="text-xs text-gray-400">
                                リクエストを送信するURLを入力してください
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="method">HTTPメソッド *</Label>
                            <select
                                id="method"
                                value={formData.method}
                                onChange={(e) => setFormData({ ...formData, method: e.target.value as typeof HTTP_METHODS[number] })}
                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                required
                            >
                                {HTTP_METHODS.map((method) => (
                                    <option key={method} value={method} className="bg-gray-900">
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schedule">スケジュール (Cron形式) *</Label>
                            <Input
                                id="schedule"
                                placeholder="例: 0 0 * * * (毎日午前0時)"
                                value={formData.schedule}
                                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                required
                                className="bg-white/[0.02] border-white/10 text-white"
                            />
                            <p className="text-xs text-gray-400">
                                Cron形式で実行スケジュールを指定してください
                                <br />
                                例: <code className="text-gray-300">0 0 * * *</code> = 毎日午前0時, <code className="text-gray-300">*/15 * * * *</code> = 15分ごと
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone">タイムゾーン *</Label>
                            <select
                                id="timezone"
                                value={formData.timezone}
                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                required
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz.value} value={tz.value} className="bg-gray-900">
                                        {tz.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400">
                                スケジュールを実行するタイムゾーンを選択してください
                            </p>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">詳細設定</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="headers">カスタムヘッダー (JSON形式)</Label>
                            <textarea
                                id="headers"
                                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                                value={formData.headers}
                                onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                                rows={4}
                                className="flex w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 font-mono"
                            />
                            <p className="text-xs text-gray-400">
                                カスタムHTTPヘッダーをJSON形式で指定できます(オプション)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="body">リクエストボディ (JSON/Text)</Label>
                            <textarea
                                id="body"
                                placeholder='{"key": "value"}'
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                rows={4}
                                className="flex w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 font-mono"
                            />
                            <p className="text-xs text-gray-400">
                                POST/PUT/PATCHリクエストのボディを指定できます(オプション)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white text-black hover:bg-gray-200"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            作成中...
                        </>
                    ) : (
                        "ジョブを作成"
                    )}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-white"
                >
                    キャンセル
                </Button>
            </div>
        </form>
    );
}