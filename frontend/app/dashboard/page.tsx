'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import PriceChart from '../components/PriceChart';
import IndexCard from '../components/market/IndexCard';
import MacroCard from '../components/market/MacroCard';
import SectorCard from '../components/market/SectorCard';
import Icon from '../components/ui/Icon';
import { ShimmerCard, ShimmerText, ShimmerRow } from '../components/ui/Shimmer';
import { ActiveDot } from '../components/ui/LivePulse';
import { 
  MarketResponse, 
  SectorResponse, 
  CommodityResponse, 
  MacroResponse,
  getMarketStatus,
  IndexData
} from '../lib/market-helpers';

interface SelectedIndex {
  symbol: string;
  name: string;
}

const DEFAULT_MARKET: MarketResponse = {
  indices: {
    nifty50: { symbol: '^NSEI', name: 'Nifty 50', exchange: 'NSE', price: 24450.25, change: 112.4, change_pct: 0.46, previous_close: 24337.85 },
    sensex: { symbol: '^BSESN', name: 'Sensex', exchange: 'BSE', price: 80220.70, change: 360.2, change_pct: 0.45, previous_close: 79860.50 },
    banknifty: { symbol: '^NSEBANK', name: 'Bank Nifty', exchange: 'NSE', price: 52310.80, change: -45.1, change_pct: -0.09, previous_close: 52355.90 }
  },
  meta: { source: 'Yahoo Finance via yfinance', fetched_at: 'Oct 29, 2026 at 9:15 AM IST', timezone: 'IST' }
};

const DEFAULT_SECTORS: SectorResponse = {
  sectors: {
    nifty_it: { symbol: '^CNXIT', name: 'Nifty IT', exchange: 'NSE', price: 41850.5, change: 380.2, change_pct: 0.92, previous_close: 41470.3 },
    nifty_auto: { symbol: '^CNXAUTO', name: 'Nifty Auto', exchange: 'NSE', price: 25420.0, change: 185.0, change_pct: 0.73, previous_close: 25235.0 },
    nifty_pharma: { symbol: '^CNXPHARMA', name: 'Nifty Pharma', exchange: 'NSE', price: 22890.0, change: 95.5, change_pct: 0.42, previous_close: 22794.5 },
    nifty_fmcg: { symbol: '^CNXFMCG', name: 'Nifty FMCG', exchange: 'NSE', price: 59200.0, change: -110.0, change_pct: -0.19, previous_close: 59310.0 },
    nifty_metal: { symbol: '^CNXMETAL', name: 'Nifty Metal', exchange: 'NSE', price: 9680.0, change: 42.0, change_pct: 0.44, previous_close: 9638.0 },
    nifty_realty: { symbol: '^CNXREALTY', name: 'Nifty Realty', exchange: 'NSE', price: 1045.0, change: -8.5, change_pct: -0.81, previous_close: 1053.5 }
  },
  meta: { source: 'Yahoo Finance via yfinance', fetched_at: 'Oct 29, 2026 at 9:15 AM IST', timezone: 'IST' }
};

const DEFAULT_COMMODITIES: CommodityResponse = {
  commodities: {
    usd_inr: { symbol: 'INR=X', name: 'USD/INR', exchange: 'FOREX', price: 84.05, change: 0.08, change_pct: 0.10, previous_close: 83.97, prefix: '₹' },
    gold: { symbol: 'GC=F', name: 'Gold', exchange: 'COMEX', price: 2750.40, change: 12.8, change_pct: 0.47, previous_close: 2737.60, prefix: '$' },
    crude_oil: { symbol: 'CL=F', name: 'Crude Oil', exchange: 'NYMEX', price: 74.20, change: -0.85, change_pct: -1.13, previous_close: 75.05, prefix: '$' },
    '10y_gsec': { symbol: 'NIFTYGS10YR.NS', name: '10Y G-Sec Index', exchange: 'NSE', price: 6.82, change: -0.01, change_pct: -0.15, previous_close: 6.83, prefix: '' }
  },
  meta: { source: 'Yahoo Finance via yfinance', fetched_at: 'Oct 29, 2026 at 9:15 AM IST', timezone: 'IST' }
};

const DEFAULT_MACRO: MacroResponse = {
  indicators: {
    gdp: { name: 'GDP Growth', value: '7.2%', trend: 'Up', date: 'FY26' },
    rbi_repo: { name: 'RBI Repo Rate', value: '5.50%', trend: 'Up', date: 'Oct 2026' },
    reverse_repo: { name: 'Reverse Repo', value: '3.35%', trend: 'Stable', date: 'Current' },
    sdf: { name: 'Standing Deposit Facility', value: '5.25%', trend: 'Up', date: 'Oct 2026' },
    inflation: { name: 'CPI Inflation', value: '5.54%', trend: 'Up', date: 'Sep 2026' },
    wpi: { name: 'WPI Inflation', value: '11.39%', trend: 'Up', date: 'Sep 2026' },
    pmi: { name: 'Manufacturing PMI', value: '55.1', trend: 'Up', date: 'Sep 2026' },
    iip: { name: 'IIP Growth', value: '8.0%', trend: 'Up', date: 'Aug 2026' },
    fiscal_deficit: { name: 'Fiscal Deficit', value: '₹3.08L Cr', trend: 'Stable', date: 'Q1 FY27' },
    forex: { name: 'Forex Reserves', value: '$721.0B', trend: 'Down', date: 'Oct 16, 2026' },
    fii_flows: { name: 'FII Flows (MTD)', value: '₹12,450 Cr', trend: 'Up', date: 'Oct 2026' },
    dii_flows: { name: 'DII Flows (MTD)', value: '₹21,100 Cr', trend: 'Up', date: 'Oct 2026' },
    borrowing_cal: { name: 'Govt Borrowing', value: '₹8.20L Cr', trend: 'Stable', date: 'H1 FY27' },
    current_account: { name: 'Current Account', value: '+$2.8B', trend: 'Up', date: 'Q1 FY27' },
    econ_cal: { name: 'Next Event', value: 'RBI MPC', trend: 'Stable', date: 'Dec 2-4' }
  },
  meta: { source: 'World Bank, RBI, NSE (Updates Daily)', fetched_at: 'Oct 29, 2026 at 9:15 AM IST', timezone: 'IST' }
};

export default function Home() {
  const [market, setMarket] = useState<MarketResponse>(DEFAULT_MARKET);
  const [sectors, setSectors] = useState<SectorResponse>(DEFAULT_SECTORS);
  const [commodities, setCommodities] = useState<CommodityResponse>(DEFAULT_COMMODITIES);
  const [macro, setMacro] = useState<MacroResponse>(DEFAULT_MACRO);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectedIndex | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const fetchAll = useCallback(() => {
    Promise.all([
      fetch(API + '/api/market/indices').then(r => r.ok ? r.json() : null),
      fetch(API + '/api/market/sectors').then(r => r.ok ? r.json() : null),
      fetch(API + '/api/market/commodities').then(r => r.ok ? r.json() : null),
      fetch(API + '/api/market/macro').then(r => r.ok ? r.json() : null),
    ]).then(([marketData, sectorData, commodityData, macroData]) => {
      if (marketData && marketData.indices) setMarket(marketData);
      if (sectorData && sectorData.sectors) setSectors(sectorData);
      if (commodityData && commodityData.commodities) setCommodities(commodityData);
      if (macroData && macroData.indicators) setMacro(macroData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [API]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const indices = market ? Object.entries(market.indices).map(([id, val]) => ({ ...val, id })) : [];
  const sectorList = sectors ? Object.entries(sectors.sectors).map(([id, val]) => ({ ...val, id })) : [];
  const commodityList = commodities ? Object.entries(commodities.commodities).map(([id, val]) => ({ ...val, id })) : [];
  const macroIndicators = macro?.indicators || {};

  // Group macro indicators
  const rbiRates = ['rbi_repo', 'reverse_repo', 'sdf'].map(k => macroIndicators[k]).filter(Boolean);
  const domesticMacro = ['gdp', 'inflation', 'wpi', 'pmi', 'iip', 'fiscal_deficit'].map(k => macroIndicators[k]).filter(Boolean);
  const externalLiquidity = ['forex', 'fii_flows', 'dii_flows', 'current_account', 'borrowing_cal', 'econ_cal'].map(k => macroIndicators[k]).filter(Boolean);

  const handleIndexClick = (data: IndexData) => {
    if (data.id) {
      setSelected({ symbol: data.id, name: data.name });
    }
  };

  return (
    <div className="space-y-12 w-full max-w-[1440px] mx-auto">
      {/* Cinematic Radial Glows */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {loading ? (
        <div className="space-y-12">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <ShimmerText width="w-3/4" />
              <ShimmerText width="w-1/2" />
              <ShimmerText width="w-full" />
              <div className="flex gap-4 pt-4">
                <div className="h-14 w-40 bg-white/5 rounded-full" />
                <div className="h-14 w-40 bg-white/5 rounded-full" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-surface-container rounded-2xl shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-outline-variant rounded-3xl p-8 flex flex-col justify-between min-h-[400px]">
                <ShimmerText width="w-1/3" />
                <div className="space-y-4 flex-1 flex flex-col justify-center mt-6">
                  <ShimmerRow />
                  <ShimmerRow />
                  <ShimmerRow />
                </div>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </section>
        </div>
      ) : (
          <div className="max-w-[1400px] mx-auto space-y-margin">
            <h1 className="sr-only">Piedmont - Financial Data & Markets Dashboard</h1>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "Piedmont",
                  "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/screener?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                  }
                })
              }}
            />
            {/* Hero Section: Indices */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter animate-stagger-1">
              {indices.slice(0, 2).map((idx) => {
                const isPos = idx.change >= 0;
                return (
                  <div key={idx.symbol} onClick={() => handleIndexClick(idx)} className="bg-surface-container-high border border-outline-variant p-gutter rounded-xl group cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-unit">
                      <h2 className="font-semibold text-xl text-on-surface tracking-tighter">{idx.name}</h2>
                      <Icon name="monitoring" className="text-outline-variant group-hover:text-primary transition-colors" />
                    </div>
                    <div className="h-px bg-white/5 w-full mb-unit"></div>
                    <div className="flex justify-between items-end">
                      <span className="font-semibold text-3xl text-on-surface">{idx.price != null ? `${idx.prefix || ''}${idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}</span>
                      <div className="flex flex-col items-end">
                        <span className={`font-mono-data text-sm flex items-center gap-1 ${isPos ? 'text-positive' : 'text-negative'}`}>
                          <Icon name={isPos ? 'arrow_upward' : 'arrow_downward'} className="text-[14px]" />
                          {isPos ? '+' : ''}{idx.change.toFixed(2)}
                        </span>
                        <span className={`font-mono-data text-sm ${isPos ? 'text-positive' : 'text-negative'}`}>
                          ({isPos ? '+' : ''}{idx.change_pct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Other Indices Grid */}
            {indices.length > 2 && (
              <>
                <h3 className="font-mono-data text-xs text-on-surface-variant mb-unit uppercase tracking-widest">Global & Sectoral Indices</h3>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-margin animate-stagger-2">
                  {indices.slice(2).map(index => (
                    <IndexCard key={index.symbol} data={index} onClick={() => handleIndexClick(index)} />
                  ))}
                </section>
              </>
            )}

            {/* Sectors Grid */}
            {sectorList.length > 0 && (
              <>
                <h3 className="font-mono-data text-xs text-on-surface-variant mb-unit uppercase tracking-widest">Sectoral Performance</h3>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter mb-margin animate-stagger-2">
                  {sectorList.map((sector) => (
                    <SectorCard key={sector.id} data={sector} onClick={() => handleIndexClick(sector)} />
                  ))}
                </section>
              </>
            )}

            {/* Active Commodities Grid */}
            <h3 className="font-mono-data text-xs text-on-surface-variant mb-unit uppercase tracking-widest">Active Commodities</h3>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-margin animate-stagger-3">
              {commodityList.map((c) => {
                 const isPos = c.change >= 0;
                 return (
                  <div key={c.symbol} onClick={() => handleIndexClick(c)} className="bg-surface-container border border-outline-variant p-gutter rounded-xl group cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-unit">
                      <div className="flex items-center gap-unit">
                        <span className="font-semibold text-on-surface">{c.name}</span>
                        <span className="px-1 py-0.5 bg-surface-container-highest rounded-sm font-mono-data text-[10px] text-on-surface-variant">{c.exchange}</span>
                      </div>
                      <span className={`font-mono-data text-xs ${isPos ? 'text-positive' : 'text-negative'}`}>
                        {isPos ? '+' : ''}{c.change_pct}%
                      </span>
                    </div>
                    <div className="font-semibold text-2xl text-on-surface mb-gutter">{c.price != null ? `${c.prefix || ''}${c.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}</div>
                    <div className="h-px bg-white/5 w-full mb-gutter"></div>
                    <div className="grid grid-cols-2 gap-unit text-left">
                      <div>
                        <div className="font-mono-data text-[10px] text-on-surface-variant uppercase">Change</div>
                        <div className={`font-mono-data text-sm ${isPos ? 'text-positive' : 'text-negative'}`}>{isPos ? '+' : ''}{c.change.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                 );
              })}
            </section>
            
            {/* Macro Indicators — Full */}
            {rbiRates.length > 0 && (
              <>
                <h3 className="font-mono-data text-xs text-on-surface-variant mb-unit uppercase tracking-widest flex items-center gap-2">
                  <Icon name="account_balance" className="text-sm text-primary" />
                  RBI Policy Rates
                </h3>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter animate-stagger-4 mb-margin">
                  {rbiRates.map(m => (
                    <MacroCard key={m.name} data={m} />
                  ))}
                </section>
              </>
            )}

            {domesticMacro.length > 0 && (
              <>
                <h3 className="font-mono-data text-xs text-on-surface-variant mb-unit uppercase tracking-widest flex items-center gap-2">
                  <Icon name="trending_up" className="text-sm text-primary" />
                  Domestic Indicators
                </h3>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter animate-stagger-4 mb-margin">
                  {domesticMacro.map(m => (
                    <MacroCard key={m.name} data={m} />
                  ))}
                </section>
              </>
            )}

            {externalLiquidity.length > 0 && (
              <>
                <h3 className="font-mono-data text-xs text-on-surface-variant mb-unit uppercase tracking-widest flex items-center gap-2">
                  <Icon name="public" className="text-sm text-primary" />
                  External Sector & Liquidity
                </h3>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter animate-stagger-4 mb-margin">
                  {externalLiquidity.map(m => (
                    <MacroCard key={m.name} data={m} />
                  ))}
                </section>
              </>
            )}
          </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between mt-16 pb-8 animate-stagger-4 gap-4">
        <span className="text-xs text-on-surface-variant/60 text-center md:text-left">
          Data via Yahoo Finance, World Bank, NSE · Equities 15-min delay · Macro updates daily · Not financial advice
          <br/>
          <Link href="/legal/privacy" className="text-primary/60 hover:text-primary transition-colors underline mt-1 inline-block">Privacy Policy & Terms of Service</Link>
        </span>
        <span className="text-xs text-primary/60 font-bold tracking-widest">PIEDMONT V3.0</span>
      </div>

      {/* Price Chart Modal */}
      {selected && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div 
            className="w-full max-w-[1200px] max-h-[90vh] bg-surface-container border border-outline-variant shadow-2xl rounded-2xl p-6 relative overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PriceChart
              symbol={selected.symbol}
              name={selected.name}
              onClose={() => setSelected(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}