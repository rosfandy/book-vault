import { serve } from "bun";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";

const VAULT = join(import.meta.dir, "../../vault");
const PORT = parseInt(process.env.PORT || "3000");

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "") || "untitled";
}

interface Page {
  slug: string;
  title: string;
}

function getPages(): Page[] {
  const files = readdirSync(VAULT).filter(f => f.endsWith(".md"));
  return files.map(f => {
    const content = readFileSync(join(VAULT, f), "utf-8");
    const title = content.match(/^title:\s*(.+)$/m)?.[1]?.trim() || f.replace(".md", "");
    return { slug: slugify(f.replace(".md", "")), title };
  }).sort((a, b) => a.title.localeCompare(b.title));
}

function renderSidebar(pages: Page[], current: string): string {
  return `<ul>${pages.map(p =>
    `<li><a href="/${p.slug}"${p.slug === current ? ' class="active"' : ""}>${p.title}</a></li>`
  ).join("\n")}</ul>`;
}

function renderPage(slug: string): string {
  const file = readdirSync(VAULT).find(f => slugify(f.replace(".md", "")) === slug);
  if (!file) {
    const pages = getPages();
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not Found - My Gitbook</title><link rel="stylesheet" href="/styles.css"></head>
<body><div class="book"><nav class="book-summary"><div class="book-title">My Gitbook</div>${renderSidebar(pages, "")}</nav>
<div class="book-body"><div class="body-inner"><div class="page-content"><h1>Not Found</h1><p>Page not found.</p></div></div></div></div></body></html>`;
  }
  const md = readFileSync(join(VAULT, file), "utf-8");
  const title = md.match(/^title:\s*(.+)$/m)?.[1]?.trim() || file.replace(".md", "");
  const body = md.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const html = marked(body);
  const pages = getPages();
  const sidebar = renderSidebar(pages, slug);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - My Gitbook</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="book">
    <nav class="book-summary">
      <div class="book-title">My Gitbook</div>
      ${sidebar}
    </nav>
    <div class="book-body">
      <div class="body-inner">
        <div class="page-content">${html}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const CSS = `:root{--sidebar-bg:#f5f5f5;--sidebar-width:300px;--link-color:#4183c4}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;color:#333}
.book{display:flex;min-height:100vh}
.book-summary{width:var(--sidebar-width);background:var(--sidebar-bg);border-right:1px solid #e0e0e0;padding:20px 0;position:fixed;top:0;left:0;height:100vh;overflow-y:auto}
.book-title{font-size:1.2em;font-weight:700;padding:10px 20px 20px;border-bottom:1px solid #e0e0e0;margin-bottom:10px}
.book-summary ul{list-style:none}
.book-summary li a{display:block;padding:8px 20px;color:#555;text-decoration:none;font-size:14px}
.book-summary li a:hover,.book-summary li a.active{color:var(--link-color);background:#e8e8e8}
.book-body{margin-left:var(--sidebar-width);flex:1}
.body-inner{padding:40px 60px;max-width:800px}
.page-content h1{font-size:2em;margin:0 0 20px;border-bottom:1px solid #eee;padding-bottom:10px}
.page-content h2{font-size:1.5em;margin:30px 0 15px}
.page-content h3{font-size:1.25em;margin:25px 0 10px}
.page-content p{margin:0 0 15px}
.page-content a{color:var(--link-color);text-decoration:none}
.page-content a:hover{text-decoration:underline}
.page-content code{background:#f0f0f0;padding:2px 5px;border-radius:3px;font-size:0.9em}
.page-content pre{background:#f8f8f8;padding:15px;border-radius:4px;overflow-x:auto;margin:0 0 15px}
.page-content pre code{background:none;padding:0}
.page-content blockquote{border-left:4px solid var(--link-color);padding:0 15px;color:#666;margin:0 0 15px}
`;

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/styles.css") return new Response(CSS, { headers: { "Content-Type": "text/css" } });
    if (url.pathname === "/") return new Response(renderPage("introduction"), { headers: { "Content-Type": "text/html" } });
    const slug = url.pathname.slice(1);
    return new Response(renderPage(slug), { headers: { "Content-Type": "text/html" } });
  },
});

console.log(`📖 Gitbook server running at http://localhost:${PORT}`);
