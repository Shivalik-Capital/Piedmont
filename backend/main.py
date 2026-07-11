from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime
import pytz

app = FastAPI(title="Piedmont API")

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
def get_indices():
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
def get_sectors():
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

@app.get("/api/market/history/{symbol}")
def get_history(symbol: str, period: str = "1mo"):
    valid_periods = ["1mo", "3mo", "6mo", "1y"]
    if period not in valid_periods:
        raise HTTPException(status_code=400, detail=f"Period must be one of {valid_periods}")
    
    symbol_map = {**{k: v["symbol"] for k, v in INDEX_SYMBOLS.items()},
                  **{k: v["symbol"] for k, v in SECTOR_SYMBOLS.items()}}
    
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