import React from 'react';
import Link from 'next/link';

interface MetricCardProps {
  label: string;
  value: string | number;
  explanation: string;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  metricKey?: string;
}

export default function MetricCard({ label, value, explanation, trend = 'neutral', prefix = '', metricKey }: MetricCardProps) {
  const trendColor = trend === 'up' ? 'text-positive' : trend === 'down' ? 'text-negative' : 'text-on-surface-variant';
  
  const CardContent = (
    <div className="glass-card p-5 rounded-2xl group flex flex-col justify-between h-full hover:border-primary/50 transition-colors cursor-pointer relative">
      <div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">{label}</p>
        <div className="overflow-hidden">
          <p className={`text-3xl font-bold font-mono-data tabular-nums truncate ${trendColor}`} title={`${prefix}${value}`}>
            {prefix}{value}
          </p>
          <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{explanation}</p>
        </div>
      </div>
      {metricKey && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
          <span className="uppercase tracking-widest">Click to understand</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      )}
    </div>
  );

  if (metricKey) {
    return <Link href={`/learn/${metricKey}`} className="block h-full">{CardContent}</Link>;
  }
  
  return CardContent;
}
