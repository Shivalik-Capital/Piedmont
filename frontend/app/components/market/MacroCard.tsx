import React from 'react';
import Icon from '../ui/Icon';
import { MacroIndicator } from '../../lib/market-helpers';

export default function MacroCard({ data, accent = 'primary' }: { data: MacroIndicator; accent?: string }) {
  const trendIcon = data.trend === 'Up' ? 'trending_up' : data.trend === 'Down' ? 'trending_down' : 'remove';
  const trendColor = data.trend === 'Up' ? 'text-positive' : data.trend === 'Down' ? 'text-negative' : 'text-on-surface-variant';
  const accentColor = accent === 'secondary' ? 'text-secondary' : accent === 'tertiary' ? 'text-[#d4d8fb]' : 'text-primary';

  return (
    <div className="glass-card p-5 rounded-2xl group flex flex-col justify-between">
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
  );
}
