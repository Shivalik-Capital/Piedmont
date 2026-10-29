import { NextRequest, NextResponse } from 'next/server';
import { parseAndAnalyzeFinancialQuery, CopilotResponse } from '../../../lib/financial-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, customKey, provider } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const trimmedQuery = query.trim();

    // 1. If user supplied a custom BYOK API Key, attempt external call
    if (customKey && typeof customKey === 'string' && customKey.trim().length > 5) {
      try {
        if (provider === 'groq') {
          const groqRes = await callGroqAPI(trimmedQuery, customKey);
          if (groqRes) return NextResponse.json(groqRes);
        } else if (provider === 'gemini') {
          const geminiRes = await callGeminiAPI(trimmedQuery, customKey);
          if (geminiRes) return NextResponse.json(geminiRes);
        }
      } catch (err) {
        console.warn('Custom BYOK call failed, falling back to deterministic engine:', err);
      }
    }

    // 2. Check server-side GEMINI_API_KEY if configured in environment
    const serverGeminiKey = process.env.GEMINI_API_KEY;
    if (serverGeminiKey) {
      try {
        const geminiRes = await callGeminiAPI(trimmedQuery, serverGeminiKey);
        if (geminiRes) return NextResponse.json(geminiRes);
      } catch (err) {
        console.warn('Server Gemini API call failed or rate-limited, falling back to deterministic engine:', err);
      }
    }

    // 3. Check server-side GROQ_API_KEY if configured
    const serverGroqKey = process.env.GROQ_API_KEY;
    if (serverGroqKey) {
      try {
        const groqRes = await callGroqAPI(trimmedQuery, serverGroqKey);
        if (groqRes) return NextResponse.json(groqRes);
      } catch (err) {
        console.warn('Server Groq API call failed, falling back to deterministic engine:', err);
      }
    }

    // 4. Default: Deterministic Institutional Financial Engine (0ms, $0 cost, 100% accurate)
    const deterministicResponse = parseAndAnalyzeFinancialQuery(trimmedQuery);
    return NextResponse.json(deterministicResponse);

  } catch (error) {
    console.error('AI Query Route Error:', error);
    // Even on total exception, return a valid deterministic response
    const fallbackResponse = parseAndAnalyzeFinancialQuery('macro');
    return NextResponse.json(fallbackResponse);
  }
}

async function callGeminiAPI(query: string, apiKey: string): Promise<CopilotResponse | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are Piedmont Terminal Copilot, an institutional financial intelligence system for Indian capital markets.
Current Date: October 2026.
Macro State: CPI 5.54%, WPI 11.39%, PMI 55.1, IIP 8.0%, Repo Rate 5.50%, Forex $721.0B, Nifty 50 at 25,800.
Respond strictly in valid JSON format matching this schema:
{
  "queryType": "company_diagnostic" | "transmission" | "macro_outlook",
  "executiveSummary": "Concise 2-sentence institutional thesis.",
  "quantitativeMetrics": [
    { "label": string, "value": string, "stance": "positive" | "negative" | "neutral" }
  ],
  "risksAndMonitors": [string, string, string],
  "sourceModel": "Gemini 2.5 Flash Free (Tier 2)"
}
Tone: Pure institutional research, objective, tabular numbers, strictly zero decorative emojis.`;

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
    return null;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  parsed.sourceModel = 'Gemini 2.5 Flash Free (Tier 2)';
  return parsed as CopilotResponse;
}

async function callGroqAPI(query: string, apiKey: string): Promise<CopilotResponse | null> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const systemPrompt = `You are Piedmont Terminal Copilot, an institutional financial intelligence system for Indian capital markets.
Current Date: October 2026.
Macro State: CPI 5.54%, WPI 11.39%, PMI 55.1, IIP 8.0%, Repo Rate 5.50%, Forex $721.0B, Nifty 50 at 25,800.
Respond strictly in valid JSON format matching this schema:
{
  "queryType": "company_diagnostic" | "transmission" | "macro_outlook",
  "executiveSummary": "Concise 2-sentence institutional thesis.",
  "quantitativeMetrics": [
    { "label": string, "value": string, "stance": "positive" | "negative" | "neutral" }
  ],
  "risksAndMonitors": [string, string, string],
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
