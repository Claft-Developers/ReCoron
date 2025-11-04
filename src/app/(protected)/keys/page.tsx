import { headers } from "next/headers";
import { Plus, Key, Shield, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APIKeysTable } from "@/components/keys/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CreateKeyButton = () => (
    <Link href={`/keys/new`}>
        <Button className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            APIキーを作成
        </Button>
    </Link>
);

export default async function KeysPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return <div>認証が必要です</div>;
    }
    
    const keys = await prisma.aPIKey.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    const enabledKeys = keys.filter(key => key.enabled).length;
    const expiredKeys = keys.filter(key => key.expiresAt && new Date(key.expiresAt) < new Date()).length;
    const totalScopes = keys.reduce((acc, key) => acc + key.scopes.length, 0);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">API Keys</h1>
                            <p className="text-sm text-gray-400">
                                APIキーを管理してプログラマティックアクセスを制御
                            </p>
                        </div>
                        <CreateKeyButton />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Total Keys */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">総キー数</span>
                                <Key className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold">{keys.length}</div>
                        </div>

                        {/* Enabled Keys */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">有効なキー</span>
                                <Shield className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="text-2xl font-bold">{enabledKeys}</div>
                        </div>

                        {/* Expired Keys */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">期限切れ</span>
                                <Clock className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="text-2xl font-bold">{expiredKeys}</div>
                        </div>

                        {/* Total Scopes */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">総スコープ数</span>
                                <Shield className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold">{totalScopes}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keys List */}
            <div className="px-8 py-6">
                {keys.length === 0 ? (
                    <div className="text-center py-16">
                        <Key className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-semibold mb-2">APIキーがありません</h3>
                        <p className="text-gray-400 mb-6">
                            最初のAPIキーを作成して、プログラマティックアクセスを開始しましょう
                        </p>
                        
                        <CreateKeyButton />
                    </div>
                ) : (
                    <APIKeysTable apiKeys={keys} />
                )}
            </div>
        </div>
    );
}