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
              executiveSummary: 'Piedmont Copilot is active. Inquire about any Indian equity, macroeconomic policy transmission (e.g., falling gold prices, crude oil sensitivity, repo rate trajectory), DuPont ROE diagnostics, or market microstructure.',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
      <div className="w-full max-w-4xl h-[88vh] bg-surface border border-outline-variant rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Terminal Header */}
        <div className="px-6 py-4 bg-surface-container border-b border-outline-variant flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-on-surface tracking-wide text-sm font-mono-data uppercase">Piedmont Copilot</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono-data font-semibold uppercase bg-primary/10 text-primary border border-primary/20">
                  {customKey ? `${provider.toUpperCase()} NEURAL ACTIVE` : 'BLENDED ENGINE'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-mono-data">Institutional Market Intelligence & Quantitative Transmission</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/copilot"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs font-mono-data font-semibold bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary hover:text-on-surface transition-colors"
            >
              FULL STUDIO &rarr;
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
              title="API Key Configuration"
            >
              <Icon name="tune" className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
              title="Close (Esc)"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Neural API Settings Drawer */}
        {showSettings && (
          <div className="p-4 bg-surface-container border-b border-outline-variant text-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-on-surface uppercase tracking-wider text-xs block font-mono-data">
                  Connect Free Neural AI (Google Gemini / Groq)
                </span>
                <span className="text-xs text-on-surface-variant">
                  Get an unconstrained free API key with zero billing required.
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary underline hover:text-primary-dim font-mono-data"
              >
                Get Free Gemini Key &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-on-surface-variant mb-1 text-[11px] uppercase font-mono-data">Engine Provider</label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary font-mono-data text-xs"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Official Free Tier)</option>
                  <option value="groq">Groq Cloud Llama 3.3 (Fast LPU Free Tier)</option>
                </select>
              </div>
              <div>
                <label className="block text-on-surface-variant mb-1 text-[11px] uppercase font-mono-data">API Key (Stored Locally in Browser)</label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste AI Studio Key (e.g. AIzaSy...)"
                  className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface outline-none focus:border-primary font-mono-data text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
              <span className="text-xs text-on-surface-variant">
                Key is saved strictly in your browser localStorage. Never sent to any third party.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCustomKey('');
                    localStorage.removeItem('piedmont_byok_key');
                    setShowSettings(false);
                  }}
                  className="px-3 py-1.5 rounded bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-mono-data text-xs"
                >
                  Clear Key
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-1.5 rounded bg-primary text-white font-mono-data font-bold text-xs hover:bg-primary-dim transition-colors"
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
                <div className="max-w-[85%] bg-primary/10 border border-primary/30 text-on-surface px-4 py-3 rounded-xl text-sm font-medium shadow-sm">
                  {msg.text}
                  <div className="text-[10px] font-mono-data text-on-surface-variant mt-1 text-right">{msg.timestamp}</div>
                </div>
              )}

              {/* Copilot Institutional Analysis Block */}
              {msg.sender === 'copilot' && msg.data && (
                <div className="w-full bg-surface-container border border-outline-variant rounded-xl p-6 space-y-5 text-sm text-on-surface shadow-sm">
                  
                  {/* Model & Title Header */}
                  <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-xs uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {msg.data.sourceModel}
                      </span>
                      <span className="font-bold text-on-surface text-sm truncate">
                        {msg.data.title || 'Institutional Diagnostic'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, `${msg.data?.title}\n\n${msg.data?.executiveSummary}\n\n${msg.data?.markdownSynthesis}`)}
                        className="text-xs font-mono-data text-on-surface-variant hover:text-on-surface px-2.5 py-1 rounded bg-surface border border-outline-variant hover:border-primary transition-colors"
                      >
                        {copiedId === msg.id ? 'COPIED!' : 'COPY MEMO'}
                      </button>
                      <span className="font-mono-data text-xs text-on-surface-variant">{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Executive Thesis */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono-data uppercase font-bold text-primary">
                      EXECUTIVE THESIS
                    </div>
                    <p className="text-on-surface text-sm leading-relaxed font-normal">
                      {msg.data.executiveSummary}
                    </p>
                  </div>

                  {/* Quantitative Benchmarks Grid */}
                  {msg.data.quantitativeMetrics && msg.data.quantitativeMetrics.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-mono-data uppercase font-bold text-on-surface-variant mb-2">
                        QUANTITATIVE SENSITIVITY BENCHMARKS
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {msg.data.quantitativeMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-surface border border-outline-variant p-3 rounded-lg">
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-mono-data font-medium">{metric.label}</div>
                            <div className={`font-mono-data text-sm font-bold mt-1 tabular-nums ${
                              metric.stance === 'positive' ? 'text-positive' :
                              metric.stance === 'negative' ? 'text-negative' :
                              'text-on-surface'
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
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono-data uppercase font-bold text-on-surface-variant">
                        CROSS-ASSET TRANSMISSION CHANNELS
                      </div>
                      <div className="space-y-2">
                        {msg.data.transmissionVectors.map((v, idx) => (
                          <div key={idx} className="bg-surface border border-outline-variant p-3.5 rounded-lg space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-on-surface text-sm">{v.factor} &rarr; {v.target}</span>
                              <span className={`text-[10px] font-mono-data uppercase font-bold px-2 py-0.5 rounded border ${
                                v.direction === 'tailwind' ? 'bg-positive/10 text-positive border-positive/30' :
                                v.direction === 'headwind' ? 'bg-negative/10 text-negative border-negative/30' :
                                'bg-outline-variant text-on-surface-variant border-outline-variant'
                              }`}>
                                {v.direction}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">{v.mechanism}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Takeaway */}
                  {msg.data.actionableTakeaway && (
                    <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-lg">
                      <span className="text-[10px] font-mono-data uppercase font-bold text-primary block">
                        INSTITUTIONAL TAKEAWAY
                      </span>
                      <p className="text-on-surface text-xs mt-1 font-medium leading-relaxed">
                        {msg.data.actionableTakeaway}
                      </p>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.data.followUpSuggestions && msg.data.followUpSuggestions.length > 0 && (
                    <div className="pt-3 border-t border-outline-variant flex flex-wrap gap-2">
                      {msg.data.followUpSuggestions.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSubmit(s)}
                          className="text-xs bg-surface hover:bg-surface-container-highest border border-outline-variant hover:border-primary px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-all font-mono-data text-left"
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
            <div className="bg-surface-container border border-primary/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono-data text-xs text-primary animate-pulse">
                Evaluating institutional transmission matrix...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar & Suggestion Pills */}
        <div className="p-4 bg-surface-container border-t border-outline-variant space-y-3 shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask about any equity, cross-asset transmission (e.g. falling gold, crude oil), or macro factor..."
              className="flex-1 bg-surface border border-outline-variant focus:border-primary rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none font-sans"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dim disabled:opacity-40 text-white font-mono-data font-bold text-xs uppercase transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>SEND</span>
              <Icon name="send" className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[10px] font-mono-data text-on-surface-variant uppercase shrink-0 font-bold">SUGGESTED:</span>
            {suggestionPills.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-mono-data bg-surface hover:bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-on-surface shrink-0 transition-colors"
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
