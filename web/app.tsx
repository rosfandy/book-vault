import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ContentArea } from "./components/ContentArea";
import { TableOfContents } from "./components/TableOfContents";
import { ThemeToggle } from "./components/ThemeToggle";
import { SearchModal } from "./components/SearchModal";
import { useTheme } from "./hooks/useTheme";
import { usePages, usePage } from "./hooks/usePages";
import { extractHeadings } from "./lib/markdown";

export default function App() {
  const { theme, setTheme } = useTheme();
  const { pages, loading: pagesLoading } = usePages();
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { page, loading: pageLoading } = usePage(currentSlug);

  // Read slug from URL on mount
  useEffect(() => {
    const slug = window.location.pathname.replace(/^\//, "") || null;
    setCurrentSlug(slug);
  }, []);

  // Update URL when navigating
  const navigate = useCallback((slug: string) => {
    setCurrentSlug(slug);
    window.history.pushState(null, "", `/${slug}`);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handler = () => {
      const slug = window.location.pathname.replace(/^\//, "") || null;
      setCurrentSlug(slug);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const headings = page ? extractHeadings(page.content) : [];
  const siteTitle = "My Gitbook";

  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      <Sidebar
        pages={pages}
        currentSlug={currentSlug || ""}
        onNavigate={navigate}
        siteTitle={siteTitle}
      />

      <main className="flex-1 ml-64 relative min-h-screen flex flex-col">
        <TopBar
          siteTitle={siteTitle}
          onSearchOpen={() => setSearchOpen(true)}
        />

        <div className="flex flex-1">
          <ContentArea
            title={page?.title || ""}
            content={page?.content || ""}
            loading={pageLoading || pagesLoading}
            headings={headings}
          />
          <TableOfContents headings={headings} />
        </div>
      </main>

      {searchOpen && (
        <SearchModal
          pages={pages}
          onClose={() => setSearchOpen(false)}
          onSelect={navigate}
        />
      )}

      <ThemeToggle theme={theme} setTheme={setTheme} />
    </div>
  );
}
