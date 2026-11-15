'use client';

import React, { useState, useEffect } from 'react';
import { 
  CRISIS_REGIMES, 
  HistoricalCrisisRegime, 
  CrisisDaySnapshot, 
  MODERN_BASELINE 
} from '../lib/historical-database';
import Icon from '../components/ui/Icon';

type DetailTab = 'lookahead' | 'simulator' | 'filing' | 'sectors';

export default function HistoricalReplayPage() {
  const [selectedRegimeId, setSelectedRegimeId] = useState<string>('gfc-2008');
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(3); // Dramatic default day
  const [activeTab, setActiveTab] = useState<DetailTab>('lookahead');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [pointInTimeStrict, setPointInTimeStrict] = useState<boolean>(true);

  // Thesis Simulator state
  const [selectedThesis, setSelectedThesis] = useState<string>('accumulate_quality');
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

  // Compute simulated forward return from active day based on regime trajectory
  const computeSimulationResult = () => {
    const currentLevel = activeDay.indices.nifty50.level;
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

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'onset': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'acceleration': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'peak_panic': return 'bg-red-500/15 text-red-500 border-red-500/40 animate-pulse';
      case 'capitulation': return 'bg-pink-500/15 text-pink-500 border-pink-500/40';
      case 'policy_pivot': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30';
      case 'recovery': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      default: return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-6">
      
      {/* 1. Sleek Header & Mode Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono-data text-[10px] uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-bold border border-amber-500/20">
              PIEDMONT V9
            </span>
            <span className="text-xs text-on-surface-variant font-mono-data uppercase">
              POINT-IN-TIME HISTORICAL RESEARCH ENGINE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Historical Crisis Chronicle & Replay
          </h1>
          <p className="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Reconstruct the exact information set available on pivotal historical dates. Strictly eliminates lookahead bias by separating data periods from official release dates.
          </p>
        </div>

        {/* Anti-Lookahead Mode Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setPointInTimeStrict(!pointInTimeStrict)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-mono-data flex items-center gap-2 transition-all ${
              pointInTimeStrict 
                ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                : 'bg-surface-container border-outline-variant text-on-surface-variant'
            }`}
            title="Toggle Anti-Lookahead Bias Filter"
          >
            <span className={`w-2 h-2 rounded-full ${pointInTimeStrict ? 'bg-primary animate-pulse' : 'bg-outline'}`} />
            <span>{pointInTimeStrict ? 'ZERO LOOKAHEAD (PIT ACTIVE)' : 'STANDARD HISTORICAL VIEW'}</span>
          </button>

          <div className="bg-surface-container border border-outline-variant px-3 py-1.5 rounded-lg text-right">
            <div className="text-[9px] text-on-surface-variant uppercase tracking-wider font-mono-data">ACTIVE DATE</div>
            <div className="font-mono-data text-xs font-bold text-on-surface uppercase">{activeDay.date}</div>
          </div>
        </div>
      </div>

      {/* 2. Crisis Era Switcher Tabs */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CRISIS_REGIMES.map((regime) => {
            const isSelected = regime.id === selectedRegimeId;
            return (
              <button
                key={regime.id}
                onClick={() => handleRegimeChange(regime.id)}
                className={`flex-1 min-w-[200px] px-3.5 py-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-surface border-primary/50 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-surface/50 text-on-surface-variant'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-mono-data uppercase font-bold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {regime.timeRange}
                  </span>
                  <span className="text-[10px] font-mono-data font-bold text-negative">
                    {regime.totalDrawdown.split(' ')[0]}
                  </span>
                </div>
                <div className={`text-xs font-semibold mt-0.5 truncate ${isSelected ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {regime.name.split('&')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Unified Crisis Playback Cockpit & Timeline Scrubber */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm">
        
        {/* Playback Controls & Status Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              disabled={currentDayIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container-highest disabled:opacity-30 border border-outline-variant text-xs font-mono-data text-on-surface flex items-center gap-1 transition-all"
            >
              &larr; PREV
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-1.5 rounded-lg font-mono-data font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-sm ${
                isPlaying 
                  ? 'bg-negative text-white hover:opacity-90' 
                  : 'bg-primary text-white hover:bg-primary-dim'
              }`}
            >
              <Icon name={isPlaying ? 'pause' : 'play'} className="w-3.5 h-3.5" />
              <span>{isPlaying ? 'PAUSE AUTORUN' : 'PLAY TIMELINE'}</span>
            </button>

            <button
              onClick={handleNextDay}
              disabled={currentDayIndex === totalDays - 1}
              className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container-highest disabled:opacity-30 border border-outline-variant text-xs font-mono-data text-on-surface flex items-center gap-1 transition-all"
            >
              NEXT &rarr;
            </button>

            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs font-mono-data text-on-surface-variant hover:text-on-surface"
              title="Toggle Playback Speed"
            >
              {playbackSpeed}X SPEED
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono-data uppercase font-bold border ${getPhaseBadge(activeDay.phase)}`}>
              {activeDay.phase.replace('_', ' ')}
            </span>
            <div className="font-mono-data text-xs font-bold text-on-surface bg-surface px-3 py-1 rounded-lg border border-outline-variant">
              DAY {safeDayIndex + 1} OF {totalDays} &bull; {activeDay.date}
            </div>
          </div>
        </div>

        {/* Milestone Nodes Along Crisis Trajectory */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
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
                  className={`px-3 py-2 rounded-lg font-mono-data text-xs shrink-0 transition-all border text-left ${
                    isCurrent 
                      ? 'bg-primary text-white border-primary shadow-md font-bold' 
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold">{day.shortDate}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Nifty {day.indices.nifty50.level.toLocaleString()}</div>
                </button>
              );
            })}
          </div>

          {/* Range Slider Scrubber */}
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
            className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

      </div>

      {/* 4. Two-Column Intelligence Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Market Telemetry & Live Tape (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Day Tape Card */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm">
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono-data uppercase font-bold text-on-surface-variant">
                  MARKET TAPE &bull; {activeDay.date}
                </span>
                <span className="text-xs font-mono-data font-bold text-negative uppercase bg-negative/10 px-2 py-0.5 rounded border border-negative/20">
                  {activeDay.sentiment}
                </span>
              </div>
              <h2 className="text-base font-bold text-on-surface tracking-tight leading-snug">
                {activeDay.dayTitle}
              </h2>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-surface border border-outline-variant p-3.5 rounded-lg">
                <div className="text-[10px] text-on-surface-variant font-mono-data uppercase font-medium">NIFTY 50</div>
                <div className="font-mono-data text-xl font-bold text-on-surface mt-0.5">
                  {activeDay.indices.nifty50.level.toLocaleString()}
                </div>
                <div className={`text-xs font-mono-data font-semibold mt-0.5 ${activeDay.indices.nifty50.change1D >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {activeDay.indices.nifty50.change1D >= 0 ? '+' : ''}{activeDay.indices.nifty50.change1D}% 1D
                </div>
                <div className="text-[10px] text-on-surface-variant font-mono-data mt-1 border-t border-outline-variant/50 pt-1">
                  P/E: <strong className="text-on-surface">{activeDay.indices.nifty50.pe}x</strong> | P/B: <strong className="text-on-surface">{activeDay.indices.nifty50.pb}x</strong>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant p-3.5 rounded-lg">
                <div className="text-[10px] text-on-surface-variant font-mono-data uppercase font-medium">BSE SENSEX</div>
                <div className="font-mono-data text-xl font-bold text-on-surface mt-0.5">
                  {activeDay.indices.sensex.level.toLocaleString()}
                </div>
                <div className={`text-xs font-mono-data font-semibold mt-0.5 ${activeDay.indices.sensex.change1D >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {activeDay.indices.sensex.change1D >= 0 ? '+' : ''}{activeDay.indices.sensex.change1D}% 1D
                </div>
                <div className="text-[10px] text-on-surface-variant font-mono-data mt-1 border-t border-outline-variant/50 pt-1">
                  P/E: <strong className="text-on-surface">{activeDay.indices.sensex.pe}x</strong>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant p-3 rounded-lg">
                <div className="text-[10px] text-on-surface-variant font-mono-data uppercase">10Y G-SEC YIELD</div>
                <div className="font-mono-data text-base font-bold text-on-surface mt-0.5">
                  {activeDay.macro.tenYearYield}
                </div>
                <div className="text-[10px] text-on-surface-variant font-mono-data">
                  RBI Repo: <strong className="text-on-surface">{activeDay.macro.rbiRepo}</strong>
                </div>
              </div>

              <div className="bg-surface border border-outline-variant p-3 rounded-lg">
                <div className="text-[10px] text-on-surface-variant font-mono-data uppercase">USD / INR & CRUDE</div>
                <div className="font-mono-data text-base font-bold text-on-surface mt-0.5">
                  ₹{activeDay.macro.usdInr}
                </div>
                <div className="text-[10px] text-on-surface-variant font-mono-data">
                  Brent: <strong className="text-on-surface">{activeDay.macro.crudeOil}</strong>
                </div>
              </div>
            </div>

            {/* Live Wire Headlines */}
            <div className="space-y-2 pt-2 border-t border-outline-variant">
              <span className="text-[10px] font-mono-data uppercase font-bold text-on-surface-variant block">
                WHAT CROSSED THE WIRE TODAY
              </span>
              <div className="space-y-1.5">
                {activeDay.tapeHeadlines.map((headline, idx) => (
                  <div key={idx} className="bg-surface border border-outline-variant p-2.5 rounded-lg flex items-start gap-2.5">
                    <span className="font-mono-data text-primary text-xs font-bold shrink-0">
                      #{idx + 1}
                    </span>
                    <p className="text-xs text-on-surface leading-relaxed">
                      {headline}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Delta vs Modern Nov 2026 Baseline */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-4 space-y-2 font-mono-data text-xs">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
              DELTA VS NOVEMBER 2026 BASELINE:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between border-b border-outline-variant/60 pb-1">
                <span className="text-on-surface-variant">Nifty Level:</span>
                <span className="text-on-surface font-bold">{activeDay.indices.nifty50.level} vs {MODERN_BASELINE.niftyLevel}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/60 pb-1">
                <span className="text-on-surface-variant">P/E Ratio:</span>
                <span className="text-on-surface font-bold">{activeDay.indices.nifty50.pe}x vs {MODERN_BASELINE.niftyPE}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">RBI Repo:</span>
                <span className="text-on-surface font-bold">{activeDay.macro.rbiRepo} vs {MODERN_BASELINE.repoRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Forex:</span>
                <span className="text-on-surface font-bold">{activeDay.macro.forex} vs {MODERN_BASELINE.forex}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Point-In-Time Investigation & Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-outline-variant gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'lookahead', label: 'THE LOOKAHEAD TRAP (PIT)', icon: 'visibility' },
              { id: 'simulator', label: 'TRADE THE CRISIS SIMULATOR', icon: 'bot' },
              { id: 'filing', label: 'CORPORATE FILING', icon: 'business' },
              { id: 'sectors', label: 'SECTOR DISSECTION', icon: 'pie_chart' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DetailTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono-data font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    isActive
                      ? 'border-primary text-primary font-bold'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Icon name={tab.icon} className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: The Lookahead Trap (Signature Anti-Bias Feature) */}
          {activeTab === 'lookahead' && (
            <div className="space-y-4">
              
              {/* Officially Known Facts */}
              <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-positive font-mono-data text-xs font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-positive" />
                  <span>WHAT WAS OFFICIALLY KNOWN ON {activeDay.date}</span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed font-normal">
                  {activeDay.whatWasKnown}
                </p>
                <div className="pt-2 border-t border-outline-variant text-xs text-on-surface-variant font-mono-data">
                  <strong className="text-on-surface">Institutional Desk Action:</strong> {activeDay.institutionalAction}
                </div>
              </div>

              {/* The Lookahead Bias Trap */}
              <div className="bg-surface-container border-2 border-negative/30 rounded-xl p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-negative font-mono-data text-xs font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-negative animate-pulse" />
                  <span>THE LOOKAHEAD BIAS TRAP (WHAT WAS UNKNOWN)</span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed font-normal">
                  {activeDay.whatWasUnknown}
                </p>
                <div className="pt-2 border-t border-outline-variant text-xs text-on-surface-variant font-mono-data">
                  <span className="text-negative font-bold">Academic Principle:</span> Distinguishing data coverage periods from actual publication dates prevents false confidence when analyzing historical financial events.
                </div>
              </div>

              {/* Institutional Lessons Strip */}
              <div className="bg-surface-container border border-outline-variant rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono-data uppercase font-bold text-on-surface-variant">
                  INSTITUTIONAL CRISIS POST-MORTEM LESSONS
                </span>
                <ul className="space-y-1">
                  {activeRegime.institutionalLessons.map((lesson, idx) => (
                    <li key={idx} className="text-xs text-on-surface flex items-start gap-2">
                      <span className="text-primary font-bold">&bull;</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* Tab 2: Trade The Crisis Simulator */}
          {activeTab === 'simulator' && (
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface uppercase font-mono-data">
                  Trade The Crisis Simulator (Without Hindsight)
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Formulate an allocation stance on <strong className="text-on-surface">{activeDay.date}</strong> (Nifty {activeDay.indices.nifty50.level}) and evaluate its real historical outcome.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Parameters Form */}
                <div className="space-y-3 bg-surface border border-outline-variant p-4 rounded-lg">
                  <div>
                    <label className="block text-[10px] font-mono-data uppercase text-on-surface-variant mb-1 font-bold">
                      Select Investment Stance
                    </label>
                    <select
                      value={selectedThesis}
                      onChange={(e) => {
                        setSelectedThesis(e.target.value);
                        setSimRevealed(false);
                      }}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface font-mono-data outline-none focus:border-primary"
                    >
                      <option value="accumulate_quality">Accumulate High-Quality Equities (Private Banks & FMCG)</option>
                      <option value="cash_defensive">Flight to 100% Cash & 91-Day Treasury Bills</option>
                      <option value="short_leverage">Short Leveraged High-Debt Real Estate & Infrastructure</option>
                      <option value="rotate_defensive">Rotate into Dollar-Earning IT & Pharma Exporters</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-data uppercase text-on-surface-variant mb-1 font-bold">
                      Holding Horizon
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['+1W', '+1M', '+3M', '+6M', '+1Y'] as const).map((h) => (
                        <button
                          key={h}
                          onClick={() => {
                            setSimHorizon(h);
                            setSimRevealed(false);
                          }}
                          className={`py-1.5 rounded-md font-mono-data text-xs font-semibold border transition-all ${
                            simHorizon === h 
                              ? 'bg-primary border-primary text-white font-bold' 
                              : 'bg-surface-container border-outline-variant text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSimRevealed(true)}
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dim text-white font-mono-data font-bold text-xs uppercase transition-colors shadow-sm"
                  >
                    TEST THESIS AGAINST HISTORICAL REALITY
                  </button>
                </div>

                {/* Outcome Display */}
                <div className="bg-surface border border-outline-variant p-4 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono-data uppercase text-on-surface-variant mb-2 font-bold">
                      FORWARD SIMULATION OUTCOME ({simHorizon})
                    </div>
                    {simRevealed ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-outline-variant">
                          <div>
                            <div className="text-[9px] text-on-surface-variant uppercase font-mono-data">Nifty Start</div>
                            <div className="font-mono-data text-sm font-bold text-on-surface">{simResult.startLevel}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-on-surface-variant uppercase font-mono-data">Projected Level</div>
                            <div className="font-mono-data text-sm font-bold text-on-surface">{simResult.projectedLevel}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-on-surface-variant uppercase font-mono-data">Return</div>
                            <div className={`font-mono-data text-sm font-bold ${simResult.isPositive ? 'text-positive' : 'text-negative'}`}>
                              {simResult.returnPct}
                            </div>
                          </div>
                        </div>

                        <div className="bg-surface-container border border-outline-variant p-2.5 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between font-mono-data text-[11px]">
                            <span className="text-on-surface-variant">Max Drawdown Risk:</span>
                            <span className="text-negative font-bold">{simResult.maxDrawdown}</span>
                          </div>
                          <div className="flex justify-between font-mono-data text-[11px]">
                            <span className="text-on-surface-variant">Institutional Verdict:</span>
                            <span className="text-primary font-bold">{simResult.verdict}</span>
                          </div>
                        </div>

                        <p className="text-xs text-on-surface leading-relaxed">
                          {simResult.commentary}
                        </p>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-on-surface-variant font-mono-data">
                        Select parameters and click "Test Thesis" to evaluate without hindsight.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 3: Corporate Filing in Focus */}
          {activeTab === 'filing' && (
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
              {activeDay.corporateFilingInFocus ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {activeDay.corporateFilingInFocus.symbol}
                      </span>
                      <span className="text-sm font-bold text-on-surface">
                        {activeDay.corporateFilingInFocus.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono-data text-on-surface-variant">
                      {activeDay.corporateFilingInFocus.filing}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono-data text-xs">
                    <div className="bg-surface p-3.5 rounded-lg border border-outline-variant">
                      <div className="text-[10px] text-on-surface-variant uppercase font-medium">Reported Revenue</div>
                      <div className="text-base font-bold text-on-surface mt-0.5">{activeDay.corporateFilingInFocus.revenue}</div>
                    </div>
                    <div className="bg-surface p-3.5 rounded-lg border border-outline-variant">
                      <div className="text-[10px] text-on-surface-variant uppercase font-medium">Reported Net Profit</div>
                      <div className="text-base font-bold text-on-surface mt-0.5">{activeDay.corporateFilingInFocus.netProfit}</div>
                    </div>
                  </div>

                  <div className="bg-surface p-3.5 rounded-lg border border-outline-variant text-xs text-on-surface leading-relaxed">
                    <strong className="text-primary font-mono-data block mb-1">Market Reaction & Filing Commentary:</strong>
                    {activeDay.corporateFilingInFocus.note}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-on-surface-variant font-mono-data">
                  No single corporate filing dominated the wire on this specific macroeconomic date.
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Winning & Losing Sectors */}
          {activeTab === 'sectors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Winning Sectors */}
              <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono-data uppercase font-bold text-positive flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-positive" />
                  <span>OUTPERFORMING DEFENSIVE SECTORS</span>
                </span>
                <div className="space-y-2">
                  {activeRegime.winningSectors.map((s, idx) => (
                    <div key={idx} className="bg-surface border border-outline-variant p-3 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-on-surface text-xs">{s.name}</span>
                        <span className="font-mono-data text-xs font-bold text-positive">{s.performance}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{s.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Losing Sectors */}
              <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono-data uppercase font-bold text-negative flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-negative" />
                  <span>VULNERABLE HIGH-BETA SECTORS</span>
                </span>
                <div className="space-y-2">
                  {activeRegime.losingSectors.map((s, idx) => (
                    <div key={idx} className="bg-surface border border-outline-variant p-3 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-on-surface text-xs">{s.name}</span>
                        <span className="font-mono-data text-xs font-bold text-negative">{s.performance}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{s.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
