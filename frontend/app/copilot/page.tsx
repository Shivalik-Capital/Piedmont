'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/ui/Icon';
import { CopilotResponse, parseAndAnalyzeFinancialQuery } from '../lib/financial-engine';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text?: string;
  data?: CopilotResponse;
  timestamp: string;
}

export default function CopilotStudioPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [customKey, setCustomKey] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'groq'>('gemini');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState('Synthesizing transmission matrix...');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load custom key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('piedmont_byok_key') || '';
      const savedProvider = (localStorage.getItem('piedmont_byok_provider') as any) || 'gemini';
      setCustomKey(savedKey);
      setProvider(savedProvider);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Loading indicator animation stages
  useEffect(() => {
    if (!loading) return;
    const stages = [
      'Decomposing financial entities...',
      'Evaluating cross-asset transmission matrix...',
      'Computing quantitative sensitivity benchmarks...',
      'Synthesizing institutional research memorandum...'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % stages.length;
      setLoadingStage(stages[idx]);
    }, 450);
    return () => clearInterval(interval);
  }, [loading]);

  const saveKeySettings = () => {
    localStorage.setItem('piedmont_byok_key', customKey.trim());
    localStorage.setItem('piedmont_byok_provider', provider);
    setShowKeyModal(false);
  };

  const clearKey = () => {
    setCustomKey('');
    localStorage.removeItem('piedmont_byok_key');
    setShowKeyModal(false);
  };

  const handleSend = async (overrideText?: string) => {
    const q = (overrideText || query).trim();
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
        const fallbackRes = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q })
        });
        const fallbackData = await fallbackRes.json();
        const copilotMsg: ChatMessage = {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          data: fallbackData,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, copilotMsg]);
      }
    } catch {
      // Local fallback using high-precision financial engine
      const localData = parseAndAnalyzeFinancialQuery(q);
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          data: localData,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdownText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-xs leading-relaxed text-[#cccccc]">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-white font-semibold text-xs mt-3 mb-1 tracking-[-0.02em]">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          if (trimmed.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#479ffa] mt-1 shrink-0 text-[10px]">&#9670;</span>
                <span className="text-[#868f97]">{parseInlineBold(trimmed.substring(2))}</span>
              </div>
            );
          }

          if (trimmed.startsWith('|')) {
            return (
              <div key={idx} className="overflow-x-auto my-2">
                <span className="text-[11px] font-mono-data text-[#868f97]">{trimmed}</span>
              </div>
            );
          }

          return <p key={idx} className="text-[#868f97]">{parseInlineBold(trimmed)}</p>;
        })}
      </div>
    );
  };

  const parseInlineBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-medium">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const samplePrompts = [
    { label: 'Falling Gold & Nifty 50', q: 'How is gold prices falling affecting Nifty 50?' },
    { label: 'Crude Oil & Paints / Swiggy', q: 'How does crude oil impact Asian Paints, IndiGo, and Swiggy?' },
    { label: 'CPI (6.09%) vs WPI (2.36%)', q: 'Why is CPI at 6.09% while WPI is at 2.36%? What does it mean for RBI repo rates?' },
    { label: 'DII SIPs vs FII Selling', q: 'How do monthly mutual fund SIP inflows of ₹24,500 Cr absorb FII selling?' },
    { label: 'Nifty Valuation at 25,800', q: 'Is Nifty 50 overvalued at 25,800 based on P/E and the 10Y G-Sec yield gap?' },
    { label: 'DuPont ROE: HDFC Bank', q: 'Break down DuPont ROE decomposition for HDFC Bank' },
    { label: 'Titan Company & Gold Price', q: 'How does gold price movement affect Titan Company revenue and margins?' },
    { label: 'US Fed Rate Cut Transmission', q: 'What happens to Indian equities and the Rupee when the US Federal Reserve cuts rates?' }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#479ffa] bg-[#141414] px-3 py-1 rounded-full font-medium border border-[#2a2a2a]">
              Piedmont Copilot
            </span>
            <span className="text-[11px] text-[#868f97] uppercase">
              Financial Research Studio
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-normal tracking-[-0.08em] text-white">
            Market Intelligence & <span className="text-[#ffa16c]">Transmission</span>.
          </h1>
          <p className="text-xs text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
            Institutional diagnostic reasoning across Indian equities, macroeconomic policy transmissions, DuPont ROE decompositions, and cross-asset vectors.
          </p>
        </div>

        {/* Engine Status & BYOK Connector */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`px-4 py-1.5 rounded-full border text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              customKey
                ? 'bg-[#191919] border-[#4ebe96]/40 text-[#4ebe96] font-medium'
                : 'bg-[#191919] hover:bg-[#222222] border-[#262626] hover:border-[#3a3a3a] text-white'
            }`}
            title="Configure Neural Model API Key"
          >
            <Icon name="tune" className="w-3.5 h-3.5" />
            <span>{customKey ? `${provider.toUpperCase()} NEURAL ACTIVE` : 'Connect Free Gemini Key'}</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-4 py-1.5 rounded-full border border-[#262626] bg-[#191919] hover:bg-[#222222] text-xs text-[#868f97] hover:text-white transition-colors"
              title="Clear Research Thread"
            >
              Clear Thread
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Conversational Research Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Messages Container */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] min-h-[500px] max-h-[700px] overflow-y-auto p-5 space-y-5 no-scrollbar flex flex-col shadow-[0_0_44px_rgba(0,0,0,0.8)]">
            
            {/* Empty State Welcome */}
            {messages.length === 0 && (
              <div className="my-auto py-8 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-[#131313] border border-[#262626] flex items-center justify-center mx-auto text-[#479ffa] shadow-[0_0_20px_rgba(71,159,250,0.2)]">
                  <Icon name="smart_toy" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white tracking-[-0.03em]">Institutional Research Console Ready</h3>
                  <p className="text-xs text-[#868f97] mt-1 leading-relaxed">
                    Ask any question regarding Indian capital markets, sectoral sensitivities, corporate valuation diagnostics, or macroeconomic transmission vectors.
                  </p>
                </div>
                <div className="text-left bg-[#141414] border border-[#262626] rounded-[14px] p-4 space-y-2.5">
                  <div className="text-[10px] text-[#868f97] uppercase tracking-wider font-mono-data">Suggested Research Inquiries:</div>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.slice(0, 4).map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p.q)}
                        className="text-left text-xs bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] px-3.5 py-1.5 rounded-full text-[#868f97] hover:text-white transition-all"
                      >
                        &rarr; {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                
                {/* User Prompt Message */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-[#222222] border border-[#333333] text-white px-4 py-2.5 rounded-[14px] shadow-sm">
                      <div className="text-xs font-normal leading-relaxed">{msg.text}</div>
                      <div className="text-[10px] font-mono-data text-[#868f97] mt-1 text-right">{msg.timestamp}</div>
                    </div>
                  </div>
                )}

                {/* Copilot Institutional Memorandum */}
                {msg.sender === 'copilot' && msg.data && (
                  <div className="bg-[#141414] border border-[#262626] rounded-[16px] p-5 space-y-4 text-xs text-white shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    
                    {/* Memorandum Top Bar */}
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-data text-[10px] uppercase font-medium text-[#868f97] bg-[#1a1a1a] px-2.5 py-0.5 rounded-full border border-[#2a2a2a]">
                          {msg.data.sourceModel}
                        </span>
                        <span className="text-sm font-semibold text-white tracking-[-0.03em] truncate max-w-md">
                          {msg.data.title || 'Institutional Diagnostic'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, `${msg.data?.title}\n\n${msg.data?.executiveSummary}\n\n${msg.data?.markdownSynthesis}`)}
                          className="text-[11px] text-[#868f97] hover:text-white px-3 py-1 rounded-full bg-[#191919] hover:bg-[#222222] border border-[#2a2a2a] transition-all"
                          title="Copy Memorandum"
                        >
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                        <span className="font-mono-data text-[10px] text-[#555555]">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Executive Thesis Summary */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono-data uppercase font-semibold text-[#ffa16c] tracking-wider">
                        EXECUTIVE SUMMARY & THESIS
                      </div>
                      <p className="text-white text-xs leading-relaxed font-normal">
                        {msg.data.executiveSummary}
                      </p>
                    </div>

                    {/* Rich Markdown Synthesis Body */}
                    {msg.data.markdownSynthesis && (
                      <div className="space-y-1 pt-1">
                        {renderMarkdownText(msg.data.markdownSynthesis)}
                      </div>
                    )}

                    {/* Quantitative Sensitivity Metrics Grid */}
                    {msg.data.quantitativeMetrics && msg.data.quantitativeMetrics.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] font-mono-data uppercase font-semibold text-[#868f97] mb-2 tracking-wider">
                          QUANTITATIVE SENSITIVITY BENCHMARKS
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {msg.data.quantitativeMetrics.map((metric, idx) => (
                            <div key={idx} className="bg-[#191919] border border-[#262626] p-3 rounded-[12px]">
                              <div className="text-[10px] text-[#868f97] uppercase tracking-wider font-mono-data">{metric.label}</div>
                              <div className={`font-mono-data text-xs font-semibold mt-1 tabular-nums ${
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

                    {/* Causal Transmission Vectors (If Present) */}
                    {msg.data.transmissionVectors && msg.data.transmissionVectors.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="text-[10px] font-mono-data uppercase font-semibold text-[#868f97] tracking-wider">
                          CROSS-ASSET CAUSAL FLOW VECTORS
                        </div>
                        {msg.data.transmissionVectors.map((v, idx) => (
                          <div key={idx} className="bg-[#191919] border border-[#262626] p-3.5 rounded-[12px] space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
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
                            {v.historicalPrecedent && (
                              <div className="text-[11px] text-[#868f97] bg-[#141414] p-2.5 rounded-[8px] border border-[#262626] mt-1.5">
                                <span className="text-[#ffa16c] font-medium">Historical Precedent:</span> {v.historicalPrecedent}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actionable Portfolio Takeaway */}
                    {msg.data.actionableTakeaway && (
                      <div className="bg-[#1c1815] border border-[#ffa16c]/25 p-3.5 rounded-[12px]">
                        <div className="text-[10px] font-mono-data uppercase font-semibold text-[#ffa16c] mb-0.5 tracking-wider">
                          INSTITUTIONAL PORTFOLIO ACTION
                        </div>
                        <p className="text-white text-xs leading-relaxed font-normal">
                          {msg.data.actionableTakeaway}
                        </p>
                      </div>
                    )}

                    {/* Dynamic Follow-Up Suggestions */}
                    {msg.data.followUpSuggestions && msg.data.followUpSuggestions.length > 0 && (
                      <div className="pt-2 border-t border-[#262626] space-y-1.5">
                        <div className="text-[10px] font-mono-data uppercase text-[#868f97] tracking-wider">
                          DRILL DOWN (CLICK TO INQUIRE):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.data.followUpSuggestions.map((s, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSend(s)}
                              className="text-xs bg-[#191919] hover:bg-[#222222] border border-[#262626] hover:border-[#3a3a3a] px-3.5 py-1.5 rounded-full text-[#868f97] hover:text-white transition-all text-left"
                            >
                              &rarr; {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}

            {/* Live Loading Typing Animation */}
            {loading && (
              <div className="bg-[#141414] border border-[#262626] rounded-[16px] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#479ffa] animate-pulse" />
                  <span className="text-xs text-white font-medium">
                    Piedmont Reasoning Engine
                  </span>
                </div>
                <div className="text-xs text-[#868f97]">
                  &gt; {loadingStage}
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Research Prompt Input Bar */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-4 space-y-3 shadow-[0_0_44px_rgba(0,0,0,0.8)]">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask about any equity, cross-asset transmission (e.g. falling gold, crude oil), or valuation multiple..."
                className="w-full bg-[#131313] border border-[#262626] focus:border-[#479ffa] rounded-[12px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#555555] outline-none resize-none"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-[#555555]">
                  Press <kbd className="bg-[#141414] border border-[#262626] px-1.5 py-0.5 rounded text-[#868f97]">Enter</kbd> to send, <kbd className="bg-[#141414] border border-[#262626] px-1.5 py-0.5 rounded text-[#868f97]">Shift+Enter</kbd> for newline
                </span>
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !query.trim()}
                  className="px-5 py-2 rounded-full bg-white hover:bg-[#e0e0e0] disabled:opacity-30 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center gap-1.5"
                >
                  <span>Execute Research</span>
                  <Icon name="arrow_forward" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Shortcuts Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[9px] font-mono-data text-[#555555] uppercase shrink-0 font-medium">QUICK INQUIRY:</span>
              {samplePrompts.slice(0, 5).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.q)}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] bg-[#141414] hover:bg-[#202020] border border-[#262626] text-[#868f97] hover:text-white shrink-0 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Telemetry & Macro Cockpit (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Live Market Telemetry (Mid-November 2026 Baseline) */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 space-y-3.5 shadow-[0_0_44px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
              <span className="text-[10px] font-mono-data uppercase font-semibold text-[#868f97] tracking-wider">
                MACRO TELEMETRY (NOV 2026)
              </span>
              <span className="w-2 h-2 rounded-full bg-[#4ebe96] shadow-[0_0_8px_rgba(78,190,150,0.6)]" />
            </div>

            <div className="space-y-2 font-mono-data text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">Nifty 50 Benchmark:</span>
                <span className="text-white font-semibold tabular-nums">25,810.45 (+0.42%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">Nifty P/E (Trailing):</span>
                <span className="text-white font-semibold tabular-nums">22.8x</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">RBI Repo Rate:</span>
                <span className="text-white font-semibold tabular-nums">5.50% (Neutral)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">CPI Inflation (Oct):</span>
                <span className="text-[#eb5757] font-semibold tabular-nums">6.09% (Food 8.94%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">WPI Inflation (Oct):</span>
                <span className="text-[#4ebe96] font-semibold tabular-nums">2.36%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">Forex Reserves:</span>
                <span className="text-white font-semibold tabular-nums">$719.55B</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">Gold Reserves in Forex:</span>
                <span className="text-[#ffa16c] font-semibold tabular-nums">$104.80B</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">10Y G-Sec Yield:</span>
                <span className="text-white font-semibold tabular-nums">6.78%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#222222]">
                <span className="text-[#868f97]">USD / INR:</span>
                <span className="text-white font-semibold tabular-nums">84.38</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#868f97]">Brent Crude Oil:</span>
                <span className="text-white font-semibold tabular-nums">$72.80 / bbl</span>
              </div>
            </div>
          </div>

          {/* Cross-Asset Sensitivity Matrix Card */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 space-y-3 shadow-[0_0_44px_rgba(0,0,0,0.8)]">
            <span className="text-[10px] font-mono-data uppercase font-semibold text-[#868f97] block border-b border-[#262626] pb-2 tracking-wider">
              INSTITUTIONAL TRANSMISSION RULES
            </span>
            <div className="space-y-2 text-xs">
              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                <div className="font-medium text-white text-xs">Gold Price Correction</div>
                <p className="text-[11px] text-[#868f97] mt-1 leading-relaxed">
                  -$1.8B to $2.2B CAD per 5% drop &rarr; Rupee anchors &rarr; Titan SSSG volume expands.
                </p>
              </div>
              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                <div className="font-medium text-white text-xs">Crude Oil & Paints / Aviation</div>
                <p className="text-[11px] text-[#868f97] mt-1 leading-relaxed">
                  +$10/bbl expands CAD by ~$13B &rarr; Asian Paints gross margin -100 bps.
                </p>
              </div>
              <div className="bg-[#141414] p-3 rounded-[12px] border border-[#262626]">
                <div className="font-medium text-white text-xs">DII Domestic Liquidity Floor</div>
                <p className="text-[11px] text-[#868f97] mt-1 leading-relaxed">
                  ₹24,500+ Cr monthly SIPs systematically absorb foreign institutional liquidation.
                </p>
              </div>
            </div>
          </div>

          {/* BYOK Neural AI Card */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 space-y-3 text-xs shadow-[0_0_44px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white tracking-[-0.02em] text-xs">Neural AI Connector</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono-data uppercase border ${
                customKey ? 'bg-[#4ebe96]/10 text-[#4ebe96] border-[#4ebe96]/20' : 'bg-[#141414] text-[#868f97] border-[#262626]'
              }`}>
                {customKey ? 'KEY CONNECTED' : 'FREE TIER READY'}
              </span>
            </div>
            <p className="text-xs text-[#868f97] leading-relaxed">
              Connect a free Google Gemini 2.5 Flash API key to enable unconstrained neural generative synthesis alongside Piedmont's deterministic engine.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setShowKeyModal(true)}
                className="w-full py-2 rounded-full bg-[#141414] hover:bg-[#202020] border border-[#262626] hover:border-[#3a3a3a] text-white text-xs font-medium transition-all"
              >
                {customKey ? 'Update API Key' : 'Connect Gemini 2.5 Key &rarr;'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Free Neural API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#191919] border border-[#262626] rounded-[16px] p-6 space-y-4 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-[-0.02em]">
                  Connect Free Neural AI Engine
                </h3>
                <p className="text-xs text-[#868f97] mt-0.5">
                  Get a free Gemini 2.5 Flash API key with zero billing required.
                </p>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-full text-[#868f97] hover:text-white"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#868f97] mb-1 font-mono-data uppercase text-[10px] tracking-wider">
                  Select AI Provider
                </label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-[#131313] border border-[#262626] rounded-[10px] px-3 py-2 text-white outline-none focus:border-[#479ffa]"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Official Free Tier)</option>
                  <option value="groq">Groq Cloud Llama 3.3 (Fast LPU Free Tier)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#868f97] font-mono-data uppercase text-[10px] tracking-wider">
                    API Key (Stored Strictly in Browser)
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#ffa16c] hover:underline"
                  >
                    Get Free Key at Google AI Studio &rarr;
                  </a>
                </div>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste AI Studio Key (e.g. AIzaSy...)"
                  className="w-full bg-[#131313] border border-[#262626] rounded-[10px] px-3 py-2 text-white outline-none focus:border-[#479ffa] text-xs"
                />
              </div>

              <p className="text-xs text-[#868f97] leading-relaxed">
                Your key is stored only in your browser localStorage. It is never logged or stored on any server.
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#262626]">
              <button
                onClick={clearKey}
                className="px-4 py-1.5 rounded-full bg-[#141414] hover:bg-[#202020] text-[#868f97] hover:text-white text-xs transition-all"
              >
                Clear Key
              </button>
              <button
                onClick={saveKeySettings}
                className="px-5 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-[#e0e0e0] transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
