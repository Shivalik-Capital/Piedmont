'use client';

import { useEffect, useRef, useState } from 'react';

interface PricePoint {
  date: string;
  close: number;
}

interface PriceChartProps {
  symbol: string;
  name: string;
  onClose: () => void;
}

export default function PriceChart({ symbol, name, onClose }: PriceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1mo');

  useEffect(() => {
    setLoading(true);
    setData([]);
    fetch(`http://localhost:8000/api/market/history/${symbol}?period=${period}`)
      .then(r => r.json())
      .then(res => {
        setData(res.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [symbol, period]);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    let chart: any;

    import('lightweight-charts').then(({ createChart, ColorType, LineStyle }) => {
      if (!chartRef.current) return;

      chart = createChart(chartRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#0F1520' },
          textColor: '#94A3B8',
        },
        grid: {
          vertLines: { color: '#1C2840', style: LineStyle.Dotted },
          horzLines: { color: '#1C2840', style: LineStyle.Dotted },
        },
        width: chartRef.current.clientWidth,
        height: 300,
        timeScale: { borderColor: '#1C2840' },
        rightPriceScale: { borderColor: '#1C2840' },
      });

      const series = chart.addLineSeries({
        color: '#3B82F6',
        lineWidth: 2,
      });

      series.setData(
        data.map(d => ({ time: d.date, value: d.close }))
      );

      chart.timeScale().fitContent();
    });

    return () => {
      if (chart) chart.remove();
    };
  }, [data]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
      <div className="bg-[#0B1020] border border-[#1C2840] rounded-xl w-full max-w-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">{name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Price history</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {['1mo', '3mo', '6mo', '1y'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-xs px-2 py-1 rounded ${period === p ? 'bg-blue-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-200 text-lg leading-none ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-4 h-4 border border-slate-600 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={chartRef} className="w-full h-[300px]" />
        )}
      </div>
    </div>
  );
}