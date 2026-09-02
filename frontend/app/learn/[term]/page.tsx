'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

const dictionary: Record<string, { title: string; tldr: string; why: string; example: string; lookFor: string }> = {
  pe: {
    title: 'Price-to-Earnings (P/E) Ratio',
    tldr: 'Measures how much you pay for $1 of the company\'s earnings.',
    why: 'It helps determine if a stock is overvalued or undervalued compared to its peers or its own historical average. A high P/E might mean the stock is expensive, or that investors expect high growth.',
    example: 'If Company A trades at $50 per share and earns $5 per share, its P/E is 10. You are paying $10 for every $1 of earnings.',
    lookFor: 'Compare the P/E to the industry average. A lower P/E than peers might indicate a value opportunity, but beware of "value traps" where the company is cheap for a good reason.'
  },
  pb: {
    title: 'Price-to-Book (P/B) Ratio',
    tldr: 'Compares a company\'s market value to its book value (assets minus liabilities).',
    why: 'Useful for finding undervalued companies, especially in asset-heavy industries like banking or manufacturing. It shows what you are paying for the net assets of the business.',
    example: 'If a bank has a market cap of $1B and a book value of $1.2B, its P/B is 0.83, meaning it\'s trading for less than its liquidation value.',
    lookFor: 'A P/B under 1 can indicate undervaluation, but it might also signal fundamental problems. P/B is less useful for tech companies with mostly intangible assets (like IP or software).'
  },
  eps: {
    title: 'Earnings Per Share (EPS)',
    tldr: 'The portion of a company\'s profit allocated to each outstanding share of common stock.',
    why: 'It\'s a direct indicator of a company\'s profitability. Rising EPS over time usually drives the stock price higher.',
    example: 'If a company has $100M in net income and 50M shares outstanding, the EPS is $2.00.',
    lookFor: 'Consistent EPS growth year-over-year. Watch out for one-time events that inflate earnings artificially or share buybacks that boost EPS without underlying business growth.'
  },
  dividendYield: {
    title: 'Dividend Yield',
    tldr: 'The percentage of the stock price paid out as dividends over a year.',
    why: 'It represents the return an investor gets purely from cash payouts, ignoring price appreciation. Critical for income investors.',
    example: 'A $100 stock paying $4 annually in dividends has a 4% yield.',
    lookFor: 'Sustainable yields. A very high yield (e.g., >8%) might be a warning sign that the dividend is about to be cut because the stock price has plummeted.'
  },
  roe: {
    title: 'Return on Equity (ROE)',
    tldr: 'Measures how efficiently a company generates profits using shareholders\' equity.',
    why: 'A high ROE indicates that management is effectively using investment dollars to grow the business.',
    example: 'If a company has $10M in net income and $50M in shareholder equity, its ROE is 20%.',
    lookFor: 'Consistently high ROE (15%+) compared to peers. However, a very high ROE might just mean the company has taken on massive amounts of debt (which reduces equity).'
  },
  debtToEquity: {
    title: 'Debt-to-Equity (D/E) Ratio',
    tldr: 'Compares a company\'s total debt to its shareholder equity.',
    why: 'It evaluates a company\'s financial leverage and risk. High debt can boost returns in good times but risks bankruptcy in bad times.',
    example: 'If a company has $200M in debt and $100M in equity, its D/E ratio is 2.0.',
    lookFor: 'A D/E under 1 is generally considered safe, though capital-intensive industries (like utilities) naturally operate with higher ratios. Compare against competitors.'
  },
  revenue: {
    title: 'Revenue (Sales)',
    tldr: 'The total amount of money brought in by a company\'s operations, before any expenses are deducted.',
    why: 'It is the "top line." Without revenue growth, long-term profit growth is nearly impossible.',
    example: 'A software company sells 1 million subscriptions at $10 each, generating $10M in revenue.',
    lookFor: 'Steady, organic revenue growth. Look closely at whether growth is driven by price increases or volume increases.'
  },
  netProfit: {
    title: 'Net Profit',
    tldr: 'The amount of money left over after all expenses, taxes, and interest have been paid.',
    why: 'It is the "bottom line" and the ultimate measure of a company\'s financial success in a given period.',
    example: 'After starting with $10M in revenue and subtracting $8M in various costs and taxes, the net profit is $2M.',
    lookFor: 'Expanding net profit margins (net profit divided by revenue). This shows the company is becoming more efficient as it scales.'
  }
};

export default function LearnPage() {
  const params = useParams();
  const term = params.term as string;
  const content = dictionary[term];

  if (!content) {
    return (
      <div className="min-h-screen bg-[#111110] text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-[#D4AF37] mb-4">Term Not Found</h1>
          <Link href="/screener" className="text-white hover:text-[#D4AF37] underline">Return to Screener</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111110] text-white p-8">
      <div className="max-w-3xl mx-auto mt-12">
        <Link href="/screener" className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Screener
        </Link>
        
        <article className="bg-[#1A1917] p-8 md:p-12 rounded-2xl border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen size={120} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-6 relative z-10">{content.title}</h1>
          
          <div className="prose prose-invert prose-lg max-w-none relative z-10">
            <p className="text-xl text-white/90 font-medium leading-relaxed border-l-4 border-[#D4AF37] pl-6 py-2 bg-white/5 rounded-r-lg mb-8">
              {content.tldr}
            </p>
            
            <h3 className="text-2xl text-[#D4AF37] font-semibold mt-10 mb-4">Why it matters</h3>
            <p className="text-white/80 leading-relaxed">{content.why}</p>
            
            <h3 className="text-2xl text-[#D4AF37] font-semibold mt-10 mb-4">Example</h3>
            <div className="bg-black/30 p-6 rounded-xl font-mono text-sm text-white/90 border border-white/5">
              {content.example}
            </div>
            
            <h3 className="text-2xl text-[#D4AF37] font-semibold mt-10 mb-4">What to look for</h3>
            <p className="text-white/80 leading-relaxed">{content.lookFor}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
