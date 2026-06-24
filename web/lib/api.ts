import type { Page, PageContent } from "./types";

const BASE = "";

export async function getPages(): Promise<Page[]> {
  const res = await fetch(`${BASE}/api/pages`);
  if (!res.ok) throw new Error("Failed to fetch pages");
  return res.json();
}

export async function getPage(slug: string): Promise<PageContent> {
  const res = await fetch(`${BASE}/api/page/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch page");
  return res.json();
}
