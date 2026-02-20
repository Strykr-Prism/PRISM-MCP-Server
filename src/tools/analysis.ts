import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";

export function registerAnalysisTools(server: McpServer) {
  server.tool(
    "technical_analysis",
    "Run full technical analysis on any asset: trend, RSI, MACD, moving averages, volume signals, and summary.",
    {
      symbol: z.string().describe("Asset symbol (e.g. 'BTC', 'AAPL', 'EUR/USD')"),
      timeframe: z.string().optional().describe("Timeframe (e.g. '1d', '4h', '1h'). Default: '1d'"),
    },
    async ({ symbol, timeframe }) => {
      const result = await prism.technicals.analyze(symbol, timeframe);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_signals",
    "Get trading signals across momentum, volume spikes, breakouts, and divergences.",
    {
      symbols: z.string().optional().describe("Comma-separated symbols to scan, or omit for all"),
    },
    async ({ symbols }) => {
      const result = await prism.signals.getSummary(symbols);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_risk",
    "Get risk metrics for an asset: volatility, Sharpe ratio, max drawdown, beta, and Value-at-Risk.",
    {
      symbol: z.string().describe("Asset symbol"),
      period: z.number().optional().describe("Lookback period in days"),
    },
    async ({ symbol, period }) => {
      const result = await prism.risk.getMetrics(symbol, { period });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
