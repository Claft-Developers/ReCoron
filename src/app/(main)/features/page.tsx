import { Clock, Zap, Shield, Code, Activity, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="border-b border-white/10">
                <div className="container mx-auto px-6 py-24 md:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Cron Jobs that
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                just work
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            API経由で動的にCronジョブを登録・管理できるシンプルで強力なサービス。
                            <br />
                            あなたのアプリケーションに定期実行機能を数分で統合できます。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8">
                                    無料で始める
                                </Button>
                            </Link>
                            <Link href="/docs">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
                                >
                                    ドキュメント
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer-First Section */}
            <section className="border-b border-white/10">
                <div className="container mx-auto px-6 py-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                                <span className="text-blue-400 text-sm font-medium">Developer-First</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                シンプルで強力な
                                <br />
                                REST API
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                直感的なAPIインターフェースで、数分でCronジョブを統合。
                                <br />
                                あなたの好きな言語・フレームワークで使えます。
                            </p>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Code className="w-6 h-6 text-green-400" />
                                <span className="text-gray-400">Node.js / TypeScript</span>
                            </div>
                            <pre className="bg-black/50 rounded-lg p-6 overflow-x-auto">
                                <code className="text-sm md:text-base text-gray-300">
{`const response = await fetch('https://recoron.com/api/jobs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Daily Report',
    schedule: '0 9 * * *',  // 毎日午前9時
    url: 'https://your-app.com/webhook',
    method: 'POST',
  }),
});`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Observability Section */}
            <section className="border-b border-white/10">
                <div className="container mx-auto px-6 py-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                                    <span className="text-purple-400 text-sm font-medium">Observability</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    完全な可視性で
                                    <br />
                                    安心運用
                                </h2>
                                <p className="text-xl text-gray-400 mb-8">
                                    詳細なログでトラブルシューティングが簡単に。
                                    リクエストヘッダー、レスポンスボディ、実行時間まで
                                    すべてを記録します。
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Activity className="w-6 h-6 text-green-400 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">リアルタイムモニタリング</h3>
                                            <p className="text-gray-400">実行状況をリアルタイムで確認</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Bell className="w-6 h-6 text-yellow-400 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">失敗通知</h3>
                                            <p className="text-gray-400">エラー発生時に即座に通知</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
                                <div className="space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">Status</span>
                                            <span className="text-green-400 text-sm font-medium">Success</span>
                                        </div>
                                        <div className="text-2xl font-mono">200 OK</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">実行時間</span>
                                            <span className="font-mono">142ms</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">次回実行</span>
                                            <span className="font-mono">2025-11-02 09:00</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">成功率</span>
                                            <span className="font-mono text-green-400">99.8%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Extensible Section */}
            <section className="border-b border-white/10">
                <div className="container mx-auto px-6 py-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                                <span className="text-green-400 text-sm font-medium">Extensible</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                あらゆるユースケースに
                                <br />
                                対応するAPI
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                                柔軟なAPIエンドポイントで、さまざまな用途に対応。
                                カスタムヘッダー、リクエストボディ、タイムゾーン設定など。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                                <Clock className="w-10 h-10 text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-3">Cron式スケジュール</h3>
                                <p className="text-gray-400 mb-4">
                                    標準的なCron形式で柔軟なスケジュール設定。
                                    毎分から年単位まで対応。
                                </p>
                                <code className="text-sm text-green-400 bg-black/50 px-3 py-1 rounded">
                                    0 */6 * * *
                                </code>
                            </div>

                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                                <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-3">カスタムヘッダー</h3>
                                <p className="text-gray-400 mb-4">
                                    認証トークンやカスタムヘッダーを
                                    JSON形式で簡単に設定。
                                </p>
                                <code className="text-sm text-green-400 bg-black/50 px-3 py-1 rounded">
                                    Authorization
                                </code>
                            </div>

                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                                <Shield className="w-10 h-10 text-purple-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-3">タイムゾーン対応</h3>
                                <p className="text-gray-400 mb-4">
                                    世界中のタイムゾーンに対応。
                                    ユーザーの地域に合わせた実行が可能。
                                </p>
                                <code className="text-sm text-green-400 bg-black/50 px-3 py-1 rounded">
                                    Asia/Tokyo
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reliable Section */}
            <section className="border-b border-white/10">
                <div className="container mx-auto px-6 py-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                                <span className="text-red-400 text-sm font-medium">Reliable</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                信頼できる
                                <br />
                                サービス
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                あなたのビジネスに必要なサポート。
                                チームに必要な信頼性。ミッションクリティカルなアプリケーションに必要なセキュリティ。
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold text-green-400">99.9%</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">稼働率</h3>
                                <p className="text-gray-400">
                                    高可用性、信頼性、スケーラビリティを
                                    実現するように設計されたAPI
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">セキュア & コンプライアント</h3>
                                <p className="text-gray-400">
                                    顧客データのセキュリティとプライバシーを
                                    最優先に設計
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">24/7サポート</h3>
                                <p className="text-gray-400">
                                    必要な時にいつでもサポート。
                                    迅速な対応をお約束します
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section>
                <div className="container mx-auto px-6 py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            今週末から始めよう
                        </h2>
                        <p className="text-xl text-gray-400 mb-8">
                            ReCoronは、最も急成長しているチームのために
                            <br />
                            ミッションクリティカルなCronジョブを提供します。
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8">
                                無料で始める
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
