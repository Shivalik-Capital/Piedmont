"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "./components/ui/Icon";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white overflow-hidden font-sans selection:bg-[#479ffa]/30 selection:text-white">
      
      {/* Navbar - Dock Style */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="h-12 px-2 rounded-full bg-[#191919] border border-[#333333] shadow-[0_0_44px_rgba(0,0,0,0.8)] flex items-center gap-1">
          <Link href="/" className="px-4 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors gap-2">
            <img src="/icon.svg" className="w-5 h-5" alt="Piedmont" />
            <span className="font-semibold text-sm tracking-wide text-white">PIEDMONT</span>
          </Link>
          <div className="w-px h-4 bg-[#525252] mx-2" />
          <Link href="/dashboard" className="px-4 h-8 rounded-full flex items-center justify-center text-sm font-medium text-[#868f97] hover:text-white hover:border-b hover:border-[#479ffa] transition-all">Dashboard</Link>
          <Link href="/screener" className="px-4 h-8 rounded-full flex items-center justify-center text-sm font-medium text-[#868f97] hover:text-white hover:border-b hover:border-[#479ffa] transition-all">Screener</Link>
          <div className="w-px h-4 bg-[#525252] mx-2" />
          <Link href="/dashboard" className="ml-1 px-5 h-8 rounded-full bg-[#0b0b0b] text-white text-sm font-medium shadow-[0_1px_0_rgba(0,0,0,0.85),0_0_14px_rgba(255,255,255,0.25)] hover:shadow-[0_1px_0_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.4)] transition-shadow flex items-center justify-center">
            Enter Terminal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full"
        >
          <h1 className="text-[48px] md:text-[54px] font-bold text-white leading-[1.1] tracking-[-0.08em] mb-12">
            Institutional intelligence.<br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(97.13deg,#ffa16c_8.47%,#551b10_108.41%)]">
              For the Indian market.
            </span>
          </h1>
          
          {/* Main Product Showcase Card */}
          <div className="relative mx-auto w-full max-w-4xl rounded-[16px] bg-[#191919] p-2 md:p-4 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333]">
            {/* Top Bar inside mockup */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#333333] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#525252]" />
                <div className="w-3 h-3 rounded-full bg-[#525252]" />
                <div className="w-3 h-3 rounded-full bg-[#525252]" />
              </div>
              <div className="text-xs font-medium text-[#868f97] tracking-wider uppercase">Nifty 50 Terminal</div>
              <div className="flex items-center gap-2 text-[10px] uppercase text-[#4ebe96] font-medium px-2 py-1 bg-[#4ebe96]/10 rounded-full border border-[#4ebe96]/20">
                <ActiveDot /> Live Data
              </div>
            </div>

            {/* Inner Dashboard Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-left">
              
              {/* Ticker Cards */}
              <div className="col-span-1 space-y-4">
                <div className="bg-[#131313] rounded-xl p-5 border border-[#333333] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="text-[11px] text-[#868f97] font-medium uppercase tracking-wider mb-2">Reliance Ind.</div>
                  <div className="text-3xl font-bold text-white tracking-[-0.05em] mb-1">₹3,024.50</div>
                  <div className="text-xs font-medium text-[#4ebe96]">+1.24%</div>
                </div>
                <div className="bg-[#131313] rounded-xl p-5 border border-[#333333] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="text-[11px] text-[#868f97] font-medium uppercase tracking-wider mb-2">TCS</div>
                  <div className="text-3xl font-bold text-white tracking-[-0.05em] mb-1">₹4,102.15</div>
                  <div className="text-xs font-medium text-[#4ebe96]">+0.85%</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="col-span-1 md:col-span-2 bg-[#131313] rounded-xl p-5 border border-[#333333] shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[220px]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[11px] text-[#868f97] font-medium uppercase tracking-wider mb-2">Nifty 50 Index</div>
                    <div className="text-3xl font-bold text-white tracking-[-0.05em] mb-1">24,510.45</div>
                    <div className="text-xs font-medium text-[#4ebe96]">+110.20 (+0.45%)</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full border border-[#479ffa] text-white text-[10px] font-medium">1D</div>
                    <div className="px-3 py-1 rounded-full text-[#868f97] text-[10px] font-medium hover:text-white transition-colors cursor-pointer">1W</div>
                    <div className="px-3 py-1 rounded-full text-[#868f97] text-[10px] font-medium hover:text-white transition-colors cursor-pointer">1M</div>
                  </div>
                </div>
                {/* Abstract Line Chart */}
                <svg viewBox="0 0 400 100" className="w-full h-24 stroke-[#479ffa] fill-transparent stroke-[2px]">
                  <path d="M0,80 L40,75 L80,85 L120,50 L160,60 L200,30 L240,40 L280,10 L320,25 L360,15 L400,0" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0,80 L40,75 L80,85 L120,50 L160,60 L200,30 L240,40 L280,10 L320,25 L360,15 L400,0 L400,100 L0,100 Z" className="fill-[#479ffa]/10 stroke-none" />
                </svg>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-[42px] font-bold text-white tracking-[-0.05em] leading-[1.1] mb-4">
              Macro context. <br/>
              Micro precision.
            </h2>
            <p className="text-[14px] text-[#868f97] max-w-[400px] leading-[1.5]">
              Everything you need to navigate the Indian markets, from RBI rate decisions to 4-year corporate cash flows, in one seamless interface.
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0b0b0b] border border-[#cccccc] flex items-center justify-center hover:border-white cursor-pointer transition-colors">
              <Icon name="chevron_left" size={20} className="text-white" />
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0b0b0b] border border-[#cccccc] flex items-center justify-center hover:border-white cursor-pointer transition-colors">
              <Icon name="chevron_right" size={20} className="text-white" />
            </div>
          </div>
        </div>

        {/* 3-Up Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#191919] rounded-[16px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] flex flex-col"
          >
            <div className="h-40 bg-[#131313] rounded-[10px] mb-6 flex items-center justify-center border border-[#333333] relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(97.13deg,rgba(71,159,250,0.1)_0%,rgba(0,0,0,0)_100%)]" />
              <Icon name="monitoring" size={48} className="text-[#479ffa]" />
            </div>
            <h3 className="text-[18px] font-semibold text-white mb-2">Macroeconomic Dashboard</h3>
            <p className="text-[14px] text-[#868f97] leading-[1.5]">
              Track RBI policy rates, FII/DII liquidity flows, inflation (CPI/WPI), and industrial growth (IIP) in real-time.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#191919] rounded-[16px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] flex flex-col"
          >
            <div className="h-40 bg-[#131313] rounded-[10px] mb-6 flex items-center justify-center border border-[#333333] relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(97.13deg,rgba(78,190,150,0.1)_0%,rgba(0,0,0,0)_100%)]" />
              <Icon name="candlestick_chart" size={48} className="text-[#4ebe96]" />
            </div>
            <h3 className="text-[18px] font-semibold text-white mb-2">NIFTY 50 Screener</h3>
            <p className="text-[14px] text-[#868f97] leading-[1.5]">
              Filter top Indian equities by Market Cap, PE Ratio, ROE, and Dividend Yield using institutional-grade metrics.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#191919] rounded-[16px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] flex flex-col"
          >
            <div className="h-40 bg-[#131313] rounded-[10px] mb-6 flex items-center justify-center border border-[#333333] relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(97.13deg,rgba(255,161,108,0.1)_0%,rgba(0,0,0,0)_100%)]" />
              <Icon name="school" size={48} className="text-[#ffa16c]" />
            </div>
            <h3 className="text-[18px] font-semibold text-white mb-2">Contextual Education</h3>
            <p className="text-[14px] text-[#868f97] leading-[1.5]">
              Don't just look at data — understand it. Our proprietary Learn engine breaks down complex financial jargon tailored to the Indian context.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-[48px] font-bold text-white tracking-[-0.08em] leading-[1.1] mb-8">
          The Indian markets,<br />decoded.
        </h2>
        <Link href="/dashboard" className="px-8 h-12 rounded-full bg-[#0b0b0b] text-white text-[14px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.85),0_0_14px_rgba(255,255,255,0.25)] hover:shadow-[0_1px_0_rgba(0,0,0,0.85),0_0_24px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center w-max mx-auto">
          Open Terminal
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#333333] py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/icon.svg" className="w-5 h-5 opacity-50 grayscale" alt="Piedmont" />
          <span className="font-semibold text-[12px] tracking-wide text-[#868f97]">PIEDMONT</span>
        </div>
        <p className="text-[12px] text-[#525252]">© {new Date().getFullYear()} Piedmont Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
}

function ActiveDot() {
  return (
    <span className="relative flex h-2 w-2 mr-1">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ebe96] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ebe96]"></span>
    </span>
  );
}
