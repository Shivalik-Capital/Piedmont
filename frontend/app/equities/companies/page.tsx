'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface Company {
  symbol: string;
  name: string;
  sector: string;
  price?: number;
  change_pct?: number;
}

const NIFTY_50_FALLBACK: Company[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Financials' },
  { symbol: 'INFY', name: 'Infosys', sector: 'Technology' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Financials' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financials' },
  { symbol: 'ITC', name: 'ITC', sector: 'Consumer Goods' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Financials' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'Consumer Goods' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Automobile' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'Technology' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Healthcare' },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Financials' },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer Goods' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Materials' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Financials' },
  { symbol: 'NTPC', name: 'NTPC', sector: 'Energy' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy' },
  { symbol: 'TATASTEEL', name: 'Tata Steel', sector: 'Materials' },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', sector: 'Utilities' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', sector: 'Automobile' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Conglomerate' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', sector: 'Automobile' },
  { symbol: 'COALINDIA', name: 'Coal India', sector: 'Materials' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', sector: 'Financials' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', sector: 'Infrastructure' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', sector: 'Materials' },
  { symbol: 'CIPLA', name: 'Cipla', sector: 'Healthcare' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', sector: 'Automobile' },
  { symbol: 'BPCL', name: 'Bharat Petroleum', sector: 'Energy' },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Healthcare' },
  { symbol: 'GRASIM', name: 'Grasim Industries', sector: 'Materials' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', sector: 'Consumer Goods' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'Consumer Goods' },
  { symbol: 'TECHM', name: 'Tech Mahindra', sector: 'Technology' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', sector: 'Automobile' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', sector: 'Healthcare' },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories", sector: 'Healthcare' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', sector: 'Materials' },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', sector: 'Financials' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance', sector: 'Financials' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance', sector: 'Financials' },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'Technology' },
  { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'Consumer Goods' },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(NIFTY_50_FALLBACK);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/company/list`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCompanies(data);
          }
        }
      } catch (err) {
        // Keep fallback
      }
    }
    fetchCompanies();
  }, []);

  const sectors = Array.from(new Set(companies.map(c => c.sector))).sort();

  const filtered = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !selectedSector || c.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">Company Directory</h1>
          <p className="text-[#868f97] text-xs sm:text-sm">
            Institutional profiles, financial statements, and valuation metrics for Nifty 50 constituents.
          </p>
        </div>
        
        <Link 
          href="/screener" 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white hover:bg-white/20 transition-all w-fit"
        >
          <SlidersHorizontal size={14} />
          <span>Launch Institutional Screener →</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by company name or ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] text-white placeholder-white/30 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-white/30"
          />
        </div>

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="bg-[#121212] text-white text-xs border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-white/30"
        >
          <option value="">All Sectors ({sectors.length})</option>
          {sectors.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map(c => (
          <Link 
            key={c.symbol} 
            href={`/equities/companies/${c.symbol}`} 
            className="bg-[#121212] p-4 sm:p-5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-[#161616] transition-all flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {c.symbol}
                </span>
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#868f97]">
                  {c.sector}
                </span>
              </div>
              <div className="text-sm font-semibold text-white/90 group-hover:text-white">
                {c.name}
              </div>
            </div>

            <ChevronRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#868f97] text-xs">
          No companies match &quot;{search}&quot;.
        </div>
      )}

    </div>
  );
}
