# PRISM MCP Server

MCP (Model Context Protocol) server that exposes 21 financial-data tools powered by the [PRISM OS SDK](https://github.com/Strykr-Prism/PRISM-OS-SDK). Works with Claude Desktop, Claude Code, and any MCP-compatible client.

## Installation

```bash
git clone https://github.com/Strykr-Prism/PRISM-MCP-Server.git
cd PRISM-MCP-Server
npm install
npm run build
```

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prism-os": {
      "command": "node",
      "args": ["/absolute/path/to/PRISM-MCP-Server/dist/index.js"],
      "env": {
        "PRISM_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

Add to `.claude/settings.json` or run:

```bash
claude mcp add prism-os node /absolute/path/to/PRISM-MCP-Server/dist/index.js -e PRISM_API_KEY=your-api-key
```

## Tools (21 total)

### Resolution (2 tools)

| Tool | Description |
|------|-------------|
| `resolve_asset` | Resolve any ticker, name, or contract address to a canonical PRISM asset |
| `batch_resolve` | Resolve multiple symbols at once |

### Market Data (4 tools)

| Tool | Description |
|------|-------------|
| `get_price` | Get consensus crypto price aggregated across sources |
| `get_trending` | Get trending crypto assets by volume and social buzz |
| `market_overview` | Full market overview: global stats, fear & greed, gainers/losers |
| `get_stock_quote` | Get real-time stock quote with price, change, volume |

### DeFi (3 tools)

| Tool | Description |
|------|-------------|
| `get_yields` | Top DeFi yield opportunities across chains |
| `get_protocols` | List DeFi protocols with TVL and category info |
| `get_gas` | Current gas prices across all supported chains |

### On-Chain (3 tools)

| Tool | Description |
|------|-------------|
| `whale_movements` | Track large whale transactions for an address |
| `exchange_flows` | Exchange inflow/outflow data for an asset |
| `wallet_balances` | All token balances for a wallet address |

### Analysis (3 tools)

| Tool | Description |
|------|-------------|
| `technical_analysis` | Full TA: trend, RSI, MACD, MAs, volume signals |
| `get_signals` | Trading signals: momentum, volume spikes, breakouts, divergences |
| `get_risk` | Risk metrics: volatility, Sharpe, max drawdown, beta, VaR |

### News & Social (2 tools)

| Tool | Description |
|------|-------------|
| `get_news` | Latest crypto and stock news with sentiment |
| `social_sentiment` | Social media sentiment, mentions, and trending score |

### Predictions (2 tools)

| Tool | Description |
|------|-------------|
| `prediction_markets` | Trending prediction markets (Polymarket, Kalshi, Manifold) |
| `search_predictions` | Search prediction markets by query |

### Macro (1 tool)

| Tool | Description |
|------|-------------|
| `macro_summary` | Macro dashboard: Fed rate, inflation, GDP, treasuries, yield curve |

### Developer (1 tool)

| Tool | Description |
|------|-------------|
| `api_health` | Check PRISM API health and service status |

## Example Prompts

- "What's the price of Bitcoin right now?"
- "Show me the top DeFi yields on Arbitrum with at least 10% APY"
- "Run technical analysis on ETH on the 4h timeframe"
- "What are the trending prediction markets?"
- "Get the macro summary — are we in an inverted yield curve?"
- "Show me whale movements for this address: 0x..."
- "What's the social sentiment for SOL?"

## License

MIT
