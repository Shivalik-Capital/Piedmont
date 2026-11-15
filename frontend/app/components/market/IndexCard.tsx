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

  return (
    <div
      onClick={onClick}
      className="bg-[#191919] rounded-[16px] p-5 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#262626] hover:border-[#3a3a3a] flex flex-col justify-between cursor-pointer group transition-all duration-200 min-h-[170px]"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-normal tracking-[-0.053em] text-white flex items-center gap-2">
            {data.name} <ActiveDot active={getMarketStatus(data.exchange)} />
          </h3>
          <p className="text-[#868f97] text-xs font-mono-data mt-0.5">{data.exchange}</p>
        </div>
        <span className="text-[#868f97] group-hover:text-white bg-[#141414] border border-[#262626] p-2 rounded-full transition-colors">
          <Icon name={iconMap[data.symbol] || 'show_chart'} className="w-4 h-4" />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-normal text-white font-mono-data tabular-nums tracking-[-0.04em]">
            {data.price != null ? `${data.prefix || ''}${data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          </p>
          <p className={`text-xs flex items-center gap-1 font-mono-data mt-1 ${isPositive ? 'text-[#4ebe96]' : 'text-[#eb5757]'}`}>
            <Icon name={isPositive ? 'arrow_upward' : 'arrow_downward'} className="text-xs" />
            {isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.change_pct}%)
          </p>
        </div>
        <Sparkline positive={isPositive} color={isPositive ? '#4ebe96' : '#eb5757'} />
      </div>
    </div>
  );
}
