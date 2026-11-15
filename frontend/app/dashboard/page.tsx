'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '../components/ui/Icon';
import PriceChart from '../components/PriceChart';

type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface ChartDataPoint {
  line: string;
  area: string;
  tx: number;
  ty: number;
  label: string;
  returnVal: string;
  returnPct: string;
}

const CHART_VARIATIONS: Record<TimeRange, ChartDataPoint> = {
  '1D': {
    line: 'M0,240 Q120,210 240,225 T480,140 T720,95 T1000,30',
    area: 'M0,240 Q120,210 240,225 T480,140 T720,95 T1000,30 L1000,280 L0,280 Z',
    tx: 1000,
    ty: 30,
    label: '1D Session',
    returnVal: '+₹342,100.00',
    returnPct: '+0.82%'
  },
  '1W': {
    line: 'M0,210 Q200,250 400,180 T700,110 T1000,60',
    area: 'M0,210 Q200,250 400,180 T700,110 T1000,60 L1000,280 L0,280 Z',
    tx: 1000,
    ty: 60,
    label: '5-Day Trailing',
    returnVal: '+₹1,180,450.00',
    returnPct: '+2.84%'
  },
  '1M': {
    line: 'M0,260 Q150,190 350,220 T650,80 T1000,45',
    area: 'M0,260 Q150,190 350,220 T650,80 T1000,45 L1000,280 L0,280 Z',
    tx: 1000,
    ty: 45,
    label: '1-Month Trailing',
    returnVal: '+₹2,420,800.00',
    returnPct: '+5.98%'
  },
  '1Y': {
    line: 'M0,270 Q300,160 550,200 T850,50 T1000,20',
    area: 'M0,270 Q300,160 550,200 T850,50 T1000,20 L1000,280 L0,280 Z',
    tx: 1000,
    ty: 20,
    label: '1-Year Annualized',
    returnVal: '+₹5,340,119.00',
    returnPct: '+14.28%'
  },
  'ALL': {
    line: 'M0,260 Q250,230 500,140 T800,70 T1000,15',
    area: 'M0,260 Q250,230 500,140 T800,70 T1000,15 L1000,280 L0,280 Z',
    tx: 1000,
    ty: 15,
    label: 'Inception Horizon',
    returnVal: '+₹14,920,000.00',
    returnPct: '+53.40%'
  }
};

const LIVE_BENCHMARKS = [
  { symbol: '^NSEI', id: 'nifty50', name: 'NIFTY 50', price: '25,810.45', change: '+108.20', pct: '+0.42%', isPos: true },
  { symbol: '^BSESN', id: 'sensex', name: 'SENSEX', price: '84,520.70', change: '+340.50', pct: '+0.40%', isPos: true },
  { symbol: '^NSEBANK', id: 'banknifty', name: 'BANK NIFTY', price: '53,890.20', change: '+145.80', pct: '+0.27%', isPos: true },
  { symbol: '10Y', id: '10y_gsec', name: '10Y G-SEC', price: '6.78%', change: '-0.02', pct: '-0.29%', isPos: false },
  { symbol: 'INR=X', id: 'usd_inr', name: 'USD / INR', price: '₹84.38', change: '+0.04', pct: '+0.05%', isPos: true },
  { symbol: 'GC=F', id: 'gold', name: 'GOLD (MCX)', price: '₹78,450', change: '+420.00', pct: '+0.54%', isPos: true },
  { symbol: 'CL=F', id: 'crude_oil', name: 'BRENT CRUDE', price: '$72.80', change: '-0.65', pct: '-0.89%', isPos: false },
];

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const [selectedSymbol, setSelectedSymbol] = useState<{ symbol: string; name: string } | null>(null);
  const [reportExported, setReportExported] = useState(false);

  const activeCurve = CHART_VARIATIONS[selectedRange];

  const handleExport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 2500);
  };

  return (
    <div className="w-full text-white pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex flex-col gap-6 sm:gap-8">
        
        {/* ========================================================================= */}
        {/* 1. STRATEGIC HEADER (STITCH SCREEN 1 & 2)                                  */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffa16c] animate-pulse" />
              <span className="font-mono-data text-[10px] sm:text-[11px] tracking-widest text-[#868f97] uppercase font-semibold">
                Strategic Liquidity & Positioning Matrix
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.08em] leading-tight text-white">
              Executive Market <span className="fey-gradient-ember">Intelligence.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#868f97] mt-1.5 leading-relaxed">
              Institutional multi-asset aggregation, quantitative factor signals, and automated real-time cross-asset sensitivity telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-full bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] text-xs font-mono-data text-[#868f97] hover:text-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.6)]"
            >
              <Icon name="download" className="w-3.5 h-3.5 text-[#ffa16c]" />
              <span>{reportExported ? 'SNAPSHOT COPIED' : 'EXPORT REPORT'}</span>
            </button>

            <Link
              href="/intelligence"
              className="px-4 py-2 rounded-full bg-white hover:bg-[#e0e0e0] text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <span>Live Signals</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Status Indicators Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[11px] font-mono-data text-[#868f97] shrink-0">
            SYSTEM STATUS: <strong className="text-[#4ebe96]">OPTIMAL</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[11px] font-mono-data text-[#868f97] shrink-0">
            ACTIVE RISK: <strong className="text-white">MINIMAL</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[11px] font-mono-data text-[#868f97] shrink-0">
            PORTFOLIO BETA: <strong className="text-[#479ffa]">0.84</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[11px] font-mono-data text-[#868f97] shrink-0">
            NET SHARPE: <strong className="text-[#ffa16c]">3.12</strong>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[11px] font-mono-data text-[#868f97] shrink-0">
            RBI REPO: <strong className="text-white">5.50%</strong>
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 2. 4-CARD TELEMETRY STRIP (STITCH SCREEN 1 SECTION 1)                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Portfolio NAV */}
          <div className="bg-[#191919] border border-[#262626] hover:border-[#3a3a3a] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#868f97]">
                PORTFOLIO NAV (AGGREGATED)
              </span>
              <span className="inline-flex items-center gap-1 font-mono-data text-xs text-[#4ebe96] bg-[#4ebe96]/10 px-2 py-0.5 rounded-full border border-[#4ebe96]/20">
                <Icon name="arrow_upward" className="text-[10px]" />
                +14.28%
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-semibold tracking-[-0.04em] text-white font-mono-data tabular-nums">
                ₹42,850,210
              </div>
              <div className="text-[11px] text-[#868f97] mt-1 flex justify-between font-mono-data">
                <span>HWM: ₹44.12M</span>
                <span className="text-[#4ebe96] font-medium">+₹5,340,119 YTD</span>
              </div>
            </div>
            <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#4ebe96] h-full rounded-full w-[88%]" />
            </div>
          </div>

          {/* Card 2: Alpha vs Benchmark */}
          <div className="bg-[#191919] border border-[#262626] hover:border-[#3a3a3a] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#868f97]">
                ALPHA VS NIFTY 50
              </span>
              <span className="inline-flex items-center gap-1 font-mono-data text-xs text-[#4ebe96] bg-[#4ebe96]/10 px-2 py-0.5 rounded-full border border-[#4ebe96]/20">
                +482 bps
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-semibold tracking-[-0.04em] text-white font-mono-data tabular-nums">
                +4.82%
              </div>
              <div className="text-[11px] text-[#868f97] mt-1 flex justify-between font-mono-data">
                <span>Nifty: +9.46%</span>
                <span className="text-white font-medium">PMS: +14.28%</span>
              </div>
            </div>
            <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#479ffa] h-full rounded-full w-[72%]" />
            </div>
          </div>

          {/* Card 3: Value at Risk */}
          <div className="bg-[#191919] border border-[#262626] hover:border-[#3a3a3a] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#868f97]">
                99% VALUE AT RISK (1D VaR)
              </span>
              <span className="font-mono-data text-xs text-[#ffa16c] bg-[#ffa16c]/10 px-2 py-0.5 rounded-full border border-[#ffa16c]/20">
                Parametric
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-semibold tracking-[-0.04em] text-white font-mono-data tabular-nums">
                ₹284,500
              </div>
              <div className="text-[11px] text-[#868f97] mt-1 flex justify-between font-mono-data">
                <span>0.66% of Book</span>
                <span className="text-white font-medium">CVaR: ₹412,000</span>
              </div>
            </div>
            <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#ffa16c] h-full rounded-full w-[35%]" />
            </div>
          </div>

          {/* Card 4: Liquidity Concentration */}
          <div className="bg-[#191919] border border-[#262626] hover:border-[#3a3a3a] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#868f97]">
                LIQUIDITY CONCENTRATION
              </span>
              <span className="font-mono-data text-xs text-[#4ebe96] bg-[#4ebe96]/10 px-2 py-0.5 rounded-full border border-[#4ebe96]/20">
                Tier-1
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-semibold tracking-[-0.04em] text-white font-mono-data tabular-nums">
                94.2%
              </div>
              <div className="text-[11px] text-[#868f97] mt-1 flex justify-between font-mono-data">
                <span>Sub-Second Exit</span>
                <span className="text-white font-medium">Slippage &lt;3 bps</span>
              </div>
            </div>
            <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#4ebe96] h-full rounded-full w-[94%]" />
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. SIGNATURE INTERACTIVE SVG PERFORMANCE CHART (SCREEN 1 SECTION 2)       */}
        {/* ========================================================================= */}
        <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-6">
          
          {/* Chart Header & Range Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-data text-[10px] uppercase text-[#868f97]">
                  PIEDMONT MULTI-STRAT CORE &bull; PMS-L3
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#4ebe96]/10 text-[#4ebe96] text-[10px] font-mono-data font-semibold">
                  LIVE
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-semibold text-white font-mono-data tabular-nums tracking-[-0.03em]">
                  ₹42,850,210.00
                </span>
                <span className="text-xs sm:text-sm font-mono-data font-medium text-[#4ebe96]">
                  {activeCurve.returnVal} ({activeCurve.returnPct})
                </span>
              </div>
            </div>

            {/* Range Toggle Pills (1D, 1W, 1M, 1Y, ALL) */}
            <div className="flex items-center gap-1 bg-[#131313] p-1 rounded-full border border-[#262626]">
              {(['1D', '1W', '1M', '1Y', 'ALL'] as TimeRange[]).map((r) => {
                const isSelected = selectedRange === r;
                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRange(r)}
                    className={`px-3 py-1 rounded-full text-xs font-mono-data transition-all ${
                      isSelected
                        ? 'bg-[#191919] text-white shadow-[0_0_12px_rgba(255,255,255,0.15)] font-semibold border border-[#333333]'
                        : 'text-[#868f97] hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Area Chart Curve with Gradient Fill & Glow */}
          <div className="relative w-full h-[240px] sm:h-[280px]">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 1000 280"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ebe96" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#4ebe96" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#4ebe96" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="70" x2="1000" y2="70" stroke="#222222" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="140" x2="1000" y2="140" stroke="#222222" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="210" x2="1000" y2="210" stroke="#222222" strokeDasharray="4 4" strokeWidth="1" />

              {/* Area Fill */}
              <path
                d={activeCurve.area}
                fill="url(#chartGradient)"
                className="transition-all duration-700 ease-in-out"
              />

              {/* Line Stroke */}
              <path
                d={activeCurve.line}
                fill="none"
                stroke="#4ebe96"
                strokeWidth="2.5"
                filter="url(#glow)"
                className="transition-all duration-700 ease-in-out"
              />

              {/* Cursor Point */}
              <circle
                cx={activeCurve.tx}
                cy={activeCurve.ty}
                r="5"
                fill="#ffffff"
                stroke="#4ebe96"
                strokeWidth="2.5"
                className="transition-all duration-700 ease-in-out shadow-[0_0_12px_#4ebe96]"
              />
            </svg>
          </div>

          {/* Secondary Volatility & Risk Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#222222] font-mono-data text-xs">
            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[#868f97] text-[10px] uppercase block">TRAILING RETURN</span>
              <span className="text-white font-semibold text-sm mt-0.5 block">+18.4%</span>
              <span className="text-[#868f97] text-[10px]">Annualized 1Y</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[#868f97] text-[10px] uppercase block">SHARPE RATIO</span>
              <span className="text-[#ffa16c] font-semibold text-sm mt-0.5 block">3.12</span>
              <span className="text-[#868f97] text-[10px]">Risk-Free 6.78%</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[#868f97] text-[10px] uppercase block">MAX DRAWDOWN</span>
              <span className="text-[#4ebe96] font-semibold text-sm mt-0.5 block">-4.12%</span>
              <span className="text-[#868f97] text-[10px]">Peak-to-Trough</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[#868f97] text-[10px] uppercase block">REALIZED VOLATILITY</span>
              <span className="text-white font-semibold text-sm mt-0.5 block">11.8%</span>
              <span className="text-[#868f97] text-[10px]">30-Day Rolling</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. LIVE BENCHMARK TAPE (INDIAN & GLOBAL CONVERGENCE)                      */}
        {/* ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono-data uppercase tracking-wider text-[#868f97]">
              Multi-Asset Benchmark Tape.
            </h3>
            <span className="text-[11px] font-mono-data text-[#868f97]">
              Click any benchmark to inspect live chart &rarr;
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {LIVE_BENCHMARKS.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedSymbol({ symbol: b.symbol, name: b.name })}
                className="bg-[#191919] hover:bg-[#202020] border border-[#262626] hover:border-[#3a3a3a] p-3 rounded-[14px] cursor-pointer transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] group"
              >
                <div className="text-[10px] text-[#868f97] font-mono-data uppercase truncate">{b.name}</div>
                <div className="text-sm font-semibold text-white font-mono-data tabular-nums mt-0.5">{b.price}</div>
                <div className={`text-[11px] font-mono-data mt-0.5 font-medium ${b.isPos ? 'text-[#4ebe96]' : 'text-[#eb5757]'}`}>
                  {b.change} ({b.pct})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. 12-COLUMN DUAL MODULE: AI RECAP (8) & FACTOR ALLOCATIONS (4)           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Market AI Recap (8 cols) */}
          <div className="lg:col-span-8 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#479ffa] animate-pulse" />
                <span className="font-semibold text-white text-sm tracking-[-0.02em]">
                  Market AI Synthesis Stream
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono-data bg-[#141414] text-[#479ffa] border border-[#2a2a2a]">
                  99.4% CONFIDENCE
                </span>
              </div>
              <span className="text-[10px] font-mono-data text-[#868f97]">
                SYNTHESIS #4092-B &bull; LIVE REVISED
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              Indian equities demonstrate resilient structural demand as the Nifty 50 advances +0.42% to 25,810. Foreign institutional selling continues to be methodically absorbed by the domestic institutional mutual fund floor (₹24,500+ Cr monthly SIPs). Wholesale input price pressures remain benign with WPI printing at 2.36%, giving the Reserve Bank of India policy leeway to anchor the repo rate at 5.50%.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                <span className="text-[10px] font-mono-data uppercase text-[#ffa16c] font-semibold block">Crude Oil Transmission</span>
                <p className="text-[11px] text-[#868f97] mt-1 leading-relaxed">
                  Brent at $72.80/bbl expands gross margin tailwinds for paints, adhesives, and aviation leaders.
                </p>
              </div>

              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                <span className="text-[10px] font-mono-data uppercase text-[#4ebe96] font-semibold block">Bullion Softening Relief</span>
                <p className="text-[11px] text-[#868f97] mt-1 leading-relaxed">
                  Controlled gold prices compress India's annual trade deficit, anchoring the Rupee at 84.38.
                </p>
              </div>

              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                <span className="text-[10px] font-mono-data uppercase text-[#479ffa] font-semibold block">Banking Net Margins</span>
                <p className="text-[11px] text-[#868f97] mt-1 leading-relaxed">
                  5.50% repo rate stability preserves banking Net Interest Margins with decade-low NPAs.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono-data text-[#868f97] border-t border-[#262626]">
              <span>Inquire about bespoke transmission vectors via Piedmont Copilot (F1)</span>
              <Link href="/copilot" className="text-[#ffa16c] hover:underline flex items-center gap-1 font-sans">
                <span>Launch Copilot</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right: Factor Dispersions & Asset Weights (4 cols) */}
          <div className="lg:col-span-4 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <span className="font-semibold text-white text-sm tracking-[-0.02em]">
                Asset & Sector Weights
              </span>
              <Link href="/portfolio" className="text-[11px] text-[#ffa16c] hover:underline">
                Audit &rarr;
              </Link>
            </div>

            <div className="space-y-3 text-xs font-mono-data">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#868f97]">Financials & Banks</span>
                  <span className="text-white font-medium">34.2%</span>
                </div>
                <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#479ffa] h-full rounded-full w-[34.2%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#868f97]">Technology & IT Services</span>
                  <span className="text-white font-medium">22.8%</span>
                </div>
                <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#4ebe96] h-full rounded-full w-[22.8%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#868f97]">Sovereign 10Y G-Sec Debt</span>
                  <span className="text-white font-medium">18.5%</span>
                </div>
                <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ffa16c] h-full rounded-full w-[18.5%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#868f97]">Commodities & Energy</span>
                  <span className="text-white font-medium">14.1%</span>
                </div>
                <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#d6fe51] h-full rounded-full w-[14.1%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#868f97]">Cash & Collateral Buffer</span>
                  <span className="text-white font-medium">10.4%</span>
                </div>
                <div className="w-full bg-[#131313] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#b6d6ff] h-full rounded-full w-[10.4%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262626]">
              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626] text-[11px] text-[#868f97]">
                <strong className="text-white">Factor Tilt:</strong> Quality (+1.45σ) & Low Beta (0.84), positioning for structural compounding over high-debt cyclicals.
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 6. BOTTOM INSTITUTIONAL EXECUTION MODULES (STITCH SCREEN 1 SECTION 4)     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Module 1: Dark Pool Routing */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-[#479ffa]">
                <Icon name="tune" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-white font-medium block">Dark Pool Routing</span>
                <span className="text-[11px] text-[#868f97] font-mono-data">ATS Venues & Crossing Active</span>
              </div>
            </div>
            <span className="text-xs font-mono-data font-semibold text-[#4ebe96]">98.2% FILL RATE</span>
          </div>

          {/* Module 2: Synthetic Collateral */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-[#ffa16c]">
                <Icon name="shield" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-white font-medium block">Collateral Headroom</span>
                <span className="text-[11px] text-[#868f97] font-mono-data">Tri-Party Repo & Margin</span>
              </div>
            </div>
            <span className="text-xs font-mono-data font-semibold text-white">142.8% LTV</span>
          </div>

          {/* Module 3: Algorithmic Rebalancer */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-[#d6fe51]">
                <Icon name="monitoring" className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-white font-medium block">Algorithmic Rebalancer</span>
                <span className="text-[11px] text-[#868f97] font-mono-data">Target Drift Minimizer</span>
              </div>
            </div>
            <span className="text-xs font-mono-data font-semibold text-[#d6fe51]">IDLE &bull; READY</span>
          </div>

        </div>

      </div>

      {/* Interactive Modal Chart for Benchmarks */}
      {selectedSymbol && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedSymbol(null)}
        >
          <div 
            className="w-full max-w-[1200px] max-h-[90vh] bg-[#191919] border border-[#262626] shadow-[0_0_60px_rgba(0,0,0,0.9)] rounded-[16px] p-6 relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PriceChart
              symbol={selectedSymbol.symbol}
              name={selectedSymbol.name}
              onClose={() => setSelectedSymbol(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
