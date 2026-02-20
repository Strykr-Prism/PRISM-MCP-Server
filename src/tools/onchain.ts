import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { prism } from "../client.js";

export function registerOnchainTools(server: McpServer) {
  server.tool(
    "whale_movements",
    "Track large whale transactions for a given contract address. Shows big transfers, exchange deposits/withdrawals.",
    {
      address: z.string().describe("Contract or wallet address to monitor"),
      chain: z.string().optional().describe("Chain (e.g. 'ethereum', 'solana')"),
      min_value_usd: z.number().optional().describe("Minimum transaction value in USD"),
      limit: z.number().optional().describe("Max results"),
    },
    async ({ address, chain, min_value_usd, limit }) => {
      const result = await prism.onchain.getWhaleMovements(address, { chain, min_value_usd, limit });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "exchange_flows",
    "Get exchange inflow/outflow data for an asset. Shows net deposits and withdrawals from exchanges.",
    {
      symbol: z.string().describe("Asset symbol (e.g. 'BTC', 'ETH')"),
      address: z.string().describe("Contract address of the token"),
      chain: z.string().optional().describe("Chain name"),
      period: z.string().optional().describe("Time period (e.g. '24h', '7d')"),
    },
    async ({ symbol, address, chain, period }) => {
      const result = await prism.onchain.getExchangeFlows(symbol, address, { chain, period });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "wallet_balances",
    "Get all token balances for a wallet address across chains.",
    {
      address: z.string().describe("Wallet address"),
      chain: z.string().optional().describe("Filter by chain"),
      min_value_usd: z.number().optional().describe("Minimum token value in USD"),
      exclude_spam: z.boolean().optional().describe("Exclude spam tokens"),
      limit: z.number().optional().describe("Max results"),
    },
    async ({ address, chain, min_value_usd, exclude_spam, limit }) => {
      const result = await prism.defi.getWalletBalances(address, {
        chain,
        min_value_usd,
        exclude_spam,
        limit,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
