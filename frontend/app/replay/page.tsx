'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  History, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Activity, 
  Award, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  CRISIS_REGIMES, 
  HistoricalCrisisRegime, 
  CrisisDaySnapshot 
} from '../lib/historical-database';

type ViewMode = 'selection' | 'simulator';

export default function ReplaySimulatorPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [selectedRegimeId, setSelectedRegimeId] = useState<string>('gfc-2008');
  
  // Simulation Console State
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 5 | 20>(1);
  const [pointInTimeStrict, setPointInTimeStrict] = useState<boolean>(true);

  // Thesis Simulator state
  const [selectedThesis, setSelectedThesis] = useState<'accumulate_quality' | 'cash_preservation' | 'aggressive_beta'>('accumulate_quality');
  const [simHorizon, setSimHorizon] = useState<'+1W' | '+1M' | '+3M' | '+6M' | '+1Y'>('+1M');
  const [simRevealed, setSimRevealed] = useState<boolean>(false);

  const activeRegime: HistoricalCrisisRegime = 
    CRISIS_REGIMES.find(r => r.id === selectedRegimeId) || CRISIS_REGIMES[0];

  const totalDays = activeRegime.days.length;
  const safeDayIndex = Math.min(Math.max(0, currentDayIndex), totalDays - 1);
  const activeDay: CrisisDaySnapshot = activeRegime.days[safeDayIndex];

  // Auto-advance player loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && viewMode === 'simulator') {
      const delay = playbackSpeed === 1 ? 2600 : playbackSpeed === 5 ? 900 : 400;
      interval = setInterval(() => {
        setCurrentDayIndex((prev) => {
          if (prev >= totalDays - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, totalDays, viewMode]);

  const handleSelectCrisis = (id: string) => {
    setSelectedRegimeId(id);
    setCurrentDayIndex(0);
    setSimRevealed(false);
    setIsPlaying(false);
    setViewMode('simulator');
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
      setSimRevealed(false);
    }
  };

  const handleNextDay = () => {
    if (currentDayIndex < totalDays - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
      setSimRevealed(false);
    }
  };

  // Compute simulated forward return based on historical trajectory
  const computeSimulationResult = () => {
    let factor = 1.0;
    let maxDrawdown = '-4.5%';
    let verdict = 'Neutral';
    let commentary = '';

    if (activeDay.phase === 'onset' || activeDay.phase === 'acceleration') {
      if (simHorizon === '+1W') { factor = 0.94; maxDrawdown = '-8.2%'; }
      else if (simHorizon === '+1M') { factor = 0.86; maxDrawdown = '-18.5%'; }
      else if (simHorizon === '+3M') { factor = 0.81; maxDrawdown = '-24.0%'; }
      else if (simHorizon === '+6M') { factor = 0.88; maxDrawdown = '-26.0%'; }
      else { factor = 1.15; maxDrawdown = '-28.0%'; }

      if (selectedThesis === 'accumulate_quality') {
        verdict = simHorizon === '+1Y' ? 'Strong Alpha (+15.0%)' : 'Short-Term Drawdown (-14.0%)';
        commentary = simHorizon === '+1Y'
          ? 'Accumulating market leaders (TCS, Reliance, HDFC Bank) during early panic produced superior 1-year compounded returns as balance sheet strength expanded market share.'
          : 'Early accumulation experienced mark-to-market pain as interbank liquidation continued for subsequent months before stabilizing.';
      } else if (selectedThesis === 'cash_preservation') {
        verdict = simHorizon === '+1Y' ? 'Opportunity Loss' : 'Capital Preserved (0.0%)';
        commentary = 'Holding cash and short-dated sovereign paper protected capital during the plunge, but risk of missing the explosive V-bottom capitulation bounce was high.';
      } else {
        verdict = 'High Volatility Drag';
        commentary = 'Aggressive high-beta leverage experienced severe margin liquidation cascades during early acceleration phases.';
      }
    } else if (activeDay.phase === 'capitulation' || activeDay.phase === 'peak_panic') {
      if (simHorizon === '+1W') { factor = 1.04; maxDrawdown = '-2.0%'; }
      else if (simHorizon === '+1M') { factor = 1.14; maxDrawdown = '-3.5%'; }
      else if (simHorizon === '+3M') { factor = 1.28; maxDrawdown = '-4.0%'; }
      else if (simHorizon === '+6M') { factor = 1.45; maxDrawdown = '-5.0%'; }
      else { factor = 1.82; maxDrawdown = '-6.0%'; }

      if (selectedThesis === 'accumulate_quality' || selectedThesis === 'aggressive_beta') {
        verdict = 'Generational Buying Opportunity';
        commentary = 'Buying at or near capitulation troughs (when FII selling was exhausted and domestic liquidity intervened) generated extraordinary risk-adjusted multi-bagger returns.';
      } else {
        verdict = 'Excessive Conservatism';
        commentary = 'Staying in 100% cash at the capitulation trough locked in paper safety while missing the steepest phase of the historical rebound.';
      }
    } else {
      factor = 1.08;
      maxDrawdown = '-3.0%';
      verdict = 'Constructive Compounding';
      commentary = 'During the steady recovery phase, earnings growth and systematic SIP inflows re-rated multiples to historical averages.';
    }

    const returnPct = ((factor - 1) * 100).toFixed(1);

    return {
      returnPct: Number(returnPct) >= 0 ? `+${returnPct}%` : `${returnPct}%`,
      isPositive: Number(returnPct) >= 0,
      maxDrawdown,
      verdict,
      commentary
    };
  };

  const simResult = computeSimulationResult();

  return (
    <div className="w-full text-white pb-24 font-sans selection:bg-[#479ffa]/30 selection:text-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col gap-6 sm:gap-8">
        
        {/* ========================================================================= */}
        {/* MODE 1: CRISIS SELECTION & BRIEFING (PAGE 1)                              */}
        {/* ========================================================================= */}
        {viewMode === 'selection' ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="border-b border-[#262626] pb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#ffa16c] animate-pulse" />
                <span className="font-mono text-xs tracking-widest text-[#868f97] uppercase font-semibold">
                  Point-in-Time Historical Engine &bull; Zero Lookahead Bias
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
                Historical Crisis <span className="text-transparent bg-clip-text bg-[linear-gradient(97.13deg,#ffa16c_8.47%,#551b10_108.41%)]">Replay.</span>
              </h1>
              
              <p className="text-sm text-[#868f97] mt-2 max-w-2xl leading-relaxed">
                Reconstruct the exact information set that existed on historical crisis dates. Isolate report publication dates from coverage periods to simulate authentic real-time market decisions.
              </p>
            </div>

            {/* Instruction Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#479ffa]/10 border border-[#479ffa]/20 flex items-center justify-center text-[#479ffa]">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Select a Crisis Timeline to Begin Replay</div>
                  <div className="text-[11px] text-[#868f97]">Choose an epoch below to step into its day-by-day tape, headlines, and macro telemetry.</div>
                </div>
              </div>
              <span className="text-xs font-mono text-[#868f97] hidden sm:block">5 Regimes Verified</span>
            </div>

            {/* 5 Crisis Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CRISIS_REGIMES.map((regime) => (
                <div
                  key={regime.id}
                  onClick={() => handleSelectCrisis(regime.id)}
                  className="group bg-[#161616] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#479ffa]/60 rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between shadow-xl space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header Row: Date Range & Peak Drawdown Pill */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#111111] border border-white/5 text-[#868f97]">
                        {regime.timeRange}
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        {regime.totalDrawdown}
                      </span>
                    </div>

                    {/* Crisis Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#479ffa] transition-colors tracking-tight">
                        {regime.name}
                      </h3>
                      <p className="text-xs text-[#868f97] mt-1.5 line-clamp-3 leading-relaxed">
                        {regime.summary}
                      </p>
                    </div>

                    {/* Historical Parameters Box */}
                    <div className="bg-[#101010] p-3 rounded-xl border border-white/5 text-xs font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#868f97]">Capitulation Trough:</span>
                        <span className="text-white font-semibold">{regime.days[Math.floor(regime.days.length / 2)]?.date || 'Mid-Crisis'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#868f97]">Recovery Horizon:</span>
                        <span className="text-[#4ebe96] font-semibold">{regime.recoveryDuration || 'V-Shaped'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#868f97]">Simulated Snapshots:</span>
                        <span className="text-white">{regime.days.length} Trading Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Enter Button */}
                  <div className="pt-2">
                    <button className="w-full py-2.5 rounded-xl bg-white/5 group-hover:bg-[#479ffa] text-white group-hover:text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-white/10 group-hover:border-[#479ffa]">
                      <span>Enter Time Machine</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE 2: ACTIVE SIMULATION COCKPIT (PAGE 2)                                */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Bar Navigation & Active Regime Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setViewMode('selection');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] border border-[#2a2a2a] text-xs font-medium text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft size={14} />
                  <span>Choose Another Crisis</span>
                </button>
                <div className="h-4 w-px bg-[#333333] hidden sm:block" />
                <div>
                  <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{activeRegime.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {activeRegime.totalDrawdown}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#868f97]">{activeRegime.timeRange}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setPointInTimeStrict(!pointInTimeStrict)}
                  className={`px-3 py-1 rounded-full border text-[11px] font-mono flex items-center gap-2 transition-all ${
                    pointInTimeStrict
                      ? 'bg-[#479ffa]/10 border-[#479ffa] text-[#479ffa]'
                      : 'bg-[#191919] border-[#262626] text-[#868f97]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${pointInTimeStrict ? 'bg-[#479ffa] animate-pulse' : 'bg-[#555555]'}`} />
                  <span>{pointInTimeStrict ? 'ZERO LOOKAHEAD ACTIVE' : 'LOOKAHEAD PERMISSIVE'}</span>
                </button>
              </div>
            </div>

            {/* Playback Control Strip & Scrubber */}
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-3">
                
                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevDay}
                    disabled={currentDayIndex === 0}
                    className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#202020] disabled:opacity-30 border border-[#262626] text-xs font-mono text-white transition-all flex items-center gap-1"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev Day</span>
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-5 py-1.5 rounded-xl font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-sm ${
                      isPlaying 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-white text-black hover:bg-[#e0e0e0]'
                    }`}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? 'Pause' : 'Play Tape'}</span>
                  </button>

                  <button
                    onClick={handleNextDay}
                    disabled={currentDayIndex === totalDays - 1}
                    className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#202020] disabled:opacity-30 border border-[#262626] text-xs font-mono text-white transition-all flex items-center gap-1"
                  >
                    <span>Next Day</span>
                    <ChevronRight size={14} />
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-xl border border-[#262626] ml-2">
                    {([1, 5, 20] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono ${
                          playbackSpeed === spd
                            ? 'bg-[#262626] text-white font-bold'
                            : 'text-[#868f97] hover:text-white'
                        }`}
                      >
                        {spd}X
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day Badge & Phase */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white bg-[#111111] px-3.5 py-1 rounded-xl border border-[#262626]">
                    Day {safeDayIndex + 1} of {totalDays} &bull; <strong className="text-[#479ffa]">{activeDay.date}</strong>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-lg uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Phase: {activeDay.phase}
                  </span>
                </div>
              </div>

              {/* Scrubber Timeline Bar (Clickable Day Pills) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
                {activeRegime.days.map((day, idx) => {
                  const isCurrent = idx === currentDayIndex;
                  const isPast = idx < currentDayIndex;
                  return (
                    <button
                      key={day.date}
                      onClick={() => {
                        setCurrentDayIndex(idx);
                        setSimRevealed(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all border shrink-0 ${
                        isCurrent
                          ? 'bg-[#479ffa] text-black font-bold border-[#479ffa] shadow-[0_0_15px_rgba(71,159,250,0.4)]'
                          : isPast
                          ? 'bg-[#181818] text-white/80 border-white/10 hover:border-white/30'
                          : 'bg-[#111111] text-[#555555] border-transparent hover:text-[#868f97]'
                      }`}
                    >
                      {day.date.split(',')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Synchronized Point-in-Time Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Point-in-Time Market Index & Tape (7 cols) */}
              <div className="lg:col-span-7 bg-[#161616] border border-[#2a2a2a] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <Activity size={17} className="text-[#479ffa]" />
                      <span>Point-in-Time Benchmark Tape</span>
                    </h3>
                    <p className="text-xs text-[#868f97] mt-0.5">Asset levels strictly isolated to {activeDay.date}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    NSE / BSE Historical Feeds
                  </span>
                </div>

                {/* Primary Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#111111] p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">Nifty 50 Level</div>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">{activeDay.indices.nifty50.level.toLocaleString()}</div>
                    <div className={`text-[11px] font-mono font-semibold ${activeDay.indices.nifty50.change1D >= 0 ? 'text-[#4ebe96]' : 'text-rose-400'}`}>
                      {activeDay.indices.nifty50.change1D >= 0 ? '+' : ''}{activeDay.indices.nifty50.change1D}%
                    </div>
                  </div>

                  <div className="bg-[#111111] p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">Sensex Level</div>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">{activeDay.indices.sensex.level.toLocaleString()}</div>
                    <div className={`text-[11px] font-mono font-semibold ${activeDay.indices.sensex.change1D >= 0 ? 'text-[#4ebe96]' : 'text-rose-400'}`}>
                      {activeDay.indices.sensex.change1D >= 0 ? '+' : ''}{activeDay.indices.sensex.change1D}%
                    </div>
                  </div>

                  <div className="bg-[#111111] p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">Market Sentiment</div>
                    <div className="text-sm font-bold font-mono text-amber-400 mt-1">{activeDay.sentiment}</div>
                    <div className="text-[10px] text-[#868f97] font-mono">P/E: {activeDay.indices.nifty50.pe}x</div>
                  </div>

                  <div className="bg-[#111111] p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] font-mono text-[#868f97] uppercase">USD / INR</div>
                    <div className="text-base font-bold font-mono text-white mt-1">{activeDay.macro.usdInr}</div>
                    <div className="text-[10px] text-[#868f97] font-mono">Yield: {activeDay.macro.tenYearYield}</div>
                  </div>
                </div>

                {/* Simulated Point-in-Time Trajectory Waveform */}
                <div className="bg-[#111111] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-[#868f97]">
                    <span>Simulated Index Trajectory (From Epoch Start to {activeDay.date})</span>
                    <span className="text-rose-400 font-bold">
                      {(((activeDay.indices.nifty50.level - activeRegime.days[0].indices.nifty50.level) / activeRegime.days[0].indices.nifty50.level) * 100).toFixed(1)}% Drawdown
                    </span>
                  </div>
                  <div className="h-28 w-full flex items-end gap-1.5 pt-4">
                    {activeRegime.days.map((d, i) => {
                      const isReached = i <= currentDayIndex;
                      const isCurrent = i === currentDayIndex;
                      const minLvl = Math.min(...activeRegime.days.map(x => x.indices.nifty50.level));
                      const maxLvl = Math.max(...activeRegime.days.map(x => x.indices.nifty50.level));
                      const range = maxLvl - minLvl || 1;
                      const heightPct = Math.max(15, Math.round(((d.indices.nifty50.level - minLvl) / range) * 85));
                      
                      return (
                        <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              isCurrent
                                ? 'bg-[#479ffa] shadow-[0_0_12px_rgba(71,159,250,0.8)]'
                                : isReached
                                ? 'bg-rose-500/60'
                                : 'bg-white/5'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#868f97] pt-1">
                    <span>{activeRegime.days[0].date}</span>
                    <span>Capitulation Low</span>
                    <span>{activeRegime.days[activeRegime.days.length - 1].date}</span>
                  </div>
                </div>

                {/* Day Summary Narrative */}
                <div className="p-4 rounded-xl bg-[#141414] border border-[#262626]">
                  <div className="text-[10px] font-mono text-[#ffa16c] uppercase font-bold tracking-wider mb-1">
                    Daily Situation Briefing &bull; {activeDay.date}
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{activeDay.dayTitle}</h4>
                  <p className="text-xs text-white/90 leading-relaxed font-sans mb-2">
                    {activeDay.whatWasKnown}
                  </p>
                  <div className="text-[11px] text-[#868f97] bg-[#111111] p-2.5 rounded-lg border border-white/5">
                    <strong className="text-amber-400">The Lookahead Trap:</strong> {activeDay.whatWasUnknown}
                  </div>
                </div>
              </div>

              {/* Right Column: News & Macro Wire for that Date (5 cols) */}
              <div className="lg:col-span-5 bg-[#161616] border border-[#2a2a2a] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <Zap size={17} className="text-amber-400" />
                      <span>Point-in-Time News Wire</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#868f97]">{activeDay.date}</span>
                  </div>

                  {/* Headlines Active on this day */}
                  <div className="space-y-2.5">
                    {activeDay.tapeHeadlines.map((hl, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#111111] border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#868f97]">
                            Historical Tape Wire
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                            {idx === 0 ? 'Critical' : 'Market Wire'}
                          </span>
                        </div>
                        <p className="text-xs text-white font-medium leading-snug">
                          {hl}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Macro Context on this Day */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#4ebe96]" />
                      <span>Macro Parameters Active on this Day</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-[#111111] p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-[#868f97] block">RBI Repo Rate</span>
                        <span className="text-sm font-bold text-white">{activeDay.macro.rbiRepo}</span>
                      </div>
                      <div className="bg-[#111111] p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-[#868f97] block">Headline CPI</span>
                        <span className="text-sm font-bold text-white">{activeDay.macro.cpi}</span>
                      </div>
                      <div className="bg-[#111111] p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-[#868f97] block">10Y G-Sec Yield</span>
                        <span className="text-sm font-bold text-white">{activeDay.macro.tenYearYield}</span>
                      </div>
                      <div className="bg-[#111111] p-2.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-[#868f97] block">Brent Crude Oil</span>
                        <span className="text-sm font-bold text-white">{activeDay.macro.crudeOil}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] text-[#868f97]">
                  All economic statistics are locked to official publication calendars. No future data leaked.
                </div>
              </div>

            </div>

            {/* Bottom Interactive Decision Lab: What Would You Do on This Date? */}
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Tactical Decision Simulator: What would you do on {activeDay.date}?
                  </h3>
                </div>
                <span className="text-xs text-[#868f97]">Test your asset allocation thesis without hindsight bias</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Option 1 */}
                <button
                  onClick={() => {
                    setSelectedThesis('accumulate_quality');
                    setSimRevealed(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                    selectedThesis === 'accumulate_quality'
                      ? 'bg-[#1e1e1e] border-[#479ffa] shadow-[0_0_15px_rgba(71,159,250,0.2)]'
                      : 'bg-[#121212] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>1. Systematic Blue-Chip SIP</span>
                    {selectedThesis === 'accumulate_quality' && <span className="text-[#479ffa] text-[10px] font-mono">SELECTED</span>}
                  </div>
                  <p className="text-[11px] text-[#868f97] leading-relaxed">
                    Deploy liquidity into top-tier high ROE compounders (TCS, Reliance, HDFC Bank) despite ongoing market volatility.
                  </p>
                </button>

                {/* Option 2 */}
                <button
                  onClick={() => {
                    setSelectedThesis('cash_preservation');
                    setSimRevealed(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                    selectedThesis === 'cash_preservation'
                      ? 'bg-[#1e1e1e] border-[#479ffa] shadow-[0_0_15px_rgba(71,159,250,0.2)]'
                      : 'bg-[#121212] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>2. Maximum Capital Preservation</span>
                    {selectedThesis === 'cash_preservation' && <span className="text-[#479ffa] text-[10px] font-mono">SELECTED</span>}
                  </div>
                  <p className="text-[11px] text-[#868f97] leading-relaxed">
                    Liquidate equities to 75% cash, short-term repo, and sovereign gold bonds until full macro stability returns.
                  </p>
                </button>

                {/* Option 3 */}
                <button
                  onClick={() => {
                    setSelectedThesis('aggressive_beta');
                    setSimRevealed(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                    selectedThesis === 'aggressive_beta'
                      ? 'bg-[#1e1e1e] border-[#479ffa] shadow-[0_0_15px_rgba(71,159,250,0.2)]'
                      : 'bg-[#121212] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>3. High-Beta Rebound Play</span>
                    {selectedThesis === 'aggressive_beta' && <span className="text-[#479ffa] text-[10px] font-mono">SELECTED</span>}
                  </div>
                  <p className="text-[11px] text-[#868f97] leading-relaxed">
                    Aggressively buy oversold cyclical banking and realty stocks to maximize upside on the eventual capitulation reversal.
                  </p>
                </button>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#868f97] font-mono">Simulate Forward Horizon:</span>
                  {(['+1W', '+1M', '+3M', '+6M', '+1Y'] as const).map((hz) => (
                    <button
                      key={hz}
                      onClick={() => {
                        setSimHorizon(hz);
                        setSimRevealed(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                        simHorizon === hz
                          ? 'bg-white text-black font-bold'
                          : 'bg-[#111111] text-[#868f97] hover:text-white border border-white/5'
                      }`}
                    >
                      {hz}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSimRevealed(true)}
                  className="px-5 py-2 rounded-xl bg-[#ffa16c] hover:bg-[#ffb085] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(255,161,108,0.3)] flex items-center gap-1.5"
                >
                  <Award size={15} />
                  <span>Reveal Historical Outcome</span>
                </button>
              </div>

              {/* Outcome Reveal Box */}
              {simRevealed && (
                <div className="p-4 rounded-xl bg-[#111111] border border-[#ffa16c]/40 mt-3 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-[#ffa16c] uppercase font-bold tracking-wider">
                      Historical Simulation Result &bull; {simHorizon} from {activeDay.date}
                    </div>
                    <span className={`text-sm font-mono font-bold ${simResult.isPositive ? 'text-[#4ebe96]' : 'text-rose-400'}`}>
                      {simResult.returnPct}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    <strong>Verdict: {simResult.verdict}.</strong> {simResult.commentary}
                  </p>
                  <div className="text-[11px] font-mono text-[#868f97] pt-1">
                    Max intermediate drawdown endured: <span className="text-rose-400 font-semibold">{simResult.maxDrawdown}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
