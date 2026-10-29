'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Building2, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface MacroEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  institution: string;
  period: string;
  importance: 'High' | 'Medium' | 'Critical';
  expected?: string;
  previous?: string;
}

interface EarningsEvent {
  symbol: string;
  name: string;
  sector: string;
  reportingDate: string;
  status: 'Confirmed' | 'Estimated';
  quarter: string;
  marketCapFormatted: string;
}

interface IPOEvent {
  name: string;
  symbol: string;
  issueSizeCr: number;
  priceBand: string;
  openDate: string;
  closeDate: string;
  listingDate: string;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Listed';
  subscription: string;
}

const MACRO_SCHEDULE: MacroEvent[] = [
  {
    id: '1',
    date: 'Nov 12, 2026',
    time: '5:30 PM IST',
    event: 'CPI Consumer Price Inflation',
    institution: 'Ministry of Statistics & PI (MoSPI)',
    period: 'October 2026',
    importance: 'Critical',
    expected: '5.20%',
    previous: '5.54%'
  },
  {
    id: '2',
    date: 'Nov 12, 2026',
    time: '5:30 PM IST',
    event: 'Index of Industrial Production (IIP)',
    institution: 'MoSPI',
    period: 'September 2026',
    importance: 'High',
    expected: '6.8%',
    previous: '8.0%'
  },
  {
    id: '3',
    date: 'Nov 14, 2026',
    time: '12:00 PM IST',
    event: 'Wholesale Price Index (WPI) Inflation',
    institution: 'Ministry of Commerce & Industry',
    period: 'October 2026',
    importance: 'Medium',
    expected: '9.80%',
    previous: '11.39%'
  },
  {
    id: '4',
    date: 'Nov 30, 2026',
    time: '5:30 PM IST',
    event: 'India Gross Domestic Product (GDP) Q2',
    institution: 'National Statistical Office (NSO)',
    period: 'Q2 FY2026-27 (Jul - Sep)',
    importance: 'Critical',
    expected: '7.1%',
    previous: '6.7%'
  },
  {
    id: '5',
    date: 'Dec 02-04, 2026',
    time: '10:00 AM IST',
    event: 'RBI Monetary Policy Committee (MPC) Meeting',
    institution: 'Reserve Bank of India (RBI)',
    period: 'Bi-Monthly Policy Resolution',
    importance: 'Critical',
    expected: 'Pause / 5.50%',
    previous: '5.50%'
  },
  {
    id: '6',
    date: 'Dec 14, 2026',
    time: '5:30 PM IST',
    event: 'CPI Consumer Price Inflation',
    institution: 'MoSPI',
    period: 'November 2026',
    importance: 'Critical',
    expected: 'TBA',
    previous: '5.54%'
  },
  {
    id: '7',
    date: 'Feb 03-05, 2027',
    time: '10:00 AM IST',
    event: 'RBI Monetary Policy Committee (MPC) Meeting',
    institution: 'Reserve Bank of India',
    period: 'Q4 FY27 Policy Review',
    importance: 'Critical',
    expected: 'TBA',
    previous: '5.50%'
  }
];

const EARNINGS_SCHEDULE: EarningsEvent[] = [
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', reportingDate: 'Oct 10, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹14.2L Cr' },
  { symbol: 'INFY', name: 'Infosys Limited', sector: 'Technology', reportingDate: 'Oct 17, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹7.8L Cr' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Financials', reportingDate: 'Oct 19, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹12.9L Cr' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy & Retail', reportingDate: 'Oct 21, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹19.8L Cr' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Financials', reportingDate: 'Oct 24, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹8.9L Cr' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', reportingDate: 'Oct 28, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹9.6L Cr' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', reportingDate: 'Oct 30, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹5.1L Cr' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Automobile', reportingDate: 'Nov 04, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹3.4L Cr' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financials', reportingDate: 'Nov 08, 2026', status: 'Confirmed', quarter: 'Q2 FY27', marketCapFormatted: '₹7.2L Cr' },
];

const IPO_TRACKER: IPOEvent[] = [
  {
    name: 'Hyundai Motor India Ltd',
    symbol: 'HYUNDAI',
    issueSizeCr: 27870,
    priceBand: '₹1,865 - ₹1,960',
    openDate: 'Oct 15, 2026',
    closeDate: 'Oct 17, 2026',
    listingDate: 'Oct 22, 2026',
    status: 'Listed',
    subscription: '2.37x'
  },
  {
    name: 'Swiggy Limited',
    symbol: 'SWIGGY',
    issueSizeCr: 11327,
    priceBand: '₹371 - ₹390',
    openDate: 'Nov 06, 2026',
    closeDate: 'Nov 08, 2026',
    listingDate: 'Nov 13, 2026',
    status: 'Upcoming',
    subscription: 'TBA'
  },
  {
    name: 'NTPC Green Energy Ltd',
    symbol: 'NTPCGREEN',
    issueSizeCr: 10000,
    priceBand: '₹102 - ₹108',
    openDate: 'Nov 19, 2026',
    closeDate: 'Nov 22, 2026',
    listingDate: 'Nov 27, 2026',
    status: 'Upcoming',
    subscription: 'TBA'
  },
  {
    name: 'Waaree Energies Ltd',
    symbol: 'WAAREE',
    issueSizeCr: 4321,
    priceBand: '₹1,427 - ₹1,503',
    openDate: 'Oct 21, 2026',
    closeDate: 'Oct 23, 2026',
    listingDate: 'Oct 28, 2026',
    status: 'Listed',
    subscription: '76.34x'
  }
];

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<'macro' | 'earnings' | 'ipo'>('macro');

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* ─── PAGE HEADER ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#868f97]">Piedmont Terminal v5</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Calendar & Market Events</h1>
          <p className="text-[#868f97] text-xs sm:text-sm mt-1">
            Institutional schedule of sovereign economic releases, RBI policy announcements, quarterly corporate earnings, and IPO listings.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 bg-[#121212] p-1.5 rounded-xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('macro')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'macro'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            <CalendarIcon size={14} />
            <span>Economic Releases</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'earnings'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 size={14} />
            <span>Corporate Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab('ipo')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ipo'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-[#868f97] hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp size={14} />
            <span>IPO Tracker</span>
          </button>
        </div>
      </div>

      {/* ─── TAB: ECONOMIC RELEASES ──────────────────────────────────── */}
      {activeTab === 'macro' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#868f97]">
            <span>Upcoming Sovereign Macroeconomic Indicators (Q3-Q4 FY27)</span>
            <span className="font-mono">Timezone: Asia/Kolkata (IST)</span>
          </div>

          <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] text-[#868f97] uppercase tracking-wider">
                    <th className="py-3.5 pl-4 font-semibold">Date & Time</th>
                    <th className="py-3.5 px-4 font-semibold">Economic Event</th>
                    <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Publishing Authority</th>
                    <th className="py-3.5 px-4 font-semibold">Period</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Expected</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Prior</th>
                    <th className="py-3.5 pr-4 text-center font-semibold">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {MACRO_SCHEDULE.map(ev => (
                    <tr key={ev.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 pl-4 font-sans whitespace-nowrap">
                        <div className="font-semibold text-white">{ev.date}</div>
                        <div className="text-[11px] text-[#868f97] font-mono">{ev.time}</div>
                      </td>

                      <td className="py-4 px-4 font-sans font-medium text-white">
                        {ev.event}
                      </td>

                      <td className="py-4 px-4 text-white/60 font-sans text-xs hidden md:table-cell">
                        {ev.institution}
                      </td>

                      <td className="py-4 px-4 text-white/80 whitespace-nowrap">
                        {ev.period}
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-white">
                        {ev.expected}
                      </td>

                      <td className="py-4 px-4 text-right text-[#868f97]">
                        {ev.previous}
                      </td>

                      <td className="py-4 pr-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase font-sans ${
                          ev.importance === 'Critical' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : ev.importance === 'High'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {ev.importance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: EARNINGS CALENDAR ─────────────────────────────────── */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#868f97]">
            <span>Nifty 50 Corporate Financial Results (Q2 FY2026-27)</span>
            <span className="font-mono">Consolidated Audited Figures</span>
          </div>

          <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] text-[#868f97] uppercase tracking-wider">
                    <th className="py-3.5 pl-4 font-semibold">Company / Ticker</th>
                    <th className="py-3.5 px-4 font-semibold">Sector</th>
                    <th className="py-3.5 px-4 font-semibold">Financial Quarter</th>
                    <th className="py-3.5 px-4 font-semibold">Release Date</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Market Cap</th>
                    <th className="py-3.5 pr-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {EARNINGS_SCHEDULE.map(item => (
                    <tr key={item.symbol} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="py-4 pl-4 font-sans">
                        <Link href={`/equities/companies/${item.symbol}`} className="flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                          <span className="font-mono font-bold text-white text-sm">{item.symbol}</span>
                          <span className="text-xs text-[#868f97] hidden sm:inline">{item.name}</span>
                        </Link>
                      </td>

                      <td className="py-4 px-4 font-sans text-xs text-white/70">
                        {item.sector}
                      </td>

                      <td className="py-4 px-4 font-bold text-white">
                        {item.quarter}
                      </td>

                      <td className="py-4 px-4 text-white font-sans">
                        {item.reportingDate}
                      </td>

                      <td className="py-4 px-4 text-right text-white/80 font-bold">
                        {item.marketCapFormatted}
                      </td>

                      <td className="py-4 pr-4 text-center font-sans">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: IPO TRACKER ───────────────────────────────────────── */}
      {activeTab === 'ipo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#868f97]">
            <span>Indian Mainboard Public Offerings & Primary Market Tracker</span>
            <span className="font-mono">Source: BSE / NSE / SEBI</span>
          </div>

          <div className="bg-[#121212] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] text-[#868f97] uppercase tracking-wider">
                    <th className="py-3.5 pl-4 font-semibold">Issuer Company</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Issue Size</th>
                    <th className="py-3.5 px-4 font-semibold">Price Band</th>
                    <th className="py-3.5 px-4 font-semibold">Bid Period</th>
                    <th className="py-3.5 px-4 font-semibold">Listing Date</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Subscription</th>
                    <th className="py-3.5 pr-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  {IPO_TRACKER.map(ipo => (
                    <tr key={ipo.symbol} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 pl-4 font-sans">
                        <div className="font-semibold text-white">{ipo.name}</div>
                        <div className="text-[11px] text-[#868f97] font-mono">{ipo.symbol}</div>
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-white">
                        ₹{ipo.issueSizeCr.toLocaleString('en-IN')} Cr
                      </td>

                      <td className="py-4 px-4 text-white/80">
                        {ipo.priceBand}
                      </td>

                      <td className="py-4 px-4 text-white/70 font-sans text-xs">
                        {ipo.openDate} – {ipo.closeDate}
                      </td>

                      <td className="py-4 px-4 text-white font-sans text-xs">
                        {ipo.listingDate}
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-emerald-400">
                        {ipo.subscription}
                      </td>

                      <td className="py-4 pr-4 text-center font-sans">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          ipo.status === 'Listed' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : ipo.status === 'Open'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 text-white/70 border border-white/10'
                        }`}>
                          {ipo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
