import { useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import type { Page } from "../lib/types";

interface SidebarProps {
  pages: Page[];
  currentSlug: string;
  onNavigate: (slug: string) => void;
  siteTitle?: string;
}

export function Sidebar({ pages, currentSlug, onNavigate, siteTitle = "My Gitbook" }: SidebarProps) {
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const grouped: Record<string, Page[]> = {};
  for (const p of pages) {
    const parts = p.path.split("/");
    const group = parts.length > 1 ? parts[0] : "Docs";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(p);
  }

  // Initialize all groups as open from the start
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const g of Object.keys(grouped)) init[g] = true;
    return init;
  });

  const toggle = useCallback((group: string) => {
    const el = contentRefs.current[group];
    const chevron = document.querySelector(`[data-chevron="${group}"]`);
    const isOpen = open[group] ?? true;

    if (isOpen) {
      // Close: animate to 0
      gsap.to(el, { height: 0, duration: 0.2, ease: "power2.in" });
      if (chevron) gsap.to(chevron, { rotate: 0, duration: 0.2 });
    } else {
      // Open: measure and animate
      gsap.fromTo(el, { height: 0 }, { height: el.scrollHeight, duration: 0.25, ease: "power2.out" });
      if (chevron) gsap.to(chevron, { rotate: 180, duration: 0.25 });
    }

    setOpen((prev) => ({ ...prev, [group]: !isOpen }));
  }, [open]);

  return (
    <aside className="w-64 bg-sidebar-bg border-r border-border-gray flex flex-col fixed h-full z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg text-white">
          {siteTitle[0]?.toUpperCase()}
        </div>
        <span className="font-semibold text-text-primary">{siteTitle}</span>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto text-sm space-y-6">
        {Object.entries(grouped).map(([group, groupPages]) => (
          <section key={group}>
            <button
              onClick={() => toggle(group)}
              className="flex items-center gap-2 text-text-dim px-2 py-1 w-full hover:text-text-primary cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span className="uppercase text-xs font-bold tracking-wider">{group}</span>
              <svg
                data-chevron={group}
                className="w-3 h-3 ml-auto"
                fill="currentColor" viewBox="0 0 20 20"
                style={{ transform: open[group] !== false ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            <div
              ref={(el) => { contentRefs.current[group] = el; }}
              className="ml-4 mt-2 border-l border-border-gray pl-4 overflow-hidden"
              style={{ height: open[group] === false ? 0 : undefined }}
            >
              <div className="py-1 space-y-1">
                {groupPages.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => onNavigate(p.slug)}
                    className={`block w-full text-left px-2 py-1.5 rounded text-text-dim hover:text-text-primary transition-colors ${
                      p.slug === currentSlug
                        ? "text-accent-blue font-medium bg-blue-500/10"
                        : ""
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ))}
      </nav>

      <div className="p-4 border-t border-border-gray">
        <div className="flex items-center gap-2 text-text-dim bg-white/5 p-3 rounded-lg border border-white/10 text-xs font-medium">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-4.321 16.321c-.417 0-.756-.34-.756-.756v-7.13c0-.417.34-.756.756-.756s.756.34.756.756v7.13c0 .417-.34.756-.756.756zm8.642-1.512c0 .417-.34.756-.756.756s-.756-.34-.756-.756v-4.106c0-.417.34-.756.756-.756s.756.34.756.756v4.106zm-4.321 2.268c-.417 0-.756-.34-.756-.756v-8.642c0-.417.34-.756.756-.756s.756.34.756.756v8.642c0 .417-.34.756-.756.756z" />
          </svg>
          <span>Inspired by GitBook</span>
        </div>
      </div>
    </aside>
  );
}
