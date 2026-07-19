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

fii_dii_cache = {
    "data": None,
    "last_fetched": None
}

def get_fii_dii_data():
    now = datetime.now(IST)
    if fii_dii_cache["data"] and fii_dii_cache["last_fetched"]:
        if (now - fii_dii_cache["last_fetched"]).total_seconds() < 21600:
            return fii_dii_cache["data"]
            
    try:
        url = "https://www.nseindia.com/api/fiidiiTradeReact"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        session = requests.Session()
        session.get("https://www.nseindia.com/", headers=headers, timeout=10)
        res = session.get(url, headers=headers, timeout=10)
        data = res.json()
        
        fii_val, dii_val, date_str = "N/A", "N/A", ""
        
        for item in data:
            if item.get("category") == "FII/FPI":
                net = float(item.get("netValue", 0))
                fii_val = f"₹{net:,.2f} Cr"
                date_str = item.get("date", "")
            elif item.get("category") == "DII":
                net = float(item.get("netValue", 0))
                dii_val = f"₹{net:,.2f} Cr"
                
        result = {
            "fii": {"name": "FII Flows (Cash)", "value": fii_val, "trend": "Up" if not fii_val.startswith("₹-") else "Down", "date": date_str},
            "dii": {"name": "DII Flows (Cash)", "value": dii_val, "trend": "Up" if not dii_val.startswith("₹-") else "Down", "date": date_str}
        }
        fii_dii_cache["data"] = result
        fii_dii_cache["last_fetched"] = now
        return result
    except Exception:
        return None

rbi_cache = {
    "data": None,
    "last_fetched": None
}

def get_rbi_rates():
    now = datetime.now(IST)
    if rbi_cache["data"] and rbi_cache["last_fetched"]:
        if (now - rbi_cache["last_fetched"]).total_seconds() < 86400:
            return rbi_cache["data"]
            
    try:
        url = "https://www.rbi.org.in/"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        import urllib3
        urllib3.disable_warnings()
        import re
        res = requests.get(url, headers=headers, timeout=10, verify=False)
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(res.text, 'html.parser')
        text = soup.text
        
        repo = re.search(r'Policy Repo Rate\s*:\s*([\d.]+%?)', text)
        sdf = re.search(r'Standing Deposit Facility Rate\s*:\s*([\d.]+%?)', text)
        rev_repo = re.search(r'Fixed Reverse Repo Rate\s*:\s*([\d.]+%?)', text)
        
        repo_val = repo.group(1) if repo else "N/A"
        sdf_val = sdf.group(1) if sdf else "N/A"
        rev_repo_val = rev_repo.group(1) if rev_repo else "N/A"
        
        result = {
            "rbi_repo": {"name": "RBI Repo Rate", "value": repo_val, "trend": "Stable", "date": "Current"},
            "reverse_repo": {"name": "Reverse Repo", "value": rev_repo_val, "trend": "Stable", "date": "Current"},
            "sdf": {"name": "Standing Deposit Facility", "value": sdf_val, "trend": "Stable", "date": "Current"}
        }
        rbi_cache["data"] = result
        rbi_cache["last_fetched"] = now
        return result
    except Exception:
        return None

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

    # CPI is now handled statically since World Bank only provides annual data

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
            
            # RBI Rates
            rbi_rates = get_rbi_rates()
            if rbi_rates:
                indicators["rbi_repo"] = rbi_rates["rbi_repo"]
                indicators["reverse_repo"] = rbi_rates["reverse_repo"]
                indicators["sdf"] = rbi_rates["sdf"]
            else:
                indicators["rbi_repo"] = macro_data["rbi_rates"]["repo_rate"]
                indicators["reverse_repo"] = macro_data["rbi_rates"]["reverse_repo"]
                indicators["sdf"] = macro_data["rbi_rates"]["sdf"]
            
            # Domestic
            indicators["inflation"] = macro_data["domestic_macro"]["cpi"]
            indicators["wpi"] = macro_data["domestic_macro"]["wpi"]
            indicators["pmi"] = macro_data["domestic_macro"]["pmi"]
            indicators["iip"] = macro_data["domestic_macro"]["iip"]
            indicators["fiscal_deficit"] = macro_data["domestic_macro"]["fiscal_deficit"]

            # Markets
            fii_dii = get_fii_dii_data()
            if fii_dii:
                indicators["fii_flows"] = fii_dii["fii"]
                indicators["dii_flows"] = fii_dii["dii"]
            else:
                indicators["fii_flows"] = macro_data["market_liquidity"]["fii_flows"]
                indicators["dii_flows"] = macro_data["market_liquidity"]["dii_flows"]
                
            indicators["borrowing_cal"] = macro_data["market_liquidity"]["borrowing_cal"]
            indicators["econ_cal"] = macro_data["market_liquidity"]["econ_cal"]
    except Exception:
        pass # If file fails, we just don't add these keys

    result = {
        "indicators": indicators,
        "meta": {
            "source": "World Bank, RBI, NSE (Updates Daily)",
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