'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  X, 
  Sliders, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { CopilotResponse } from '../../lib/financial-engine';

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

const SAMPLE_QUESTIONS = [
  'How do falling gold prices affect Nifty 50 and Titan?',
  'How does crude oil impact Asian Paints and Swiggy?',
  'Why is CPI at 6.09% while WPI is at 2.36%?',
  'Break down DuPont ROE for HDFC Bank'
];

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

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

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
        const fallbackRes = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q })
        });
        const data = await fallbackRes.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `copilot-${Date.now()}`,
            sender: 'copilot',
            data,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          data: {
            queryType: 'general',
            title: 'Connection Notice',
            executiveSummary: 'Unable to reach the AI server. Please check your network connection or configure an API key in settings.',
            markdownSynthesis: 'Piedmont Copilot encountered a network error while connecting to the AI synthesis service.',
            quantitativeMetrics: [],
            actionableTakeaway: 'Retry your query or paste a Google Gemini API key into Copilot Settings.',
            risksAndMonitors: ['Check internet connectivity', 'Verify API key validity in settings'],
            followUpSuggestions: SAMPLE_QUESTIONS,
            sourceModel: 'Deterministic Institutional Engine (Tier 1)'
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 transition-all">
      <div className="w-full max-w-4xl h-[88vh] bg-[#121212] border border-[#2a2a2a] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-white font-sans">
        
        {/* Terminal Header */}
        <div className="px-5 py-4 bg-[#161616] border-b border-[#262626] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#479ffa]/15 border border-[#479ffa]/30 flex items-center justify-center text-[#479ffa]">
              <Bot size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-tight">Piedmont Copilot</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white/5 text-[#868f97] border border-white/10">
                  {customKey ? `${provider.toUpperCase()} ACTIVE` : 'INTELLIGENCE ENGINE'}
                </span>
              </div>
              <p className="text-xs text-[#868f97] mt-0.5">Indian Equities, Monetary Policy & Macro Transmission</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/copilot"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all hidden sm:flex items-center gap-1"
            >
              <span>Full Studio</span>
              <ExternalLink size={12} />
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="API Key Configuration"
            >
              <Sliders size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Settings Drawer */}
        {showSettings && (
          <div className="p-4 bg-[#181818] border-b border-[#262626] text-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">
                  Connect Generative AI Key (Google Gemini / Groq)
                </span>
                <span className="text-xs text-[#868f97]">
                  Paste a free API key to unlock natural language synthesis for custom questions.
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Get Free Gemini Key &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#868f97] mb-1 text-[11px] uppercase tracking-wider font-mono">Provider</label>
                <select
                  value={provider}
                  onChange={(e: any) => setProvider(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3 py-2 text-white outline-none focus:border-[#479ffa] text-xs"
                >
                  <option value="gemini">Google Gemini 2.5 Flash (Free Tier)</option>
                  <option value="groq">Groq Cloud Llama 3.3 (Free Tier)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#868f97] mb-1 text-[11px] uppercase tracking-wider font-mono">API Key</label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="Paste Key (e.g. AIzaSy...)"
                  className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3 py-2 text-white outline-none focus:border-[#479ffa] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-[11px] text-[#868f97]">
                Key stored in your browser's localStorage. Never logged to external servers.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCustomKey('');
                    localStorage.removeItem('piedmont_byok_key');
                    setShowSettings(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all"
                >
                  Clear Key
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#e0e0e0] transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat History & Clean Canvas */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* Inviting Welcome Empty State (Replaces the old chunky math equation!) */
            <div className="h-full flex flex-col justify-center items-center text-center max-w-xl mx-auto py-8 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#479ffa]">
                <Sparkles size={24} />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                  How can Piedmont assist your research?
                </h2>
                <p className="text-xs sm:text-sm text-[#868f97] leading-relaxed">
                  Ask quantitative questions on Indian equities, monetary transmission channels, commodity sensitivities, or corporate accounting.
                </p>
              </div>

              {/* Clean Clickable Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
                {SAMPLE_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(q)}
                    className="p-3.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#479ffa]/40 transition-all text-xs text-white/80 hover:text-white group flex flex-col justify-between space-y-2"
                  >
                    <span className="leading-snug">{q}</span>
                    <span className="text-[10px] text-[#868f97] group-hover:text-[#479ffa] flex items-center gap-1 font-mono">
                      <span>Inquire</span>
                      <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* User Message Bubble */}
                {msg.sender === 'user' && (
                  <div className="max-w-[85%] bg-white/10 border border-white/15 text-white px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-sm leading-relaxed">
                    {msg.text}
                    <div className="text-[10px] font-mono text-[#868f97] mt-1.5 text-right">{msg.timestamp}</div>
                  </div>
                )}

                {/* Copilot Response Card */}
                {msg.sender === 'copilot' && msg.data && (
                  <div className="w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-white shadow-lg">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-bold text-white text-sm tracking-tight truncate">
                          {msg.data.title || 'Research Analysis'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, `${msg.data?.title}\n\n${msg.data?.executiveSummary}\n\n${msg.data?.markdownSynthesis}`)}
                          className="text-xs text-[#868f97] hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <span className="font-mono text-[10px] text-white/40">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="bg-[#121212] p-4 rounded-xl border border-white/5 text-white/90 leading-relaxed text-xs sm:text-sm">
                      {msg.data.executiveSummary}
                    </div>

                    {/* Quantitative Metrics (if available) */}
                    {msg.data.quantitativeMetrics && msg.data.quantitativeMetrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {msg.data.quantitativeMetrics.map((metric, idx) => (
                          <div key={idx} className="bg-[#121212] p-3 rounded-xl border border-white/5">
                            <div className="text-[10px] text-[#868f97] uppercase tracking-wider font-mono">{metric.label}</div>
                            <div className={`font-mono text-sm font-bold mt-1 ${
                              metric.stance === 'positive' ? 'text-emerald-400' :
                              metric.stance === 'negative' ? 'text-rose-400' :
                              'text-white'
                            }`}>
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Markdown Body */}
                    {msg.data.markdownSynthesis && (
                      <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-white/85 space-y-2 whitespace-pre-wrap">
                        {msg.data.markdownSynthesis}
                      </div>
                    )}

                    {/* Actionable Takeaway */}
                    {msg.data.actionableTakeaway && (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-200 leading-normal flex items-start gap-2">
                        <Info size={15} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider text-[10px] block text-amber-400 mb-0.5">Takeaway</span>
                          {msg.data.actionableTakeaway}
                        </div>
                      </div>
                    )}

                    {/* Follow-up suggestions */}
                    {msg.data.followUpSuggestions && msg.data.followUpSuggestions.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {msg.data.followUpSuggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSubmit(s)}
                            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <span>{s}</span>
                            <ArrowRight size={11} className="text-white/40" />
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#479ffa] animate-pulse" />
              <span className="text-xs text-[#868f97]">
                Piedmont engine is synthesizing financial data...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#161616] border-t border-[#262626] space-y-3 shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask about any equity, cross-asset transmission, or macro indicator..."
              className="flex-1 bg-[#121212] border border-[#333333] focus:border-[#479ffa] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 outline-none transition-all"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#e0e0e0] disabled:opacity-30 text-black font-semibold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] font-mono text-[#868f97] uppercase shrink-0">Suggestions:</span>
            {SAMPLE_QUESTIONS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(p)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-[#868f97] hover:text-white shrink-0 transition-all"
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
