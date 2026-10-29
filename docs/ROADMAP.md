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
| Version 6 | AI Financial Terminal Copilot | Shipped | Conversational market assistant, cross-asset transmission engine, blended zero-cost AI architecture |
| Version 7 | Historical Market Time Machine (Piedmont Replay) | Shipped | Point-in-time crisis simulator (2000, 2008, 2016, 2020, 2024), historical macro state engine, factor models |
| Version 8 | Bloomberg Terminal Keyboard Navigation | Shipped | F1-F9 institutional function keys, command shortcuts, quick search overlay |
| Version 9 | Historical Research Engine ("What Did They Know?") | In Progress | Point-in-time information set reconstruction, lookahead-bias elimination, thesis simulator, timeline advancer |
| Version 10 | Institutional Portfolio Risk & Stress-Testing | Planned | Value at Risk (VaR), scenario backtesting against historical shocks, factor exposures |

---

## Version 9: Historical Research Engine & "What Did They Know?" Laboratory

### Objective
Reconstruct the exact information environment available to an investor, economist, or researcher at any specific date in history, strictly eliminating lookahead bias.

### Core Architectural Rule: Strict Point-In-Time (PIT) Semantics
In historical financial research, standard charts introduce severe lookahead bias because metrics are backfilled with knowledge that became available only months later. Piedmont strictly bifurcates:
1. **Data Period:** The calendar quarter or month an economic event or corporate filing covers (e.g., Q2 FY09 covers July–September 2008).
2. **Availability Date / Release Date:** The exact date the report was published and available to market participants (e.g., Q2 FY09 earnings were published on October 23, 2008).

*Rule:* If a researcher investigates October 15, 2008, Piedmont suppresses all data released after that date. The user sees Q1 FY09 GDP (7.9%, released August 29) and Q1 corporate filings. Q2 GDP (which contracted to 5.8% and was released on November 28) is completely invisible because it was unknown to market participants on October 15.

### Research Workspace Navigation Tabs
1. **Markets & Pricing:** Spot levels, index closes, 10Y G-Sec sovereign yield, VIX/volatility, currency, and commodities as of the selected date.
2. **Macro Information Set:** Point-in-time indicators displaying both the `Period Covered` and the `Official Release Date` with explicit reporting lag transparency.
3. **Corporate Statements:** Audited financial filings available as of that date, with explicit "Upcoming / Not Yet Available" notice for future quarters.
4. **Historical News & Consensus:** Prevailing market narrative, broker consensus, and central bank commentary on that exact day.
5. **Research Without Hindsight (Thesis Simulator):**
   - The user records an investment thesis: "Given the information available on October 15, 2008, what is your stance?" (e.g. Long Defensive FMCG, Short Leveraged Real Estate).
   - The user selects a forward horizon: `+1 Week`, `+1 Month`, `+3 Months`, `+6 Months`, `+1 Year`.
   - "Advance Timeline" Action: Steps forward in time, unlocks newly published macro releases and corporate earnings, plots actual price realization, and computes thesis outcome and return attribution.
6. **Cross-Epoch Comparative Lab:**
   - Multi-crisis side-by-side comparison (e.g. 2008 GFC vs 2020 COVID Crash vs 2026 Baseline).

---

## Architectural Principles
1. Institutional Tone: High data density, crisp typography, tabular figures, strictly zero decorative emojis.
2. Financial Precision: All calculations follow standard financial formulas (DuPont decomposition, Gordon Growth Model, Modified Duration).
3. Zero-Cost Infrastructure: Leverage client-side compute, edge caching, and free-tier AI APIs to maintain sustainable operations without recurring costs.
