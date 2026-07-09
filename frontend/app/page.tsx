'use client';

import { useEffect, useMemo, useState } from 'react';

interface IndexData {
  id: string;
  name: string;
  exchange: string;
  symbol: string;
  price: number;
  previous_close: number;
  change: number;
  change_pct: number;
}

interface MarketResponse {
  indices: {
    nifty50: IndexData;
    sensex: IndexData;
    banknifty: IndexData;
  };
  meta: {
    source: string;
    fetched_at: string;
    timezone: string;
  };
}

const API_BASE_URL = 'http://localhost:8000';

const indexOrder = ['nifty50', 'sensex', 'banknifty'] as const;

const nextModules = [
  'Sector indices',
  'Macro dashboard',
  'Company analytics',
  'Watchlists',
  'AI summaries',
];

function formatNumber(value: number) {
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function formatSigned(value: number) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function formatTimestamp(value?: string) {
  if (!value) {
    return 'Connecting...';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  }).format(new Date(value));
}

function ChangePill({ change, pct }: { change: number; pct: number }) {
  const isUp = change >= 0;

  return (
    <span
      className={`inline-flex min-h-8 items-center justify-center rounded-md border px-3 font-mono text-sm font-semibold tabular-nums ${
        isUp
          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
          : 'border-rose-400/30 bg-rose-400/10 text-rose-300'
      }`}
    >
      {formatSigned(change)} / {isUp ? '+' : ''}
      {pct.toFixed(2)}%
    </span>
  );
}

function LoadingPanel() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3" aria-label="Loading market data">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="h-52 animate-pulse rounded-lg border border-white/10 bg-white/[0.04] p-5"
        >
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-8 h-9 w-40 rounded bg-white/10" />
          <div className="mt-5 h-8 w-32 rounded bg-white/10" />
        </div>
      ))}
    </section>
  );
}

function IndexCard({ data }: { data: IndexData }) {
  const isUp = data.change >= 0;

  return (
    <article className="rounded-lg border border-white/10 bg-[#131929] p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase text-slate-500">
            {data.exchange} / {data.symbol}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{data.name}</h3>
        </div>
        <span
          className={`mt-1 h-2.5 w-2.5 rounded-full ${
            isUp ? 'bg-emerald-300' : 'bg-rose-300'
          }`}
          aria-label={isUp ? 'Index is up' : 'Index is down'}
        />
      </div>

      <p className="mt-7 font-mono text-4xl font-semibold tabular-nums text-white">
        {formatNumber(data.price)}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <ChangePill change={data.change} pct={data.change_pct} />
        <div className="text-right">
          <p className="font-mono text-sm text-slate-300">
            {formatNumber(data.previous_close)}
          </p>
          <p className="text-xs text-slate-500">Previous close</p>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [market, setMarket] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/market/indices`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Market API unavailable');
        }

        return res.json();
      })
      .then((data: MarketResponse) => {
        setMarket(data);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load market data');
        setLoading(false);
      });
  }, []);

  const indices = useMemo(
    () => (market ? indexOrder.map((key) => market.indices[key]) : []),
    [market],
  );

  const positiveCount = indices.filter((index) => index.change >= 0).length;
  const marketTone =
    indices.length === 0
      ? 'Pending'
      : positiveCount >= 2
        ? 'Positive'
        : positiveCount === 1
          ? 'Mixed'
          : 'Negative';

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0e1a] text-slate-100">
      <div className="h-1 w-full bg-amber-500" />
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-amber-400/40 bg-amber-400/10 text-lg font-black text-amber-300">
              P
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-normal text-white sm:text-3xl">
                Piedmont
              </h1>
              <p className="text-sm text-slate-400">Indian Financial Intelligence</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 sm:flex sm:items-center">
            <div className="flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-mono font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              LIVE
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-slate-300">
              {formatTimestamp(market?.meta.fetched_at)}
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-5 py-5 xl:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <section className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#131929] p-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-amber-300">
                  V1 Market Dashboard
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                  India indices at a glance
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Live index data for the first Piedmont release. Future market modules
                  will build on this API and interface foundation.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-mono text-xl font-semibold text-white">{indices.length || 3}</p>
                  <p className="text-xs text-slate-500">Indices</p>
                </div>
                <div>
                  <p
                    className={`font-mono text-xl font-semibold ${
                      marketTone === 'Negative' ? 'text-rose-300' : 'text-emerald-300'
                    }`}
                  >
                    {marketTone}
                  </p>
                  <p className="text-xs text-slate-500">Tone</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-semibold text-amber-300">IST</p>
                  <p className="text-xs text-slate-500">Session</p>
                </div>
              </div>
            </section>

            {loading && <LoadingPanel />}
            {error && (
              <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">
                {error}. Make sure the backend is running on port 8000.
              </div>
            )}

            {indices.length > 0 && (
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {indices.map((index) => (
                  <IndexCard key={index.id} data={index} />
                ))}
              </section>
            )}

            <section className="rounded-lg border border-white/10 bg-[#131929] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Coverage</h2>
                  <p className="text-sm text-slate-500">
                    V1 only shows markets backed by the current API response.
                  </p>
                </div>
                <span className="rounded-md border border-amber-400/30 px-3 py-1 font-mono text-xs text-amber-300">
                  Real data only
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                {indices.map((index) => (
                  <div key={index.id} className="rounded-md border border-white/10 bg-[#0a0e1a] p-4">
                    <p className="font-mono text-xs text-slate-500">{index.symbol}</p>
                    <p className="mt-1 font-semibold text-white">{index.name}</p>
                    <p className="mt-2 text-sm text-slate-400">{index.exchange}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-lg border border-white/10 bg-[#131929] p-5">
              <h2 className="text-lg font-semibold text-white">Data Status</h2>
              <div className="mt-5 space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <p className="text-sm text-slate-500">Source</p>
                  <p className="mt-1 font-mono text-sm text-slate-200">
                    {market?.meta.source || 'Waiting for backend'}
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <p className="text-sm text-slate-500">Last fetched</p>
                  <p className="mt-1 font-mono text-sm text-slate-200">
                    {formatTimestamp(market?.meta.fetched_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">API</p>
                  <p className="mt-1 font-mono text-sm text-slate-200">
                    /api/market/indices
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#131929] p-5">
              <h2 className="text-lg font-semibold text-white">Next Modules</h2>
              <div className="mt-5 space-y-3">
                {nextModules.map((module) => (
                  <div
                    key={module}
                    className="flex min-h-10 items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-300">{module}</span>
                    <span className="rounded border border-white/10 px-2 py-1 font-mono text-[11px] text-slate-500">
                      queued
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
