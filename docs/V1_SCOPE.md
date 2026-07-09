# Piedmont V1 Scope

Piedmont V1 is the core market dashboard foundation. The goal is to prove that the product can fetch Indian market data, expose it through a stable backend API, and present it through a credible financial terminal interface.

## Included in V1

- Live index dashboard for Nifty 50, Sensex, and Bank Nifty.
- Backend health endpoint.
- Market indices endpoint with response metadata.
- Loading, error, and data-source states in the frontend.
- Responsive terminal-style visual system.
- Clear separation between real data and future modules.

## Not Included in V1

- Sector rotation.
- Watchlists.
- Portfolio management.
- FII/DII cash flow.
- AI market commentary.
- Company analytics.
- Macroeconomic dashboards.

These are intentionally deferred so the first version stays trustworthy and maintainable.

## V1 Success Criteria

- The frontend loads index data from the backend.
- The UI never displays fake market values as if they are real.
- The backend fails clearly when the data provider is unavailable.
- The codebase is ready for V2 without a rewrite.
