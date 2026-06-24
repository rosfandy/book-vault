import type { Heading } from "../lib/types";
import { markdownToHtml } from "../lib/markdown";

interface ContentAreaProps {
  title: string;
  content: string;
  loading: boolean;
  headings: Heading[];
}

export function ContentArea({ title, content, loading, headings }: ContentAreaProps) {
  const html = content ? markdownToHtml(content) : "";

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-10 py-12 lg:px-24">
        <div className="max-w-4xl animate-pulse space-y-4">
          <div className="h-10 bg-white/5 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-1/2" />
          <div className="mt-8 space-y-3">
            <div className="h-4 bg-white/5 rounded" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
            <div className="h-4 bg-white/5 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center px-10">
        <div className="text-center text-text-dim">
          <p className="text-lg mb-2">Select a page from the sidebar</p>
          <p className="text-sm">Or press <kbd className="bg-white/10 px-2 py-1 rounded font-mono">Ctrl K</kbd> to search</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-10 py-12 lg:px-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-accent-blue font-mono gap-1 mb-8 uppercase tracking-wider">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          Docs
        </div>

        {/* Page header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text-primary">{title}</h1>
        </header>

        {/* Content */}
        <article
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
