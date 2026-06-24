# Contributing to Obsidian Book

Thanks for your interest in contributing!

## Getting Started

1. Fork the repo
2. Clone your fork
3. Run `npm install` (or `bun install`)
4. Run `npm run dev` for development builds

## Development

- `main.ts` — Obsidian plugin entry point
- `web/` — React-based web UI served by the plugin
- `server.ts` — Local dev server
- `build-web.ts` — Web build script

To build everything: `npm run build-all`

## Pull Requests

- Keep changes focused — one feature/fix per PR
- Test your changes in an actual Obsidian vault before submitting
- Update `manifest.json` version if needed
- No unrequested dependencies

## Issues

Report bugs and feature requests on the [issue tracker](https://github.com/rosfandy/obsidian-book-plugin/issues).
