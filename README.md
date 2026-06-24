# Vault Book

Turn your Obsidian vault into a Gitbook-like website.

Edit notes in Obsidian, see them live in the browser. No export, no build step — just save and refresh.

## Preview

| Light | Dark | Search |
|-------|------|--------|
| ![Light](https://ik.imagekit.io/mesifer/vault-book/page.png) | ![Dark](https://ik.imagekit.io/mesifer/vault-book/dark.png) | ![Search](https://ik.imagekit.io/mesifer/vault-book/search-feat.png?updatedAt=1782317806170) |

## Features

- **Live web server** — starts from within Obsidian
- **Gitbook-style UI** — sidebar nav, table of contents, search
- **Dark/Light/System theme** — toggleable
- **Auto-collapsible sidebar** — grouped by folder
- **Smooth scroll TOC** — with active heading indicator
- **Full-text search** — press `Ctrl+K`

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings → Community Plugins
2. Search for "Vault Book"
3. Install and enable

### Manual (BRAT)

Add `rosfandy/vault-book` via the BRAT plugin.

## Usage

1. Enable the plugin in settings
2. Run **"Start Vault Book Server"** from the command palette
3. Open `http://localhost:3000` in your browser
4. Edit any note in Obsidian → refresh browser to see changes

## Development

```bash
git clone https://github.com/rosfandy/vault-book.git
cd vault-book
bun install
bun run build-all
```

Build the React app + plugin:

```bash
bun run build-all
```

## Project Structure

```
├── main.ts           # Obsidian plugin (HTTP server + API)
├── web/              # React app source
│   ├── app.tsx
│   ├── components/
│   ├── hooks/
│   └── lib/
├── build-web.ts      # esbuild script for React app
├── esbuild.config.mjs # esbuild script for plugin
└── manifest.json
```

## License

MIT
