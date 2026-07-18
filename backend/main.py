from fastapi import FastAPI, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime
import pytz
import requests
import json
import os
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Piedmont API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://piedmont-two.vercel.app",
        "https://*.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

IST = pytz.timezone("Asia/Kolkata")

INDEX_SYMBOLS = {
    "nifty50": {"symbol": "^NSEI", "name": "Nifty 50", "exchange": "NSE"},
    "sensex": {"symbol": "^BSESN", "name": "Sensex", "exchange": "BSE"},
    "banknifty": {"symbol": "^NSEBANK", "name": "Bank Nifty", "exchange": "NSE"},
}

SECTOR_SYMBOLS = {
    "nifty_it": {"symbol": "^CNXIT", "name": "Nifty IT", "exchange": "NSE"},
    "nifty_pharma": {"symbol": "^CNXPHARMA", "name": "Nifty Pharma", "exchange": "NSE"},
    "nifty_auto": {"symbol": "^CNXAUTO", "name": "Nifty Auto", "exchange": "NSE"},
    "nifty_fmcg": {"symbol": "^CNXFMCG", "name": "Nifty FMCG", "exchange": "NSE"},
    "nifty_metal": {"symbol": "^CNXMETAL", "name": "Nifty Metal", "exchange": "NSE"},
    "nifty_realty": {"symbol": "^CNXREALTY", "name": "Nifty Realty", "exchange": "NSE"},
}

COMMODITY_SYMBOLS = {
    "usd_inr": {"symbol": "INR=X", "name": "USD/INR", "exchange": "FOREX"},
    "gold": {"symbol": "GC=F", "name": "Gold", "exchange": "COMEX"},
    "crude_oil": {"symbol": "CL=F", "name": "Crude Oil", "exchange": "NYMEX"},
    "10y_gsec": {"symbol": "NIFTYGS10YR.NS", "name": "10Y G-Sec Index", "exchange": "NSE"},
}

def fetch_quote(symbol: str) -> dict:
    ticker = yf.Ticker(symbol)
    info = ticker.fast_info
    price = round(info.last_price, 2)
    prev_close = round(info.previous_close, 2)
    if not price or not prev_close:
        raise HTTPException(status_code=502, detail=f"Invalid data for {symbol}")
    change = round(price - prev_close, 2)
    change_pct = round((change / prev_close) * 100, 2)
    return {
        "price": price,
        "change": change,
        "change_pct": change_pct,
        "previous_close": prev_close,
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.now(IST).isoformat()}

@app.get("/")
def root():
    return {"message": "Piedmont API is running"}

@app.get("/api/market/indices")
@limiter.limit("60/minute")
def get_indices(request: Request):
    result = {"indices": {}, "meta": {
        "source": "Yahoo Finance via yfinance",
        "fetched_at": datetime.now(IST).strftime("%-d %b at %I:%M:%S %p IST"),
        "timezone": "IST"
    }}
    for key, config in INDEX_SYMBOLS.items():
        quote = fetch_quote(config["symbol"])
        result["indices"][key] = {**config, **quote}
    return result

@app.get("/api/market/sectors")
@limiter.limit("60/minute")
def get_sectors(request: Request):
    result = {"sectors": {}, "meta": {
        "source": "Yahoo Finance via yfinance",
        "fetched_at": datetime.now(IST).strftime("%-d %b at %I:%M:%S %p IST"),
        "timezone": "IST"
    }}
    for key, config in SECTOR_SYMBOLS.items():
        try:
            quote = fetch_quote(config["symbol"])
            result["sectors"][key] = {**config, **quote}
        except Exception:
            # If one sector fails, skip it rather than failing the whole request
            result["sectors"][key] = {**config, "price": None, "change": None, "change_pct": None, "previous_close": None}
    return result

@app.get("/api/market/commodities")
@limiter.limit("60/minute")
def get_commodities(request: Request):
    result = {"commodities": {}, "meta": {
        "source": "Yahoo Finance via yfinance",
        "fetched_at": datetime.now(IST).strftime("%-d %b at %I:%M:%S %p IST"),
        "timezone": "IST"
    }}
    for key, config in COMMODITY_SYMBOLS.items():
        try:
            quote = fetch_quote(config["symbol"])
            result["commodities"][key] = {**config, **quote}
        except Exception:
            result["commodities"][key] = {**config, "price": None, "change": None, "change_pct": None, "previous_close": None}
    return result

@app.get("/api/market/macro")
@limiter.limit("60/minute")
def get_macro(request: Request):
    indicators = {}

    headers = {'User-Agent': 'Piedmont-App/1.0'}

    # Fetch GDP
    try:
        res = requests.get("http://api.worldbank.org/v2/country/IN/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=1", headers=headers, timeout=5)
        data = res.json()
        val = round(data[1][0]['value'], 2)
        date = data[1][0]['date']
        indicators["gdp"] = {"name": "GDP Growth", "value": f"{val}%", "trend": "Up", "date": date}
    except Exception:
        indicators["gdp"] = {"name": "GDP Growth", "value": "N/A", "trend": "Stable", "date": ""}

    # Fetch CPI
    try:
        res = requests.get("http://api.worldbank.org/v2/country/IN/indicator/FP.CPI.TOTL.ZG?format=json&per_page=1", headers=headers, timeout=5)
        data = res.json()
        val = round(data[1][0]['value'], 2)
        date = data[1][0]['date']
        indicators["inflation"] = {"name": "CPI Inflation", "value": f"{val}%", "trend": "Stable", "date": date}
    except Exception:
        indicators["inflation"] = {"name": "CPI Inflation", "value": "N/A", "trend": "Stable", "date": ""}

    # Fetch Forex Reserves
    try:
        res = requests.get("http://api.worldbank.org/v2/country/IN/indicator/FI.RES.TOTL.CD?format=json&per_page=1", headers=headers, timeout=5)
        data = res.json()
        val = data[1][0]['value']
        date = data[1][0]['date']
        # Convert to Billions
        val_b = round(val / 1e9, 1)
        indicators["forex"] = {"name": "Forex Reserves", "value": f"${val_b}B", "trend": "Up", "date": date}
    except Exception:
        indicators["forex"] = {"name": "Forex Reserves", "value": "N/A", "trend": "Stable", "date": ""}

    # Fetch Current Account
    try:
        res = requests.get("http://api.worldbank.org/v2/country/IN/indicator/BN.CAB.XOKA.CD?format=json&per_page=1", headers=headers, timeout=5)
        data = res.json()
        val = data[1][0]['value']
        date = data[1][0]['date']
        # Convert to Billions
        val_b = round(val / 1e9, 2)
        indicators["current_account"] = {"name": "Current Account", "value": f"${val_b}B", "trend": "Down", "date": date}
    except Exception:
        indicators["current_account"] = {"name": "Current Account", "value": "N/A", "trend": "Stable", "date": ""}

    # Fetch static macro data
    try:
        file_path = os.path.join(os.path.dirname(__file__), "data", "macro_data.json")
        with open(file_path, "r") as f:
            macro_data = json.load(f)
            # RBI
            indicators["rbi_repo"] = macro_data["rbi_rates"]["repo_rate"]
            indicators["reverse_repo"] = macro_data["rbi_rates"]["reverse_repo"]
            indicators["sdf"] = macro_data["rbi_rates"]["sdf"]
            
            # Domestic
            indicators["wpi"] = macro_data["domestic_macro"]["wpi"]
            indicators["pmi"] = macro_data["domestic_macro"]["pmi"]
            indicators["iip"] = macro_data["domestic_macro"]["iip"]
            indicators["fiscal_deficit"] = macro_data["domestic_macro"]["fiscal_deficit"]

            # Markets
            indicators["fii_flows"] = macro_data["market_liquidity"]["fii_flows"]
            indicators["dii_flows"] = macro_data["market_liquidity"]["dii_flows"]
            indicators["borrowing_cal"] = macro_data["market_liquidity"]["borrowing_cal"]
            indicators["econ_cal"] = macro_data["market_liquidity"]["econ_cal"]
    except Exception:
        pass # If file fails, we just don't add these keys

    result = {
        "indicators": indicators,
        "meta": {
            "source": "World Bank API & RBI / Static",
            "fetched_at": datetime.now(IST).strftime("%-d %b at %I:%M:%S %p IST"),
            "timezone": "IST"
        }
    }
    return result
@app.get("/api/market/history/{symbol}")
@limiter.limit("120/minute")
def get_history(symbol: str, request: Request, period: str = "1mo"):
    valid_periods = ["1mo", "3mo", "6mo", "1y"]
    if period not in valid_periods:
        raise HTTPException(status_code=400, detail=f"Period must be one of {valid_periods}")
    
    symbol_map = {**{k: v["symbol"] for k, v in INDEX_SYMBOLS.items()},
                  **{k: v["symbol"] for k, v in SECTOR_SYMBOLS.items()},
                  **{k: v["symbol"] for k, v in COMMODITY_SYMBOLS.items()}}
    
    if symbol not in symbol_map:
        raise HTTPException(status_code=404, detail=f"Symbol '{symbol}' not found")
    
    ticker = yf.Ticker(symbol_map[symbol])
    hist = ticker.history(period=period)
    
    if hist.empty:
        raise HTTPException(status_code=502, detail="No historical data available")
    
    data = [
        {
            "date": str(index.date()),
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
            "volume": int(row["Volume"]),
        }
        for index, row in hist.iterrows()
    ]
    
    return {"symbol": symbol, "period": period, "data": data}