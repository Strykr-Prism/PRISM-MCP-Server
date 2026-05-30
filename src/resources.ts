import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * MCP resources for passive, app-loaded context — data an agent host can load
 * without spending a tool call. These are intentionally dependency-free
 * (no upstream API call at read time) so they never fail or add latency:
 *
 *   prism://capabilities  — what PRISM is, base URL, and how to authenticate
 *   prism://asset-types   — the canonical asset-type taxonomy
 *   prism://tools         — the live tool catalog (names, titles, annotations)
 */

const BASE_URL = process.env.PRISM_API_URL || "https://api.prismapi.ai";

const ASSET_TYPES = [
  { type: "crypto", description: "Cryptocurrencies and tokens (native + contract-addressed across chains)" },
  { type: "stock", description: "Public equities / shares" },
  { type: "etf", description: "Exchange-traded funds" },
  { type: "index", description: "Market indexes (e.g. S&P 500, Nasdaq 100)" },
  { type: "commodity", description: "Commodities (energy, metals, agriculture)" },
  { type: "forex", description: "Foreign-exchange currency pairs" },
  { type: "defi", description: "DeFi pools, protocols, and yield positions" },
  { type: "prediction", description: "Prediction-market contracts (Polymarket, Kalshi, etc.)" },
  { type: "sports", description: "Sports events and betting markets" },
];

const CAPABILITIES = {
  name: "PRISM",
  description:
    "The canonical data layer for financial assets — resolve any ticker, contract, or symbol to a single source of truth across crypto, equities, and DeFi.",
  base_url: BASE_URL,
  docs: `${BASE_URL}/docs`,
  llms_txt: `${BASE_URL}/llms.txt`,
  auth: {
    scheme: "X-API-Key header",
    instant_key: `GET ${BASE_URL}/auth/keys/instant — free agent-tier key, no signup (5 req/min, 100/day)`,
  },
  usage:
    "Tools are the primary surface. Resolve a symbol first (resolve_asset / batch_resolve), then chain into price, technicals, news, etc. Read the prism://tools resource for the full catalog.",
};

function json(uri: URL, data: unknown) {
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function registerResources(server: McpServer) {
  server.registerResource(
    "capabilities",
    "prism://capabilities",
    {
      title: "PRISM Capabilities",
      description: "Overview of the PRISM API: purpose, base URL, and how to authenticate.",
      mimeType: "application/json",
    },
    async (uri) => json(uri, CAPABILITIES),
  );

  server.registerResource(
    "asset-types",
    "prism://asset-types",
    {
      title: "Asset Type Taxonomy",
      description: "The canonical set of asset types PRISM resolves and the meaning of each.",
      mimeType: "application/json",
    },
    async (uri) => json(uri, { asset_types: ASSET_TYPES }),
  );

  server.registerResource(
    "tools",
    "prism://tools",
    {
      title: "PRISM Tool Catalog",
      description: "Live list of every PRISM MCP tool with its title, description, and annotations.",
      mimeType: "application/json",
    },
    async (uri) => {
      const registered =
        (server as unknown as { _registeredTools?: Record<string, any> })._registeredTools ?? {};
      const tools = Object.entries(registered)
        .filter(([, t]) => t?.enabled !== false)
        .map(([name, t]) => ({
          name,
          title: t.title,
          description: t.description,
          annotations: t.annotations,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return json(uri, { count: tools.length, tools });
    },
  );
}
