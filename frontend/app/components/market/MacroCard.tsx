import React from 'react';
import Link from 'next/link';
import Icon from '../ui/Icon';
import { MacroIndicator } from '../../lib/market-helpers';

export default function MacroCard({ data }: { data: MacroIndicator; accent?: string }) {
  const trendIcon = data.trend === 'Up' ? 'trending_up' : data.trend === 'Down' ? 'trending_down' : 'remove';
  const trendColor = data.trend === 'Up' ? 'text-[#4ebe96]' : data.trend === 'Down' ? 'text-[#eb5757]' : 'text-[#868f97]';

  return (
    <Link href="/macro" className="block h-full">
      <div className="bg-[#191919] rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#262626] hover:border-[#3a3a3a] p-5 group flex flex-col justify-between h-full transition-all duration-200">
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#868f97] text-[11px] uppercase tracking-wider font-mono-data">{data.name}</p>
            {data.date && (
              <span className="bg-[#141414] border border-[#262626] text-[#868f97] text-[10px] px-2.5 py-0.5 rounded-full font-mono-data">
                {data.date}
              </span>
            )}
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-normal tracking-[-0.04em] text-white font-mono-data tabular-nums">{data.value}</p>
            <span className={trendColor}>
              <Icon name={trendIcon} className="text-base" />
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between text-[11px] text-[#868f97] group-hover:text-white transition-colors">
          <span className="tracking-wide">Explore Transmission</span>
          <span className="text-[#868f97] group-hover:text-white transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
