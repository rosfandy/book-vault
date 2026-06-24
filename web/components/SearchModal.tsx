import { useEffect, useRef, useState } from "react";
import type { Page } from "../lib/types";

interface SearchModalProps {
  pages: Page[];
  onClose: () => void;
  onSelect: (slug: string) => void;
}

export function SearchModal({ pages, onClose, onSelect }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const results = query.trim()
    ? pages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : pages.slice(0, 10);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, results.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && results[selected]) {
        onSelect(results[selected].slug);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [results, selected, onClose, onSelect]);

  useEffect(() => { setSelected(0); }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-sidebar-bg border border-border-gray rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-gray">
          <svg className="w-5 h-5 text-text-dim flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            className="flex-1 bg-transparent text-text-primary placeholder-text-dim outline-none text-sm"
          />
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-text-dim font-mono">Esc</kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-text-dim">No results found</li>
          ) : (
            results.map((p, i) => (
              <li key={p.slug}>
                <button
                  onClick={() => { onSelect(p.slug); onClose(); }}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                    i === selected ? "bg-accent-blue/20 text-accent-blue" : "text-text-dim hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {p.title}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
