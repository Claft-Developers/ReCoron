import Link from 'next/link';
import './markdown.css';

export default async function APIDocPage() {
  // 分割されたドキュメント
  const sections = [
    { 
      name: '概要', 
      path: '/docs/api/overview', 
      emoji: '📋', 
      description: 'API の基本情報、レスポンス形式、プラン制限、変更履歴' 
    },
    { 
      name: '認証', 
      path: '/docs/api/authentication', 
      emoji: '🔐', 
      description: '認証方法、スコープシステム、セキュリティのベストプラクティス' 
    },
    { 
      name: 'Jobs API', 
      path: '/docs/api/jobs', 
      emoji: '⏰', 
      description: 'ジョブ管理のための全エンドポイント (作成、更新、削除、実行など)' 
    },
    { 
      name: 'Keys API', 
      path: '/docs/api/keys', 
      emoji: '🔑', 
      description: 'APIキー管理のための全エンドポイント (作成、取得、削除)' 
    },
    { 
      name: 'サンプルコード', 
      path: '/docs/api/examples', 
      emoji: '💻', 
      description: 'Node.js、Python、cURL、TypeScript の実装サンプル' 
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/docs"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← ドキュメントに戻る
          </Link>
        </div>

        {/* ヘッダー */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">📚 API Documentation</h1>
          <p className="text-gray-400 text-lg mb-8">
            ReCoron APIの完全なリファレンスドキュメントです。各セクションから詳細をご覧ください。
          </p>

          {/* クイックスタート */}
          <div className="p-6 rounded-lg bg-white/5 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold mb-4">🚀 クイックスタート</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold mb-2">1. APIキーを作成 (ダッシュボード)</h3>
                <p className="text-sm text-gray-400 mb-2">
                  ダッシュボードの <Link href="/keys" className="text-blue-400 hover:text-blue-300 underline">APIキー管理ページ</Link> から新しいAPIキーを作成してください。
                  作成時に表示されるトークンは一度しか表示されないため、必ず安全な場所に保存してください。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. ジョブを作成</h3>
                <code className="block bg-black/50 p-3 rounded text-sm overflow-x-auto">
                  curl -X POST https://your-domain.com/api/jobs \<br />
                  {"  "}-H "Authorization: Bearer YOUR_API_TOKEN" \<br />
                  {"  "}-H "Content-Type: application/json" \<br />
                  {"  "}-d '{`{"name": "Daily Report", "url": "https://api.example.com", "method": "POST", "schedule": "0 9 * * *"}`}'
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. ジョブを実行</h3>
                <code className="block bg-black/50 p-3 rounded text-sm overflow-x-auto">
                  curl -X POST https://your-domain.com/api/jobs/JOB_ID/execute \<br />
                  {"  "}-H "Authorization: Bearer YOUR_API_TOKEN"
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* セクション一覧 */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {sections.map((section) => (
            <Link
              key={section.path}
              href={section.path}
              className="block p-6 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{section.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">
                    {section.name}
                  </h3>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* 追加情報 */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">🌐 Base URL</h3>
            <code className="block bg-black/50 p-3 rounded text-sm">
              https://your-domain.com/api
            </code>
          </div>
          <div className="p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-xl font-semibold mb-4">📦 レスポンス形式</h3>
            <code className="block bg-black/50 p-3 rounded text-sm">
              {`{ "success": true, "message": "...", "data": {...} }`}
            </code>
          </div>
        </div>

        {/* サポート情報 */}
        <div className="mt-12 p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-semibold mb-4">💡 サポート</h3>
          <div className="space-y-2 text-gray-300">
            <p>
              <strong>GitHub Issues:</strong>{' '}
              <a 
                href="https://github.com/Claft-Developers/ReCoron/issues" 
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                https://github.com/Claft-Developers/ReCoron/issues
              </a>
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a 
                href="mailto:support@recoron.example.com"
                className="text-blue-400 hover:text-blue-300"
              >
                support@recoron.example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
