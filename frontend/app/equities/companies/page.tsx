'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Company {
  symbol: string;
  name: string;
  sector: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const params = new URLSearchParams();
        params.append('t', Date.now().toString());
        const res = await fetch(`${API}/api/company/list?${params.toString()}`);
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Companies</h1>
        <p className="text-white/60 text-sm sm:text-base">Directory of equities. Looking for the institutional screener? <Link href="/screener" className="text-[#479ffa] hover:underline">Launch Screener →</Link></p>
      </div>

      {loading ? (
        <div className="text-white/50 py-12">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {companies.map(c => (
            <Link key={c.symbol} href={`/equities/companies/${c.symbol}`} className="bg-[#141414] p-5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-[#1a1a1a] transition-all group">
              <div className="text-base sm:text-lg font-bold text-white group-hover:text-white transition-colors">{c.name}</div>
              <div className="text-xs sm:text-sm text-white/50 mt-1 font-mono">{c.symbol} • <span className="font-sans text-white/40">{c.sector}</span></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
