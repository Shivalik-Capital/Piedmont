'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '../components/ui/Icon';

type BookCategory = 'all' | 'long_only' | 'hedges' | 'arbitrage' | 'factor_neutral';

interface Position {
  symbol: string;
  name: string;
  assetClass: 'Equity' | 'Fixed Income' | 'Commodity' | 'Derivative';
  weight: number;
  targetWeight: number;
  shares: string;
  entryPrice: string;
  markPrice: string;
  value: string;
  unrealizedPl: string;
  unrealizedPct: string;
  isProfit: boolean;
  beta: number;
  liquidityTier: 'Tier 1' | 'Tier 2';
}

const POSITIONS: Position[] = [
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', assetClass: 'Equity', weight: 14.8, targetWeight: 14.0, shares: '3,700', entryPrice: '₹1,540.00', markPrice: '₹1,720.00', value: '₹6,364,000', unrealizedPl: '+₹666,000', unrealizedPct: '+11.68%', isProfit: true, beta: 0.88, liquidityTier: 'Tier 1' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', assetClass: 'Equity', weight: 13.2, targetWeight: 14.5, shares: '1,980', entryPrice: '₹2,680.00', markPrice: '₹2,840.50', value: '₹5,624,190', unrealizedPl: '+₹317,790', unrealizedPct: '+5.98%', isProfit: true, beta: 0.94, liquidityTier: 'Tier 1' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', assetClass: 'Equity', weight: 10.5, targetWeight: 10.0, shares: '1,140', entryPrice: '₹3,720.00', markPrice: '₹3,950.00', value: '₹4,503,000', unrealizedPl: '+₹262,200', unrealizedPct: '+6.18%', isProfit: true, beta: 0.72, liquidityTier: 'Tier 1' },
  { symbol: 'INFY', name: 'Infosys Limited', assetClass: 'Equity', weight: 8.4, targetWeight: 8.0, shares: '1,910', entryPrice: '₹1,710.00', markPrice: '₹1,880.00', value: '₹3,590,800', unrealizedPl: '+₹324,700', unrealizedPct: '+9.94%', isProfit: true, beta: 0.82, liquidityTier: 'Tier 1' },
  { symbol: '10Y-GSEC', name: 'GOI 10Y Benchmark 2036', assetClass: 'Fixed Income', weight: 18.5, targetWeight: 18.0, shares: '79,000', entryPrice: '₹100.20', markPrice: '₹100.55', value: '₹7,943,450', unrealizedPl: '+₹27,650', unrealizedPct: '+0.34%', isProfit: true, beta: 0.08, liquidityTier: 'Tier 1' },
  { symbol: 'GOLD-MCX', name: 'Physical Gold MCX Bullion', assetClass: 'Commodity', weight: 9.6, targetWeight: 10.0, shares: '520g', entryPrice: '₹74,500/10g', markPrice: '₹78,450/10g', value: '₹4,079,400', unrealizedPl: '+₹205,400', unrealizedPct: '+5.30%', isProfit: true, beta: -0.15, liquidityTier: 'Tier 1' },
  { symbol: 'TITAN', name: 'Titan Company Ltd', assetClass: 'Equity', weight: 6.2, targetWeight: 6.0, shares: '770', entryPrice: '₹3,180.00', markPrice: '₹3,450.00', value: '₹2,656,500', unrealizedPl: '+₹207,900', unrealizedPct: '+8.49%', isProfit: true, beta: 1.05, liquidityTier: 'Tier 1' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', assetClass: 'Equity', weight: 8.8, targetWeight: 9.5, shares: '3,000', entryPrice: '₹1,190.00', markPrice: '₹1,260.00', value: '₹3,780,000', unrealizedPl: '+₹210,000', unrealizedPct: '+5.88%', isProfit: true, beta: 0.98, liquidityTier: 'Tier 1' },
  { symbol: 'CASH-INR', name: 'Collateral Repo & Liquidity', assetClass: 'Fixed Income', weight: 10.0, targetWeight: 10.0, shares: '—', entryPrice: '₹1.00', markPrice: '₹1.00', value: '₹4,308,870', unrealizedPl: '₹0.00', unrealizedPct: '0.00%', isProfit: true, beta: 0.00, liquidityTier: 'Tier 1' },
];

const AUDIT_STREAM = [
  { id: 'aud-1', time: '10:14:15', hash: '0x8f4c...3e1a', event: 'Delta Drift Neutralized', note: 'Rebalanced HDFCBANK overweight (+0.80% to 14.0%)', status: 'VERIFIED' },
  { id: 'aud-2', time: '09:45:00', hash: '0x2d9b...88aa', event: 'Daily Mark-to-Market', note: 'Portfolio valuation compiled: ₹42,850,210 (+14.28% YTD)', status: 'VERIFIED' },
  { id: 'aud-3', time: '09:15:30', hash: '0x7e12...b944', event: 'Sovereign Coupon Inflow', note: '10Y G-Sec semi-annual coupon credited: +₹282,400', status: 'VERIFIED' },
  { id: 'aud-4', time: 'Yesterday', hash: '0x44a1...99ef', event: 'L3 Audit Attestation', note: 'Independent verification stamp: zero tracking discrepancy', status: 'ATTESTED' },
];

export default function PortfolioHoldingsPage() {
  const [activeBook, setActiveBook] = useState<BookCategory>('all');
  const [rebalanceExecuted, setRebalanceExecuted] = useState(false);

  const handleRebalance = () => {
    setRebalanceExecuted(true);
    setTimeout(() => setRebalanceExecuted(false), 3000);
  };

  return (
    <div className="w-full text-white pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex flex-col gap-6 sm:gap-8">
        
        {/* ========================================================================= */}
        {/* 1. HEADER (STITCH SCREEN 6)                                               */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ebe96] animate-pulse" />
              <span className="font-mono-data text-[10px] sm:text-[11px] tracking-widest text-[#868f97] uppercase font-semibold">
                Multi-Asset Position Ledger &bull; Institutional Book
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.08em] leading-tight text-white">
              Institutional Position <span className="fey-gradient-ember">Audit.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
              Live book accounting, factor tilts, dynamic rebalancing corridor, and multi-asset position ledger with deterministic verification.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRebalance}
              className="px-4 py-2 rounded-full bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] text-xs font-mono-data text-[#868f97] hover:text-white transition-all flex items-center gap-1.5"
            >
              <Icon name="tune" className="w-3.5 h-3.5 text-[#ffa16c]" />
              <span>{rebalanceExecuted ? 'REBALANCING EXECUTED' : 'FACTOR TILTS'}</span>
            </button>

            <button
              className="px-4 py-2 rounded-full bg-white hover:bg-[#e0e0e0] text-black font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Icon name="shield" className="w-3.5 h-3.5 text-black" />
              <span>Attest Audit</span>
            </button>
          </div>
        </div>

        {/* Book Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Books' },
            { id: 'long_only', label: 'Long Only' },
            { id: 'hedges', label: 'Hedges' },
            { id: 'arbitrage', label: 'Arbitrage' },
            { id: 'factor_neutral', label: 'Factor Neutral' }
          ].map((b) => {
            const isSelected = activeBook === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setActiveBook(b.id as BookCategory)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono-data transition-all border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] font-semibold'
                    : 'bg-[#141414] text-[#868f97] border-[#262626] hover:border-[#3a3a3a] hover:text-white'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 2. ASSET & SECTOR FACTOR ALLOCATIONS (STITCH SCREEN 6)                    */}
        {/* ========================================================================= */}
        <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-[-0.03em]">
                Asset & Sector Factor Allocations
              </h2>
              <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                Target vs Actual Weight Dispersions &bull; Factor Risk Exposure
              </p>
            </div>
            <span className="text-[10px] font-mono-data px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-[#4ebe96]">
              CORRIDOR TOLERANCE &plusmn;2.0%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[10px] text-[#868f97] font-mono-data uppercase block">Financials</span>
              <span className="text-lg font-semibold text-white font-mono-data mt-0.5 block">32.4%</span>
              <span className="text-[10px] text-[#4ebe96] font-mono-data">Target 32.0% (+0.4%)</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[10px] text-[#868f97] font-mono-data uppercase block">Fixed Income (10Y)</span>
              <span className="text-lg font-semibold text-white font-mono-data mt-0.5 block">18.5%</span>
              <span className="text-[10px] text-[#4ebe96] font-mono-data">Target 18.0% (+0.5%)</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[10px] text-[#868f97] font-mono-data uppercase block">Technology (IT)</span>
              <span className="text-lg font-semibold text-white font-mono-data mt-0.5 block">18.9%</span>
              <span className="text-[10px] text-[#4ebe96] font-mono-data">Target 18.0% (+0.9%)</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[10px] text-[#868f97] font-mono-data uppercase block">Energy (Reliance)</span>
              <span className="text-lg font-semibold text-white font-mono-data mt-0.5 block">13.2%</span>
              <span className="text-[10px] text-[#ffa16c] font-mono-data">Target 14.5% (-1.3%)</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[10px] text-[#868f97] font-mono-data uppercase block">MCX Gold Bullion</span>
              <span className="text-lg font-semibold text-white font-mono-data mt-0.5 block">9.6%</span>
              <span className="text-[10px] text-[#4ebe96] font-mono-data">Target 10.0% (-0.4%)</span>
            </div>

            <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
              <span className="text-[10px] text-[#868f97] font-mono-data uppercase block">Consumer (Titan)</span>
              <span className="text-lg font-semibold text-white font-mono-data mt-0.5 block">7.4%</span>
              <span className="text-[10px] text-[#4ebe96] font-mono-data">Target 7.5% (-0.1%)</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ACTIVE POSITIONS LEDGER TABLE (STITCH SCREEN 6)                        */}
        {/* ========================================================================= */}
        <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-[-0.03em]">
                Active Positions Ledger
              </h3>
              <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                Real-Time Mark-to-Market Accounting &bull; Total NAV ₹42,850,210
              </p>
            </div>
            <span className="font-mono-data text-xs text-white">
              {POSITIONS.length} Holdings Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-data text-xs">
              <thead>
                <tr className="border-b border-[#262626] text-[#868f97] uppercase text-[10px]">
                  <th className="py-2.5 pr-4">Security</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4">Weight</th>
                  <th className="py-2.5 px-4">Position Value</th>
                  <th className="py-2.5 px-4">Entry Price</th>
                  <th className="py-2.5 px-4">Mark Price</th>
                  <th className="py-2.5 px-4">Unrealized P&amp;L</th>
                  <th className="py-2.5 px-4">Factor Beta</th>
                  <th className="py-2.5 pl-4 text-right">Liquidity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {POSITIONS.map((p) => (
                  <tr key={p.symbol} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white">{p.symbol}</span>
                      <span className="block text-[10px] text-[#868f97]">{p.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#141414] border border-[#262626] text-[10px] text-[#868f97]">
                        {p.assetClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white tabular-nums">
                      {p.weight}%
                    </td>
                    <td className="py-3 px-4 font-bold text-white tabular-nums">
                      {p.value}
                    </td>
                    <td className="py-3 px-4 text-[#868f97] tabular-nums">
                      {p.entryPrice}
                    </td>
                    <td className="py-3 px-4 text-white tabular-nums">
                      {p.markPrice}
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <span className={p.isProfit ? 'text-[#4ebe96] font-semibold' : 'text-[#eb5757] font-semibold'}>
                        {p.unrealizedPl}
                      </span>
                      <span className={`block text-[10px] ${p.isProfit ? 'text-[#4ebe96]' : 'text-[#eb5757]'}`}>
                        ({p.unrealizedPct})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#868f97] tabular-nums">
                      {p.beta}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#4ebe96]/10 text-[#4ebe96] border border-[#4ebe96]/20">
                        {p.liquidityTier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. DUAL MODULE: DYNAMIC REBALANCE CORRIDOR & LEDGER AUDIT STREAM           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Dynamic Rebalance Corridor (6 cols) */}
          <div className="lg:col-span-6 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-[-0.03em]">
                  Dynamic Rebalance Corridor
                </h3>
                <p className="text-xs text-[#868f97] font-mono-data">Algorithmic Band Drift Detection</p>
              </div>
              <button
                onClick={handleRebalance}
                className="px-3.5 py-1 rounded-full bg-[#ffa16c] hover:bg-[#ffb085] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(255,161,108,0.25)]"
              >
                Execute Corridor
              </button>
            </div>

            <div className="space-y-3 font-mono-data text-xs">
              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626] space-y-1">
                <div className="flex justify-between">
                  <span className="text-white font-medium">RELIANCE Drift: -1.30% Underweight</span>
                  <span className="text-[#ffa16c]">Action: Buy ₹555,000</span>
                </div>
                <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#ffa16c] h-full rounded-full w-[91%]" />
                </div>
              </div>

              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626] space-y-1">
                <div className="flex justify-between">
                  <span className="text-white font-medium">HDFCBANK Drift: +0.80% Overweight</span>
                  <span className="text-[#4ebe96]">Within Normal Corridor Band</span>
                </div>
                <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#4ebe96] h-full rounded-full w-[105%]" />
                </div>
              </div>

              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626] space-y-1">
                <div className="flex justify-between">
                  <span className="text-white font-medium">10Y-GSEC Drift: +0.50% Overweight</span>
                  <span className="text-[#4ebe96]">Yield Compressing Buffer Active</span>
                </div>
                <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#479ffa] h-full rounded-full w-[103%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Ledger Audit Stream (6 cols) */}
          <div className="lg:col-span-6 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ebe96] animate-pulse" />
                <h3 className="text-base font-bold text-white tracking-[-0.03em]">
                  Ledger Audit Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono-data text-[#868f97]">CRYPTOGRAPHIC PROOF</span>
            </div>

            <div className="space-y-2.5">
              {AUDIT_STREAM.map((item) => (
                <div key={item.id} className="bg-[#141414] p-3 rounded-[12px] border border-[#262626] flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-mono-data">
                      <span className="text-white font-semibold">{item.event}</span>
                      <span className="text-[10px] text-[#868f97]">{item.time}</span>
                      <span className="text-[10px] text-[#479ffa]">{item.hash}</span>
                    </div>
                    <p className="text-[11px] text-[#868f97] mt-0.5">{item.note}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data font-semibold bg-[#4ebe96]/10 text-[#4ebe96] border border-[#4ebe96]/20 shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
