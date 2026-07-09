# Piedmont

Piedmont is a financial intelligence platform for Indian markets. Version 1 is focused on a clean, credible market dashboard for Nifty 50, Sensex, and Bank Nifty.

The long-term goal is to build a lightweight Bloomberg-style terminal for investors, students, researchers, and finance enthusiasts in India.

## V1 Foundation

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

Clone the repository:

```bash
git clone https://github.com/Shivalik-Capital/Piedmont.git
cd Piedmont
```

Start the backend:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend should be available at:

```text
http://localhost:8000
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

## API Endpoints

```text
GET /api/health
GET /api/market/indices
```

## Verification

Backend syntax check:

```bash
backend/venv/bin/python -m py_compile backend/main.py
```

Frontend checks:

```bash
cd frontend
npm run lint
npx next build --webpack
```

## Current Limitations

- yfinance is suitable for the V1 foundation, but a production release should evaluate more reliable market data providers.
- The frontend currently expects the backend at `http://localhost:8000`.
- V1 intentionally avoids fake panels for watchlists, sector rotation, FII/DII flows, or AI commentary until those have real APIs.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the seven-version product plan.
