'use client';

import React, { useState, useEffect } from 'react';
import Icon from '../components/ui/Icon';
import PriceChart from '../components/PriceChart';
import { ShimmerCard } from '../components/ui/Shimmer';

interface Commodity {
  name: string;
  price: number;
  change: number;
  change_pct: string;
  exchange: string;
  prefix: string;
}

interface CommoditiesData {
  commodities: Record<string, Commodity>;
  meta: {
    source: string;
    fetched_at: string;
  };
}

export default function CommoditiesPage() {
  const [data, setData] = useState<CommoditiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${baseUrl}/api/market/commodities`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return isNaN(date.getTime()) ? timeStr : date.toLocaleString();
    } catch {
      return timeStr;
    }
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-positive';
    if (change < 0) return 'text-negative';
    return 'text-on-surface-variant';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return 'trending_up';
    if (change < 0) return 'trending_down';
    return 'horizontal_rule';
  };

  if (loading) {
    return (
      <div className="p-gutter lg:p-margin min-h-screen bg-surface">
        <div className="flex flex-col gap-unit mb-gutter">
          <div className="h-10 w-64 bg-surface-container rounded-lg animate-pulse"></div>
          <div className="h-6 w-96 bg-surface-container rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-margin">
          <ShimmerCard />
          <ShimmerCard />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-gutter lg:p-margin min-h-screen bg-surface text-on-surface flex items-center justify-center">
        <p>Failed to load commodities data.</p>
      </div>
    );
  }

  const { commodities, meta } = data;

  const renderCard = (key: string, item: Commodity, isHero = false) => {
    return (
      <div
        key={key}
        className={`cursor-pointer transition-transform duration-200 hover:scale-[1.02] border border-outline-variant rounded-xl p-gutter ${
          isHero ? 'bg-surface-container-high' : 'bg-surface-container'
        }`}
        onClick={() => setSelectedCommodity(key)}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${isHero ? 'text-2xl font-serif' : 'text-lg font-bold'} text-on-surface`}>{item.name}</h3>
          <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-bold rounded-full">
            {item.exchange}
          </span>
        </div>
        
        <div className="mt-auto">
          <div className={`${isHero ? 'text-4xl' : 'text-2xl'} font-mono-data font-bold text-on-surface mb-2`}>
            {item.price != null ? `${item.prefix || ''}${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          </div>
          
          <div className={`flex items-center gap-1 font-mono-data text-sm font-medium ${getTrendColor(item.change)}`}>
            <Icon name={getTrendIcon(item.change)} className="w-4 h-4" />
            <span>
              {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.change > 0 ? '+' : ''}{item.change_pct}%)
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-gutter lg:p-margin min-h-screen bg-surface">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-gutter gap-4">
        <div>
          <h1 className="font-serif font-bold text-4xl text-on-surface mb-2">Commodities</h1>
          <p className="text-on-surface-variant">Global commodity prices, currency rates, and sovereign yields</p>
        </div>
        <div className="text-right text-sm text-on-surface-variant">
          <div className="flex items-center justify-end gap-1 mb-1">
            <Icon name="database" className="w-4 h-4" />
            <span>{meta.source}</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Icon name="schedule" className="w-4 h-4" />
            <span>{formatTime(meta.fetched_at)}</span>
          </div>
        </div>
      </div>

      {/* HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-margin">
        {commodities.gold && renderCard('gold', commodities.gold, true)}
        {commodities.crude_oil && renderCard('crude_oil', commodities.crude_oil, true)}
      </div>

      {/* ALL COMMODITIES */}
      <div>
        <h2 className="text-2xl font-serif text-on-surface mb-gutter">All Instruments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {Object.entries(commodities).map(([key, item]) => renderCard(key, item, false))}
        </div>
      </div>

      {/* PRICE CHART MODAL */}
      {selectedCommodity && (
        <PriceChart
          symbol={selectedCommodity}
          name={commodities[selectedCommodity]?.name || selectedCommodity}
          onClose={() => setSelectedCommodity(null)}
        />
      )}
    </div>
  );
}
