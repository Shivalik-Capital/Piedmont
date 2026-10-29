'use client';

import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import PriceChart from '../components/PriceChart';
import { ShimmerCard } from '../components/ui/Shimmer';

interface Commodity {
  name: string;
  price: number;
  change: number;
  change_pct: string;
  exchange: string;
  prefix: string;
}

interface CommoditiesData {
  commodities: Record<string, Commodity>;
  meta: {
    source: string;
    fetched_at: string;
  };
}

const DEFAULT_COMMODITIES: CommoditiesData = {
  commodities: {
    usd_inr: { name: 'USD/INR', price: 84.05, change: 0.08, change_pct: '0.10', exchange: 'FOREX', prefix: '₹' },
    gold: { name: 'Gold', price: 78450.0, change: 420.0, change_pct: '0.54', exchange: 'MCX', prefix: '₹' },
    crude_oil: { name: 'Crude Oil', price: 74.20, change: -0.85, change_pct: '-1.13', exchange: 'NYMEX', prefix: '$' },
    '10y_gsec': { name: '10Y G-Sec Yield', price: 6.82, change: -0.01, change_pct: '-0.15', exchange: 'NSE', prefix: '' }
  },
  meta: {
    source: 'Yahoo Finance via yfinance',
    fetched_at: 'Oct 29, 2026 at 9:15 AM IST'
  }
};

export default function CommoditiesPage() {
  const [data, setData] = useState<CommoditiesData>(DEFAULT_COMMODITIES);
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${baseUrl}/api/market/commodities`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.commodities) {
            setData(json);
          }
        }
      } catch (err) {
        // Keep default
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return isNaN(date.getTime()) ? timeStr : date.toLocaleString();
    } catch {
      return timeStr;
    }
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-positive';
    if (change < 0) return 'text-negative';
    return 'text-on-surface-variant';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return 'trending_up';
    if (change < 0) return 'trending_down';
    return 'horizontal_rule';
  };

  const { commodities, meta } = data;

  const renderCard = (key: string, item: Commodity, isHero = false) => {
    return (
      <div
        key={key}
        className={`cursor-pointer transition-transform duration-200 hover:scale-[1.02] border border-outline-variant rounded-xl p-gutter ${
          isHero ? 'bg-surface-container-high' : 'bg-surface-container'
        }`}
        onClick={() => setSelectedCommodity(key)}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${isHero ? 'text-xl sm:text-2xl font-bold' : 'text-base sm:text-lg font-bold'} text-white`}>{item.name}</h3>
          <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-[#868f97] text-[10px] font-mono uppercase tracking-wider font-semibold rounded-full">
            {item.exchange}
          </span>
        </div>
        
        <div className="mt-auto">
          <div className={`${isHero ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-mono-data font-bold text-white mb-2 tabular-nums`}>
            {item.price != null ? `${item.prefix || ''}${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          </div>
          
          <div className={`flex items-center gap-1.5 font-mono-data text-xs sm:text-sm font-medium ${getTrendColor(item.change)}`}>
            <Icon name={getTrendIcon(item.change)} size={14} />
            <span>
              {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.change > 0 ? '+' : ''}{item.change_pct}%)
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-gutter gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2">Commodities</h1>
          <p className="text-xs sm:text-sm text-[#868f97]">Global commodity benchmarks, FX rates, and sovereign yield benchmarks</p>
        </div>
        <div className="text-left md:text-right text-xs font-mono text-[#868f97] space-y-1">
          <div>Source: {meta.source}</div>
          <div className="text-[11px] text-[#868f97]/70">Synced {formatTime(meta.fetched_at)}</div>
        </div>
      </div>

      {/* HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-margin">
        {commodities.gold && renderCard('gold', commodities.gold, true)}
        {commodities.crude_oil && renderCard('crude_oil', commodities.crude_oil, true)}
      </div>

      {/* ALL COMMODITIES */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-4">All Instruments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {Object.entries(commodities).map(([key, item]) => renderCard(key, item, false))}
        </div>
      </div>

      {/* PRICE CHART MODAL */}
      {selectedCommodity && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedCommodity(null)}
        >
          <div 
            className="w-full max-w-[1200px] max-h-[90vh] bg-surface-container border border-outline-variant shadow-2xl rounded-2xl p-6 relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PriceChart
              symbol={selectedCommodity}
              name={commodities[selectedCommodity]?.name || selectedCommodity}
              onClose={() => setSelectedCommodity(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
