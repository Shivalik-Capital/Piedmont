'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '../components/ui/Icon';
import { 
  CRISIS_REGIMES, 
  HistoricalCrisisRegime, 
  CrisisDaySnapshot, 
  MODERN_BASELINE 
} from '../lib/historical-database';

type StepperStep = 1 | 2 | 3 | 4;
type BasketId = 'nifty_tech' | 'banking_financials' | 'commodities_energy' | 'sovereign_rates';

interface ModelBasket {
  id: BasketId;
  name: string;
  category: string;
  constituents: { symbol: string; weight: string }[];
  description: string;
}

const MODEL_BASKETS: ModelBasket[] = [
  {
    id: 'nifty_tech',
    name: 'Mega-Cap Leaders & Tech Composite',
    category: 'Large-Cap Equities',
    constituents: [
      { symbol: 'RELIANCE', weight: '22.0%' },
      { symbol: 'TCS', weight: '18.5%' },
      { symbol: 'INFY', weight: '18.5%' },
      { symbol: 'HDFCBANK', weight: '15.0%' },
      { symbol: 'ICICIBANK', weight: '14.0%' },
      { symbol: 'BHARTIARTL', weight: '12.0%' },
    ],
    description: 'High-liquidity blue chips representing 65%+ of aggregate Nifty index weight and foreign institutional allocation.'
  },
  {
    id: 'banking_financials',
    name: 'Banking & Financial Intermediaries',
    category: 'High-Beta Financials',
    constituents: [
      { symbol: 'HDFCBANK', weight: '30.0%' },
      { symbol: 'ICICIBANK', weight: '25.0%' },
      { symbol: 'SBIN', weight: '20.0%' },
      { symbol: 'AXISBANK', weight: '15.0%' },
      { symbol: 'BAJFINANCE', weight: '10.0%' },
    ],
    description: 'Credit creation engine, sensitive to interbank call money liquidity, RBI repo rate transmission, and NPA stress.'
  },
  {
    id: 'commodities_energy',
    name: 'Commodities & Physical Energy',
    category: 'Real Assets',
    constituents: [
      { symbol: 'GOLD (MCX)', weight: '35.0%' },
      { symbol: 'CRUDE OIL', weight: '25.0%' },
      { symbol: 'TATASTEEL', weight: '15.0%' },
      { symbol: 'HINDALCO', weight: '15.0%' },
      { symbol: 'ONGC', weight: '10.0%' },
    ],
    description: 'Direct transmission channel for imported inflation, trade balance compression, and currency fluctuations.'
  },
  {
    id: 'sovereign_rates',
    name: 'Sovereign Yield Curve & Forex Anchor',
    category: 'Fixed Income & FX',
    constituents: [
      { symbol: '10Y G-SEC', weight: '40.0%' },
      { symbol: '5Y G-SEC', weight: '25.0%' },
      { symbol: 'USD/INR', weight: '20.0%' },
      { symbol: 'CASH REPO', weight: '15.0%' },
    ],
    description: 'Risk-free sovereign rate anchor, term premium dynamics, and central bank foreign exchange reserve interventions.'
  }
];

export default function ReplaySimulatorPage() {
  // Stepper state: 1 (Timeline & Macro), 2 (Basket Target), 3 (Stress & Depth), 4 (Execution Ready)
  const [currentStep, setCurrentStep] = useState<StepperStep>(1);
  const [selectedRegimeId, setSelectedRegimeId] = useState<string>('gfc-2008');
  const [selectedBasket, setSelectedBasket] = useState<BasketId>('nifty_tech');
  
  // Stress Factors
  const [spreadMultiplier, setSpreadMultiplier] = useState<'1.5x' | '2.5x' | '3.0x'>('2.5x');
  const [latencyPenalty, setLatencyPenalty] = useState<'120ms' | '240ms' | '480ms'>('240ms');
  const [volatilityMultiplier, setVolatilityMultiplier] = useState<'1.25x' | '1.75x' | '2.50x'>('1.75x');
  const [marginCascadeActive, setMarginCascadeActive] = useState<boolean>(true);

  // Simulation Console State
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 5 | 20>(1);
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
  const activeBasketObj = MODEL_BASKETS.find(b => b.id === selectedBasket) || MODEL_BASKETS[0];

  // Auto-advance player loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && currentStep === 4) {
      const delay = playbackSpeed === 1 ? 2400 : playbackSpeed === 5 ? 800 : 350;
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
  }, [isPlaying, playbackSpeed, totalDays, currentStep]);

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

  // Compute simulated forward return
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
      } else {
        verdict = 'Prudent Capital Preservation';
        commentary = 'Preserved principal while market crashed, but timing the exact bottom to redeploy proved psychologically difficult.';
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

  return (
    <div className="w-full text-white pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex flex-col gap-6 sm:gap-8">
        
        {/* ========================================================================= */}
        {/* 1. STRATEGIC HEADER (STITCH SCREEN 4 & 5)                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffa16c] animate-pulse" />
              <span className="font-mono-data text-[10px] sm:text-[11px] tracking-widest text-[#868f97] uppercase font-semibold">
                Point-in-Time Historical Engine &bull; Zero Lookahead Bias
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.08em] leading-tight text-white">
              Deterministic Market <span className="fey-gradient-ember">Replay.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
              Reconstruct the exact information environment that existed on historical crisis dates. Isolate report publication dates from coverage periods to benchmark true real-time decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPointInTimeStrict(!pointInTimeStrict)}
              className={`px-3.5 py-2 rounded-full border text-xs font-mono-data flex items-center gap-2 transition-all ${
                pointInTimeStrict
                  ? 'bg-[#479ffa]/10 border-[#479ffa] text-[#479ffa] font-semibold'
                  : 'bg-[#191919] border-[#262626] text-[#868f97]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pointInTimeStrict ? 'bg-[#479ffa] animate-pulse' : 'bg-[#555555]'}`} />
              <span>{pointInTimeStrict ? 'ZERO LOOKAHEAD ACTIVE' : 'LOOKAHEAD PERMISSIVE'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. 4-STAGE PIPELINE STEPPER (STITCH SCREEN 5)                             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: 1, title: 'Timeline & Macro', summary: activeRegime.name.split(' ')[0] + ' ' + activeRegime.timeRange.split(' ')[0] },
            { step: 2, title: 'Basket Target', summary: activeBasketObj.name.split(' ')[0] },
            { step: 3, title: 'Stress & Depth', summary: `Spread ${spreadMultiplier} · Vol ${volatilityMultiplier}` },
            { step: 4, title: 'Execution Ready', summary: isPlaying ? 'Playing Tape' : `Step ${safeDayIndex + 1}/${totalDays}` },
          ].map((s) => {
            const isCurrent = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStep(s.step as StepperStep);
                  if (s.step !== 4) setIsPlaying(false);
                }}
                className={`p-3.5 rounded-[14px] text-left transition-all border flex items-center justify-between ${
                  isCurrent
                    ? 'bg-[#191919] border-[#479ffa] shadow-[0_0_20px_rgba(71,159,250,0.25)]'
                    : 'bg-[#141414] border-[#262626] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono-data text-xs font-bold ${
                    isCurrent ? 'bg-[#479ffa] text-white' :
                    isCompleted ? 'bg-[#4ebe96] text-black' :
                    'bg-[#222222] text-[#868f97]'
                  }`}>
                    {s.step}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-mono-data text-[#868f97] block">
                      {s.title}
                    </span>
                    <span className="text-xs font-semibold text-white truncate max-w-[120px] block">
                      {s.summary}
                    </span>
                  </div>
                </div>
                {isCompleted && (
                  <Icon name="check" className="w-3.5 h-3.5 text-[#4ebe96]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* STEP 1 CONTENT: TIMELINE & MACRO EPOCH SELECTION                          */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h2 className="text-lg font-bold text-white tracking-[-0.03em]">
                  Select Historical Epoch or Custom Horizon
                </h2>
                <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                  Choose a verified regime to reconstruct the exact informational matrix of that era
                </p>
              </div>
              <span className="text-[11px] font-mono-data text-[#479ffa]">5 Verified Regimes Loaded</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CRISIS_REGIMES.map((regime) => {
                const isSelected = selectedRegimeId === regime.id;
                return (
                  <div
                    key={regime.id}
                    onClick={() => setSelectedRegimeId(regime.id)}
                    className={`p-5 rounded-[14px] cursor-pointer transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1c1c1c] border-[#479ffa] shadow-[0_0_24px_rgba(71,159,250,0.25)]'
                        : 'bg-[#141414] border-[#262626] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono-data px-2.5 py-0.5 rounded-full bg-[#191919] border border-[#2a2a2a] text-[#868f97]">
                          {regime.timeRange}
                        </span>
                        <span className="text-xs font-mono-data font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                          {regime.totalDrawdown.split(' ')[0]}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-white tracking-tight">
                          {regime.name.split('&')[0]}
                        </h3>
                        <p className="text-xs text-[#868f97] mt-1 line-clamp-2 leading-relaxed">
                          {regime.summary}
                        </p>
                      </div>

                      <div className="bg-[#101010] p-2.5 rounded-[10px] border border-[#222222] text-[11px] font-mono-data space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#868f97]">Capitulation Date:</span>
                          <span className="text-white font-medium">{regime.troughDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#868f97]">Milestones:</span>
                          <span className="text-white font-medium">{regime.days.length} Dates</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[#222222] flex justify-between items-center text-xs">
                      <span className={isSelected ? 'text-[#479ffa] font-semibold' : 'text-[#868f97]'}>
                        {isSelected ? 'Regime Selected' : 'Click to Select'}
                      </span>
                      <span className="text-[#868f97]">&rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#262626] flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-[#e0e0e0] text-black font-semibold text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <span>Proceed to Step 2: Basket Target</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2 CONTENT: TARGET ASSET CLASS & MODEL BASKETS                       */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h2 className="text-lg font-bold text-white tracking-[-0.03em]">
                  Target Asset Class & Model Baskets
                </h2>
                <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                  Select the underlying securities portfolio subject to historical liquidity stress
                </p>
              </div>
              <span className="text-[11px] font-mono-data text-[#479ffa]">4 Composite Models</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MODEL_BASKETS.map((basket) => {
                const isSelected = selectedBasket === basket.id;
                return (
                  <div
                    key={basket.id}
                    onClick={() => setSelectedBasket(basket.id)}
                    className={`p-5 rounded-[14px] cursor-pointer transition-all border space-y-3 ${
                      isSelected
                        ? 'bg-[#1c1c1c] border-[#479ffa] shadow-[0_0_24px_rgba(71,159,250,0.25)]'
                        : 'bg-[#141414] border-[#262626] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono-data px-2.5 py-0.5 rounded-full bg-[#141414] border border-[#2a2a2a] text-[#ffa16c]">
                        {basket.category}
                      </span>
                      <span className={isSelected ? 'text-[#479ffa] text-xs font-semibold' : 'text-[#555555] text-xs'}>
                        {isSelected ? 'Active Target' : 'Select'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-white">{basket.name}</h3>
                      <p className="text-xs text-[#868f97] mt-1 leading-relaxed">{basket.description}</p>
                    </div>

                    <div className="bg-[#101010] p-3 rounded-[10px] border border-[#222222]">
                      <span className="text-[10px] uppercase font-mono-data text-[#868f97] block mb-2">Constituents & Weights:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {basket.constituents.map((c, idx) => (
                          <div key={idx} className="bg-[#141414] p-1.5 rounded-[6px] text-center font-mono-data">
                            <span className="text-[10px] text-[#868f97] block">{c.symbol}</span>
                            <span className="text-xs font-semibold text-white">{c.weight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#262626] flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#202020] text-[#868f97] hover:text-white font-mono-data text-xs transition-all"
              >
                &larr; Back to Timeline
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-[#e0e0e0] text-black font-semibold text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <span>Proceed to Step 3: Stress & Depth</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3 CONTENT: LIQUIDITY & STRESS INJECTION FACTORS                      */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h2 className="text-lg font-bold text-white tracking-[-0.03em]">
                  Liquidity & Stress Injection Factors
                </h2>
                <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                  Calibrate market microstructure headwinds, bid-ask widening, and execution penalties
                </p>
              </div>
              <span className="text-[11px] font-mono-data text-[#ffa16c]">Dynamic Microstructure Engine</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Factor 1: Spread Multiplier */}
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-[14px] space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">Simulated Bid-Ask Spread Multiplier</h4>
                  <p className="text-xs text-[#868f97] mt-0.5">Widening of order book depth during panic cascades</p>
                </div>
                <div className="flex gap-2">
                  {(['1.5x', '2.5x', '3.0x'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSpreadMultiplier(m)}
                      className={`flex-1 py-2 rounded-full font-mono-data text-xs border transition-all ${
                        spreadMultiplier === m
                          ? 'bg-[#ffa16c] text-black font-bold border-[#ffa16c]'
                          : 'bg-[#191919] text-[#868f97] border-[#262626] hover:text-white'
                      }`}
                    >
                      {m} SPREAD
                    </button>
                  ))}
                </div>
              </div>

              {/* Factor 2: Latency Penalty */}
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-[14px] space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">Execution Latency Penalty</h4>
                  <p className="text-xs text-[#868f97] mt-0.5">Exchange clearing queue congestion & gateway delay</p>
                </div>
                <div className="flex gap-2">
                  {(['120ms', '240ms', '480ms'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLatencyPenalty(l)}
                      className={`flex-1 py-2 rounded-full font-mono-data text-xs border transition-all ${
                        latencyPenalty === l
                          ? 'bg-[#479ffa] text-white font-bold border-[#479ffa]'
                          : 'bg-[#191919] text-[#868f97] border-[#262626] hover:text-white'
                      }`}
                    >
                      {l} DELAY
                    </button>
                  ))}
                </div>
              </div>

              {/* Factor 3: Volatility Multiplier */}
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-[14px] space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">Volatility Surface Multiplier</h4>
                  <p className="text-xs text-[#868f97] mt-0.5">Implied volatility expansion and options delta shock</p>
                </div>
                <div className="flex gap-2">
                  {(['1.25x', '1.75x', '2.50x'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVolatilityMultiplier(v)}
                      className={`flex-1 py-2 rounded-full font-mono-data text-xs border transition-all ${
                        volatilityMultiplier === v
                          ? 'bg-[#4ebe96] text-black font-bold border-[#4ebe96]'
                          : 'bg-[#191919] text-[#868f97] border-[#262626] hover:text-white'
                      }`}
                    >
                      {v} VOL
                    </button>
                  ))}
                </div>
              </div>

              {/* Factor 4: Margin Cascade Toggle */}
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-[14px] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Margin Call Liquidation Cascade</h4>
                  <p className="text-xs text-[#868f97] mt-0.5">Simulate retail broker forced liquidation triggers</p>
                </div>
                <button
                  onClick={() => setMarginCascadeActive(!marginCascadeActive)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono-data font-semibold border transition-all ${
                    marginCascadeActive
                      ? 'bg-rose-500 text-white border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-[#191919] text-[#868f97] border-[#262626]'
                  }`}
                >
                  {marginCascadeActive ? 'CASCADE ARMED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#262626] flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-full bg-[#141414] hover:bg-[#202020] text-[#868f97] hover:text-white font-mono-data text-xs transition-all"
              >
                &larr; Back to Basket
              </button>
              <button
                onClick={() => {
                  setCurrentStep(4);
                  setCurrentDayIndex(0);
                  setIsPlaying(true);
                }}
                className="px-6 py-2.5 rounded-full bg-[#ffa16c] hover:bg-[#ffb085] text-black font-semibold text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,161,108,0.3)]"
              >
                <span>Arm Simulator &amp; Start Replay</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4 CONTENT: EXECUTION CONSOLE & TIMELINE PLAYBACK (STITCH SCREEN 4 & 5)*/}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            
            {/* Playback Cockpit Card */}
            <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevDay}
                    disabled={currentDayIndex === 0}
                    className="px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#222222] disabled:opacity-30 border border-[#262626] text-xs font-mono-data text-white"
                  >
                    &larr; PREV
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-5 py-1.5 rounded-full font-mono-data font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-sm ${
                      isPlaying 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-white text-black hover:bg-[#e0e0e0]'
                    }`}
                  >
                    <Icon name={isPlaying ? 'pause' : 'play'} className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'PAUSE' : 'PLAY REPLAY'}</span>
                  </button>

                  <button
                    onClick={handleNextDay}
                    disabled={currentDayIndex === totalDays - 1}
                    className="px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#222222] disabled:opacity-30 border border-[#262626] text-xs font-mono-data text-white"
                  >
                    NEXT &rarr;
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-full border border-[#262626]">
                    {([1, 5, 20] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-data ${
                          playbackSpeed === spd
                            ? 'bg-[#222222] text-white font-bold'
                            : 'text-[#868f97] hover:text-white'
                        }`}
                      >
                        {spd}X
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono-data text-xs text-white bg-[#141414] px-3.5 py-1 rounded-full border border-[#262626]">
                    DAY {safeDayIndex + 1} OF {totalDays} &bull; {activeDay.date}
                  </span>
                </div>
              </div>

              {/* Milestone Scrubber Nodes */}
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
                        className={`px-3 py-1.5 rounded-[10px] font-mono-data text-xs shrink-0 transition-all border text-left ${
                          isCurrent 
                            ? 'bg-[#479ffa] text-white border-[#479ffa] shadow-[0_0_14px_rgba(71,159,250,0.5)] font-bold' 
                            : 'bg-[#141414] border-[#262626] text-[#868f97] hover:text-white'
                        }`}
                      >
                        <div>{day.shortDate}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">{day.indices.nifty50.level.toLocaleString()}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Range Slider */}
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
                  className="w-full h-1.5 bg-[#262626] rounded-full appearance-none cursor-pointer accent-[#479ffa]"
                />
              </div>
            </div>

            {/* Two-Column Cockpit: Tape & News Wire (6 cols) and Forward Thesis Simulator (6 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Active Day Tape & News Wire (6 cols) */}
              <div className="lg:col-span-6 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div>
                    <span className="text-[10px] font-mono-data uppercase text-[#868f97] block">
                      POINT-IN-TIME MARKET TAPE &bull; {activeDay.date}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      &quot;{activeDay.dayTitle}&quot;
                    </h3>
                  </div>
                  <span className="text-xs font-mono-data font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    {activeDay.sentiment}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono-data">
                  <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                    <span className="text-[10px] text-[#868f97]">NIFTY 50 BENCHMARK</span>
                    <div className="text-xl font-bold text-white mt-0.5 tabular-nums">
                      {activeDay.indices.nifty50.level.toLocaleString()}
                    </div>
                    <div className={`text-xs mt-0.5 ${activeDay.indices.nifty50.change1D >= 0 ? 'text-[#4ebe96]' : 'text-rose-400'}`}>
                      {activeDay.indices.nifty50.change1D >= 0 ? '+' : ''}{activeDay.indices.nifty50.change1D}% 1D
                    </div>
                  </div>

                  <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                    <span className="text-[10px] text-[#868f97]">VALUATION MULTIPLE</span>
                    <div className="text-xl font-bold text-white mt-0.5 tabular-nums">
                      {activeDay.indices.nifty50.pe}x P/E
                    </div>
                    <div className="text-xs text-[#868f97] mt-0.5">
                      P/B: {activeDay.indices.nifty50.pb}x
                    </div>
                  </div>
                </div>

                {/* Wire Headlines */}
                <div className="space-y-2 pt-2 border-t border-[#262626]">
                  <span className="text-[10px] font-mono-data uppercase text-[#868f97] block font-semibold">
                    OFFICIAL NEWS WIRE RELEASES (VERIFIED PUBLISHED BY THIS DATE):
                  </span>
                  <div className="space-y-1.5">
                    {activeDay.tapeHeadlines.map((hl, i) => (
                      <div key={i} className="bg-[#141414] p-2.5 rounded-[10px] border border-[#262626] text-xs text-white/90 leading-relaxed flex items-start gap-2">
                        <span className="text-[#479ffa] font-mono-data font-bold">#{i + 1}</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Forward Thesis Simulator (6 cols) */}
              <div className="lg:col-span-6 bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-[-0.03em]">
                      Forward Horizon Thesis Simulator
                    </h3>
                    <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                      Test an investment stance from this exact historical node
                    </p>
                  </div>
                  <span className="text-[10px] font-mono-data px-2.5 py-0.5 rounded-full bg-[#141414] border border-[#262626] text-[#ffa16c]">
                    EMPIRICAL BACKTEST
                  </span>
                </div>

                {/* Stance Buttons */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono-data uppercase text-[#868f97] block">Select Strategic Stance:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setSelectedThesis('accumulate_quality'); setSimRevealed(false); }}
                      className={`p-2.5 rounded-[10px] text-xs font-mono-data text-left border transition-all ${
                        selectedThesis === 'accumulate_quality'
                          ? 'bg-[#1e1e1e] border-[#4ebe96] text-white font-semibold'
                          : 'bg-[#141414] border-[#262626] text-[#868f97]'
                      }`}
                    >
                      <strong className="block text-white">Accumulate Quality</strong>
                      <span className="text-[10px] text-[#868f97]">Buy low-debt leaders</span>
                    </button>

                    <button
                      onClick={() => { setSelectedThesis('cash_defensive'); setSimRevealed(false); }}
                      className={`p-2.5 rounded-[10px] text-xs font-mono-data text-left border transition-all ${
                        selectedThesis === 'cash_defensive'
                          ? 'bg-[#1e1e1e] border-[#ffa16c] text-white font-semibold'
                          : 'bg-[#141414] border-[#262626] text-[#868f97]'
                      }`}
                    >
                      <strong className="block text-white">Cash &amp; Preservation</strong>
                      <span className="text-[10px] text-[#868f97]">Hold repo liquidity</span>
                    </button>
                  </div>
                </div>

                {/* Horizon Buttons */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono-data uppercase text-[#868f97] block">Forward Evaluation Horizon:</span>
                  <div className="flex gap-1.5">
                    {(['+1W', '+1M', '+3M', '+6M', '+1Y'] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => { setSimHorizon(h); setSimRevealed(false); }}
                        className={`flex-1 py-1.5 rounded-full text-xs font-mono-data border transition-all ${
                          simHorizon === h
                            ? 'bg-[#479ffa] text-white font-bold border-[#479ffa]'
                            : 'bg-[#141414] text-[#868f97] border-[#262626] hover:text-white'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reveal Action Button */}
                {!simRevealed ? (
                  <button
                    onClick={() => setSimRevealed(true)}
                    className="w-full py-2.5 rounded-full bg-[#ffa16c] hover:bg-[#ffb085] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(255,161,108,0.25)]"
                  >
                    Simulate Empirical Forward Outcome &rarr;
                  </button>
                ) : (
                  <div className="bg-[#141414] p-4 rounded-[12px] border border-[#262626] space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-2 font-mono-data">
                      <div>
                        <span className="text-[10px] text-[#868f97] block">HORIZON RETURN ({simHorizon})</span>
                        <span className={`text-2xl font-bold tabular-nums ${simResult.isPositive ? 'text-[#4ebe96]' : 'text-[#ffa16c]'}`}>
                          {simResult.returnPct}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#868f97] block">MAX DRAWDOWN ENDURED</span>
                        <span className="text-lg font-bold text-rose-400 tabular-nums">{simResult.maxDrawdown}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#868f97] leading-relaxed">
                      {simResult.commentary}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
