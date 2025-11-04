import Link from 'next/link';

export function generateMetadata() {
  return {
    title: 'Docs - ReCoron',
    description: 'ReCoronの使い方とAPI仕様について説明します',
  }
}

export default async function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white mt-8">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">⏰ ReCoron Documentation</h1>
          <p className="text-gray-400 text-lg">
            ReCoronの使い方とAPI仕様について説明します
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/docs/api"
            className="block p-6 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">📚 API Documentation</h2>
            <p className="text-gray-400">
              完全なAPI仕様とリファレンス
            </p>
          </Link>

          <a
            href="https://github.com/Claft-Developers/ReCoron"
            target="_blank"
            rel="noreferrer"
            className="block p-6 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">💻 GitHub</h2>
            <p className="text-gray-400">
              ソースコードとコントリビューション
            </p>
          </a>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">主な機能</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✅ Cron Jobの管理 - 定期的なHTTPリクエストをスケジュール</li>
            <li>✅ APIキー認証 - セキュアなプログラマティックアクセス</li>
            <li>✅ 実行ログ - すべてのジョブ実行の詳細な履歴</li>
            <li>✅ 使用量追跡 - 削除されたリソースも含む完全な使用履歴</li>
            <li>✅ プラン管理 - ダウングレード時の自動リソース無効化</li>
            <li>✅ 複数プラン - 用途に応じたプランを選択可能</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
