'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/ui/Icon';
import { ShimmerCard } from '../components/ui/Shimmer';

interface Indicator {
  name: string;
  value: string;
  trend: 'Up' | 'Down' | 'Stable';
  date: string;
}

interface MacroData {
  indicators: {
    gdp: Indicator;
    rbi_repo: Indicator;
    reverse_repo: Indicator;
    sdf: Indicator;
    inflation: Indicator;
    wpi: Indicator;
    pmi: Indicator;
    iip: Indicator;
    fiscal_deficit: Indicator;
    forex: Indicator;
    fii_flows: Indicator;
    dii_flows: Indicator;
    borrowing_cal: Indicator;
    current_account: Indicator;
    econ_cal: Indicator;
  };
  meta: {
    source: string;
    fetched_at: string;
  };
}

const MetricCard = ({ indicator, size = 'default' }: { indicator: Indicator; size?: 'large' | 'default' }) => {
  const isUp = indicator.trend === 'Up';
  const isDown = indicator.trend === 'Down';
  const isStable = indicator.trend === 'Stable';
  
  const valueClass = size === 'large' ? 'text-3xl' : 'text-2xl';
  
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="bg-surface-container-high border border-outline-variant rounded-xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-on-surface-variant font-medium">{indicator.name}</span>
        {isUp && <Icon name="arrow_drop_up" className="text-positive text-3xl" />}
        {isDown && <Icon name="arrow_drop_down" className="text-negative text-3xl" />}
        {isStable && <Icon name="remove" className="text-primary text-xl" />}
      </div>
      <div>
        <div className={`font-mono-data ${valueClass} text-on-surface mb-1`}>{indicator.value}</div>
        <div className="text-on-surface-variant text-sm">{indicator.date}</div>
      </div>
    </motion.div>
  );
};

export default function MacroPage() {
  const [data, setData] = useState<MacroData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/market/macro`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching macro data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-gutter max-w-7xl mx-auto flex flex-col gap-margin">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="h-10 w-64 bg-surface-container-high rounded animate-pulse mb-3"></div>
            <div className="h-6 w-96 max-w-full bg-surface-container-high rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-48 bg-surface-container-high rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse"></div>
          </div>
        </header>

        <div className="flex flex-col gap-margin">
          <section>
            <div className="h-6 w-40 bg-surface-container-high rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          </section>

          <section>
            <div className="h-6 w-48 bg-surface-container-high rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          </section>

          <section>
            <div className="h-6 w-64 bg-surface-container-high rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-gutter text-on-surface">Failed to load data</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="p-gutter max-w-7xl mx-auto flex flex-col gap-[32px]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-4xl text-on-surface mb-2">Macro Economy</h1>
          <p className="text-on-surface-variant text-lg">Indian macroeconomic pulse — real-time policy rates, inflation, industrial output, and capital flows</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <div className="text-on-surface-variant text-sm flex items-center gap-1">
             <Icon name="update" className="text-[18px]" />
             <span>Last updated: {data.meta.fetched_at}</span>
          </div>
          <div className="text-on-surface-variant text-sm flex items-center gap-1">
             <Icon name="source" className="text-[18px]" />
             <span>Source: {data.meta.source}</span>
          </div>
        </div>
      </header>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-[32px]">
        {/* RBI Policy Rates */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="shield" className="text-primary" />
            <h2 className="text-xl font-medium text-on-surface">RBI Policy Rates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <MetricCard indicator={data.indicators.rbi_repo} size="large" />
            <MetricCard indicator={data.indicators.reverse_repo} size="large" />
            <MetricCard indicator={data.indicators.sdf} size="large" />
          </div>
        </section>

        {/* Domestic Indicators */}
        <section>
          <h2 className="text-xl font-medium text-on-surface mb-4">Domestic Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <MetricCard indicator={data.indicators.gdp} />
            <MetricCard indicator={data.indicators.inflation} />
            <MetricCard indicator={data.indicators.wpi} />
            <MetricCard indicator={data.indicators.pmi} />
            <MetricCard indicator={data.indicators.iip} />
            <MetricCard indicator={data.indicators.fiscal_deficit} />
          </div>
        </section>

        {/* External & Liquidity */}
        <section>
          <h2 className="text-xl font-medium text-on-surface mb-4">External Sector & Market Liquidity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <MetricCard indicator={data.indicators.forex} />
            <MetricCard indicator={data.indicators.fii_flows} />
            <MetricCard indicator={data.indicators.dii_flows} />
            <MetricCard indicator={data.indicators.current_account} />
            <MetricCard indicator={data.indicators.borrowing_cal} />
            <MetricCard indicator={data.indicators.econ_cal} />
          </div>
        </section>
      </motion.div>
    </div>
  );
}
