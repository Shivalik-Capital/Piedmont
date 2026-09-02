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
  },

  "rbi-repo-rate": {
    title: 'RBI Repo Rate',
    tldr: 'The rate at which the Reserve Bank of India lends money to commercial banks in the event of any shortfall of funds.',
    why: 'It is a primary tool for the RBI to control inflation and regulate liquidity in the economy. Changes in the repo rate affect all other interest rates, including your loan EMIs and fixed deposit rates.',
    example: 'If inflation is high, the RBI increases the repo rate, making borrowing more expensive for banks and, consequently, for consumers, which slows down spending.',
    lookFor: 'A rate cut typically boosts the stock market as borrowing becomes cheaper for companies, while a rate hike can cool the market.'
  },
  "reverse-repo": {
    title: 'Reverse Repo Rate',
    tldr: 'The rate at which the Reserve Bank of India borrows money from commercial banks.',
    why: 'It is used to absorb liquidity from the market. When the RBI wants to reduce money supply, it increases the reverse repo rate, incentivizing banks to park their funds with the RBI instead of lending.',
    example: 'A high reverse repo rate encourages banks to earn risk-free interest from the RBI rather than lending to businesses, reducing overall market liquidity.',
    lookFor: 'The spread between the repo and reverse repo rate indicates the RBIs stance on liquidity management.'
  },
  "standing-deposit-facility": {
    title: 'Standing Deposit Facility (SDF)',
    tldr: 'A liquidity window through which the RBI absorbs excess liquidity from banks without providing government securities as collateral.',
    why: 'It strengthens the RBIs monetary policy framework by allowing it to mop up excess funds even if it runs out of government bonds to offer as collateral.',
    example: 'Introduced in 2022, the SDF replaced the fixed-rate reverse repo as the floor of the liquidity adjustment facility (LAF) corridor.',
    lookFor: 'The SDF rate is usually set slightly below the repo rate, serving as the baseline for overnight interest rates in the banking system.'
  },
  "gdp-growth": {
    title: 'GDP Growth',
    tldr: 'The rate at which a countrys Gross Domestic Product (the total value of all goods and services produced) increases over time.',
    why: 'It is the broadest indicator of a countrys economic health and performance.',
    example: 'If India’s GDP is $3 Trillion and grows by 7%, the economy added $210 Billion in value over the year.',
    lookFor: 'Consistent, robust growth (like 6-8% for an emerging market). Sharp drops indicate recession, which negatively impacts corporate earnings and stock prices.'
  },
  "cpi-inflation": {
    title: 'CPI Inflation (Consumer Price Index)',
    tldr: 'Measures the average change over time in the prices paid by urban and rural consumers for a market basket of consumer goods and services.',
    why: 'It is the most widely watched measure of retail inflation. The RBI targets CPI inflation (currently 4% with a +/- 2% band) when setting interest rates.',
    example: 'If CPI inflation is 5%, a basket of groceries that cost ₹1,000 last year now costs ₹1,050.',
    lookFor: 'When CPI breaches the RBI tolerance band (>6%), expect interest rate hikes which can dampen stock market performance.'
  },
  "wpi-inflation": {
    title: 'WPI Inflation (Wholesale Price Index)',
    tldr: 'Measures the changes in the prices of goods sold and traded in bulk by wholesale businesses to other businesses.',
    why: 'It acts as a leading indicator for retail inflation. If raw material and wholesale prices surge, companies eventually pass those costs to consumers (CPI).',
    example: 'A spike in global crude oil or steel prices will immediately reflect in WPI before hitting CPI.',
    lookFor: 'A widening gap between WPI and CPI. If WPI is much higher than CPI, companies are absorbing costs, which crushes their profit margins.'
  },
  "manufacturing-pmi": {
    title: 'Manufacturing PMI (Purchasing Managers Index)',
    tldr: 'An indicator of the economic health of the manufacturing sector, based on surveys of purchasing managers.',
    why: 'A PMI reading above 50 represents expansion, while under 50 represents contraction. It is a highly sensitive leading economic indicator.',
    example: 'A PMI jumping from 51 to 54 indicates new orders, production, and employment in factories are accelerating.',
    lookFor: 'Sustained prints above 50. A sharp drop below 50 signals an impending industrial slowdown.'
  },
  "iip-growth": {
    title: 'IIP Growth (Index of Industrial Production)',
    tldr: 'Measures the growth rate in different industry groups of the economy over a specific time period.',
    why: 'Unlike PMI which is survey-based (sentiment), IIP measures actual physical production volume in mining, manufacturing, and electricity.',
    example: 'A high IIP growth indicates factories are churning out more cars, appliances, and cement, pointing to strong economic demand.',
    lookFor: 'The manufacturing component, which holds the highest weight (~77%). Weak IIP often precedes poor corporate earnings for industrial stocks.'
  },
  "fiscal-deficit": {
    title: 'Fiscal Deficit',
    tldr: 'The shortfall in a governments income compared with its spending.',
    why: 'A high deficit means the government is borrowing heavily to fund its operations, which can crowd out private borrowing and stoke inflation.',
    example: 'If the Indian government earns ₹20 Lakh Crore in taxes but spends ₹25 Lakh Crore, the fiscal deficit is ₹5 Lakh Crore.',
    lookFor: 'The deficit as a percentage of GDP. The government aims to bring it down steadily (fiscal consolidation) to maintain sovereign credit ratings.'
  },
  "forex-reserves": {
    title: 'Forex Reserves',
    tldr: 'Foreign currency assets held by the central bank (RBI), including foreign currencies, bonds, treasury bills, and gold.',
    why: 'They act as a shock absorber against economic crises, ensuring the country can pay for its imports and defend the Rupee against extreme volatility.',
    example: 'If global oil prices spike, India uses its forex reserves to pay for the expensive oil without collapsing the Rupee.',
    lookFor: 'Reserves measured in "months of import cover". Higher reserves provide immense macroeconomic stability.'
  },
  "fii-flows-cash": {
    title: 'FII Flows (Foreign Institutional Investors)',
    tldr: 'The net amount of money foreign funds, banks, and institutions are investing into or pulling out of the Indian stock market.',
    why: 'FIIs control massive amounts of capital. Their buying or selling can single-handedly dictate the short-term direction of the overall market.',
    example: 'If FIIs buy ₹10,000 Cr of Indian stocks in a month, the Nifty is highly likely to trend upwards.',
    lookFor: 'Continuous months of heavy FII selling, which usually indicates global risk aversion or better yields in the US market.'
  },
  "dii-flows-cash": {
    title: 'DII Flows (Domestic Institutional Investors)',
    tldr: 'The net amount of money domestic mutual funds, insurance companies, and pension funds are investing in the Indian market.',
    why: 'DIIs act as a massive counterbalance to FIIs. They are largely fueled by retail investors SIPs (Systematic Investment Plans).',
    example: 'Even if foreign investors sell heavily, strong DII buying (fueled by retail SIPs) can prevent the market from crashing.',
    lookFor: 'Consistent DII inflows indicate strong domestic confidence and structural support for the stock market.'
  },
  "current-account": {
    title: 'Current Account Balance',
    tldr: 'A record of a countrys transactions with the rest of the world, specifically net trade in goods and services, net earnings on cross-border investments, and net transfer payments.',
    why: 'A deficit means the country imports more than it exports, requiring foreign capital to bridge the gap. A surplus means it is a net lender to the world.',
    example: 'India typically runs a current account deficit (CAD) because it imports massive amounts of crude oil.',
    lookFor: 'CAD as a percentage of GDP. If it crosses 2.5 - 3.0%, it puts severe depreciation pressure on the Rupee.'
  },
  "govt-borrowing": {
    title: 'Government Borrowing',
    tldr: 'The amount of money the government borrows from the market (by issuing bonds/G-Secs) to fund its fiscal deficit.',
    why: 'High government borrowing increases the supply of bonds, pushing yields up. This increases interest rates across the entire economy.',
    example: 'If the government announces a massive borrowing calendar, bond yields spike, causing banks to raise loan rates for consumers.',
    lookFor: 'The gross and net borrowing figures in the Union Budget. Lower-than-expected borrowing is highly bullish for bond markets and stocks.'
  },
  "next-rbi-mpc": {
    title: 'Next RBI MPC Meeting',
    tldr: 'The upcoming meeting of the Monetary Policy Committee (MPC) of the Reserve Bank of India.',
    why: 'The MPC meets every two months to set the benchmark interest rates (repo rate) and define the monetary policy stance.',
    example: 'The market will wait anxiously for the MPCs decision. A surprise rate cut causes a massive rally, while a surprise hike causes a selloff.',
    lookFor: 'The "stance" of the committee (e.g., "Withdrawal of accommodation" vs "Neutral"). The stance often signals what they plan to do in future meetings.'
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
