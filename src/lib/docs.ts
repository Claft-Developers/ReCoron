import fs from 'fs';
import path from 'path';

export interface DocMetadata {
  slug: string;
  title: string;
  description: string;
  order: number;
  category: string;
}

/**
 * docs/ディレクトリから全てのMarkdownファイルを取得
 */
export function getAllDocs(): DocMetadata[] {
  const docsDirectory = path.join(process.cwd(), 'docs');
  const files = fs.readdirSync(docsDirectory);

  const docs = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(docsDirectory, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Markdownファイルの最初の見出しをタイトルとして取得
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : slug;
      
      // 最初の段落を説明として取得
      const descMatch = content.match(/^(?!#)(.+)$/m);
      const description = descMatch ? descMatch[1].trim() : '';

      // カテゴリーと順序を決定
      const { category, order } = categorizeDoc(slug);

      return {
        slug,
        title,
        description,
        order,
        category,
      };
    })
    .sort((a, b) => a.order - b.order);

  return docs;
}

/**
 * 特定のドキュメントの内容を取得
 */
export function getDocBySlug(slug: string): string {
  const docsDirectory = path.join(process.cwd(), 'docs');
  const filePath = path.join(docsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Document not found: ${slug}`);
  }
  
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * ドキュメントをカテゴリーと順序で分類
 */
function categorizeDoc(slug: string): { category: string; order: number } {
  const categories: Record<string, { category: string; order: number }> = {
    'overview': { category: '📖 Getting Started', order: 1 },
    'authentication': { category: '📖 Getting Started', order: 2 },
    'API': { category: '📚 API Reference', order: 10 },
    'jobs-api': { category: '📚 API Reference', order: 11 },
    'keys-api': { category: '📚 API Reference', order: 12 },
    'webhooks-api': { category: '📚 API Reference', order: 13 },
    'usage-api': { category: '📚 API Reference', order: 14 },
    'plan-api': { category: '📚 API Reference', order: 15 },
    'examples': { category: '💡 Examples', order: 20 },
    'database-schema': { category: '🗄️ Database', order: 30 },
  };

  return categories[slug] || { category: '📄 Other', order: 99 };
}
