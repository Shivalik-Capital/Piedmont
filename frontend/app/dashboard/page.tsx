'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart2,
  DollarSign,
  PieChart,
  Bot
} from 'lucide-react';
import PriceChart from '../components/PriceChart';

interface BenchmarkCard {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  pct: string;
  isPos: boolean;
  high: string;
  low: string;
  pe: string;
}

const PRIMARY_BENCHMARKS: BenchmarkCard[] = [
  {
    id: 'nifty50',
    symbol: 'nifty50',
    name: 'NIFTY 50',
    price: '25,810.45',
    change: '+108.20',
    pct: '+0.42%',
    isPos: true,
    high: '25,845.20',
    low: '25,715.10',
    pe: '22.8x'
  },
  {
    id: 'sensex',
    symbol: 'sensex',
    name: 'SENSEX',
    price: '84,520.70',
    change: '+340.50',
    pct: '+0.40%',
    isPos: true,
    high: '84,610.00',
    low: '84,180.40',
    pe: '23.4x'
  },
  {
    id: 'banknifty',
    symbol: 'banknifty',
    name: 'BANK NIFTY',
    price: '53,890.20',
    change: '+145.80',
    pct: '+0.27%',
    isPos: true,
    high: '54,020.60',
    low: '53,650.30',
    pe: '16.5x'
  },
  {
    id: 'vix',
    symbol: 'vix',
    name: 'INDIA VIX',
    price: '12.45',
    change: '-0.35',
    pct: '-2.73%',
    isPos: false,
    high: '13.10',
    low: '12.20',
    pe: 'Calm'
  }
];

const SECTORS = [
  { name: 'Nifty IT', change: '+1.25%', isPos: true, leader: 'TCS, INFY' },
  { name: 'Nifty Realty', change: '+1.10%', isPos: true, leader: 'DLF, Godrej' },
  { name: 'Nifty Auto', change: '+0.72%', isPos: true, leader: 'M&M, Maruti' },
  { name: 'Nifty Pharma', change: '+0.65%', isPos: true, leader: 'Sun Pharma, Cipla' },
  { name: 'Nifty Bank', change: '+0.27%', isPos: true, leader: 'ICICI, SBI' },
  { name: 'Nifty Energy', change: '+0.15%', isPos: true, leader: 'Reliance, NTPC' },
  { name: 'Nifty FMCG', change: '-0.35%', isPos: false, leader: 'HUL, Nestle' },
  { name: 'Nifty Metal', change: '-0.65%', isPos: false, leader: 'Tata Steel, JSW' },
];

const MACRO_VITAL_SIGNS = [
  { label: 'RBI Repo Rate', value: '5.50%', subtext: 'Neutral Policy Stance', isPos: true },
  { label: 'CPI Inflation (Oct)', value: '6.09%', subtext: 'Food 8.94%, Core Benign', isPos: false },
  { label: 'WPI Inflation (Oct)', value: '2.36%', subtext: 'Input Cost Tailwind', isPos: true },
  { label: 'Forex Reserves', value: '$719.55B', subtext: 'All-Time Record Buffer', isPos: true },
  { label: '10Y G-Sec Yield', value: '6.78%', subtext: 'Risk-Free Benchmark', isPos: true },
  { label: 'USD / INR', value: '₹84.38', subtext: 'Orderly RBI Smoothing', isPos: true },
  { label: 'Brent Crude Oil', value: '$72.80', subtext: 'Margin Tailwind for Paints & Aviation', isPos: true },
  { label: 'MCX Gold (10g)', value: '₹78,450', subtext: 'Import Bill Relief', isPos: true },
];

const TOP_GAINERS = [
  { symbol: 'TRENT', name: 'Trent Ltd', price: '₹6,800.00', change: '+2.80%', sector: 'Retail' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹3,950.00', change: '+2.40%', sector: 'IT Services' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', price: '₹2,820.00', change: '+2.10%', sector: 'Automobile' },
  { symbol: 'BEL', name: 'Bharat Electronics', price: '₹295.00', change: '+1.90%', sector: 'Defense' },
];

const TOP_DRAGGERS = [
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', price: '₹1,480.00', change: '-1.40%', sector: 'Banking' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: '₹7,120.00', change: '-1.10%', sector: 'NBFC' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: '₹2,850.00', change: '-0.90%', sector: 'Conglomerate' },
  { symbol: 'BPCL', name: 'Bharat Petroleum', price: '₹325.00', change: '-0.80%', sector: 'Energy' },
];

export default function DashboardOverviewPage() {
  const [activeBenchmark, setActiveBenchmark] = useState<'nifty50' | 'sensex' | 'banknifty'>('nifty50');

  const selectedObj = PRIMARY_BENCHMARKS.find(b => b.id === activeBenchmark) || PRIMARY_BENCHMARKS[0];

  return (
    <div className="w-full text-white pb-24 font-sans">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex flex-col gap-6 sm:gap-8">
        
        {/* ─── 1. STRATEGIC MARKET PULSE HEADER ──────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-[#868f97] uppercase font-semibold">
                NSE &bull; BSE Live Capital Markets Cockpit
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
                IST: 03:30 PM
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Market <span className="text-transparent bg-clip-text bg-[linear-gradient(97.13deg,#ffa16c_8.47%,#551b10_108.41%)]">Overview.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
              Real-time benchmark index movements, macroeconomic policy transmission, institutional FII/DII liquidity, and sectoral momentum across the Indian financial ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/screener"
              className="px-4 py-2 rounded-full bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] text-xs font-mono text-[#868f97] hover:text-white transition-all flex items-center gap-1.5"
            >
              <Search size={13} />
              <span>Screener (F3)</span>
            </Link>

            <Link
              href="/copilot"
              className="px-4 py-2 rounded-full bg-white hover:bg-[#e0e0e0] text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <Bot size={14} />
              <span>Ask Copilot (F1)</span>
            </Link>
          </div>
        </div>

        {/* ─── 2. 4-UP CORE BENCHMARK CARDS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRIMARY_BENCHMARKS.map((b) => {
            const isSelected = activeBenchmark === b.id;
            return (
              <div
                key={b.id}
                onClick={() => {
                  if (b.id !== 'vix') setActiveBenchmark(b.id as any);
                }}
                className={`bg-[#191919] rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden group shadow-lg ${
                  isSelected 
                    ? 'border-[#479ffa] shadow-[0_0_24px_rgba(71,159,250,0.2)] bg-[#1c1c1c]' 
                    : 'border-[#333333] hover:border-[#444444]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm text-white">{b.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#479ffa]" />
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${
                    b.isPos ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {b.isPos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {b.pct}
                  </span>
                </div>

                <div className="font-mono text-3xl font-bold text-white tracking-tight tabular-nums my-1">
                  {b.price}
                </div>

                <div className="text-[11px] font-mono text-[#868f97] flex items-center justify-between pt-2 border-t border-white/5">
                  <span>Range: {b.low} – {b.high}</span>
                  <span className="font-semibold text-white/80">P/E: {b.pe}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── 3. INTERACTIVE MAIN BENCHMARK CHART ───────────────────────────── */}
        <div className="bg-[#191919] rounded-2xl border border-[#333333] p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#121212] p-1 rounded-xl border border-[#2a2a2a]">
                <button
                  onClick={() => setActiveBenchmark('nifty50')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    activeBenchmark === 'nifty50' ? 'bg-white text-black shadow-sm' : 'text-[#868f97] hover:text-white'
                  }`}
                >
                  NIFTY 50
                </button>
                <button
                  onClick={() => setActiveBenchmark('sensex')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    activeBenchmark === 'sensex' ? 'bg-white text-black shadow-sm' : 'text-[#868f97] hover:text-white'
                  }`}
                >
                  SENSEX
                </button>
                <button
                  onClick={() => setActiveBenchmark('banknifty')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    activeBenchmark === 'banknifty' ? 'bg-white text-black shadow-sm' : 'text-[#868f97] hover:text-white'
                  }`}
                >
                  BANK NIFTY
                </button>
              </div>

              <div className="hidden md:flex items-baseline gap-2 font-mono">
                <span className="text-xl font-bold text-white">{selectedObj.price}</span>
                <span className={`text-xs font-semibold ${selectedObj.isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedObj.change} ({selectedObj.pct})
                </span>
              </div>
            </div>

            <Link
              href="/equities"
              className="text-xs text-[#868f97] hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              <span>Explore All Sector Indices</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Embed High-Precision Lightweight Chart */}
          <div className="overflow-hidden rounded-xl">
            <PriceChart symbol={selectedObj.symbol} name={selectedObj.name} />
          </div>
        </div>

        {/* ─── 4. INSTITUTIONAL LIQUIDITY FLOWS (FII & DII ACTIVITY) ─────────── */}
        <div className="bg-[#191919] rounded-2xl border border-[#333333] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Layers size={16} className="text-[#479ffa]" />
                <span>Institutional Liquidity & Capital Flows (FII vs DII)</span>
              </h2>
              <p className="text-xs text-[#868f97] mt-0.5">
                Surveillance of foreign portfolio flows vs domestic systematic investment plan (SIP) absorption
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Net Inflow: +₹830 Cr
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* DII Mutual Funds */}
            <div className="bg-[#121212] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#868f97] font-semibold">DII Mutual Funds</span>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Net Buyer</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                +₹9,280 Cr
              </div>
              <p className="text-[11px] text-[#868f97] leading-relaxed">
                Underpinned by monthly domestic retail mutual fund SIP run-rates exceeding ₹24,500 Cr/month.
              </p>
            </div>

            {/* FII Foreign Institutions */}
            <div className="bg-[#121212] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#868f97] font-semibold">FII Foreign Portfolio</span>
                <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">Net Seller</span>
              </div>
              <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                -₹8,450 Cr
              </div>
              <p className="text-[11px] text-[#868f97] leading-relaxed">
                Profit booking in select financial mega-caps amid global rate uncertainty; absorbed by domestic cash bids.
              </p>
            </div>

            {/* Market Breadth & Sentiment */}
            <div className="bg-[#121212] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#868f97] font-semibold">Nifty 50 Breadth</span>
                <span className="text-xs font-mono text-[#479ffa] font-bold">1.78x Adv/Dec</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-baseline gap-2">
                <span className="text-emerald-400">32 Adv</span>
                <span className="text-white/40">/</span>
                <span className="text-rose-400">18 Dec</span>
              </div>
              <div className="w-full bg-rose-500/40 h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-400 h-full rounded-full w-[64%]" />
              </div>
            </div>

          </div>
        </div>

        {/* ─── 5. SECTOR ROTATION HEATMAP ─────────────────────────────────── */}
        <div className="bg-[#191919] rounded-2xl border border-[#333333] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Activity size={16} className="text-[#4ebe96]" />
                <span>Sectoral Momentum & Rotation Heatmap</span>
              </h2>
              <p className="text-xs text-[#868f97] mt-0.5">Performance across 8 core NSE industry indices</p>
            </div>
            <Link href="/equities" className="text-xs text-[#479ffa] hover:underline font-mono">
              Sector Deep-Dive &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SECTORS.map((s) => (
              <div
                key={s.name}
                className="bg-[#121212] p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span>{s.name}</span>
                    <span className={`font-mono text-xs ${s.isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {s.change}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#868f97] truncate">
                    Drivers: {s.leader}
                  </div>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3">
                  <div 
                    className={`h-full rounded-full ${s.isPos ? 'bg-emerald-400' : 'bg-rose-400'}`} 
                    style={{ width: `${Math.min(100, Math.abs(parseFloat(s.change)) * 40 + 20)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 6. DUAL COLUMN: TOP MOVERS & MACRO VITAL SIGNS ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Top Movers in Nifty 50 (6 cols) */}
          <div className="lg:col-span-6 bg-[#191919] rounded-2xl border border-[#333333] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 size={16} className="text-[#ffa16c]" />
                <span>Nifty 50 Session Movers</span>
              </h3>
              <Link href="/screener" className="text-xs text-[#868f97] hover:text-white font-mono">
                Full Screener &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-2 tracking-wider">
                  TOP GAINERS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TOP_GAINERS.map((st) => (
                    <Link
                      key={st.symbol}
                      href={`/equities/companies/${st.symbol}`}
                      className="p-3 rounded-xl bg-[#121212] hover:bg-[#161616] border border-white/5 hover:border-emerald-400/40 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-white text-xs">{st.symbol}</div>
                        <div className="text-[10px] text-[#868f97]">{st.name}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-white/90">{st.price}</div>
                        <div className="text-[10px] text-emerald-400 font-bold">{st.change}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-2 tracking-wider">
                  TOP DRAGGERS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TOP_DRAGGERS.map((st) => (
                    <Link
                      key={st.symbol}
                      href={`/equities/companies/${st.symbol}`}
                      className="p-3 rounded-xl bg-[#121212] hover:bg-[#161616] border border-white/5 hover:border-rose-400/40 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-white text-xs">{st.symbol}</div>
                        <div className="text-[10px] text-[#868f97]">{st.name}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs text-white/90">{st.price}</div>
                        <div className="text-[10px] text-rose-400 font-bold">{st.change}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Macro & Commodity Transmission Radar (6 cols) */}
          <div className="lg:col-span-6 bg-[#191919] rounded-2xl border border-[#333333] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign size={16} className="text-[#4ebe96]" />
                <span>Macro & Commodity Telemetry</span>
              </h3>
              <Link href="/macro" className="text-xs text-[#868f97] hover:text-white font-mono">
                Macro Radar &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {MACRO_VITAL_SIGNS.map((m, idx) => (
                <div key={idx} className="bg-[#121212] p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-[#868f97] uppercase tracking-wider">{m.label}</div>
                  <div className="font-mono text-lg font-bold text-white">{m.value}</div>
                  <div className="text-[10px] text-white/60 leading-tight">{m.subtext}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#868f97]">
              <span>Official Data Source: RBI &bull; MoSPI &bull; MCX</span>
              <Link href="/commodities" className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]">
                <span>Commodities Explanations</span>
                <ChevronRight size={11} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
