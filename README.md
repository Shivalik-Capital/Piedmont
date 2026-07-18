<div align="center">
  <div style="background-color: #3cddc7; width: 64px; height: 64px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 0 20px rgba(87, 241, 219, 0.4);">
    <span style="color: #0f1321; font-size: 32px; font-weight: 900; font-family: sans-serif;">P</span>
  </div>
  <h1>Piedmont Financial Intelligence</h1>
  <p><strong>A cinematic, institutional-grade macroeconomic terminal designed exclusively for the Indian markets.</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#design-decisions">Design Decisions</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## Overview

Piedmont is a modern, data-forward intelligence platform aimed at providing retail investors, students, and researchers with institutional-grade market visibility. Built as a lightweight yet visually striking alternative to legacy financial terminals, Piedmont strictly focuses on the Indian ecosystem (NSE, BSE, RBI rates, and domestic macro indicators) alongside global commodities.

This project was built to demonstrate proficiency in full-stack architecture, real-time data aggregation, and uncompromising, premium UI/UX design.

## Features

Piedmont V2 aggregates multiple data sources into a single, highly interactive pane of glass:

- **Live Market Data:** Fetches real-time equity indices (Nifty 50, Sensex, Bank Nifty), Sector Performance, and Commodities using `yfinance`.
- **Interactive Financial Charting:** Fully interactive area and candlestick charts with volume histograms, built on TradingView's `lightweight-charts` library.
- **Global Macro Integration:** Pulls real-time domestic and external indicators (GDP Growth, Consumer Price Inflation, Current Account Balance, Forex Reserves) directly from the **World Bank API**.
- **Time-Aware Intelligence:** Automatically computes global session states (Asian, Indian, London, New York) and displays live pulsing indicators *only* on the specific assets whose markets are currently open.

## Design Decisions

While traditional financial tools lean towards dense, flat, and often dry interfaces, Piedmont V2 was deliberately designed with a **"Cinematic Fintech"** aesthetic. I made these specific design choices to craft an experience that feels both highly professional and unmistakably premium:

1. **WebGL Shader Background:** Instead of a static dark gray background, Piedmont runs a custom WebGL shader directly in the canvas. This creates a subtle, slowly shifting aurora effect (midnight blue, teal, and purple) that makes the application feel "alive" and reactive without distracting from the data.
2. **Glassmorphic Bento Layout:** I utilized frosted glass (`backdrop-filter: blur(24px)`) and a bento-box grid system. This establishes visual hierarchy and separates dense data clusters organically, allowing the user to parse complex macroeconomic indicators without cognitive overload. 
3. **Dynamic Market Hours Logic:** Financial markets operate across different time zones. I engineered a custom UTC-to-IST conversion utility that not only tells the user which global session is active (e.g., London vs. New York) but also conditionally renders live "pulse" dots next to individual equities and commodities based on their exact exchange hours. This prevents false confidence in stale data.
4. **Plus Jakarta Sans Typography:** Moved away from default system fonts to *Plus Jakarta Sans*, a premium geometric sans-serif that excels in numeric legibility—crucial for a financial terminal where parsing digits quickly is the primary use case.

## Architecture

Piedmont operates on a decoupled client-server architecture:

### Frontend (Next.js 14)
- **Framework:** React + Next.js (App Router)
- **Styling:** Tailwind CSS v4
- **Charting:** `lightweight-charts`
- **Philosophy:** Server-rendered shell with client-side polling for live market updates, wrapped in a hardware-accelerated UI.

### Backend (FastAPI)
- **Framework:** Python + FastAPI
- **Data Ingestion:**
  - `yfinance` for low-latency market scraping and historical chart data.
  - `requests` for robust REST communication with World Bank endpoints.
  - Static JSON fallback (`macro_data.json`) for proprietary indicators without free API access.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Start the Backend
```bash
git clone https://github.com/Shivalik-Capital/Piedmont.git
cd Piedmont/backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*

### 2. Start the Frontend
In a new terminal window:
```bash
cd Piedmont/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The dashboard will be available at `http://localhost:3000`*

---

<div align="center">
  <sub>Built for the love of the markets. 📈</sub>
</div>
