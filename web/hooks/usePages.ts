import { useEffect, useState, useMemo } from "react";
import { getPage, getPages } from "../lib/api";
import type { Page, PageContent } from "../lib/types";

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPages()
      .then(setPages)
      .finally(() => setLoading(false));
  }, []);

  return { pages, loading };
}

export function usePage(slug: string | null) {
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      setPage(null);
      return;
    }
    setLoading(true);
    setPage(null);
    getPage(slug)
      .then(setPage)
      .finally(() => setLoading(false));
  }, [slug]);

  return { page, loading };
}

export function useSearch(pages: Page[]) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return pages
      .filter((p) => p.title.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query, pages]);

  return { query, setQuery, results };
}