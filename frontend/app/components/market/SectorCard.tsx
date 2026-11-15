import React from 'react';
import Sparkline from '../ui/Sparkline';
import { ActiveDot } from '../ui/LivePulse';
import { getMarketStatus, IndexData } from '../../lib/market-helpers';

export default function SectorCard({ data, onClick }: { data: IndexData; onClick?: () => void }) {
  const isPositive = data.change >= 0;
  return (
    <div
      onClick={onClick}
      className={`bg-[#191919] rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#262626] p-4 flex items-center justify-between group transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#3a3a3a]' : ''
      }`}
    >
      <div>
        <p className="text-white font-normal tracking-[-0.03em] text-sm flex items-center gap-2">
          {data.name} <ActiveDot active={getMarketStatus(data.exchange)} />
        </p>
        <p className="text-[#868f97] text-xs font-mono-data tabular-nums mt-0.5">
          {data.price ? (data.prefix || '') + data.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Sparkline positive={isPositive} color={isPositive ? '#4ebe96' : '#eb5757'} />
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono-data tabular-nums border ${
            isPositive
              ? 'bg-[#4ebe96]/10 text-[#4ebe96] border-[#4ebe96]/20'
              : 'bg-[#eb5757]/10 text-[#eb5757] border-[#eb5757]/20'
          }`}
        >
          {data.change_pct != null ? `${isPositive ? '+' : ''}${data.change_pct}%` : '—'}
        </span>
      </div>
    </div>
  );
}
