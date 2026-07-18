'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceChartProps {
  symbol: string;
  name: string;
  onClose: () => void;
}

type ChartType = 'area' | 'candle';
type PeriodType = '1mo' | '3mo' | '6mo' | '1y';

export default function PriceChart({ symbol, name, onClose }: PriceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>('1mo');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [hoveredPrice, setHoveredPrice] = useState<{ price: number; change: number; date: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const r = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/api/market/history/' + symbol + '?period=' + period
      );
      if (!r.ok) throw new Error('Failed to load data');
      const res = await r.json();
      setData(res.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any;

    import('lightweight-charts').then((mod) => {
      if (!chartRef.current) return;

      const { createChart, ColorType, LineStyle, CrosshairMode } = mod;

      chart = createChart(chartRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#bacac5',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: 11,
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.04)', style: LineStyle.Dotted },
          horzLines: { color: 'rgba(255,255,255,0.04)', style: LineStyle.Dotted },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: 'rgba(87, 241, 219, 0.3)',
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: '#1b1f2e',
          },
          horzLine: {
            color: 'rgba(87, 241, 219, 0.3)',
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: '#1b1f2e',
          },
        },
        width: chartRef.current.clientWidth,
        height: 380,
        timeScale: {
          borderColor: 'rgba(255,255,255,0.06)',
          timeVisible: false,
          rightOffset: 5,
          barSpacing: 8,
        },
        rightPriceScale: {
          borderColor: 'rgba(255,255,255,0.06)',
          scaleMargins: { top: 0.1, bottom: 0.2 },
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: { mouseWheel: true, pinch: true },
      });

      const firstClose = data[0]?.close ?? 0;
      const lastClose = data[data.length - 1]?.close ?? 0;
      const isPositive = lastClose >= firstClose;
      const lineColor = isPositive ? '#57f1db' : '#f87171';
      const areaTop = isPositive ? 'rgba(87, 241, 219, 0.25)' : 'rgba(248, 113, 113, 0.25)';
      const areaBottom = isPositive ? 'rgba(87, 241, 219, 0.0)' : 'rgba(248, 113, 113, 0.0)';

      if (chartType === 'area') {
        const series = chart.addAreaSeries({
          lineColor,
          lineWidth: 2,
          topColor: areaTop,
          bottomColor: areaBottom,
          crosshairMarkerBackgroundColor: lineColor,
          crosshairMarkerRadius: 5,
          crosshairMarkerBorderColor: '#0f1321',
          crosshairMarkerBorderWidth: 2,
        });
        series.setData(data.map((d) => ({ time: d.date, value: d.close })));
      } else {
        const series = chart.addCandlestickSeries({
          upColor: '#57f1db',
          downColor: '#f87171',
          borderUpColor: '#57f1db',
          borderDownColor: '#f87171',
          wickUpColor: 'rgba(87, 241, 219, 0.6)',
          wickDownColor: 'rgba(248, 113, 113, 0.6)',
        });
        series.setData(
          data.map((d) => ({
            time: d.date,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }))
        );
      }

      // Volume histogram
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
        drawTicks: false,
      });

      volumeSeries.setData(
        data.map((d) => ({
          time: d.date,
          value: d.volume,
          color:
            d.close >= d.open
              ? 'rgba(87, 241, 219, 0.15)'
              : 'rgba(248, 113, 113, 0.15)',
        }))
      );

      // Crosshair move handler
      chart.subscribeCrosshairMove((param: { time?: string; seriesData?: Map<unknown, unknown> }) => {
        if (!param.time || !param.seriesData) {
          setHoveredPrice(null);
          return;
        }

        const values = Array.from(param.seriesData.values());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = values[0] as any;
        const price = val?.value ?? val?.close ?? 0;
        const change = firstClose > 0 ? ((price - firstClose) / firstClose) * 100 : 0;
        setHoveredPrice({ price, change, date: String(param.time) });
      });

      chart.timeScale().fitContent();

      // Resize
      const ro = new ResizeObserver(() => {
        if (chartRef.current) {
          chart.applyOptions({ width: chartRef.current.clientWidth });
        }
      });
      ro.observe(chartRef.current);

      return () => {
        ro.disconnect();
      };
    });

    return () => {
      if (chart) chart.remove();
    };
  }, [data, chartType]);

  // Computed stats
  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0;
  const firstPrice = data.length > 0 ? data[0].close : 0;
  const totalChange = currentPrice - firstPrice;
  const totalChangePct = firstPrice > 0 ? (totalChange / firstPrice) * 100 : 0;
  const isPositive = totalChange >= 0;
  const high = data.length > 0 ? Math.max(...data.map((d) => d.high)) : 0;
  const low = data.length > 0 ? Math.min(...data.map((d) => d.low)) : 0;
  const avgVolume = data.length > 0 ? data.reduce((a, d) => a + d.volume, 0) / data.length : 0;

  const periods: { key: PeriodType; label: string }[] = [
    { key: '1mo', label: '1M' },
    { key: '3mo', label: '3M' },
    { key: '6mo', label: '6M' },
    { key: '1y', label: '1Y' },
  ];

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-card rounded-3xl w-full max-w-4xl overflow-hidden animate-[slideUp_0.3s_ease-out] border-white/10">
        {/* ─── Header ─── */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-on-surface">{name}</h2>
                <span className="text-xs bg-white/5 text-on-surface-variant px-3 py-1 rounded-full uppercase tracking-widest font-semibold">
                  {symbol}
                </span>
              </div>

              {/* Live or Hovered Price */}
              {!loading && data.length > 0 && (
                <div className="flex items-baseline gap-3 mt-2">
                  <span className={`text-4xl font-bold tabular-nums ${isPositive ? 'text-primary' : 'text-negative'}`}>
                    {(hoveredPrice?.price ?? currentPrice).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className={`text-sm font-semibold tabular-nums ${(hoveredPrice ? hoveredPrice.change >= 0 : isPositive) ? 'text-positive' : 'text-negative'}`}>
                    {(hoveredPrice ? hoveredPrice.change >= 0 : isPositive) ? '▲' : '▼'}{' '}
                    {Math.abs(hoveredPrice?.change ?? totalChangePct).toFixed(2)}%
                  </span>
                  {hoveredPrice && (
                    <span className="text-xs text-on-surface-variant tabular-nums">
                      {hoveredPrice.date}
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:bg-white/10 hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* ─── Controls ─── */}
          <div className="flex items-center justify-between mt-6">
            {/* Period Selector */}
            <div className="flex gap-1 bg-white/5 rounded-full p-1">
              {periods.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`text-xs px-4 py-2 rounded-full font-semibold transition-all ${
                    period === p.key
                      ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(87,241,219,0.3)]'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chart Type Toggle */}
            <div className="flex gap-1 bg-white/5 rounded-full p-1">
              <button
                onClick={() => setChartType('area')}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-semibold transition-all ${
                  chartType === 'area'
                    ? 'bg-primary/20 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">area_chart</span>
                Area
              </button>
              <button
                onClick={() => setChartType('candle')}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-semibold transition-all ${
                  chartType === 'candle'
                    ? 'bg-primary/20 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm">candlestick_chart</span>
                Candle
              </button>
            </div>
          </div>
        </div>

        {/* ─── Chart Area ─── */}
        <div className="px-4">
          {loading ? (
            <div className="h-[380px] flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-on-surface-variant text-xs tracking-widest uppercase">Loading chart data...</span>
            </div>
          ) : error ? (
            <div className="h-[380px] flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-error text-3xl">error</span>
              <span className="text-error text-sm">{error}</span>
              <button
                onClick={fetchData}
                className="text-xs text-primary hover:text-primary-dim transition-colors underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div ref={chartRef} className="w-full h-[380px]" />
          )}
        </div>

        {/* ─── Stats Bar ─── */}
        {!loading && data.length > 0 && (
          <div className="px-8 py-5 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">Period High</p>
              <p className="text-sm font-bold text-positive tabular-nums">
                {high.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">Period Low</p>
              <p className="text-sm font-bold text-negative tabular-nums">
                {low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">Period Change</p>
              <p className={`text-sm font-bold tabular-nums ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? '+' : ''}{totalChange.toFixed(2)} ({totalChangePct.toFixed(2)}%)
              </p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">Avg Volume</p>
              <p className="text-sm font-bold text-on-surface tabular-nums">
                {avgVolume >= 1e6
                  ? (avgVolume / 1e6).toFixed(1) + 'M'
                  : avgVolume >= 1e3
                  ? (avgVolume / 1e3).toFixed(0) + 'K'
                  : avgVolume.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="px-8 pb-5">
          <p className="text-[10px] text-on-surface-variant/40 text-center">
            Scroll to zoom · Drag to pan · Hover for crosshair · Press Escape to close
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}