/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { IChartApi, ISeriesApi, Time, MouseEventParams } from 'lightweight-charts';

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
  onClose?: () => void;
}

type ChartType = 'Area' | 'Candlestick' | 'Line' | 'Bar';
type PeriodType = '1mo' | '3mo' | '6mo' | '1y' | '5y';

const calculateSMA = (data: PricePoint[], period: number) => {
  const result: any[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push({
      time: data[i].date,
      value: sum / period,
    });
  }
  return result;
};

export default function PriceChart({ symbol, name, onClose }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const sma20SeriesRef = useRef<ISeriesApi<any> | null>(null);
  const sma50SeriesRef = useRef<ISeriesApi<any> | null>(null);

  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<PeriodType>('1y');
  const [chartType, setChartType] = useState<ChartType>('Area');
  const [showSMA20, setShowSMA20] = useState(false);
  const [showSMA50, setShowSMA50] = useState(false);

  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: PricePoint } | null>(null);

  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData([]);
    setTooltip(null);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${API}/api/company/${symbol}/history?period=${period}`);
      if (!res.ok) throw new Error('Failed to load data');
      const json = await res.json();
      
      const chartData = json.data || [];
      const sorted = chartData.sort((a: PricePoint, b: PricePoint) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setData(sorted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === 'a') setChartType('Area');
      if (key === 'c') setChartType('Candlestick');
      if (key === '1') setPeriod('1mo');
      if (key === '2') setPeriod('3mo');
      if (key === '3') setPeriod('6mo');
      if (key === '4') setPeriod('1y');
      if (key === '5') setPeriod('5y');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    let chart = chartRef.current;
    let ColorType: any, LineStyle: any, CrosshairMode: any;
    
    import('lightweight-charts').then((mod) => {
      if (!chartContainerRef.current) return;
      
      const { createChart: create, ColorType: CT, LineStyle: LS, CrosshairMode: CM } = mod;
      ColorType = CT; LineStyle = LS; CrosshairMode = CM;

      if (!chart) {
        chart = create(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#A8A296',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12,
          },
          grid: {
            vertLines: { color: 'rgba(255,255,255,0.04)', style: LineStyle.Dotted },
            horzLines: { color: 'rgba(255,255,255,0.04)', style: LineStyle.Dotted },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              color: 'rgba(255, 255, 255, 0.2)',
              width: 1,
              style: LineStyle.Solid,
              labelBackgroundColor: '#1A1917',
            },
            horzLine: {
              color: 'rgba(255, 255, 255, 0.2)',
              width: 1,
              style: LineStyle.Solid,
              labelBackgroundColor: '#1A1917',
            },
          },
          width: chartContainerRef.current.clientWidth,
          height: 420,
          timeScale: {
            borderColor: 'rgba(255,255,255,0.1)',
            timeVisible: true,
          },
          rightPriceScale: {
            borderColor: 'rgba(255,255,255,0.1)',
            scaleMargins: { top: 0.1, bottom: 0.2 },
          },
        });
        chartRef.current = chart;

        const handleResize = () => {
          if (chartContainerRef.current && chartRef.current) {
            chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
          }
        };
        window.addEventListener('resize', handleResize);

        chart.subscribeCrosshairMove((param: MouseEventParams) => {
          if (!param.time || param.point === undefined || param.point.x < 0 || param.point.y < 0) {
            setTooltip(null);
            return;
          }
          const dateStr = param.time as string;
          const dataPoint = dataRef.current.find(d => d.date === dateStr);
          if (dataPoint) {
            setTooltip({ x: param.point.x, y: param.point.y, data: dataPoint });
          } else {
            setTooltip(null);
          }
        });
      }

      // Cleanup existing series safely
      if (mainSeriesRef.current) {
        try { chart.removeSeries(mainSeriesRef.current); } catch(e) {}
        mainSeriesRef.current = null;
      }
      if (volumeSeriesRef.current) {
        try { chart.removeSeries(volumeSeriesRef.current); } catch(e) {}
        volumeSeriesRef.current = null;
      }
      if (sma20SeriesRef.current) {
        try { chart.removeSeries(sma20SeriesRef.current); } catch(e) {}
        sma20SeriesRef.current = null;
      }
      if (sma50SeriesRef.current) {
        try { chart.removeSeries(sma50SeriesRef.current); } catch(e) {}
        sma50SeriesRef.current = null;
      }

      const firstClose = data[0]?.close ?? 0;
      const lastClose = data[data.length - 1]?.close ?? 0;
      const isPositive = lastClose >= firstClose;
      const upColor = '#32D74B';
      const downColor = '#FF453A';
      const lineColor = isPositive ? upColor : downColor;

      // Add main series
      if (chartType === 'Area') {
        const series = chart.addAreaSeries({
          lineColor,
          topColor: isPositive ? 'rgba(50, 215, 75, 0.2)' : 'rgba(255, 69, 58, 0.2)',
          bottomColor: 'rgba(0, 0, 0, 0)',
          lineWidth: 2,
        });
        series.setData(data.map((d) => ({ time: d.date as Time, value: d.close })));
        mainSeriesRef.current = series;
      } else if (chartType === 'Candlestick') {
        const series = chart.addCandlestickSeries({
          upColor,
          downColor,
          borderVisible: false,
          wickUpColor: upColor,
          wickDownColor: downColor,
        });
        series.setData(data.map((d) => ({ time: d.date as Time, open: d.open, high: d.high, low: d.low, close: d.close })));
        mainSeriesRef.current = series;
      } else if (chartType === 'Line') {
        const series = chart.addLineSeries({
          color: lineColor,
          lineWidth: 2,
        });
        series.setData(data.map((d) => ({ time: d.date as Time, value: d.close })));
        mainSeriesRef.current = series;
      } else if (chartType === 'Bar') {
        const series = chart.addBarSeries({
          upColor,
          downColor,
        });
        series.setData(data.map((d) => ({ time: d.date as Time, open: d.open, high: d.high, low: d.low, close: d.close })));
        mainSeriesRef.current = series;
      }

      // Add Volume
      const volSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      });
      volSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.85, bottom: 0 },
      });
      volSeries.setData(data.map(d => ({
        time: d.date as Time,
        value: d.volume,
        color: d.close >= d.open ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
      })));
      volumeSeriesRef.current = volSeries;

      // SMAs
      if (showSMA20) {
        const sma20 = chart.addLineSeries({ color: '#0A84FF', lineWidth: 1, crosshairMarkerVisible: false, priceScaleId: 'right' });
        sma20.setData(calculateSMA(data, 20));
        sma20SeriesRef.current = sma20;
      }
      if (showSMA50) {
        const sma50 = chart.addLineSeries({ color: '#FF9F0A', lineWidth: 1, crosshairMarkerVisible: false, priceScaleId: 'right' });
        sma50.setData(calculateSMA(data, 50));
        sma50SeriesRef.current = sma50;
      }

      chart.timeScale().fitContent();

    });

  }, [data, chartType, showSMA20, showSMA50]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    let high = -Infinity;
    let low = Infinity;
    let volumeSum = 0;
    for (const d of data) {
      if (d.high > high) high = d.high;
      if (d.low < low) low = d.low;
      volumeSum += d.volume;
    }
    const first = data[0].close;
    const last = data[data.length - 1].close;
    const change = last - first;
    const changePct = first > 0 ? (change / first) * 100 : 0;
    const avgVolume = volumeSum / data.length;
    const rangeProgress = high === low ? 100 : ((last - low) / (high - low)) * 100;

    return { high, low, change, changePct, avgVolume, rangeProgress };
  }, [data]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  const formatVol = (val: number) => new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(val);

  const periods: { key: PeriodType; label: string }[] = [
    { key: '1mo', label: '1M' },
    { key: '3mo', label: '3M' },
    { key: '6mo', label: '6M' },
    { key: '1y', label: '1Y' },
    { key: '5y', label: '5Y' },
  ];
  const chartTypes: ChartType[] = ['Area', 'Candlestick', 'Line', 'Bar'];

  return (
    <div className="w-full flex flex-col relative text-[#8E8E93]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold text-white">{name}</h2>
            <span className="text-sm px-2 py-0.5 rounded-md bg-white/5 uppercase tracking-widest">{symbol}</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono-data">
            {tooltip?.data ? (
              <>
                <span className="text-on-surface-variant">{tooltip.data.date}</span>
                <span className="text-on-surface-variant">O: <span className="text-white">{formatCurrency(tooltip.data.open)}</span></span>
                <span className="text-on-surface-variant">H: <span className="text-white">{formatCurrency(tooltip.data.high)}</span></span>
                <span className="text-on-surface-variant">L: <span className="text-white">{formatCurrency(tooltip.data.low)}</span></span>
                <span className="text-on-surface-variant">C: <span className="text-white">{formatCurrency(tooltip.data.close)}</span></span>
                <span className="text-on-surface-variant">V: <span className="text-white">{formatVol(tooltip.data.volume)}</span></span>
              </>
            ) : data.length > 0 ? (
              <>
                <span className="text-on-surface-variant">{data[data.length - 1].date}</span>
                <span className="text-on-surface-variant">O: <span className="text-white">{formatCurrency(data[data.length - 1].open)}</span></span>
                <span className="text-on-surface-variant">H: <span className="text-white">{formatCurrency(data[data.length - 1].high)}</span></span>
                <span className="text-on-surface-variant">L: <span className="text-white">{formatCurrency(data[data.length - 1].low)}</span></span>
                <span className="text-on-surface-variant">C: <span className="text-white">{formatCurrency(data[data.length - 1].close)}</span></span>
                <span className="text-on-surface-variant">V: <span className="text-white">{formatVol(data[data.length - 1].volume)}</span></span>
              </>
            ) : (
              <span className="text-on-surface-variant">Hover over the chart for OHLC values</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white/5 rounded-full p-0.5">
            {chartTypes.map(t => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  chartType === t ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex bg-white/5 rounded-full p-0.5">
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors uppercase ${
                  period === p.key ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                showSMA20 ? 'border-[#0A84FF] text-[#0A84FF] bg-[#0A84FF]/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                showSMA50 ? 'border-[#FF9F0A] text-[#FF9F0A] bg-[#FF9F0A]/10' : 'border-white/10 hover:border-white/20'
              }`}
            >
              SMA 50
            </button>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[420px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1C1C1E]/50 backdrop-blur-sm">
            <div className="w-6 h-6 border-2 border-[#8E8E93]/30 border-t-[#8E8E93] rounded-full animate-spin mb-3"></div>
            <span className="text-xs uppercase tracking-widest">Loading...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1C1C1E]/50 backdrop-blur-sm">
            <span className="text-[#FF453A] text-sm mb-2">{error}</span>
            <button onClick={fetchData} className="text-xs text-white underline">Retry</button>
          </div>
        )}
        
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>

      {/* Stats Bar */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-6 md:gap-8">
        {stats ? (
          <>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider mb-1">Period High</span>
              <span className="text-sm font-medium text-white font-mono-data tabular-nums">{formatCurrency(stats.high)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider mb-1">Period Low</span>
              <span className="text-sm font-medium text-white font-mono-data tabular-nums">{formatCurrency(stats.low)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider mb-1">Period Change</span>
              <span className={`text-sm font-medium font-mono-data tabular-nums ${stats.change >= 0 ? 'text-[#32D74B]' : 'text-[#FF453A]'}`}>
                {stats.change >= 0 ? '+' : ''}{formatCurrency(stats.change)} ({stats.change >= 0 ? '+' : ''}{stats.changePct.toFixed(2)}%)
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider mb-1">Avg Volume</span>
              <span className="text-sm font-medium text-white font-mono-data tabular-nums">{formatVol(stats.avgVolume)}</span>
            </div>
            <div className="flex flex-col flex-1 min-w-[200px] ml-auto">
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-wider">52W Range</span>
                <span className="text-[10px] uppercase tracking-wider text-white">{Math.max(0, Math.min(100, stats.rangeProgress)).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8E8E93] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, stats.rangeProgress))}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs">Loading statistics...</div>
        )}
      </div>
    </div>
  );
}