'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Briefcase, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  X,
  ChevronRight,
  ShieldCheck,
  ArrowUpDown
} from 'lucide-react';
import { INSTITUTIONAL_COMPANIES, getInstitutionalCompany } from '../lib/company-database';

interface PortfolioPosition {
  id: string;
  symbol: string;
  shares: number;
  buyPrice: number;
  addedAt: string;
}

const DEFAULT_WATCHLIST = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'BHARTIARTL'];

export default function WatchlistPage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'portfolio'>('watchlist');
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(DEFAULT_WATCHLIST);
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add position form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newShares, setNewShares] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('piedmont_watchlist');
      if (savedWatchlist) {
        const list = JSON.parse(savedWatchlist);
        if (Array.isArray(list) && list.length > 0) {
          setWatchlistSymbols(list);
        }
      }

      const savedPortfolio = localStorage.getItem('piedmont_portfolio');
      if (savedPortfolio) {
        const list = JSON.parse(savedPortfolio);
        if (Array.isArray(list)) {
          setPortfolio(list);
        }
      } else {
        // Seed initial sample positions
        const initialPort: PortfolioPosition[] = [
          { id: '1', symbol: 'RELIANCE', shares: 50, buyPrice: 2650.0, addedAt: '2026-08-15' },
          { id: '2', symbol: 'TCS', shares: 35, buyPrice: 3820.0, addedAt: '2026-09-01' },
          { id: '3', symbol: 'HDFCBANK', shares: 100, buyPrice: 1640.0, addedAt: '2026-09-15' },
        ];
        setPortfolio(initialPort);
        localStorage.setItem('piedmont_portfolio', JSON.stringify(initialPort));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const removeFromWatchlist = (symbol: string) => {
    const updated = watchlistSymbols.filter(s => s !== symbol);
    setWatchlistSymbols(updated);
    try {
      localStorage.setItem('piedmont_watchlist', JSON.stringify(updated));
    } catch (e) {}
  };

  const addToWatchlist = (symbol: string) => {
    const clean = symbol.trim().toUpperCase();
    if (!clean || watchlistSymbols.includes(clean)) return;
    const updated = [clean, ...watchlistSymbols];
    setWatchlistSymbols(updated);
    setSearchQuery('');
    try {
      localStorage.setItem('piedmont_watchlist', JSON.stringify(updated));
    } catch (e) {}
  };

  const addPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = newSymbol.trim().toUpperCase();
    const sh = parseFloat(newShares);
    const pr = parseFloat(newPrice);
    if (!sym || isNaN(sh) || isNaN(pr) || sh <= 0 || pr <= 0) return;

    const newPos: PortfolioPosition = {
      id: Date.now().toString(),
      symbol: sym,
      shares: sh,
      buyPrice: pr,
      addedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newPos, ...portfolio];
    setPortfolio(updated);
    try {
      localStorage.setItem('piedmont_portfolio', JSON.stringify(updated));
    } catch (e) {}

    // Also auto-add to watchlist if not present
    if (!watchlistSymbols.includes(sym)) {
      const wl = [sym, ...watchlistSymbols];
      setWatchlistSymbols(wl);
      try {
        localStorage.setItem('piedmont_watchlist', JSON.stringify(wl));
      } catch (e) {}
    }

    setNewSymbol('');
    setNewShares('');
    setNewPrice('');
    setShowAddModal(false);
  };

  const removePosition = (id: string) => {
    const updated = portfolio.filter(p => p.id !== id);
    setPortfolio(updated);
    try {
      localStorage.setItem('piedmont_portfolio', JSON.stringify(updated));
    } catch (e) {}
  };

  // Portfolio calculations
  let totalCurrentValue = 0;
  let totalInvestedValue = 0;
  let totalDayPnl = 0;

  const enrichedPortfolio = portfolio.map(pos => {
    const comp = getInstitutionalCompany(pos.symbol);
    const curPrice = comp.info.price || pos.buyPrice;
    const change = comp.info.change || 0;
    const curVal = curPrice * pos.shares;
    const invVal = pos.buyPrice * pos.shares;
    const pnl = curVal - invVal;
    const pnlPct = invVal > 0 ? (pnl / invVal) * 100 : 0;
    const dayPnl = change * pos.shares;

    totalCurrentValue += curVal;
    totalInvestedValue += invVal;
    totalDayPnl += dayPnl;

    return {
      ...pos,
      company: comp,
      currentPrice: curPrice,
      currentValue: curVal,
      investedValue: invVal,
      pnl,
      pnlPct,
      dayPnl
    };
  });

  const overallPnl = totalCurrentValue - totalInvestedValue;
  const overallPnlPct = totalInvestedValue > 0 ? (overallPnl / totalInvestedValue) * 100 : 0;
  const isOverallPositive = overallPnl >= 0;

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* ─── PAGE HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#868f97]">Piedmont Terminal v4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Watchlists & Portfolio</h1>
          <p className="text-[#868f97] text-xs sm:text-sm mt-1">
            Track your personalized universe of Indian equities and monitor live portfolio profit and loss.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'watchlist'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            <Star size={14} className={activeTab === 'watchlist' ? 'fill-amber-400 text-amber-400' : ''} />
            <span>Watchlist ({watchlistSymbols.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase size={14} />
            <span>Holdings & P&L</span>
          </button>
        </div>
      </div>

      {/* ─── TAB: WATCHLIST ─────────────────────────────────────────── */}
      {activeTab === 'watchlist' && (
        <div className="space-y-6">
          
          {/* Quick Add Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Enter stock ticker to add (e.g. RELIANCE, TITAN, MARUTI, SBIN)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addToWatchlist(searchQuery);
                }}
                className="w-full bg-[#121212] text-white placeholder-white/30 text-xs pl-9 pr-24 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30"
              />
              {searchQuery && (
                <button
                  onClick={() => addToWatchlist(searchQuery)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white transition-colors"
                >
                  Add Ticker
                </button>
              )}
            </div>
            
            <Link
              href="/screener"
              className="text-xs text-[#868f97] hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              Browse Screener →
            </Link>
          </div>

          {/* Watchlist Table */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] text-[#868f97] uppercase tracking-wider">
                    <th className="py-3.5 pl-4 font-semibold">Instrument</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Price</th>
                    <th className="py-3.5 px-4 font-semibold text-right">1D Change</th>
                    <th className="py-3.5 px-4 font-semibold text-right hidden sm:table-cell">P/E</th>
                    <th className="py-3.5 px-4 font-semibold text-right hidden md:table-cell">ROE</th>
                    <th className="py-3.5 px-4 font-semibold text-right hidden lg:table-cell">Mkt Cap</th>
                    <th className="py-3.5 pr-4 text-center font-semibold w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {watchlistSymbols.map(sym => {
                    const comp = getInstitutionalCompany(sym);
                    const isPos = (comp.info.change || 0) >= 0;
                    return (
                      <tr key={sym} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="py-4 pl-4 font-sans">
                          <Link href={`/equities/companies/${sym}`} className="flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                            <span className="font-mono font-bold text-white text-sm">{sym}</span>
                            <span className="text-xs text-[#868f97] truncate max-w-[180px] hidden sm:inline">{comp.info.name}</span>
                          </Link>
                        </td>

                        <td className="py-4 px-4 text-right font-bold text-white">
                          ₹{(comp.info.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <span className={`inline-flex items-center gap-0.5 font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPos ? '+' : ''}{(comp.info.changePct || 0).toFixed(2)}%
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right text-white/80 hidden sm:table-cell">
                          {comp.metrics.pe?.value ? `${comp.metrics.pe.value}x` : '—'}
                        </td>

                        <td className="py-4 px-4 text-right text-emerald-400 font-semibold hidden md:table-cell">
                          {comp.metrics.roe?.value ? `${comp.metrics.roe.value}%` : '—'}
                        </td>

                        <td className="py-4 px-4 text-right text-white/70 hidden lg:table-cell">
                          {comp.info.marketCapFormatted}
                        </td>

                        <td className="py-4 pr-4 text-center">
                          <button
                            onClick={() => removeFromWatchlist(sym)}
                            className="p-1 rounded text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove from watchlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {watchlistSymbols.length === 0 && (
              <div className="text-center py-16 text-[#868f97] space-y-2">
                <Star size={32} className="mx-auto text-white/20" />
                <div className="text-sm font-semibold text-white">Your watchlist is currently empty</div>
                <p className="text-xs">Search for any company above or star companies from the screener to track them here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB: PORTFOLIO HOLDINGS & P&L ──────────────────────────── */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          
          {/* Executive Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-[#868f97] uppercase tracking-wider mb-1 font-semibold">Total Portfolio Value</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                ₹{totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-white/40 mt-1">Live market valuation</div>
            </div>

            <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-[#868f97] uppercase tracking-wider mb-1 font-semibold">Invested Capital</div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                ₹{totalInvestedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-white/40 mt-1">{portfolio.length} open position(s)</div>
            </div>

            <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-[#868f97] uppercase tracking-wider mb-1 font-semibold">Total Unrealized P&L</div>
              <div className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight ${isOverallPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isOverallPositive ? '+' : ''}₹{Math.abs(overallPnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className={`text-[11px] font-mono mt-1 font-semibold ${isOverallPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isOverallPositive ? '+' : ''}{overallPnlPct.toFixed(2)}% net return
              </div>
            </div>

            <div className="bg-[#121212] p-5 rounded-2xl border border-white/10">
              <div className="text-[10px] text-[#868f97] uppercase tracking-wider mb-1 font-semibold">Today&apos;s Return</div>
              <div className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight ${totalDayPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalDayPnl >= 0 ? '+' : ''}₹{Math.abs(totalDayPnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-white/40 mt-1">1D change impact</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">Open Holdings</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              <Plus size={14} />
              <span>Add Position</span>
            </button>
          </div>

          {/* Holdings Table */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] text-[#868f97] uppercase tracking-wider">
                    <th className="py-3.5 pl-4 font-semibold">Holding</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Shares</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Avg Buy Price</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Live Price</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Cur. Value</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Total P&L</th>
                    <th className="py-3.5 pr-4 text-center font-semibold w-16">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {enrichedPortfolio.map(pos => {
                    const isPos = pos.pnl >= 0;
                    return (
                      <tr key={pos.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="py-4 pl-4 font-sans">
                          <Link href={`/equities/companies/${pos.symbol}`} className="flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                            <span className="font-mono font-bold text-white text-sm">{pos.symbol}</span>
                            <span className="text-xs text-[#868f97] hidden sm:inline">{pos.company.info.name}</span>
                          </Link>
                        </td>

                        <td className="py-4 px-4 text-right text-white">
                          {pos.shares}
                        </td>

                        <td className="py-4 px-4 text-right text-white/70">
                          ₹{pos.buyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-4 px-4 text-right font-bold text-white">
                          ₹{pos.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-4 px-4 text-right font-bold text-white">
                          ₹{pos.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className={`font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPos ? '+' : ''}₹{pos.pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </div>
                          <div className={`text-[10px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPos ? '+' : ''}{pos.pnlPct.toFixed(2)}%
                          </div>
                        </td>

                        <td className="py-4 pr-4 text-center">
                          <button
                            onClick={() => removePosition(pos.id)}
                            className="p-1 rounded text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove position"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {portfolio.length === 0 && (
              <div className="text-center py-16 text-[#868f97] space-y-2">
                <Briefcase size={32} className="mx-auto text-white/20" />
                <div className="text-sm font-semibold text-white">No portfolio positions recorded yet</div>
                <p className="text-xs">Click &quot;Add Position&quot; to begin tracking your portfolio holdings and P&L.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── ADD POSITION MODAL ─────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/20 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Add Portfolio Position</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addPosition} className="space-y-4 text-xs">
              <div>
                <label className="text-[#868f97] uppercase tracking-wider text-[10px] font-semibold block mb-1">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  placeholder="e.g. RELIANCE, TCS, INFY"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  required
                  className="w-full bg-[#0b0b0b] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-white/30 uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-[#868f97] uppercase tracking-wider text-[10px] font-semibold block mb-1">
                  Quantity (Shares)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={newShares}
                  onChange={(e) => setNewShares(e.target.value)}
                  required
                  min="1"
                  step="any"
                  className="w-full bg-[#0b0b0b] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-white/30 font-mono"
                />
              </div>

              <div>
                <label className="text-[#868f97] uppercase tracking-wider text-[10px] font-semibold block mb-1">
                  Average Buy Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2840.50"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  min="0.01"
                  step="any"
                  className="w-full bg-[#0b0b0b] text-white p-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-white/30 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 font-semibold transition-all"
                >
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
