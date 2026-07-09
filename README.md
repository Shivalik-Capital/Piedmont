# Piedmont

Piedmont is a financial intelligence platform for Indian markets. Version 1 is focused on a clean, credible market dashboard for Nifty 50, Sensex, and Bank Nifty.

The long-term goal is to build a lightweight Bloomberg-style terminal for investors, students, researchers, and finance enthusiasts in India.

## Version 1

- FastAPI backend for market data.
- Next.js frontend with a terminal-style dashboard.
- Live index cards for Nifty 50, Sensex, and Bank Nifty.
- Data-source and timestamp visibility.
- Roadmap for future market, macro, company, portfolio, calendar, AI, and analytics modules.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python, yfinance
- Data source: Yahoo Finance through yfinance

## Local Development

Start the backend:

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the seven-version product plan.
