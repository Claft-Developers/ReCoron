import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WebhookForm } from "@/components/webhooks/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewWebhookPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return <div>認証が必要です</div>;
    }

    // ユーザーのジョブを取得（Webhookが設定されていないもののみ）
    const jobs = await prisma.job.findMany({
        where: { 
            userId: session.user.id,
            WebhookJobs: null, // Webhookが未設定のジョブのみ
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            url: true,
            method: true,
            enabled: true,
        }
    });

    if (jobs.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="px-8 py-6 border-b border-white/10">
                    <Link 
                        href="/webhooks" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Webhooksに戻る
                    </Link>
                    <h1 className="text-2xl font-bold">Webhook作成</h1>
                </div>

                <div className="px-8 py-16 text-center">
                    <h2 className="text-xl font-semibold mb-4">利用可能なジョブがありません</h2>
                    <p className="text-gray-400 mb-6">
                        すべてのジョブに既にWebhookが設定されているか、ジョブが存在しません。
                    </p>
                    <Link 
                        href="/jobs/new"
                        className="inline-block px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                    >
                        新しいジョブを作成
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="px-8 py-6 border-b border-white/10">
                <Link 
                    href="/webhooks" 
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Webhooksに戻る
                </Link>
                <h1 className="text-2xl font-bold mb-1">Webhook作成</h1>
                <p className="text-sm text-gray-400">
                    ジョブ実行結果を通知するWebhookを設定
                </p>
            </div>

            <div className="flex justify-center px-8 py-6">
                <WebhookForm jobs={jobs} />
            </div>
        </div>
    );
}
