import { useState, useEffect, useRef } from "react";
import type { Heading } from "../lib/types";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    // Find all heading elements
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    // Observe which heading is most in view
    const visible = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size > 0) {
          // Pick the one with highest intersection ratio
          let bestId = "";
          let bestRatio = 0;
          for (const [id, ratio] of visible) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          }
          if (bestId) setActiveId(bestId);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) {
      console.warn("[TOC] Target not found:", id);
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  if (!headings.length) {
    return (
      <aside className="w-64 pt-24 pr-8 hidden xl:block sticky top-0 h-screen overflow-y-auto">
        <div className="text-[10px] text-text-dim px-4">No headings</div>
      </aside>
    );
  }

  return (
    <aside className="w-64 pt-24 pr-8 hidden xl:block sticky top-0 h-screen overflow-y-auto">
      <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        On this page
      </div>
      <ul className="text-sm space-y-3">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => scrollTo(e, h.id)}
                className={`block transition-all border-l-2 pl-3 ${
                  isActive
                    ? "text-accent-blue border-accent-blue font-medium"
                    : "text-text-dim border-transparent hover:text-text-primary hover:border-border-gray"
                } ${h.level > 2 ? "pl-6" : ""} ${h.level > 3 ? "pl-9" : ""}`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}