import Link from 'next/link';
import { getAllDocs } from '@/lib/docs';

export function generateMetadata() {
  return {
    title: 'Docs - ReCoron',
    description: 'ReCoronの使い方とAPI仕様について説明します',
  }
}

export default async function DocsPage() {
  const docs = getAllDocs();
  
  // カテゴリーごとにドキュメントをグループ化
  const groupedDocs = docs.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof docs>);

  return (
    <div className="min-h-screen bg-black text-white mt-8">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">⏰ ReCoron Documentation</h1>
          <p className="text-gray-400 text-lg">
            ReCoronの使い方とAPI仕様について説明します
          </p>
        </div>

        {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryDocs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className="block p-6 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 p-6 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">リソース</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="https://github.com/Claft-Developers/ReCoron"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <span className="text-2xl">💻</span>
              <div>
                <div className="font-semibold">GitHub</div>
                <div className="text-sm text-gray-400">ソースコードとコントリビューション</div>
              </div>
            </a>
            <Link
              href="/pricing"
              className="flex items-center gap-3 p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <span className="text-2xl">💰</span>
              <div>
                <div className="font-semibold">料金プラン</div>
                <div className="text-sm text-gray-400">プランと制限について</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
