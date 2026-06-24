import type { Heading } from "./types";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^(#{1,6})\s+(.+)/);
    if (m) headings.push({ id: slugify(m[2]), text: m[2], level: m[1].length });
  }
  return headings;
}

export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // 1. Protect code blocks with placeholders
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    const escaped = code
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    codeBlocks.push(`<pre class="code-block"><code class="language-${lang}">${escaped}</code></pre>`);
    return `\u0000CB${idx}\u0000`;
  });

  // 2. Escape remaining HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 3. Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    html = html.replace(`\u0000CB${i}\u0000`, codeBlocks[i]);
  }

  // 4. Headings with IDs
  html = html.replace(/^###### (.+)$/gm, (_, t) => `<h6 id="${slugify(t)}">${t}</h6>`);
  html = html.replace(/^##### (.+)$/gm, (_, t) => `<h5 id="${slugify(t)}">${t}</h5>`);
  html = html.replace(/^#### (.+)$/gm, (_, t) => `<h4 id="${slugify(t)}">${t}</h4>`);
  html = html.replace(/^### (.+)$/gm, (_, t) => `<h3 id="${slugify(t)}">${t}</h3>`);
  html = html.replace(/^## (.+)$/gm, (_, t) => `<h2 id="${slugify(t)}">${t}</h2>`);
  html = html.replace(/^# (.+)$/gm, (_, t) => `<h1 id="${slugify(t)}">${t}</h1>`);

  // 5. Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // 6. Inline code (after escaping)
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // 7. Links and images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 8. Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // 9. Tables
  html = html.replace(/^\|(.+)\|\s*\n\|[-:|\s]+\|\s*\n((?:\|.+\|\s*\n?)+)/gm, (_, header, body) => {
    const ths = header.split("|").map((h: string) => h.trim()).filter(Boolean)
      .map((h: string) => `<th>${h}</th>`).join("");
    const rows = body.trim().split("\n").map((row: string) => {
      const cells = row.split("|").map((c: string) => c.trim()).filter(Boolean);
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join("")}</tr>`;
    }).join("");
    return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // 10. HR
  html = html.replace(/^---$/gm, "<hr />");

  // 11. Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, "<ul>$&</ul>");

  // 12. Paragraphs — split by blank lines, wrap non-block lines
  const blockTags = /^(h[1-6]|ul|ol|pre|table|blockquote|hr|li|img|p|td|th|tr|thead|tbody|div|article|section|nav|aside|header|footer)/i;
  const lines = html.split("\n");
  const output: string[] = [];
  let inParagraph = false;
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length) {
      output.push(`<p>${buffer.join(" ")}</p>`);
      buffer = [];
    }
    inParagraph = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      flush();
    } else if (blockTags.test(trimmed)) {
      flush();
      output.push(line);
    } else {
      buffer.push(line);
      inParagraph = true;
    }
  }
  flush();

  return output.join("\n");
}
