'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import PriceChart from './components/PriceChart';

/* ─── Types ─── */
interface IndexData {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  change_pct: number;
  previous_close: number;
  id?: string;
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

/* ─── Tab Types ─── */
type TabType = 'overview' | 'equities' | 'macro';

/* ─── Sparkline Component ─── */
function Sparkline({ positive, color = 'currentColor' }: { positive: boolean; color?: string }) {
  const path = positive
    ? 'M0 35 L 10 30 L 25 32 L 40 20 L 60 25 L 80 10 L 100 5'
    : 'M0 10 L 20 15 L 40 5 L 60 25 L 80 20 L 100 35';
  return (
    <svg className="w-24 h-12 sparkline-glow" viewBox="0 0 100 40" style={{ color }}>
      <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

/* ─── WebGL Background Component ─── */
function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 color1 = vec3(0.02, 0.03, 0.1);
  vec3 color2 = vec3(0.04, 0.06, 0.16);
  vec3 accent1 = vec3(0.17, 0.83, 0.75);
  vec3 accent2 = vec3(0.66, 0.33, 0.97);
  float mixFactor = 0.5 + 0.5 * sin(u_time * 0.2 + uv.x * 2.0 + uv.y * 3.0);
  vec3 base = mix(color1, color2, mixFactor);
  float glow1 = smoothstep(0.8, 0.2, distance(uv, vec2(0.8 + 0.2 * sin(u_time * 0.3), 0.2 + 0.1 * cos(u_time * 0.4))));
  float glow2 = smoothstep(0.7, 0.1, distance(uv, vec2(0.1 + 0.1 * cos(u_time * 0.5), 0.7 + 0.2 * sin(u_time * 0.3))));
  vec3 finalColor = base + (accent1 * glow1 * 0.1) + (accent2 * glow2 * 0.1);
  gl_FragColor = vec4(finalColor, 1.0);
}`;

    function createShader(glCtx: WebGLRenderingContext, type: number, src: string) {
      const s = glCtx.createShader(type)!;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      return s;
    }

    const glCtx = gl as WebGLRenderingContext;
    const prog = glCtx.createProgram()!;
    glCtx.attachShader(prog, createShader(glCtx, glCtx.VERTEX_SHADER, vs));
    glCtx.attachShader(prog, createShader(glCtx, glCtx.FRAGMENT_SHADER, fs));
    glCtx.linkProgram(prog);
    glCtx.useProgram(prog);

    const buf = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buf);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), glCtx.STATIC_DRAW);
    const pos = glCtx.getAttribLocation(prog, 'a_position');
    glCtx.enableVertexAttribArray(pos);
    glCtx.vertexAttribPointer(pos, 2, glCtx.FLOAT, false, 0, 0);

    const uTime = glCtx.getUniformLocation(prog, 'u_time');
    const uRes = glCtx.getUniformLocation(prog, 'u_resolution');

    let animId: number;
    function render(t: number) {
      if (!canvas) return;
      glCtx.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) glCtx.uniform1f(uTime, t * 0.001);
      if (uRes) glCtx.uniform2f(uRes, canvas.width, canvas.height);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40"
      style={{ display: 'block' }}
    />
  );
}

/* ─── Market Time Helpers ─── */
function getMarketStatus(exchange: string): boolean {
  const now = new Date();
  const day = now.getUTCDay();
  const time = now.getUTCHours() + now.getUTCMinutes() / 60;
  
  let timeIst = time + 5.5;
  let dayIst = day;
  if (timeIst >= 24) {
    timeIst -= 24;
    dayIst = (dayIst + 1) % 7;
  }
  
  if (dayIst === 0 || dayIst === 6) return false;
  
  if (exchange === 'NSE' || exchange === 'BSE') {
    return timeIst >= 9.25 && timeIst < 15.5; // 9:15 AM to 3:30 PM IST
  }
  // COMEX, NYMEX, FOREX, etc. (Approx 24/5)
  return true; 
}

function getGlobalSessionName(): { label: string; active: boolean } {
  const now = new Date();
  const day = now.getUTCDay();
  const time = now.getUTCHours() + now.getUTCMinutes() / 60;
  
  let timeIst = time + 5.5;
  let dayIst = day;
  if (timeIst >= 24) {
    timeIst -= 24;
    dayIst = (dayIst + 1) % 7;
  }
  
  if (dayIst === 0 || dayIst === 6) return { label: 'MARKETS: CLOSED', active: false };
  
  if (timeIst >= 9.25 && timeIst < 15.5) {
    return { label: 'INDIAN MARKET', active: true };
  } else if (timeIst >= 19 || timeIst < 2.5) {
    return { label: 'NEW YORK SESSION', active: true };
  } else if (timeIst >= 13.5 && timeIst < 19) {
    return { label: 'LONDON SESSION', active: true };
  } else if (timeIst >= 3.5 && timeIst < 9.25) {
    return { label: 'ASIAN SESSION', active: true };
  }
  return { label: 'GLOBAL MARKET', active: true };
}

function ActiveDot({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="relative flex h-2 w-2 ml-2 items-center justify-center">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
    </span>
  );
}

/* ─── Live Pulse Indicator ─── */
function LivePulse() {
  const [session, setSession] = useState<{label: string, active: boolean}>({ label: 'MARKET: ACTIVE', active: true });

  useEffect(() => {
    const update = () => setSession(getGlobalSessionName());
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!session.active) {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
        <span className="text-[12px] text-on-surface-variant uppercase tracking-[0.2em] font-semibold">
          {session.label}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary pulse-active" />
      </span>
      <span className="text-[12px] text-primary uppercase tracking-[0.2em] font-semibold">
        {session.label}
      </span>
    </div>
  );
}

/* ─── Material Icon Helper ─── */
function Icon({ name, className = '', filled = false }: { name: string; className?: string; filled?: boolean }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}

/* ─── Index Bento Card (Glassmorphic) ─── */
function IndexBentoCard({ data, onClick }: { data: IndexData; onClick: () => void }) {
  const isPositive = data.change >= 0;
  const iconMap: Record<string, string> = {
    '^NSEI': 'monitoring',
    '^BSESN': 'trending_up',
    '^NSEBANK': 'account_balance',
  };
  const colorMap: Record<string, string> = {
    '^NSEI': 'text-primary',
    '^BSESN': 'text-secondary',
    '^NSEBANK': 'text-[#d4d8fb]',
  };
  const sparkColorMap: Record<string, string> = {
    '^NSEI': '#57f1db',
    '^BSESN': '#ddb7ff',
    '^NSEBANK': '#d4d8fb',
  };

  return (
    <div
      onClick={onClick}
      className="glass-card p-6 rounded-3xl flex flex-col justify-between cursor-pointer group min-h-[180px]"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[22px] font-semibold text-on-surface flex items-center">
            {data.name} <ActiveDot active={getMarketStatus(data.exchange)} />
          </h3>
          <p className="text-on-surface-variant text-sm">{data.exchange}</p>
        </div>
        <span className={`${colorMap[data.symbol] || 'text-primary'} bg-white/5 p-2 rounded-xl`}>
          <Icon name={iconMap[data.symbol] || 'show_chart'} />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-[32px] font-bold tabular-nums tracking-tight ${colorMap[data.symbol] || 'text-primary'}`}>
            {data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`font-medium text-sm flex items-center gap-1 ${isPositive ? 'text-positive' : 'text-negative'}`}>
            <Icon name={isPositive ? 'arrow_upward' : 'arrow_downward'} className="text-xs" />
            {isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.change_pct}%)
          </p>
        </div>
        <Sparkline positive={isPositive} color={sparkColorMap[data.symbol] || '#57f1db'} />
      </div>
    </div>
  );
}

/* ─── Macro Glass Card ─── */
function MacroGlassCard({ data, accent = 'primary' }: { data: MacroIndicator; accent?: string }) {
  const trendIcon = data.trend === 'Up' ? 'trending_up' : data.trend === 'Down' ? 'trending_down' : 'remove';
  const trendColor = data.trend === 'Up' ? 'text-positive' : data.trend === 'Down' ? 'text-negative' : 'text-on-surface-variant';
  const accentColor = accent === 'secondary' ? 'text-secondary' : accent === 'tertiary' ? 'text-[#d4d8fb]' : 'text-primary';

  return (
    <div className="glass-card p-5 rounded-2xl group">
      <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-3">{data.name}</p>
      <div className="flex items-end justify-between">
        <p className={`text-2xl font-bold tabular-nums ${accentColor}`}>{data.value}</p>
        <span className={`${trendColor}`}>
          <Icon name={trendIcon} className="text-lg" />
        </span>
      </div>
    </div>
  );
}

/* ─── Sector Row Card ─── */
function SectorRowCard({ data, onClick }: { data: IndexData; onClick?: () => void }) {
  const isPositive = data.change >= 0;
  return (
    <div onClick={onClick} className={`glass-card p-4 rounded-xl flex items-center justify-between group ${onClick ? 'cursor-pointer hover:border-primary/40' : ''}`}>
      <div>
        <p className="text-on-surface font-semibold text-sm flex items-center">
          {data.name} <ActiveDot active={getMarketStatus(data.exchange)} />
        </p>
        <p className="text-on-surface-variant text-xs tabular-nums mt-0.5">
          {data.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? '—'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Sparkline positive={isPositive} color={isPositive ? '#34d399' : '#f87171'} />
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
          {isPositive ? '+' : ''}{data.change_pct}%
        </span>
      </div>
    </div>
  );
}

/* ─── Commodity Card ─── */
function CommodityGlassCard({ data, onClick }: { data: IndexData; onClick?: () => void }) {
  const isPositive = data.change >= 0;
  return (
    <div onClick={onClick} className={`glass-card p-5 rounded-2xl ${onClick ? 'cursor-pointer hover:border-primary/40' : ''}`}>
      <div className="flex items-center text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">
        {data.name} <ActiveDot active={getMarketStatus(data.exchange)} />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold tabular-nums text-on-surface">
          {data.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? '—'}
        </p>
        <span className={`text-xs font-bold tabular-nums ${isPositive ? 'text-positive' : 'text-negative'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(data.change_pct)}%
        </span>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Home() {
  const [market, setMarket] = useState<MarketResponse | null>(null);
  const [sectors, setSectors] = useState<SectorResponse | null>(null);
  const [commodities, setCommodities] = useState<CommodityResponse | null>(null);
  const [macro, setMacro] = useState<MacroResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setLastUpdated(new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);
  const [selected, setSelected] = useState<SelectedIndex | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

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

  const rbiRates = ['rbi_repo', 'reverse_repo', 'sdf'].map(k => macroIndicators[k]).filter(Boolean);
  const domesticMacro = ['gdp', 'inflation', 'wpi', 'pmi', 'iip', 'fiscal_deficit'].map(k => macroIndicators[k]).filter(Boolean);
  const externalSector = ['forex', 'current_account', 'fii_flows', 'dii_flows'].map(k => macroIndicators[k]).filter(Boolean);
  const calendars = ['borrowing_cal', 'econ_cal'].map(k => macroIndicators[k]).filter(Boolean);

  const handleIndexClick = (data: IndexData) => {
    if (data.id) {
      setSelected({ symbol: data.id, name: data.name });
    }
  };

  const tabs: { key: TabType; icon: string; label: string }[] = [
    { key: 'overview', icon: 'dashboard', label: 'Pulse' },
    { key: 'equities', icon: 'show_chart', label: 'Equities' },
    { key: 'macro', icon: 'language', label: 'Macro' },
  ];

  return (
    <div className="min-h-screen relative">
      {/* WebGL Animated Background */}
      <ShaderBackground />

      {/* Cinematic Radial Glows */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ─── Top App Bar ─── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(87,241,219,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-on-primary text-sm font-black">P</span>
          </div>
          <span className="text-[22px] tracking-tighter text-primary font-bold">PIEDMONT</span>
        </div>
        <nav className="hidden md:flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-medium transition-all duration-300 ${activeTab === tab.key ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-on-surface-variant tabular-nums hidden sm:inline">
              {lastUpdated} IST
            </span>
          )}
          <LivePulse />
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="relative z-10 pt-28 pb-32 px-8 max-w-[1440px] mx-auto">

        {loading && (
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-on-surface-variant text-sm tracking-widest uppercase">Loading intelligence...</span>
          </div>
        )}

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && !loading && (
          <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <h1 className="text-[48px] font-bold text-on-surface leading-[1.1] tracking-tight max-w-2xl">
                  Institutional Precision for{' '}
                  <span className="text-primary glow-text-teal">Indian Markets.</span>
                </h1>
                <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Experience real-time intelligence with cinematic fidelity. Piedmont delivers low-latency market signals across India&apos;s financial landscape.
                </p>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setActiveTab('equities')}
                    className="px-8 py-4 bg-primary text-on-primary rounded-full font-bold shadow-[0_0_20px_rgba(87,241,219,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(87,241,219,0.5)] transition-all"
                  >
                    Explore Equities
                  </button>
                  <button
                    onClick={() => setActiveTab('macro')}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-on-surface rounded-full font-bold hover:bg-white/10 transition-all"
                  >
                    View Macro
                  </button>
                </div>
              </div>

              {/* Volatility & Quick Stats */}
              <div className="lg:col-span-5 glass-card rounded-3xl p-8 flex flex-col justify-between min-h-[400px] border-primary/20">
                <h3 className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Market Snapshot</h3>
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  {indices.map((idx) => {
                    const isPos = idx.change >= 0;
                    return (
                      <div key={idx.symbol} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-on-surface font-semibold">{idx.name}</p>
                          <p className="text-on-surface-variant text-xs">{idx.exchange}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-on-surface font-bold tabular-nums">{idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                          <p className={`text-xs font-semibold tabular-nums ${isPos ? 'text-positive' : 'text-negative'}`}>
                            {isPos ? '+' : ''}{idx.change_pct}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4">
                  {commodityList.slice(0, 2).map((c) => (
                    <div key={c.symbol} onClick={() => handleIndexClick(c)} className="flex items-center gap-3 py-2 px-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-on-surface-variant text-xs flex items-center">
                        {c.name} <ActiveDot active={getMarketStatus(c.exchange)} />
                      </span>
                      <span className="text-primary font-bold tabular-nums">{c.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Index Bento Cards */}
            {indices.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indices.map(index => (
                  <IndexBentoCard key={index.symbol} data={index} onClick={() => handleIndexClick(index)} />
                ))}
              </section>
            )}

            {/* RBI Quick Glance */}
            {rbiRates.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="account_balance" className="text-primary" />
                  <h2 className="text-xl font-semibold text-on-surface">Central Bank & Rates</h2>
                  <span className="text-xs text-on-surface-variant ml-2 bg-white/5 px-3 py-1 rounded-full">RBI</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rbiRates.map((indicator, idx) => (
                    <MacroGlassCard key={idx} data={indicator} accent="primary" />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ─── EQUITIES TAB ─── */}
        {activeTab === 'equities' && !loading && (
          <div className="space-y-10 animate-[fadeIn_0.5s_ease-out]">
            {/* Index Cards */}
            {indices.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-primary mb-6">Major Indices</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {indices.map(index => (
                    <IndexBentoCard key={index.symbol} data={index} onClick={() => handleIndexClick(index)} />
                  ))}
                </div>
              </section>
            )}

            {/* Sector Performance */}
            {sectorList.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-primary">Sector Performance</h2>
                  <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sectorList.map(sector => (
                    <SectorRowCard key={sector.symbol} data={sector} onClick={() => handleIndexClick(sector)} />
                  ))}
                </div>
              </section>
            )}

            {/* Commodities */}
            {commodityList.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-secondary mb-6">Commodities, Forex & Bonds</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {commodityList.map(commodity => (
                    <CommodityGlassCard key={commodity.symbol} data={commodity} onClick={() => handleIndexClick(commodity)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ─── MACRO ECONOMY TAB ─── */}
        {activeTab === 'macro' && !loading && (
          <div className="space-y-10 animate-[fadeIn_0.5s_ease-out]">
            {/* Central Bank & Rates */}
            {rbiRates.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="account_balance" className="text-primary text-2xl" />
                  <h2 className="text-2xl font-semibold text-on-surface">Central Bank & Rates</h2>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">RBI</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rbiRates.map((indicator, idx) => (
                    <MacroGlassCard key={idx} data={indicator} accent="primary" />
                  ))}
                </div>
              </section>
            )}

            {/* Domestic Macro */}
            {domesticMacro.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="trending_up" className="text-secondary text-2xl" />
                  <h2 className="text-2xl font-semibold text-on-surface">Domestic Macro Economy</h2>
                  <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">World Bank / Static</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domesticMacro.map((indicator, idx) => (
                    <MacroGlassCard key={idx} data={indicator} accent="secondary" />
                  ))}
                </div>
              </section>
            )}

            {/* External Sector */}
            {externalSector.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="public" className="text-[#d4d8fb] text-2xl" />
                  <h2 className="text-2xl font-semibold text-on-surface">External Sector & Flows</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {externalSector.map((indicator, idx) => (
                    <MacroGlassCard key={idx} data={indicator} accent="tertiary" />
                  ))}
                </div>
              </section>
            )}

            {/* Calendars */}
            {calendars.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="calendar_month" className="text-primary text-2xl" />
                  <h2 className="text-2xl font-semibold text-on-surface">Calendars & Events</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {calendars.map((indicator, idx) => (
                    <MacroGlassCard key={idx} data={indicator} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/5 pt-6 flex items-center justify-between mt-16">
          <span className="text-xs text-on-surface-variant/60">
            Data via Yahoo Finance · World Bank · 15-min delay · Not financial advice
          </span>
          <span className="text-xs text-primary/60 font-bold tracking-widest">PIEDMONT V2.0</span>
        </div>
      </main>

      {/* ─── Floating Bottom Nav ─── */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-full bg-surface/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex justify-around items-center py-2 px-4 z-50">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary/10 text-primary scale-90 shadow-[0_0_15px_rgba(87,241,219,0.2)]'
                : 'text-on-surface-variant/60 hover:bg-white/5 hover:text-primary'
            }`}
          >
            <Icon name={tab.icon} filled={activeTab === tab.key} />
            <span className="text-[10px] font-bold mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Price Chart Modal */}
      {selected && (
        <PriceChart
          symbol={selected.symbol}
          name={selected.name}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Fade-in keyframe */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}