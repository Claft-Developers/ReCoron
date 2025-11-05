'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body" style={{
      color: '#e5e5e5',
    }}>
      <style jsx global>{`
        .markdown-body h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }

        .markdown-body h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }

        .markdown-body h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .markdown-body h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .markdown-body p {
          margin-top: 1rem;
          margin-bottom: 1rem;
          line-height: 1.75;
        }

        .markdown-body a {
          color: #60a5fa;
          text-decoration: none;
        }

        .markdown-body a:hover {
          text-decoration: underline;
        }

        .markdown-body code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Courier New', Courier, monospace;
        }

        .markdown-body pre {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .markdown-body pre code {
          background-color: transparent;
          padding: 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .markdown-body th,
        .markdown-body td {
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem;
          text-align: left;
        }

        .markdown-body th {
          background-color: rgba(255, 255, 255, 0.05);
          font-weight: 600;
        }

        .markdown-body tr:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .markdown-body ul,
        .markdown-body ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 2rem;
        }

        .markdown-body li {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .markdown-body blockquote {
          border-left: 4px solid rgba(255, 255, 255, 0.2);
          padding-left: 1rem;
          margin-left: 0;
          margin-top: 1rem;
          margin-bottom: 1rem;
          color: #a3a3a3;
        }

        .markdown-body hr {
          border: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .markdown-body strong {
          font-weight: 600;
        }

        .markdown-body em {
          font-style: italic;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
