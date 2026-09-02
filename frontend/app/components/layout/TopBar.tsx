/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LivePulse from '../ui/LivePulse';
import Icon from '../ui/Icon';

export default function TopBar() {
  const [time, setTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${API}/api/company/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectCompany = (symbol: string) => {
    setSearchQuery('');
    setShowDropdown(false);
    router.push(`/equities/companies/${symbol}`);
  };

  return (
    <nav className="fixed top-0 right-0 left-20 z-40 flex justify-between items-center h-16 px-gutter bg-surface/80 backdrop-blur-md border-b border-outline-variant transition-all duration-300">
      <div className="flex items-center gap-gutter">
        <div className="font-serif font-bold text-2xl tracking-tight text-on-surface hidden sm:block">Piedmont Terminal</div>
        <div className="flex items-center gap-unit text-primary font-bold border-b-2 border-primary h-16">
          <Icon name={pathname === '/' ? 'dashboard' : pathname.startsWith('/macro') ? 'language' : pathname.startsWith('/commodities') ? 'oil_barrel' : 'show_chart'} className="text-sm" />
          <span className="text-sm">{pathname === '/' ? 'Dashboard' : pathname.startsWith('/equities') ? 'Equities' : pathname.startsWith('/macro') ? 'Macro' : pathname.startsWith('/commodities') ? 'Commodities' : 'Dashboard'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-margin relative" ref={dropdownRef}>
        <div className="flex items-center gap-unit relative">
          <Icon name="search" className="absolute left-2 text-on-surface-variant text-sm" />
          <input 
            type="text" 
            placeholder="Command..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            className="bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-mono-data text-sm text-on-surface w-64 pl-8 py-1 transition-colors outline-none"
          />
          {isSearching && (
             <div className="absolute right-2 top-2 w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && results.length > 0 && (
          <div className="absolute top-full right-32 mt-2 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant shadow-xl z-50 w-80 max-h-[400px] overflow-y-auto">
            {results.map((company) => (
              <button 
                key={company.symbol}
                onClick={() => handleSelectCompany(company.symbol)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex flex-col transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-on-surface text-sm font-medium truncate pr-2">{company.name}</span>
                  <span className="text-on-surface-variant text-xs font-mono-data bg-surface-container px-2 py-1 rounded">{company.symbol}</span>
                </div>
                <span className="text-on-surface-variant/70 text-xs mt-1">{company.sector}</span>
              </button>
            ))}
          </div>
        )}
        
        {showDropdown && results.length === 0 && searchQuery.length >= 2 && !isSearching && (
          <div className="absolute top-full right-32 mt-2 bg-surface-container-high rounded-xl p-4 border border-outline-variant shadow-xl z-50 w-80 text-center text-sm text-on-surface-variant">
            No companies found for &quot;{searchQuery}&quot;
          </div>
        )}

        <div className="flex items-center gap-gutter text-on-surface-variant">
          {time && (
            <span className="text-xs font-mono-data tabular-nums hidden md:inline">
              {time} IST
            </span>
          )}
          <LivePulse />
          <button className="hover:text-primary transition-colors flex items-center"><Icon name="account_circle" /></button>
        </div>
      </div>
    </nav>
  );
}
