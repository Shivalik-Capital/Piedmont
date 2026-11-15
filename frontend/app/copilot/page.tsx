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
        const fallback = parseAndAnalyzeFinancialQuery(q);
        const copilotMsg: ChatMessage = {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          data: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, copilotMsg]);
      }
    } catch {
      const fallback = parseAndAnalyzeFinancialQuery(q);
      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        data: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, copilotMsg]);
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

  // Render markdown with institutional typography
  const renderMarkdownText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-on-surface mt-3.5 mb-1 tracking-tight uppercase font-mono-data border-b border-outline-variant pb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-base font-bold text-on-surface mt-4 mb-1.5 tracking-tight uppercase font-mono-data">{line.replace('## ', '')}</h2>;
      }
      // Table rows
      if (line.includes('|')) {
        const cells = line.split('|').filter(c => c.trim().length > 0);
        if (cells.length > 1 && !line.includes('---')) {
          const isHeader = idx === 0 || lines[idx - 1]?.includes('---');
          return (
            <div key={idx} className={`grid grid-cols-${cells.length} gap-2 py-1.5 px-2 font-mono-data text-xs border-b border-outline-variant/60 ${isHeader ? 'bg-surface-container-highest text-on-surface-variant font-bold uppercase' : 'text-on-surface'}`}>
              {cells.map((c, cIdx) => (
                <div key={cIdx} className="truncate">{c.trim().replace(/\*\*/g, '')}</div>
              ))}
            </div>
          );
        }
        return null;
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.replace(/^[-*]\s+/, '');
        return (
          <li key={idx} className="text-xs text-on-surface-variant leading-relaxed ml-4 list-disc my-0.5">
            <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-on-surface font-semibold">$1</strong>') }} />
          </li>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        const text = line.replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="text-xs text-on-surface-variant leading-relaxed ml-4 list-decimal my-0.5">
            <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-on-surface font-semibold">$1</strong>') }} />
          </li>
        );
      }
      // Blank lines
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Standard paragraphs
      return (
        <p key={idx} className="text-xs text-on-surface-variant leading-relaxed my-1">
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-on-surface font-semibold">$1</strong>') }} />
        </p>
      );
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono-data text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded font-bold border border-primary/20">
              PIEDMONT COPILOT
            </span>
            <span className="text-xs text-on-surface-variant font-mono-data uppercase">
              INSTITUTIONAL FINANCIAL RESEARCH STUDIO
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Market Intelligence & Cross-Asset Transmission
          </h1>
          <p className="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Quantitative diagnostic reasoning across Indian equities, macroeconomic policy transmissions, DuPont ROE decompositions, and global cross-asset vectors.
          </p>
        </div>

        {/* Engine Status & BYOK Connector */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-data flex items-center gap-1.5 transition-all shadow-sm ${
              customKey
                ? 'bg-positive/10 border-positive text-positive font-bold'
                : 'bg-primary/10 border-primary text-primary hover:bg-primary/20 font-semibold'
            }`}
            title="Configure Neural Model API Key"
          >
            <Icon name="tune" className="w-3.5 h-3.5" />
            <span>{customKey ? `${provider.toUpperCase()} NEURAL ACTIVE` : 'CONNECT FREE GEMINI KEY'}</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-highest text-xs font-mono-data text-on-surface-variant hover:text-on-surface transition-colors"
              title="Clear Research Thread"
            >
              CLEAR THREAD
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Conversational Research Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Messages Container */}
          <div className="bg-surface border border-outline-variant rounded-xl min-h-[500px] max-h-[700px] overflow-y-auto p-5 space-y-5 no-scrollbar flex flex-col shadow-sm">
            
            {/* Empty State Welcome */}
            {messages.length === 0 && (
              <div className="my-auto py-8 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                  <Icon name="bot" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface tracking-tight">Institutional Research Console Ready</h3>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Ask any question regarding Indian capital markets, sectoral sensitivities, corporate valuation diagnostics, or macroeconomic transmission vectors.
                  </p>
                </div>
                <div className="text-left bg-surface-container border border-outline-variant rounded-xl p-3.5 space-y-2">
                  <div className="text-[10px] text-on-surface-variant font-mono-data uppercase font-bold">Suggested Research Inquiries:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {samplePrompts.slice(0, 4).map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p.q)}
                        className="text-left text-xs bg-surface hover:bg-surface-container-highest border border-outline-variant hover:border-primary px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-all font-mono-data"
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
                    <div className="max-w-[85%] bg-primary/10 border border-primary/30 text-on-surface px-4 py-3 rounded-xl shadow-sm">
                      <div className="text-xs font-medium leading-relaxed">{msg.text}</div>
                      <div className="text-[9px] font-mono-data text-on-surface-variant mt-1 text-right">{msg.timestamp}</div>
                    </div>
                  </div>
                )}

                {/* Copilot Institutional Memorandum */}
                {msg.sender === 'copilot' && msg.data && (
                  <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4 text-xs text-on-surface shadow-sm">
                    
                    {/* Memorandum Top Bar */}
                    <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-data text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {msg.data.sourceModel}
                        </span>
                        <span className="text-xs font-bold text-on-surface truncate max-w-md">
                          {msg.data.title || 'Institutional Diagnostic'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, `${msg.data?.title}\n\n${msg.data?.executiveSummary}\n\n${msg.data?.markdownSynthesis}`)}
                          className="text-[10px] font-mono-data text-on-surface-variant hover:text-on-surface px-2.5 py-1 rounded bg-surface border border-outline-variant hover:border-primary transition-colors"
                          title="Copy Memorandum"
                        >
                          {copiedId === msg.id ? 'COPIED!' : 'COPY MEMO'}
                        </button>
                        <span className="font-mono-data text-[10px] text-on-surface-variant">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Executive Thesis Summary */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono-data uppercase font-bold text-primary">
                        EXECUTIVE SUMMARY & THESIS
                      </div>
                      <p className="text-on-surface text-xs leading-relaxed font-normal">
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
                        <div className="text-[10px] font-mono-data uppercase font-bold text-on-surface-variant mb-2">
                          QUANTITATIVE SENSITIVITY BENCHMARKS
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {msg.data.quantitativeMetrics.map((metric, idx) => (
                            <div key={idx} className="bg-surface border border-outline-variant p-3 rounded-lg">
                              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-mono-data font-medium">{metric.label}</div>
                              <div className={`font-mono-data text-xs font-bold mt-1 tabular-nums ${
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

                    {/* Causal Transmission Vectors (If Present) */}
                    {msg.data.transmissionVectors && msg.data.transmissionVectors.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="text-[10px] font-mono-data uppercase font-bold text-on-surface-variant">
                          CROSS-ASSET CAUSAL FLOW VECTORS
                        </div>
                        {msg.data.transmissionVectors.map((v, idx) => (
                          <div key={idx} className="bg-surface border border-outline-variant p-3.5 rounded-lg space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-on-surface text-xs">{v.factor} &rarr; {v.target}</span>
                              <span className={`text-[10px] font-mono-data uppercase font-bold px-2 py-0.5 rounded border ${
                                v.direction === 'tailwind' ? 'bg-positive/10 text-positive border-positive/30' :
                                v.direction === 'headwind' ? 'bg-negative/10 text-negative border-negative/30' :
                                'bg-outline-variant text-on-surface-variant border-outline-variant'
                              }`}>
                                {v.direction}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">{v.mechanism}</p>
                            {v.historicalPrecedent && (
                              <div className="text-[10px] text-on-surface-variant bg-surface-container p-2 rounded font-mono-data border border-outline-variant">
                                <span className="text-primary font-bold">Historical Precedent:</span> {v.historicalPrecedent}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actionable Portfolio Takeaway */}
                    {msg.data.actionableTakeaway && (
                      <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-lg">
                        <div className="text-[10px] font-mono-data uppercase font-bold text-primary mb-0.5">
                          INSTITUTIONAL PORTFOLIO ACTION
                        </div>
                        <p className="text-on-surface text-xs leading-relaxed font-medium">
                          {msg.data.actionableTakeaway}
                        </p>
                      </div>
                    )}

                    {/* Dynamic Follow-Up Suggestions */}
                    {msg.data.followUpSuggestions && msg.data.followUpSuggestions.length > 0 && (
                      <div className="pt-3 border-t border-outline-variant space-y-1.5">
                        <div className="text-[10px] font-mono-data uppercase text-on-surface-variant font-bold">
                          DRILL DOWN (CLICK TO INQUIRE):
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.data.followUpSuggestions.map((s, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSend(s)}
                              className="text-xs bg-surface hover:bg-surface-container-highest border border-outline-variant hover:border-primary px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface transition-all font-mono-data text-left"
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
              <div className="bg-surface-container border border-primary/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono-data text-xs text-on-surface font-semibold">
                    PIEDMONT ENGINE PROCESSING
                  </span>
                </div>
                <div className="text-xs text-primary font-mono-data animate-pulse">
                  &gt; {loadingStage}
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Research Prompt Input Bar */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-4 space-y-3 shadow-sm">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask about any equity, cross-asset transmission (e.g. falling gold, crude oil), or valuation multiple..."
                className="w-full bg-surface border border-outline-variant focus:border-primary rounded-lg px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/60 outline-none resize-none font-sans"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-mono-data text-on-surface-variant">
                  Press <kbd className="bg-surface border border-outline-variant px-1.5 py-0.5 rounded text-on-surface">Enter</kbd> to send, <kbd className="bg-surface border border-outline-variant px-1.5 py-0.5 rounded text-on-surface">Shift+Enter</kbd> for newline
                </span>
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !query.trim()}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dim disabled:opacity-40 text-white font-mono-data font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>EXECUTE RESEARCH</span>
                  <Icon name="send" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Shortcuts Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[9px] font-mono-data text-on-surface-variant uppercase shrink-0 font-bold">QUICK INQUIRY:</span>
              {samplePrompts.slice(0, 5).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.q)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-mono-data bg-surface hover:bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-on-surface shrink-0 transition-colors"
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
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2.5">
              <span className="text-[10px] font-mono-data uppercase font-bold text-on-surface-variant">
                MACRO TELEMETRY (NOV 2026)
              </span>
              <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
            </div>

            <div className="space-y-2 font-mono-data text-xs">
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">Nifty 50 Benchmark:</span>
                <span className="text-on-surface font-bold">25,800 (+0.42%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">Nifty P/E (Trailing):</span>
                <span className="text-on-surface font-bold">22.8x</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">RBI Repo Rate:</span>
                <span className="text-on-surface font-bold">5.50% (Neutral)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">CPI Inflation (Oct):</span>
                <span className="text-negative font-bold">6.09% (Food 8.94%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">WPI Inflation (Oct):</span>
                <span className="text-positive font-bold">2.36%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">Forex Reserves:</span>
                <span className="text-on-surface font-bold">$719.55B</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">Gold Reserves in Forex:</span>
                <span className="text-amber-500 font-bold">$104.80B</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">10Y G-Sec Yield:</span>
                <span className="text-on-surface font-bold">6.78%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant">USD / INR:</span>
                <span className="text-on-surface font-bold">84.38</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">Brent Crude Oil:</span>
                <span className="text-on-surface font-bold">$72.80 / bbl</span>
              </div>
            </div>
          </div>

          {/* Cross-Asset Sensitivity Matrix Card */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-3 shadow-sm">
            <span className="text-[10px] font-mono-data uppercase font-bold text-on-surface-variant block border-b border-outline-variant pb-2">
              INSTITUTIONAL TRANSMISSION RULES
            </span>
            <div className="space-y-2 text-xs">
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <div className="font-semibold text-on-surface text-xs">Gold Price Correction</div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  -$1.8B to $2.2B CAD per 5% drop &rarr; Rupee anchors &rarr; Titan SSSG volume expands.
                </p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <div className="font-semibold text-on-surface text-xs">Crude Oil & Paints / Aviation</div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  +$10/bbl expands CAD by ~$13B &rarr; Asian Paints gross margin -100 bps.
                </p>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <div className="font-semibold text-on-surface text-xs">DII Domestic Liquidity Floor</div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  ₹24,500+ Cr monthly SIPs systematically absorb foreign institutional liquidation.
                </p>
              </div>
            </div>
          </div>

          {/* BYOK Neural AI Card */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-3 text-xs shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface uppercase text-xs font-mono-data">Neural AI Connector</span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-mono-data uppercase border ${
                customKey ? 'bg-positive/10 text-positive border-positive/30' : 'bg-primary/10 text-primary border-primary/30'
              }`}>
                {customKey ? 'KEY CONNECTED' : 'FREE TIER READY'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Connect a free Google Gemini 2.5 Flash API key to enable unconstrained neural generative synthesis alongside Piedmont's deterministic engine.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setShowKeyModal(true)}
                className="w-full py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary hover:text-on-surface font-mono-data font-semibold text-xs uppercase transition-colors"
              >
                {customKey ? 'Update API Key' : 'Connect Gemini 2.5 Key &rarr;'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Free Neural API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div>
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider font-mono-data">
                  Connect Free Neural AI Engine
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Get a free Gemini 2.5 Flash API key with zero billing required.
                </p>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-on-surface-variant mb-1 font-mono-data uppercase text-[10px] font-bold">
                  Select AI Provider
                </label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary font-mono-data"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Official Free Tier)</option>
                  <option value="groq">Groq Cloud Llama 3.3 (Fast LPU Free Tier)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-on-surface-variant font-mono-data uppercase text-[10px] font-bold">
                    API Key (Stored Strictly in Browser)
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline hover:text-primary-dim font-mono-data"
                  >
                    Get Free Key at Google AI Studio &rarr;
                  </a>
                </div>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste AI Studio Key (e.g. AIzaSy...)"
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-on-surface outline-none focus:border-primary font-mono-data text-xs"
                />
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your key is stored only in your browser localStorage. It is never logged or stored on any server.
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
              <button
                onClick={clearKey}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-mono-data text-xs"
              >
                Clear Key
              </button>
              <button
                onClick={saveKeySettings}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-dim text-white font-mono-data font-bold text-xs uppercase shadow-sm"
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
