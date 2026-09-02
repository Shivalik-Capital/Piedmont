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
        const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${API}/api/company/screen`); // Just fetch some to show
        const data = await res.json();
        setCompanies(data.companies || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Companies</h1>
        <p className="text-white/60">Directory of equities. Looking for the screener? <Link href="/screener" className="text-[#D4AF37] hover:underline">Go here.</Link></p>
      </div>

      {loading ? (
        <div className="text-white/50">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(c => (
            <Link key={c.symbol} href={`/equities/companies/${c.symbol}`} className="bg-[#1A1917] p-6 rounded-xl border border-white/10 hover:border-[#D4AF37]/50 transition-colors">
              <div className="text-lg font-bold text-white">{c.name}</div>
              <div className="text-sm text-white/50">{c.symbol} • {c.sector}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
