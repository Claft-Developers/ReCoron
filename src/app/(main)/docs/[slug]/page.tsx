import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllDocs, getDocBySlug } from '@/lib/docs';
import MarkdownRenderer from '@/components/docs/markdown-renderer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const docs = getAllDocs();
  const doc = docs.find((d) => d.slug === slug);

  if (!doc) {
    return {
      title: 'Not Found - ReCoron Docs',
    };
  }

  return {
    title: `${doc.title} - ReCoron Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  
  let content: string;
  try {
    content = getDocBySlug(slug);
  } catch {
    notFound();
  }

  const allDocs = getAllDocs();
  const currentIndex = allDocs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-black text-white mt-8">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* パンくずリスト */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <span>/</span>
          <span className="text-white">{slug}</span>
        </div>

        {/* ドキュメント内容 */}
        <article className="mb-16">
          <MarkdownRenderer content={content} />
        </article>

        {/* ナビゲーション */}
        <div className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-2 gap-4">
            {prevDoc ? (
              <Link
                href={`/docs/${prevDoc.slug}`}
                className="p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-left"
              >
                <div className="text-sm text-gray-400 mb-1">← Previous</div>
                <div className="font-semibold">{prevDoc.title}</div>
              </Link>
            ) : (
              <div />
            )}
            {nextDoc ? (
              <Link
                href={`/docs/${nextDoc.slug}`}
                className="p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-right"
              >
                <div className="text-sm text-gray-400 mb-1">Next →</div>
                <div className="font-semibold">{nextDoc.title}</div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* トップに戻る */}
        <div className="mt-8 text-center">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
