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
import time
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") # Use service key for backend bypass RLS

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None
    
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
    "nifty50": {"symbol": "^NSEI", "name": "Nifty 50", "exchange": "NSE", "prefix": ""},
    "sensex": {"symbol": "^BSESN", "name": "Sensex", "exchange": "BSE", "prefix": ""},
    "banknifty": {"symbol": "^NSEBANK", "name": "Bank Nifty", "exchange": "NSE", "prefix": ""},
}

SECTOR_SYMBOLS = {
    "nifty_it": {"symbol": "^CNXIT", "name": "Nifty IT", "exchange": "NSE", "prefix": ""},
    "nifty_pharma": {"symbol": "^CNXPHARMA", "name": "Nifty Pharma", "exchange": "NSE", "prefix": ""},
    "nifty_auto": {"symbol": "^CNXAUTO", "name": "Nifty Auto", "exchange": "NSE", "prefix": ""},
    "nifty_fmcg": {"symbol": "^CNXFMCG", "name": "Nifty FMCG", "exchange": "NSE", "prefix": ""},
    "nifty_metal": {"symbol": "^CNXMETAL", "name": "Nifty Metal", "exchange": "NSE", "prefix": ""},
    "nifty_realty": {"symbol": "^CNXREALTY", "name": "Nifty Realty", "exchange": "NSE", "prefix": ""},
}

COMMODITY_SYMBOLS = {
    "usd_inr": {"symbol": "INR=X", "name": "USD/INR", "exchange": "FOREX", "prefix": "₹"},
    "gold": {"symbol": "GC=F", "name": "Gold", "exchange": "COMEX", "prefix": "$"},
    "crude_oil": {"symbol": "CL=F", "name": "Crude Oil", "exchange": "NYMEX", "prefix": "$"},
    "10y_gsec": {"symbol": "NIFTYGS10YR.NS", "name": "10Y G-Sec Index", "exchange": "NSE", "prefix": ""},
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

# RBI MPC Meeting Schedule FY 2026-27
# Each entry: (last_day_of_meeting, display_label)
# After the last day passes, we roll to the next meeting
MPC_SCHEDULE = [
    (datetime(2026, 8, 5, tzinfo=pytz.UTC).astimezone(IST).date(), "Aug 3-5"),
    (datetime(2026, 10, 7, tzinfo=pytz.UTC).astimezone(IST).date(), "Oct 5-7"),
    (datetime(2026, 12, 4, tzinfo=pytz.UTC).astimezone(IST).date(), "Dec 2-4"),
    (datetime(2027, 2, 5, tzinfo=pytz.UTC).astimezone(IST).date(), "Feb 3-5"),
]

def get_next_mpc_meeting():
    today = datetime.now(IST).date()
    for end_date, label in MPC_SCHEDULE:
        if today <= end_date:
            return {"name": "Next RBI MPC", "value": label, "trend": "Stable", "date": "Scheduled"}
    # If all meetings have passed, show the last one as completed
    return {"name": "Next RBI MPC", "value": "TBA", "trend": "Stable", "date": "FY28"}

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
    # Forex Reserves and Current Account are also static — World Bank lags 1-2 years,
    # while our JSON has the latest RBI weekly/quarterly data

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

            # External Sector
            indicators["forex"] = macro_data["external_sector"]["forex_reserves"]

            # Markets
            fii_dii = get_fii_dii_data()
            if fii_dii:
                indicators["fii_flows"] = fii_dii["fii"]
                indicators["dii_flows"] = fii_dii["dii"]
            else:
                indicators["fii_flows"] = macro_data["market_liquidity"]["fii_flows"]
                indicators["dii_flows"] = macro_data["market_liquidity"]["dii_flows"]
                
            indicators["borrowing_cal"] = macro_data["market_liquidity"]["borrowing_cal"]
            indicators["current_account"] = macro_data["market_liquidity"]["current_account"]
            indicators["econ_cal"] = get_next_mpc_meeting()
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

NIFTY_50 = {
    "RELIANCE": {"name": "Reliance Industries", "sector": "Oil & Gas"},
    "TCS": {"name": "Tata Consultancy Services", "sector": "IT"},
    "HDFCBANK": {"name": "HDFC Bank", "sector": "Financial Services"},
    "INFY": {"name": "Infosys", "sector": "IT"},
    "ICICIBANK": {"name": "ICICI Bank", "sector": "Financial Services"},
    "HINDUNILVR": {"name": "Hindustan Unilever", "sector": "Consumer Goods"},
    "BHARTIARTL": {"name": "Bharti Airtel", "sector": "Telecommunication"},
    "ITC": {"name": "ITC", "sector": "Consumer Goods"},
    "KOTAKBANK": {"name": "Kotak Mahindra Bank", "sector": "Financial Services"},
    "LT": {"name": "Larsen & Toubro", "sector": "Construction"},
    "SBIN": {"name": "State Bank of India", "sector": "Financial Services"},
    "AXISBANK": {"name": "Axis Bank", "sector": "Financial Services"},
    "BAJFINANCE": {"name": "Bajaj Finance", "sector": "Financial Services"},
    "MARUTI": {"name": "Maruti Suzuki", "sector": "Automobile"},
    "HCLTECH": {"name": "HCL Technologies", "sector": "IT"},
    "ASIANPAINT": {"name": "Asian Paints", "sector": "Consumer Goods"},
    "TITAN": {"name": "Titan Company", "sector": "Consumer Durables"},
    "SUNPHARMA": {"name": "Sun Pharmaceutical", "sector": "Pharma"},
    "ULTRACEMCO": {"name": "UltraTech Cement", "sector": "Cement"},
    "NTPC": {"name": "NTPC", "sector": "Power"},
    "WIPRO": {"name": "Wipro", "sector": "IT"},
    "POWERGRID": {"name": "Power Grid Corporation", "sector": "Power"},
    "M_M": {"name": "Mahindra & Mahindra", "sector": "Automobile", "symbol": "M&M.NS"},
    "TATAMOTORS": {"name": "Tata Motors", "sector": "Automobile"},
    "TATASTEEL": {"name": "Tata Steel", "sector": "Metals"},
    "NESTLEIND": {"name": "Nestle India", "sector": "Consumer Goods"},
    "JSWSTEEL": {"name": "JSW Steel", "sector": "Metals"},
    "ADANIENT": {"name": "Adani Enterprises", "sector": "Services"},
    "ADANIPORTS": {"name": "Adani Ports", "sector": "Services"},
    "TECHM": {"name": "Tech Mahindra", "sector": "IT"},
    "INDUSINDBK": {"name": "IndusInd Bank", "sector": "Financial Services"},
    "CIPLA": {"name": "Cipla", "sector": "Pharma"},
    "DRREDDY": {"name": "Dr. Reddy's Laboratories", "sector": "Pharma"},
    "BAJAJ_AUTO": {"name": "Bajaj Auto", "sector": "Automobile", "symbol": "BAJAJ-AUTO.NS"},
    "BAJAJFINSV": {"name": "Bajaj Finserv", "sector": "Financial Services"},
    "COALINDIA": {"name": "Coal India", "sector": "Mining"},
    "BPCL": {"name": "Bharat Petroleum", "sector": "Oil & Gas"},
    "EICHERMOT": {"name": "Eicher Motors", "sector": "Automobile"},
    "HEROMOTOCO": {"name": "Hero MotoCorp", "sector": "Automobile"},
    "GRASIM": {"name": "Grasim Industries", "sector": "Cement"},
    "DIVISLAB": {"name": "Divi's Laboratories", "sector": "Pharma"},
    "APOLLOHOSP": {"name": "Apollo Hospitals", "sector": "Healthcare"},
    "BRITANNIA": {"name": "Britannia Industries", "sector": "Consumer Goods"},
    "TATACONSUM": {"name": "Tata Consumer Products", "sector": "Consumer Goods"},
    "ONGC": {"name": "Oil & Natural Gas Corp", "sector": "Oil & Gas"},
    "HINDALCO": {"name": "Hindalco Industries", "sector": "Metals"},
    "SBILIFE": {"name": "SBI Life Insurance", "sector": "Financial Services"},
    "HDFCLIFE": {"name": "HDFC Life Insurance", "sector": "Financial Services"},
    "SHRIRAMFIN": {"name": "Shriram Finance", "sector": "Financial Services"},
}

def format_indian_number(n):
    if not isinstance(n, (int, float)) or n is None:
        return "N/A"
    if n >= 1_000_000_000_000:
        return f"₹{n / 1_000_000_000_000:.1f}L Cr"
    elif n >= 10_000_000:
        if n % 10_000_000 == 0:
            return f"₹{int(n / 10_000_000)} Cr"
        return f"₹{n / 10_000_000:.1f} Cr"
    else:
        return f"₹{round(n, 2)}"

company_list_cache = {
    "data": None,
    "last_fetched": 0
}

@app.get("/api/company/list")
@limiter.limit("30/minute")
def get_company_list(request: Request):
    now = time.time()
    if company_list_cache["data"] and now - company_list_cache["last_fetched"] < 300:
        return company_list_cache["data"]

    def fetch_company(key, data):
        symbol = data.get("symbol", f"{key}.NS")
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.fast_info
            price = round(info.last_price, 2) if hasattr(info, 'last_price') and info.last_price else None
            prev_close = round(info.previous_close, 2) if hasattr(info, 'previous_close') and info.previous_close else price
            if price is not None and prev_close is not None:
                change = round(price - prev_close, 2)
                change_pct = round((change / prev_close) * 100, 2) if prev_close else 0
            else:
                change, change_pct = 0, 0
                
            mcap = info.market_cap if hasattr(info, 'market_cap') else None
            return {
                "id": key,
                "symbol": symbol,
                "name": data["name"],
                "sector": data["sector"],
                "price": price,
                "change": change,
                "change_pct": change_pct,
                "marketCap": mcap
            }
        except Exception as e:
            return None

    results = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        for k, v in NIFTY_50.items():
            futures.append(executor.submit(fetch_company, k, v))
        for f in futures:
            res = f.result()
            if res:
                results.append(res)
                
    company_list_cache["data"] = results
    company_list_cache["last_fetched"] = now
    return results

@app.get("/api/company/search")
@limiter.limit("30/minute")
def search_companies(q: str, request: Request):
    try:
        results = []
        if supabase:
            # Search across symbol and name in Supabase
            res = supabase.table("companies") \
                .select("symbol, name, sector") \
                .or_(f"symbol.ilike.%{q}%,name.ilike.%{q}%") \
                .limit(20) \
                .execute()
            results = res.data or []
            
        # Fallback to Yahoo Finance if empty
        if not results:
            import requests
            headers = {'User-Agent': 'Mozilla/5.0'}
            yf_url = f"https://query2.finance.yahoo.com/v1/finance/search?q={q}"
            resp = requests.get(yf_url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                quotes = data.get('quotes', [])
                for idx, item in enumerate(quotes):
                    if idx >= 10: break
                    results.append({
                        "symbol": item.get('symbol'),
                        "name": item.get('shortname') or item.get('longname') or item.get('symbol'),
                        "sector": item.get('sectorDisp', 'Unknown')
                    })
                    
        return results
    except Exception as e:
        print(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail="Search failed")


@app.get("/api/company/screen")
@limiter.limit("30/minute")
def screen_companies(
    request: Request,
    sector: str = None,
    min_market_cap: float = None,
    max_pe: float = None,
    max_pb: float = None,
    min_roe: float = None,
    min_dividend_yield: float = None,
    max_debt_to_equity: float = None,
    sort_by: str = "market_cap",
    sort_order: str = "desc"
):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    try:
        # We need to join companies and company_metrics
        query = supabase.table("company_metrics").select(
            "*, companies(name, sector)"
        )
        
        if sector:
            query = query.eq("companies.sector", sector)
            
        # These fields are stored as JSON inside metrics. It's tricky to query deep JSON fields directly 
        # in standard Supabase python client without raw SQL, so we might pull more data and filter in Python
        # for a quick MVP. A better long term approach is extracting these to dedicated columns.
        
        # Let's pull top 500
        res = query.limit(500).execute()
        results = res.data
        
        # In-memory filtering
        filtered = []
        for row in results:
            if not row.get('metrics'): continue
            
            # Extract values
            mc = row['metrics'].get('marketCap', {}).get('value')
            pe = row['metrics'].get('pe', {}).get('value')
            pb = row['metrics'].get('pb', {}).get('value')
            roe = row['metrics'].get('roe', {}).get('value')
            div = row['metrics'].get('dividendYield', {}).get('value')
            dte = row['metrics'].get('debtToEquity', {}).get('value')
            
            if min_market_cap and (mc is None or mc < min_market_cap): continue
            if max_pe and (pe is None or pe > max_pe): continue
            if max_pb and (pb is None or pb > max_pb): continue
            if min_roe and (roe is None or roe < min_roe): continue
            if min_dividend_yield and (div is None or div < min_dividend_yield): continue
            if max_debt_to_equity and (dte is None or dte > max_debt_to_equity): continue
            
            filtered.append(row)
            
        # In-memory sorting
        reverse = sort_order.lower() == "desc"
        
        def sort_key(x):
            metrics = x.get('metrics', {})
            # Handle potential None values safely by returning 0 or inf
            if sort_by == 'market_cap':
                return metrics.get('marketCap', {}).get('value') or 0
            elif sort_by == 'pe':
                return metrics.get('pe', {}).get('value') or float('inf')
            elif sort_by == 'pb':
                return metrics.get('pb', {}).get('value') or float('inf')
            elif sort_by == 'roe':
                return metrics.get('roe', {}).get('value') or -float('inf')
            elif sort_by == 'dividend_yield':
                return metrics.get('dividendYield', {}).get('value') or 0
            return 0
            
        filtered.sort(key=sort_key, reverse=reverse)
        
        return filtered[:50] # return top 50 matches
        
    except Exception as e:
        print(f"Screening failed: {e}")
        raise HTTPException(status_code=500, detail="Screening failed")
@app.get("/api/company/{symbol}")
@limiter.limit("60/minute")
def get_company_detail(symbol: str, request: Request):
    try:
        if symbol in NIFTY_50:
            yf_symbol = NIFTY_50[symbol].get("symbol", f"{symbol}.NS")
        else:
            yf_symbol = symbol if symbol.endswith(".NS") or symbol.startswith("^") else f"{symbol}.NS"
            
        ticker = yf.Ticker(yf_symbol)
        info = ticker.info
        fast_info = ticker.fast_info
        
        price = round(fast_info.last_price, 2) if hasattr(fast_info, 'last_price') and fast_info.last_price else info.get('currentPrice', 0)
        prev_close = round(fast_info.previous_close, 2) if hasattr(fast_info, 'previous_close') and fast_info.previous_close else info.get('previousClose', price)
        change = round(price - prev_close, 2)
        change_pct = round((change / prev_close) * 100, 2) if prev_close else 0
        
        market_cap = info.get('marketCap')
        if not market_cap and hasattr(fast_info, 'market_cap'):
             market_cap = fast_info.market_cap
        
        info_dict = {
            "name": info.get('longName', NIFTY_50.get(symbol, {}).get("name", symbol)),
            "sector": info.get('sector', NIFTY_50.get(symbol, {}).get("sector", "Unknown")),
            "industry": info.get('industry', 'Unknown'),
            "exchange": "NSE",
            "marketCap": market_cap,
            "marketCapFormatted": format_indian_number(market_cap) if market_cap else "N/A",
            "fiftyTwoWeekHigh": info.get('fiftyTwoWeekHigh'),
            "fiftyTwoWeekLow": info.get('fiftyTwoWeekLow'),
            "price": price,
            "change": change,
            "changePct": change_pct
        }
        
        metrics = {}
        
        if info.get('trailingPE'):
            val = round(info['trailingPE'], 1)
            exp = f"Very cheap — investors pay only ₹{val} for every ₹1 of earnings" if val < 15 else f"Investors pay ₹{val} for every ₹1 of annual earnings"
            metrics['pe'] = {"value": val, "label": "P/E Ratio", "explanation": exp}
            
        if info.get('priceToBook'):
            val = round(info['priceToBook'], 1)
            metrics['pb'] = {"value": val, "label": "P/B Ratio", "explanation": f"Stock trades at {val}× its book value"}
            
        if info.get('trailingEps'):
            val = round(info['trailingEps'], 1)
            metrics['eps'] = {"value": val, "label": "Earnings Per Share", "explanation": f"Company earned ₹{val} per share last year"}
            
        if info.get('dividendYield'):
            val = round(info['dividendYield'] * 100, 1) 
            div = round(info['dividendYield'] * 10000)
            metrics['dividendYield'] = {"value": val, "label": "Dividend Yield", "explanation": f"₹{div} annual dividend per ₹10,000 invested"}
            
        if info.get('returnOnEquity'):
            val = round(info['returnOnEquity'] * 100, 1) 
            if val > 20:
                exp = f"Excellent — generates ₹{round(val)} profit for every ₹100 of equity"
            elif val < 10:
                exp = f"Modest — generates only ₹{round(val)} profit for every ₹100 of equity"
            else:
                exp = f"Generates ₹{round(val)} profit for every ₹100 of equity"
            metrics['roe'] = {"value": val, "label": "Return on Equity", "explanation": exp}
            
        if info.get('debtToEquity'):
            val = round(info['debtToEquity'], 1)
            if val > 100:
                exp = f"Highly leveraged — ₹{round(val)} debt for every ₹100 of equity"
            elif val < 20:
                exp = f"Almost debt-free — only ₹{round(val)} debt per ₹100 equity"
            else:
                exp = f"Low leverage — ₹{round(val)} debt per ₹100 equity"
            metrics['debtToEquity'] = {"value": val, "label": "Debt to Equity", "explanation": exp}
            
        if info.get('totalRevenue'):
            val = info['totalRevenue']
            metrics['revenue'] = {"value": val, "formatted": format_indian_number(val), "label": "Revenue (TTM)", "explanation": "Total sales in the trailing 12 months"}
            
        if info.get('netIncomeToCommon'):
            val = info['netIncomeToCommon']
            metrics['netProfit'] = {"value": val, "formatted": format_indian_number(val), "label": "Net Profit (TTM)", "explanation": "Bottom line profit after all expenses"}
            
        return {"info": info_dict, "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch data for {symbol}: {str(e)}")

@app.get("/api/company/{symbol}/history")
@limiter.limit("120/minute")
def get_company_history(symbol: str, request: Request, period: str = "1y"):
    valid_periods = ["1mo", "3mo", "6mo", "1y", "5y"]
    if period not in valid_periods:
        raise HTTPException(status_code=400, detail=f"Period must be one of {valid_periods}")
    
    if symbol in NIFTY_50:
        yf_symbol = NIFTY_50[symbol].get("symbol", f"{symbol}.NS")
    else:
        yf_symbol = symbol if symbol.endswith(".NS") or symbol.startswith("^") else f"{symbol}.NS"
        
    ticker = yf.Ticker(yf_symbol)
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

@app.get("/api/company/{symbol}/financials")
@limiter.limit("60/minute")
def get_company_financials(symbol: str, request: Request):
    if supabase:
        try:
            db_symbol = symbol if not symbol.endswith(".NS") else symbol[:-3]
            res = supabase.table("financial_statements").select("*").eq("symbol", db_symbol).execute()
            if res.data and len(res.data) > 0:
                return res.data
        except Exception as e:
            print("Supabase fetch failed for financials:", str(e))
    return {"profit_loss": None, "balance_sheet": None, "cash_flow": None}

@app.get("/api/company/{symbol}/quarterly")
@limiter.limit("60/minute")
def get_company_quarterly(symbol: str, request: Request):
    if supabase:
        try:
            db_symbol = symbol if not symbol.endswith(".NS") else symbol[:-3]
            res = supabase.table("quarterly_results").select("*").eq("symbol", db_symbol).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            print("Supabase fetch failed for quarterly:", str(e))
    return {"results": None}

@app.get("/api/company/{symbol}/peers")
@limiter.limit("60/minute")
def get_company_peers(symbol: str, request: Request):
    if supabase:
        try:
            db_symbol = symbol if not symbol.endswith(".NS") else symbol[:-3]
            res = supabase.table("peer_comparisons").select("*").eq("symbol", db_symbol).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            print("Supabase fetch failed for peers:", str(e))
    return {"peers": None}

