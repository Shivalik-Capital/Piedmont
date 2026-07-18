'use client';

import { useEffect, useState, useCallback } from 'react';
import PriceChart from './components/PriceChart';

interface IndexData {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  change_pct: number;
  previous_close: number;
}

interface MarketResponse {
  indices: Record<string, IndexData>;
  meta: { source: string; fetched_at: string; timezone: string };
}

interface SectorResponse {
  sectors: Record<string, IndexData>;
  meta: { source: string; fetched_at: string; timezone: string };
}

interface CommodityResponse {
  commodities: Record<string, IndexData>;
  meta: { source: string; fetched_at: string; timezone: string };
}

interface MacroIndicator {
  name: string;
  value: string;
  trend: string;
}

interface MacroResponse {
  indicators: Record<string, MacroIndicator>;
  meta: { source: string; fetched_at: string; timezone: string };
}

interface SelectedIndex {
  symbol: string;
  name: string;
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
    </span>
  );
}

function IndexCard({ data, onClick }: { data: IndexData; onClick: () => void }) {
  const isPositive = data.change >= 0;
  return (
    <div
      onClick={onClick}
      className="bg-[#0F1520] border border-[#1C2840] rounded-lg p-5 flex flex-col gap-3 hover:border-blue-500/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
            {data.exchange} / {data.symbol}
          </p>
          <p className="text-sm font-semibold text-slate-200">{data.name}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${isPositive ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(data.change_pct)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-100 tabular-nums">
        {data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <div className="flex items-center justify-between text-xs tabular-nums">
        <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
          {isPositive ? '+' : ''}{data.change.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-slate-600">
          Prev {data.previous_close.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      <p className="text-[10px] text-slate-600">Click to view chart</p>
    </div>
  );
}

function SectorCard({ data }: { data: IndexData }) {
  const isPositive = data.change >= 0;
  return (
    <div className="bg-[#0F1520] border border-[#1C2840] rounded-lg px-4 py-3 flex items-center justify-between hover:border-[#2A3F60] transition-colors">
      <div>
        <p className="text-xs font-medium text-slate-300">{data.name}</p>
        <p className="text-sm font-bold text-slate-100 tabular-nums mt-0.5">
          {data.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'}
        </p>
      </div>
      <span className={`text-xs font-semibold tabular-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{data.change_pct}%
      </span>
    </div>
  );
}

function CommodityCard({ data }: { data: IndexData }) {
  const isPositive = data.change >= 0;
  return (
    <div className="bg-[#0F1520] border border-[#1C2840] rounded-lg px-4 py-3 flex items-center justify-between hover:border-[#2A3F60] transition-colors">
      <div>
        <p className="text-xs font-medium text-slate-300">{data.name}</p>
        <p className="text-sm font-bold text-amber-400 tabular-nums mt-0.5">
          {data.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '—'}
        </p>
      </div>
      <span className={`text-xs font-semibold tabular-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{data.change_pct}%
      </span>
    </div>
  );
}

function MacroCard({ data }: { data: MacroIndicator }) {
  const trendColor = data.trend === 'Up' ? 'text-emerald-400' : data.trend === 'Down' ? 'text-red-400' : 'text-slate-400';
  return (
    <div className="bg-[#0F1520] border border-[#1C2840] rounded-lg px-4 py-3 flex items-center justify-between hover:border-[#2A3F60] transition-colors">
      <p className="text-xs font-medium text-slate-300">{data.name}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-slate-100 tabular-nums">
          {data.value}
        </p>
        <span className={`text-xs ${trendColor}`}>
          {data.trend === 'Up' ? '▲' : data.trend === 'Down' ? '▼' : '▬'}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [market, setMarket] = useState<MarketResponse | null>(null);
  const [sectors, setSectors] = useState<SectorResponse | null>(null);
  const [commodities, setCommodities] = useState<CommodityResponse | null>(null);
  const [macro, setMacro] = useState<MacroResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selected, setSelected] = useState<SelectedIndex | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchAll = useCallback(() => {
    Promise.all([
      fetch(API + '/api/market/indices').then(r => r.json()),
      fetch(API + '/api/market/sectors').then(r => r.json()),
      fetch(API + '/api/market/commodities').then(r => r.json()),
      fetch(API + '/api/market/macro').then(r => r.json()),
    ]).then(([marketData, sectorData, commodityData, macroData]) => {
      setMarket(marketData);
      setSectors(sectorData);
      setCommodities(commodityData);
      setMacro(macroData);
      setLastUpdated(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
      }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [API]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const indices = market ? Object.values(market.indices) : [];
  const sectorList = sectors ? Object.values(sectors.sectors) : [];
  const commodityList = commodities ? Object.values(commodities.commodities) : [];
  const macroIndicators = macro?.indicators || {};

  const rbiRates = ['rbi_repo', 'reverse_repo', 'sdf'].map(k => macroIndicators[k]).filter(Boolean);
  const domesticMacro = ['gdp', 'inflation', 'wpi', 'pmi', 'iip', 'fiscal_deficit'].map(k => macroIndicators[k]).filter(Boolean);
  const externalSector = ['forex', 'current_account', 'fii_flows', 'dii_flows'].map(k => macroIndicators[k]).filter(Boolean);
  const calendars = ['borrowing_cal', 'econ_cal'].map(k => macroIndicators[k]).filter(Boolean);

  const handleIndexClick = (data: IndexData) => {
    const symbolToKey: Record<string, string> = {
      '^NSEI': 'nifty50',
      '^BSESN': 'sensex',
      '^NSEBANK': 'banknifty',
    };
    const key = symbolToKey[data.symbol] ?? data.symbol.replace('^', '').toLowerCase();
    setSelected({ symbol: key, name: data.name });
  };

  return (
    <div className="min-h-screen bg-[#080C14]">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      <nav className="border-b border-[#1C2840] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-black">P</span>
          </div>
          <div>
            <span className="text-sm font-bold text-slate-100 tracking-tight">Piedmont</span>
            <span className="text-xs text-slate-600 ml-2">Indian Financial Intelligence</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && <span className="text-xs text-slate-600">{lastUpdated} IST</span>}
          <div className="flex items-center gap-1.5 bg-blue-950 border border-blue-900 rounded px-2 py-1">
            <LiveDot />
            <span className="text-xs text-blue-400 font-medium">LIVE</span>
          </div>
        </div>
      </nav>

      <main className="px-8 py-8 max-w-6xl mx-auto space-y-10">
        {loading && (
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-3 h-3 border border-slate-600 border-t-blue-400 rounded-full animate-spin" />
            <span className="text-sm">Fetching market data...</span>
          </div>
        )}

        {indices.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Major Indices</h2>
              <div className="flex-1 h-[1px] bg-[#1C2840]" />
              <span className="text-xs text-slate-600">{market?.meta.fetched_at}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {indices.map(index => (
                <IndexCard
                  key={index.symbol}
                  data={index}
                  onClick={() => handleIndexClick(index)}
                />
              ))}
            </div>
          </section>
        )}

        {sectorList.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Sector Performance</h2>
              <div className="flex-1 h-[1px] bg-[#1C2840]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sectorList.map(sector => (
                <SectorCard key={sector.symbol} data={sector} />
              ))}
            </div>
          </section>
        )}

        {commodityList.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Commodities, Forex & Bonds</h2>
              <div className="flex-1 h-[1px] bg-[#1C2840]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commodityList.map(commodity => (
                <CommodityCard key={commodity.symbol} data={commodity} />
              ))}
            </div>
          </section>
        )}

        {Object.keys(macroIndicators).length > 0 && (
          <section className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Central Bank & Rates</h2>
                <div className="flex-1 h-[1px] bg-[#1C2840]" />
                <span className="text-xs text-slate-600">RBI</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {rbiRates.map((indicator, idx) => (
                  <MacroCard key={idx} data={indicator} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Domestic Macro Economy</h2>
                <div className="flex-1 h-[1px] bg-[#1C2840]" />
                <span className="text-xs text-slate-600">World Bank / Static</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {domesticMacro.map((indicator, idx) => (
                  <MacroCard key={idx} data={indicator} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">External Sector & Flows</h2>
                <div className="flex-1 h-[1px] bg-[#1C2840]" />
                <span className="text-xs text-slate-600">World Bank / Static</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {externalSector.map((indicator, idx) => (
                  <MacroCard key={idx} data={indicator} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Calendars & Events</h2>
                <div className="flex-1 h-[1px] bg-[#1C2840]" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {calendars.map((indicator, idx) => (
                  <MacroCard key={idx} data={indicator} />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="border-t border-[#1C2840] pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-700">Data via Yahoo Finance · 15-min delay · Not financial advice</span>
          <span className="text-xs text-slate-700">Piedmont V2</span>
        </div>
      </main>

      {selected && (
        <PriceChart
          symbol={selected.symbol}
          name={selected.name}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}