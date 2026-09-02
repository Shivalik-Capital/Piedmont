'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Company {
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

export default function ScreenerPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [sector, setSector] = useState('');
  const [maxPe, setMaxPe] = useState('100');
  const [maxPb, setMaxPb] = useState('10');
  const [minRoe, setMinRoe] = useState('0');
  const [minDivYield, setMinDivYield] = useState('0');
  const [maxDebtEquity, setMaxDebtEquity] = useState('5');

  useEffect(() => {
    async function fetchScreen() {
      setLoading(true);
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const params = new URLSearchParams();
        if (sector) params.append('sector', sector);
        if (maxPe) params.append('max_pe', maxPe);
        if (maxPb) params.append('max_pb', maxPb);
        if (minRoe) params.append('min_roe', minRoe);
        if (minDivYield) params.append('min_dividend_yield', minDivYield);
        if (maxDebtEquity) params.append('max_debt_to_equity', maxDebtEquity);

        const res = await fetch(`${API}/api/company/screen?${params.toString()}`);
        const data = await res.json();
        setCompanies(data.companies || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchScreen();
  }, [sector, maxPe, maxPb, minRoe, minDivYield, maxDebtEquity]);

  return (
    <div className="min-h-screen bg-[#111110] text-[#D4AF37] p-8">
      <div className="flex flex-col xl:flex-row gap-8 max-w-[1600px] mx-auto">
        
        {/* Filters Sidebar */}
        <div className="w-full xl:w-80 shrink-0">
          <div className="sticky top-8 bg-[#1A1917] p-6 rounded-xl border border-[#D4AF37]/20">
            <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
              <SlidersHorizontal size={20} />
              <h2 className="text-xl font-bold">Parameters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#D4AF37]/70 block mb-2">Sector</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-[#111110] text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg p-2 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">All Sectors</option>
                  <option value="Technology">Technology</option>
                  <option value="Financials">Financials</option>
                  <option value="Energy">Energy</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Consumer Discretionary">Consumer Discretionary</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#D4AF37]/70">Max P/E</label>
                  <span className="text-xs">{maxPe}</span>
                </div>
                <input type="range" min="0" max="200" value={maxPe} onChange={(e) => setMaxPe(e.target.value)} className="w-full accent-[#D4AF37]" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#D4AF37]/70">Max P/B</label>
                  <span className="text-xs">{maxPb}</span>
                </div>
                <input type="range" min="0" max="50" value={maxPb} onChange={(e) => setMaxPb(e.target.value)} className="w-full accent-[#D4AF37]" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#D4AF37]/70">Min ROE (%)</label>
                  <span className="text-xs">{minRoe}</span>
                </div>
                <input type="range" min="0" max="100" value={minRoe} onChange={(e) => setMinRoe(e.target.value)} className="w-full accent-[#D4AF37]" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#D4AF37]/70">Min Div Yield (%)</label>
                  <span className="text-xs">{minDivYield}</span>
                </div>
                <input type="range" min="0" max="15" step="0.5" value={minDivYield} onChange={(e) => setMinDivYield(e.target.value)} className="w-full accent-[#D4AF37]" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#D4AF37]/70">Max Debt/Equity</label>
                  <span className="text-xs">{maxDebtEquity}</span>
                </div>
                <input type="range" min="0" max="10" step="0.5" value={maxDebtEquity} onChange={(e) => setMaxDebtEquity(e.target.value)} className="w-full accent-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Screener</h1>
              <p className="text-[#D4AF37]/70">Find companies based on custom financial parameters.</p>
            </div>
            <div className="text-[#D4AF37]/70 text-sm">
              {loading ? 'Scanning...' : `${companies.length} Results`}
            </div>
          </div>

          <div className="bg-[#1A1917] rounded-xl border border-[#D4AF37]/20 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37]/70 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Symbol</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Sector</th>
                  <th className="p-4 font-medium text-right">Mkt Cap</th>
                  <th className="p-4 font-medium text-right">P/E</th>
                  <th className="p-4 font-medium text-right">P/B</th>
                  <th className="p-4 font-medium text-right">ROE</th>
                  <th className="p-4 font-medium text-right">Div Yld</th>
                  <th className="p-4 font-medium text-right">D/E</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[#D4AF37]/50">Loading...</td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[#D4AF37]/50">
                      <Filter className="mx-auto mb-2 opacity-50" size={24} />
                      No companies match these criteria.
                    </td>
                  </tr>
                ) : (
                  companies.map((c) => (
                    <tr key={c.symbol} className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors group">
                      <td className="p-4 font-bold">
                        <Link href={`/equities/companies/${c.symbol}`} className="text-white group-hover:text-[#D4AF37]">
                          {c.symbol}
                        </Link>
                      </td>
                      <td className="p-4 text-white/90">{c.name}</td>
                      <td className="p-4 text-white/70">{c.sector}</td>
                      <td className="p-4 text-right text-white/90 font-mono">
                        {(c.market_cap / 1e9).toFixed(2)}B
                      </td>
                      <td className="p-4 text-right font-mono">
                        {c.pe_ratio != null ? (
                          <Link href="/learn/pe" className="hover:underline">{c.pe_ratio.toFixed(2)}</Link>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-right font-mono">
                        {c.pb_ratio != null ? (
                          <Link href="/learn/pb" className="hover:underline">{c.pb_ratio.toFixed(2)}</Link>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-right font-mono">
                        {c.roe != null ? (
                          <Link href="/learn/roe" className="hover:underline">{c.roe.toFixed(2)}%</Link>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-right font-mono">
                        {c.dividend_yield != null ? (
                          <Link href="/learn/dividendYield" className="hover:underline">{c.dividend_yield.toFixed(2)}%</Link>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-right font-mono">
                        {c.debt_to_equity != null ? (
                          <Link href="/learn/debtToEquity" className="hover:underline">{c.debt_to_equity.toFixed(2)}</Link>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
