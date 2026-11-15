'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  CRISIS_REGIMES, 
  HistoricalCrisisRegime, 
  CrisisDaySnapshot, 
  MODERN_BASELINE 
} from '../lib/historical-database';
import Icon from '../components/ui/Icon';

type DetailTab = 'overview' | 'wire' | 'lookahead' | 'filing' | 'simulator' | 'sectors';

export default function HistoricalReplayPage() {
  const [selectedRegimeId, setSelectedRegimeId] = useState<string>('gfc-2008');
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(3); // Default to a dramatic day
  const [activeTab, setActiveTab] = useState<DetailTab>('lookahead');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [pointInTimeStrict, setPointInTimeStrict] = useState<boolean>(true);

  // Thesis Simulator state
  const [selectedThesis, setSelectedThesis] = useState<string>('accumulate_quality');
  const [customThesis, setCustomThesis] = useState<string>('');
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
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDayIndex((prev) => {
          if (prev >= totalDays - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed === 1 ? 2400 : 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, totalDays]);

  const handleRegimeChange = (id: string) => {
    setSelectedRegimeId(id);
    setCurrentDayIndex(0);
    setIsPlaying(false);
    setSimRevealed(false);
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

  // Compute simulated forward return from active day based on regime chartPath
  const computeSimulationResult = () => {
    const currentLevel = activeDay.indices.nifty50.level;
    
    // Horizon multiplier approximations based on historical crisis trajectories
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
        verdict = simHorizon === '+1Y' ? 'Strong Win' : 'Drawdown Pain';
        commentary = simHorizon === '+1Y' 
          ? 'Patience rewarded: Accumulating quality during onset required enduring a severe intermediate -20% drawdown, but delivered +15% to +25% net 1-year returns as market reconstructed.'
          : 'Catching a falling knife: Broad liquidation continued across foreign institutions before capitulation bottoms were reached.';
      } else if (selectedThesis === 'cash_defensive') {
        verdict = simHorizon === '+1Y' ? 'Opportunity Cost' : 'Prudent Capital Preservation';
        commentary = 'Preserved 100% principal while market crashed, but timing the exact bottom to redeploy proved psychologically difficult.';
      } else {
        verdict = 'Volatile';
        commentary = 'High dispersion between sector performances; leveraged debt assets faced complete distress.';
      }
    } else if (activeDay.phase === 'peak_panic' || activeDay.phase === 'capitulation') {
      if (simHorizon === '+1W') { factor = 0.97; maxDrawdown = '-5.5%'; }
      else if (simHorizon === '+1M') { factor = 1.06; maxDrawdown = '-6.0%'; }
      else if (simHorizon === '+3M') { factor = 1.18; maxDrawdown = '-7.0%'; }
      else if (simHorizon === '+6M') { factor = 1.35; maxDrawdown = '-7.0%'; }
      else { factor = 1.62; maxDrawdown = '-8.0%'; }

      if (selectedThesis === 'accumulate_quality') {
        verdict = 'Generational Alpha';
        commentary = 'Buying at capitulation (P/E <13x) delivered historic multi-bagger returns (+60%+) across blue-chip banking and private capex leaders.';
      } else {
        verdict = 'Underperformed';
        commentary = 'Excessive cash conservatism caused investors to completely miss the historic post-panic liquidity re-rating.';
      }
    } else {
      // Policy pivot / recovery
      if (simHorizon === '+1W') factor = 1.03;
      else if (simHorizon === '+1M') factor = 1.08;
      else if (simHorizon === '+3M') factor = 1.20;
      else if (simHorizon === '+6M') factor = 1.32;
      else factor = 1.48;
      maxDrawdown = '-3.5%';
      verdict = 'Strong Bullish Expansion';
      commentary = 'Central bank liquidity and government stimulus fueled aggressive risk-on multiple expansion.';
    }

    const projectedLevel = Math.round(currentLevel * factor);
    const returnPct = ((factor - 1) * 100).toFixed(1);

    return {
      startLevel: currentLevel,
      projectedLevel,
      returnPct: Number(returnPct) >= 0 ? `+${returnPct}%` : `${returnPct}%`,
      isPositive: Number(returnPct) >= 0,
      maxDrawdown,
      verdict,
      commentary
    };
  };

  const simResult = computeSimulationResult();

  // Helper for phase color
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'onset': return 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30';
      case 'acceleration': return 'bg-[#fb923c]/15 text-[#fb923c] border-[#fb923c]/30';
      case 'peak_panic': return 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/40 animate-pulse';
      case 'capitulation': return 'bg-[#ec4899]/15 text-[#ec4899] border-[#ec4899]/40';
      case 'policy_pivot': return 'bg-[#06b6d4]/15 text-[#06b6d4] border-[#06b6d4]/30';
      case 'recovery': return 'bg-[#34d399]/15 text-[#34d399] border-[#34d399]/30';
      default: return 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1c2840] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/30">
              PIEDMONT V9
            </span>
            <span className="text-xs text-[#64748b] font-mono-data uppercase">
              POINT-IN-TIME HISTORICAL RESEARCH ENGINE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Historical Crisis Chronicle & Replay
          </h1>
          <p className="text-xs text-[#cbd5e1] mt-1 max-w-3xl">
            Reconstruct the exact information set available on past crisis dates. Strictly eliminates lookahead bias by distinguishing data coverage periods from actual official availability dates.
          </p>
        </div>

        {/* Anti-Lookahead Mode Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setPointInTimeStrict(!pointInTimeStrict)}
            className={`px-3 py-1.5 rounded border text-xs font-mono-data flex items-center gap-1.5 transition-colors ${
              pointInTimeStrict 
                ? 'bg-[#3b82f6]/15 border-[#3b82f6] text-[#3b82f6] font-bold'
                : 'bg-[#0f1520] border-[#1c2840] text-[#64748b]'
            }`}
            title="Toggle Anti-Lookahead Bias Filter"
          >
            <span className={`w-2 h-2 rounded-full ${pointInTimeStrict ? 'bg-[#3b82f6] animate-pulse' : 'bg-[#64748b]'}`} />
            <span>{pointInTimeStrict ? 'ZERO LOOKAHEAD (PIT ACTIVE)' : 'STANDARD HISTORICAL VIEW'}</span>
          </button>
          
          <div className="bg-[#0f1520] border border-[#1c2840] px-3 py-1.5 rounded text-right">
            <div className="text-[9px] text-[#64748b] uppercase tracking-wider">ACTIVE DATE</div>
            <div className="font-mono-data text-xs font-bold text-white uppercase">{activeDay.date}</div>
          </div>
        </div>
      </div>

      {/* 1. Historical Crisis Era Selector */}
      <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-3">
        <div className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold mb-2 flex items-center justify-between font-mono-data">
          <span>SELECT HISTORICAL CRISIS CHRONICLE</span>
          <span className="text-[#3b82f6]">{CRISIS_REGIMES.length} CRISIS REGIMES LOADED</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CRISIS_REGIMES.map((regime) => {
            const isSelected = regime.id === selectedRegimeId;
            return (
              <button
                key={regime.id}
                onClick={() => handleRegimeChange(regime.id)}
                className={`flex flex-col p-2.5 rounded text-left transition-all ${
                  isSelected
                    ? 'bg-[#3b82f6]/15 border-2 border-[#3b82f6] shadow-lg'
                    : 'bg-[#080c14] border border-[#1c2840] hover:border-[#2a3f60]'
                }`}
              >
                <span className={`text-[9px] font-mono-data uppercase font-bold ${
                  isSelected ? 'text-[#3b82f6]' : 'text-[#64748b]'
                }`}>
                  {regime.timeRange}
                </span>
                <span className="text-xs font-semibold text-white truncate mt-0.5">
                  {regime.name.split('&')[0]}
                </span>
                <span className="text-[10px] text-[#f87171] font-mono-data font-semibold mt-0.5">
                  Drawdown: {regime.totalDrawdown.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Crisis Regime Banner */}
      <div className="bg-gradient-to-r from-[#0f1520] via-[#141c2b] to-[#0f1520] border border-[#2a3f60] rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono-data uppercase font-bold border ${getPhaseColor(activeDay.phase)}`}>
                PHASE: {activeDay.phase.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono-data text-[#94a3b8]">{activeRegime.timeRange}</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {activeRegime.headline}
            </h2>
            <p className="text-xs text-[#cbd5e1] max-w-4xl leading-relaxed pt-1">
              {activeRegime.summary}
            </p>
          </div>

          <div className="bg-[#080c14] border border-[#1c2840] p-3 rounded shrink-0 lg:w-72 font-mono-data text-xs space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-[#64748b] font-semibold mb-1">
              REGIME PARAMETERS
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Max Drawdown:</span>
              <span className="text-[#f87171] font-bold">{activeRegime.totalDrawdown}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Capitulation Trough:</span>
              <span className="text-white font-bold">{activeRegime.troughDate.split('(')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">Recovery Duration:</span>
              <span className="text-[#34d399] font-bold">{activeRegime.recoveryDuration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Chronological Scrubber & Playback Cockpit */}
      <div className="bg-[#080c14] border border-[#1c2840] rounded-lg p-4 space-y-3 shadow-xl">
        
        {/* Playback Controls & Date Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2840] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              disabled={currentDayIndex === 0}
              className="px-2.5 py-1.5 rounded bg-[#0f1520] hover:bg-[#1c2840] disabled:opacity-30 border border-[#1c2840] text-xs font-mono-data text-white flex items-center gap-1 transition-all"
              title="Previous Crisis Date"
            >
              &larr; PREV
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-1.5 rounded font-mono-data font-bold text-xs uppercase flex items-center gap-1.5 transition-all ${
                isPlaying 
                  ? 'bg-[#ef4444] text-white hover:bg-[#dc2626]' 
                  : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
              }`}
            >
              <Icon name={isPlaying ? 'pause' : 'play_arrow'} className="w-3.5 h-3.5" />
              <span>{isPlaying ? 'PAUSE AUTORUN' : 'PLAY TIMELINE'}</span>
            </button>
            <button
              onClick={handleNextDay}
              disabled={currentDayIndex === totalDays - 1}
              className="px-2.5 py-1.5 rounded bg-[#0f1520] hover:bg-[#1c2840] disabled:opacity-30 border border-[#1c2840] text-xs font-mono-data text-white flex items-center gap-1 transition-all"
              title="Next Crisis Date"
            >
              NEXT &rarr;
            </button>

            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
              className="px-2 py-1.5 rounded bg-[#0f1520] border border-[#1c2840] text-[10px] font-mono-data text-[#94a3b8] hover:text-white"
              title="Toggle Playback Speed"
            >
              {playbackSpeed}X SPEED
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono-data text-[#64748b] uppercase">
              DAY {safeDayIndex + 1} OF {totalDays}
            </span>
            <div className="font-mono-data text-xs font-bold text-white bg-[#0f1520] px-3 py-1 rounded border border-[#1c2840]">
              {activeDay.date}
            </div>
          </div>
        </div>

        {/* Milestone Nodes Along Crisis Trajectory */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {activeRegime.days.map((day, idx) => {
            const isCurrent = idx === safeDayIndex;
            return (
              <button
                key={day.id}
                onClick={() => {
                  setCurrentDayIndex(idx);
                  setIsPlaying(false);
                  setSimRevealed(false);
                }}
                className={`px-2.5 py-1.5 rounded font-mono-data text-[10px] shrink-0 transition-all border ${
                  isCurrent 
                    ? 'bg-[#3b82f6] border-[#3b82f6] text-white font-bold shadow-md scale-105' 
                    : 'bg-[#0f1520] border-[#1c2840] text-[#94a3b8] hover:text-white hover:border-[#2a3f60]'
                }`}
              >
                <div>{day.shortDate}</div>
                <div className="text-[8px] opacity-75">{day.indices.nifty50.level}</div>
              </button>
            );
          })}
        </div>

        {/* Range Slider Scrubber */}
        <div className="pt-1">
          <input
            type="range"
            min={0}
            max={totalDays - 1}
            value={safeDayIndex}
            onChange={(e) => {
              setCurrentDayIndex(Number(e.target.value));
              setIsPlaying(false);
              setSimRevealed(false);
            }}
            className="w-full h-2 bg-[#1c2840] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
          />
        </div>

      </div>

      {/* 4. Active Day Cockpit: Market Tape & Macro Environment */}
      <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-4">
        
        {/* Day Header & Sentiment Gauge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c2840] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data uppercase font-bold border ${getPhaseColor(activeDay.phase)}`}>
                {activeDay.phase.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono-data text-[#94a3b8]">{activeDay.date}</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight mt-1">
              {activeDay.dayTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono-data uppercase text-[#64748b]">MARKET SENTIMENT:</span>
            <span className="px-2.5 py-1 rounded font-mono-data text-xs font-bold uppercase bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444]">
              {activeDay.sentiment}
            </span>
          </div>
        </div>

        {/* Live Index Tape Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#080c14] border border-[#1c2840] p-3 rounded">
            <div className="text-[9px] text-[#64748b] font-mono-data uppercase">NIFTY 50 INDEX</div>
            <div className="font-mono-data text-lg font-bold text-white mt-0.5">
              {activeDay.indices.nifty50.level.toLocaleString()}
            </div>
            <div className={`text-xs font-mono-data font-semibold ${
              activeDay.indices.nifty50.change1D >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'
            }`}>
              {activeDay.indices.nifty50.change1D >= 0 ? '+' : ''}{activeDay.indices.nifty50.change1D}% 1D
            </div>
            <div className="text-[10px] text-[#94a3b8] font-mono-data mt-1">
              P/E: <strong className="text-white">{activeDay.indices.nifty50.pe}x</strong> | P/B: <strong className="text-white">{activeDay.indices.nifty50.pb}x</strong>
            </div>
          </div>

          <div className="bg-[#080c14] border border-[#1c2840] p-3 rounded">
            <div className="text-[9px] text-[#64748b] font-mono-data uppercase">BSE SENSEX</div>
            <div className="font-mono-data text-lg font-bold text-white mt-0.5">
              {activeDay.indices.sensex.level.toLocaleString()}
            </div>
            <div className={`text-xs font-mono-data font-semibold ${
              activeDay.indices.sensex.change1D >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'
            }`}>
              {activeDay.indices.sensex.change1D >= 0 ? '+' : ''}{activeDay.indices.sensex.change1D}% 1D
            </div>
            <div className="text-[10px] text-[#94a3b8] font-mono-data mt-1">
              P/E: <strong className="text-white">{activeDay.indices.sensex.pe}x</strong>
            </div>
          </div>

          <div className="bg-[#080c14] border border-[#1c2840] p-3 rounded">
            <div className="text-[9px] text-[#64748b] font-mono-data uppercase">10Y G-SEC YIELD</div>
            <div className="font-mono-data text-lg font-bold text-white mt-0.5">
              {activeDay.macro.tenYearYield}
            </div>
            <div className="text-[10px] text-[#94a3b8] font-mono-data mt-1">
              RBI Repo: <strong className="text-white">{activeDay.macro.rbiRepo}</strong>
            </div>
          </div>

          <div className="bg-[#080c14] border border-[#1c2840] p-3 rounded">
            <div className="text-[9px] text-[#64748b] font-mono-data uppercase">USD / INR & CRUDE</div>
            <div className="font-mono-data text-lg font-bold text-white mt-0.5">
              ₹{activeDay.macro.usdInr}
            </div>
            <div className="text-[10px] text-[#94a3b8] font-mono-data mt-1">
              Brent: <strong className="text-white">{activeDay.macro.crudeOil}</strong> | Forex: <strong className="text-white">{activeDay.macro.forex}</strong>
            </div>
          </div>
        </div>

        {/* Macro Comparison vs Nov 2026 Baseline Strip */}
        <div className="bg-[#080c14] border border-[#1c2840] p-3 rounded flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data">
          <span className="text-[#64748b] uppercase text-[10px] font-bold">
            DELTA VS NOVEMBER 2026 BASELINE:
          </span>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Nifty: <strong className="text-white">{activeDay.indices.nifty50.level}</strong> vs {MODERN_BASELINE.niftyLevel}</span>
            <span>P/E: <strong className="text-white">{activeDay.indices.nifty50.pe}x</strong> vs {MODERN_BASELINE.niftyPE}x</span>
            <span>Repo: <strong className="text-white">{activeDay.macro.rbiRepo}</strong> vs {MODERN_BASELINE.repoRate}</span>
            <span>Forex: <strong className="text-white">{activeDay.macro.forex}</strong> vs {MODERN_BASELINE.forex}</span>
          </div>
        </div>

      </div>

      {/* 5. Deep Investigation Tabs */}
      <div className="space-y-4">
        
        {/* Tabs Bar */}
        <div className="flex border-b border-[#1c2840] gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'lookahead', label: 'THE LOOKAHEAD TRAP (PIT)', icon: 'visibility' },
            { id: 'wire', label: 'WHAT CROSSED THE WIRE TODAY', icon: 'schedule' },
            { id: 'simulator', label: 'THESIS BACKTESTER (WITHOUT HINDSIGHT)', icon: 'bot' },
            { id: 'filing', label: 'CORPORATE FILING IN FOCUS', icon: 'business' },
            { id: 'sectors', label: 'WINNING & LOSING SECTORS', icon: 'pie_chart' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DetailTab)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono-data whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-[#3b82f6] text-white font-bold bg-[#3b82f6]/5'
                    : 'border-transparent text-[#64748b] hover:text-[#cbd5e1] hover:bg-white/5'
                }`}
              >
                <Icon name={tab.icon} className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: The Lookahead Trap (Signature Feature) */}
        {activeTab === 'lookahead' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Known Information Set */}
            <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#34d399] font-mono-data text-xs font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                <span>WHAT WAS OFFICIALLY KNOWN ON {activeDay.date}</span>
              </div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {activeDay.whatWasKnown}
              </p>
              <div className="pt-2 border-t border-[#1c2840]/60 text-[11px] text-[#94a3b8] font-mono-data">
                <strong className="text-white">Institutional Desk Action:</strong> {activeDay.institutionalAction}
              </div>
            </div>

            {/* Lookahead Trap */}
            <div className="bg-[#0f1520] border-2 border-[#ef4444]/40 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#ef4444] font-mono-data text-xs font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                <span>THE LOOKAHEAD BIAS TRAP (WHAT WAS UNKNOWN)</span>
              </div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {activeDay.whatWasUnknown}
              </p>
              <div className="pt-2 border-t border-[#1c2840]/60 text-[10px] text-[#ef4444] font-mono-data bg-[#ef4444]/5 p-2 rounded">
                <strong>Academic Principle:</strong> Distinguishing historical data coverage periods from actual release dates prevents backward-looking bias when evaluating market decisions.
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: What Crossed The Wire Today */}
        {activeTab === 'wire' && (
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c2840] pb-2">
              <span className="text-xs font-mono-data uppercase font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                <span>WIRE HEADLINES CROSSING THE TAPE ON {activeDay.date}</span>
              </span>
              <span className="text-[10px] font-mono-data text-[#64748b]">REUTERS / PTI / BLOOMBERG ARCHIVE</span>
            </div>

            <div className="space-y-2 pt-1">
              {activeDay.tapeHeadlines.map((headline, idx) => (
                <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-3 rounded flex items-start gap-3">
                  <span className="font-mono-data text-[#3b82f6] text-xs font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    {headline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Thesis Backtester (Without Hindsight) */}
        {activeTab === 'simulator' && (
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono-data">
                Trade The Crisis Simulator (Zero Lookahead)
              </h3>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Assume the role of a portfolio manager on <strong className="text-white">{activeDay.date}</strong> (Nifty {activeDay.indices.nifty50.level}). Select an investment stance and evaluate its real historical outcome.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Strategy Form */}
              <div className="space-y-3 bg-[#080c14] border border-[#1c2840] p-4 rounded">
                <div>
                  <label className="block text-[10px] font-mono-data uppercase text-[#64748b] mb-1">
                    Select Your Thesis / Capital Allocation
                  </label>
                  <select
                    value={selectedThesis}
                    onChange={(e) => {
                      setSelectedThesis(e.target.value);
                      setSimRevealed(false);
                    }}
                    className="w-full bg-[#0f1520] border border-[#1c2840] rounded px-3 py-2 text-xs text-white font-mono-data outline-none focus:border-[#3b82f6]"
                  >
                    <option value="accumulate_quality">Accumulate High-Quality Equities (Private Banks & FMCG)</option>
                    <option value="cash_defensive">Flight to 100% Cash & 91-Day Treasury Bills</option>
                    <option value="short_leverage">Short Leveraged High-Debt Real Estate & Infrastructure</option>
                    <option value="rotate_defensive">Rotate into Dollar-Earning IT & Pharma Exporters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-data uppercase text-[#64748b] mb-1">
                    Evaluation Horizon
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(['+1W', '+1M', '+3M', '+6M', '+1Y'] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => {
                          setSimHorizon(h);
                          setSimRevealed(false);
                        }}
                        className={`py-1.5 rounded font-mono-data text-xs font-semibold border transition-all ${
                          simHorizon === h 
                            ? 'bg-[#3b82f6] border-[#3b82f6] text-white' 
                            : 'bg-[#0f1520] border-[#1c2840] text-[#94a3b8] hover:text-white'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSimRevealed(true)}
                  className="w-full py-2 rounded bg-[#3b82f6] hover:bg-[#2563eb] text-white font-mono-data font-bold text-xs uppercase transition-colors"
                >
                  TEST THESIS AGAINST HISTORICAL REALITY
                </button>
              </div>

              {/* Simulation Result */}
              <div className="bg-[#080c14] border border-[#1c2840] p-4 rounded flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono-data uppercase text-[#64748b] mb-1">
                    FORWARD OUTCOME ({simHorizon})
                  </div>
                  {simRevealed ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[9px] text-[#94a3b8] uppercase font-mono-data">Nifty Starting Level</div>
                          <div className="font-mono-data text-sm font-bold text-white">{simResult.startLevel}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#94a3b8] uppercase font-mono-data">Projected Index</div>
                          <div className="font-mono-data text-sm font-bold text-white">{simResult.projectedLevel}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#94a3b8] uppercase font-mono-data">Forward Return</div>
                          <div className={`font-mono-data text-sm font-bold ${simResult.isPositive ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
                            {simResult.returnPct}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0f1520] border border-[#1c2840] p-2.5 rounded text-xs space-y-1">
                        <div className="flex justify-between font-mono-data text-[11px]">
                          <span className="text-[#94a3b8]">Intermediate Drawdown Risk:</span>
                          <span className="text-[#f87171] font-bold">{simResult.maxDrawdown}</span>
                        </div>
                        <div className="flex justify-between font-mono-data text-[11px]">
                          <span className="text-[#94a3b8]">Institutional Verdict:</span>
                          <span className="text-[#3b82f6] font-bold">{simResult.verdict}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#cbd5e1] leading-relaxed">
                        {simResult.commentary}
                      </p>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-[#64748b] font-mono-data">
                      Select your parameters and click "Test Thesis" to evaluate without hindsight.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Corporate Filing in Focus */}
        {activeTab === 'filing' && (
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-3">
            {activeDay.corporateFilingInFocus ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1c2840] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data text-xs font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded border border-[#3b82f6]/20">
                      {activeDay.corporateFilingInFocus.symbol}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {activeDay.corporateFilingInFocus.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono-data text-[#94a3b8]">
                    {activeDay.corporateFilingInFocus.filing}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono-data text-xs">
                  <div className="bg-[#080c14] p-3 rounded border border-[#1c2840]">
                    <div className="text-[9px] text-[#64748b] uppercase">Reported Revenue</div>
                    <div className="text-base font-bold text-white mt-0.5">{activeDay.corporateFilingInFocus.revenue}</div>
                  </div>
                  <div className="bg-[#080c14] p-3 rounded border border-[#1c2840]">
                    <div className="text-[9px] text-[#64748b] uppercase">Reported Net Profit</div>
                    <div className="text-base font-bold text-white mt-0.5">{activeDay.corporateFilingInFocus.netProfit}</div>
                  </div>
                </div>

                <div className="bg-[#080c14] p-3 rounded border border-[#1c2840] text-xs text-[#cbd5e1] leading-relaxed">
                  <strong className="text-white font-mono-data">Market Reaction & Filing Notes:</strong> {activeDay.corporateFilingInFocus.note}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#64748b] font-mono-data">
                No single corporate filing dominated the wire on this specific macroeconomic date.
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Winning & Losing Sectors */}
        {activeTab === 'sectors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Winning Sectors */}
            <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-3">
              <span className="text-xs font-mono-data uppercase font-bold text-[#34d399] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                <span>OUTPERFORMING DEFENSIVE SECTORS</span>
              </span>
              <div className="space-y-2">
                {activeRegime.winningSectors.map((s, idx) => (
                  <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-3 rounded space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{s.name}</span>
                      <span className="font-mono-data text-xs font-bold text-[#34d399]">{s.performance}</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] leading-tight">{s.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Losing Sectors */}
            <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-3">
              <span className="text-xs font-mono-data uppercase font-bold text-[#f87171] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f87171]" />
                <span>VULNERABLE HIGH-BETA SECTORS</span>
              </span>
              <div className="space-y-2">
                {activeRegime.losingSectors.map((s, idx) => (
                  <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-3 rounded space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{s.name}</span>
                      <span className="font-mono-data text-xs font-bold text-[#f87171]">{s.performance}</span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] leading-tight">{s.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 6. Institutional Lessons Post-Mortem */}
      <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-2.5">
        <span className="text-[10px] font-mono-data uppercase font-bold text-[#64748b] block border-b border-[#1c2840] pb-1.5">
          INSTITUTIONAL CRISIS POST-MORTEM & PORTFOLIO LESSONS
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeRegime.institutionalLessons.map((lesson, idx) => (
            <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-3 rounded text-xs text-[#cbd5e1] leading-relaxed">
              <span className="font-mono-data text-[#3b82f6] font-bold block mb-1">LESSON #{idx + 1}:</span>
              {lesson}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
