import { App, Plugin, PluginSettingTab, Setting, Notice, FileSystemAdapter } from "obsidian";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

interface GitbookSettings {
  port: number;
  siteTitle: string;
}

const DEFAULT_SETTINGS: GitbookSettings = {
  port: 3000,
  siteTitle: "My Gitbook",
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "") || "untitled";
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export default class GitbookPlugin extends Plugin {
  settings: GitbookSettings;
  private server: http.Server | null = null;
  private pluginDir = "";

  async onload() {
    await this.loadSettings();
    // Get vault base path via adapter
    const adapter = this.app.vault.adapter as FileSystemAdapter;
    let vaultBase = "";
    if ((adapter as any).basePath) {
      vaultBase = (adapter as any).basePath;
    } else if (typeof (adapter as any).getBasePath === "function") {
      vaultBase = (adapter as any).getBasePath();
    } else {
      // Last resort: use vault name as subdir of home
      vaultBase = path.join(process.env.HOME || "/home/rosfandy", "myfiles/vault");
    }
    this.pluginDir = path.join(vaultBase, ".obsidian/plugins/obsidian-book");

    this.addCommand({
      id: "start-server",
      name: "Start Gitbook Server",
      callback: () => this.startServer(),
    });

    this.addCommand({
      id: "stop-server",
      name: "Stop Gitbook Server",
      callback: () => this.stopServer(),
    });

    this.addSettingTab(new GitbookSettingTab(this.app, this));
  }

  onunload() {
    this.stopServer();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  stopServer() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  startServer() {
    this.stopServer();

    const vault = this.app.vault;
    const distDir = path.join(this.pluginDir, "web-dist");

    const getPages = () => {
      return vault.getMarkdownFiles().map((f) => ({
        slug: slugify(f.basename),
        title: f.basename,
        path: f.path,
      })).sort((a, b) => a.title.localeCompare(b.title));
    };

    const serveStatic = (filePath: string, res: http.ServerResponse) => {
      try {
        const data = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        return false;
      }
      return true;
    };

    this.server = http.createServer(async (req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${this.settings.port}`);
      const pname = url.pathname;

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      // DEBUG: check what distDir resolves to
      if (pname === "/debug") {
        const exists = (p: string) => { try { fs.accessSync(p); return "✓"; } catch { return "✗"; } };
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`pluginDir: ${this.pluginDir} (${exists(this.pluginDir)})\ndistDir: ${distDir} (${exists(distDir)})\nindex.html: (${exists(path.join(distDir, "index.html"))})\napp.js: (${exists(path.join(distDir, "app.js"))})\n`);
        return;
      }

      try {
        // API: list pages
        if (pname === "/api/pages") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(getPages()));
          return;
        }

        // API: single page
        const pageMatch = pname.match(/^\/api\/page\/(.+)$/);
        if (pageMatch) {
          const slug = pageMatch[1];
          const pages = getPages();
          const page = pages.find((p) => p.slug === slug);
          if (!page) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not found" }));
            return;
          }
          const file = vault.getMarkdownFiles().find((f) => f.path === page.path);
          if (!file) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not found" }));
            return;
          }
          const content = await vault.read(file);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ slug, title: page.title, content }));
          return;
        }

        // Static files from web-dist
        const staticPath = pname === "/" ? "/index.html" : pname;
        const filePath = path.join(distDir, staticPath.replace(/^\//, ""));
        if (serveStatic(filePath, res)) return;

        // Fallback: serve index.html for client-side routing
        const indexPath = path.join(distDir, "index.html");
        if (serveStatic(indexPath, res)) return;

        // 404
        res.writeHead(404);
        res.end("Not found");
      } catch (err) {
        res.writeHead(500);
        res.end("Server error");
      }
    });

    this.server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        new Notice(`Port ${this.settings.port} is in use. Try a different port.`);
      }
    });

    this.server.listen(this.settings.port, () => {
      new Notice(`📖 Gitbook running at http://localhost:${this.settings.port}`);
    });
  }
}

class GitbookSettingTab extends PluginSettingTab {
  plugin: GitbookPlugin;

  constructor(app: App, plugin: GitbookPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Port")
      .setDesc("Web server port")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.port))
          .onChange(async (v) => {
            this.plugin.settings.port = parseInt(v) || 3000;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Site title")
      .setDesc("Title shown in sidebar")
      .addText((text) =>
        text
          .setPlaceholder("My Gitbook")
          .setValue(this.plugin.settings.siteTitle)
          .onChange(async (v) => {
            this.plugin.settings.siteTitle = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Server")
      .addButton((btn) =>
        btn
          .setIcon("play")
          .setTooltip("Start")
          .onClick(() => this.plugin.startServer())
      )
      .addButton((btn) =>
        btn
          .setIcon("x")
          .setTooltip("Stop")
          .onClick(() => this.plugin.stopServer())
      );
  }
}
