"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "./components/ui/Icon";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('piedmont_visited');
    const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    
    if (hasVisited || isStandalone) {
      router.replace('/dashboard');
    } else {
      localStorage.setItem('piedmont_visited', 'true');
      setMounted(true);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white overflow-hidden font-sans selection:bg-[#479ffa]/30 selection:text-white">
      
      {/* Navbar - Dock Style */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-auto max-w-fit">
        <div className="h-11 sm:h-12 px-2.5 sm:px-3 rounded-full bg-[#191919] border border-[#333333] shadow-[0_0_44px_rgba(0,0,0,0.8)] flex items-center justify-between sm:justify-start gap-1 sm:gap-2">
          <Link href="/" className="px-2.5 sm:px-3 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors gap-1.5 sm:gap-2 shrink-0">
            <img src="/icon.svg" className="w-4 h-4 sm:w-5 sm:h-5" alt="Piedmont" />
            <span className="font-semibold text-xs sm:text-sm tracking-wide text-white">PIEDMONT</span>
          </Link>
          <div className="hidden sm:block w-px h-4 bg-[#525252]" />
          <Link href="/dashboard" className="hidden sm:flex px-3 h-8 rounded-full items-center justify-center text-xs sm:text-sm font-medium text-[#868f97] hover:text-white transition-colors">Overview</Link>
          <Link href="/intelligence" className="hidden sm:flex px-3 h-8 rounded-full items-center justify-center text-xs sm:text-sm font-medium text-[#868f97] hover:text-white transition-colors">Signals</Link>
          <Link href="/replay" className="hidden sm:flex px-3 h-8 rounded-full items-center justify-center text-xs sm:text-sm font-medium text-[#868f97] hover:text-white transition-colors">Replay</Link>
          <Link href="/portfolio" className="hidden sm:flex px-3 h-8 rounded-full items-center justify-center text-xs sm:text-sm font-medium text-[#868f97] hover:text-white transition-colors">Portfolio</Link>
          <Link href="/screener" className="hidden sm:flex px-3 h-8 rounded-full items-center justify-center text-xs sm:text-sm font-medium text-[#868f97] hover:text-white transition-colors">Screener</Link>
          <Link href="/commodities" className="hidden sm:flex px-3 h-8 rounded-full items-center justify-center text-xs sm:text-sm font-medium text-[#868f97] hover:text-white transition-colors">Commodities</Link>
          <div className="w-px h-4 bg-[#525252] sm:mx-1" />
          <Link href="/dashboard" className="px-3 sm:px-5 h-7 sm:h-8 rounded-full bg-[#0b0b0b] text-white text-xs sm:text-sm font-medium shadow-[0_1px_0_rgba(0,0,0,0.85),0_0_14px_rgba(255,255,255,0.25)] hover:shadow-[0_1px_0_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.4)] transition-shadow flex items-center justify-center whitespace-nowrap">
            Enter Terminal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 md:pt-48 pb-28 px-6 flex flex-col items-center justify-center text-center max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#868f97] mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Piedmont V9 Institutional Research Terminal</span>
          </div>

          <h1 className="text-[44px] md:text-[58px] font-bold text-white leading-[1.08] tracking-[-0.07em] mb-10 max-w-4xl mx-auto">
            Institutional intelligence.<br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(97.13deg,#ffa16c_8.47%,#551b10_108.41%)]">
              For the Indian market.
            </span>
          </h1>
          
          {/* Main Product Showcase Card */}
          <div className="relative mx-auto w-full max-w-4xl rounded-[20px] bg-[#191919] p-2 md:p-4 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333]">
            {/* Top Bar inside mockup */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#333333] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#525252]" />
                <div className="w-3 h-3 rounded-full bg-[#525252]" />
                <div className="w-3 h-3 rounded-full bg-[#525252]" />
              </div>
              <div className="text-xs font-medium text-[#868f97] tracking-wider uppercase font-mono">NIFTY 50 REAL-TIME COCKPIT</div>
              <div className="flex items-center gap-2 text-[10px] uppercase text-[#4ebe96] font-medium px-2 py-1 bg-[#4ebe96]/10 rounded-full border border-[#4ebe96]/20">
                <ActiveDot /> Live Data
              </div>
            </div>

            {/* Inner Dashboard Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-left">
              
              {/* Ticker Cards */}
              <div className="col-span-1 space-y-4">
                <div className="bg-[#131313] rounded-xl p-5 border border-[#333333] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="text-[11px] text-[#868f97] font-medium uppercase tracking-wider mb-2 font-mono">Reliance Ind.</div>
                  <div className="text-3xl font-bold text-white tracking-[-0.05em] mb-1 font-mono-data tabular-nums">₹3,024.50</div>
                  <div className="text-xs font-medium text-[#4ebe96] font-mono-data">+1.24%</div>
                </div>
                <div className="bg-[#131313] rounded-xl p-5 border border-[#333333] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="text-[11px] text-[#868f97] font-medium uppercase tracking-wider mb-2 font-mono">TCS</div>
                  <div className="text-3xl font-bold text-white tracking-[-0.05em] mb-1 font-mono-data tabular-nums">₹4,102.15</div>
                  <div className="text-xs font-medium text-[#4ebe96] font-mono-data">+0.85%</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="col-span-1 md:col-span-2 bg-[#131313] rounded-xl p-5 border border-[#333333] shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[220px]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[11px] text-[#868f97] font-medium uppercase tracking-wider mb-2 font-mono">Nifty 50 Index</div>
                    <div className="text-3xl font-bold text-white tracking-[-0.05em] mb-1 font-mono-data tabular-nums">25,810.45</div>
                    <div className="text-xs font-medium text-[#4ebe96] font-mono-data">+110.20 (+0.43%)</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full border border-[#479ffa] text-white text-[10px] font-medium font-mono">1D</div>
                    <div className="px-3 py-1 rounded-full text-[#868f97] text-[10px] font-medium hover:text-white transition-colors cursor-pointer font-mono">1W</div>
                    <div className="px-3 py-1 rounded-full text-[#868f97] text-[10px] font-medium hover:text-white transition-colors cursor-pointer font-mono">1M</div>
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold mb-2">
              Comprehensive Platform Capabilities
            </div>
            <h2 className="text-[38px] md:text-[44px] font-bold text-white tracking-[-0.05em] leading-[1.1] mb-4">
              Macro context. <br/>
              Micro precision.
            </h2>
            <p className="text-[14px] text-[#868f97] max-w-[440px] leading-[1.5]">
              Everything you need to navigate the Indian markets, from RBI rate decisions to 4-year corporate cash flows, in one seamless interface.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TERMINAL V9 SUITE</span>
            </div>
            <Link 
              href="/dashboard"
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-white transition-all flex items-center gap-1.5 group"
            >
              <span>Explore All</span>
              <Icon name="arrow_right" size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3-Up Feature Grid with Institutional Previews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Macro Radar */}
          <Link href="/macro" className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#191919] rounded-[18px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] group-hover:border-[#479ffa]/50 transition-all flex flex-col h-full"
            >
              {/* Rich Mini Terminal Widget */}
              <div className="h-44 bg-[#111111] rounded-[12px] p-3.5 mb-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group-hover:border-[#479ffa]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#868f97]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/80 font-semibold">MoSPI · RBI MACRO RADAR</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">OCT 2026</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 my-2">
                  <div className="bg-[#181818] p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">RBI Repo Rate</div>
                    <div className="text-base font-bold font-mono text-white">5.50%</div>
                    <div className="text-[10px] text-[#4ebe96]">Neutral Stance</div>
                  </div>
                  <div className="bg-[#181818] p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">CPI Inflation</div>
                    <div className="text-base font-bold font-mono text-white">6.09%</div>
                    <div className="text-[10px] text-[#ffa16c]">Food Pressure</div>
                  </div>
                  <div className="bg-[#181818] p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">Forex Reserves</div>
                    <div className="text-base font-bold font-mono text-white">$719.5B</div>
                    <div className="text-[10px] text-[#4ebe96]">All-Time High</div>
                  </div>
                  <div className="bg-[#181818] p-2 rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">Mfg PMI</div>
                    <div className="text-base font-bold font-mono text-white">54.7</div>
                    <div className="text-[10px] text-[#4ebe96]">Expansionary</div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#479ffa] flex items-center justify-between">
                  <span>FII / DII Liquidity Surveillance</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">Launch Radar &rarr;</span>
                </div>
              </div>

              <h3 className="text-[18px] font-semibold text-white mb-2 flex items-center justify-between">
                <span>Macroeconomic Dashboard</span>
                <span className="text-xs text-[#479ffa] font-mono opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
              </h3>
              <p className="text-[14px] text-[#868f97] leading-[1.5]">
                Track RBI policy rates, FII/DII liquidity flows, inflation (CPI/WPI), and industrial growth (IIP) in real-time.
              </p>
            </motion.div>
          </Link>

          {/* Card 2: Screener */}
          <Link href="/screener" className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#191919] rounded-[18px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] group-hover:border-[#4ebe96]/50 transition-all flex flex-col h-full"
            >
              {/* Rich Mini Screener Widget */}
              <div className="h-44 bg-[#111111] rounded-[12px] p-3.5 mb-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group-hover:border-[#4ebe96]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#868f97]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ebe96]" />
                    <span className="text-white/80 font-semibold">NIFTY 50 SCREENER</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">INSTITUTIONAL</span>
                </div>
                
                <div className="space-y-1.5 my-1 text-[11px] font-mono">
                  <div className="flex items-center justify-between py-1 px-2 rounded bg-[#181818] border border-white/5">
                    <span className="font-bold text-white">RELIANCE</span>
                    <span className="text-white/70">₹3,024.50</span>
                    <span className="text-[#868f97]">P/E 24.2x</span>
                    <span className="text-[#4ebe96]">ROE 9.4%</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded bg-[#181818] border border-white/5">
                    <span className="font-bold text-white">TCS</span>
                    <span className="text-white/70">₹4,102.15</span>
                    <span className="text-[#868f97]">P/E 29.8x</span>
                    <span className="text-[#4ebe96]">ROE 51.2%</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded bg-[#181818] border border-white/5">
                    <span className="font-bold text-white">HDFCBANK</span>
                    <span className="text-white/70">₹1,742.80</span>
                    <span className="text-[#868f97]">P/E 19.5x</span>
                    <span className="text-[#4ebe96]">ROE 16.8%</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#4ebe96] flex items-center justify-between">
                  <span>DuPont 3-Stage ROE Analysis</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">Launch Screener &rarr;</span>
                </div>
              </div>

              <h3 className="text-[18px] font-semibold text-white mb-2 flex items-center justify-between">
                <span>NIFTY 50 Screener</span>
                <span className="text-xs text-[#4ebe96] font-mono opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
              </h3>
              <p className="text-[14px] text-[#868f97] leading-[1.5]">
                Filter top Indian equities by Market Cap, PE Ratio, ROE, and Dividend Yield using institutional-grade metrics.
              </p>
            </motion.div>
          </Link>

          {/* Card 3: Contextual Education & Commodities */}
          <Link href="/commodities" className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#191919] rounded-[18px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] group-hover:border-[#ffa16c]/50 transition-all flex flex-col h-full"
            >
              {/* Rich Mini Commodity & Transmission Widget */}
              <div className="h-44 bg-[#111111] rounded-[12px] p-3.5 mb-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group-hover:border-[#ffa16c]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#868f97]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffa16c]" />
                    <span className="text-white/80 font-semibold">DYNAMIC COMMODITY ENGINE</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">CROSS-ASSET</span>
                </div>
                
                <div className="space-y-1.5 my-1 text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#181818] border border-white/5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-white font-bold">Brent Crude ($72.80)</span>
                      <span className="text-xs text-[#4ebe96] font-bold">Tailwind</span>
                    </div>
                    <div className="text-[10px] text-[#868f97]">Asian Paints & IndiGo gross margin expansion</div>
                  </div>
                  <div className="p-2 rounded bg-[#181818] border border-white/5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-white font-bold">MCX Gold (₹78,450)</span>
                      <span className="text-xs text-[#D4AF37] font-bold">CAD Relief</span>
                    </div>
                    <div className="text-[10px] text-[#868f97]">Titan volume elasticity & Muthoot LTV monitoring</div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#ffa16c] flex items-center justify-between">
                  <span>Weekend Wrap & Daily Updates</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">Launch Engine &rarr;</span>
                </div>
              </div>

              <h3 className="text-[18px] font-semibold text-white mb-2 flex items-center justify-between">
                <span>Commodities & Education</span>
                <span className="text-xs text-[#ffa16c] font-mono opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
              </h3>
              <p className="text-[14px] text-[#868f97] leading-[1.5]">
                Don't just look at data — understand it. Dynamic trading day updates and weekend market impact wraps for gold, oil, and sovereign FX.
              </p>
            </motion.div>
          </Link>

          {/* Card 4: Deterministic Replay Simulator */}
          <Link href="/replay" className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#191919] rounded-[18px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] group-hover:border-[#b6d6ff]/50 transition-all flex flex-col h-full"
            >
              <div className="h-44 bg-[#111111] rounded-[12px] p-3.5 mb-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group-hover:border-[#b6d6ff]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#868f97]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b6d6ff]" />
                    <span className="text-white/80 font-semibold">POINT-IN-TIME REPLAY</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">ZERO LOOKAHEAD</span>
                </div>
                
                <div className="space-y-1.5 my-1 text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#181818] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">2008 GFC · Lehman Collapse</div>
                      <div className="text-[10px] text-[#868f97]">Oct 15, 2008 · Sensex Trough</div>
                    </div>
                    <span className="text-xs text-[#eb5757] font-bold">-59.9%</span>
                  </div>
                  <div className="p-2 rounded bg-[#181818] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">2020 COVID Circuit Breaker</div>
                      <div className="text-[10px] text-[#868f97]">Mar 23, 2020 · 10% Lower Lock</div>
                    </div>
                    <span className="text-xs text-[#eb5757] font-bold">-39.6%</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#b6d6ff] flex items-center justify-between">
                  <span>4-Stage Pipeline Stepper</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">Launch Time Machine &rarr;</span>
                </div>
              </div>

              <h3 className="text-[18px] font-semibold text-white mb-2 flex items-center justify-between">
                <span>Deterministic Replay Engine</span>
                <span className="text-xs text-[#b6d6ff] font-mono opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
              </h3>
              <p className="text-[14px] text-[#868f97] leading-[1.5]">
                Reconstruct historical information environments strictly on official release dates. Step through 2008, 2020, 2016 demonetization with zero hindsight bias.
              </p>
            </motion.div>
          </Link>

          {/* Card 5: Quantitative Signals */}
          <Link href="/intelligence" className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-[#191919] rounded-[18px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] group-hover:border-[#d6fe51]/50 transition-all flex flex-col h-full"
            >
              <div className="h-44 bg-[#111111] rounded-[12px] p-3.5 mb-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group-hover:border-[#d6fe51]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#868f97]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d6fe51]" />
                    <span className="text-white/80 font-semibold">DARK LIQUIDITY MAP</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#d6fe51]/10 text-[#d6fe51] text-[10px] font-semibold">68.4% BUY</span>
                </div>
                
                <div className="space-y-1.5 my-1 text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#181818] border border-white/5 flex items-center justify-between">
                    <span className="text-white font-bold">Block Trans &gt; ₹5 Cr</span>
                    <span className="text-[#4ebe96] font-bold">₹1,840 Cr Net</span>
                  </div>
                  <div className="p-2 rounded bg-[#181818] border border-white/5 flex items-center justify-between">
                    <span className="text-white font-bold">90D Rolling Matrix</span>
                    <span className="text-[#868f97]">6x6 Cross-Asset</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#d6fe51] flex items-center justify-between">
                  <span>AI Order Flow Synthesis</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">Launch Signals &rarr;</span>
                </div>
              </div>

              <h3 className="text-[18px] font-semibold text-white mb-2 flex items-center justify-between">
                <span>Quantitative Signals & Flows</span>
                <span className="text-xs text-[#d6fe51] font-mono opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
              </h3>
              <p className="text-[14px] text-[#868f97] leading-[1.5]">
                Surveil institutional block trades, dark liquidity accumulation, order flow imbalance meters, and rolling pairwise correlation regimes.
              </p>
            </motion.div>
          </Link>

          {/* Card 6: Portfolio & Position Audit */}
          <Link href="/portfolio" className="block group">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#191919] rounded-[18px] p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] border border-[#333333] group-hover:border-[#ffa16c]/50 transition-all flex flex-col h-full"
            >
              <div className="h-44 bg-[#111111] rounded-[12px] p-3.5 mb-6 border border-white/10 flex flex-col justify-between relative overflow-hidden group-hover:border-[#ffa16c]/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#868f97]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffa16c]" />
                    <span className="text-white/80 font-semibold">POSITION AUDIT</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">FACTOR NEUTRAL</span>
                </div>
                
                <div className="space-y-1.5 my-1 text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#181818] border border-white/5 flex items-center justify-between">
                    <span className="text-white font-bold">Active Book NAV</span>
                    <span className="text-white font-bold font-mono-data">₹184.20 Cr</span>
                  </div>
                  <div className="p-2 rounded bg-[#181818] border border-white/5 flex items-center justify-between">
                    <span className="text-white font-bold">Rebalance Corridor</span>
                    <span className="text-[#4ebe96]">All Within Limits</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#ffa16c] flex items-center justify-between">
                  <span>9-Position Active Ledger</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">Launch Portfolio &rarr;</span>
                </div>
              </div>

              <h3 className="text-[18px] font-semibold text-white mb-2 flex items-center justify-between">
                <span>Institutional Portfolio & Holdings</span>
                <span className="text-xs text-[#ffa16c] font-mono opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
              </h3>
              <p className="text-[14px] text-[#868f97] leading-[1.5]">
                Real-time mark-to-market position audit, factor betas, dynamic corridor drift monitoring, and immutable execution ledger.
              </p>
            </motion.div>
          </Link>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-[44px] md:text-[52px] font-bold text-white tracking-[-0.08em] leading-[1.1] mb-8">
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
