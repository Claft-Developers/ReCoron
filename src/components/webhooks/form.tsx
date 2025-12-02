"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Webhook } from "lucide-react";
import { CreatedWebhookModal } from "@/components/modals/created-webhook-modal";

interface Job {
    id: string;
    name: string;
    url: string;
    method: string;
    enabled: boolean;
}

interface Props {
    jobs: Job[];
}

export function WebhookForm({ jobs }: Props) {
    const router = useRouter();
    const [selectedJobId, setSelectedJobId] = useState("");
    const [endpoint, setEndpoint] = useState("");
    const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
        { key: "", value: "" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [createdWebhook, setCreatedWebhook] = useState<any>(null);

    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const updateHeader = (index: number, field: "key" | "value", value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedJobId) {
            toast.error("ジョブを選択してください");
            return;
        }

        if (!endpoint.trim()) {
            toast.error("エンドポイントURLを入力してください");
            return;
        }

        // URLバリデーション
        try {
            new URL(endpoint);
        } catch {
            toast.error("有効なURLを入力してください");
            return;
        }

        setIsLoading(true);

        try {
            // カスタムヘッダーをオブジェクトに変換
            const headersObject = headers
                .filter(h => h.key.trim() && h.value.trim())
                .reduce((acc, h) => {
                    acc[h.key.trim()] = h.value.trim();
                    return acc;
                }, {} as Record<string, string>);

            const response = await fetch("/api/webhooks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobId: selectedJobId,
                    endpoint: endpoint.trim(),
                    headers: Object.keys(headersObject).length > 0 ? headersObject : undefined,
                }),
            });

            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Webhookの作成に失敗しました");
            }

            setCreatedWebhook(data.data);
            toast.success("Webhookを作成しました");
        } catch (error: any) {
            console.error("Failed to create webhook:", error);
            toast.error(error.message || "Webhookの作成に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setCreatedWebhook(null);
        router.push("/webhooks");
        router.refresh();
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    {/* Job Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="job">ジョブ選択 *</Label>
                        <Select
                            value={selectedJobId}
                            onValueChange={setSelectedJobId}
                        >
                            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="ジョブを選択..." />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-white/10">
                                {jobs.map((job) => (
                                    <SelectItem 
                                        key={job.id} 
                                        value={job.id}
                                        className="text-white hover:bg-white/5 focus:bg-white/10"
                                    >
                                        {job.name} ({job.method} - {job.url.substring(0, 40)}{job.url.length > 40 ? '...' : ''})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-400">
                            このジョブが実行されると、結果がWebhookエンドポイントに送信されます
                        </p>
                    </div>

                    {/* Endpoint URL */}
                    <div className="space-y-2">
                        <Label htmlFor="endpoint">エンドポイントURL *</Label>
                        <Input
                            id="endpoint"
                            type="url"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            placeholder="https://your-server.com/webhook"
                            className="bg-white/5 border-white/10 focus:ring-white/20"
                            required
                        />
                        <p className="text-sm text-gray-400">
                            ジョブ実行結果が送信されるHTTPS URL
                        </p>
                    </div>

                    {/* Custom Headers */}
                    <div className="space-y-2">
                        <Label>カスタムヘッダー（オプション）</Label>
                        {headers.map((header, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    type="text"
                                    value={header.key}
                                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                                    placeholder="Header-Name"
                                    className="bg-white/5 border-white/10 focus:ring-white/20"
                                />
                                <Input
                                    type="text"
                                    value={header.value}
                                    onChange={(e) => updateHeader(index, "value", e.target.value)}
                                    placeholder="Header-Value"
                                    className="bg-white/5 border-white/10 focus:ring-white/20"
                                />
                                {headers.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeHeader(index)}
                                        variant="outline"
                                        className="border-white/10 text-red-400 hover:bg-red-400/10"
                                    >
                                        削除
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={addHeader}
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                        >
                            + ヘッダーを追加
                        </Button>
                        <p className="text-sm text-gray-400">
                            認証トークンなど、Webhookリクエストに含めるカスタムヘッダー
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 text-blue-400">Webhook署名検証</h3>
                        <p className="text-sm text-gray-300 mb-2">
                            すべてのWebhookリクエストには<code className="px-1 py-0.5 bg-white/10 rounded text-xs">X-Signature</code>ヘッダーが含まれます。
                        </p>
                        <p className="text-sm text-gray-300">
                            このシークレットキーを使用してHMAC-SHA256署名を検証することで、リクエストがReCoronから送信されたことを確認できます。
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                    作成中...
                                </>
                            ) : (
                                <>
                                    <Webhook className="w-4 h-4 mr-2" />
                                    Webhookを作成
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="border-white/10 hover:bg-white/5"
                        >
                            キャンセル
                        </Button>
                    </div>
                </div>
            </form>

            {createdWebhook && (
                <CreatedWebhookModal
                    webhook={createdWebhook}
                    onClose={closeModal}
                />
            )}
        </>
    );
}
