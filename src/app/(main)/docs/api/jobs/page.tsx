import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../markdown.css';

export function generateMetadata() {
  return {
    title: 'Jobs API - ReCoron',
    description: 'ReCoron Jobs APIの使用方法とエンドポイントについて説明します。',
  }
}

export default async function JobsAPIPage() {
  const filePath = path.join(process.cwd(), 'docs', 'jobs-api.md');
  const markdown = fs.readFileSync(filePath, 'utf-8');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/docs/api"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← API Documentation に戻る
          </Link>
        </div>
        
        <article className="prose prose-invert prose-lg max-w-none markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </article>

        {/* ナビゲーション */}
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
          <Link
            href="/docs/api/authentication"
            className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/30 hover:bg-white/5 transition-all"
          >
            ← 認証
          </Link>
          <Link
            href="/docs/api/keys"
            className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/30 hover:bg-white/5 transition-all"
          >
            Keys API →
          </Link>
        </div>
      </div>
    </div>
  );
}
