'use client';

import React, { useState } from 'react';
import { HISTORICAL_EPOCHS, HistoricalEpoch, getModernBaseline } from '../lib/historical-database';
import Icon from '../components/ui/Icon';

type WorkspaceTab = 'markets' | 'macro' | 'companies' | 'consensus' | 'thesis_lab' | 'comparative';

export default function HistoricalResearchPage() {
  const [selectedEpochId, setSelectedEpochId] = useState<string>('gfc-oct-2008');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('thesis_lab');
  const [pointInTimeStrict, setPointInTimeStrict] = useState<boolean>(true);
  
  // Thesis Simulator States
  const [selectedHorizon, setSelectedHorizon] = useState<'+1W' | '+1M' | '+3M' | '+6M' | '+1Y'>('+1M');
  const [userThesis, setUserThesis] = useState<string>('Long defensive consumer staples (HUL, ITC) and short leveraged debt-heavy real estate.');
  const [revealedSimulation, setRevealedSimulation] = useState<boolean>(false);

  const modernBaseline = getModernBaseline();
  const currentEpoch: HistoricalEpoch = 
    HISTORICAL_EPOCHS.find((e) => e.id === selectedEpochId) || HISTORICAL_EPOCHS[0];

  const isBaseline = currentEpoch.id === modernBaseline.id;

  const currentSimStep = currentEpoch.simulationSteps.find(s => s.horizon === selectedHorizon) 
    || currentEpoch.simulationSteps[0];

  const handleEpochChange = (id: string) => {
    setSelectedEpochId(id);
    setRevealedSimulation(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
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
            Historical Research Workspace
          </h1>
          <p className="text-xs text-[#cbd5e1] mt-1 max-w-3xl">
            Reconstruct the exact information environment available to an investor on a past date. Strictly eliminates lookahead bias by distinguishing data coverage periods from actual official availability dates.
          </p>
        </div>

        {/* Mode Pill & Date Badge */}
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
            <span>{pointInTimeStrict ? 'WHAT DID THEY KNOW? (PIT ACTIVE)' : 'STANDARD HISTORICAL VIEW'}</span>
          </button>
          
          <div className="bg-[#0f1520] border border-[#1c2840] px-3 py-1.5 rounded text-right">
            <div className="text-[9px] text-[#64748b] uppercase tracking-wider">ACTIVE DATE</div>
            <div className="font-mono-data text-xs font-bold text-white uppercase">{currentEpoch.date}</div>
          </div>
        </div>
      </div>

      {/* Point-in-Time Strict Lookahead Banner */}
      {pointInTimeStrict && (
        <div className="bg-[#0f1520] border-l-4 border-[#3b82f6] border-y border-r border-[#1c2840] p-3 text-xs flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-semibold text-white uppercase tracking-wider text-[10px]">
              Anti-Lookahead Bias Filter Active
            </span>
            <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
              Piedmont has strictly suppressed all earnings releases, macroeconomic prints, and central bank policy decisions published after <strong className="text-white">{currentEpoch.date}</strong>. You are observing the market exclusively through the information set available to an analyst on that morning.
            </p>
          </div>
          <span className="font-mono-data text-[9px] bg-[#3b82f6]/10 text-[#3b82f6] px-2 py-1 rounded shrink-0 uppercase">
            Zero Lookahead
          </span>
        </div>
      )}

      {/* Epoch / Historical Checkpoint Scrubber */}
      <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-3">
        <div className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
          <span>SELECT HISTORICAL RESEARCH ENVIRONMENT</span>
          <span className="font-mono-data text-[9px] text-[#3b82f6]">{HISTORICAL_EPOCHS.length} PRESET ENVIRONMENTS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {HISTORICAL_EPOCHS.map((epoch) => {
            const isSelected = epoch.id === selectedEpochId;
            return (
              <button
                key={epoch.id}
                onClick={() => handleEpochChange(epoch.id)}
                className={`flex flex-col p-2.5 rounded text-left transition-all ${
                  isSelected
                    ? 'bg-[#3b82f6]/15 border-2 border-[#3b82f6] shadow-lg'
                    : 'bg-[#080c14] border border-[#1c2840] hover:border-[#2a3f60]'
                }`}
              >
                <span className={`text-[9px] font-mono-data uppercase font-bold ${
                  isSelected ? 'text-[#3b82f6]' : 'text-[#64748b]'
                }`}>
                  {epoch.date}
                </span>
                <span className="text-xs font-semibold text-white truncate mt-0.5">
                  {epoch.name}
                </span>
                <span className="text-[9px] text-[#94a3b8] truncate mt-0.5">
                  Nifty {epoch.indices.nifty50.level} (P/E {epoch.indices.nifty50.pe}x)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Epoch Overview Banner */}
      <div className="bg-gradient-to-r from-[#0f1520] via-[#141c2b] to-[#0f1520] border border-[#2a3f60] rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono-data uppercase font-bold border ${
                currentEpoch.regimeType === 'crisis' ? 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30' :
                currentEpoch.regimeType === 'bubble' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30' :
                currentEpoch.regimeType === 'policy_shock' ? 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30' :
                'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30'
              }`}>
                {currentEpoch.regimeType.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono-data text-[#94a3b8]">{currentEpoch.date}</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {currentEpoch.headline}
            </h2>
            <p className="text-xs text-[#cbd5e1] max-w-4xl leading-relaxed pt-1">
              {currentEpoch.summary}
            </p>
          </div>

          {!isBaseline && (
            <div className="bg-[#080c14] border border-[#1c2840] p-3 rounded shrink-0 lg:w-72">
              <div className="text-[9px] uppercase tracking-wider text-[#64748b] font-semibold mb-1">
                DELTA VS OCTOBER 2026 BASELINE
              </div>
              <div className="space-y-1 font-mono-data text-xs">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Nifty Level:</span>
                  <span className="text-white font-bold">{currentEpoch.indices.nifty50.level} vs 25,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Nifty P/E:</span>
                  <span className="text-white font-bold">{currentEpoch.indices.nifty50.pe}x vs 22.8x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">RBI Repo:</span>
                  <span className="text-white font-bold">{currentEpoch.macro.rbiRepo.split(' ')[0]} vs 5.50%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Forex Reserves:</span>
                  <span className="text-white font-bold">{currentEpoch.macro.forexReserves} vs $721.0B</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Tabs Navigation Bar */}
      <div className="flex border-b border-[#1c2840] gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'thesis_lab', label: 'THESIS SIMULATOR (WITHOUT HINDSIGHT)', icon: 'bot' },
          { id: 'macro', label: 'MACRO INFORMATION SET (PIT)', icon: 'language' },
          { id: 'companies', label: 'CORPORATE FILINGS', icon: 'business' },
          { id: 'markets', label: 'MARKETS & PRICING', icon: 'show_chart' },
          { id: 'consensus', label: 'NEWS & MARKET PSYCHOLOGY', icon: 'schedule' },
          { id: 'comparative', label: 'CROSS-EPOCH COMPARISON', icon: 'history' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WorkspaceTab)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-mono-data whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-[#3b82f6] text-white font-bold bg-[#3b82f6]/5'
                  : 'border-transparent text-[#64748b] hover:text-[#cbd5e1] hover:bg-white/5'
              }`}
            >
              <Icon name={tab.icon} className={isActive ? 'text-[#3b82f6]' : 'text-current'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: THESIS SIMULATOR ("RESEARCH WITHOUT HINDSIGHT") */}
      {activeTab === 'thesis_lab' && (
        <div className="space-y-6">
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-4">
            <div className="border-b border-[#1c2840] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Simulation Laboratory: Invest Without Hindsight</span>
                  <span className="text-[9px] bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40 px-1.5 py-0.5 rounded font-mono-data">
                    LIVE BACKTEST
                  </span>
                </h3>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  You are an equity analyst standing on <strong>{currentEpoch.date}</strong>. Formulate a thesis based strictly on the data available today. Then advance the timeline to see what happened.
                </p>
              </div>

              <div className="flex items-center gap-1.5 font-mono-data text-xs">
                <span className="text-[#64748b] text-[10px] uppercase">HORIZON:</span>
                {(['+1W', '+1M', '+3M', '+6M', '+1Y'] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setSelectedHorizon(h);
                      setRevealedSimulation(false);
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedHorizon === h
                        ? 'bg-[#3b82f6] text-white font-bold'
                        : 'bg-[#080c14] border border-[#1c2840] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* User Thesis Form */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-semibold text-[#64748b] tracking-wider">
                Your Investment Thesis as of {currentEpoch.date}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userThesis}
                  onChange={(e) => setUserThesis(e.target.value)}
                  placeholder="e.g. Overweight FMCG, Underweight Real Estate and High-Debt NBFCs..."
                  className="flex-1 bg-[#080c14] border border-[#1c2840] rounded px-3 py-2 text-xs text-white placeholder-[#64748b] outline-none focus:border-[#3b82f6]"
                />
                <button
                  onClick={() => setRevealedSimulation(true)}
                  className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shrink-0"
                >
                  Advance Timeline to {currentSimStep?.futureDate || 'Future'} &rarr;
                </button>
              </div>
            </div>

            {/* Pre-Reveal Prompt */}
            {!revealedSimulation && (
              <div className="p-4 bg-[#080c14] border border-[#1c2840] rounded text-center space-y-2 text-xs text-[#64748b]">
                <p>
                  Click <strong>&quot;Advance Timeline&quot;</strong> to step forward to <strong>{currentSimStep?.futureDate}</strong>.
                </p>
                <p className="text-[11px] text-[#94a3b8]">
                  Piedmont will unlock newly published macroeconomic indicators, quarterly corporate filings, and the realized market return over this {selectedHorizon} window.
                </p>
              </div>
            )}

            {/* Revealed Outcome Block */}
            {revealedSimulation && currentSimStep && (
              <div className="space-y-4 pt-2 border-t border-[#1c2840] animate-in fade-in duration-300">
                <div className="flex items-center justify-between bg-[#141c2b] border border-[#2a3f60] p-3 rounded">
                  <div>
                    <span className="text-[10px] text-[#3b82f6] font-mono-data uppercase font-bold">
                      TIMELINE ADVANCED TO {currentSimStep.futureDate} ({currentSimStep.horizon})
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      Realized Nifty 50: {currentSimStep.niftyLevel.toLocaleString()} ({currentSimStep.niftyChange})
                    </h4>
                  </div>
                  <div className={`font-mono-data text-sm font-bold px-2.5 py-1 rounded ${
                    currentSimStep.niftyChange.startsWith('+') ? 'bg-[#34d399]/20 text-[#34d399]' : 'bg-[#f87171]/20 text-[#f87171]'
                  }`}>
                    {currentSimStep.niftyChange} RETURN
                  </div>
                </div>

                {/* Newly Unlocked Information Sets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#080c14] border border-[#1c2840] p-3.5 rounded space-y-2">
                    <h5 className="text-[10px] uppercase font-semibold text-[#f59e0b] tracking-wider">
                      Newly Unlocked Macroeconomic Prints
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#cbd5e1]">
                      {currentSimStep.macroReleasesUnlocked.map((m, idx) => (
                        <li key={idx} className="leading-relaxed">{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#080c14] border border-[#1c2840] p-3.5 rounded space-y-2">
                    <h5 className="text-[10px] uppercase font-semibold text-[#3b82f6] tracking-wider">
                      Newly Unlocked Corporate Earnings
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#cbd5e1]">
                      {currentSimStep.corporateEarningsUnlocked.map((c, idx) => (
                        <li key={idx} className="leading-relaxed">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Market Narrative Realization */}
                <div className="bg-[#080c14] border border-[#1c2840] p-3.5 rounded space-y-1 text-xs">
                  <h5 className="text-[10px] uppercase font-semibold text-[#64748b] tracking-wider">
                    How Market Psychology Evolved
                  </h5>
                  <p className="text-[#cbd5e1] leading-relaxed">
                    {currentSimStep.marketNarrative}
                  </p>
                </div>

                {/* Thesis Attribution & Scorecard */}
                <div className="bg-[#0d121c] border border-[#1c2840] p-4 rounded space-y-3">
                  <h5 className="text-[10px] uppercase font-bold text-white tracking-wider">
                    Thesis Outcome & Attribution Scorecard
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-data">
                    <div className="p-2.5 bg-[#080c14] border border-[#1c2840] rounded">
                      <span className="text-[9px] text-[#64748b] uppercase block">If You Were Bullish</span>
                      <p className="text-[#cbd5e1] text-[11px] mt-1 font-sans leading-snug">
                        {currentSimStep.thesisGrading.bullishOutcome}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[#080c14] border border-[#1c2840] rounded">
                      <span className="text-[9px] text-[#64748b] uppercase block">If You Were Bearish</span>
                      <p className="text-[#cbd5e1] text-[11px] mt-1 font-sans leading-snug">
                        {currentSimStep.thesisGrading.bearishOutcome}
                      </p>
                    </div>
                    <div className="p-2.5 bg-[#080c14] border border-[#2a3f60] rounded">
                      <span className="text-[9px] text-[#3b82f6] uppercase block font-bold">Optimal Institutional Play</span>
                      <p className="text-white text-[11px] mt-1 font-sans leading-snug font-medium">
                        {currentSimStep.thesisGrading.winningPlay}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 2: MACRO INFORMATION SET (POINT-IN-TIME) */}
      {activeTab === 'macro' && (
        <div className="space-y-4">
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Point-in-Time Macroeconomic Indicators as of {currentEpoch.date}
            </h3>
            <p className="text-[11px] text-[#64748b] mb-4">
              Each row displays the data coverage period versus official publication date to identify lag and prevent lookahead bias.
            </p>

            <div className="space-y-3">
              {currentEpoch.pointInTimeMacro.map((item, idx) => (
                <div key={idx} className="bg-[#080c14] border border-[#1c2840] rounded p-3.5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#1c2840]/60 pb-2">
                    <span className="font-bold text-white text-xs">{item.metric}</span>
                    <span className="font-mono-data text-xs font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded">
                      KNOWN VALUE: {item.value}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono-data text-[#94a3b8]">
                    <div>
                      <span className="text-[#64748b] text-[9px] uppercase block">Period Covered</span>
                      <span className="text-white">{item.periodCovered}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b] text-[9px] uppercase block">Official Release Date</span>
                      <span className="text-white">{item.releaseDate}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b] text-[9px] uppercase block">Reporting Lag</span>
                      <span className="text-[#f59e0b]">{item.reportingLag}</span>
                    </div>
                  </div>

                  <div className="bg-[#141c2b] border border-[#2a3f60] p-2.5 rounded text-[11px] text-[#cbd5e1] leading-relaxed">
                    <span className="font-bold text-[#f87171] uppercase text-[9px] block mb-0.5">
                      Analytical Note & Lookahead Warning:
                    </span>
                    {item.lookaheadTrap}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CORPORATE FILINGS */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Audited Financial Statements Available as of {currentEpoch.date}
            </h3>
            <p className="text-[11px] text-[#64748b] mb-4">
              Financial results released after {currentEpoch.date} are hidden to prevent lookahead distortions in valuation models.
            </p>

            <div className="space-y-3">
              {currentEpoch.pointInTimeFilings.map((filing) => (
                <div key={filing.symbol} className="bg-[#080c14] border border-[#1c2840] rounded p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-[#1c2840]/60 pb-2">
                    <div>
                      <span className="font-bold text-white text-xs mr-2">{filing.name}</span>
                      <span className="font-mono-data text-[10px] text-[#94a3b8] bg-[#0f1520] px-1.5 py-0.5 rounded border border-[#1c2840]">
                        {filing.symbol}
                      </span>
                    </div>
                    <span className="font-mono-data text-xs font-bold text-white">
                      P/E {filing.peAsOfDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono-data">
                    <div>
                      <span className="text-[#64748b] text-[9px] uppercase block">Latest Available Filing</span>
                      <span className="text-white font-medium">{filing.latestAvailableFiling}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b] text-[9px] uppercase block">Filing Release Date</span>
                      <span className="text-white font-medium">{filing.filingDate}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b] text-[9px] uppercase block">Revenue Reported</span>
                      <span className="text-[#34d399] font-medium">{filing.revenue}</span>
                    </div>
                    <div>
                      <span className="text-[#64748b] text-[9px] uppercase block">Net Profit Reported</span>
                      <span className="text-[#34d399] font-medium">{filing.netProfit}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#0f1520] border border-[#1c2840] rounded text-[11px] text-[#cbd5e1] space-y-1">
                    <div className="text-[10px] text-[#f59e0b] font-mono-data uppercase font-semibold">
                      UPCOMING FILING (NOT YET PUBLISHED): {filing.upcomingFiling}
                    </div>
                    <p className="text-[#94a3b8] leading-relaxed">
                      {filing.whatWasKnown}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MARKETS & PRICING */}
      {activeTab === 'markets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#0f1520] border border-[#1c2840] p-4 rounded-lg space-y-2">
              <span className="text-xs font-semibold text-white">NIFTY 50</span>
              <div className="font-mono-data text-2xl font-bold text-white tabular-nums">
                {currentEpoch.indices.nifty50.level.toLocaleString()}
              </div>
              <div className="text-xs font-mono-data text-[#94a3b8] flex justify-between pt-1 border-t border-[#1c2840]">
                <span>P/E: {currentEpoch.indices.nifty50.pe}x</span>
                <span>P/B: {currentEpoch.indices.nifty50.pb}x</span>
                <span className={currentEpoch.indices.nifty50.change1D >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'}>
                  {currentEpoch.indices.nifty50.change1D}% 1D
                </span>
              </div>
            </div>

            <div className="bg-[#0f1520] border border-[#1c2840] p-4 rounded-lg space-y-2">
              <span className="text-xs font-semibold text-white">BSE SENSEX</span>
              <div className="font-mono-data text-2xl font-bold text-white tabular-nums">
                {currentEpoch.indices.sensex.level.toLocaleString()}
              </div>
              <div className="text-xs font-mono-data text-[#94a3b8] flex justify-between pt-1 border-t border-[#1c2840]">
                <span>P/E: {currentEpoch.indices.sensex.pe}x</span>
                <span>P/B: {currentEpoch.indices.sensex.pb}x</span>
                <span className={currentEpoch.indices.sensex.change1D >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'}>
                  {currentEpoch.indices.sensex.change1D}% 1D
                </span>
              </div>
            </div>

            <div className="bg-[#0f1520] border border-[#1c2840] p-4 rounded-lg space-y-2">
              <span className="text-xs font-semibold text-white">BANK NIFTY</span>
              <div className="font-mono-data text-2xl font-bold text-white tabular-nums">
                {currentEpoch.indices.bankNifty.level.toLocaleString()}
              </div>
              <div className="text-xs font-mono-data text-[#94a3b8] flex justify-between pt-1 border-t border-[#1c2840]">
                <span>P/E: {currentEpoch.indices.bankNifty.pe}x</span>
                <span>P/B: {currentEpoch.indices.bankNifty.pb}x</span>
                <span className={currentEpoch.indices.bankNifty.change1D >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'}>
                  {currentEpoch.indices.bankNifty.change1D}% 1D
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
              <span className="text-[9px] text-[#64748b] uppercase block">10Y G-Sec Yield</span>
              <span className="font-mono-data text-sm font-bold text-white mt-0.5 block">{currentEpoch.macro.gsecYield10Y}</span>
            </div>
            <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
              <span className="text-[9px] text-[#64748b] uppercase block">USD / INR</span>
              <span className="font-mono-data text-sm font-bold text-white mt-0.5 block">₹{currentEpoch.macro.usdInr}</span>
            </div>
            <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
              <span className="text-[9px] text-[#64748b] uppercase block">Brent Crude Oil</span>
              <span className="font-mono-data text-sm font-bold text-white mt-0.5 block">{currentEpoch.macro.crudeOil}</span>
            </div>
            <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
              <span className="text-[9px] text-[#64748b] uppercase block">Forex Reserves</span>
              <span className="font-mono-data text-sm font-bold text-white mt-0.5 block">{currentEpoch.macro.forexReserves}</span>
            </div>
          </div>

          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notable Stock Closing Levels on {currentEpoch.date}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {currentEpoch.notableStocks.map((stock) => (
                <div key={stock.symbol} className="bg-[#080c14] border border-[#1c2840] p-3 rounded space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{stock.symbol}</span>
                    <span className={`text-[10px] font-mono-data font-bold ${
                      stock.change.startsWith('+') ? 'text-[#34d399]' : 'text-[#f87171]'
                    }`}>
                      {stock.change}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#64748b] truncate">{stock.name}</div>
                  <div className="flex justify-between text-[10px] font-mono-data pt-1 border-t border-[#1c2840]/60">
                    <span className="text-[#94a3b8]">{stock.price}</span>
                    <span className="text-white">P/E {stock.pe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NEWS & MARKET PSYCHOLOGY */}
      {activeTab === 'consensus' && (
        <div className="space-y-4">
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Prevailing Media Narrative & Central Bank Quotes on {currentEpoch.date}
            </h3>

            <div className="space-y-2.5">
              {currentEpoch.newsAndConsensus.headlineQuotes.map((quote, idx) => (
                <div key={idx} className="p-3 bg-[#080c14] border-l-2 border-[#3b82f6] border-y border-r border-[#1c2840] rounded-r text-xs text-[#cbd5e1] italic">
                  {quote}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono-data text-xs">
              <div className="p-3 bg-[#080c14] border border-[#1c2840] rounded space-y-1">
                <span className="text-[9px] text-[#3b82f6] uppercase font-bold block">Dalal Street Consensus</span>
                <p className="text-[11px] text-[#cbd5e1] font-sans">{currentEpoch.newsAndConsensus.analystConsensus}</p>
              </div>
              <div className="p-3 bg-[#080c14] border border-[#1c2840] rounded space-y-1">
                <span className="text-[9px] text-[#f59e0b] uppercase font-bold block">RBI Policy Posture</span>
                <p className="text-[11px] text-[#cbd5e1] font-sans">{currentEpoch.newsAndConsensus.centralBankStance}</p>
              </div>
              <div className="p-3 bg-[#080c14] border border-[#1c2840] rounded space-y-1">
                <span className="text-[9px] text-[#f87171] uppercase font-bold block">Market Sentiment Regime</span>
                <p className="text-[11px] text-[#cbd5e1] font-sans">{currentEpoch.newsAndConsensus.marketPsychology}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CROSS-EPOCH COMPARISON */}
      {activeTab === 'comparative' && (
        <div className="space-y-4">
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Cross-Crisis Historical Comparison Matrix
              </h3>
              <p className="text-xs text-[#64748b]">
                Compare valuation multiples, interest rate hurdles, inflation, and drawdown depths across historical regimes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-data border border-[#1c2840]">
                <thead className="bg-[#080c14] text-[#64748b] border-b border-[#1c2840]">
                  <tr>
                    <th className="p-2.5">Historical Epoch</th>
                    <th className="p-2.5">Key Date</th>
                    <th className="p-2.5">Nifty Level</th>
                    <th className="p-2.5">Nifty P/E</th>
                    <th className="p-2.5">RBI Repo Rate</th>
                    <th className="p-2.5">CPI / WPI</th>
                    <th className="p-2.5">Forex Reserves</th>
                    <th className="p-2.5">10Y G-Sec Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c2840]">
                  {HISTORICAL_EPOCHS.map((e) => (
                    <tr key={e.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-2.5 font-bold text-white font-sans">{e.name}</td>
                      <td className="p-2.5 text-[#94a3b8]">{e.date}</td>
                      <td className="p-2.5 text-white font-bold">{e.indices.nifty50.level}</td>
                      <td className="p-2.5 text-[#3b82f6]">{e.indices.nifty50.pe}x</td>
                      <td className="p-2.5 text-[#f59e0b]">{e.macro.rbiRepo.split(' ')[0]}</td>
                      <td className="p-2.5 text-[#cbd5e1]">{e.macro.cpi || e.macro.wpi}</td>
                      <td className="p-2.5 text-[#34d399]">{e.macro.forexReserves}</td>
                      <td className="p-2.5 text-white">{e.macro.gsecYield10Y}</td>
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
