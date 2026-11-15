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
      setTimeout(() => inputRef.current?.focus(), 100);
      if (messages.length === 0) {
        setMessages([
          {
            id: 'init-welcome',
            sender: 'copilot',
            data: {
              queryType: 'general',
              title: 'Institutional Research Console Initialized',
              executiveSummary: 'Piedmont Copilot is active. Inquire about any Indian listed equity, macroeconomic policy transmission (e.g., falling gold prices, crude oil sensitivity, repo rate trajectory), DuPont ROE diagnostics, or market microstructure.',
              markdownSynthesis: 'You are operating within the Piedmont High-Precision Financial Reasoning Engine. Ask any quantitative or qualitative question regarding Indian capital markets.',
              quantitativeMetrics: [
                { label: 'Nifty 50 Benchmark', value: '25,800', stance: 'positive' },
                { label: 'RBI Repo Rate', value: '5.50%', stance: 'neutral' },
                { label: 'CPI Inflation (Oct)', value: '6.09%', stance: 'negative' },
                { label: 'WPI Inflation (Oct)', value: '2.36%', stance: 'positive' },
                { label: 'Forex Reserves', value: '$719.55B', stance: 'positive' }
              ],
              actionableTakeaway: 'Select any sample transmission below or type a bespoke query to begin.',
              risksAndMonitors: [
                'Type any question below or select one of the suggested institutional transmission pills.',
                'Connect a free Google Gemini key in settings to unlock unconstrained neural generative reasoning.'
              ],
              followUpSuggestions: [
                'How is gold prices falling affecting Nifty 50?',
                'How does crude oil affect Asian Paints and Swiggy?',
                'Why is CPI at 6.09% while WPI is at 2.36%?',
                'Is Nifty 50 overvalued at 25,800?'
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

  const renderSimpleMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-bold text-white uppercase font-mono-data mt-2 mb-1 border-b border-[#1c2840] pb-0.5">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="text-xs text-[#cbd5e1] leading-relaxed ml-3 list-disc my-0.5">
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
          </li>
        );
      }
      if (!line.trim()) return <div key={idx} className="h-1" />;
      return (
        <p key={idx} className="text-xs text-[#cbd5e1] leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 transition-opacity">
      <div className="w-full max-w-4xl h-[88vh] bg-[#080c14] border border-[#1c2840] rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-[#0f1520] border-b border-[#1c2840] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide text-sm font-mono-data uppercase">Piedmont Copilot</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono-data font-semibold uppercase border ${
                  customKey 
                    ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30'
                    : 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30'
                }`}>
                  {customKey ? `${provider.toUpperCase()} NEURAL ACTIVE` : 'BLENDED ENGINE'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748b] font-mono-data">Institutional Market Intelligence & Quantitative Transmission</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/copilot"
              onClick={onClose}
              className="px-2.5 py-1 rounded text-xs font-mono-data bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#3b82f6] hover:text-white transition-colors"
            >
              FULL STUDIO &rarr;
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded hover:bg-[#1c2840] text-[#94a3b8] hover:text-white"
              title="API Key Configuration"
            >
              <Icon name="tune" className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#1c2840] text-[#94a3b8] hover:text-white"
              title="Close (Esc)"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Neural API Settings Drawer */}
        {showSettings && (
          <div className="p-4 bg-[#0d121c] border-b border-[#1c2840] text-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white uppercase tracking-wider text-[11px] block font-mono-data">
                  Connect Free Neural AI (Google Gemini / Groq)
                </span>
                <span className="text-[10px] text-[#94a3b8]">
                  Get an unconstrained free API key with zero billing required.
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#3b82f6] underline hover:text-[#60a5fa] font-mono-data"
              >
                Get Free Gemini Key &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#64748b] mb-1 text-[10px] uppercase font-mono-data">Engine Provider</label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-[#080c14] border border-[#1c2840] rounded px-2.5 py-1.5 text-white outline-none focus:border-[#3b82f6] font-mono-data"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Official Free Tier)</option>
                  <option value="groq">Groq Cloud Llama 3.3 (Fast LPU Free Tier)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#64748b] mb-1 text-[10px] uppercase font-mono-data">API Key (Stored Locally in Browser)</label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste AI Studio Key (e.g. AIzaSy...)"
                  className="w-full bg-[#080c14] border border-[#1c2840] rounded px-2.5 py-1.5 text-white outline-none focus:border-[#3b82f6] font-mono-data"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-[#1c2840]/60">
              <span className="text-[10px] text-[#64748b]">
                Key is saved strictly in your browser localStorage. Never sent to any third party.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCustomKey('');
                    localStorage.removeItem('piedmont_byok_key');
                    setShowSettings(false);
                  }}
                  className="px-2.5 py-1 rounded bg-[#1c2840] text-[#cbd5e1] hover:text-white font-mono-data"
                >
                  Clear Key
                </button>
                <button
                  onClick={saveSettings}
                  className="px-3 py-1 rounded bg-[#3b82f6] text-white font-mono-data font-bold hover:bg-[#2563eb]"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* User Bubble */}
              {msg.sender === 'user' && (
                <div className="max-w-[85%] bg-[#1c2840] text-white px-4 py-2.5 rounded-lg border border-[#2a3f60] text-xs font-medium shadow-md">
                  {msg.text}
                  <div className="text-[9px] font-mono-data text-[#64748b] mt-1 text-right">{msg.timestamp}</div>
                </div>
              )}

              {/* Copilot Institutional Analysis Block */}
              {msg.sender === 'copilot' && msg.data && (
                <div className="max-w-full w-full bg-[#0f1520] border border-[#1c2840] rounded-lg p-5 space-y-3.5 text-xs text-[#cbd5e1] shadow-xl">
                  
                  {/* Model & Title Header */}
                  <div className="flex items-center justify-between border-b border-[#1c2840] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-[10px] uppercase font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded border border-[#3b82f6]/20">
                        {msg.data.sourceModel}
                      </span>
                      <span className="font-bold text-white text-xs truncate">
                        {msg.data.title || 'Institutional Diagnostic'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, `${msg.data?.title}\n\n${msg.data?.executiveSummary}\n\n${msg.data?.markdownSynthesis}`)}
                        className="text-[10px] font-mono-data text-[#64748b] hover:text-white px-2 py-0.5 rounded bg-[#080c14] border border-[#1c2840]"
                      >
                        {copiedId === msg.id ? 'COPIED' : 'COPY'}
                      </button>
                      <span className="font-mono-data text-[10px] text-[#64748b]">{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="bg-[#080c14] border-l-2 border-[#3b82f6] p-3 rounded-r border-y border-r border-[#1c2840]">
                    <div className="text-[9px] font-mono-data uppercase font-bold text-[#3b82f6] mb-1">
                      EXECUTIVE THESIS
                    </div>
                    <p className="text-white leading-relaxed text-xs font-medium">
                      {msg.data.executiveSummary}
                    </p>
                  </div>

                  {/* Markdown Synthesis (If Present) */}
                  {msg.data.markdownSynthesis && (
                    <div className="space-y-1 text-xs">
                      {renderSimpleMarkdown(msg.data.markdownSynthesis)}
                    </div>
                  )}

                  {/* Quantitative Metrics Grid */}
                  {msg.data.quantitativeMetrics && msg.data.quantitativeMetrics.length > 0 && (
                    <div>
                      <div className="text-[9px] font-mono-data uppercase font-bold text-[#64748b] mb-1.5">
                        QUANTITATIVE SENSITIVITY BENCHMARKS
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {msg.data.quantitativeMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-2.5 rounded">
                            <div className="text-[9px] text-[#64748b] uppercase tracking-tight">{metric.label}</div>
                            <div className={`font-mono-data text-xs font-bold mt-0.5 tabular-nums ${
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

                  {/* Causal Transmission Vectors */}
                  {msg.data.transmissionVectors && msg.data.transmissionVectors.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[9px] font-mono-data uppercase font-bold text-[#64748b]">
                        CROSS-ASSET TRANSMISSION CHANNELS
                      </div>
                      {msg.data.transmissionVectors.map((v, idx) => (
                        <div key={idx} className="bg-[#080c14] border border-[#1c2840] p-2.5 rounded space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-xs">{v.factor} &rarr; {v.target}</span>
                            <span className={`text-[9px] font-mono-data uppercase font-bold px-1.5 py-0.5 rounded border ${
                              v.direction === 'tailwind' ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30' :
                              v.direction === 'headwind' ? 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30' :
                              'bg-[#64748b]/10 text-[#94a3b8] border-[#64748b]/30'
                            }`}>
                              {v.direction}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#cbd5e1]">{v.mechanism}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actionable Takeaway */}
                  {msg.data.actionableTakeaway && (
                    <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/30 p-2.5 rounded">
                      <span className="text-[9px] font-mono-data uppercase font-bold text-[#3b82f6] block">
                        INSTITUTIONAL TAKEAWAY
                      </span>
                      <p className="text-white text-xs mt-0.5 font-medium">
                        {msg.data.actionableTakeaway}
                      </p>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.data.followUpSuggestions && msg.data.followUpSuggestions.length > 0 && (
                    <div className="pt-2 border-t border-[#1c2840] flex flex-wrap gap-1.5">
                      {msg.data.followUpSuggestions.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSubmit(s)}
                          className="text-[10px] bg-[#080c14] hover:bg-[#1c2840] border border-[#1c2840] hover:border-[#3b82f6] px-2 py-1 rounded text-[#cbd5e1] hover:text-white transition-all font-mono-data text-left"
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
            <div className="bg-[#0f1520] border border-[#3b82f6]/40 rounded-lg p-3.5 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] animate-pulse" />
              <span className="font-mono-data text-xs text-[#3b82f6] animate-pulse">
                Evaluating institutional transmission matrix...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar & Suggestion Pills */}
        <div className="p-3 bg-[#0f1520] border-t border-[#1c2840] space-y-2 shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask about any equity, cross-asset transmission, or macro factor..."
              className="flex-1 bg-[#080c14] border border-[#1c2840] focus:border-[#3b82f6] rounded px-3 py-2 text-xs text-white placeholder-[#64748b] outline-none font-sans"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="px-4 py-2 rounded bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-40 text-white font-mono-data font-bold text-xs uppercase transition-colors shrink-0"
            >
              SEND
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[9px] font-mono-data text-[#64748b] uppercase shrink-0">SUGGESTED:</span>
            {suggestionPills.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(p)}
                className="whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono-data bg-[#080c14] hover:bg-[#1c2840] border border-[#1c2840] text-[#cbd5e1] hover:text-white shrink-0 transition-colors"
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
