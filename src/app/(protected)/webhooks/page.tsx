import { headers } from "next/headers";
import { Plus, Webhook, CheckCircle, XCircle, Link as LinkIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WebhooksTable } from "@/components/webhooks/table";

const CreateWebhookButton = () => (
    <Link href={`/webhooks/new`}>
        <Button className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            Webhookを作成
        </Button>
    </Link>
);

export default async function WebhooksPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return <div>認証が必要です</div>;
    }
    
    const webhooks = await prisma.webhookJobs.findMany({
        where: { userId: session.user.id },
        include: {
            job: {
                select: {
                    id: true,
                    name: true,
                    enabled: true,
                    url: true,
                    method: true,
                }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    const totalWebhooks = webhooks.length;
    const activeWebhooks = webhooks.filter(w => w.job.enabled).length;
    const uniqueEndpoints = new Set(webhooks.map(w => new URL(w.endpoint).hostname)).size;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Webhooks</h1>
                            <p className="text-sm text-gray-400">
                                ジョブ実行結果を外部エンドポイントに通知
                            </p>
                        </div>
                        <CreateWebhookButton />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Total Webhooks */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">総Webhook数</span>
                                <Webhook className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold">{totalWebhooks}</div>
                        </div>

                        {/* Active Webhooks */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">有効なWebhook</span>
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="text-2xl font-bold">{activeWebhooks}</div>
                        </div>

                        {/* Inactive Webhooks */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">無効なWebhook</span>
                                <XCircle className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="text-2xl font-bold">{totalWebhooks - activeWebhooks}</div>
                        </div>

                        {/* Unique Endpoints */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">エンドポイント数</span>
                                <LinkIcon className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold">{uniqueEndpoints}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Webhooks List */}
            <div className="px-8 py-6">
                {webhooks.length === 0 ? (
                    <div className="text-center py-16">
                        <Webhook className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-semibold mb-2">Webhookがありません</h3>
                        <p className="text-gray-400 mb-6">
                            最初のWebhookを作成して、ジョブ実行結果をリアルタイムで受信しましょう
                        </p>
                        
                        <CreateWebhookButton />
                    </div>
                ) : (
                    <WebhooksTable webhooks={webhooks} />
                )}
            </div>
        </div>
    );
}
