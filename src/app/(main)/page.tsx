import { ArrowRight, CheckCircle2, Clock, Zap, Code, Bell, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        {/* Hero Content */}
        <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Cron Job for
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text">developers</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              安価で使える、開発者のためのCron Job as a Service。
              <br />
              スケジュールタスクを簡単に登録・管理できるプラットフォーム。
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" className="text-base h-12 px-8">
                <Link href="/signup">今すぐ始める</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base h-12 px-8">
                <Link href="/docs">ドキュメントを見る</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Companies */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-sm text-muted-foreground mb-8">
            あらゆる規模の企業がReCoronを利用しています
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="text-muted-foreground font-semibold text-lg">
                Company {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrate Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              今日の午後に統合
            </h2>
            <p className="text-lg text-muted-foreground">
              シンプルでエレガントなインターフェース。数分でCronジョブの送信を開始できます。
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            {/* Code Example */}
            <div className="relative rounded-lg border bg-card p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-2">cron-job.ts</span>
              </div>
              <pre className="overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
{`import { ReCoron } from 'recoron';

const recoron = new ReCoron('rc_xxxxxxxxx');

await recoron.jobs.create({
  name: 'Daily Report',
  schedule: '0 9 * * *',  // 毎日 9:00
  timezone: 'Asia/Tokyo',
  webhook: {
    url: 'https://api.example.com/report',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
});`}
                </code>
              </pre>
            </div>

            {/* SDK Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {['Node.js', 'Python', 'Go', 'Ruby', 'PHP', 'REST API'].map((sdk) => (
                <div key={sdk} className="rounded-full border bg-background px-4 py-2 text-sm font-medium">
                  {sdk}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              開発者ファーストの体験
            </h2>
            <p className="text-lg text-muted-foreground">
              私たちは開発者のための開発者によるツールを作っています。
              ただ動くだけでなく、使いやすさを追求したプラットフォームです。
            </p>
          </div>

          <div className="mx-auto max-w-6xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                title: '柔軟なスケジューリング',
                description: 'Cron式で自由にスケジュールを設定。毎分、毎時、毎日、カスタム間隔に対応。'
              },
              {
                icon: Zap,
                title: '高速実行',
                description: '低レイテンシーで確実に実行。リージョンを選択してユーザーに近い場所から実行。'
              },
              {
                icon: Code,
                title: 'シンプルなAPI',
                description: 'RESTful APIと各言語のSDKを提供。直感的なインターフェースですぐに統合。'
              },
              {
                icon: Bell,
                title: 'リアルタイム通知',
                description: 'Webhookで実行状態をリアルタイムに通知。成功、失敗、リトライを追跡。'
              },
              {
                icon: Shield,
                title: '信頼性の高い実行',
                description: '自動リトライと失敗時のフォールバック。99.9%の稼働率を保証。'
              },
              {
                icon: Globe,
                title: 'グローバル対応',
                description: '世界中の複数リージョンに対応。タイムゾーンを指定して確実に実行。'
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Mode Section */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                テストモード
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                本番環境に影響を与えることなく、APIをテストできます。
                イベントをシミュレートして、実験を安全に行えます。
              </p>
              <ul className="space-y-3">
                {[
                  '実際のWebhookを呼び出さずにテスト',
                  '実行履歴とログの確認',
                  'エラーハンドリングの検証',
                  'リトライ動作のシミュレーション',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-8 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm font-medium">実行履歴</span>
                  <span className="text-xs text-muted-foreground">テストモード</span>
                </div>
                {[
                  { status: 'success', time: '10:30:45', job: 'Daily Report' },
                  { status: 'success', time: '10:30:00', job: 'Data Sync' },
                  { status: 'failed', time: '10:29:30', job: 'Backup Task' },
                  { status: 'success', time: '10:29:00', job: 'Email Campaign' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-medium">{log.job}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Webhook Section */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1 rounded-lg border bg-card p-8 shadow-lg">
              <div className="space-y-4">
                <div className="text-sm font-medium mb-4">Webhook設定</div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">イベント</label>
                    <div className="mt-1 flex gap-2 flex-wrap">
                      {['job.started', 'job.completed', 'job.failed'].map((event) => (
                        <div key={event} className="rounded border bg-background px-3 py-1.5 text-xs font-mono">
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">エンドポイント</label>
                    <div className="mt-1 rounded border bg-background px-3 py-2 text-sm font-mono">
                      https://api.example.com/webhooks
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                モジュール式Webhook
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                サーバーに直接リアルタイム通知を受け取ります。
                ジョブが実行、完了、失敗した際に即座に通知。
              </p>
              <ul className="space-y-3">
                {[
                  'ジョブの実行状態をリアルタイムで追跡',
                  '成功・失敗・リトライの通知',
                  'カスタムヘッダーと署名検証',
                  '複数のWebhookエンドポイントに対応',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              期待を超える体験
            </h2>
            <p className="text-lg text-muted-foreground">
              ReCoronは、業界や個人を問わず、成功事例を生み出し、
              ビジネスの成長を支援しています。
            </p>
          </div>

          <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "ReCoronに切り替えてから、スケジュールタスクの管理が本当に楽になりました。シンプルで使いやすく、信頼性も抜群です。",
                author: "田中 太郎",
                role: "CTO at TechCorp"
              },
              {
                quote: "開発者体験が素晴らしい。APIが直感的で、ドキュメントも充実している。数時間で本番環境に統合できました。",
                author: "佐藤 花子",
                role: "Lead Engineer at StartupXYZ"
              },
              {
                quote: "低コストで高機能。複数のリージョンに対応していて、グローバル展開にも最適です。サポートも迅速で助かっています。",
                author: "鈴木 一郎",
                role: "Founder at WebServices"
              },
            ].map((testimonial, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Cronジョブを再定義。
              <br />
              今日から利用可能。
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              数分でスケジュールタスクを実行開始。
              クレジットカード不要で今すぐお試しください。
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" className="text-base h-12 px-8">
                今すぐ始める
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base h-12 px-8">
                お問い合わせ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
