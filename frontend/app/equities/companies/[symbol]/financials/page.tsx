'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, TrendingUp, TrendingDown, ChevronLeft } from 'lucide-react';
import { getInstitutionalCompany, CompanyData, StatementRow } from '../../../../lib/company-database';

function StatementTable({ data, type }: { data: StatementRow[], type: string }) {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-white/40">No statements available for this period.</div>;
  }

  const columns = Array.from(new Set(data.map(d => d.period))).sort().reverse();
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
            <th className="py-3.5 pl-4 font-semibold sticky left-0 bg-[#121212] z-10 w-1/2 min-w-[220px]">
              Line Item (₹ Crores)
            </th>
            {columns.map(col => (
              <th key={col} className="py-3.5 px-4 font-semibold text-right whitespace-nowrap min-w-[110px]">
                FY {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono text-xs divide-y divide-white/5">
          {lineItemOrder.map(item => (
            <tr key={item} className="hover:bg-white/[0.03] transition-colors group">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompanyFinancialsPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = (params.symbol as string || 'RELIANCE').toUpperCase();

  const fallback = getInstitutionalCompany(symbol);
  const [data, setData] = useState<CompanyData>(fallback);
  const [statementType, setStatementType] = useState<'income' | 'balance' | 'cash'>('income');

  useEffect(() => {
    async function fetchLive() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/company/${symbol}/financials`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            setData(prev => ({ ...prev, financials: json }));
          }
        }
      } catch (e) {
        // keep fallback
      }
    }
    if (symbol) fetchLive();
  }, [symbol]);

  const info = data.info;

  const exportCSV = () => {
    const activeData = data.financials.filter(f => {
      if (statementType === 'income') return f.statement_type === 'income_statement';
      if (statementType === 'balance') return f.statement_type === 'balance_sheet';
      return f.statement_type === 'cash_flow';
    });

    const columns = Array.from(new Set(activeData.map(d => d.period))).sort().reverse();
    const rows: Record<string, Record<string, number>> = {};
    activeData.forEach(d => {
      if (!rows[d.line_item]) rows[d.line_item] = {};
      rows[d.line_item][d.period] = d.value;
    });

    let csv = `Line Item (₹ Cr),${columns.map(c => `FY ${c}`).join(',')}\n`;
    Object.keys(rows).forEach(item => {
      const vals = columns.map(c => rows[item][c] ?? '');
      csv += `"${item}",${vals.join(',')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${symbol}_${statementType}_statement.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/equities/companies/${symbol}`}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-[#868f97]">
            <Link href="/screener" className="hover:text-white transition-colors">Equities</Link>
            <span>/</span>
            <Link href={`/equities/companies/${symbol}`} className="hover:text-white transition-colors">{symbol}</Link>
            <span>/</span>
            <span className="text-white">Financial Statements</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs bg-white/10 text-white px-2 py-0.5 rounded font-bold">{symbol}</span>
              <span className="text-xs bg-white/5 text-[#868f97] border border-white/10 px-2 py-0.5 rounded">{info.sector}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{info.name} — Multi-Year Financial Statements</h1>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white hover:bg-white/10 transition-colors w-fit"
          >
            <Download size={14} />
            <span>Export Statement CSV</span>
          </button>
        </div>
      </div>

      {/* Statement Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121212] p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatementType('income')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statementType === 'income' ? 'bg-white/20 text-white' : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            Income Statement (P&L)
          </button>
          <button
            onClick={() => setStatementType('balance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statementType === 'balance' ? 'bg-white/20 text-white' : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setStatementType('cash')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statementType === 'cash' ? 'bg-white/20 text-white' : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            Cash Flow Statement
          </button>
        </div>

        <div className="text-xs text-[#868f97] font-mono">
          Figures in ₹ Crores (INR)
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText size={16} className="text-emerald-400" />
            <span>
              {statementType === 'income' && 'Consolidated Profit & Loss Statement'}
              {statementType === 'balance' && 'Consolidated Balance Sheet'}
              {statementType === 'cash' && 'Consolidated Cash Flow Statement'}
            </span>
          </h2>
        </div>

        <StatementTable 
          data={data.financials.filter(f => {
            if (statementType === 'income') return f.statement_type === 'income_statement';
            if (statementType === 'balance') return f.statement_type === 'balance_sheet';
            return f.statement_type === 'cash_flow';
          })} 
          type={statementType} 
        />
      </div>

    </div>
  );
}
