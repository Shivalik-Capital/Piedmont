'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  SlidersHorizontal, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  X, 
  ChevronDown, 
  ChevronUp,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
const INSTITUTIONAL_UNIVERSE: Company[] = [
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
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', sector: 'Automobile', market_cap: 2800000000000, price: 9800.0, change_pct: 1.4, pe_ratio: 34.2, pb_ratio: 8.5, roe: 27.8, dividend_yield: 2.1, debt_to_equity: 0.01 },
  { symbol: 'COALINDIA', name: 'Coal India', sector: 'Materials', market_cap: 2900000000000, price: 475.0, change_pct: 1.1, pe_ratio: 8.4, pb_ratio: 3.1, roe: 42.0, dividend_yield: 5.4, debt_to_equity: 0.05 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', sector: 'Financials', market_cap: 2700000000000, price: 1710.0, change_pct: -0.4, pe_ratio: 32.5, pb_ratio: 4.2, roe: 14.1, dividend_yield: 0.1, debt_to_equity: 2.8 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', sector: 'Infrastructure', market_cap: 2900000000000, price: 1360.0, change_pct: 0.7, pe_ratio: 31.0, pb_ratio: 4.8, roe: 16.8, dividend_yield: 0.5, debt_to_equity: 1.1 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', sector: 'Materials', market_cap: 2300000000000, price: 960.0, change_pct: -0.2, pe_ratio: 26.5, pb_ratio: 2.9, roe: 12.1, dividend_yield: 0.8, debt_to_equity: 1.05 },
  { symbol: 'CIPLA', name: 'Cipla', sector: 'Healthcare', market_cap: 1250000000000, price: 1540.0, change_pct: 0.3, pe_ratio: 27.5, pb_ratio: 4.1, roe: 16.2, dividend_yield: 0.9, debt_to_equity: 0.02 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', sector: 'Automobile', market_cap: 1320000000000, price: 4820.0, change_pct: 1.2, pe_ratio: 31.2, pb_ratio: 6.4, roe: 22.4, dividend_yield: 1.1, debt_to_equity: 0.04 },
  { symbol: 'BPCL', name: 'Bharat Petroleum', sector: 'Energy', market_cap: 1450000000000, price: 340.0, change_pct: -0.8, pe_ratio: 5.6, pb_ratio: 1.8, roe: 36.2, dividend_yield: 6.2, debt_to_equity: 0.75 },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Healthcare', market_cap: 1100000000000, price: 6580.0, change_pct: 0.4, pe_ratio: 21.0, pb_ratio: 3.5, roe: 18.6, dividend_yield: 0.6, debt_to_equity: 0.06 },
  { symbol: 'GRASIM', name: 'Grasim Industries', sector: 'Materials', market_cap: 1700000000000, price: 2540.0, change_pct: 0.1, pe_ratio: 32.0, pb_ratio: 1.9, roe: 7.5, dividend_yield: 0.4, debt_to_equity: 0.72 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', sector: 'Consumer Goods', market_cap: 1380000000000, price: 5750.0, change_pct: -0.5, pe_ratio: 58.2, pb_ratio: 32.0, roe: 54.0, dividend_yield: 1.3, debt_to_equity: 0.78 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'Consumer Goods', market_cap: 1080000000000, price: 1120.0, change_pct: 0.3, pe_ratio: 76.0, pb_ratio: 5.8, roe: 8.2, dividend_yield: 0.8, debt_to_equity: 0.12 },
  { symbol: 'TECHM', name: 'Tech Mahindra', sector: 'Technology', market_cap: 1550000000000, price: 1620.0, change_pct: 2.0, pe_ratio: 48.0, pb_ratio: 5.4, roe: 11.8, dividend_yield: 2.8, debt_to_equity: 0.10 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', sector: 'Automobile', market_cap: 1050000000000, price: 5240.0, change_pct: 0.5, pe_ratio: 25.8, pb_ratio: 5.6, roe: 23.5, dividend_yield: 2.7, debt_to_equity: 0.02 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', sector: 'Healthcare', market_cap: 1020000000000, price: 7100.0, change_pct: 0.8, pe_ratio: 82.0, pb_ratio: 13.5, roe: 16.5, dividend_yield: 0.2, debt_to_equity: 0.65 },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories", sector: 'Healthcare', market_cap: 1540000000000, price: 5800.0, change_pct: 1.6, pe_ratio: 86.0, pb_ratio: 10.8, roe: 13.2, dividend_yield: 0.5, debt_to_equity: 0.01 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', sector: 'Materials', market_cap: 1580000000000, price: 710.0, change_pct: -0.3, pe_ratio: 16.2, pb_ratio: 1.5, roe: 9.8, dividend_yield: 0.5, debt_to_equity: 0.55 },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', sector: 'Financials', market_cap: 1280000000000, price: 3420.0, change_pct: 1.1, pe_ratio: 16.5, pb_ratio: 2.3, roe: 15.6, dividend_yield: 1.4, debt_to_equity: 3.5 },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance', sector: 'Financials', market_cap: 1720000000000, price: 1720.0, change_pct: -0.1, pe_ratio: 78.0, pb_ratio: 11.2, roe: 14.8, dividend_yield: 0.2, debt_to_equity: 0.0 },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance', sector: 'Financials', market_cap: 1580000000000, price: 735.0, change_pct: 0.2, pe_ratio: 88.0, pb_ratio: 10.4, roe: 12.5, dividend_yield: 0.3, debt_to_equity: 0.0 },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'Technology', market_cap: 2850000000000, price: 545.0, change_pct: 0.9, pe_ratio: 24.8, pb_ratio: 3.8, roe: 15.6, dividend_yield: 0.2, debt_to_equity: 0.22 },
  { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'Consumer Goods', market_cap: 2320000000000, price: 2410.0, change_pct: -0.4, pe_ratio: 72.0, pb_ratio: 65.0, roe: 108.0, dividend_yield: 1.4, debt_to_equity: 0.08 },
];

type FactorPreset = 'all' | 'high_roic' | 'cash_fortress' | 'capex_cycle' | 'garp' | 'financials';

const PRESET_CONFIGS: Record<FactorPreset, { label: string; desc: string }> = {
  all: { label: 'All Nifty 50', desc: 'Full benchmark institutional universe' },
  high_roic: { label: 'High-ROIC Moats', desc: 'ROCE/ROE > 18%, Low Debt (< 0.5x)' },
  cash_fortress: { label: 'Cash Fortress', desc: 'Debt-free balance sheets & solid yields' },
  capex_cycle: { label: 'Capex & Infra', desc: 'Infrastructure, energy, materials & power' },
  garp: { label: 'GARP Compounders', desc: 'Balanced valuation (P/E < 35) & ROE > 15%' },
  financials: { label: 'Financial Quality', desc: 'Leading private & public banking franchises' },
};

function formatMarketCap(mcap: number): string {
  if (mcap >= 1e12) {
    return `₹${(mcap / 1e12).toFixed(1)}L Cr`;
  }
  if (mcap >= 1e9) {
    return `₹${(mcap / 1e9).toFixed(0)} Cr`;
  }
  return `₹${mcap.toLocaleString('en-IN')}`;
}

export default function ScreenerPage() {
  const [universe, setUniverse] = useState<Company[]>(INSTITUTIONAL_UNIVERSE);
  const [activePreset, setActivePreset] = useState<FactorPreset>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Quantitative Filters
  const [sector, setSector] = useState('');
  const [maxPe, setMaxPe] = useState<number>(100);
  const [maxPb, setMaxPb] = useState<number>(20);
  const [minRoe, setMinRoe] = useState<number>(0);
  const [minDivYield, setMinDivYield] = useState<number>(0);
  const [maxDebtEquity, setMaxDebtEquity] = useState<number>(4);
  const [sortBy, setSortBy] = useState<'market_cap' | 'roe' | 'pe_ratio' | 'dividend_yield'>('market_cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Background sync with API if available
  useEffect(() => {
    async function syncMarketPrices() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/company/list`);
        if (res.ok) {
          const liveList = await res.json();
          if (Array.isArray(liveList) && liveList.length > 0) {
            setUniverse(prev => {
              const liveMap = new Map(liveList.map((item: any) => [item.id || item.symbol?.replace('.NS', ''), item]));
              return prev.map(comp => {
                const live = liveMap.get(comp.symbol);
                if (live && live.price) {
                  return {
                    ...comp,
                    price: live.price,
                    change_pct: live.change_pct ?? comp.change_pct,
                    market_cap: live.marketCap || comp.market_cap
                  };
                }
                return comp;
              });
            });
          }
        }
      } catch (err) {
        // Fallback to static institutional universe
      }
    }
    syncMarketPrices();
  }, []);

  // Handle Preset selection
  const applyPreset = (preset: FactorPreset) => {
    setActivePreset(preset);
    setSearchQuery('');
    setSector('');

    if (preset === 'all') {
      setMaxPe(100);
      setMaxPb(20);
      setMinRoe(0);
      setMinDivYield(0);
      setMaxDebtEquity(4);
    } else if (preset === 'high_roic') {
      setMaxPe(90);
      setMaxPb(25);
      setMinRoe(18);
      setMinDivYield(0);
      setMaxDebtEquity(0.5);
    } else if (preset === 'cash_fortress') {
      setMaxPe(60);
      setMaxPb(20);
      setMinRoe(10);
      setMinDivYield(1.0);
      setMaxDebtEquity(0.2);
    } else if (preset === 'capex_cycle') {
      setMaxPe(50);
      setMaxPb(10);
      setMinRoe(8);
      setMinDivYield(0);
      setMaxDebtEquity(2.0);
    } else if (preset === 'garp') {
      setMaxPe(35);
      setMaxPb(10);
      setMinRoe(15);
      setMinDivYield(0);
      setMaxDebtEquity(1.5);
    } else if (preset === 'financials') {
      setSector('Financials');
      setMaxPe(40);
      setMaxPb(5);
      setMinRoe(12);
      setMinDivYield(0);
      setMaxDebtEquity(5.0);
    }
  };

  const resetFilters = () => {
    applyPreset('all');
  };

  // Check how many filters deviate from default
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (sector) count++;
    if (maxPe < 100) count++;
    if (maxPb < 20) count++;
    if (minRoe > 0) count++;
    if (minDivYield > 0) count++;
    if (maxDebtEquity < 4) count++;
    return count;
  }, [sector, maxPe, maxPb, minRoe, minDivYield, maxDebtEquity]);

  // Client-side Instantaneous In-Memory Filtering (0ms latency)
  const filteredCompanies = useMemo(() => {
    let list = universe.filter(comp => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = comp.symbol.toLowerCase().includes(q) || comp.name.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Preset specifics
      if (activePreset === 'capex_cycle') {
        const capexSectors = ['Energy', 'Materials', 'Infrastructure', 'Utilities'];
        if (!capexSectors.includes(comp.sector)) return false;
      }
      if (activePreset === 'financials') {
        if (comp.sector !== 'Financials') return false;
      }
      // Sector filter
      if (sector && comp.sector !== sector) {
        return false;
      }
      // P/E
      if (comp.pe_ratio != null && comp.pe_ratio > maxPe) {
        return false;
      }
      // P/B
      if (comp.pb_ratio != null && comp.pb_ratio > maxPb) {
        return false;
      }
      // ROE
      if (comp.roe != null && comp.roe < minRoe) {
        return false;
      }
      // Dividend Yield
      if (comp.dividend_yield != null && comp.dividend_yield < minDivYield) {
        return false;
      }
      // Debt / Equity
      if (comp.debt_to_equity != null && comp.debt_to_equity > maxDebtEquity) {
        return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      let valA = a[sortBy] ?? -999999;
      let valB = b[sortBy] ?? -999999;
      if (sortBy === 'pe_ratio') {
        valA = a.pe_ratio ?? 999999;
        valB = b.pe_ratio ?? 999999;
      }
      return sortOrder === 'desc' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
    });

    return list;
  }, [universe, activePreset, searchQuery, sector, maxPe, maxPb, minRoe, minDivYield, maxDebtEquity, sortBy, sortOrder]);

  const uniqueSectors = useMemo(() => {
    const set = new Set(universe.map(c => c.sector));
    return Array.from(set).sort();
  }, [universe]);

  return (
    <div className="w-full text-white pb-20">
      
      {/* ─── Header & Institutional Thesis ─────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#868f97] uppercase">Institutional Factor Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">Stock Screener</h1>
            <p className="text-xs sm:text-sm text-[#868f97] mt-1 max-w-2xl">
              Screening beyond raw multiples. Filter for capital allocation quality (ROIC/ROCE), debt sustainability, and institutional factor regimes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#868f97] font-mono bg-[#141414] border border-white/10 px-3 py-1.5 rounded-full">
              {filteredCompanies.length} of {universe.length} Constituents
            </span>
          </div>
        </div>

        {/* ─── Thematic Factor Presets Bar ─────────────────────────── */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {(Object.keys(PRESET_CONFIGS) as FactorPreset[]).map(key => {
            const item = PRESET_CONFIGS[key];
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-[#141414] text-[#868f97] border-white/10 hover:border-white/25 hover:text-white'
                }`}
                title={item.desc}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Mobile Parameters Toggle (Phone Screens) ─────────────── */}
      <div className="xl:hidden mb-4">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-sm font-medium text-white hover:bg-[#1a1a1a] transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#868f97]" />
            <span>Filter Parameters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">
                {activeFilterCount} active
              </span>
            )}
          </div>
          {mobileFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* ─── Main Screener Layout: Left Sidebar + Results ─────────── */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* ─── Parameters Panel (Collapsible on Mobile, Fixed Sidebar on XL) ── */}
        <div className={`w-full xl:w-72 shrink-0 ${mobileFilterOpen ? 'block' : 'hidden xl:block'}`}>
          <div className="bg-[#121212] p-5 rounded-2xl border border-white/10 sticky top-24 space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <SlidersHorizontal size={16} className="text-white/60" />
                <span>Filters & Ranges</span>
              </div>
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters} 
                  className="text-[11px] text-[#868f97] hover:text-white underline transition-colors"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#868f97] block mb-1.5 font-medium">Quick Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="e.g. TCS, HDFC, Titan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0b0b0b] text-white placeholder-white/30 text-xs pl-8 pr-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/30"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Sector Selector */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#868f97] block mb-1.5 font-medium">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-[#0b0b0b] text-white text-xs border border-white/10 rounded-lg p-2 focus:outline-none focus:border-white/30"
              >
                <option value="">All Sectors ({uniqueSectors.length})</option>
                {uniqueSectors.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-1">
              {/* Max P/E */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#868f97] text-[11px] uppercase tracking-wider">Max P/E</span>
                  <span className="font-mono text-white text-xs">{maxPe}x</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="120" 
                  step="5" 
                  value={maxPe} 
                  onChange={(e) => setMaxPe(Number(e.target.value))} 
                  className="w-full accent-white h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Min ROE */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#868f97] text-[11px] uppercase tracking-wider">Min ROE / ROCE</span>
                  <span className="font-mono text-emerald-400 text-xs font-semibold">{minRoe}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="2" 
                  value={minRoe} 
                  onChange={(e) => setMinRoe(Number(e.target.value))} 
                  className="w-full accent-emerald-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Max Debt/Equity */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#868f97] text-[11px] uppercase tracking-wider">Max Debt / Equity</span>
                  <span className="font-mono text-white text-xs">{maxDebtEquity.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  step="0.2" 
                  value={maxDebtEquity} 
                  onChange={(e) => setMaxDebtEquity(Number(e.target.value))} 
                  className="w-full accent-white h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Min Div Yield */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#868f97] text-[11px] uppercase tracking-wider">Min Div Yield</span>
                  <span className="font-mono text-white text-xs">{minDivYield.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="6" 
                  step="0.5" 
                  value={minDivYield} 
                  onChange={(e) => setMinDivYield(Number(e.target.value))} 
                  className="w-full accent-white h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Max P/B */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#868f97] text-[11px] uppercase tracking-wider">Max P/B</span>
                  <span className="font-mono text-white text-xs">{maxPb}x</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1" 
                  value={maxPb} 
                  onChange={(e) => setMaxPb(Number(e.target.value))} 
                  className="w-full accent-white h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Institutional Methodology Callout */}
            <div className="bg-[#181818] p-3 rounded-xl border border-white/5 text-[11px] text-[#868f97] leading-relaxed">
              <span className="font-semibold text-white block mb-0.5">CIO Principle:</span>
              High P/E isn't always expensive if ROE is 30%+ with zero debt. Screen for quality spread ($ROIC &gt; WACC$).
            </div>

          </div>
        </div>

        {/* ─── Results Section ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          
          {/* Active Preset Sub-header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#868f97]">Showing:</span>
              <span className="text-xs font-semibold text-white bg-[#141414] border border-white/10 px-2.5 py-1 rounded-md">
                {PRESET_CONFIGS[activePreset].label}
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-[#868f97]">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#141414] text-white text-xs border border-white/10 rounded px-2 py-1 focus:outline-none"
              >
                <option value="market_cap">Market Cap</option>
                <option value="roe">ROE / ROCE</option>
                <option value="pe_ratio">Lowest P/E</option>
                <option value="dividend_yield">Dividend Yield</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="p-1 rounded bg-[#141414] border border-white/10 text-white hover:bg-white/10"
                title="Toggle order"
              >
                <ArrowUpDown size={12} />
              </button>
            </div>
          </div>

          {/* ─── MOBILE CARDS VIEW (Phone Screens < 768px) ──────────── */}
          <div className="block md:hidden space-y-3">
            {filteredCompanies.length === 0 ? (
              <div className="bg-[#121212] rounded-2xl border border-white/10 p-8 text-center text-[#868f97]">
                <p className="text-sm">No companies match this institutional filter.</p>
                <button onClick={resetFilters} className="mt-3 text-xs text-white underline">
                  Reset parameters
                </button>
              </div>
            ) : (
              filteredCompanies.map(c => {
                const isPositive = c.change_pct >= 0;
                return (
                  <Link
                    key={c.symbol}
                    href={`/equities/companies/${c.symbol}`}
                    className="block bg-[#141414] p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base tracking-tight">{c.symbol}</span>
                          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[#868f97]">
                            {c.sector}
                          </span>
                        </div>
                        <div className="text-xs text-[#868f97] truncate max-w-[200px] mt-0.5">{c.name}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-white">
                          ₹{c.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`text-[11px] font-mono flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{c.change_pct.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    {/* 4-Metric Mobile Grid */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-center">
                      <div className="bg-[#0b0b0b] p-1.5 rounded-lg border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-[#868f97]">ROE</div>
                        <div className={`text-xs font-mono font-bold mt-0.5 ${c.roe && c.roe >= 20 ? 'text-emerald-400' : 'text-white'}`}>
                          {c.roe != null ? `${c.roe.toFixed(1)}%` : '—'}
                        </div>
                      </div>

                      <div className="bg-[#0b0b0b] p-1.5 rounded-lg border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-[#868f97]">P/E</div>
                        <div className="text-xs font-mono font-semibold text-white mt-0.5">
                          {c.pe_ratio != null ? `${c.pe_ratio.toFixed(1)}x` : '—'}
                        </div>
                      </div>

                      <div className="bg-[#0b0b0b] p-1.5 rounded-lg border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-[#868f97]">D/E</div>
                        <div className={`text-xs font-mono font-semibold mt-0.5 ${c.debt_to_equity != null && c.debt_to_equity <= 0.1 ? 'text-emerald-400' : 'text-white'}`}>
                          {c.debt_to_equity != null ? `${c.debt_to_equity.toFixed(2)}` : '—'}
                        </div>
                      </div>

                      <div className="bg-[#0b0b0b] p-1.5 rounded-lg border border-white/5">
                        <div className="text-[9px] uppercase tracking-wider text-[#868f97]">Mkt Cap</div>
                        <div className="text-[11px] font-mono font-medium text-white/90 mt-0.5">
                          {formatMarketCap(c.market_cap)}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* ─── DESKTOP DATA TABLE (md and above) ───────────────────── */}
          <div className="hidden md:block bg-[#121212] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#161616] text-[#868f97] text-[11px] uppercase tracking-wider font-mono">
                    <th className="py-3.5 px-4 font-semibold">Symbol</th>
                    <th className="py-3.5 px-4 font-semibold">Company Name</th>
                    <th className="py-3.5 px-4 font-semibold">Sector</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Price</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Mkt Cap</th>
                    <th className="py-3.5 px-4 font-semibold text-right">
                      <Link href="/learn/pe" className="hover:text-white underline decoration-dotted">P/E</Link>
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-right">
                      <Link href="/learn/roe" className="hover:text-white underline decoration-dotted">ROE</Link>
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-right">
                      <Link href="/learn/debtToEquity" className="hover:text-white underline decoration-dotted">D/E</Link>
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-right">
                      <Link href="/learn/dividendYield" className="hover:text-white underline decoration-dotted">Div Yld</Link>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-white/5 font-sans">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-[#868f97]">
                        <p className="text-sm">No companies match this institutional filter.</p>
                        <button onClick={resetFilters} className="mt-2 text-xs text-white underline">
                          Reset all parameters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map(c => {
                      const isPositive = c.change_pct >= 0;
                      return (
                        <tr 
                          key={c.symbol} 
                          className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                        >
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            <Link href={`/equities/companies/${c.symbol}`} className="hover:underline flex items-center gap-1.5">
                              {c.symbol}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-white/90 font-medium">
                            <Link href={`/equities/companies/${c.symbol}`} className="hover:text-white">
                              {c.name}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-[#868f97]">{c.sector}</td>
                          <td className="py-3 px-4 text-right font-mono text-white">
                            <div>₹{c.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            <div className={`text-[10px] ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isPositive ? '+' : ''}{c.change_pct.toFixed(2)}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white/80">
                            {formatMarketCap(c.market_cap)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            <span className="text-white font-medium">
                              {c.pe_ratio != null ? `${c.pe_ratio.toFixed(1)}x` : '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${
                              c.roe && c.roe >= 25 
                                ? 'bg-emerald-500/15 text-emerald-400' 
                                : c.roe && c.roe >= 15 
                                ? 'text-white' 
                                : 'text-[#868f97]'
                            }`}>
                              {c.roe != null ? `${c.roe.toFixed(1)}%` : '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            <span className={c.debt_to_equity != null && c.debt_to_equity <= 0.1 ? 'text-emerald-400 font-semibold' : 'text-white/80'}>
                              {c.debt_to_equity != null ? c.debt_to_equity.toFixed(2) : '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white/80">
                            {c.dividend_yield != null ? `${c.dividend_yield.toFixed(1)}%` : '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
