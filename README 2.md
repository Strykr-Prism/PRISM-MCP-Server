# PRISM MCP Server v2.0.0

> **Comprehensive financial intelligence for AI agents**

MCP (Model Context Protocol) server exposing **100+ financial data tools** powered by the [PRISM OS SDK](https://github.com/Strykr-Prism/PRISM-OS-SDK). Works with Claude Desktop, Cursor IDE, and any MCP-compatible client.

**218 API endpoints** across crypto, stocks, DeFi, macro, predictions, sports, and more — all in one unified interface.

---

## Quick Start

```bash
git clone https://github.com/Strykr-Prism/PRISM-MCP-Server.git
cd PRISM-MCP-Server
npm install
npm run build
```

### For Cursor IDE

The PRISM MCP Server is packaged as a Cursor plugin. Install it via:

1. Copy the `cursor-plugin/` directory to your Cursor plugins folder
2. Set your `PRISM_API_KEY` environment variable
3. Restart Cursor
4. The plugin will be available with 100+ tools + MCP resources

### For Claude Desktop

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

---

## Tools Overview (100+)

| Domain | Tools | Description |
|--------|-------|-------------|
| **Resolution** | 2 | Canonical asset identity resolution |
| **Crypto** | 4 | Prices, trending, market overview |
| **Stocks** | 23 | Quotes, fundamentals, earnings, ratings, DCF, movers |
| **ETFs** | 3 | Popular ETFs, holdings, sector weights |
| **Forex** | 2 | Live rates, tradeable forms |
| **Commodities** | 2 | Live prices, tradeable forms |
| **Historical** | 6 | OHLCV, volume, returns, volatility, comparisons |
| **Calendar** | 3 | Earnings and economic event calendars |
| **Technicals** | 8 | RSI, MACD, support/resistance, trend, correlations |
| **Signals** | 5 | Momentum, volume spikes, breakouts, divergence |
| **Risk** | 3 | Volatility, VaR, Sharpe, portfolio risk |
| **Order Book** | 4 | Depth, spread, imbalance |
| **Trades** | 2 | Recent and large trades |
| **DeFi** | 3 | Yields, protocols, gas |
| **Onchain** | 3 | Whale movements, exchange flows, wallet balances |
| **Social** | 5 | Sentiment, mentions, GitHub activity |
| **Analysis** | 3 | Asset intelligence (forks, bridges, copycats) |
| **News** | 2 | Crypto and stock news with sentiment |
| **Macro** | 1 | Fed rate, inflation, GDP, treasury yields |
| **Predictions** | 2 | Polymarket, Kalshi, Manifold markets |
| **Sports** | 7 | Live scores, event details, odds |
| **Odds** | 6 | Arbitrage, odds comparison, best odds |
| **Developer** | 1 | API health and key verification |
| **Scaffold** | 1 | Agent scaffolding utilities |

**Total: 100+ tools**

---

## Example Prompts

### Crypto
- "What's the price of Bitcoin?"
- "Show me the trending crypto assets"
- "Get the market overview with fear & greed index"

### Stocks
- "Get AAPL stock quote"
- "Show me the fundamentals for Tesla"
- "What are the latest insider trades for NVDA?"
- "Calculate DCF valuation for Microsoft with 15% growth rate"
- "Show me the top stock gainers today"

### DeFi
- "Show me the top DeFi yields on Arbitrum with at least 10% APY"
- "What are the current gas prices across all chains?"
- "Get the wallet balances for 0x..."

### Technical Analysis
- "Run technical analysis on ETH on the 4h timeframe"
- "Get RSI and MACD for AAPL"
- "Detect volume spikes and breakouts across all assets"
- "Get support and resistance levels for BTC"

### Risk
- "Calculate portfolio risk for: 50% BTC, 30% ETH, 20% SOL"
- "Get the Value at Risk for TSLA with 95% confidence"
- "Calculate volatility for AAPL over the last 30 days"

### Macro
- "Get the macro summary — are we in an inverted yield curve?"
- "What's the current Fed rate and inflation?"
- "Show me the treasury yield curve"

### Predictions
- "What are the trending prediction markets?"
- "Search for markets about the 2024 election"

### Sports
- "Show me tonight's NBA games"
- "Find arbitrage opportunities in NFL betting"
- "Compare odds across sportsbooks for the next Lakers game"

---

## MCP Resources (Passive Data)

Access frequently-used data without explicit tool invocation:

| Resource URI | Description | Update Frequency |
|--------------|-------------|------------------|
| `prism://market/overview` | Global crypto market snapshot | 5 min |
| `prism://market/fear-greed` | Fear & Greed Index | 1 hour |
| `prism://crypto/trending` | Trending crypto assets | 5 min |
| `prism://defi/top-yields` | Top DeFi yields | 5 min |
| `prism://defi/tvl` | Total Value Locked | 5 min |
| `prism://gas/prices` | Gas prices across chains | 15 sec |
| `prism://macro/summary` | Macro dashboard | 1 hour |
| `prism://news/crypto` | Latest crypto news | 5 min |
| `prism://news/stocks` | Latest stock news | 5 min |
| `prism://stocks/gainers` | Top stock gainers | 1 min |
| `prism://stocks/losers` | Top stock losers | 1 min |
| `prism://stocks/indexes` | Major market indexes | 1 min |
| `prism://predictions/trending` | Trending prediction markets | 5 min |
| `prism://api/health` | API health status | 1 min |

---

## Changelog

### v2.0.0 (2026-02-25)

**Major Release: 100+ Tools**

Expanded from 21 tools to 100+ tools covering the full PRISM API (218 endpoints).

**New Tool Categories:**
- **Stocks** (23 tools): Quotes, fundamentals, financials, earnings, dividends, splits, filings, insider trades, institutional holders, analyst ratings, DCF valuation, market movers, indexes
- **ETFs** (3 tools): Popular ETFs, holdings, sector weights
- **Forex** (2 tools): Live rates, tradeable forms
- **Commodities** (2 tools): Live prices, tradeable forms
- **Historical** (6 tools): OHLCV data, volume, metrics, returns, volatility, asset comparisons
- **Calendar** (3 tools): Earnings calendar, economic calendar
- **Technicals** (8 tools): Full TA, indicators (RSI, MACD), support/resistance, trend analysis, FX/commodity TA, benchmark comparison, correlations
- **Signals** (5 tools): Momentum signals, volume spikes, breakout detection, divergence detection, signal summary
- **Risk** (3 tools): Risk metrics, VaR calculation, portfolio risk analysis
- **Order Book** (4 tools): Order book data, depth, spread, imbalance
- **Trades** (2 tools): Recent trades, large trades
- **Social** (5 tools): Sentiment, mentions, trending score, GitHub activity, trending tokens
- **Sports** (7 tools): Sports list, events, event details, odds, resolution, search, sportsbooks
- **Odds** (6 tools): Arbitrage finder, event arbitrage, odds comparison, odds history, best odds, platforms

**Enhancements:**
- Added 80+ render hints for UI component recommendations
- MCP resources for passive data access (20+ resources)
- Cursor plugin packaging (manifest, skills, rules)
- Comprehensive documentation with example prompts
- TypeScript build optimizations
- Improved error handling and type safety

**Breaking Changes:**
- Bumped version to 2.0.0 in server
- Some resource APIs temporarily disabled pending MCP SDK stabilization

---

## Architecture

```
Cursor/Claude → PRISM MCP Server → prism-os SDK → api.prismapi.ai
                 (100+ tools)       (218 endpoints)   (REST API)
```

All tools use the [prism-os SDK](https://github.com/Strykr-Prism/PRISM-OS-SDK) which provides:
- Typed interfaces for all 218 endpoints
- Intelligent caching (prices: 10-15s, fundamentals: 1h, static: 24h)
- Consistent error handling
- Cross-asset normalization (crypto, stocks, ETFs, forex, commodities)

---

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Start server
npm start
```

---

## Authentication

Get your PRISM API key at [prismapi.ai](https://prismapi.ai).

Set it as an environment variable:
```bash
export PRISM_API_KEY="prism_sk_your_key_here"
```

---

## Related Projects

- **PRISM OS SDK** - TypeScript SDK for PRISM API (218 endpoints)
- **Strykr-Prism-API-Developer-Dashboard** - Developer portal at prismapi.ai
- **Strykr-Prism-Fast-API** - Core API backend at api.prismapi.ai

---

## License

MIT © Strykr
