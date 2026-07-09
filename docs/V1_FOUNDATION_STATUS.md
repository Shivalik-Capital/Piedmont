# V1 Foundation Status

This document records the current stopping point for Piedmont V1.

## Status

V1 Foundation is shipped. Full V1 is still in progress.

## What Works

- The FastAPI backend exposes a health endpoint.
- The backend exposes market index data for Nifty 50, Sensex, and Bank Nifty.
- The API response includes source and fetch-time metadata.
- The Next.js frontend renders a terminal-style Indian market dashboard.
- The UI displays only values backed by the current API.
- The repository includes a roadmap and V1 scope document.

## What Is Intentionally Deferred

- Sector index data.
- Watchlists.
- Portfolio tracking.
- Company analytics.
- Macroeconomic dashboard.
- AI market summaries.
- Deployment.

## Known Limitations

- Market data currently comes from yfinance, which is useful for a prototype but not a guaranteed production data source.
- The frontend API base URL is hardcoded to local development.
- There are no automated backend tests yet.
- The app has not been verified from a fresh clone on another machine.
- The app is not deployed yet.

## Recommended Next Steps

1. Add environment-based configuration for the frontend API URL.
2. Add basic backend tests for `/api/health` and `/api/market/indices`.
3. Improve stale-data and market-closed states.
4. Add a screenshot or demo GIF to the README.
5. Validate setup from a fresh clone.
