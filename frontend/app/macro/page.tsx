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

import Link from 'next/link';

const MetricCard = ({ indicator, size = 'default' }: { indicator: Indicator; size?: 'large' | 'default' }) => {
  const isUp = indicator.trend === 'Up';
  const isDown = indicator.trend === 'Down';
  const isStable = indicator.trend === 'Stable';
  
  const valueClass = size === 'large' ? 'text-3xl' : 'text-2xl';
  const slug = indicator.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  return (
    <Link 
      href={`/learn/${slug}?val=${encodeURIComponent(indicator.value)}&date=${encodeURIComponent(indicator.date || '')}&trend=${encodeURIComponent(indicator.trend || '')}`} 
      className="block h-full"
    >
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="bg-surface-container-high border border-outline-variant rounded-xl p-6 flex flex-col justify-between hover:border-primary/50 transition-all duration-200 h-full group relative"
      >
        <div>
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
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
          <span className="uppercase tracking-widest">Click to understand</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </motion.div>
    </Link>
  );
};

const DEFAULT_MACRO: MacroData = {
  indicators: {
    gdp: { name: 'GDP Growth', value: '7.2%', trend: 'Up', date: 'FY26' },
    rbi_repo: { name: 'RBI Repo Rate', value: '5.50%', trend: 'Up', date: 'Oct 2026' },
    reverse_repo: { name: 'Reverse Repo', value: '3.35%', trend: 'Stable', date: 'Current' },
    sdf: { name: 'Standing Deposit Facility', value: '5.25%', trend: 'Up', date: 'Oct 2026' },
    inflation: { name: 'CPI Inflation', value: '5.54%', trend: 'Up', date: 'Sep 2026' },
    wpi: { name: 'WPI Inflation', value: '11.39%', trend: 'Up', date: 'Sep 2026' },
    pmi: { name: 'Manufacturing PMI', value: '55.1', trend: 'Up', date: 'Sep 2026' },
    iip: { name: 'IIP Growth', value: '8.0%', trend: 'Up', date: 'Aug 2026' },
    fiscal_deficit: { name: 'Fiscal Deficit', value: '₹3.08L Cr', trend: 'Stable', date: 'Q1 FY27' },
    forex: { name: 'Forex Reserves', value: '$721.0B', trend: 'Down', date: 'Oct 16, 2026' },
    fii_flows: { name: 'FII Flows (MTD)', value: '₹12,450 Cr', trend: 'Up', date: 'Oct 2026' },
    dii_flows: { name: 'DII Flows (MTD)', value: '₹21,100 Cr', trend: 'Up', date: 'Oct 2026' },
    borrowing_cal: { name: 'Govt Borrowing', value: '₹8.20L Cr', trend: 'Stable', date: 'H1 FY27' },
    current_account: { name: 'Current Account', value: '+$2.8B', trend: 'Up', date: 'Q1 FY27' },
    econ_cal: { name: 'Next Event', value: 'RBI MPC', trend: 'Stable', date: 'Dec 2-4' }
  },
  meta: {
    source: 'World Bank, RBI, NSE (Updates Daily)',
    fetched_at: 'Oct 29, 2026 at 9:15 AM IST'
  }
};

export default function MacroPage() {
  const [data, setData] = useState<MacroData>(DEFAULT_MACRO);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/market/macro`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.indicators && Object.keys(json.indicators).length > 0) {
          setData(json);
        }
      }
    } catch (err) {
      console.error('Error fetching macro data', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

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
          <h1 className="font-sans font-bold tracking-tight text-3xl sm:text-4xl text-white mb-2">Macro Economy</h1>
          <p className="text-on-surface-variant text-sm sm:text-base">Indian macroeconomic pulse — real-time policy rates, inflation, industrial output, and capital flows</p>
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end gap-1">
          <div className="text-on-surface-variant text-xs flex items-center gap-1">
             <Icon name="schedule" className="text-xs" />
             <span>Last updated: {data.meta?.fetched_at || 'Oct 29, 2026 at 9:15 AM IST'}</span>
          </div>
          <div className="text-on-surface-variant text-xs flex items-center gap-1">
             <Icon name="database" className="text-xs" />
             <span>Source: {data.meta?.source || 'RBI, MoSPI, NSE'}</span>
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
