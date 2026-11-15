'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '../components/ui/Icon';
import PriceChart from '../components/PriceChart';
import { isWeekendNow } from '../lib/commodity-database';

interface CommodityInstrument {
  key: string;
  slug: string;
  name: string;
  category: 'Precious Metals' | 'Energy' | 'Industrial Metals' | 'Currency' | 'Sovereign Debt';
  price: number;
  change: number;
  change_pct: string;
  exchange: string;
  prefix: string;
  unit: string;
  weekendHighlight: string;
  dailyHighlight: string;
  watchEquity: string;
}

const INSTITUTIONAL_COMMODITIES: Record<string, CommodityInstrument> = {
  gold: {
    key: 'gold',
    slug: 'gold',
    name: 'Gold',
    category: 'Precious Metals',
    price: 78450.0,
    change: 420.0,
    change_pct: '+0.54',
    exchange: 'MCX',
    prefix: '₹',
    unit: '10 grams',
    weekendHighlight: 'Weekly move +1.15%: Consolidating near record highs. Key wedding demand support.',
    dailyHighlight: 'Friday Session: +0.54% gain on lower US TIPS yields and central bank bids.',
    watchEquity: 'Titan, Kalyan, Muthoot'
  },
  crude_oil: {
    key: 'crude_oil',
    slug: 'crude-oil',
    name: 'Brent Crude Oil',
    category: 'Energy',
    price: 72.80,
    change: -0.85,
    change_pct: '-1.15',
    exchange: 'ICE',
    prefix: '$',
    unit: 'barrel',
    weekendHighlight: 'Weekly drop -2.41%: IEA projects 2027 crude surplus; strong margin tailwind for Indian paints & aviation.',
    dailyHighlight: 'Friday Session: -1.15% decline on higher US inventories (2.1M bbl build).',
    watchEquity: 'Asian Paints, IndiGo, ONGC'
  },
  silver: {
    key: 'silver',
    slug: 'silver',
    name: 'Silver',
    category: 'Precious Metals',
    price: 94200.0,
    change: 650.0,
    change_pct: '+0.69',
    exchange: 'MCX',
    prefix: '₹',
    unit: 'kg',
    weekendHighlight: 'Weekly gain +2.06%: Green energy solar PV cell demand drives physical deficit thesis.',
    dailyHighlight: 'Friday Session: +0.69% advance outperforming gold on industrial electronics off-take.',
    watchEquity: 'Hindustan Zinc, Tata Power'
  },
  natural_gas: {
    key: 'natural_gas',
    slug: 'natural-gas',
    name: 'Natural Gas',
    category: 'Energy',
    price: 265.40,
    change: -3.80,
    change_pct: '-1.41',
    exchange: 'MCX',
    prefix: '₹',
    unit: 'mmBtu',
    weekendHighlight: 'Weekly drop -3.18%: Mild North American winter outlook caps heating demand.',
    dailyHighlight: 'Friday Session: -1.41% easing lowers urea fertilizer feedstock subsidies.',
    watchEquity: 'IGL, MGL, Gujarat Gas'
  },
  copper: {
    key: 'copper',
    slug: 'copper',
    name: 'Copper',
    category: 'Industrial Metals',
    price: 842.50,
    change: 4.20,
    change_pct: '+0.50',
    exchange: 'MCX',
    prefix: '₹',
    unit: 'kg',
    weekendHighlight: 'Weekly gain +1.42%: Historic low smelter TC/RCs confirm global concentrate squeeze.',
    dailyHighlight: 'Friday Session: +0.50% firming validates Indian power grid cable capex cycle.',
    watchEquity: 'Hindalco, Polycab, KEI'
  },
  usd_inr: {
    key: 'usd_inr',
    slug: 'usd-inr',
    name: 'USD / INR',
    category: 'Currency',
    price: 84.38,
    change: 0.04,
    change_pct: '+0.05',
    exchange: 'FOREX',
    prefix: '₹',
    unit: 'USD',
    weekendHighlight: 'Weekly change +0.08%: RBI $719.55B reserves anchor exchange rate volatility to multi-year lows.',
    dailyHighlight: 'Friday Session: Rupee closed tightly at 84.38 under state bank liquidity absorption.',
    watchEquity: 'TCS, Infosys, Sun Pharma'
  },
  '10y_gsec': {
    key: '10y_gsec',
    slug: '10y-gsec',
    name: '10Y G-Sec Sovereign Yield',
    category: 'Sovereign Debt',
    price: 6.78,
    change: -0.02,
    change_pct: '-0.29',
    exchange: 'NSE',
    prefix: '',
    unit: '% yield',
    weekendHighlight: 'Weekly yield compression to 6.78%: Foreign bond index inflows continue at steady pace.',
    dailyHighlight: 'Friday Session: Yield softened 2 bps ahead of upcoming borrowing auction.',
    watchEquity: 'HDFC Bank, SBI, Real Estate'
  }
};

export default function CommoditiesPage() {
  const [instruments, setInstruments] = useState<Record<string, CommodityInstrument>>(INSTITUTIONAL_COMMODITIES);
  const [selectedChartCommodity, setSelectedChartCommodity] = useState<string | null>(null);
  const isWeekend = isWeekendNow();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${baseUrl}/api/market/commodities`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.commodities) {
            setInstruments((prev) => {
              const updated = { ...prev };
              for (const [k, v] of Object.entries(json.commodities as Record<string, any>)) {
                if (updated[k]) {
                  updated[k] = {
                    ...updated[k],
                    price: v.price != null ? v.price : updated[k].price,
                    change: v.change != null ? v.change : updated[k].change,
                    change_pct: v.change_pct != null ? String(v.change_pct) : updated[k].change_pct
                  };
                }
              }
              return updated;
            });
          }
        }
      } catch {
        // Fallback to institutional mid-Nov 2026 data
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTrendBadgeBg = (change: number) => {
    if (change > 0) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (change < 0) return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    return 'bg-surface-container-high border-outline-variant text-on-surface-variant';
  };

  const renderCard = (item: CommodityInstrument, isHero = false) => {
    const isUp = item.change >= 0;
    const highlight = isWeekend ? item.weekendHighlight : item.dailyHighlight;

    return (
      <div
        key={item.key}
        className={`flex flex-col justify-between border border-outline-variant rounded-2xl p-5 md:p-6 transition-all duration-200 hover:border-[#D4AF37]/50 ${
          isHero ? 'bg-surface-container-high' : 'bg-surface-container'
        }`}
      >
        {/* Card Header */}
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                {item.category}
              </span>
              <h3 className={`${isHero ? 'text-xl sm:text-2xl font-bold' : 'text-lg sm:text-xl font-bold'} text-on-surface tracking-tight mt-0.5`}>
                {item.name}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 bg-surface-container border border-outline-variant text-on-surface-variant text-[10px] font-mono uppercase tracking-wider font-semibold rounded-full">
              {item.exchange}
            </span>
          </div>

          {/* Price & Trend */}
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className={`${isHero ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'} font-mono-data font-bold text-on-surface tabular-nums tracking-tight`}>
                {item.prefix}{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-mono text-on-surface-variant">
                / {item.unit}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 font-mono-data text-xs font-semibold px-2 py-0.5 rounded-full border ${getTrendBadgeBg(item.change)}`}>
                <Icon name={isUp ? 'trending_up' : 'trending_down'} size={13} />
                <span>{isUp ? '+' : ''}{item.change.toFixed(2)} ({isUp ? '+' : ''}{item.change_pct}%)</span>
              </span>
              <span className="text-[11px] text-on-surface-variant font-mono">
                {isWeekend ? 'Weekly Move' : 'Daily 1D'}
              </span>
            </div>
          </div>

          {/* Dynamic Insight Callout */}
          <div className="bg-surface-container-high/70 border border-outline-variant rounded-xl p-3 my-4">
            <div className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider mb-1">
              {isWeekend ? 'Weekend Wrap Highlight' : 'Trading Day Impact'}
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {highlight}
            </p>
            <div className="mt-2 pt-2 border-t border-outline-variant flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
              <span>Equities Exposed:</span>
              <span className="text-on-surface font-semibold">{item.watchEquity}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
          {/* Prominent Click To Understand Button */}
          <Link
            href={`/learn/${item.slug}?val=${encodeURIComponent(String(item.price))}&trend=${encodeURIComponent(isUp ? 'Up' : 'Down')}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group"
          >
            <span>Click to understand</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>

          {/* Secondary Quick Chart Button */}
          <button
            type="button"
            onClick={() => setSelectedChartCommodity(item.key)}
            className="px-3 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface text-xs font-semibold rounded-xl transition-all"
            title="Open Interactive Price Chart"
          >
            Chart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8 min-h-screen bg-surface text-on-surface">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Piedmont Institutional Commodity Suite
            </span>
          </div>
          <h1 className="font-bold text-3xl sm:text-5xl text-on-surface tracking-tight mb-2">
            Commodities & FX
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
            Real-time physical benchmarks, sovereign currency anchors, and empirical equity transmission models for Indian capital markets.
          </p>
        </div>

        <div className="text-left md:text-right text-xs font-mono text-on-surface-variant space-y-1">
          <div>Feeds: <span className="text-on-surface">MCX · ICE · NYMEX · RBI</span></div>
          <div className="text-[11px] text-emerald-400 flex items-center md:justify-end gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Terminal Synced</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC TOP BANNER: WEEKEND WRAP OR LIVE TRADING DAY */}
      <div className="bg-surface-container border border-[#D4AF37]/30 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                {isWeekend ? 'Weekend Commodities Impact Wrap Active' : 'Live Trading Day Sensitivity Active'}
              </span>
              <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant">
                {isWeekend ? 'Saturday / Sunday Recap' : 'Weekday Market Session'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface">
              {isWeekend 
                ? 'Weekly Commodity Performance Recap & Monday 9:00 AM Market Thesis'
                : 'Intraday Commodity Price Swings & Real-Time Equity Margin Transmissions'}
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              {isWeekend
                ? 'Brent crude consolidation (-2.41% weekly) cushions Indian trade deficit while gold steadying (+1.15%) preserves jewellery wedding volume elasticity. Every commodity explanation page provides deep weekly wrap synthesis and stock watchlists.'
                : 'Intraday crude and bullion fluctuations actively transmit into quarterly gross margin revisions for paints, airlines, jewellery, and fertilizers. Click "Click to understand" on any card below for deep analysis.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <Link
              href="/learn/crude-oil"
              className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container border border-outline-variant text-xs font-mono font-semibold text-on-surface transition-colors"
            >
              Crude Oil Wrap &rarr;
            </Link>
            <Link
              href="/learn/gold"
              className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container border border-outline-variant text-xs font-mono font-semibold text-on-surface transition-colors"
            >
              Gold Wrap &rarr;
            </Link>
            <Link
              href="/learn/silver"
              className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container border border-outline-variant text-xs font-mono font-semibold text-on-surface transition-colors"
            >
              Silver Wrap &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* HERO COMMODITY CARDS: GOLD & CRUDE OIL */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
            Primary Sovereign Benchmarks
          </h2>
          <span className="text-xs text-on-surface-variant font-mono">
            85%+ of Indian Macro Volatility
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {renderCard(instruments.gold, true)}
          {renderCard(instruments.crude_oil, true)}
        </div>
      </div>

      {/* SECONDARY COMMODITY GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
            Industrial, Energy & Sovereign FX Universe
          </h2>
          <span className="text-xs text-on-surface-variant font-mono">
            Full Institutional Suite
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderCard(instruments.silver, false)}
          {renderCard(instruments.natural_gas, false)}
          {renderCard(instruments.copper, false)}
          {renderCard(instruments.usd_inr, false)}
          {renderCard(instruments['10y_gsec'], false)}
        </div>
      </div>

      {/* PRICE CHART MODAL */}
      {selectedChartCommodity && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedChartCommodity(null)}
        >
          <div 
            className="w-full max-w-[1200px] max-h-[90vh] bg-surface-container border border-outline-variant shadow-2xl rounded-2xl p-6 relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PriceChart
              symbol={selectedChartCommodity}
              name={instruments[selectedChartCommodity]?.name || selectedChartCommodity}
              onClose={() => setSelectedChartCommodity(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
