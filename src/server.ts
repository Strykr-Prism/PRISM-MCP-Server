import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerResolutionTools } from "./tools/resolution.js";
import { registerMarketTools } from "./tools/market.js";
import { registerDefiTools } from "./tools/defi.js";
import { registerOnchainTools } from "./tools/onchain.js";
import { registerNewsTools } from "./tools/news.js";
// NOTE: tools/analysis.ts is intentionally NOT registered — its three tools
// (technical_analysis, get_signals, get_risk) are the canonical versions in the
// dedicated technicals.ts / signals.ts / risk.ts modules. Registering both made
// the SDK throw "Tool ... is already registered" and the server failed to boot.
import { registerPredictionTools } from "./tools/predictions.js";
import { registerMacroTools } from "./tools/macro.js";
import { registerDeveloperTools } from "./tools/developer.js";
import { registerScaffoldTools } from "./tools/scaffold.js";
// New tool modules
import { registerStockTools } from "./tools/stocks.js";
import { registerETFTools } from "./tools/etfs.js";
import { registerForexTools } from "./tools/forex.js";
import { registerCommodityTools } from "./tools/commodities.js";
import { registerHistoricalTools } from "./tools/historical.js";
import { registerCalendarTools } from "./tools/calendar.js";
import { registerTechnicalsTools } from "./tools/technicals.js";
import { registerSignalsTools } from "./tools/signals.js";
import { registerRiskTools } from "./tools/risk.js";
import { registerOrderBookTools } from "./tools/orderbook.js";
import { registerTradesTools } from "./tools/trades.js";
import { registerSocialTools } from "./tools/social.js";
import { registerSportsTools } from "./tools/sports.js";
import { registerOddsTools } from "./tools/odds.js";
import { registerResources } from "./resources.js";

/** snake_case / kebab-case tool name → human-friendly Title Case. */
function toTitle(name: string): string {
  return name
    .split(/[_-]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "prism-os",
    version: "2.0.0",
  });

  // ── MCP spec modernization (2025-11) ──────────────────────────────────────
  // Enrich every tool's metadata in one place so the per-domain tool modules
  // stay terse and consistent. For each registered tool we:
  //   1. derive a human-friendly `title` from the tool name when none is set
  //      (the spec recommends a display title distinct from the machine `name`);
  //   2. default read-only tools to idempotent + open-world hints — they read
  //      live external market data — while letting any explicit annotation win;
  //   3. mirror each tool's JSON text output as `structuredContent` so hosts and
  //      agents get machine-readable, typed data alongside the human-readable
  //      text (MCP 2025-11 structured outputs), with zero per-tool schema work.
  // New tool modules automatically inherit this; nothing else needs to change.
  const baseRegisterTool = server.registerTool.bind(server);
  (server as unknown as { registerTool: typeof server.registerTool }).registerTool = ((
    name: string,
    config: Record<string, any>,
    handler: any,
  ) => {
    const enriched: Record<string, any> = { ...config };
    if (enriched.title == null) enriched.title = toTitle(name);
    if (enriched.annotations?.readOnlyHint === true) {
      enriched.annotations = {
        idempotentHint: true,
        openWorldHint: true,
        ...enriched.annotations,
      };
    }
    const wrappedHandler = async (...args: any[]) => {
      const result: any = await (handler as (...a: any[]) => any)(...args);
      if (
        result &&
        Array.isArray(result.content) &&
        result.structuredContent === undefined &&
        !result.isError
      ) {
        const textBlock = result.content.find(
          (c: any) => c?.type === "text" && typeof c.text === "string",
        );
        if (textBlock) {
          try {
            const parsed = JSON.parse(textBlock.text);
            // structuredContent must be a JSON object at the top level; wrap
            // arrays/primitives so list-returning tools still validate.
            result.structuredContent =
              parsed && typeof parsed === "object" && !Array.isArray(parsed)
                ? parsed
                : { result: parsed };
          } catch {
            /* output isn't JSON — leave as text-only */
          }
        }
      }
      return result;
    };
    return baseRegisterTool(name, enriched as any, wrappedHandler as any);
  }) as typeof server.registerTool;

  // Original tools (21 tools)
  registerResolutionTools(server);
  registerMarketTools(server);
  registerDefiTools(server);
  registerOnchainTools(server);
  registerNewsTools(server);
  // registerAnalysisTools intentionally omitted — see import note above.
  registerPredictionTools(server);
  registerMacroTools(server);
  registerDeveloperTools(server);
  registerScaffoldTools(server);

  // New tools (80+ tools)
  registerStockTools(server);
  registerETFTools(server);
  registerForexTools(server);
  registerCommodityTools(server);
  registerHistoricalTools(server);
  registerCalendarTools(server);
  registerTechnicalsTools(server);
  registerSignalsTools(server);
  registerRiskTools(server);
  registerOrderBookTools(server);
  registerTradesTools(server);
  registerSocialTools(server);
  registerSportsTools(server);
  registerOddsTools(server);

  // MCP Resources (20+ resources)
  registerResources(server);

  return server;
}
