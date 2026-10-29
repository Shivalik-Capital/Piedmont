'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import { CopilotResponse, parseAndAnalyzeFinancialQuery } from '../../lib/financial-engine';

interface PiedmontCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text?: string;
  data?: CopilotResponse;
  timestamp: string;
}

export default function PiedmontCopilot({ isOpen, onClose }: PiedmontCopilotProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'groq' | 'claude' | 'openai'>('gemini');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load custom BYOK settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('piedmont_byok_key') || '';
      const savedProvider = (localStorage.getItem('piedmont_byok_provider') as any) || 'gemini';
      setCustomKey(savedKey);
      setProvider(savedProvider);
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (messages.length === 0) {
        // Initial greeting
        const initialResponse = parseAndAnalyzeFinancialQuery('macro');
        setMessages([
          {
            id: 'init-1',
            sender: 'copilot',
            data: initialResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const saveSettings = () => {
    localStorage.setItem('piedmont_byok_key', customKey.trim());
    localStorage.setItem('piedmont_byok_provider', provider);
    setShowSettings(false);
  };

  const handleSubmit = async (textToSubmit?: string) => {
    const q = (textToSubmit || query).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      // Send to Next.js API route
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          customKey: customKey.trim() || undefined,
          provider: provider || 'gemini'
        })
      });

      if (res.ok) {
        const data: CopilotResponse = await res.json();
        const copilotMsg: ChatMessage = {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, copilotMsg]);
      } else {
        // Fallback to client-side deterministic engine
        const fallbackData = parseAndAnalyzeFinancialQuery(q);
        const copilotMsg: ChatMessage = {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          data: fallbackData,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, copilotMsg]);
      }
    } catch {
      const fallbackData = parseAndAnalyzeFinancialQuery(q);
      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        data: fallbackData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const suggestionPills = [
    'How is Reliance looking today?',
    'How does crude oil affect Asian Paints and Swiggy?',
    'What happens if RBI cuts the Repo Rate by 50 bps?',
    'Break down DuPont ROE for HDFC Bank',
    'What are expectations for TCS ahead of earnings?',
    'USD/INR sensitivity on IT Services'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl h-full bg-[#080c14] border-l border-[#1c2840] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-[#0f1520] border-b border-[#1c2840] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide text-sm uppercase">Piedmont Copilot</span>
                <span className="text-[10px] bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 px-1.5 py-0.5 rounded font-mono-data font-medium uppercase">
                  BLENDED ENGINE
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">Institutional Intelligence & Cross-Asset Transmission</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded hover:bg-[#1c2840] text-[#64748b] hover:text-white transition-colors"
              title="Configure API Key / BYOK"
            >
              <Icon name="tune" className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#1c2840] text-[#64748b] hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BYOK Settings Drawer (Conditional) */}
        {showSettings && (
          <div className="p-4 bg-[#0d121c] border-b border-[#1c2840] text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                API Settings (Optional BYOK)
              </span>
              <span className="text-[10px] text-[#64748b]">
                Defaults to Free Tier Tier-1 Deterministic + Tier-2 Gemini Flash
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[#64748b] mb-1 text-[10px] uppercase">Engine Provider</label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-[#080c14] border border-[#1c2840] rounded px-2.5 py-1.5 text-white outline-none focus:border-[#3b82f6]"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Free Tier)</option>
                  <option value="groq">Groq Cloud Llama 3.3 (Free Tier)</option>
                  <option value="claude">Anthropic Claude (Custom Key)</option>
                  <option value="openai">OpenAI GPT-4o (Custom Key)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#64748b] mb-1 text-[10px] uppercase">Custom API Key</label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste private key (stored locally)"
                  className="w-full bg-[#080c14] border border-[#1c2840] rounded px-2.5 py-1.5 text-white outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setCustomKey('');
                  localStorage.removeItem('piedmont_byok_key');
                  setShowSettings(false);
                }}
                className="px-2.5 py-1 rounded bg-[#1c2840] text-[#cbd5e1] hover:text-white"
              >
                Clear Key
              </button>
              <button
                onClick={saveSettings}
                className="px-3 py-1 rounded bg-[#3b82f6] text-white font-medium hover:bg-[#2563eb]"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* User Bubble */}
              {msg.sender === 'user' && (
                <div className="max-w-[85%] bg-[#1c2840] text-white px-3.5 py-2.5 rounded-lg border border-[#2a3f60] text-xs font-medium">
                  {msg.text}
                  <div className="text-[9px] text-[#64748b] mt-1 text-right">{msg.timestamp}</div>
                </div>
              )}

              {/* Copilot Institutional Analysis Block */}
              {msg.sender === 'copilot' && msg.data && (
                <div className="max-w-full w-full bg-[#0f1520] border border-[#1c2840] rounded-lg p-4 space-y-3.5 text-xs text-[#cbd5e1]">
                  
                  {/* Model & Timestamp Header */}
                  <div className="flex items-center justify-between border-b border-[#1c2840]/60 pb-2">
                    <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded border border-[#3b82f6]/20">
                      {msg.data.sourceModel}
                    </span>
                    <span className="font-mono-data text-[10px] text-[#64748b]">{msg.timestamp}</span>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#64748b] mb-1">
                      Institutional Thesis
                    </h4>
                    <p className="text-white leading-relaxed font-normal text-xs">
                      {msg.data.executiveSummary}
                    </p>
                  </div>

                  {/* Quantitative Metrics Grid */}
                  {msg.data.quantitativeMetrics && msg.data.quantitativeMetrics.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#64748b] mb-1.5">
                        Quantitative Benchmarks
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {msg.data.quantitativeMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-2 rounded">
                            <div className="text-[9px] text-[#64748b] uppercase tracking-tight">{metric.label}</div>
                            <div className={`font-mono-data text-xs font-semibold mt-0.5 tabular-nums ${
                              metric.stance === 'positive' ? 'text-[#34d399]' :
                              metric.stance === 'negative' ? 'text-[#f87171]' :
                              'text-white'
                            }`}>
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DuPont Breakdown (If Present) */}
                  {msg.data.duPontBreakdown && (
                    <div className="bg-[#080c14] border border-[#1c2840] rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3b82f6]">
                          DuPont ROE Decomposition
                        </span>
                        <span className="font-mono-data text-xs font-bold text-white">
                          ROE {msg.data.duPontBreakdown.roe}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center py-1 border-y border-[#1c2840]/60">
                        <div>
                          <div className="text-[9px] text-[#64748b] uppercase">Net Margin</div>
                          <div className="font-mono-data font-semibold text-white text-[11px]">{msg.data.duPontBreakdown.netMargin}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#64748b] uppercase">Asset Turnover</div>
                          <div className="font-mono-data font-semibold text-white text-[11px]">{msg.data.duPontBreakdown.assetTurnover}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#64748b] uppercase">Leverage Mult.</div>
                          <div className="font-mono-data font-semibold text-white text-[11px]">{msg.data.duPontBreakdown.equityMultiplier}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] leading-tight">
                        {msg.data.duPontBreakdown.commentary}
                      </p>
                    </div>
                  )}

                  {/* Transmission Vectors (If Present) */}
                  {msg.data.transmissionVectors && msg.data.transmissionVectors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#64748b]">
                        Cross-Asset Transmission Mechanisms
                      </h4>
                      {msg.data.transmissionVectors.map((v, idx) => (
                        <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-2.5 rounded space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-[11px]">
                              {v.factor} &rarr; {v.target}
                            </span>
                            <span className={`text-[9px] font-mono-data uppercase px-1.5 py-0.2 rounded border ${
                              v.direction === 'tailwind' ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30' :
                              v.direction === 'headwind' ? 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30' :
                              'bg-white/5 text-[#94a3b8] border-white/10'
                            }`}>
                              {v.direction}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                            {v.mechanism}
                          </p>
                          <div className="text-[10px] text-[#64748b] pt-1 border-t border-[#1c2840]/40">
                            <span className="font-semibold text-[#94a3b8]">Historical Precedent: </span>
                            {v.historicalPrecedent}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Risks & Monitors */}
                  {msg.data.risksAndMonitors && msg.data.risksAndMonitors.length > 0 && (
                    <div className="pt-1">
                      <h4 className="text-[10px] uppercase tracking-wider font-semibold text-[#64748b] mb-1">
                        Key Catalysts & Downside Monitors
                      </h4>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#94a3b8]">
                        {msg.data.risksAndMonitors.map((risk, idx) => (
                          <li key={idx}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}

            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-[#0f1520] border border-[#1c2840] rounded-lg text-xs text-[#64748b]">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#3b82f6] border-t-transparent animate-spin" />
              <span>Synthesizing cross-asset transmission vectors and financial metrics...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Quick Pills */}
        <div className="px-4 py-2 bg-[#080c14] border-t border-[#1c2840]/60 flex gap-1.5 overflow-x-auto no-scrollbar">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmit(pill)}
              className="shrink-0 text-[10px] font-mono-data bg-[#0f1520] hover:bg-[#1c2840] border border-[#1c2840] text-[#94a3b8] hover:text-white px-2 py-1 rounded transition-colors whitespace-nowrap"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0f1520] border-t border-[#1c2840] flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Ask about any equity, forward earnings, or macro transmission..."
            className="flex-1 bg-[#080c14] border border-[#1c2840] rounded px-3 py-2 text-xs text-white placeholder-[#64748b] outline-none focus:border-[#3b82f6]"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!query.trim() || loading}
            className="px-3 py-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-40 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
