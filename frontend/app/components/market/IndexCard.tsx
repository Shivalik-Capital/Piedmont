import React from 'react';
import Sparkline from '../ui/Sparkline';
import Icon from '../ui/Icon';
import { ActiveDot } from '../ui/LivePulse';
import { getMarketStatus, IndexData } from '../../lib/market-helpers';

export default function IndexCard({ data, onClick }: { data: IndexData; onClick: () => void }) {
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
    '^NSEI': '#0A84FF',
    '^BSESN': '#FFFFFF',
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
          <p className={`text-[32px] font-bold font-mono-data tabular-nums tracking-tight ${colorMap[data.symbol] || 'text-primary'}`}>
            {data.price != null ? `${data.prefix || ''}${data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          </p>
          <p className={`font-medium text-sm flex items-center gap-1 font-mono-data ${isPositive ? 'text-positive' : 'text-negative'}`}>
            <Icon name={isPositive ? 'arrow_upward' : 'arrow_downward'} className="text-xs" />
            {isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.change_pct}%)
          </p>
        </div>
        <Sparkline positive={isPositive} color={sparkColorMap[data.symbol] || '#0A84FF'} />
      </div>
    </div>
  );
}
