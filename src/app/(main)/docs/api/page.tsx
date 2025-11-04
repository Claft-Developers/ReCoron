import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdown.css';

export default async function APIDocPage() {
  const filePath = path.join(process.cwd(), 'docs', 'API.md');
  const markdown = fs.readFileSync(filePath, 'utf-8');

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
        
        <article className="prose prose-invert prose-lg max-w-none markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
