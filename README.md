# `@prism/mcp-server`

The **MCP server for AI agents that need real-time financial truth.** Drop it
into Claude Desktop, Cursor, ChatGPT, OpenClaw, Hermes, or any MCP host and
your agent inherits every PRISM tool — crypto, equities, on-chain,
prediction markets, and macro — behind one `PRISM_API_KEY`.

- Package: `@prism/mcp-server` · Current: **1.0.1**
- Runtime: Node.js 18+
- Upstream API: <https://api.prismapi.ai>
- Tool surface: **21 financial-data tools**
- Live guide: <https://www.prismapi.ai/quickstart>
- Landing: <https://www.prismapi.ai>

---

## Connect your agent in 30 seconds — pick a path

### 1. One-click install (recommended)

- **Cursor** and **VS Code** support deep-link MCP installs. The buttons on the
  PRISM landing (<https://www.prismapi.ai/#connect>) handle the config write for
  you in a single click.

### 2. Six-line MCP config (any host)

```json
{
  "mcpServers": {
    "prism": {
      "command": "npx",
      "args": ["-y", "@prism/mcp-server"],
      "env": { "PRISM_API_KEY": "prism_sk_..." }
    }
  }
}
```

Paste into your host's MCP config file (Claude Desktop: `claude_desktop_config.json`,
others: their equivalent). Restart the host. Done.

### 3. Instant key — no signup

```bash
curl https://api.prismapi.ai/auth/keys/instant
```

Returns a 7-day `prism_sk_…` key, no account required. Rate limit: 3 keys / hour
per IP. Drop it into the `PRISM_API_KEY` slot above.

### 4. ChatGPT custom GPT

Import the OpenAPI spec directly: <https://api.prismapi.ai/openapi.json> — every
endpoint becomes a callable tool inside a Custom GPT. No MCP needed.

---

## Local development

```bash
git clone https://github.com/Strykr-Prism/PRISM-MCP-Server.git
cd PRISM-MCP-Server
npm install
npm run build
npm start
```

For Claude Desktop pointing at a local build:

```json
{
  "mcpServers": {
    "prism-local": {
      "command": "node",
      "args": ["/absolute/path/to/PRISM-MCP-Server/dist/index.js"],
      "env": { "PRISM_API_KEY": "prism_sk_..." }
    }
  }
}
```

### Environment

- `PRISM_API_KEY` (required)

### Scripts

```bash
npm run dev   # tsc --watch
npm run test  # vitest
```

---

## Promote an instant key into your account

Got a `prism_sk_…` from path 3 above and want its usage to show up in your
PRISM dashboard? Sign up, then paste it into **API Keys → Link Agent Key**:
<https://www.prismapi.ai/dashboard/keys>. The key is now owned by your
account — same `prism_sk_…`, but billing + usage + the 7-day expiry attach
to you.

---

## Notes

- This server depends on the `prism-os` SDK (workspace) — the published
  artifact bundles it via `prepack`, so consumers `npm i` with zero extra deps.
- Keep this README aligned with `package.json` for version + tool-count
  claims. Single source of truth for connect-method ordering is the PRISM
  landing's `ConnectYourAgent` section.
