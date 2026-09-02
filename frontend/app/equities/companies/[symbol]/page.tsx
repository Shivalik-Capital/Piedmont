/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, FileText } from 'lucide-react';
import LivePulse from '../../../components/ui/LivePulse';
import MetricCard from '../../../components/ui/MetricCard';
import { ShimmerCard, ShimmerText } from '../../../components/ui/Shimmer';
import PriceChart from '../../../components/PriceChart';

// Financials Table Component
function FinancialTable({ data, type }: { data: any[], type: 'income' | 'balance' | 'cash' }) {
  if (!data || data.length === 0) return <div className="p-8 text-center text-on-surface-variant">No data available</div>;

  // Get all unique columns (periods)
  const columns = Array.from(new Set(data.map(d => d.period))).sort().reverse();
  
  // Group by line item
  const rows: Record<string, any> = {};
  data.forEach(d => {
    if (!rows[d.line_item]) {
      rows[d.line_item] = { line_item: d.line_item };
    }
    rows[d.line_item][d.period] = d.value;
  });

  return (
    <div className="w-full overflow-x-auto pb-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 pl-4 font-semibold text-on-surface-variant sticky left-0 bg-surface/80 backdrop-blur-md z-10 w-1/3">
              Line Item (₹ Cr)
            </th>
            {columns.map(col => (
              <th key={col} className="py-4 px-6 font-semibold text-on-surface-variant text-right whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono-data text-sm">
          {Object.values(rows).map((row, i) => (
            <motion.tr 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              key={row.line_item} 
              className="border-b border-white/5 hover:bg-white/5 transition-colors group"
            >
              <td className="py-4 pl-4 sticky left-0 bg-surface/80 backdrop-blur-md group-hover:bg-surface-container-high/80 transition-colors z-10 font-sans font-medium text-white">
                {row.line_item}
              </td>
              {columns.map(col => (
                <td key={col} className="py-4 px-6 text-right text-on-surface-variant">
                  {row[col] ? row[col].toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '-'}
                </td>
              ))}
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
  const symbol = params.symbol as string;
  
  const [data, setData] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'financials'>('overview');

  useEffect(() => {
    async function fetchCompany() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        
        // Fetch core
        const res = await fetch(`${API}/api/company/${symbol}`);
        if (!res.ok) throw new Error('Failed to load company data');
        const json = await res.json();
        setData(json);

        // Fetch financials
        const finRes = await fetch(`${API}/api/company/${symbol}/financials`);
        if (finRes.ok) {
          const finJson = await finRes.json();
          setFinancials(finJson);
        }

      } catch (err: any) {
        setError(err.message || 'Error loading');
      } finally {
        setLoading(false);
      }
    }
    if (symbol) {
      fetchCompany();
    }
  }, [symbol]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-4 w-1/3">
              <ShimmerText width="w-3/4" />
              <ShimmerText width="w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (error || !data || !data.info) return <div className="text-center py-20 text-negative">{error || "Failed to load company"}</div>;

    const info = data.info;
    const metricsData = data.metrics || {};
    const isPositive = (info.change || 0) >= 0;

    return (
      <div className="space-y-8 relative">
        
        {/* Header Section */}
        <motion.div 
          layoutId={`card-content-${symbol}`}
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        >
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 mb-margin">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => router.back()} className="text-on-surface-variant hover:text-on-surface transition-colors p-1 bg-surface-variant rounded-full">
                  <ArrowLeft size={16} />
                </button>
                <div className="font-mono-data text-xs text-on-surface-variant uppercase tracking-widest">{info.sector || 'EQUITY'}</div>
              </div>
              <motion.h1 layoutId={`company-name-${symbol}`} className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
                {info.name || symbol}
              </motion.h1>
              <span className="font-mono-data text-xs bg-surface-container-high text-on-surface-variant px-2 py-1 rounded mt-2 inline-block">
                {symbol}
              </span>
            </div>
            
            <div className="text-right">
              <motion.span layoutId={`company-price-${symbol}`} className="text-5xl font-bold text-on-surface">
                ₹{(info.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </motion.span>
              <div className={`font-mono-data text-sm flex items-center justify-end mt-1 ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(info.change || 0).toFixed(2)} ({isPositive ? '+' : ''}{(info.changePct || 0).toFixed(2)}%)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Custom Tab Navigation */}
        <div className="flex gap-2 border-b border-outline-variant/30 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white/10 text-white border border-white/20' : 'text-on-surface-variant hover:text-white hover:bg-white/5'}`}
          >
            <Activity size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'financials' ? 'bg-white/10 text-white border border-white/20' : 'text-on-surface-variant hover:text-white hover:bg-white/5'}`}
          >
            <FileText size={16} />
            Financials
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Chart Section */}
              <section className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden mb-margin">
                <PriceChart 
                  symbol={symbol}
                  name={info.name || symbol}
                />
              </section>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter bg-surface-container border border-outline-variant rounded-xl p-margin items-center">
                <div className="flex flex-col gap-unit">
                  <span className="font-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">Day High</span>
                  <span className="font-mono-data text-sm text-on-surface">
                    ₹{((info.price || 0) + (info.change ? Math.abs(info.change) : 5)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex flex-col gap-unit border-l border-outline-variant/50 pl-gutter">
                  <span className="font-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">Day Low</span>
                  <span className="font-mono-data text-sm text-on-surface">
                    ₹{((info.price || 0) - (info.change ? Math.abs(info.change) : 5)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex flex-col gap-unit border-l border-outline-variant/50 pl-gutter">
                  <span className="font-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">Volume</span>
                  <span className="font-mono-data text-sm text-on-surface">
                    {(info.marketCap ? (info.marketCap / 1000000).toFixed(1) + 'M' : 'N/A')}
                  </span>
                </div>
                <div className="flex flex-col gap-unit border-l border-outline-variant/50 pl-gutter col-span-1 md:col-span-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">52W Range</span>
                    <span className="font-mono-data text-[10px] text-on-surface-variant">
                      {info.fiftyTwoWeekHigh && info.fiftyTwoWeekLow && info.price ? Math.round(((info.price - info.fiftyTwoWeekLow) / (info.fiftyTwoWeekHigh - info.fiftyTwoWeekLow)) * 100) : 50}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-[4px] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full" 
                         style={{ width: `${info.fiftyTwoWeekHigh && info.fiftyTwoWeekLow && info.price ? Math.round(((info.price - info.fiftyTwoWeekLow) / (info.fiftyTwoWeekHigh - info.fiftyTwoWeekLow)) * 100) : 50}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono-data text-[10px] text-on-surface-variant">₹{info.fiftyTwoWeekLow?.toLocaleString('en-IN') || '-'}</span>
                    <span className="font-mono-data text-[10px] text-on-surface-variant">₹{info.fiftyTwoWeekHigh?.toLocaleString('en-IN') || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Fundamentals Grid */}
              <section className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { key: 'pe', label: 'P/E Ratio', prefix: '' },
                    { key: 'pb', label: 'P/B Ratio', prefix: '' },
                    { key: 'eps', label: 'EPS', prefix: '₹' },
                    { key: 'dividendYield', label: 'Dividend Yield', prefix: '' },
                    { key: 'roe', label: 'ROE', prefix: '' },
                    { key: 'debtToEquity', label: 'Debt/Equity', prefix: '' },
                    { key: 'revenue', label: 'Revenue', prefix: '' },
                    { key: 'netProfit', label: 'Net Profit', prefix: '' }
                  ].map((metric, i) => {
                    const item = metricsData[metric.key];
                    const val = item?.formatted ?? item?.value;
                    const pre = item?.formatted ? '' : metric.prefix;
                    return (
                      <motion.div key={metric.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <MetricCard
                          label={metric.label}
                          value={val ?? '-'}
                          explanation={val ? item?.explanation ?? 'No explanation available' : 'Data not available for this company'}
                          prefix={typeof val === 'number' && pre ? pre : ''}
                          metricKey={metric.key}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="financials"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {financials && Array.isArray(financials) ? (
                <>
                  <div className="glass-card rounded-3xl p-6 border border-white/10 overflow-hidden">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><Activity size={20} className="text-primary" /> Profit & Loss</h3>
                    <FinancialTable data={financials.filter((f: any) => f.statement_type === 'income_statement')} type="income" />
                  </div>
                  
                  <div className="glass-card rounded-3xl p-6 border border-white/10 overflow-hidden">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><FileText size={20} className="text-primary" /> Balance Sheet</h3>
                    <FinancialTable data={financials.filter((f: any) => f.statement_type === 'balance_sheet')} type="balance" />
                  </div>
                  
                  <div className="glass-card rounded-3xl p-6 border border-white/10 overflow-hidden">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><FileText size={20} className="text-primary" /> Cash Flow</h3>
                    <FinancialTable data={financials.filter((f: any) => f.statement_type === 'cash_flow')} type="cash" />
                  </div>
                </>
              ) : (
                <div className="text-center py-24 glass-card rounded-3xl">
                  <FileText className="mx-auto text-on-surface-variant mb-4" size={48} />
                  <h3 className="text-xl font-bold text-white mb-2">No Financial Data Available</h3>
                  <p className="text-on-surface-variant">Detailed statements are not available for this company yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  };

  return (
    <div className="min-h-screen text-on-surface p-6 md:p-12 relative z-10">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}
