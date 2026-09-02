import React from 'react';
import Sparkline from '../ui/Sparkline';
import { ActiveDot } from '../ui/LivePulse';
import { getMarketStatus, IndexData } from '../../lib/market-helpers';

export default function SectorCard({ data, onClick }: { data: IndexData; onClick?: () => void }) {
  const isPositive = data.change >= 0;
  return (
    <div onClick={onClick} className={`glass-card p-4 rounded-xl flex items-center justify-between group ${onClick ? 'cursor-pointer hover:border-primary/40' : ''}`}>
      <div>
        <p className="text-on-surface font-semibold text-sm flex items-center">
          {data.name} <ActiveDot active={getMarketStatus(data.exchange)} />
        </p>
        <p className="text-on-surface-variant text-xs font-mono-data tabular-nums mt-0.5">
          {data.price ? (data.prefix || '') + data.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Sparkline positive={isPositive} color={isPositive ? '#34d399' : '#f87171'} />
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono-data ${isPositive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
          {data.change_pct != null ? `${isPositive ? '+' : ''}${data.change_pct}%` : '—'}
        </span>
      </div>
    </div>
  );
}
