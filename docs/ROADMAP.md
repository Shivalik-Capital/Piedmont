# Piedmont Master Product Roadmap

Piedmont is an institutional-grade financial intelligence terminal dedicated to Indian capital markets, macroeconomic indicators, and corporate analytics.

---

## Progress Overview

| Phase | Module | Status | Deliverables |
| :--- | :--- | :--- | :--- |
| Version 1 | Core Market Terminal Foundation | Shipped | Live index feeds (Nifty 50, Sensex, Bank Nifty), session pulse, terminal design system |
| Version 2 | Macroeconomic Intelligence Suite | Shipped | RBI policy rates, CPI, WPI, GDP, IIP, PMI, Forex, Yields, FII/DII liquidity |
| Version 3 | Corporate Fundamentals & Financial Statements | Shipped | 50 Nifty constituents, 12 fundamental ratios, 4-year Balance Sheet, P&L, Cash Flow, CSV export, dynamic financial encyclopedia (/learn/[term]) |
| Version 4 | Watchlists & Portfolio Analytics | Shipped | Institutional watchlist, multi-holding portfolio tracker, live P&L computation, local storage persistence |
| Version 5 | Corporate Events & Macro Calendar | Shipped | Q2 FY27 earnings calendar, IPO tracker, economic releases, RBI MPC schedule |
| Version 6 | AI Financial Terminal Copilot | In Progress | Conversational market assistant, cross-asset transmission engine, blended zero-cost AI architecture |
| Version 7 | Historical Market Time Machine (Piedmont Replay) | In Progress | Point-in-time crisis simulator (2000, 2008, 2016, 2020, 2024), historical macro state engine, factor models |
| Version 8 | Bloomberg Terminal Keyboard Navigation | In Progress | F1-F9 institutional function keys, command shortcuts, quick search overlay |
| Version 9 | Portfolio Stress-Testing & Risk Engine | Planned | Value at Risk (VaR), scenario backtesting against historical shocks, factor exposures |

---

## Version 6: AI Market Intelligence Copilot

### Objective
Deliver an interactive, conversational terminal assistant ("Piedmont Copilot") capable of answering qualitative and quantitative questions about Indian equities, macroeconomic interactions, and corporate earnings expectations.

### Target Queries
- Asset Condition: "How is Reliance looking today?"
- Forward Expectations: "What are the market expectations for TCS ahead of earnings?"
- Cross-Asset Transmission: "How does rising crude oil impact Asian Paints, airlines, and Swiggy?"
- Macro Policy Impact: "How does an RBI repo rate cut affect Bank Nifty net interest margins?"
- Fundamental Diagnostics: "Break down the DuPont return on equity components for HDFC Bank."

### Blended Multi-Tier AI Architecture (Zero Cost)
To eliminate expensive commercial API bills while preventing rate limit bottlenecks, Piedmont implements a resilient blended routing strategy:

1. Tier 1: Deterministic Financial Transmission Engine (Local / Zero Cost)
   - Rule-based financial reasoning engine running directly on the edge / client.
   - Built on an in-memory cross-asset transmission matrix:
     - Brent Crude -> Paints (raw materials), Aviation (ATF), Logistics (fuel).
     - RBI Repo Rate -> Banks (NIM, credit growth), Realty (home loan demand), NBFCs (borrowing cost).
     - USD/INR Depreciation -> IT & Pharma (revenue boost), Importers / OMCs (margin compression).
   - Generates instant, mathematically accurate institutional summaries with 0ms latency and zero API calls.

2. Tier 2: Google Gemini 2.5 Flash Free Tier via Google AI Studio
   - Free tier provides 15 Requests Per Minute (RPM), 1,500 Requests Per Day (RPD), and 1,000,000 Tokens Per Minute (TPM) at zero financial cost.
   - Grounded RAG (Retrieval-Augmented Generation): Piedmont injects live terminal context (current index levels, October 2026 macro indicators, company valuation metrics) into a concise institutional system prompt.

3. Tier 3: Groq Cloud Free Tier Fallback
   - Ultra-fast LPU inference (Llama 3.3 70B) with free tier (30 RPM, 14,400 RPD) to seamlessly absorb traffic if Gemini encounters temporary rate limits.

4. Tier 4: Client-Side WebLLM / Transformers.js Fallback
   - In-browser quantized small language model running locally via WebGPU for completely offline or rate-limit-resistant execution.

5. Tier 5: User-Provided BYOK (Bring Your Own Key)
   - Optional terminal setting enabling institutional analysts to enter their personal Anthropic Claude, OpenAI, or Gemini API keys stored safely in browser local storage.

---

## Version 7: Historical Market Time Machine (Piedmont Replay) & Advanced Analytics

### Objective
Provide academic researchers, financial analysts, and retail investors with a point-in-time market replay engine. Unlike standard charting tools that only plot historical price candles, Piedmont Replay rewinds the entire terminal state—including macroeconomic indicators, central bank policies, valuation multiples, and market breadth—to pivotal historical crises.

### Historical Crisis Catalog & Verified Datasets
1. March 10, 2000: Dot-Com Euphoria & Peak
   - Nifty IT valuation extremes, global tech bubble bursting.
2. October 24, 2008: Global Financial Crisis & Lehman Collapse
   - Sensex crash from 21,000 to 8,000, FII mass capital flight, global dollar shortage, RBI emergency liquidity window.
3. November 9, 2016: Demonetization Shock
   - Overnight invalidation of 86% of currency notes, cash economy paralysis, digital transaction spike, short-term consumer contraction.
4. March 23, 2020: COVID-19 Global Pandemic Market Crash
   - Lower circuit trigger, Nifty 7,511 low, sovereign bond volatility, emergency moratorium policies.
5. October 18, 2021: Post-Pandemic Retail Boom & Tech IPO Wave
   - Zero-rate environment euphoria, Nifty 18,000 milestone, high-multiple consumer tech listings.
6. June 4, 2024: Lok Sabha Election Volatility
   - Nifty 5.93% intraday crash on coalition election results, PSU sector drawdown of 15-20%, subsequent V-shaped institutional recovery.
7. October 2026: Modern Benchmark
   - Current operating terminal state for live baseline comparison.

### Replay Mechanics
- Global Temporal Switch: A top-level terminal toggle `[LIVE] <---> [HISTORICAL REPLAY]` with an interactive epoch selector.
- Synchronized Terminal Rewind:
  - Macro dashboard updates to historical CPI, Repo Rate, Forex Reserves, and GDP of the selected epoch.
  - Index and constituent valuation multiples revert to historical P/E, P/B, and dividend yield distributions.
  - Institutional Playbook Drawer: Surfaces causes, macro transmission vectors, sector performance dispersion, and post-crisis recovery timeline.

---

## Version 8: Bloomberg Terminal Keyboard Navigation

### Objective
Provide authentic financial terminal ergonomics through standardized function keys (F1-F9) and keyboard-driven terminal controls:
- `F1`: Help / Copilot (Piedmont Intelligence AI dialog)
- `F2`: Equities Overview (`/equities`)
- `F3`: Screener Engine (`/screener`)
- `F4`: Macroeconomic Suite (`/macro`)
- `F5`: Corporate & Economic Calendar (`/calendar`)
- `F6`: Commodities & Currencies (`/commodities`)
- `F7`: Watchlist & Portfolio P&L (`/watchlist`)
- `F8`: Historical Time Machine Replay (`/replay`)
- `F9`: Dashboard Pulse (`/` or `/dashboard`)
- `Esc`: Close any active modal, drawer, or search overlay
- `Cmd+K` / `Ctrl+K`: Global command search bar

---

## Architectural Principles
1. Institutional Tone: High data density, crisp typography, tabular figures, strictly zero decorative emojis.
2. Financial Precision: All calculations follow standard financial formulas (DuPont decomposition, Gordon Growth Model, Modified Duration).
3. Zero-Cost Infrastructure: Leverage client-side compute, edge caching, and free-tier AI APIs to maintain sustainable operations without recurring costs.
