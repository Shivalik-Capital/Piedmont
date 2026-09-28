import React from 'react';
import Link from 'next/link';
import Icon from '../ui/Icon';
import { MacroIndicator } from '../../lib/market-helpers';

export default function MacroCard({ data, accent = 'primary' }: { data: MacroIndicator; accent?: string }) {
  const trendIcon = data.trend === 'Up' ? 'trending_up' : data.trend === 'Down' ? 'trending_down' : 'remove';
  const trendColor = data.trend === 'Up' ? 'text-positive' : data.trend === 'Down' ? 'text-negative' : 'text-on-surface-variant';
  const accentColor = accent === 'secondary' ? 'text-secondary' : accent === 'tertiary' ? 'text-[#d4d8fb]' : 'text-primary';

  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <Link href={`/macro`} className="block h-full">
      <div className="bg-surface-container rounded-2xl shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-outline-variant p-5 rounded-2xl group flex flex-col justify-between h-full hover:border-primary/50 transition-colors relative">
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-semibold">{data.name}</p>
            {data.date && <span className="bg-white/5 border border-white/10 text-on-surface-variant/80 text-[10px] px-2 py-0.5 rounded-md tracking-wider font-semibold">{data.date}</span>}
          </div>
          <div className="flex items-end justify-between">
            <p className={`text-2xl font-bold font-mono-data tabular-nums ${accentColor}`}>{data.value}</p>
            <span className={`${trendColor}`}>
              <Icon name={trendIcon} className="text-lg" />
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
          <span className="uppercase tracking-widest">View all macros</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
}
