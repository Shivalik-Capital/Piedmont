'use client';

import React, { useState } from 'react';
import { HISTORICAL_EPOCHS, HistoricalEpoch, getModernBaseline } from '../lib/historical-database';
import Icon from '../components/ui/Icon';

export default function HistoricalReplayPage() {
  const [selectedEpochId, setSelectedEpochId] = useState<string>('covid-crash-2020');
  const modernBaseline = getModernBaseline();
  
  const currentEpoch: HistoricalEpoch = 
    HISTORICAL_EPOCHS.find((e) => e.id === selectedEpochId) || HISTORICAL_EPOCHS[3];

  const isBaseline = currentEpoch.id === modernBaseline.id;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1c2840] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/30">
              PIEDMONT REPLAY
            </span>
            <span className="text-xs text-[#64748b]">POINT-IN-TIME MARKET SIMULATOR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Historical Market Time Machine
          </h1>
          <p className="text-xs text-[#cbd5e1] mt-1 max-w-3xl">
            Rewind the entire terminal state—macroeconomic indicators, central bank policies, valuation multiples, and market breadth—to pivotal Indian financial crises and market regimes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#0f1520] border border-[#1c2840] px-3 py-1.5 rounded text-right">
            <div className="text-[9px] text-[#64748b] uppercase tracking-wider">ACTIVE EPOCH</div>
            <div className="font-mono-data text-xs font-bold text-white uppercase">{currentEpoch.date}</div>
          </div>
        </div>
      </div>

      {/* Epoch Scrubber / Selector Bar */}
      <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-3">
        <div className="text-[10px] text-[#64748b] uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
          <span>SELECT HISTORICAL MARKET EPOCH</span>
          <span className="font-mono-data text-[9px] text-[#3b82f6]">7 EPOCHS CATALOGUED</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {HISTORICAL_EPOCHS.map((epoch) => {
            const isSelected = epoch.id === selectedEpochId;
            return (
              <button
                key={epoch.id}
                onClick={() => setSelectedEpochId(epoch.id)}
                className={`flex flex-col p-2.5 rounded text-left transition-all ${
                  isSelected
                    ? 'bg-[#3b82f6]/15 border-2 border-[#3b82f6] shadow-lg'
                    : 'bg-[#080c14] border border-[#1c2840] hover:border-[#2a3f60]'
                }`}
              >
                <span className={`text-[9px] font-mono-data uppercase font-bold ${
                  isSelected ? 'text-[#3b82f6]' : 'text-[#64748b]'
                }`}>
                  {epoch.date.split(',')[1]?.trim() || epoch.date}
                </span>
                <span className="text-xs font-semibold text-white truncate mt-0.5">
                  {epoch.name.split(' ')[0]} {epoch.name.split(' ')[1]}
                </span>
                <span className="text-[9px] text-[#94a3b8] truncate mt-0.5">
                  Nifty {epoch.indices.nifty50.level}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Epoch Banner */}
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

      {/* Point-in-Time Market Bento Cards */}
      <div>
        <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
          Point-In-Time Index Valuations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Nifty 50 */}
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">NIFTY 50</span>
                <span className="text-[10px] text-[#64748b] block">National Stock Exchange</span>
              </div>
              <span className={`font-mono-data text-xs font-bold px-2 py-0.5 rounded ${
                currentEpoch.indices.nifty50.change1D >= 0 ? 'bg-[#34d399]/10 text-[#34d399]' : 'bg-[#f87171]/10 text-[#f87171]'
              }`}>
                {currentEpoch.indices.nifty50.change1D >= 0 ? '+' : ''}{currentEpoch.indices.nifty50.change1D}% 1D
              </span>
            </div>
            <div className="font-mono-data text-2xl font-bold text-white tabular-nums">
              {currentEpoch.indices.nifty50.level.toLocaleString()}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1c2840] text-center font-mono-data">
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">P/E</div>
                <div className="text-xs font-semibold text-white">{currentEpoch.indices.nifty50.pe}x</div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">P/B</div>
                <div className="text-xs font-semibold text-white">{currentEpoch.indices.nifty50.pb}x</div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">1M Drawdown</div>
                <div className={`text-xs font-semibold ${
                  currentEpoch.indices.nifty50.change1M >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'
                }`}>
                  {currentEpoch.indices.nifty50.change1M}%
                </div>
              </div>
            </div>
          </div>

          {/* Sensex */}
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">BSE SENSEX</span>
                <span className="text-[10px] text-[#64748b] block">Bombay Stock Exchange</span>
              </div>
              <span className={`font-mono-data text-xs font-bold px-2 py-0.5 rounded ${
                currentEpoch.indices.sensex.change1D >= 0 ? 'bg-[#34d399]/10 text-[#34d399]' : 'bg-[#f87171]/10 text-[#f87171]'
              }`}>
                {currentEpoch.indices.sensex.change1D >= 0 ? '+' : ''}{currentEpoch.indices.sensex.change1D}% 1D
              </span>
            </div>
            <div className="font-mono-data text-2xl font-bold text-white tabular-nums">
              {currentEpoch.indices.sensex.level.toLocaleString()}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1c2840] text-center font-mono-data">
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">P/E</div>
                <div className="text-xs font-semibold text-white">{currentEpoch.indices.sensex.pe}x</div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">P/B</div>
                <div className="text-xs font-semibold text-white">{currentEpoch.indices.sensex.pb}x</div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">Exchange</div>
                <div className="text-xs font-semibold text-white">BSE</div>
              </div>
            </div>
          </div>

          {/* Bank Nifty */}
          <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">BANK NIFTY</span>
                <span className="text-[10px] text-[#64748b] block">Banking Sector Benchmark</span>
              </div>
              <span className={`font-mono-data text-xs font-bold px-2 py-0.5 rounded ${
                currentEpoch.indices.bankNifty.change1D >= 0 ? 'bg-[#34d399]/10 text-[#34d399]' : 'bg-[#f87171]/10 text-[#f87171]'
              }`}>
                {currentEpoch.indices.bankNifty.change1D >= 0 ? '+' : ''}{currentEpoch.indices.bankNifty.change1D}% 1D
              </span>
            </div>
            <div className="font-mono-data text-2xl font-bold text-white tabular-nums">
              {currentEpoch.indices.bankNifty.level.toLocaleString()}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1c2840] text-center font-mono-data">
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">P/E</div>
                <div className="text-xs font-semibold text-white">{currentEpoch.indices.bankNifty.pe}x</div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">P/B</div>
                <div className="text-xs font-semibold text-white">{currentEpoch.indices.bankNifty.pb}x</div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b] uppercase">Sector Beta</div>
                <div className="text-xs font-semibold text-white">1.35x</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Point-in-Time Macro Indicators Grid */}
      <div>
        <h3 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
          Macroeconomic Dashboard at Epoch Date
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
            <span className="text-[9px] text-[#64748b] uppercase block">RBI Repo Rate</span>
            <span className="font-mono-data text-sm font-bold text-white mt-1 block truncate">
              {currentEpoch.macro.rbiRepo}
            </span>
          </div>
          <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
            <span className="text-[9px] text-[#64748b] uppercase block">CPI Inflation</span>
            <span className="font-mono-data text-sm font-bold text-white mt-1 block truncate">
              {currentEpoch.macro.cpi}
            </span>
          </div>
          <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
            <span className="text-[9px] text-[#64748b] uppercase block">WPI Inflation</span>
            <span className="font-mono-data text-sm font-bold text-white mt-1 block truncate">
              {currentEpoch.macro.wpi}
            </span>
          </div>
          <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
            <span className="text-[9px] text-[#64748b] uppercase block">Forex Reserves</span>
            <span className="font-mono-data text-sm font-bold text-white mt-1 block truncate">
              {currentEpoch.macro.forexReserves}
            </span>
          </div>
          <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
            <span className="text-[9px] text-[#64748b] uppercase block">10Y G-Sec Yield</span>
            <span className="font-mono-data text-sm font-bold text-white mt-1 block truncate">
              {currentEpoch.macro.gsecYield10Y}
            </span>
          </div>
          <div className="bg-[#0f1520] border border-[#1c2840] p-3 rounded">
            <span className="text-[9px] text-[#64748b] uppercase block">USD / INR</span>
            <span className="font-mono-data text-sm font-bold text-white mt-1 block truncate">
              ₹{currentEpoch.macro.usdInr}
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Playbook Section */}
      <div className="bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-5">
        <div className="border-b border-[#1c2840] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Institutional Crisis Playbook: {currentEpoch.name}
            </h3>
            <p className="text-xs text-[#64748b]">Causal anatomy, sector dispersion, and capital preservation lessons</p>
          </div>
          <span className="text-[10px] font-mono-data text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-1 rounded border border-[#f59e0b]/30">
            RECOVERY: {currentEpoch.analysis.recoveryTimeline}
          </span>
        </div>

        {/* Catalysts & Transmission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#080c14] border border-[#1c2840] p-3.5 rounded space-y-2">
            <h4 className="text-[10px] uppercase font-semibold text-[#64748b] tracking-wider">
              Primary Catalysts & Root Causes
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#cbd5e1]">
              {currentEpoch.analysis.catalysts.map((c, idx) => (
                <li key={idx} className="leading-relaxed">{c}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#080c14] border border-[#1c2840] p-3.5 rounded space-y-2">
            <h4 className="text-[10px] uppercase font-semibold text-[#64748b] tracking-wider">
              Transmission Vectors Through Economy
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#cbd5e1]">
              {currentEpoch.analysis.transmissionMechanism.map((m, idx) => (
                <li key={idx} className="leading-relaxed">{m}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sector Winners and Losers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Winners */}
          <div className="bg-[#080c14] border border-[#1c2840] p-3.5 rounded space-y-2">
            <h4 className="text-[10px] uppercase font-semibold text-[#34d399] tracking-wider flex items-center justify-between">
              <span>Outperforming / Resilient Sectors</span>
              <span className="font-mono-data text-[9px]">CAPITAL PRESERVATION</span>
            </h4>
            <div className="space-y-2">
              {currentEpoch.analysis.winningSectors.map((w, idx) => (
                <div key={idx} className="p-2 bg-[#0f1520] border border-[#1c2840] rounded">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{w.name}</span>
                    <span className="font-mono-data font-bold text-[#34d399]">{w.performance}</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-1">{w.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="bg-[#080c14] border border-[#1c2840] p-3.5 rounded space-y-2">
            <h4 className="text-[10px] uppercase font-semibold text-[#f87171] tracking-wider flex items-center justify-between">
              <span>Underperforming / Vulnerable Sectors</span>
              <span className="font-mono-data text-[9px]">MAXIMUM DRAWDOWN</span>
            </h4>
            <div className="space-y-2">
              {currentEpoch.analysis.losingSectors.map((l, idx) => (
                <div key={idx} className="p-2 bg-[#0f1520] border border-[#1c2840] rounded">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{l.name}</span>
                    <span className="font-mono-data font-bold text-[#f87171]">{l.performance}</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] mt-1">{l.rationale}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Notable Stock Case Studies */}
        {currentEpoch.notableStocks && (
          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] uppercase font-semibold text-[#64748b] tracking-wider">
              Notable Constituent Case Studies During Epoch
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {currentEpoch.notableStocks.map((stock, idx) => (
                <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-3 rounded space-y-1">
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
                  <p className="text-[10px] text-[#cbd5e1] pt-1 leading-snug">{stock.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Institutional Takeaways */}
        <div className="p-3.5 bg-[#141c2b] border border-[#2a3f60] rounded space-y-2">
          <h4 className="text-[10px] uppercase font-bold text-[#3b82f6] tracking-wider">
            Key Institutional Lessons for Portfolio Allocation
          </h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-[#cbd5e1]">
            {currentEpoch.analysis.institutionalLessons.map((lesson, idx) => (
              <li key={idx} className="leading-relaxed">{lesson}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
