export interface Company {
  symbol: string;
  name: string;
  sector: string;
  market_cap: number;
  pe_ratio: number | null;
  pb_ratio: number | null;
  roe: number | null;
  dividend_yield: number | null;
  debt_to_equity: number | null;
  price: number;
  change_pct: number;
}

// ─── Institutional Benchmark Nifty 50 Dataset ─────────────────────────────
export const INSTITUTIONAL_UNIVERSE: Company[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', market_cap: 19800000000000, price: 2840.5, change_pct: 1.1, pe_ratio: 27.8, pb_ratio: 2.1, roe: 14.2, dividend_yield: 0.4, debt_to_equity: 0.38 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', market_cap: 14200000000000, price: 3950.0, change_pct: 0.8, pe_ratio: 29.5, pb_ratio: 12.8, roe: 48.5, dividend_yield: 1.4, debt_to_equity: 0.05 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Financials', market_cap: 12900000000000, price: 1720.0, change_pct: -0.4, pe_ratio: 18.2, pb_ratio: 2.7, roe: 16.8, dividend_yield: 1.1, debt_to_equity: 1.2 },
  { symbol: 'INFY', name: 'Infosys', sector: 'Technology', market_cap: 7800000000000, price: 1880.0, change_pct: 1.2, pe_ratio: 28.1, pb_ratio: 8.4, roe: 31.8, dividend_yield: 2.2, debt_to_equity: 0.08 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Financials', market_cap: 8900000000000, price: 1260.0, change_pct: 0.6, pe_ratio: 17.4, pb_ratio: 2.9, roe: 18.4, dividend_yield: 0.8, debt_to_equity: 1.1 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', market_cap: 9600000000000, price: 1680.0, change_pct: 1.8, pe_ratio: 54.0, pb_ratio: 8.6, roe: 19.5, dividend_yield: 0.5, debt_to_equity: 1.4 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financials', market_cap: 7200000000000, price: 810.0, change_pct: 0.3, pe_ratio: 10.5, pb_ratio: 1.6, roe: 17.2, dividend_yield: 1.7, debt_to_equity: 1.5 },
  { symbol: 'ITC', name: 'ITC', sector: 'Consumer Goods', market_cap: 6100000000000, price: 490.0, change_pct: -0.2, pe_ratio: 28.6, pb_ratio: 7.9, roe: 29.4, dividend_yield: 2.8, debt_to_equity: 0.01 },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', market_cap: 5100000000000, price: 3680.0, change_pct: 1.4, pe_ratio: 35.8, pb_ratio: 5.2, roe: 16.2, dividend_yield: 0.9, debt_to_equity: 0.85 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Financials', market_cap: 4400000000000, price: 7120.0, change_pct: -1.1, pe_ratio: 29.8, pb_ratio: 5.4, roe: 21.6, dividend_yield: 0.5, debt_to_equity: 3.8 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'Consumer Goods', market_cap: 5800000000000, price: 2480.0, change_pct: 0.2, pe_ratio: 56.4, pb_ratio: 10.8, roe: 20.3, dividend_yield: 1.7, debt_to_equity: 0.03 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Automobile', market_cap: 3900000000000, price: 12400.0, change_pct: 0.5, pe_ratio: 28.2, pb_ratio: 4.3, roe: 17.1, dividend_yield: 1.0, debt_to_equity: 0.02 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'Technology', market_cap: 4800000000000, price: 1780.0, change_pct: 1.5, pe_ratio: 27.4, pb_ratio: 6.8, roe: 26.5, dividend_yield: 2.9, debt_to_equity: 0.12 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Healthcare', market_cap: 4500000000000, price: 1880.0, change_pct: 0.7, pe_ratio: 38.6, pb_ratio: 6.1, roe: 17.4, dividend_yield: 0.7, debt_to_equity: 0.08 },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Financials', market_cap: 3600000000000, price: 1180.0, change_pct: -0.3, pe_ratio: 13.8, pb_ratio: 2.1, roe: 16.5, dividend_yield: 0.1, debt_to_equity: 1.2 },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer Goods', market_cap: 3100000000000, price: 3450.0, change_pct: 1.3, pe_ratio: 78.4, pb_ratio: 21.0, roe: 32.5, dividend_yield: 0.3, debt_to_equity: 0.45 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Materials', market_cap: 3200000000000, price: 11100.0, change_pct: 0.9, pe_ratio: 42.5, pb_ratio: 4.8, roe: 12.8, dividend_yield: 0.6, debt_to_equity: 0.28 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Financials', market_cap: 3500000000000, price: 1780.0, change_pct: -0.5, pe_ratio: 19.5, pb_ratio: 2.8, roe: 15.3, dividend_yield: 0.1, debt_to_equity: 1.0 },
  { symbol: 'NTPC', name: 'NTPC', sector: 'Energy', market_cap: 3900000000000, price: 405.0, change_pct: 1.8, pe_ratio: 18.2, pb_ratio: 2.3, roe: 13.5, dividend_yield: 1.9, debt_to_equity: 1.3 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy', market_cap: 3600000000000, price: 285.0, change_pct: -0.6, pe_ratio: 7.8, pb_ratio: 1.1, roe: 14.8, dividend_yield: 4.2, debt_to_equity: 0.42 },
  { symbol: 'TATASTEEL', name: 'Tata Steel', sector: 'Materials', market_cap: 1900000000000, price: 152.0, change_pct: 0.4, pe_ratio: 38.0, pb_ratio: 2.1, roe: 6.2, dividend_yield: 2.4, debt_to_equity: 0.88 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', sector: 'Utilities', market_cap: 3100000000000, price: 335.0, change_pct: 0.8, pe_ratio: 19.4, pb_ratio: 3.4, roe: 18.5, dividend_yield: 3.4, debt_to_equity: 1.4 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', sector: 'Automobile', market_cap: 3400000000000, price: 2820.0, change_pct: 2.1, pe_ratio: 29.4, pb_ratio: 5.1, roe: 19.2, dividend_yield: 0.8, debt_to_equity: 0.15 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Conglomerate', market_cap: 3200000000000, price: 2850.0, change_pct: -0.9, pe_ratio: 88.0, pb_ratio: 8.2, roe: 10.4, dividend_yield: 0.1, debt_to_equity: 1.1 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Automobile', market_cap: 3100000000000, price: 895.0, change_pct: 0.7, pe_ratio: 9.8, pb_ratio: 3.2, roe: 32.4, dividend_yield: 0.7, debt_to_equity: 0.62 },
  { symbol: 'COALINDIA', name: 'Coal India', sector: 'Energy', market_cap: 2800000000000, price: 460.0, change_pct: 0.5, pe_ratio: 7.9, pb_ratio: 3.1, roe: 42.1, dividend_yield: 5.8, debt_to_equity: 0.04 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', sector: 'Automobile', market_cap: 2700000000000, price: 9800.0, change_pct: 1.6, pe_ratio: 34.2, pb_ratio: 8.9, roe: 27.5, dividend_yield: 1.2, debt_to_equity: 0.00 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ', sector: 'Infrastructure', market_cap: 2900000000000, price: 1340.0, change_pct: -0.4, pe_ratio: 32.4, pb_ratio: 4.8, roe: 15.6, dividend_yield: 0.4, debt_to_equity: 0.85 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer Goods', market_cap: 2400000000000, price: 2520.0, change_pct: 1.2, pe_ratio: 48.6, pb_ratio: 13.5, roe: 28.4, dividend_yield: 1.3, debt_to_equity: 0.12 },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'Technology', market_cap: 2900000000000, price: 540.0, change_pct: 0.3, pe_ratio: 24.1, pb_ratio: 3.8, roe: 15.8, dividend_yield: 0.2, debt_to_equity: 0.22 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', sector: 'Materials', market_cap: 1600000000000, price: 685.0, change_pct: 0.8, pe_ratio: 15.2, pb_ratio: 1.6, roe: 11.2, dividend_yield: 0.6, debt_to_equity: 0.48 },
  { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'Consumer Goods', market_cap: 2200000000000, price: 2320.0, change_pct: -0.1, pe_ratio: 68.4, pb_ratio: 58.2, roe: 88.5, dividend_yield: 1.2, debt_to_equity: 0.14 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', sector: 'Materials', market_cap: 2300000000000, price: 955.0, change_pct: 0.4, pe_ratio: 28.5, pb_ratio: 2.8, roe: 10.4, dividend_yield: 0.8, debt_to_equity: 0.95 },
  { symbol: 'GRASIM', name: 'Grasim Industries', sector: 'Materials', market_cap: 1800000000000, price: 2650.0, change_pct: 1.1, pe_ratio: 26.4, pb_ratio: 1.8, roe: 7.2, dividend_yield: 0.4, debt_to_equity: 0.45 },
  { symbol: 'TECHM', name: 'Tech Mahindra', sector: 'Technology', market_cap: 1600000000000, price: 1680.0, change_pct: 1.7, pe_ratio: 42.8, pb_ratio: 5.4, roe: 12.8, dividend_yield: 2.4, debt_to_equity: 0.08 },
  { symbol: 'TRENT', name: 'Trent Ltd', sector: 'Consumer Goods', market_cap: 2400000000000, price: 6800.0, change_pct: 2.8, pe_ratio: 142.0, pb_ratio: 38.5, roe: 28.4, dividend_yield: 0.1, debt_to_equity: 0.18 },
  { symbol: 'BEL', name: 'Bharat Electronics', sector: 'Defense & Industrials', market_cap: 2100000000000, price: 295.0, change_pct: 1.9, pe_ratio: 46.2, pb_ratio: 12.8, roe: 29.5, dividend_yield: 0.8, debt_to_equity: 0.00 },
  { symbol: 'CIPLA', name: 'Cipla', sector: 'Healthcare', market_cap: 1300000000000, price: 1540.0, change_pct: 0.6, pe_ratio: 28.4, pb_ratio: 4.2, roe: 16.5, dividend_yield: 0.8, debt_to_equity: 0.02 },
  { symbol: 'DRREDDY', name: 'Dr. Reddy’s Laboratories', sector: 'Healthcare', market_cap: 1100000000000, price: 6580.0, change_pct: -0.3, pe_ratio: 19.8, pb_ratio: 3.4, roe: 18.2, dividend_yield: 0.6, debt_to_equity: 0.05 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', sector: 'Healthcare', market_cap: 1050000000000, price: 7180.0, change_pct: 0.9, pe_ratio: 78.4, pb_ratio: 12.4, roe: 17.5, dividend_yield: 0.2, debt_to_equity: 0.42 },
  { symbol: 'DIVISLAB', name: 'Divi’s Laboratories', sector: 'Healthcare', market_cap: 1550000000000, price: 5850.0, change_pct: 1.4, pe_ratio: 84.0, pb_ratio: 10.8, roe: 13.5, dividend_yield: 0.5, debt_to_equity: 0.00 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', sector: 'Automobile', market_cap: 1300000000000, price: 4780.0, change_pct: 1.2, pe_ratio: 32.4, pb_ratio: 6.8, roe: 23.4, dividend_yield: 1.1, debt_to_equity: 0.02 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', sector: 'Automobile', market_cap: 980000000000, price: 4890.0, change_pct: 0.4, pe_ratio: 23.5, pb_ratio: 4.8, roe: 21.8, dividend_yield: 2.8, debt_to_equity: 0.01 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', sector: 'Financials', market_cap: 1150000000000, price: 1480.0, change_pct: -1.4, pe_ratio: 12.8, pb_ratio: 1.8, roe: 14.8, dividend_yield: 1.1, debt_to_equity: 1.4 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', sector: 'Consumer Goods', market_cap: 1200000000000, price: 5120.0, change_pct: 0.1, pe_ratio: 54.2, pb_ratio: 28.4, roe: 54.2, dividend_yield: 1.4, debt_to_equity: 0.65 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'Consumer Goods', market_cap: 1100000000000, price: 1080.0, change_pct: 0.5, pe_ratio: 82.0, pb_ratio: 5.8, roe: 7.8, dividend_yield: 0.7, debt_to_equity: 0.12 },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', sector: 'Financials', market_cap: 1250000000000, price: 3250.0, change_pct: 1.5, pe_ratio: 15.4, pb_ratio: 2.3, roe: 16.2, dividend_yield: 1.4, debt_to_equity: 3.2 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corp', sector: 'Energy', market_cap: 1400000000000, price: 325.0, change_pct: 0.2, pe_ratio: 8.4, pb_ratio: 1.9, roe: 24.5, dividend_yield: 6.2, debt_to_equity: 0.55 },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance', sector: 'Financials', market_cap: 1550000000000, price: 720.0, change_pct: 0.3, pe_ratio: 86.0, pb_ratio: 11.2, roe: 14.2, dividend_yield: 0.3, debt_to_equity: 0.08 },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance', sector: 'Financials', market_cap: 1650000000000, price: 1640.0, change_pct: 0.8, pe_ratio: 74.0, pb_ratio: 9.8, roe: 14.8, dividend_yield: 0.2, debt_to_equity: 0.00 }
];
