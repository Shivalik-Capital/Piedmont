from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI(title="Piedmont API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

INDEX_SYMBOLS = {
    "nifty50": {"symbol": "^NSEI", "name": "Nifty 50", "exchange": "NSE"},
    "sensex": {"symbol": "^BSESN", "name": "Sensex", "exchange": "BSE"},
    "banknifty": {"symbol": "^NSEBANK", "name": "Bank Nifty", "exchange": "NSE"},
}


@app.get("/")
def root():
    return {"message": "Piedmont API is running"}


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "piedmont-api",
        "checked_at": datetime.now(ZoneInfo("Asia/Kolkata")).isoformat(),
    }


def get_index_quote(key: str, config: dict):
    try:
        ticker = yf.Ticker(config["symbol"])
        info = ticker.fast_info
        price = float(info.last_price)
        previous_close = float(info.previous_close)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to fetch market data for {config['name']}",
        ) from exc

    if previous_close == 0:
        raise HTTPException(
            status_code=502,
            detail=f"Invalid previous close returned for {config['name']}",
        )

    change = price - previous_close

    return {
        "id": key,
        "name": config["name"],
        "exchange": config["exchange"],
        "symbol": config["symbol"],
        "price": round(price, 2),
        "previous_close": round(previous_close, 2),
        "change": round(change, 2),
        "change_pct": round((change / previous_close) * 100, 2),
    }


@app.get("/api/market/indices")
def get_indices():
    fetched_at = datetime.now(ZoneInfo("Asia/Kolkata"))

    return {
        "indices": {
            key: get_index_quote(key, config)
            for key, config in INDEX_SYMBOLS.items()
        },
        "meta": {
            "source": "Yahoo Finance via yfinance",
            "fetched_at": fetched_at.isoformat(),
            "timezone": "Asia/Kolkata",
        },
    }
