'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  PieChart, 
  Briefcase, 
  ShieldCheck, 
  ExternalLink,
  Search,
  X,
  Check
} from 'lucide-react';
import { INSTITUTIONAL_UNIVERSE, Company } from '../lib/institutional-universe';
import { getInstitutionalCompany } from '../lib/company-database';

export interface UserHolding {
  id: string;
  symbol: string;
  shares: number;
  buyPrice: number;
}

const DEFAULT_PORTFOLIO: UserHolding[] = [
  { id: 'pos-1', symbol: 'RELIANCE', shares: 50, buyPrice: 2680.0 },
  { id: 'pos-2', symbol: 'HDFCBANK', shares: 120, buyPrice: 1540.0 },
  { id: 'pos-3', symbol: 'TCS', shares: 30, buyPrice: 3720.0 },
  { id: 'pos-4', symbol: 'INFY', shares: 70, buyPrice: 1710.0 },
  { id: 'pos-5', symbol: 'ICICIBANK', shares: 90, buyPrice: 1190.0 },
  { id: 'pos-6', symbol: 'TITAN', shares: 25, buyPrice: 3180.0 },
];

const STORAGE_KEY = 'piedmont_user_portfolio';

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<UserHolding[]>([]);
  const [mounted, setMounted] = useState(false);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<UserHolding | null>(null);

  // Form state
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [sharesInput, setSharesInput] = useState<string>('10');
  const [priceInput, setPriceInput] = useState<string>('2840.50');
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHoldings(parsed);
        } else {
          setHoldings(DEFAULT_PORTFOLIO);
        }
      } else {
        setHoldings(DEFAULT_PORTFOLIO);
      }
    } catch (e) {
      setHoldings(DEFAULT_PORTFOLIO);
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever holdings change
  const saveHoldings = (newHoldings: UserHolding[]) => {
    setHoldings(newHoldings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHoldings));
    } catch (e) {
      console.error('Failed to save portfolio to localStorage', e);
    }
  };

  // Pre-fill default price when stock changes in modal
  const handleSelectSymbol = (sym: string) => {
    setSelectedSymbol(sym);
    const stock = INSTITUTIONAL_UNIVERSE.find(s => s.symbol === sym) || getInstitutionalCompany(sym).info;
    if (stock) {
      setPriceInput(String(stock.price));
    }
  };

  // Add position handler
  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(sharesInput);
    const price = parseFloat(priceInput);
    if (!selectedSymbol || isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) return;

    // Check if symbol already exists
    const existingIndex = holdings.findIndex(h => h.symbol === selectedSymbol);
    if (existingIndex >= 0) {
      // Average down/up
      const existing = holdings[existingIndex];
      const totalShares = existing.shares + qty;
      const totalCost = (existing.shares * existing.buyPrice) + (qty * price);
      const blendedPrice = totalCost / totalShares;
      const updated = [...holdings];
      updated[existingIndex] = {
        ...existing,
        shares: totalShares,
        buyPrice: Number(blendedPrice.toFixed(2))
      };
      saveHoldings(updated);
    } else {
      const newPos: UserHolding = {
        id: `pos-${Date.now()}`,
        symbol: selectedSymbol,
        shares: qty,
        buyPrice: price
      };
      saveHoldings([...holdings, newPos]);
    }

    setIsAddModalOpen(false);
    setSharesInput('10');
  };

  // Edit position handler
  const handleEditPosition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHolding) return;
    const qty = parseFloat(sharesInput);
    const price = parseFloat(priceInput);
    if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) return;

    const updated = holdings.map(h => 
      h.id === editingHolding.id ? { ...h, shares: qty, buyPrice: price } : h
    );
    saveHoldings(updated);
    setEditingHolding(null);
  };

  // Delete position handler
  const handleDeletePosition = (id: string) => {
    saveHoldings(holdings.filter(h => h.id !== id));
  };

  // Reset to default sample portfolio
  const handleReset = () => {
    saveHoldings(DEFAULT_PORTFOLIO);
  };

  // Calculate live portfolio positions and aggregates
  const enrichedHoldings = useMemo(() => {
    return holdings.map(h => {
      const compInfo = INSTITUTIONAL_UNIVERSE.find(c => c.symbol === h.symbol) || {
        symbol: h.symbol,
        name: getInstitutionalCompany(h.symbol).info.name,
        sector: getInstitutionalCompany(h.symbol).info.sector,
        price: getInstitutionalCompany(h.symbol).info.price,
        change_pct: getInstitutionalCompany(h.symbol).info.changePct
      };

      const currentPrice = compInfo.price;
      const investedValue = h.shares * h.buyPrice;
      const currentValue = h.shares * currentPrice;
      const unrealizedPl = currentValue - investedValue;
      const unrealizedPlPct = investedValue > 0 ? (unrealizedPl / investedValue) * 100 : 0;
      const dayChange = (currentValue * (compInfo.change_pct || 0)) / 100;

      return {
        ...h,
        name: compInfo.name,
        sector: compInfo.sector,
        currentPrice,
        changePct: compInfo.change_pct || 0,
        investedValue,
        currentValue,
        unrealizedPl,
        unrealizedPlPct,
        dayChange
      };
    });
  }, [holdings]);

  // Aggregate stats
  const totals = useMemo(() => {
    let totalInvested = 0;
    let totalValue = 0;
    let totalDayChange = 0;

    enrichedHoldings.forEach(h => {
      totalInvested += h.investedValue;
      totalValue += h.currentValue;
      totalDayChange += h.dayChange;
    });

    const totalUnrealizedPl = totalValue - totalInvested;
    const totalUnrealizedPlPct = totalInvested > 0 ? (totalUnrealizedPl / totalInvested) * 100 : 0;
    const totalDayChangePct = totalValue > 0 ? (totalDayChange / totalValue) * 100 : 0;

    return {
      totalInvested,
      totalValue,
      totalUnrealizedPl,
      totalUnrealizedPlPct,
      totalDayChange,
      totalDayChangePct
    };
  }, [enrichedHoldings]);

  // Sector breakdown
  const sectorAllocation = useMemo(() => {
    if (totals.totalValue <= 0) return [];
    const map: Record<string, number> = {};
    enrichedHoldings.forEach(h => {
      map[h.sector] = (map[h.sector] || 0) + h.currentValue;
    });

    const palette = ['#479ffa', '#4ebe96', '#ffa16c', '#d6fe51', '#e6e6e6', '#999999', '#ff5c5c'];
    return Object.entries(map).map(([sector, val], idx) => ({
      sector,
      value: val,
      percentage: (val / totals.totalValue) * 100,
      color: palette[idx % palette.length]
    })).sort((a, b) => b.value - a.value);
  }, [enrichedHoldings, totals.totalValue]);

  // Filtered universe for modal search
  const filteredUniverse = useMemo(() => {
    if (!searchQuery.trim()) return INSTITUTIONAL_UNIVERSE;
    const q = searchQuery.toLowerCase();
    return INSTITUTIONAL_UNIVERSE.filter(c => 
      c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!mounted) {
    return <div className="min-h-[500px] flex items-center justify-center text-white/40">Loading portfolio engine...</div>;
  }

  return (
    <div className="w-full text-white pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col gap-6 sm:gap-8">
        
        {/* ─── 1. STRATEGIC HEADER ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-[#868f97] uppercase font-semibold">
                Client Portfolio Tracker &bull; Local Storage Persistent
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
              Portfolio <span className="text-transparent bg-clip-text bg-[linear-gradient(97.13deg,#ffa16c_8.47%,#551b10_108.41%)]">Manager.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
              Real-time mark-to-market performance, live unrealized gains, sector concentration, and position ledger. Your custom holdings persist in your browser.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] text-xs font-mono text-[#868f97] hover:text-white transition-all flex items-center gap-1.5"
              title="Reset to default benchmark portfolio"
            >
              <RotateCcw size={13} />
              <span>Reset Sample</span>
            </button>

            <button
              onClick={() => {
                setSelectedSymbol('RELIANCE');
                setSharesInput('10');
                setPriceInput('2840.50');
                setIsAddModalOpen(true);
              }}
              className="px-5 py-2 rounded-full bg-white hover:bg-[#e0e0e0] text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            >
              <Plus size={15} />
              <span>+ Add Position</span>
            </button>
          </div>
        </div>

        {/* ─── 2. AGGREGATE SUMMARY METRICS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total NAV */}
          <div className="bg-[#191919] rounded-2xl p-5 border border-[#333333] shadow-[0_0_24px_rgba(0,0,0,0.6)]">
            <div className="text-xs font-mono text-[#868f97] uppercase tracking-wider mb-1.5">
              Portfolio Net Asset Value
            </div>
            <div className="font-mono text-3xl font-bold text-white tracking-tight tabular-nums">
              ₹{totals.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-[#868f97] mt-2 flex items-center gap-1">
              <span>{holdings.length} Active Position{holdings.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Card 2: Total Invested Capital */}
          <div className="bg-[#191919] rounded-2xl p-5 border border-[#333333] shadow-[0_0_24px_rgba(0,0,0,0.6)]">
            <div className="text-xs font-mono text-[#868f97] uppercase tracking-wider mb-1.5">
              Invested Capital Basis
            </div>
            <div className="font-mono text-3xl font-bold text-white tracking-tight tabular-nums">
              ₹{totals.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-[#868f97] mt-2">
              Blended acquisition cost
            </div>
          </div>

          {/* Card 3: Total Unrealized P&L */}
          <div className="bg-[#191919] rounded-2xl p-5 border border-[#333333] shadow-[0_0_24px_rgba(0,0,0,0.6)]">
            <div className="text-xs font-mono text-[#868f97] uppercase tracking-wider mb-1.5">
              Total Unrealized Return
            </div>
            <div className={`font-mono text-3xl font-bold tracking-tight tabular-nums flex items-baseline gap-2 ${
              totals.totalUnrealizedPl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <span>{totals.totalUnrealizedPl >= 0 ? '+' : ''}₹{totals.totalUnrealizedPl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className={`text-xs font-mono font-semibold mt-1.5 flex items-center gap-1 ${
              totals.totalUnrealizedPl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totals.totalUnrealizedPl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{totals.totalUnrealizedPl >= 0 ? '+' : ''}{totals.totalUnrealizedPlPct.toFixed(2)}% All-Time</span>
            </div>
          </div>

          {/* Card 4: Today's P&L */}
          <div className="bg-[#191919] rounded-2xl p-5 border border-[#333333] shadow-[0_0_24px_rgba(0,0,0,0.6)]">
            <div className="text-xs font-mono text-[#868f97] uppercase tracking-wider mb-1.5">
              Today's Session Change
            </div>
            <div className={`font-mono text-3xl font-bold tracking-tight tabular-nums ${
              totals.totalDayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totals.totalDayChange >= 0 ? '+' : ''}₹{totals.totalDayChange.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs font-mono font-semibold mt-1.5 flex items-center gap-1 ${
              totals.totalDayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totals.totalDayChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{totals.totalDayChange >= 0 ? '+' : ''}{totals.totalDayChangePct.toFixed(2)}% vs Prev Close</span>
            </div>
          </div>

        </div>

        {/* ─── 3. SECTOR ALLOCATION BAR ────────────────────────────────────── */}
        {sectorAllocation.length > 0 && (
          <div className="bg-[#191919] rounded-2xl p-5 sm:p-6 border border-[#333333] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-white">
                <PieChart size={15} className="text-[#479ffa]" />
                <span>Sector Weight Allocation</span>
              </div>
              <span className="text-[#868f97] font-mono">100% Capital Deployed</span>
            </div>

            {/* Stacked Bar */}
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden flex">
              {sectorAllocation.map(s => (
                <div 
                  key={s.sector}
                  style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                  className="h-full transition-all duration-300"
                  title={`${s.sector}: ${s.percentage.toFixed(1)}%`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs">
              {sectorAllocation.map(s => (
                <div key={s.sector} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-white/80">{s.sector}:</span>
                  <span className="font-mono font-semibold text-white">{s.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── 4. HOLDINGS TABLE ───────────────────────────────────────────── */}
        <div className="bg-[#191919] rounded-2xl border border-[#333333] overflow-hidden shadow-[0_0_44px_rgba(0,0,0,0.8)]">
          <div className="p-5 sm:p-6 border-b border-[#333333] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Active Holdings Ledger</h2>
              <p className="text-xs text-[#868f97] mt-0.5">Click any company to open its institutional deep-dive analysis</p>
            </div>
            <div className="text-xs font-mono text-[#868f97]">
              {holdings.length} Stock{holdings.length !== 1 ? 's' : ''} in Book
            </div>
          </div>

          {holdings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase size={36} className="mx-auto text-white/30" />
              <div className="text-base font-semibold text-white">Your portfolio is currently empty</div>
              <p className="text-xs text-[#868f97] max-w-sm mx-auto">
                Add stocks from the Nifty 50 to track real-time valuations, returns, and sector weights.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs"
                >
                  + Add Stock
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full bg-white/10 text-white font-medium text-xs hover:bg-white/15"
                >
                  Load Sample Portfolio
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#333333] text-[#868f97] uppercase tracking-wider font-mono">
                    <th className="py-3.5 pl-6 font-semibold">Security / Asset</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Shares</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Avg Cost</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Market Price</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Current Value</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Unrealized P&L</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Weight</th>
                    <th className="py-3.5 pr-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {enrichedHoldings.map((h) => {
                    const weightPct = totals.totalValue > 0 ? (h.currentValue / totals.totalValue) * 100 : 0;
                    const isProfit = h.unrealizedPl >= 0;

                    return (
                      <tr key={h.id} className="hover:bg-white/[0.03] transition-colors group">
                        
                        {/* Company Link */}
                        <td className="py-4 pl-6 font-sans">
                          <Link 
                            href={`/equities/companies/${h.symbol}`} 
                            className="group/item flex items-center gap-2.5 hover:text-white"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-white font-mono group-hover/item:text-[#479ffa] transition-colors">
                                  {h.symbol}
                                </span>
                                <ExternalLink size={11} className="text-[#868f97] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-xs text-[#868f97] font-sans truncate max-w-[180px]">
                                {h.name}
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#868f97] font-sans ml-1 hidden sm:inline-block">
                              {h.sector}
                            </span>
                          </Link>
                        </td>

                        {/* Shares */}
                        <td className="py-4 px-4 text-right text-white font-medium tabular-nums">
                          {h.shares.toLocaleString('en-IN')}
                        </td>

                        {/* Buy Price */}
                        <td className="py-4 px-4 text-right text-white/80 tabular-nums">
                          ₹{h.buyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Market Price & Day % */}
                        <td className="py-4 px-4 text-right tabular-nums">
                          <div className="text-white font-semibold">
                            ₹{h.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`text-[10px] ${h.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {h.changePct >= 0 ? '+' : ''}{h.changePct.toFixed(2)}%
                          </div>
                        </td>

                        {/* Current Value */}
                        <td className="py-4 px-4 text-right text-white font-bold tabular-nums">
                          ₹{h.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Unrealized P&L */}
                        <td className="py-4 px-4 text-right tabular-nums">
                          <div className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}₹{h.unrealizedPl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`text-[10px] font-semibold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}{h.unrealizedPlPct.toFixed(2)}%
                          </div>
                        </td>

                        {/* Portfolio Weight */}
                        <td className="py-4 px-4 text-right text-[#868f97] tabular-nums font-semibold">
                          {weightPct.toFixed(1)}%
                        </td>

                        {/* Actions (Edit / Delete) */}
                        <td className="py-4 pr-6 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingHolding(h);
                                setSharesInput(String(h.shares));
                                setPriceInput(String(h.buyPrice));
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                              title="Edit position"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeletePosition(h.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 transition-colors"
                              title="Remove position"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ─── ADD POSITION MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#191919] border border-[#333333] rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-white mb-1">Add Stock Position</h3>
              <p className="text-xs text-[#868f97] mb-5">Select a Nifty 50 constituent and enter your holdings.</p>

              <form onSubmit={handleAddPosition} className="space-y-4">
                
                {/* Search / Select Stock */}
                <div>
                  <label className="block text-xs font-mono uppercase text-[#868f97] mb-1.5">
                    Select Equity
                  </label>
                  <div className="relative mb-2">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                      type="text"
                      placeholder="Search by symbol or name..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#333333] rounded-xl text-xs text-white focus:outline-none focus:border-[#479ffa]"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto rounded-xl border border-[#333333] bg-[#121212] divide-y divide-white/5">
                    {filteredUniverse.map(c => {
                      const isSelected = selectedSymbol === c.symbol;
                      return (
                        <button
                          key={c.symbol}
                          type="button"
                          onClick={() => handleSelectSymbol(c.symbol)}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                            isSelected ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-[#868f97]'
                          }`}
                        >
                          <div>
                            <span className="font-mono font-bold text-white mr-2">{c.symbol}</span>
                            <span className="text-[11px] text-white/60">{c.name}</span>
                          </div>
                          <div className="font-mono text-white/80 font-medium">
                            ₹{c.price.toLocaleString('en-IN')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Shares & Price inputs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#868f97] mb-1.5">
                      Quantity (Shares)
                    </label>
                    <input 
                      type="number"
                      step="any"
                      min="1"
                      required
                      value={sharesInput}
                      onChange={e => setSharesInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333333] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#479ffa]"
                      placeholder="e.g. 50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#868f97] mb-1.5">
                      Avg Buy Price (₹)
                    </label>
                    <input 
                      type="number"
                      step="any"
                      min="0.01"
                      required
                      value={priceInput}
                      onChange={e => setPriceInput(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121212] border border-[#333333] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#479ffa]"
                      placeholder="e.g. 2840.50"
                    />
                  </div>
                </div>

                {/* Calculated preview */}
                <div className="p-3 rounded-xl bg-[#121212] border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#868f97]">Total Capital Outlay:</span>
                  <span className="font-bold text-white">
                    ₹{((parseFloat(sharesInput) || 0) * (parseFloat(priceInput) || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white hover:bg-[#e0e0e0] text-xs font-bold text-black shadow-lg"
                  >
                    Add Position
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EDIT POSITION MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {editingHolding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#191919] border border-[#333333] rounded-2xl w-full max-w-sm p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setEditingHolding(null)}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-white mb-1">Edit Position</h3>
              <p className="text-xs text-[#868f97] mb-5 font-mono">{editingHolding.symbol}</p>

              <form onSubmit={handleEditPosition} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#868f97] mb-1.5">
                    Quantity (Shares)
                  </label>
                  <input 
                    type="number"
                    step="any"
                    min="1"
                    required
                    value={sharesInput}
                    onChange={e => setSharesInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#333333] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#479ffa]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#868f97] mb-1.5">
                    Avg Buy Price (₹)
                  </label>
                  <input 
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={priceInput}
                    onChange={e => setPriceInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#333333] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#479ffa]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingHolding(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white hover:bg-[#e0e0e0] text-xs font-bold text-black"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
