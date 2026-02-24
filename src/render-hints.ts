/**
 * PRISM Render Hints — UI metadata for every MCP tool.
 *
 * Agents read these hints from `_meta['x-prism-ui']` (tool listing)
 * or `_ui` (embedded in the JSON response payload) and use them to
 * pick the right @prismapi/ui component, layout, and companion tools.
 */

export interface PrismRenderHint {
  /** Primary @prismapi/ui component to render the result */
  suggestedComponent: string;
  /** Chart type when the component supports multiple visualizations */
  chartType?: string;
  /** Recommended layout slot: card | table | grid | dashboard */
  layout: 'card' | 'table' | 'grid' | 'dashboard';
  /** Which response fields to emphasize in a summary view */
  highlightFields?: string[];
  /** Tool names that pair well in a dashboard composition */
  pairedWith?: string[];
  /** Copy-paste code example using @prismapi/ui */
  exampleCode?: string;
  /** Dashboard templates this data feeds into */
  dashboardTemplates?: string[];
}

export const RENDER_HINTS: Record<string, PrismRenderHint> = {
  resolve_asset: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['symbol', 'name', 'asset_type', 'price', 'confidence'],
    pairedWith: ['get_price', 'technical_analysis'],
    exampleCode: `<PrismMetricCard title={result.symbol} value={result.price} subtitle={result.name} />`,
    dashboardTemplates: ['equity-overview', 'crypto-trader'],
  },

  batch_resolve: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['symbol', 'name', 'asset_type', 'price'],
    pairedWith: ['get_price'],
    exampleCode: `<PrismStockTable data={results} />`,
  },

  get_price: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['symbol', 'price', 'change_24h', 'volume_24h', 'market_cap'],
    pairedWith: ['technical_analysis', 'social_sentiment', 'get_news'],
    exampleCode: `<PrismMetricCard title={result.symbol} value={result.price} change={result.change_24h} />`,
    dashboardTemplates: ['crypto-trader', 'portfolio-tracker'],
  },

  get_trending: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['symbol', 'name', 'price', 'change_pct_24h', 'volume_24h'],
    pairedWith: ['get_price', 'social_sentiment'],
    exampleCode: `<PrismStockTable data={results} />`,
    dashboardTemplates: ['crypto-trader'],
  },

  market_overview: {
    suggestedComponent: 'PrismFearGreed',
    layout: 'dashboard',
    highlightFields: ['total_market_cap', 'btc_dominance', 'fear_greed.value', 'fear_greed.classification'],
    pairedWith: ['get_trending', 'get_news'],
    exampleCode: `<PrismFearGreed value={result.fear_greed.value} label={result.fear_greed.classification} />`,
    dashboardTemplates: ['crypto-trader'],
  },

  get_stock_quote: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['symbol', 'price', 'change', 'change_pct', 'volume', 'market_cap'],
    pairedWith: ['technical_analysis', 'get_news', 'get_risk'],
    exampleCode: `<PrismMetricCard title={quote.symbol} value={quote.price} change={quote.change_pct} />`,
    dashboardTemplates: ['equity-overview'],
  },

  get_yields: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['pool', 'protocol', 'chain', 'apy', 'tvl_usd'],
    pairedWith: ['get_protocols', 'get_gas'],
    exampleCode: `<PrismStockTable data={yields} />`,
  },

  get_protocols: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['name', 'category', 'chain', 'tvl', 'change_1d'],
    pairedWith: ['get_yields'],
    exampleCode: `<PrismStockTable data={protocols} />`,
  },

  get_gas: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['chain', 'slow', 'standard', 'fast'],
    pairedWith: ['get_protocols'],
    exampleCode: `<PrismStockTable data={gas} />`,
  },

  whale_movements: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['tx_hash', 'from', 'to', 'value_usd', 'type'],
    pairedWith: ['exchange_flows', 'social_sentiment'],
    exampleCode: `<PrismStockTable data={movements} />`,
    dashboardTemplates: ['crypto-trader'],
  },

  exchange_flows: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['inflow', 'outflow', 'net_flow'],
    pairedWith: ['whale_movements', 'get_price'],
    exampleCode: `<PrismMetricCard title="Net Flow" value={flow.net_flow} />`,
    dashboardTemplates: ['crypto-trader'],
  },

  wallet_balances: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['token', 'symbol', 'balance', 'value_usd'],
    pairedWith: ['get_price'],
    exampleCode: `<PrismStockTable data={balances} />`,
    dashboardTemplates: ['portfolio-tracker'],
  },

  technical_analysis: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['symbol', 'trend', 'rsi', 'summary'],
    pairedWith: ['get_signals', 'get_risk', 'get_price'],
    exampleCode: `<PrismMetricCard title={ta.symbol} value={ta.trend} subtitle={ta.summary} />`,
    dashboardTemplates: ['equity-overview', 'crypto-trader'],
  },

  get_signals: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['symbol', 'signal_type', 'direction', 'strength'],
    pairedWith: ['technical_analysis'],
    exampleCode: `<PrismStockTable data={signals} />`,
  },

  get_risk: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['symbol', 'volatility', 'sharpe_ratio', 'max_drawdown', 'var'],
    pairedWith: ['technical_analysis', 'get_price'],
    exampleCode: `<PrismMetricCard title={risk.symbol} value={risk.sharpe_ratio} subtitle="Sharpe Ratio" />`,
    dashboardTemplates: ['equity-overview', 'portfolio-tracker'],
  },

  get_news: {
    suggestedComponent: 'PrismNewsCard',
    layout: 'grid',
    highlightFields: ['title', 'source', 'sentiment', 'published_at'],
    pairedWith: ['social_sentiment', 'get_price'],
    exampleCode: `<PrismNewsGrid items={news} />`,
    dashboardTemplates: ['equity-overview', 'crypto-trader'],
  },

  social_sentiment: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['sentiment_score', 'label', 'bullish_pct', 'bearish_pct'],
    pairedWith: ['get_news', 'get_price', 'whale_movements'],
    exampleCode: `<PrismMetricCard title="Sentiment" value={s.sentiment_score} subtitle={s.label} />`,
    dashboardTemplates: ['crypto-trader'],
  },

  prediction_markets: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['title', 'source', 'yes_price', 'volume'],
    pairedWith: ['search_predictions'],
    exampleCode: `<PrismStockTable data={markets} />`,
  },

  search_predictions: {
    suggestedComponent: 'PrismStockTable',
    layout: 'table',
    highlightFields: ['title', 'source', 'yes_price', 'volume'],
    pairedWith: ['prediction_markets'],
    exampleCode: `<PrismStockTable data={results} />`,
  },

  macro_summary: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'dashboard',
    highlightFields: ['fed_rate', 'inflation', 'gdp', 'unemployment'],
    pairedWith: ['get_news'],
    exampleCode: `<PrismMetricCard title="Fed Rate" value={macro.fed_rate} />`,
  },

  api_health: {
    suggestedComponent: 'PrismMetricCard',
    layout: 'card',
    highlightFields: ['status', 'uptime', 'latency'],
    exampleCode: `<PrismMetricCard title="API Health" value={health.status} />`,
  },
};
