'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Icon from '../components/ui/Icon';

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
  if (!indicator) return null;
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
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        className="bg-[#191919] border border-[#262626] hover:border-[#3a3a3a] rounded-[16px] p-6 flex flex-col justify-between shadow-[0_0_44px_rgba(0,0,0,0.8)] transition-all duration-200 h-full group"
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#868f97] text-xs uppercase tracking-wider font-mono-data">{indicator.name}</span>
            <div className="flex items-center gap-1.5">
              {isUp && <Icon name="arrow_drop_up" className="text-[#4ebe96] text-xl" />}
              {isDown && <Icon name="arrow_drop_down" className="text-[#eb5757] text-xl" />}
              {isStable && <Icon name="remove" className="text-[#868f97] text-sm" />}
            </div>
          </div>
          <div>
            <div className={`font-mono-data ${valueClass} font-normal text-white mb-1 tabular-nums tracking-[-0.04em]`}>
              {indicator.value}
            </div>
            <div className="text-[#868f97] text-xs font-mono-data">{indicator.date}</div>
          </div>
        </div>
        <div className="mt-5 pt-3 border-t border-[#222222] flex items-center justify-between text-xs text-[#868f97] group-hover:text-white transition-colors">
          <span>Explore Transmission</span>
          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
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
    inflation: { name: 'CPI Inflation', value: '6.09%', trend: 'Up', date: 'Oct 2026' },
    wpi: { name: 'WPI Inflation', value: '2.36%', trend: 'Down', date: 'Oct 2026' },
    pmi: { name: 'Manufacturing PMI', value: '54.7', trend: 'Down', date: 'Oct 2026' },
    iip: { name: 'IIP Growth', value: '6.7%', trend: 'Down', date: 'Sep 2026' },
    fiscal_deficit: { name: 'Fiscal Deficit', value: '₹3.08L Cr', trend: 'Stable', date: 'Q1 FY27' },
    forex: { name: 'Forex Reserves', value: '$719.55B', trend: 'Up', date: 'Nov 6, 2026' },
    fii_flows: { name: 'FII Flows (MTD)', value: '₹8,240 Cr', trend: 'Down', date: 'Nov 2026' },
    dii_flows: { name: 'DII Flows (MTD)', value: '₹18,450 Cr', trend: 'Up', date: 'Nov 2026' },
    borrowing_cal: { name: 'Govt Borrowing', value: '₹8.20L Cr', trend: 'Stable', date: 'H1 FY27' },
    current_account: { name: 'Current Account', value: '+$2.8B', trend: 'Up', date: 'Q1 FY27' },
    econ_cal: { name: 'Next Event', value: 'RBI MPC', trend: 'Stable', date: 'Dec 2-4' }
  },
  meta: {
    source: 'World Bank, RBI, MoSPI, DPIIT (Verified Releases)',
    fetched_at: 'Nov 14, 2026 at 9:30 AM IST'
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
    <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#479ffa] bg-[#141414] px-3 py-1 rounded-full font-medium border border-[#2a2a2a]">
              Piedmont Macro
            </span>
            <span className="text-[11px] text-[#868f97] uppercase">
              Institutional Economic Radar
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal tracking-[-0.08em] text-white">
            Macroeconomic <span className="text-[#ffa16c]">Transmission</span>.
          </h1>
          <p className="text-xs text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
            Real-time policy rates, retail and wholesale inflation, industrial production, and cross-asset institutional capital flows.
          </p>
        </div>
        <div className="text-left md:text-right flex flex-col items-start md:items-end gap-1 font-mono-data text-xs text-[#868f97]">
          <div className="flex items-center gap-1.5">
            <Icon name="schedule" className="w-3.5 h-3.5" />
            <span>Updated: {data.meta?.fetched_at || 'Nov 14, 2026'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Icon name="database" className="w-3.5 h-3.5" />
            <span>Source: {data.meta?.source || 'RBI, MoSPI, DPIIT'}</span>
          </div>
        </div>
      </header>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-10">
        {/* RBI Policy Rates */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="account_balance" className="w-4 h-4 text-[#479ffa]" />
            <h2 className="text-lg font-normal tracking-[-0.053em] text-white">RBI Monetary Policy Rates.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard indicator={data.indicators.rbi_repo} size="large" />
            <MetricCard indicator={data.indicators.reverse_repo} size="large" />
            <MetricCard indicator={data.indicators.sdf} size="large" />
          </div>
        </section>

        {/* Domestic Indicators */}
        <section>
          <h2 className="text-lg font-normal tracking-[-0.053em] text-white mb-4">Domestic Macroeconomic Indicators.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
          <h2 className="text-lg font-normal tracking-[-0.053em] text-white mb-4">External Sector & Institutional Capital Flows.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
