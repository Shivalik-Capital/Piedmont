'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '../components/ui/Icon';

type MarketCategory = 'all' | 'equities' | 'derivatives' | 'fixed_income' | 'commodities';

interface BlockTrade {
  id: string;
  symbol: string;
  name: string;
  venue: 'NSE ATS' | 'Dark Pool' | 'Crossing Engine' | 'Interbank';
  side: 'BUY' | 'SELL';
  notional: string;
  shares: string;
  price: string;
  vwapDev: string;
  urgency: 'HIGH' | 'MED' | 'LOW';
  time: string;
}

const BLOCK_TRADES: BlockTrade[] = [
  { id: 'bt-1', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', venue: 'Dark Pool', side: 'BUY', notional: '₹480 Cr', shares: '2,790,000', price: '₹1,720.00', vwapDev: '+0.12%', urgency: 'HIGH', time: '10:14:22' },
  { id: 'bt-2', symbol: 'RELIANCE', name: 'Reliance Industries', venue: 'Crossing Engine', side: 'BUY', notional: '₹340 Cr', shares: '1,196,000', price: '₹2,842.50', vwapDev: '+0.05%', urgency: 'HIGH', time: '10:12:05' },
  { id: 'bt-3', symbol: 'INFY', name: 'Infosys Limited', venue: 'NSE ATS', side: 'BUY', notional: '₹195 Cr', shares: '1,037,000', price: '₹1,880.00', vwapDev: '+0.18%', urgency: 'MED', time: '10:09:44' },
  { id: 'bt-4', symbol: 'TCS', name: 'Tata Consultancy Services', venue: 'Dark Pool', side: 'SELL', notional: '₹220 Cr', shares: '556,000', price: '₹3,952.00', vwapDev: '-0.08%', urgency: 'MED', time: '10:05:18' },
  { id: 'bt-5', symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', venue: 'Crossing Engine', side: 'BUY', notional: '₹280 Cr', shares: '2,222,000', price: '₹1,260.00', vwapDev: '+0.22%', urgency: 'HIGH', time: '10:01:30' },
  { id: 'bt-6', symbol: 'BHARTIARTL', name: 'Bharti Airtel', venue: 'Interbank', side: 'BUY', notional: '₹165 Cr', shares: '982,000', price: '₹1,680.00', vwapDev: '+0.15%', urgency: 'LOW', time: '09:58:12' },
  { id: 'bt-7', symbol: 'TITAN', name: 'Titan Company', venue: 'Dark Pool', side: 'BUY', notional: '₹140 Cr', shares: '405,000', price: '₹3,450.00', vwapDev: '+0.31%', urgency: 'HIGH', time: '09:52:40' },
];

const CORRELATION_ASSETS = ['Nifty 50', '10Y G-Sec', 'MCX Gold', 'Brent Crude', 'USD/INR', 'India VIX'];

const CORRELATION_MATRIX = [
  [1.00, -0.42, 0.18, -0.58, -0.34, -0.74],
  [-0.42, 1.00, 0.28, 0.44, 0.52, 0.38],
  [0.18, 0.28, 1.00, 0.22, 0.65, 0.31],
  [-0.58, 0.44, 0.22, 1.00, 0.68, 0.48],
  [-0.34, 0.52, 0.65, 0.68, 1.00, 0.42],
  [-0.74, 0.38, 0.31, 0.48, 0.42, 1.00],
];

export default function MarketIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('all');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const getCellColor = (val: number) => {
    if (val === 1.0) return 'bg-[#1e1e1e] text-white';
    if (val > 0.4) return 'bg-[#4ebe96]/20 text-[#4ebe96] border border-[#4ebe96]/30';
    if (val > 0.1) return 'bg-[#4ebe96]/10 text-[#4ebe96]';
    if (val < -0.4) return 'bg-[#ffa16c]/20 text-[#ffa16c] border border-[#ffa16c]/30';
    if (val < -0.1) return 'bg-[#ffa16c]/10 text-[#ffa16c]';
    return 'bg-[#141414] text-[#868f97]';
  };

  return (
    <div className="w-full text-white pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex flex-col gap-6 sm:gap-8">
        
        {/* ========================================================================= */}
        {/* 1. HEADER (STITCH SCREEN 3)                                               */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#479ffa] animate-pulse" />
              <span className="font-mono-data text-[10px] sm:text-[11px] tracking-widest text-[#868f97] uppercase font-semibold">
                Quantitative Telemetry Engine &bull; L3 Feed
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.08em] leading-tight text-white">
              Real-time Quantitative <span className="fey-gradient-ember">Signals.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
              Live order-book anomaly detection, cross-asset correlation matrix, dark pool block activity, and automated AI transmission streams.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/copilot"
              className="px-4 py-2 rounded-full bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] text-xs font-mono-data text-[#868f97] hover:text-white transition-all flex items-center gap-2"
            >
              <Icon name="bot" className="w-3.5 h-3.5 text-[#479ffa]" />
              <span>Ask Copilot (F1)</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-white hover:bg-[#e0e0e0] text-black font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <span>Executive Overview</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Markets' },
            { id: 'equities', label: 'Equities' },
            { id: 'derivatives', label: 'Derivatives' },
            { id: 'fixed_income', label: 'Fixed Income' },
            { id: 'commodities', label: 'Commodities' }
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as MarketCategory)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-data transition-all border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] font-semibold'
                    : 'bg-[#141414] text-[#868f97] border-[#262626] hover:border-[#3a3a3a] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 2. INSTITUTIONAL BLOCK & DARK LIQUIDITY MAP (STITCH SCREEN 3)             */}
        {/* ========================================================================= */}
        <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-[-0.03em] flex items-center gap-2">
                <span>Institutional Block & Dark Liquidity Map</span>
                <span className="w-2 h-2 rounded-full bg-[#4ebe96] animate-pulse" />
              </h2>
              <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                Filtering on size &gt; ₹5 Cr notional &bull; Direct ATS & Dark Crossing Venues
              </p>
            </div>

            {/* Live Order Flow Pressure Meter */}
            <div className="flex items-center gap-3 bg-[#131313] px-3.5 py-1.5 rounded-full border border-[#262626] text-xs font-mono-data">
              <span className="text-[#868f97]">PRESSURE:</span>
              <span className="text-[#4ebe96] font-semibold">BUY 68.4%</span>
              <span className="text-[#555555]">|</span>
              <span className="text-[#ffa16c] font-semibold">SELL 31.6%</span>
            </div>
          </div>

          {/* Block Trade Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs">
              <thead>
                <tr className="border-b border-[#262626] text-[#868f97] uppercase text-[10px]">
                  <th className="py-2.5 pr-4">Time</th>
                  <th className="py-2.5 px-4">Symbol</th>
                  <th className="py-2.5 px-4">Venue</th>
                  <th className="py-2.5 px-4">Side</th>
                  <th className="py-2.5 px-4">Notional</th>
                  <th className="py-2.5 px-4">Shares</th>
                  <th className="py-2.5 px-4">Execution Price</th>
                  <th className="py-2.5 px-4">VWAP Dev</th>
                  <th className="py-2.5 pl-4 text-right">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {BLOCK_TRADES.map((bt) => (
                  <tr key={bt.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 text-[#868f97]">{bt.time}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white">{bt.symbol}</span>
                      <span className="block text-[10px] text-[#868f97]">{bt.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#141414] border border-[#262626] text-[10px] text-[#868f97]">
                        {bt.venue}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        bt.side === 'BUY' 
                          ? 'bg-[#4ebe96]/10 text-[#4ebe96] border-[#4ebe96]/30' 
                          : 'bg-[#ffa16c]/10 text-[#ffa16c] border-[#ffa16c]/30'
                      }`}>
                        {bt.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white tabular-nums">{bt.notional}</td>
                    <td className="py-3 px-4 text-[#868f97] tabular-nums">{bt.shares}</td>
                    <td className="py-3 px-4 text-white tabular-nums">{bt.price}</td>
                    <td className={`py-3 px-4 tabular-nums ${bt.vwapDev.startsWith('+') ? 'text-[#4ebe96]' : 'text-[#ffa16c]'}`}>
                      {bt.vwapDev}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        bt.urgency === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' :
                        bt.urgency === 'MED' ? 'bg-[#ffa16c]/10 text-[#ffa16c] border-[#ffa16c]/30' :
                        'bg-[#141414] text-[#868f97] border-[#262626]'
                      }`}>
                        {bt.urgency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DUAL SECTION: AI SYNTHESIS STREAM & 90-DAY CORRELATION MATRIX           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: AI Synthesis Terminal Stream (6 cols) */}
          <div className="lg:col-span-6 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffa16c] animate-pulse" />
                <h2 className="text-base font-bold text-white tracking-[-0.03em]">
                  AI Synthesis Terminal Stream
                </h2>
              </div>
              <span className="text-[10px] font-mono-data text-[#868f97]">LIVE PIPELINE</span>
            </div>

            <div className="space-y-3">
              <div className="bg-[#141414] p-3.5 rounded-[12px] border border-[#262626] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">Macro Policy Anchor</span>
                  <span className="text-[10px] font-mono-data text-[#868f97]">09:42 IST</span>
                </div>
                <p className="text-xs text-[#868f97] leading-relaxed">
                  RBI MPC repo rate remains comfortably anchored at 5.50%. Oct food inflation (8.94%) projected as transitory, while wholesale WPI printed at a benign 2.36%, preserving corporate input margin stability.
                </p>
              </div>

              <div className="bg-[#141414] p-3.5 rounded-[12px] border border-[#262626] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">Crude Oil Transmission Channel</span>
                  <span className="text-[10px] font-mono-data text-[#868f97]">09:15 IST</span>
                </div>
                <p className="text-xs text-[#868f97] leading-relaxed">
                  Brent Crude softening to $72.80/bbl saves ~$1.3B per $10 drop in India's annualized import bill. Direct margin expansion catalysts active for Asian Paints, Indigo, and quick commerce delivery fleets.
                </p>
              </div>

              <div className="bg-[#141414] p-3.5 rounded-[12px] border border-[#262626] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">Domestic SIP Absorption Buffer</span>
                  <span className="text-[10px] font-mono-data text-[#868f97]">08:30 IST</span>
                </div>
                <p className="text-xs text-[#868f97] leading-relaxed">
                  Monthly retail mutual fund SIPs exceed ₹24,500 Cr, setting an institutional bid floor that systematically absorbs foreign institutional redemption pressure across blue-chip constituents.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs font-mono-data text-[#868f97]">
              <span>Inquire about DuPont ROE diagnostics or factor betas</span>
              <Link href="/copilot" className="text-[#ffa16c] hover:underline font-sans">
                Open Studio &rarr;
              </Link>
            </div>
          </div>

          {/* Right: Global Cross-Asset Correlation Matrix (6 cols) */}
          <div className="lg:col-span-6 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h2 className="text-base font-bold text-white tracking-[-0.03em]">
                  Global Cross-Asset Correlation Matrix
                </h2>
                <p className="text-[11px] text-[#868f97] font-mono-data">90-Day Rolling Empirical Pearson &rho;</p>
              </div>
              <span className="text-[10px] font-mono-data px-2.5 py-0.5 rounded-full bg-[#141414] border border-[#262626] text-[#479ffa]">
                INTERACTIVE
              </span>
            </div>

            {/* Matrix Heatmap */}
            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono-data text-[11px]">
                <thead>
                  <tr>
                    <th className="p-1 text-left text-[10px] text-[#868f97]">ASSET</th>
                    {CORRELATION_ASSETS.map((a, i) => (
                      <th key={i} className="p-1 text-[10px] text-[#868f97] truncate max-w-[60px]">{a.split(' ')[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CORRELATION_MATRIX.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-1 text-left font-medium text-white text-[11px] whitespace-nowrap">
                        {CORRELATION_ASSETS[rIdx]}
                      </td>
                      {row.map((val, cIdx) => (
                        <td key={cIdx} className="p-1">
                          <button
                            onClick={() => setSelectedCell({ row: rIdx, col: cIdx })}
                            className={`w-full py-1.5 px-1 rounded-[6px] font-semibold tabular-nums transition-all hover:scale-105 ${getCellColor(val)}`}
                          >
                            {val.toFixed(2)}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Correlation Cell Detail Callout */}
            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626] text-xs">
              {selectedCell ? (
                <div>
                  <span className="font-semibold text-white block">
                    {CORRELATION_ASSETS[selectedCell.row]} vs {CORRELATION_ASSETS[selectedCell.col]}: &rho; = {CORRELATION_MATRIX[selectedCell.row][selectedCell.col].toFixed(2)}
                  </span>
                  <p className="text-[11px] text-[#868f97] mt-1 leading-relaxed">
                    {CORRELATION_MATRIX[selectedCell.row][selectedCell.col] < -0.3
                      ? 'Significant negative correlation. Serves as an effective hedge against drawdowns during macroeconomic risk-off regimes.'
                      : CORRELATION_MATRIX[selectedCell.row][selectedCell.col] > 0.4
                      ? 'Strong co-movement. Amplifies directional beta exposure across domestic market expansions.'
                      : 'Low linear co-dependence. Provides diversification benefit without drag on risk-adjusted Sharpe ratio.'}
                  </p>
                </div>
              ) : (
                <span className="text-[#868f97] text-[11px] block text-center">
                  Click any pairwise correlation tile above to inspect transmission drivers.
                </span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
