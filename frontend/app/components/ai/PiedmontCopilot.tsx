'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  const [provider, setProvider] = useState<'gemini' | 'groq'>('gemini');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  // Focus input when opened and initialize welcome state
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      if (messages.length === 0) {
        setMessages([
          {
            id: 'init-welcome',
            sender: 'copilot',
            data: {
              queryType: 'general',
              title: 'Institutional Research Console Active',
              executiveSummary: 'Piedmont Copilot initialized under mid-November 2026 baseline. Query cross-asset transmissions (e.g., falling gold prices, crude oil sensitivity, repo rate trajectory), DuPont ROE diagnostics for Indian equities, or macro policy transmission.',
              markdownSynthesis: 'Operating within the Piedmont Deterministic & Neural Financial Reasoning Engine. Inquire about any Indian capital markets security, factor, or macro development.',
              quantitativeMetrics: [
                { label: 'Nifty 50 Benchmark', value: '25,810.45', stance: 'positive' },
                { label: 'RBI Policy Repo Rate', value: '5.50%', stance: 'neutral' },
                { label: 'CPI Inflation (Oct)', value: '6.09%', stance: 'negative' },
                { label: 'WPI Inflation (Oct)', value: '2.36%', stance: 'positive' },
                { label: 'Forex Reserves', value: '$719.55B', stance: 'positive' }
              ],
              actionableTakeaway: 'Select any sample transmission below or type a bespoke query to begin institutional research.',
              risksAndMonitors: [
                'Type any question below or select one of the suggested institutional transmission pills.',
                'Optionally connect a free Google Gemini or Groq key in settings for unbounded generative synthesis.'
              ],
              followUpSuggestions: [
                'How is gold prices falling affecting Nifty 50?',
                'How does crude oil affect Asian Paints and Swiggy?',
                'Why is CPI at 6.09% while WPI is at 2.36%?',
                'Break down DuPont ROE for HDFC Bank'
              ],
              sourceModel: 'Deterministic Institutional Engine (Tier 1)'
            },
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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
    'How is gold prices falling affecting Nifty 50?',
    'How does crude oil affect Asian Paints and Swiggy?',
    'Why is CPI at 6.09% while WPI is at 2.36%?',
    'How do monthly SIPs of ₹24,500 Cr absorb FII selling?',
    'Is Nifty 50 overvalued at 25,800?',
    'Break down DuPont ROE for HDFC Bank'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 transition-all duration-200">
      <div className="w-full max-w-4xl h-[88vh] bg-[#191919] border border-[#262626] rounded-[16px] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Terminal Header */}
        <div className="px-6 py-4 bg-[#141414] border-b border-[#262626] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#479ffa] shadow-[0_0_10px_rgba(71,159,250,0.6)]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white tracking-[-0.03em] text-sm">Piedmont Copilot</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono-data font-medium bg-[#1e1e1e] text-[#479ffa] border border-[#333333]">
                  {customKey ? `${provider.toUpperCase()} NEURAL ACTIVE` : 'BLENDED ENGINE'}
                </span>
              </div>
              <p className="text-[11px] text-[#868f97] mt-0.5">Institutional Market Intelligence & Quantitative Transmission</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/copilot"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#868f97] hover:text-white transition-all"
            >
              Full Studio &rarr;
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-full hover:bg-[#222222] text-[#868f97] hover:text-white transition-colors"
              title="API Key Configuration"
            >
              <Icon name="tune" className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#222222] text-[#868f97] hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Neural API Settings Drawer */}
        {showSettings && (
          <div className="p-4 bg-[#141414] border-b border-[#262626] text-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white tracking-[-0.02em] text-xs block">
                  Connect Free Neural AI (Google Gemini / Groq)
                </span>
                <span className="text-[11px] text-[#868f97]">
                  Paste a free API key with zero billing required to unlock unbounded neural generation.
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#ffa16c] hover:underline font-medium"
              >
                Get Free Gemini Key &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#868f97] mb-1 text-[11px] uppercase tracking-wider font-mono-data">Engine Provider</label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-[#191919] border border-[#2a2a2a] rounded-[10px] px-3 py-2 text-white outline-none focus:border-[#479ffa] text-xs"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Official Free Tier)</option>
                  <option value="groq">Groq Cloud Llama 3.3 (Fast LPU Free Tier)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#868f97] mb-1 text-[11px] uppercase tracking-wider font-mono-data">API Key (Stored Locally in Browser)</label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste AI Studio Key (e.g. AIzaSy...)"
                  className="w-full bg-[#191919] border border-[#2a2a2a] rounded-[10px] px-3 py-2 text-white outline-none focus:border-[#479ffa] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#262626]">
              <span className="text-[11px] text-[#868f97]">
                Key is stored strictly in your browser localStorage. Never saved on our server.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCustomKey('');
                    localStorage.removeItem('piedmont_byok_key');
                    setShowSettings(false);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#1e1e1e] hover:bg-[#252525] text-[#868f97] hover:text-white text-xs transition-all"
                >
                  Clear Key
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-[#e0e0e0] transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* User Bubble */}
              {msg.sender === 'user' && (
                <div className="max-w-[85%] bg-[#222222] border border-[#333333] text-white px-4 py-2.5 rounded-[14px] text-xs font-normal shadow-sm">
                  {msg.text}
                  <div className="text-[10px] font-mono-data text-[#868f97] mt-1 text-right">{msg.timestamp}</div>
                </div>
              )}

              {/* Copilot Institutional Analysis Block */}
              {msg.sender === 'copilot' && msg.data && (
                <div className="w-full bg-[#141414] border border-[#262626] rounded-[16px] p-5 space-y-4 text-xs text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  
                  {/* Model & Title Header */}
                  <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-[10px] uppercase font-medium text-[#868f97] bg-[#1a1a1a] px-2.5 py-0.5 rounded-full border border-[#2a2a2a]">
                        {msg.data.sourceModel}
                      </span>
                      <span className="font-semibold text-white text-sm tracking-[-0.03em] truncate">
                        {msg.data.title || 'Institutional Diagnostic'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, `${msg.data?.title}\n\n${msg.data?.executiveSummary}\n\n${msg.data?.markdownSynthesis}`)}
                        className="text-[11px] text-[#868f97] hover:text-white px-3 py-1 rounded-full bg-[#191919] hover:bg-[#222222] border border-[#2a2a2a] transition-all"
                      >
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                      <span className="font-mono-data text-[10px] text-[#555555]">{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Executive Thesis */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono-data uppercase font-semibold text-[#ffa16c] tracking-wider">
                      EXECUTIVE THESIS
                    </div>
                    <p className="text-white text-xs leading-relaxed font-normal">
                      {msg.data.executiveSummary}
                    </p>
                  </div>

                  {/* Quantitative Benchmarks Grid */}
                  {msg.data.quantitativeMetrics && msg.data.quantitativeMetrics.length > 0 && (
                    <div className="pt-1">
                      <div className="text-[10px] font-mono-data uppercase font-semibold text-[#868f97] mb-2 tracking-wider">
                        QUANTITATIVE SENSITIVITY BENCHMARKS
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {msg.data.quantitativeMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-[#191919] border border-[#262626] p-3 rounded-[12px]">
                            <div className="text-[10px] text-[#868f97] uppercase tracking-wider font-mono-data">{metric.label}</div>
                            <div className={`font-mono-data text-sm font-semibold mt-1 tabular-nums ${
                              metric.stance === 'positive' ? 'text-[#4ebe96]' :
                              metric.stance === 'negative' ? 'text-[#eb5757]' :
                              'text-white'
                            }`}>
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Causal Transmission Vectors */}
                  {msg.data.transmissionVectors && msg.data.transmissionVectors.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[10px] font-mono-data uppercase font-semibold text-[#868f97] tracking-wider">
                        CROSS-ASSET TRANSMISSION CHANNELS
                      </div>
                      <div className="space-y-2">
                        {msg.data.transmissionVectors.map((v, idx) => (
                          <div key={idx} className="bg-[#191919] border border-[#262626] p-3.5 rounded-[12px] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white text-xs">{v.factor} &rarr; {v.target}</span>
                              <span className={`text-[10px] font-mono-data uppercase font-semibold px-2 py-0.5 rounded-full border ${
                                v.direction === 'tailwind' ? 'bg-[#4ebe96]/10 text-[#4ebe96] border-[#4ebe96]/20' :
                                v.direction === 'headwind' ? 'bg-[#eb5757]/10 text-[#eb5757] border-[#eb5757]/20' :
                                'bg-[#222222] text-[#868f97] border-[#333333]'
                              }`}>
                                {v.direction}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#868f97] leading-relaxed">{v.mechanism}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Takeaway */}
                  {msg.data.actionableTakeaway && (
                    <div className="bg-[#1c1815] border border-[#ffa16c]/25 p-3.5 rounded-[12px]">
                      <span className="text-[10px] font-mono-data uppercase font-semibold text-[#ffa16c] block tracking-wider">
                        PORTFOLIO TAKEAWAY
                      </span>
                      <p className="text-white text-xs mt-1 leading-relaxed">
                        {msg.data.actionableTakeaway}
                      </p>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.data.followUpSuggestions && msg.data.followUpSuggestions.length > 0 && (
                    <div className="pt-2 border-t border-[#262626] flex flex-wrap gap-2">
                      {msg.data.followUpSuggestions.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSubmit(s)}
                          className="text-xs bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] px-3.5 py-1.5 rounded-full text-[#868f97] hover:text-white transition-all text-left"
                        >
                          &rarr; {s}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-[#141414] border border-[#262626] rounded-[16px] p-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#479ffa] animate-pulse" />
              <span className="text-xs text-[#868f97]">
                Evaluating institutional transmission matrix...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar & Suggestion Pills */}
        <div className="p-4 bg-[#141414] border-t border-[#262626] space-y-3 shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask about any equity, cross-asset transmission (e.g. falling gold, crude oil), or macro factor..."
              className="flex-1 bg-[#101010] border border-[#262626] focus:border-[#479ffa] rounded-full px-4 py-2.5 text-xs text-white placeholder:text-[#555555] outline-none transition-all"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#e0e0e0] disabled:opacity-30 text-black font-semibold text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <span>Send</span>
              <Icon name="arrow_forward" className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[10px] font-mono-data text-[#555555] uppercase shrink-0 font-medium">SUGGESTED:</span>
            {suggestionPills.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(p)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] bg-[#191919] hover:bg-[#222222] border border-[#262626] text-[#868f97] hover:text-white shrink-0 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
