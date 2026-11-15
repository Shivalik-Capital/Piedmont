/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LivePulse from '../ui/LivePulse';
import Icon from '../ui/Icon';
import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
  onOpenCopilot?: () => void;
}

export default function TopBar({ onOpenCopilot }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Kolkata' };
      const timeStr = now.toLocaleTimeString('en-US', { ...options, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      setTime(timeStr);
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

  const pageTitle = pathname === '/' || pathname === '/dashboard'
    ? 'Executive Overview' 
    : pathname.startsWith('/intelligence')
    ? 'Quantitative Signals'
    : pathname.startsWith('/portfolio')
    ? 'Position Audit & Holdings'
    : pathname.startsWith('/copilot')
    ? 'Copilot AI Studio'
    : pathname.startsWith('/replay')
    ? 'Deterministic Replay Engine'
    : pathname.startsWith('/calendar')
    ? 'Institutional Calendar'
    : pathname.startsWith('/watchlist')
    ? 'Watchlist & P&L'
    : pathname.startsWith('/equities') 
    ? 'Equities Diagnostics' 
    : pathname.startsWith('/macro') 
    ? 'Macro Radar' 
    : pathname.startsWith('/commodities') 
    ? 'Commodities & Transmission' 
    : pathname.startsWith('/screener') 
    ? 'Institutional Screener' 
    : 'Piedmont Terminal';

  const pageIcon = pathname === '/' || pathname === '/dashboard'
    ? 'dashboard' 
    : pathname.startsWith('/intelligence')
    ? 'monitoring'
    : pathname.startsWith('/portfolio')
    ? 'pie_chart'
    : pathname.startsWith('/copilot')
    ? 'bot'
    : pathname.startsWith('/replay')
    ? 'history'
    : pathname.startsWith('/calendar')
    ? 'calendar'
    : pathname.startsWith('/watchlist')
    ? 'star'
    : pathname.startsWith('/macro') 
    ? 'language' 
    : pathname.startsWith('/commodities') 
    ? 'oil_barrel' 
    : pathname.startsWith('/screener') 
    ? 'filter_list' 
    : 'show_chart';

  return (
    <nav className="fixed top-7 right-0 left-0 md:left-20 z-40 flex justify-between items-center h-16 px-4 sm:px-gutter bg-surface/90 backdrop-blur-md border-b border-outline-variant transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="font-bold text-base sm:text-lg tracking-[-0.053em] text-white flex items-center gap-2">
          <img src="/icon.svg" className="w-5 h-5 sm:hidden" alt="Piedmont" />
          <span className="hidden sm:inline">Piedmont Terminal</span>
        </div>
        
        {/* Active Route Pill with Fey Signal indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-white text-xs font-medium">
          <Icon name={pageIcon} className="text-xs text-[#479ffa]" />
          <span>{pageTitle}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        
        {/* Copilot Action Pill (Fey 99px button style) */}
        {onOpenCopilot && (
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#479ffa]/10 hover:bg-[#479ffa]/20 border border-[#479ffa]/30 text-[#479ffa] text-xs font-semibold uppercase tracking-wider transition-all"
            title="Launch Piedmont Copilot (F1 or Cmd+K)"
          >
            <Icon name="bot" className="w-3.5 h-3.5 text-[#479ffa]" />
            <span className="hidden sm:inline">Copilot</span>
            <span className="hidden md:inline font-mono-data text-[9px] bg-[#479ffa]/20 px-1 rounded-full text-white">F1</span>
          </button>
        )}

        {/* Search Bar - Fey Pill Well */}
        <div className="flex items-center gap-unit relative">
          <Icon name="search" className="absolute left-3 text-on-surface-variant text-xs" />
          <input 
            type="text" 
            placeholder="Search equities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            className="bg-surface-container-high border border-outline-variant rounded-full focus:border-[#479ffa] font-mono-data text-xs text-on-surface w-28 sm:w-44 md:w-56 pl-8 pr-3 py-1.5 transition-all outline-none"
          />
          {isSearching && (
             <div className="absolute right-2.5 top-2.5 w-3 h-3 border-2 border-[#479ffa] border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && results.length > 0 && (
          <div className="absolute top-full right-0 sm:right-24 mt-2 bg-surface-container-high rounded-[16px] overflow-hidden border border-outline-variant shadow-[0_0_44px_rgba(0,0,0,0.8)] z-50 w-72 sm:w-80 max-h-[350px] overflow-y-auto">
            {results.map((company) => (
              <button 
                key={company.symbol}
                onClick={() => handleSelectCompany(company.symbol)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 flex flex-col transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium truncate pr-2">{company.name}</span>
                  <span className="text-on-surface-variant text-xs font-mono-data bg-surface-container px-2 py-0.5 rounded-full">{company.symbol}</span>
                </div>
                <span className="text-on-surface-variant text-xs mt-1">{company.sector}</span>
              </button>
            ))}
          </div>
        )}
        
        {showDropdown && results.length === 0 && searchQuery.length >= 2 && !isSearching && (
          <div className="absolute top-full right-0 sm:right-24 mt-2 bg-surface-container-high rounded-[16px] p-4 border border-outline-variant shadow-[0_0_44px_rgba(0,0,0,0.8)] z-50 w-72 sm:w-80 text-center text-sm text-on-surface-variant">
            No companies found for &quot;{searchQuery}&quot;
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 text-on-surface-variant">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-outline-variant hover:border-white/30 bg-surface-container-high text-on-surface-variant hover:text-white transition-colors flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} className="text-sm" />
          </button>

          <span className="text-xs font-mono-data tabular-nums hidden lg:inline w-[110px] text-right text-on-surface-variant" suppressHydrationWarning>
            {mounted ? `${time} IST` : ''}
          </span>
          <LivePulse />
        </div>
      </div>
    </nav>
  );
}
