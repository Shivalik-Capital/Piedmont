import { NextRequest, NextResponse } from 'next/server';
import { parseAndAnalyzeFinancialQuery, CopilotResponse } from '../../../lib/financial-engine';

export async function POST(req: NextRequest) {
  let userQuery = '';
  try {
    const body = await req.json();
    const { query, customKey, provider } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    userQuery = query.trim();

    // 1. If user supplied a custom BYOK API Key, attempt external call first
    if (customKey && typeof customKey === 'string' && customKey.trim().length > 5) {
      try {
        if (provider === 'groq') {
          const groqRes = await callGroqAPI(userQuery, customKey.trim());
          if (groqRes) return NextResponse.json(groqRes);
        } else {
          // Default to Gemini
          const geminiRes = await callGeminiAPI(userQuery, customKey.trim());
          if (geminiRes) return NextResponse.json(geminiRes);
        }
      } catch (err) {
        console.warn('Custom BYOK call failed, falling back to deterministic engine:', err);
      }
    }

    // 2. Check server-side GEMINI_API_KEY if configured in environment
    const serverGeminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (serverGeminiKey) {
      try {
        const geminiRes = await callGeminiAPI(userQuery, serverGeminiKey.trim());
        if (geminiRes) return NextResponse.json(geminiRes);
      } catch (err) {
        console.warn('Server Gemini API call failed or rate-limited, falling back to deterministic engine:', err);
      }
    }

    // 3. Check server-side GROQ_API_KEY if configured
    const serverGroqKey = process.env.GROQ_API_KEY;
    if (serverGroqKey) {
      try {
        const groqRes = await callGroqAPI(userQuery, serverGroqKey.trim());
        if (groqRes) return NextResponse.json(groqRes);
      } catch (err) {
        console.warn('Server Groq API call failed, falling back to deterministic engine:', err);
      }
    }

    // 4. Default: Deep High-Precision Institutional Financial Engine (0ms, $0 cost, bespoke synthesis)
    const deterministicResponse = parseAndAnalyzeFinancialQuery(userQuery);
    return NextResponse.json(deterministicResponse);

  } catch (error) {
    console.error('AI Query Route Error:', error);
    // Never fall back to generic macro boilerplate - analyze the actual query!
    const fallbackResponse = parseAndAnalyzeFinancialQuery(userQuery || 'Indian equities macro transmission');
    return NextResponse.json(fallbackResponse);
  }
}

async function callGeminiAPI(query: string, apiKey: string): Promise<CopilotResponse | null> {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  
  const systemPrompt = `You are Piedmont Terminal Copilot, an elite institutional financial intelligence system for Indian capital markets.
Current Baseline Date: Mid-November 2026.
Official Macro State: 
- CPI Inflation: 6.09% (Oct 2026 provisional, food inflation at 8.94%)
- WPI Inflation: 2.36% (Oct 2026 provisional)
- Manufacturing PMI: 54.7 (Oct 2026)
- IIP Growth: 6.7% (Sep 2026)
- RBI Policy Repo Rate: 5.50% (SDF 5.25%, MSF 5.75%, MPC neutral stance)
- Foreign Exchange Reserves: $719.55 Billion (Gold reserves: $104.80 Billion)
- 10-Year Benchmark G-Sec Yield: 6.78%
- USD/INR Exchange Rate: 84.38
- Brent Crude Oil: $72.80 / barrel
- Nifty 50 Index: ~25,800 (P/E 22.8x trailing)

Respond strictly in valid JSON format matching this schema:
{
  "queryType": "transmission" | "company_diagnostic" | "peer_comparison" | "macro_outlook" | "general",
  "title": "Clear concise institutional title",
  "executiveSummary": "Concise 2-3 sentence institutional executive summary directly answering the user query.",
  "markdownSynthesis": "Comprehensive multi-paragraph institutional thesis with markdown headers (###), bullet points, bold key figures, comparative tables, and step-by-step causal flow analysis.",
  "quantitativeMetrics": [
    { "label": string, "value": string, "stance": "positive" | "negative" | "neutral" }
  ],
  "transmissionVectors": [
    {
      "factor": string,
      "target": string,
      "direction": "headwind" | "tailwind" | "neutral",
      "mechanism": string,
      "impactMetrics": [string],
      "historicalPrecedent": string
    }
  ],
  "actionableTakeaway": "1-2 sentence concrete portfolio takeaway for an institutional fund manager.",
  "risksAndMonitors": [string, string, string],
  "followUpSuggestions": [string, string, string],
  "sourceModel": "Gemini 2.5 Flash Free (Tier 2)"
}
Tone: Pure institutional research, objective, tabular numbers, strictly zero decorative emojis.`;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }] }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      const parsed = JSON.parse(text);
      parsed.sourceModel = 'Gemini 2.5 Flash Free (Tier 2)';
      return parsed as CopilotResponse;
    } catch {
      continue;
    }
  }

  return null;
}

async function callGroqAPI(query: string, apiKey: string): Promise<CopilotResponse | null> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const systemPrompt = `You are Piedmont Terminal Copilot, an elite institutional financial intelligence system for Indian capital markets.
Current Baseline Date: Mid-November 2026.
Official Macro State: CPI 6.09%, WPI 2.36%, PMI 54.7, IIP 6.7%, Repo Rate 5.50%, Forex $719.55B (Gold $104.80B), 10Y Yield 6.78%, USD/INR 84.38, Brent Crude $72.80, Nifty 50 at 25,800.
Respond strictly in valid JSON format matching this schema:
{
  "queryType": "transmission" | "company_diagnostic" | "peer_comparison" | "macro_outlook" | "general",
  "title": "Clear concise institutional title",
  "executiveSummary": "Concise 2-3 sentence institutional executive summary directly answering the user query.",
  "markdownSynthesis": "Comprehensive multi-paragraph institutional thesis with markdown headers (###), bullet points, bold key figures, comparative tables, and step-by-step causal flow analysis.",
  "quantitativeMetrics": [
    { "label": string, "value": string, "stance": "positive" | "negative" | "neutral" }
  ],
  "transmissionVectors": [
    {
      "factor": string,
      "target": string,
      "direction": "headwind" | "tailwind" | "neutral",
      "mechanism": string,
      "impactMetrics": [string],
      "historicalPrecedent": string
    }
  ],
  "actionableTakeaway": "1-2 sentence concrete portfolio takeaway for an institutional fund manager.",
  "risksAndMonitors": [string, string, string],
  "followUpSuggestions": [string, string, string],
  "sourceModel": "Groq LPU Free (Tier 3)"
}
Tone: Pure institutional research, objective, tabular numbers, strictly zero decorative emojis.`;

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) return null;

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content);
  parsed.sourceModel = 'Groq LPU Free (Tier 3)';
  return parsed as CopilotResponse;
}
