import React from 'react';
import { ActiveDot } from '../ui/LivePulse';
import { getMarketStatus, IndexData } from '../../lib/market-helpers';

export default function CommodityCard({ data, onClick }: { data: IndexData; onClick?: () => void }) {
  const isPositive = data.change >= 0;
  return (
    <div onClick={onClick} className={`glass-card p-5 rounded-2xl ${onClick ? 'cursor-pointer hover:border-primary/40' : ''}`}>
      <div className="flex items-center text-on-surface-variant text-xs uppercase tracking-widest font-semibold mb-2">
        {data.name} <ActiveDot active={getMarketStatus(data.exchange)} />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold font-mono-data tabular-nums text-on-surface">
          {data.price ? (data.prefix || '') + data.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
        </p>
        <span className={`text-xs font-bold font-mono-data tabular-nums ${isPositive ? 'text-positive' : 'text-negative'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(data.change_pct)}%
        </span>
      </div>
    </div>
  );
}
