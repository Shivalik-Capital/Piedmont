export interface IndexData {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  change_pct: number;
  previous_close: number;
  id?: string;
  prefix?: string;
}

export interface MarketResponse {
  indices: Record<string, IndexData>;
  meta: { source: string; fetched_at: string; timezone: string };
}

export interface SectorResponse {
  sectors: Record<string, IndexData>;
  meta: { source: string; fetched_at: string; timezone: string };
}

export interface CommodityResponse {
  commodities: Record<string, IndexData>;
  meta: { source: string; fetched_at: string; timezone: string };
}

export interface MacroIndicator {
  name: string;
  value: string;
  trend: string;
  date?: string;
}

export interface MacroResponse {
  indicators: Record<string, MacroIndicator>;
  meta: { source: string; fetched_at: string; timezone: string };
}

export function getMarketStatus(exchange: string): boolean {
  const now = new Date();
  const utcDay = now.getUTCDay(); // 0=Sun, 6=Sat
  const utcTime = now.getUTCHours() + now.getUTCMinutes() / 60;
  
  // IST = UTC + 5.5
  let timeIst = utcTime + 5.5;
  let dayIst = utcDay;
  if (timeIst >= 24) {
    timeIst -= 24;
    dayIst = (dayIst + 1) % 7;
  }
  
  // Indian exchanges: Mon-Fri, 9:15 AM – 3:30 PM IST
  if (exchange === 'NSE' || exchange === 'BSE') {
    if (dayIst === 0 || dayIst === 6) return false;
    return timeIst >= 9.25 && timeIst < 15.5;
  }
  
  // US exchanges & Forex operate on a UTC weekly cycle:
  // Closed: Sat 00:00 UTC (Fri 5PM ET close) → Sun 22:00 UTC (Sun 5PM ET open for Forex)
  // COMEX/NYMEX: Sun 23:00 UTC (Sun 6PM ET) → Fri 22:00 UTC (Fri 5PM ET)
  // NYSE: Mon-Fri 13:30-20:00 UTC (9:30AM-4PM ET)
  
  // Full weekend closure: All of Saturday, Sunday until 22:00 UTC
  if (utcDay === 6) return false; // All Saturday UTC = closed
  if (utcDay === 0 && utcTime < 22) return false; // Sunday before 5PM ET = closed
  
  if (exchange === 'FOREX') {
    // Forex: Sun 22:00 UTC → Fri 22:00 UTC (continuous)
    if (utcDay === 5 && utcTime >= 22) return false; // Fri after 5PM ET
    return true;
  }
  
  if (exchange === 'COMEX' || exchange === 'NYMEX') {
    // Futures: Sun 23:00 UTC → Fri 22:00 UTC (with daily 1hr break 22:00-23:00 UTC)
    if (utcDay === 0 && utcTime < 23) return false; // Sun before 6PM ET
    if (utcDay === 5 && utcTime >= 22) return false; // Fri after 5PM ET
    // Daily maintenance break: 22:00-23:00 UTC (5PM-6PM ET) Mon-Thu
    if (utcTime >= 22 && utcTime < 23) return false;
    return true;
  }
  
  // Default fallback
  return false;
}

export function getGlobalSessionName(): { label: string; active: boolean } {
  const now = new Date();
  const utcDay = now.getUTCDay();
  const utcTime = now.getUTCHours() + now.getUTCMinutes() / 60;
  
  let timeIst = utcTime + 5.5;
  let dayIst = utcDay;
  if (timeIst >= 24) {
    timeIst -= 24;
    dayIst = (dayIst + 1) % 7;
  }
  
  if (utcDay === 6) return { label: 'MARKETS: CLOSED', active: false };
  if (utcDay === 0 && utcTime < 22) return { label: 'MARKETS: CLOSED', active: false };
  if (utcDay === 5 && utcTime >= 22) return { label: 'MARKETS: CLOSED', active: false };
  
  if (timeIst >= 9.25 && timeIst < 15.5) {
    return { label: 'INDIAN MARKET', active: true };
  } else if (timeIst >= 19 || (timeIst >= 0 && timeIst < 1.5)) {
    return { label: 'NEW YORK SESSION', active: true };
  } else if (timeIst >= 13.5 && timeIst < 19) {
    return { label: 'LONDON SESSION', active: true };
  } else if (timeIst >= 3.5 && timeIst < 9.25) {
    return { label: 'ASIAN SESSION', active: true };
  } else if (timeIst >= 1.5 && timeIst < 3.5) {
    return { label: 'MARKETS: CLOSED', active: false };
  }
  return { label: 'GLOBAL MARKET', active: false };
}
