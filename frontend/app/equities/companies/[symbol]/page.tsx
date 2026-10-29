'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Activity, 
  FileText, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  LineChart as ChartIcon
} from 'lucide-react';
import PriceChart from '../../../components/PriceChart';
import { getInstitutionalCompany, CompanyData, StatementRow } from '../../../lib/company-database';

// ─── Financials Statement Table Component ─────────────────────────────
function FinancialTable({ data, type }: { data: StatementRow[], type: 'income' | 'balance' | 'cash' }) {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-white/40">No statements available for this period.</div>;
  }

  // Get all unique columns (periods)
  const columns = Array.from(new Set(data.map(d => d.period))).sort().reverse();
  
  // Group by line item preserving order
  const lineItemOrder: string[] = [];
  const rows: Record<string, Record<string, number>> = {};
  
  data.forEach(d => {
    if (!rows[d.line_item]) {
      lineItemOrder.push(d.line_item);
      rows[d.line_item] = {};
    }
    rows[d.line_item][d.period] = d.value;
  });

  return (
    <div className="w-full overflow-x-auto pb-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-xs text-[#868f97] uppercase tracking-wider">
            <th className="py-3.5 pl-4 font-semibold sticky left-0 bg-[#121212] z-10 w-1/2 min-w-[200px]">
              Line Item (₹ Crores)
            </th>
            {columns.map(col => (
              <th key={col} className="py-3.5 px-4 font-semibold text-right whitespace-nowrap min-w-[100px]">
                FY {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono text-xs divide-y divide-white/5">
          {lineItemOrder.map((item, i) => (
            <motion.tr 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              key={item} 
              className="hover:bg-white/[0.03] transition-colors group"
            >
              <td className="py-3.5 pl-4 sticky left-0 bg-[#121212] group-hover:bg-[#181818] transition-colors z-10 font-sans font-medium text-white">
                {item}
              </td>
              {columns.map(col => {
                const val = rows[item]?.[col];
                return (
                  <td key={col} className="py-3.5 px-4 text-right text-white/80 tabular-nums font-semibold">
                    {val != null ? (val < 0 ? `(₹${Math.abs(val).toLocaleString('en-IN')})` : `₹${val.toLocaleString('en-IN')}`) : '—'}
                  </td>
                );
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const symbol = (params.symbol as string || 'RELIANCE').toUpperCase();

  // Instant resilient dataset
  const fallbackProfile = getInstitutionalCompany(symbol);
  const [data, setData] = useState<CompanyData>(fallbackProfile);
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'financials'>('overview');
  const [statementSubTab, setStatementSubTab] = useState<'income' | 'balance' | 'cash'>('income');
  const [isStarred, setIsStarred] = useState(false);

  // Check URL query tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'financials' || tab === 'statements') {
      setActiveTab('financials');
    } else if (tab === 'chart') {
      setActiveTab('chart');
    }
  }, [searchParams]);

  // Check watchlist status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('piedmont_watchlist');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        setIsStarred(list.includes(symbol));
      }
    } catch (e) {
      // ignore
    }
  }, [symbol]);

  const toggleWatchlist = () => {
    try {
      const saved = localStorage.getItem('piedmont_watchlist');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(symbol)) {
        list = list.filter(s => s !== symbol);
        setIsStarred(false);
      } else {
        list.push(symbol);
        setIsStarred(true);
      }
      localStorage.setItem('piedmont_watchlist', JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  };

  // Attempt live API fetch in background without blocking UI
  useEffect(() => {
    let isMounted = true;
    async function fetchLive() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/company/${symbol}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json && json.info && json.info.name) {
            setData(prev => ({
              ...prev,
              info: { ...prev.info, ...json.info },
              metrics: { ...prev.metrics, ...(json.metrics || {}) }
            }));
          }
        }

        const finRes = await fetch(`${API}/api/company/${symbol}/financials`);
        if (finRes.ok) {
          const finJson = await finRes.json();
          if (isMounted && Array.isArray(finJson) && finJson.length > 0) {
            setData(prev => ({
              ...prev,
              financials: finJson
            }));
          }
        }
      } catch (err) {
        // Keep in-memory profile intact
      }
    }

    if (symbol) {
      fetchLive();
    }
    return () => { isMounted = false; };
  }, [symbol]);

  const info = data.info;
  const metrics = data.metrics || {};
  const isPositive = (info.change || 0) >= 0;

  const metricKeys = [
    { key: 'pe', label: 'P/E Ratio', term: 'pe' },
    { key: 'pb', label: 'P/B Ratio', term: 'pb' },
    { key: 'eps', label: 'Earnings Per Share', term: 'eps' },
    { key: 'dividendYield', label: 'Dividend Yield', term: 'dividendYield' },
    { key: 'roe', label: 'Return on Equity', term: 'roe' },
    { key: 'roce', label: 'ROCE', term: 'roe' },
    { key: 'debtToEquity', label: 'Debt to Equity', term: 'debtToEquity' },
    { key: 'operatingMargin', label: 'Operating Margin', term: 'profit-loss' },
    { key: 'netProfitMargin', label: 'Net Profit Margin', term: 'netProfit' },
    { key: 'revenue', label: 'Revenue (TTM)', term: 'revenue' },
    { key: 'netProfit', label: 'Net Profit (TTM)', term: 'netProfit' },
    { key: 'freeCashFlow', label: 'Free Cash Flow', term: 'cash-flow' }
  ];

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* ─── BREADCRUMB & HEADER ────────────────────────────────────── */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Go back"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-[#868f97]">
              <Link href="/screener" className="hover:text-white transition-colors">Equities</Link>
              <span>/</span>
              <span className="text-white uppercase">{symbol}</span>
            </div>
          </div>

          {/* Watchlist Star Button (V4 feature) */}
          <button
            onClick={toggleWatchlist}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isStarred 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star size={14} className={isStarred ? 'fill-amber-400 text-amber-400' : ''} />
            <span>{isStarred ? 'Starred' : 'Add to Watchlist'}</span>
          </button>
        </div>

        {/* Company Title & Price Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs bg-white/10 text-white px-2 py-0.5 rounded font-bold">{symbol}</span>
              <span className="text-xs bg-white/5 text-[#868f97] border border-white/10 px-2 py-0.5 rounded">{info.sector}</span>
              <span className="text-xs text-white/40 font-mono">{info.exchange}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">{info.name}</h1>
          </div>

          <div className="text-left md:text-right">
            <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight">
              ₹{(info.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className={`font-mono text-xs sm:text-sm font-semibold flex items-center md:justify-end gap-1 mt-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{isPositive ? '+' : ''}{(info.change || 0).toFixed(2)} ({isPositive ? '+' : ''}{(info.changePct || 0).toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* 52-Week & Day High/Low Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#121212] p-3.5 rounded-xl border border-white/5 text-xs">
          <div>
            <div className="text-[#868f97] text-[10px] uppercase tracking-wider mb-0.5">Market Cap</div>
            <div className="font-mono font-bold text-white">{info.marketCapFormatted}</div>
          </div>
          <div>
            <div className="text-[#868f97] text-[10px] uppercase tracking-wider mb-0.5">52-Week Low</div>
            <div className="font-mono font-bold text-white">₹{(info.fiftyTwoWeekLow || 0).toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-[#868f97] text-[10px] uppercase tracking-wider mb-0.5">52-Week High</div>
            <div className="font-mono font-bold text-white">₹{(info.fiftyTwoWeekHigh || 0).toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-[#868f97] text-[10px] uppercase tracking-wider mb-0.5">52W Position</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (((info.price - info.fiftyTwoWeekLow) / (info.fiftyTwoWeekHigh - info.fiftyTwoWeekLow)) * 100) || 50))}%` 
                  }}
                />
              </div>
              <span className="font-mono text-[10px] text-white/70">
                {Math.round((((info.price - info.fiftyTwoWeekLow) / (info.fiftyTwoWeekHigh - info.fiftyTwoWeekLow)) * 100) || 50)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION TABS ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-[#868f97] hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity size={14} />
          Overview & Metrics
        </button>

        <button
          onClick={() => setActiveTab('chart')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'chart'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-[#868f97] hover:text-white hover:bg-white/5'
          }`}
        >
          <ChartIcon size={14} />
          Interactive Chart
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'financials'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-[#868f97] hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={14} />
          Financial Statements
        </button>

        <Link
          href={`/equities/companies/${symbol}/financials`}
          className="ml-auto text-xs text-[#868f97] hover:text-white flex items-center gap-1 transition-colors hidden sm:flex"
        >
          <span>Full Financials Page</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* ─── TAB CONTENT ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Business Moat & Thesis Card */}
            <div className="bg-[#121212] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Business Model & Competitive Moat</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                {info.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs">
                <div className="bg-[#0b0b0b] p-3.5 rounded-xl border border-white/5">
                  <div className="text-[#868f97] uppercase tracking-wider text-[10px] font-semibold mb-1">Durable Moat</div>
                  <div className="text-white/90 leading-normal">{info.moat}</div>
                </div>
                <div className="bg-[#0b0b0b] p-3.5 rounded-xl border border-white/5">
                  <div className="text-[#868f97] uppercase tracking-wider text-[10px] font-semibold mb-1">Operating Engine</div>
                  <div className="text-white/90 leading-normal">{info.businessModel}</div>
                </div>
              </div>
            </div>

            {/* Quick Chart Preview in Overview */}
            <div className="bg-[#121212] rounded-2xl border border-white/10 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">Price Trend</div>
                <button 
                  onClick={() => setActiveTab('chart')} 
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Expand Full Chart</span>
                  <ExternalLink size={12} />
                </button>
              </div>
              <PriceChart symbol={symbol} name={info.name} />
            </div>

            {/* 12-Card Fundamental Metrics Grid with Click-To-Understand */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Valuation, Profitability & Financial Ratios
                </h2>
                <span className="text-xs text-[#868f97]">Click any card to read institutional breakdown</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {metricKeys.map((item, idx) => {
                  const m = metrics[item.key];
                  const displayValue = m?.formatted || (m?.value != null ? (item.key === 'dividendYield' || item.key.includes('Margin') || item.key === 'roe' || item.key === 'roce' ? `${m.value}%` : item.key === 'pe' || item.key === 'pb' || item.key === 'debtToEquity' ? `${m.value}x` : item.key === 'eps' ? `₹${m.value}` : m.value) : '—');
                  const explanation = m?.explanation || 'Click to view institutional analysis of this financial ratio.';

                  return (
                    <Link
                      key={item.key}
                      href={`/learn/${item.term}?company=${symbol}&val=${encodeURIComponent(String(displayValue))}`}
                      className="group bg-[#121212] p-5 rounded-xl border border-white/10 hover:border-emerald-400/50 hover:bg-[#161616] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[#868f97] text-[11px] uppercase tracking-wider mb-2">
                          <span className="font-semibold group-hover:text-white transition-colors">{item.label}</span>
                          <span className="text-[10px] text-white/40 group-hover:text-emerald-400 transition-colors">Explain →</span>
                        </div>
                        <div className="font-mono text-2xl font-bold text-white tracking-tight mb-2">
                          {displayValue}
                        </div>
                        <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
                          {explanation}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#868f97] group-hover:text-emerald-400 transition-colors">
                        <span>Click to understand</span>
                        <ChevronRight size={12} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'chart' && (
          <motion.div
            key="chart"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#121212] rounded-2xl border border-white/10 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{info.name} ({symbol})</h2>
                <p className="text-xs text-[#868f97]">Institutional multi-period technical analysis & volume profile</p>
              </div>
              <div className="font-mono text-xl font-bold text-white">
                ₹{(info.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <PriceChart symbol={symbol} name={info.name} />
          </motion.div>
        )}

        {activeTab === 'financials' && (
          <motion.div
            key="financials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Statement Type Sub-Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121212] p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setStatementSubTab('income')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statementSubTab === 'income' 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : 'text-[#868f97] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Profit & Loss (Income)
                </button>
                <button
                  onClick={() => setStatementSubTab('balance')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statementSubTab === 'balance' 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : 'text-[#868f97] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Balance Sheet
                </button>
                <button
                  onClick={() => setStatementSubTab('cash')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statementSubTab === 'cash' 
                      ? 'bg-white/20 text-white shadow-sm' 
                      : 'text-[#868f97] hover:text-white hover:bg-white/5'
                  }`}
                >
                  Cash Flow Statement
                </button>
              </div>

              <div className="text-[11px] text-[#868f97] font-mono">
                Currency: Indian Rupee (₹ Crores)
              </div>
            </div>

            {/* Financials Table Container */}
            <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  <span>
                    {statementSubTab === 'income' && 'Income Statement (Consolidated P&L)'}
                    {statementSubTab === 'balance' && 'Balance Sheet (Assets & Liabilities)'}
                    {statementSubTab === 'cash' && 'Cash Flow Statement (Operations, Capex & Financing)'}
                  </span>
                </h3>
              </div>

              <FinancialTable 
                data={data.financials.filter(f => {
                  if (statementSubTab === 'income') return f.statement_type === 'income_statement';
                  if (statementSubTab === 'balance') return f.statement_type === 'balance_sheet';
                  return f.statement_type === 'cash_flow';
                })} 
                type={statementSubTab} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
