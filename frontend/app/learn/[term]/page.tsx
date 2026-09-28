'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Landmark, Banknote, PiggyBank, Scale, Coins, Receipt, Wallet, Building2, Factory, ShieldCheck, Info, Lightbulb, Target, Zap } from 'lucide-react';
import { Suspense } from 'react';

// ─── Company context map ─────────────────────────────────────────────
const COMPANIES: Record<string, { name: string; sector: string; desc: string }> = {
  RELIANCE: { name: 'Reliance Industries', sector: 'Oil & Gas / Conglomerate', desc: 'India\'s largest company by market cap — spanning oil refining, Jio telecom, and Reliance Retail. Think of it as India\'s answer to a mini Berkshire Hathaway.' },
  TCS: { name: 'Tata Consultancy Services', sector: 'IT Services', desc: 'The crown jewel of the Tata Group and India\'s largest IT services exporter. TCS makes money by providing technology consulting, software development, and outsourcing services to global corporations.' },
  HDFCBANK: { name: 'HDFC Bank', sector: 'Private Banking', desc: 'India\'s most valuable private sector bank. It earns money primarily through the spread between the interest it charges on loans and the interest it pays on deposits.' },
  INFY: { name: 'Infosys', sector: 'IT Services', desc: 'India\'s second-largest IT company, founded by Narayana Murthy. Like TCS, it earns revenue from global tech consulting and digital transformation projects.' },
  ICICIBANK: { name: 'ICICI Bank', sector: 'Private Banking', desc: 'One of India\'s Big 3 private banks with a massive retail banking franchise — home loans, credit cards, and wealth management.' },
  HINDUNILVR: { name: 'Hindustan Unilever', sector: 'FMCG', desc: 'The Indian subsidiary of Unilever. It sells everyday products you already use — Surf Excel, Dove, Lifebuoy, Lux, Knorr, Bru coffee. It reaches nearly every Indian household.' },
  BHARTIARTL: { name: 'Bharti Airtel', sector: 'Telecom', desc: 'India\'s second-largest telecom operator, competing head-to-head with Jio. Airtel generates revenue from mobile subscriptions, broadband, and enterprise services.' },
  ITC: { name: 'ITC', sector: 'Conglomerate / FMCG', desc: 'Originally a cigarettes company, ITC has diversified into hotels (ITC Hotels), FMCG (Aashirvaad, Bingo, Sunfeast), paperboards, and agri-business.' },
  KOTAKBANK: { name: 'Kotak Mahindra Bank', sector: 'Private Banking', desc: 'A premium private bank known for conservative lending practices and wealth management, founded by billionaire Uday Kotak.' },
  LT: { name: 'Larsen & Toubro', sector: 'Infrastructure / Engineering', desc: 'India\'s largest engineering and construction conglomerate. L&T builds everything — from metro rails and power plants to defense systems and smart cities.' },
  SBIN: { name: 'State Bank of India', sector: 'Public Banking', desc: 'India\'s largest bank by assets, with over 22,000 branches. As a government-owned bank, SBI plays a critical role in national financial policy.' },
  AXISBANK: { name: 'Axis Bank', sector: 'Private Banking', desc: 'India\'s third-largest private bank, with a growing retail franchise and digital banking push.' },
  BAJFINANCE: { name: 'Bajaj Finance', sector: 'NBFC', desc: 'India\'s largest non-banking financial company (NBFC). It lends consumer loans, personal loans, and EMI financing for electronics and lifestyle products.' },
  MARUTI: { name: 'Maruti Suzuki', sector: 'Automobile', desc: 'India\'s largest car manufacturer by volume. Brands like Alto, Swift, Baleno, and Brezza dominate Indian roads. Nearly every other car sold in India is a Maruti.' },
  HCLTECH: { name: 'HCL Technologies', sector: 'IT Services', desc: 'India\'s third-largest IT company, strong in infrastructure management and engineering services.' },
  ASIANPAINT: { name: 'Asian Paints', sector: 'Paints / Consumer', desc: 'India\'s largest paint company with over 50% market share. Its moat is its massive distribution network reaching even the smallest villages.' },
  TITAN: { name: 'Titan Company', sector: 'Consumer Durables / Jewelry', desc: 'A Tata Group company that owns Tanishq (India\'s #1 jewelry brand), Titan watches, and Fastrack. Jewelry contributes ~85% of its revenue.' },
  SUNPHARMA: { name: 'Sun Pharmaceutical', sector: 'Pharma', desc: 'India\'s largest pharma company, specializing in generic drugs sold globally. It earns a significant portion of revenue from the US market.' },
  ULTRACEMCO: { name: 'UltraTech Cement', sector: 'Cement', desc: 'India\'s largest cement manufacturer (an Aditya Birla Group company). Cement demand is directly tied to India\'s infrastructure and housing boom.' },
  NTPC: { name: 'NTPC', sector: 'Power Generation', desc: 'India\'s largest power utility company, generating electricity from coal, gas, solar, and hydro plants across the country.' },
  WIPRO: { name: 'Wipro', sector: 'IT Services', desc: 'One of India\'s top 5 IT companies, providing technology consulting and business process services globally.' },
  TATAMOTORS: { name: 'Tata Motors', sector: 'Automobile', desc: 'Owner of Jaguar Land Rover (JLR) and India\'s fastest-growing EV maker with Nexon EV and Punch EV.' },
  TATASTEEL: { name: 'Tata Steel', sector: 'Metals & Mining', desc: 'One of the world\'s largest steel producers with operations in India, UK, and Europe. Steel is the backbone of infrastructure.' },
  COALINDIA: { name: 'Coal India', sector: 'Mining', desc: 'The world\'s largest coal mining company, a government enterprise. India still relies heavily on coal for 70%+ of its electricity.' },
  APOLLOHOSP: { name: 'Apollo Hospitals', sector: 'Healthcare', desc: 'India\'s largest private hospital chain with 70+ hospitals. Revenue comes from patient care, pharmacy retail, and health insurance.' },
  BRITANNIA: { name: 'Britannia Industries', sector: 'FMCG / Food', desc: 'India\'s largest biscuit company — Good Day, Marie Gold, Tiger, NutriChoice. It reaches 200 million+ Indian households.' },
  NESTLEIND: { name: 'Nestle India', sector: 'FMCG / Food', desc: 'The Indian arm of Swiss giant Nestlé. Maggi noodles, KitKat, Nescafé — brands deeply embedded in Indian daily life.' },
  ONGC: { name: 'ONGC', sector: 'Oil & Gas', desc: 'India\'s largest crude oil and natural gas exploration company, a government PSU responsible for domestic energy security.' },
  BPCL: { name: 'Bharat Petroleum', sector: 'Oil & Gas', desc: 'A government-owned oil refining and marketing company operating thousands of fuel stations across India.' },
  ADANIENT: { name: 'Adani Enterprises', sector: 'Diversified / Infra', desc: 'The flagship company of the Adani Group, with interests spanning airports, data centers, roads, green hydrogen, and mining.' },
};

// ─── Metric explanations ─────────────────────────────────────────────
// Each metric has: intro, analogy, deepDive, sections, goodBad, formula, indianContext, financialStatementLink
interface MetricContent {
  title: string;
  icon: any;
  intro: string;
  analogy: string;
  deepDive: string[];
  formula?: string;
  goodBad: { good: string; bad: string };
  indianContext: string;
  financialStatementLink: string;
  companySpecific: (name: string, sector: string, desc: string) => string[];
}

const METRICS: Record<string, MetricContent> = {
  pe: {
    title: 'Price-to-Earnings (P/E) Ratio',
    icon: BarChart3,
    intro: 'The P/E ratio is the single most popular valuation metric in investing. It tells you how many rupees investors are willing to pay today for every ₹1 of the company\'s annual profit. It is essentially the "price tag" on earnings.',
    analogy: 'Imagine you want to buy a chai stall. The owner tells you the stall makes ₹1 Lakh profit every year. If he asks for ₹10 Lakhs, you are paying 10× its annual earnings — that\'s a P/E of 10. If another stall making the same ₹1 Lakh profit asks for ₹30 Lakhs, that\'s a P/E of 30 — much more expensive. But maybe that second stall is in a better location with more foot traffic (growth potential), so investors are willing to pay more. That\'s exactly how the stock market works.',
    deepDive: [
      'The P/E ratio is calculated by dividing the current stock price by the Earnings Per Share (EPS). There are two types: "Trailing P/E" uses the last 12 months of actual earnings, while "Forward P/E" uses analysts\' projected earnings for the next 12 months.',
      'A high P/E (say 40-80) typically means the market expects massive future growth. Tech companies and fast-growing startups often have sky-high P/Es because investors are betting on future profits, not current ones. Think of it as paying a premium for a "first class ticket" — you\'re paying more because you expect a better experience ahead.',
      'A low P/E (say 5-12) might mean the stock is genuinely cheap (a bargain), OR it could be a "value trap" — the stock is cheap because the business is dying and earnings are about to collapse. This is the most important distinction a beginner must learn.',
      'The P/E ratio is meaningless in isolation. You MUST compare it to: (1) the company\'s own historical P/E, (2) its sector average P/E, and (3) the broader market P/E (Nifty 50 trades at roughly 20-22x earnings historically).',
      'When the RBI cuts interest rates, P/E ratios across the market tend to expand (go higher) because future earnings become more valuable when discounted at lower rates. When rates rise, P/E ratios compress.'
    ],
    formula: 'P/E Ratio = Current Share Price ÷ Earnings Per Share (EPS)',
    goodBad: {
      good: 'A P/E between 15-25 for large-cap Indian stocks is generally considered fair value. Below 15 could be undervalued. Consistent P/E with growing EPS = wealth creation.',
      bad: 'A P/E above 50-60 without corresponding revenue growth is a red flag. If the company\'s P/E is 2-3× its sector average with no clear reason, the stock is likely overheated.'
    },
    indianContext: 'In the Indian market, IT stocks (TCS, Infosys) typically trade at P/Es of 25-35 because of their consistent dollar-denominated earnings. PSU banks often trade at single-digit P/Es due to legacy NPA issues. FMCG stocks like HUL trade at 50-70x P/E because their earnings are incredibly stable and predictable.',
    financialStatementLink: 'The "E" in P/E comes directly from the Profit & Loss Statement. Specifically, it\'s the "Net Profit" (bottom line) divided by total shares outstanding. If you see the P&L and Net Profit is growing 20% year-over-year, the P/E will naturally come down over time even if the stock price stays flat — making the stock cheaper.',
    companySpecific: (name, sector, desc) => [
      `For ${name}, which operates in the ${sector} space, the P/E ratio takes on special significance. ${desc}`,
      `When analyzing ${name}'s P/E, compare it specifically against other ${sector} companies — not against the entire Nifty 50. A P/E that looks expensive compared to a bank might be perfectly normal for a ${sector} business.`,
      `Ask yourself: Is ${name}'s earnings growth rate higher than its P/E? If the company is growing earnings at 25% per year but trades at a P/E of 20, that's actually cheap (the PEG ratio would be 0.8, which is attractive). If it's growing at 8% but trades at a P/E of 40, that's expensive.`,
      `For ${name} specifically, watch the quarterly earnings announcements. If the company beats analyst estimates, the stock price jumps and the P/E temporarily spikes. If it misses estimates, the P/E drops. Long-term investors should focus on whether the underlying business is getting stronger, not just the number.`
    ]
  },

  pb: {
    title: 'Price-to-Book (P/B) Ratio',
    icon: Landmark,
    intro: 'The P/B ratio compares what the market says a company is worth (its share price × total shares) versus what the company\'s accounting books say it\'s worth (total assets minus total liabilities). It answers: "Am I paying more or less than what the company actually owns?"',
    analogy: 'Imagine you\'re buying an apartment. The registration document says the property is worth ₹50 Lakhs (that\'s the "book value"). But because the apartment is in a hot neighborhood with a metro coming, buyers are willing to pay ₹1.5 Crore. The P/B ratio here is 3.0 — you\'re paying 3× the official value because of location, convenience, and future appreciation. Now imagine a similar apartment in a flood-prone area — nobody wants to pay even ₹50 Lakhs. It might sell for ₹30 Lakhs, giving a P/B of 0.6. That\'s a "below book value" situation.',
    deepDive: [
      'Book value is calculated from the Balance Sheet: Total Assets minus Total Liabilities = Shareholders\' Equity (Book Value). Divide this by the total number of shares, and you get "Book Value Per Share."',
      'P/B is most useful for asset-heavy businesses like banks, insurance companies, real estate firms, and steel/cement companies. These companies literally own massive physical assets (buildings, machinery, inventory, loan portfolios) that show up on the balance sheet.',
      'P/B is LESS useful for technology and service companies because their most valuable assets — software code, brand reputation, talented employees, customer relationships — don\'t appear on the balance sheet. This is why TCS and Infosys have P/B ratios of 12-15x (their "real" value is in intangible brain power, not physical factories).',
      'A P/B below 1.0 means the market is valuing the company at LESS than its liquidation value. In theory, you could buy all the shares, sell off every asset, pay all debts, and still have money left over. This sounds like a dream, but in practice, it usually means investors believe the assets are overvalued on the books or the business is in deep trouble.',
      'For banks specifically, the P/B ratio is the gold standard metric (even more important than P/E). A well-run private bank like HDFC Bank trades at 3-4x book value, while a struggling PSU bank might trade at 0.5-0.8x book — the market doesn\'t trust the quality of its loan book.'
    ],
    formula: 'P/B Ratio = Market Price Per Share ÷ Book Value Per Share\nBook Value Per Share = (Total Assets − Total Liabilities) ÷ Total Shares',
    goodBad: {
      good: 'For banks: P/B of 1.5-3.0 with high ROE = well-managed bank. For industrials: P/B of 1.0-2.5 = fair. A consistently rising book value (meaning the Balance Sheet is getting stronger) is a healthy sign.',
      bad: 'P/B below 1.0 for a non-cyclical company = market has lost confidence. P/B above 8-10x without tech/brand justification = potentially overvalued.'
    },
    indianContext: 'Indian PSU banks like Bank of Baroda or PNB often trade below book value (P/B < 1) because the market fears hidden bad loans (NPAs) on their balance sheets. Private banks like HDFC Bank and Kotak trade at premium P/B ratios because their asset quality is superior.',
    financialStatementLink: 'The "B" (Book Value) comes entirely from the Balance Sheet. Look at "Total Shareholders\' Equity" — that\'s the book value. If a company\'s equity is growing steadily each year (through retained profits), the book value is rising, which is exactly what you want as a long-term investor.',
    companySpecific: (name, sector, desc) => [
      `For ${name} in ${sector}, the P/B ratio tells you whether the market values ${name}'s assets at a premium or discount. ${desc}`,
      `${sector.includes('Bank') || sector.includes('Financial') ? `Since ${name} is in financial services, P/B is arguably THE most important metric. A bank's book value represents its loan portfolio, investments, and reserves. If ${name}'s P/B is high, it means investors trust the quality of its loan book and expect strong future returns.` : `Since ${name} is in ${sector}, P/B gives you a reality check on whether the stock price has run too far ahead of the actual assets the business owns.`}`,
      `Compare ${name}'s P/B to its own 5-year average. If it's trading significantly above its historical average, the stock might be expensive even if the business is doing well. If it's significantly below, there might be an opportunity — or a reason for concern.`
    ]
  },

  eps: {
    title: 'Earnings Per Share (EPS)',
    icon: Coins,
    intro: 'EPS is the most fundamental metric in all of stock investing. It answers the simplest question: "How much profit does this company make for each share I own?" If you own 100 shares of a company with an EPS of ₹50, your slice of the company\'s annual profit is ₹5,000.',
    analogy: 'Imagine you and 3 friends start a business together with equal ownership (25% each). At the end of the year, the business makes ₹4 Lakhs in profit. Your "earnings per share" is ₹1 Lakh — that\'s your cut. Now imagine the business grows and makes ₹8 Lakhs next year. Your EPS doubles to ₹2 Lakhs. You\'d feel great, right? That\'s EPS growth, and it\'s the engine that drives stock prices higher over time.',
    deepDive: [
      'EPS is calculated by taking the company\'s total Net Profit and dividing it by the total number of shares outstanding. There are two variants: "Basic EPS" (simple division) and "Diluted EPS" (accounts for stock options and convertible bonds that could create new shares in the future). Always use Diluted EPS for a more conservative picture.',
      'EPS growth is the single most powerful predictor of long-term stock price appreciation. Studies have shown that over 10+ year periods, a stock\'s price growth closely mirrors its EPS growth. If EPS grows at 15% per year, the stock price will roughly grow at 15% per year too.',
      'Companies can artificially boost EPS through "share buybacks" — they use cash to buy back their own shares from the market, reducing the total share count. With fewer shares, the same total profit produces a higher EPS. This isn\'t necessarily bad, but you should check if actual net profit is also growing.',
      'Quarterly EPS surprises move stock prices dramatically. If analysts expect EPS of ₹20 and the company reports ₹25, the stock can gap up 5-10% in a single day. Conversely, a miss (expected ₹20, delivered ₹15) can cause a brutal selloff.',
      'Be wary of one-time gains or losses that inflate or deflate EPS temporarily. If a company sold a building and booked a ₹500 Crore profit, that inflates EPS for one quarter but it\'s not repeatable. Look at "EPS from operations" to strip out such noise.'
    ],
    formula: 'EPS = Net Profit ÷ Total Shares Outstanding\nDiluted EPS = Net Profit ÷ (Total Shares + Potential Dilutive Shares)',
    goodBad: {
      good: 'Steady EPS growth of 12-20% year-over-year for 5+ years = compounding machine. Rising EPS with stable or growing profit margins = healthy growth.',
      bad: 'Declining EPS for 2-3 consecutive quarters = fundamental deterioration. EPS growing only through buybacks while revenue is flat = hollow growth.'
    },
    indianContext: 'The Nifty 50 EPS has historically grown at roughly 12-14% per year over long periods. Companies like TCS have grown EPS at 15%+ annually for over a decade. Many PSU stocks have volatile EPS because government policies can suddenly impact their profits (like Coal India facing green energy regulations).',
    financialStatementLink: 'EPS comes directly from the bottom line of the Profit & Loss Statement. The "Net Profit After Tax" number is the numerator. The total share count (found in the Balance Sheet notes) is the denominator. When you see a company\'s P&L, trace the journey from Revenue → Operating Profit → Net Profit to understand what\'s driving EPS.',
    companySpecific: (name, sector, desc) => [
      `For ${name}, tracking EPS over the last 5-10 years tells you whether the business is genuinely creating wealth for shareholders. ${desc}`,
      `In the ${sector} industry, EPS can be volatile due to ${sector.includes('Bank') ? 'provisioning for bad loans (NPAs) which directly hit net profit' : sector.includes('IT') ? 'currency fluctuations — a weaker rupee boosts IT company earnings since they earn in dollars' : sector.includes('Oil') ? 'volatile crude oil prices that swing refining margins wildly' : 'input cost fluctuations and seasonal demand patterns'}.`,
      `When analyzing ${name}'s EPS, always check the "quality" of earnings. Is the EPS growth coming from genuine business expansion (more customers, higher prices, new products) or from accounting tricks and one-time items? The Cash Flow Statement will reveal the truth.`
    ]
  },

  dividendYield: {
    title: 'Dividend Yield',
    icon: PiggyBank,
    intro: 'Dividend Yield tells you how much cash income you receive every year just for holding a stock, expressed as a percentage of the stock\'s current price. It\'s like the "interest rate" on your stock investment — except unlike a fixed deposit, it can grow over time if the company keeps increasing its dividend.',
    analogy: 'Think of it like rental income from a property. You buy a flat for ₹50 Lakhs and rent it out for ₹2 Lakhs per year. Your "rental yield" is 4%. Similarly, if you buy a stock for ₹500 and the company pays ₹20 in dividends per year, your dividend yield is 4%. The beautiful thing about dividend stocks? Unlike rent, which you have to chase tenants for, dividends are deposited directly into your bank account.',
    deepDive: [
      'Dividend Yield = Annual Dividend Per Share ÷ Current Stock Price × 100. Note that yield moves inversely with stock price — if the stock price drops but the dividend stays the same, the yield goes UP (which can be misleading).',
      'Companies that pay dividends are generally mature, profitable businesses that generate more cash than they need to reinvest. Young, fast-growing companies rarely pay dividends because they need every rupee to fund growth.',
      'In India, dividends are taxable in the hands of the investor under the new tax regime (post-2020). Dividends above ₹5,000 attract TDS. This tax treatment makes dividend stocks slightly less attractive compared to growth stocks for high-income individuals.',
      'A "Dividend Aristocrat" is a company that has increased its dividend every year for 25+ consecutive years. While this concept is more popular in the US (S&P 500 Dividend Aristocrats), Indian companies like ITC, Coal India, and NTPC are known for generous dividends.',
      'The "Dividend Payout Ratio" tells you what percentage of profits a company distributes as dividends. A payout ratio of 30-50% is healthy — the company returns cash to shareholders while retaining enough to grow. Above 80% is unsustainable. Below 10% means the company is hoarding cash.'
    ],
    formula: 'Dividend Yield = (Annual Dividend Per Share ÷ Current Stock Price) × 100',
    goodBad: {
      good: 'A yield of 2-5% with a growing dividend = excellent passive income. Companies with 10+ year track record of increasing dividends are gold.',
      bad: 'A yield above 7-8% is suspicious — often it means the stock has crashed and the dividend will likely be cut next quarter. "Yield traps" are real and dangerous.'
    },
    indianContext: 'Coal India (6-7% yield), ITC (3-4%), NTPC (3-4%), and Power Grid (4-5%) are India\'s top dividend payers. PSU companies are often mandated by the government to pay dividends, which is why they have higher yields. Meanwhile, IT companies like TCS pay special dividends (₹18,000 Crore in a single year) alongside regular dividends.',
    financialStatementLink: 'Dividends are paid out of Net Profit (P&L Statement) and show up in the Cash Flow Statement under "Financing Activities" as "Dividends Paid." The Retained Earnings on the Balance Sheet decrease when dividends are distributed.',
    companySpecific: (name, sector, desc) => [
      `${name}'s dividend policy reflects the maturity and cash-generation ability of its ${sector} business. ${desc}`,
      `For ${name}, check the dividend payout ratio: how much of its net profit does it distribute versus reinvest? ${sector.includes('IT') ? 'IT companies like ' + name + ' often return 70-85% of profits as dividends since they are asset-light and don\'t need heavy capex.' : sector.includes('Bank') ? 'Banks need to retain more profits to maintain capital adequacy ratios (CAR), so ' + name + '\'s payout ratio is typically lower (20-30%).' : 'Given the capital-intensive nature of ' + sector + ', ' + name + ' must balance dividend payouts with reinvestment needs.'}`,
      `If you invested ₹1,00,000 in ${name} and the dividend yield is 3%, you would receive ₹3,000 per year as passive income — directly into your bank account. Over 10 years, that's ₹30,000+ in pure cash (even more if dividends grow).`
    ]
  },

  roe: {
    title: 'Return on Equity (ROE)',
    icon: Target,
    intro: 'ROE is the ultimate report card for management. It measures how much profit a company generates for every ₹100 of shareholder money invested in the business. Warren Buffett considers ROE the single most important metric when evaluating a company\'s management quality.',
    analogy: 'Imagine you give ₹10 Lakhs to two different friends to start businesses. Friend A generates ₹3 Lakhs profit (30% ROE). Friend B generates ₹80,000 profit (8% ROE). Who is the better entrepreneur? Obviously Friend A — they\'re multiplying your money three times more efficiently. That\'s what ROE measures: the efficiency of capital deployment.',
    deepDive: [
      'ROE = Net Profit ÷ Shareholders\' Equity × 100. Shareholders\' equity is what\'s left after subtracting all debts from total assets. It represents the money that truly "belongs" to shareholders.',
      'A high ROE (above 15-20%) sustained over many years is the hallmark of a company with a "moat" — a durable competitive advantage. It means competitors cannot easily replicate what this company does.',
      'WARNING: ROE can be artificially inflated by high debt. If a company borrows ₹900 Crore and only has ₹100 Crore of equity, even a modest ₹20 Crore profit gives a 20% ROE. But this is extremely risky. Always check ROE alongside Debt-to-Equity to make sure it\'s "genuine" high ROE.',
      'The DuPont Analysis breaks ROE into three components: Profit Margin × Asset Turnover × Financial Leverage. This decomposition reveals WHETHER the high ROE comes from operational efficiency (good) or just leverage (dangerous).',
      'Consistently high ROE (20%+ for 10 years) is extremely rare and extremely valuable. In India, companies like Asian Paints, HDFC Bank, TCS, and Bajaj Finance have achieved this feat, which is why they command premium valuations.',
      'ROE should ideally be higher than the company\'s cost of equity (roughly 12-14% in India). If ROE is below this threshold, the company is actually destroying value — shareholders would be better off putting their money in a fixed deposit.'
    ],
    formula: 'ROE = (Net Income ÷ Shareholders\' Equity) × 100',
    goodBad: {
      good: 'ROE consistently above 15-20% for 5+ years = exceptional management and competitive moat. ROE above 25% = world-class business.',
      bad: 'ROE below 10% for a non-cyclical company = poor capital allocation. Wildly fluctuating ROE = inconsistent business. ROE spiking due to equity shrinkage (debt-fueled) = risky.'
    },
    indianContext: 'TCS boasts an ROE of 40%+ (one of the highest globally for a company of its size). HDFC Bank maintains ~16-17% ROE consistently. Asian Paints delivers 25%+ ROE. Meanwhile, many PSU companies have ROEs below 10% because they are forced to make investments that serve national interest rather than maximizing shareholder returns.',
    financialStatementLink: 'ROE connects the Profit & Loss Statement (Net Income on top) with the Balance Sheet (Shareholders\' Equity on the bottom). It literally measures how well the P&L converts Balance Sheet equity into profit. This is why reading both statements together gives you the full picture.',
    companySpecific: (name, sector, desc) => [
      `${name}'s ROE reveals how efficiently its management converts your invested capital into profits. ${desc}`,
      `In the ${sector} industry, ROE benchmarks differ. ${sector.includes('IT') ? 'IT services companies are asset-light and capital-efficient, so ROEs above 25-30% are expected. If ' + name + '\'s ROE drops below 20%, something is wrong.' : sector.includes('Bank') ? 'For banks, ROE of 14-18% is considered excellent because banks are inherently leveraged businesses. ' + name + '\'s ROE is closely tied to its Net Interest Margin and asset quality.' : 'For capital-intensive ' + sector + ' businesses, an ROE of 12-18% is considered healthy. ' + name + ' must reinvest heavily in fixed assets, which naturally limits ROE.'}`,
      `Track ${name}'s ROE trend over 5 years. Is it stable, rising, or falling? A steadily rising ROE with low debt is the dream scenario — it means the company is becoming more efficient at generating profits without taking on additional risk.`
    ]
  },

  debtToEquity: {
    title: 'Debt-to-Equity (D/E) Ratio',
    icon: Scale,
    intro: 'The Debt-to-Equity ratio is the financial world\'s "risk meter." It tells you how much of the company\'s funding comes from borrowed money (debt) versus the shareholders\' own money (equity). The higher this ratio, the more leveraged — and riskier — the company is.',
    analogy: 'Imagine buying a house worth ₹1 Crore. If you put ₹20 Lakhs as down payment and take an ₹80 Lakh home loan, your personal "debt-to-equity" is 4.0 (₹80L debt ÷ ₹20L equity). If property prices rise 10%, your ₹1 Crore house becomes ₹1.1 Crore — you made ₹10 Lakhs on a ₹20 Lakh investment (50% return!). But if property prices DROP 10%, your house is worth ₹90 Lakhs while you owe ₹80 Lakhs + interest. You\'re almost underwater. That\'s the double-edged sword of leverage.',
    deepDive: [
      'D/E = Total Debt (short-term + long-term borrowings) ÷ Total Shareholders\' Equity. Some analysts include only interest-bearing debt, while others include all liabilities. Always check which definition is being used.',
      'A D/E below 1.0 means the company has more equity than debt — generally considered safe. A D/E of 0.3-0.5 is conservative. A D/E above 2.0 is aggressive leverage.',
      'Debt is not inherently bad. "Good debt" is borrowed at low interest rates to fund high-return projects. If a company can borrow at 8% and invest in projects earning 18%, that leverage creates value. "Bad debt" is borrowed to cover operating losses or pay dividends — that\'s a ticking time bomb.',
      'Capital-intensive industries (telecom, power, steel, real estate) naturally have higher D/E ratios because building towers, power plants, and factories requires massive upfront capital. Tech/IT companies have near-zero debt because they don\'t need factories.',
      'During economic downturns, highly leveraged companies are the first to collapse. When revenue drops but interest payments stay fixed, cash flow can turn negative rapidly. This is why value investors like Warren Buffett avoid heavily indebted companies.',
      'Watch the "Interest Coverage Ratio" alongside D/E. It tells you how easily a company can pay its interest expenses from its operating profit. Interest Coverage = EBIT ÷ Interest Expense. Below 2.0 is a danger zone.'
    ],
    formula: 'D/E Ratio = Total Debt ÷ Shareholders\' Equity',
    goodBad: {
      good: 'D/E below 0.5 = fortress balance sheet. D/E of 0.5-1.0 = healthy leverage. Declining D/E over time = company is de-leveraging (paying down debt).',
      bad: 'D/E above 2.0 for non-financial companies = dangerously leveraged. Rising D/E with falling profits = potential bankruptcy risk. D/E rising while the stock price is also falling = severe red flag.'
    },
    indianContext: 'Indian steel companies (Tata Steel, JSW Steel) typically have D/E of 0.8-1.5 due to the capital-intensive nature of steelmaking. Telecom companies like Bharti Airtel carry significant spectrum-related debt. IT companies (TCS, Infosys) are virtually debt-free. The Infrastructure Leasing & Financial Services (IL&FS) collapse in 2018 was a textbook example of what happens when D/E spirals out of control.',
    financialStatementLink: 'Both numbers come from the Balance Sheet. Total Debt = Short-term borrowings + Long-term borrowings (found under "Liabilities"). Shareholders\' Equity = Total equity (found under "Equity"). The interest expense on that debt appears on the Profit & Loss Statement. The actual debt repayments appear on the Cash Flow Statement under "Financing Activities."',
    companySpecific: (name, sector, desc) => [
      `${name}'s D/E ratio is crucial because it reveals the financial risk embedded in owning this stock. ${desc}`,
      `${sector.includes('Bank') || sector.includes('Financial') ? name + ' is a financial services company, so D/E works differently here. Banks are inherently leveraged (they borrow deposits and lend them out). The relevant metric for ' + name + ' is the Capital Adequacy Ratio (CAR) rather than traditional D/E.' : 'For ' + name + ' in ' + sector + ', a D/E below 1.0 is ideal. If ' + name + ' is taking on more debt to fund expansion, check if the projects being funded will generate returns higher than the interest cost. If yes, the debt is creating value. If not, it\'s destroying value.'}`,
      `During a market crash, ${name}'s stock price drop will be amplified by its leverage. Low-debt companies recover faster. This is why conservative investors prefer companies with clean balance sheets — they sleep better at night.`
    ]
  },

  revenue: {
    title: 'Revenue (Top Line)',
    icon: Receipt,
    intro: 'Revenue is the total money a company earns from selling its products or services before any expenses are subtracted. It is the very first line of the Profit & Loss Statement — which is why it\'s called the "top line." Revenue growth is the lifeblood of any business; without it, long-term profit growth is impossible.',
    analogy: 'Imagine you run a restaurant. In January, total food orders were ₹5 Lakhs. In February, they were ₹6 Lakhs. Your "revenue" grew by 20%. But you haven\'t subtracted rent, salaries, ingredients, electricity yet — that\'s all handled later (in profit margins). Revenue tells you one thing: is more money flowing INTO the business? If yes, you\'re growing. If no, you have a problem.',
    deepDive: [
      'Revenue growth can come from three sources: (1) Volume growth — selling more units, (2) Price growth — charging more per unit, and (3) New segments — entering new markets or launching new products. The best companies combine all three.',
      '"Organic revenue growth" (from existing operations) is more valuable than "inorganic growth" (from acquisitions). If a company grows 30% but 25% came from buying another company, the actual organic growth is only 5%.',
      'Revenue Recognition is a critical accounting concept. Companies can manipulate when they record revenue. For example, "channel stuffing" involves shipping excess products to distributors at year-end to inflate revenue — even though those products haven\'t actually been sold to end customers.',
      'Revenue concentration is a risk factor. If 40%+ of a company\'s revenue comes from a single client, losing that client would be catastrophic. IT companies sometimes face this risk with large US clients.',
      'Compare revenue growth to industry growth. If the industry is growing at 15% but the company is only growing at 5%, it\'s losing market share — a serious concern even though revenue is technically rising.'
    ],
    formula: 'Revenue = Total Sales of Goods + Total Sales of Services\n(found on the first line of the Profit & Loss Statement)',
    goodBad: {
      good: 'Revenue growing at 15-25% per year for a large-cap = excellent. Revenue growing faster than the industry = gaining market share.',
      bad: 'Flat or declining revenue for 3+ quarters = fundamental problem. Revenue growing but profit declining = the company is "buying" growth by sacrificing margins.'
    },
    indianContext: 'Reliance Industries has the highest revenue of any Indian company (~₹10 Lakh Crore), driven primarily by its oil refining business. IT companies report revenue in USD (since most clients are foreign), so a weakening rupee automatically boosts their INR revenue. FMCG companies grow revenue through rural distribution expansion.',
    financialStatementLink: 'Revenue is literally the first line of the Profit & Loss Statement. Every subsequent line item subtracts expenses from this number until you arrive at Net Profit. The Cash Flow Statement\'s "Cash from Operations" section reveals whether this revenue has actually been converted into real cash (as opposed to just accrued on paper).',
    companySpecific: (name, sector, desc) => [
      `${name}'s revenue trajectory tells you whether its core ${sector} business is expanding. ${desc}`,
      `For ${name}, pay attention to ${sector.includes('IT') ? 'revenue growth in Constant Currency (CC) terms to strip out forex effects. A 12% revenue growth in INR might only be 5% in USD if the rupee depreciated.' : sector.includes('Bank') ? 'Net Interest Income (NII) rather than just total interest income. NII is the bank\'s true "revenue" — the spread between what it earns on loans and what it pays on deposits.' : 'segment-wise revenue breakdown. Which product lines or geographies are driving growth? Is the growth broad-based or concentrated in one area?'}`,
      `A key question for ${name}: Is revenue growth sustainable, or is it a one-time spike? Look at the order book, contract wins, and management guidance for forward visibility.`
    ]
  },

  netProfit: {
    title: 'Net Profit (Bottom Line)',
    icon: Wallet,
    intro: 'Net Profit is the ultimate measure of a company\'s financial success. It\'s what remains after subtracting ALL expenses — raw materials, salaries, rent, marketing, depreciation, interest on loans, and taxes — from total revenue. It is the last line of the Profit & Loss Statement, hence "the bottom line." This is the money that truly belongs to shareholders.',
    analogy: 'Back to our restaurant analogy. You earned ₹6 Lakhs in revenue this month. But you spent ₹2 Lakhs on ingredients, ₹1.5 Lakhs on staff salaries, ₹50,000 on rent, ₹30,000 on electricity, ₹20,000 on marketing, and ₹50,000 on taxes. Your "Net Profit" is ₹6L - ₹5L = ₹1 Lakh. That\'s what you actually take home. If your restaurant is a publicly traded company, this ₹1 Lakh gets divided among all shareholders as Earnings Per Share.',
    deepDive: [
      'Net Profit Margin = Net Profit ÷ Revenue × 100. This tells you how many paisa out of every ₹1 of sales actually becomes profit. A 20% margin means 20 paisa of every rupee is pure profit.',
      'Different industries have vastly different "normal" margins. Software/IT companies have 20-25% margins because they don\'t need raw materials. Grocery retailers have 1-3% margins because competition is cutthroat. Banks have 15-25% margins. Understanding industry norms is essential.',
      'One-time items can dramatically distort Net Profit. Asset sales, legal settlements, tax benefits, or write-downs can cause a one-quarter spike or dip that doesn\'t reflect the actual business performance. Always look at "Adjusted Net Profit" or "Profit from continuing operations."',
      'The relationship between Revenue growth and Net Profit growth reveals "operating leverage." If revenue grows 10% but net profit grows 20%, the company has fixed costs that don\'t scale with revenue — this is a sign of a great business model.',
      'Cash conversion is key. A company might report ₹1,000 Crore in Net Profit but only convert ₹500 Crore into actual cash. The remaining ₹500 Crore is stuck in receivables (customers who haven\'t paid yet). The Cash Flow Statement exposes this gap.'
    ],
    formula: 'Net Profit = Revenue − Cost of Goods Sold − Operating Expenses − Depreciation − Interest − Taxes',
    goodBad: {
      good: 'Expanding net profit margins over time = increasing efficiency and pricing power. Net profit growing faster than revenue = operating leverage kicking in.',
      bad: 'Net profit declining while revenue grows = margin compression (costs rising faster than sales). Negative net profit for multiple years without a clear path to profitability = cash burn.'
    },
    indianContext: 'TCS and Infosys enjoy 20-22% net margins — among the highest in India. ITC\'s cigarette business has margins above 30% (high taxes but even higher prices). Steel companies have single-digit margins that swing wildly with commodity cycles. Banks\' net profit is heavily influenced by provisioning for bad loans — a single quarter of high NPAs can wipe out an entire year\'s profit.',
    financialStatementLink: 'Net Profit is the last line of the Profit & Loss Statement. But never look at Net Profit in isolation — trace the entire P&L from Revenue through Gross Profit, Operating Profit (EBITDA), EBIT, Profit Before Tax (PBT), and finally Net Profit. Each step tells you WHERE the money is being lost. Then cross-check with Cash Flow Statement to verify the profit is real.',
    companySpecific: (name, sector, desc) => [
      `${name}'s net profit tells you whether all that revenue is actually converting into shareholder wealth. ${desc}`,
      `For ${name}, track the Net Profit Margin trend. ${sector.includes('IT') ? 'IT companies should maintain 18-22% margins. If ' + name + '\'s margin drops below 15%, it suggests pricing pressure from clients or rising employee costs.' : sector.includes('Bank') ? 'For ' + name + ', net profit is driven by the Net Interest Margin (NIM) and provisioning for bad loans. A quarter with high provisioning can slash net profit even if the bank is operationally strong.' : 'In ' + sector + ', raw material costs can swing margins dramatically. Track ' + name + '\'s gross margin to see if it has pricing power to pass on cost increases.'}`,
      `The ultimate test: Is ${name}'s net profit growing at or above its revenue growth rate? If yes, the business is becoming more profitable as it scales — a hallmark of a great company.`
    ]
  },

  // Financial Statement pages
  'profit-loss': {
    title: 'Profit & Loss Statement (Income Statement)',
    icon: Receipt,
    intro: 'The Profit & Loss (P&L) Statement is the financial story of how much money a company made and spent over a specific period (usually a quarter or a year). It starts with total Revenue at the top and works its way down through various expenses until you reach Net Profit at the bottom. It answers the most basic question: "Is this company making money?"',
    analogy: 'Think of the P&L like your monthly personal budget. Your salary comes in (Revenue). Then you subtract rent, groceries, EMIs, electricity, phone bills, and income tax. Whatever\'s left is your Net Profit (savings). If you\'re spending more than you earn, your "Net Profit" is negative — you\'re in trouble. A company\'s P&L works exactly the same way, just with bigger numbers.',
    deepDive: [
      'The P&L flows in this exact order: Revenue → Cost of Goods Sold (COGS) → Gross Profit → Operating Expenses (SG&A) → Operating Profit (EBITDA/EBIT) → Interest Expense → Profit Before Tax (PBT) → Tax → Net Profit (PAT). Each step reveals something important.',
      'Gross Profit = Revenue minus the direct cost of making/delivering the product. A software company\'s COGS is tiny (servers, cloud costs). A steel company\'s COGS is massive (iron ore, coal, electricity). Gross Margin reveals pricing power.',
      'EBITDA (Earnings Before Interest, Taxes, Depreciation, Amortization) strips out financing decisions and accounting estimates. It\'s widely used to compare companies in the same industry because it focuses purely on operational performance.',
      'Operating Expenses include salaries, marketing, R&D, rent, and admin costs. A company with high "Operating Leverage" has a large proportion of fixed costs — once it covers those, every additional rupee of revenue flows almost entirely to profit.',
      'Interest Expense reveals how much the company pays on its debt. This comes AFTER operating profit — so a highly indebted company can be operationally profitable but still post a net loss if interest payments are too high.',
      'Taxes are the final deduction. Effective tax rates in India are typically 25-30%. Some companies enjoy tax holidays (SEZ-based IT companies) or carry forward past losses to reduce current taxes.'
    ],
    formula: 'Revenue\n− Cost of Goods Sold = Gross Profit\n− Operating Expenses = EBITDA\n− Depreciation & Amortization = EBIT\n− Interest Expense = PBT\n− Tax = Net Profit (PAT)',
    goodBad: {
      good: 'Revenue growing 15%+ with expanding margins at each level. Net profit growing faster than revenue. Low and stable cost ratios.',
      bad: 'Revenue growing but all growth being eaten by rising costs. Operating margins declining year-over-year. Interest expense consuming >30% of operating profit.'
    },
    indianContext: 'Indian companies report P&L under Indian Accounting Standards (Ind AS). IT companies like TCS report in both INR and USD. Banks have a different P&L structure where "Net Interest Income" replaces Revenue. Oil companies\' P&L swings wildly with crude prices.',
    financialStatementLink: 'The P&L connects to the Balance Sheet through "Retained Earnings" — whatever profit isn\'t paid out as dividends gets added to the equity section of the Balance Sheet. It connects to the Cash Flow Statement because net profit is the starting point for calculating Cash from Operations.',
    companySpecific: (name, sector, desc) => [
      `Reading ${name}'s P&L statement tells the complete story of its profitability in the ${sector} industry. ${desc}`,
      `For ${name}, focus on ${sector.includes('IT') ? 'Revenue growth in constant currency, employee costs (largest expense for IT companies), and EBIT margins.' : sector.includes('Bank') ? 'Net Interest Income (NII), fee income, provisions for NPAs, and Pre-Provision Operating Profit (PPOP).' : sector.includes('FMCG') || sector.includes('Consumer') ? 'volume growth vs. price growth (which drives revenue), advertising spend, and gross margin stability.' : 'raw material costs as a percentage of revenue, operating leverage, and whether EBITDA margins are expanding or contracting.'}`,
      `Compare ${name}'s P&L year-over-year. Are costs growing slower than revenue? That's operating leverage creating value. Are costs growing faster? That's margin compression destroying value.`
    ]
  },

  'balance-sheet': {
    title: 'Balance Sheet',
    icon: Landmark,
    intro: 'The Balance Sheet is a snapshot of everything a company OWNS (assets) and everything it OWES (liabilities) at a single point in time. The difference between what it owns and what it owes is "Shareholders\' Equity" — the net worth of the business that belongs to you, the shareholder. It answers: "How strong is this company\'s financial foundation?"',
    analogy: 'Imagine your personal net worth statement. You own a house worth ₹80 Lakhs, a car worth ₹8 Lakhs, ₹12 Lakhs in bank accounts, and ₹20 Lakhs in investments = ₹1.2 Crore in ASSETS. But you owe ₹50 Lakhs on your home loan and ₹3 Lakhs on your credit card = ₹53 Lakhs in LIABILITIES. Your net worth (equity) = ₹1.2 Cr - ₹53L = ₹67 Lakhs. A company\'s balance sheet works identically.',
    deepDive: [
      'The fundamental equation: Assets = Liabilities + Equity. This ALWAYS balances (hence "balance" sheet). If a company has ₹100 Crore in assets, it\'s funded by some combination of debt (liabilities) and shareholder money (equity).',
      'Current Assets = things that can be converted to cash within 1 year (cash, inventory, receivables). Non-Current Assets = long-term assets like factories, land, equipment, patents, and goodwill from acquisitions.',
      'Current Liabilities = debts due within 1 year (suppliers, short-term loans, upcoming EMIs). Non-Current Liabilities = long-term debt, bonds, deferred taxes.',
      'Working Capital = Current Assets − Current Liabilities. Positive working capital means the company can pay its short-term bills. Negative working capital is a liquidity crisis in the making (unless the business model intentionally runs on negative working capital, like Amazon).',
      'Goodwill is a controversial Balance Sheet item. When a company acquires another company for more than its book value, the excess is recorded as "Goodwill." If the acquisition turns sour, this goodwill must be "impaired" (written down), causing a massive one-time loss.',
      'For banks, the Balance Sheet is THE most important statement. A bank\'s assets are its loans (money it has lent out). A bank\'s liabilities are its deposits (money customers have given it). The quality of the loan book (how many loans might default) determines the bank\'s survival.'
    ],
    formula: 'Assets = Liabilities + Shareholders\' Equity\n\nTotal Assets = Current Assets + Non-Current Assets\nTotal Liabilities = Current Liabilities + Non-Current Liabilities\nEquity = Share Capital + Reserves + Retained Earnings',
    goodBad: {
      good: 'Growing equity (retained earnings) year-over-year. Declining debt-to-equity ratio. Strong working capital with current ratio > 1.5.',
      bad: 'Equity shrinking (due to losses eating into retained earnings). Ballooning debt with rising interest costs. Negative working capital in a non-retail business.'
    },
    indianContext: 'Indian companies must present Balance Sheets under Ind AS format. Banks\' balance sheets are structured differently (Schedule format). Real estate companies often have massive inventory (unsold apartments) on their balance sheets. IT companies have "asset-light" balance sheets with most value in cash and receivables.',
    financialStatementLink: 'The Balance Sheet connects to the P&L through Retained Earnings (net profit that isn\'t distributed as dividends accumulates here). It connects to the Cash Flow Statement because changes in Balance Sheet items (like inventory, receivables, payables) explain the gap between Net Profit and actual Cash Flow.',
    companySpecific: (name, sector, desc) => [
      `${name}'s Balance Sheet reveals the financial strength underlying its ${sector} operations. ${desc}`,
      `For ${name}, key Balance Sheet metrics to watch: ${sector.includes('Bank') ? 'Capital Adequacy Ratio (CAR), Gross NPA ratio, Net NPA ratio, and Provision Coverage Ratio. These tell you if the bank\'s loan book is healthy.' : sector.includes('IT') ? 'Cash and investments (IT companies should be sitting on large cash piles), receivables (is cash collection efficient?), and minimal debt.' : 'Fixed assets (factories, equipment), inventory levels, debt maturity profile, and whether the company is investing in capacity expansion.'}`,
      `Track ${name}'s equity growth over 5 years. If equity is consistently growing through retained profits (not through issuing new shares), the company is creating genuine wealth for shareholders.`
    ]
  },

  'cash-flow': {
    title: 'Cash Flow Statement',
    icon: Banknote,
    intro: 'The Cash Flow Statement is the most honest of the three financial statements. While the P&L can be manipulated through accounting tricks and the Balance Sheet can hide problems in complex line items, the Cash Flow Statement simply tracks the actual movement of real cash in and out of the company. Cash doesn\'t lie.',
    analogy: 'Think of cash flow like your bank account statement. The P&L is your salary slip — it says you earned ₹1 Lakh this month. But your bank balance only went up by ₹40,000. Why? Because ₹30,000 went to EMIs, ₹20,000 to credit card payments, and ₹10,000 to investing in mutual funds. The Cash Flow Statement explains these movements — where actual cash went.',
    deepDive: [
      'Cash Flow has three sections: (1) Cash from Operations (CFO) — cash generated from the actual business. (2) Cash from Investing (CFI) — cash spent on buying/selling assets, equipment, or other companies. (3) Cash from Financing (CFF) — cash from borrowing, repaying debt, issuing shares, or paying dividends.',
      'Cash from Operations is THE most important number. A company can show a profit on the P&L but have negative operating cash flow — this means the profit exists only on paper. Customers haven\'t paid, inventory is piling up, or revenue is being recognized prematurely.',
      'Free Cash Flow (FCF) = Cash from Operations − Capital Expenditure (Capex). This is the gold standard metric for sophisticated investors. FCF is the cash that\'s truly "free" — the company can use it to pay dividends, buy back shares, reduce debt, or invest in growth.',
      'Negative Cash from Investing is usually GOOD — it means the company is investing in new factories, equipment, or acquisitions to fuel future growth. Positive CFI means the company is selling off assets, which could be a distress signal.',
      'Cash from Financing reveals how the company funds itself. Heavy borrowing (positive CFF) means the company is taking on debt. Negative CFF from dividend payments and debt repayment is healthy — it means the business generates enough cash internally.',
      'The "Cash Conversion Ratio" = Cash from Operations ÷ Net Profit. A ratio above 1.0 means the company converts more than 100% of its paper profit into real cash — that\'s excellent. Below 0.7 is concerning — where is the profit going?'
    ],
    formula: 'Cash from Operations (CFO)\n+ Cash from Investing (CFI)\n+ Cash from Financing (CFF)\n= Net Change in Cash\n\nFree Cash Flow = CFO − Capital Expenditure',
    goodBad: {
      good: 'Strong positive CFO with CFO > Net Profit (cash conversion > 1.0). Consistent positive FCF. Company self-funding growth from operations without relying on debt.',
      bad: 'Negative CFO for multiple quarters = business isn\'t generating real cash. FCF consistently negative while P&L shows profit = accounting red flag. Financing cash flow propping up operations = the company is borrowing to survive.'
    },
    indianContext: 'Indian IT companies like TCS generate massive free cash flow (₹30,000-40,000 Crore annually) because they have minimal capex needs. Capital-intensive companies like Tata Steel or Reliance often have negative FCF during expansion phases. Telecom companies (Jio, Airtel) burned cash for years to build networks before turning FCF-positive.',
    financialStatementLink: 'The Cash Flow Statement starts with Net Profit from the P&L and then adjusts for non-cash items (depreciation, provisions) and working capital changes (from the Balance Sheet) to arrive at Cash from Operations. It\'s the bridge between the P&L and the Balance Sheet, explaining why cash on the Balance Sheet changed.',
    companySpecific: (name, sector, desc) => [
      `${name}'s Cash Flow Statement reveals whether its reported profits are backed by actual cash — the ultimate truth test. ${desc}`,
      `For ${name} in ${sector}: ${sector.includes('IT') ? 'IT companies should have a Cash Conversion Ratio above 1.0 (they do, typically 1.1-1.3x). ' + name + '\'s low capex needs mean most operating cash flow becomes free cash flow — available for dividends and buybacks.' : sector.includes('Bank') ? 'Banks\' cash flow statements are structured differently. Focus on the gap between reported profit and actual cash. Large loan write-offs or NPA provisioning can cause significant divergence.' : 'As a capital-intensive ' + sector + ' business, ' + name + ' will naturally have higher capex, reducing Free Cash Flow. The key question: Is ' + name + '\'s capex GROWTH capex (building new capacity) or MAINTENANCE capex (just keeping existing operations running)?'}`,
      `Warren Buffett\'s favorite check: Does ${name}'s cumulative Free Cash Flow over 5 years exceed its cumulative Net Profit? If yes, the business generates more cash than it reports as profit — that's an A+ cash flow profile.`
    ]
  }
};

// ─── Macro explanations (keeping existing ones) ──────────────────────
const MACRO: Record<string, { title: string; icon: any; intro: string; analogy: string; deepDive: string[]; formula?: string; goodBad: { good: string; bad: string }; indianContext: string }> = {
  'gdp-growth': {
    title: 'GDP Growth Rate',
    icon: TrendingUp,
    intro: 'Gross Domestic Product (GDP) is the total market value of all finished goods and services produced within a country in a specific time period. The GDP growth rate measures how fast the economy is expanding or contracting compared to the previous period.',
    analogy: 'Think of GDP like a giant pizza that represents all the economic activity in India. If last year\'s pizza was 100 inches wide and this year it\'s 107 inches, GDP grew by 7%. Everyone gets a slightly bigger slice. If the pizza shrinks (negative growth), that\'s a recession — everyone gets less.',
    deepDive: [
      'India measures GDP quarterly (every 3 months) and annually. The quarterly number is the one that moves markets.',
      'GDP has four components: Consumer spending (60%+), Government spending, Business investment, and Net exports. In India, consumer spending (people buying phones, food, cars, clothes) drives the majority of GDP.',
      'Real GDP adjusts for inflation. If the economy grew 10% but inflation was 6%, real GDP growth is roughly 4%. Real GDP is what matters because it measures actual increased production, not just higher prices.',
      '"Nominal GDP" is the raw number including inflation. India\'s nominal GDP is around $4 Trillion, making it the 5th largest economy globally.',
      'A sustained GDP growth rate of 7-8% is India\'s sweet spot — fast enough to create jobs and lift incomes, but not so fast that it overheats into inflation. The stock market (Nifty 50) broadly tracks GDP growth over long periods.'
    ],
    formula: 'GDP Growth Rate = ((GDP Current Period − GDP Previous Period) ÷ GDP Previous Period) × 100',
    goodBad: {
      good: 'India growing at 6-8% = strong economy, rising incomes, bullish for stocks. Growth acceleration (5% → 7%) = markets rally.',
      bad: 'Growth below 5% = slowdown, potential job losses. Negative growth = recession. India hasn\'t had a recession since 2020 COVID.'
    },
    indianContext: 'India is the world\'s fastest-growing major economy (as of 2024-26), consistently outpacing China. The Modi government targets making India a $5 Trillion economy. GDP growth directly impacts corporate earnings — when the economy booms, companies sell more products, hire more people, and stock prices rise.'
  },
  'cpi-inflation': {
    title: 'CPI Inflation',
    icon: TrendingUp,
    intro: 'Consumer Price Index (CPI) Inflation measures how fast the cost of living is rising for the average citizen by tracking price changes of a fixed basket of everyday goods — food, housing, clothing, transport, and medical care.',
    analogy: 'Imagine your monthly grocery bill. Last year, your standard shopping list cost ₹5,000. This year, the exact same items cost ₹5,300. That\'s a 6% inflation rate for your basket. CPI does exactly this, but for the entire country, tracking thousands of items from hundreds of cities.',
    deepDive: [
      'The RBI targets CPI inflation at 4%, with a tolerance band of 2-6%. If CPI breaches 6%, the RBI is mandated to explain why to the government and typically responds by raising interest rates.',
      'Food inflation in India is the most volatile component (weight ~46% in CPI basket). A bad monsoon can spike vegetable prices overnight, pushing CPI above 6% even if everything else is stable.',
      'Core inflation strips out food and fuel prices to reveal underlying inflation trends. Core inflation above 5% for sustained periods signals structural inflationary pressure.',
      'Inflation is the silent wealth destroyer. At 6% inflation, your money loses half its purchasing power in 12 years. This is why investing in equities (which historically beat inflation) is essential for long-term wealth building.',
      'The relationship between inflation and stock markets is nuanced. Moderate inflation (3-5%) is actually good for stocks because it means companies can raise prices. Hyperinflation (>10%) destroys stocks because the RBI raises rates aggressively, crushing valuations.'
    ],
    goodBad: {
      good: 'CPI in the 3-5% range = Goldilocks zone for markets. Falling inflation = potential rate cuts = market rally.',
      bad: 'CPI above 6% = RBI will hike rates = bearish for stocks. Deflation (negative CPI) = economic stagnation, no demand.'
    },
    indianContext: 'India\'s inflation has been largely under control in recent years, staying within the 4-6% band. Food inflation remains the wildcard — onion and tomato prices have historically even toppled governments. The RBI\'s inflation management directly impacts EMI rates for every Indian homebuyer.'
  },
  'interest-rate': {
    title: 'RBI Repo Rate',
    icon: Landmark,
    intro: 'The Repo Rate is the rate at which the Reserve Bank of India lends short-term money to commercial banks. It is the master interest rate that influences ALL other rates in the economy — your home loan EMI, car loan rate, credit card interest, and fixed deposit returns.',
    analogy: 'Think of the RBI as a water tank on top of a building, and money as water. The repo rate is how fast the tap is turned on. When the RBI lowers the rate (opens the tap wider), cheap money floods the system — people borrow more, spend more, and the economy heats up. When it raises the rate (tightens the tap), money becomes expensive and scarce — people borrow less, spend less, and the economy cools down.',
    deepDive: [
      'The Monetary Policy Committee (MPC), consisting of 6 members, meets every 2 months to decide the repo rate. Three members are from the RBI and three are external experts.',
      'Rate cuts are bullish for stocks because: (1) Companies borrow cheaper, boosting profits. (2) Fixed deposit returns drop, pushing money into equities. (3) Future earnings become more valuable when discounted at lower rates (higher P/E ratios).',
      'Rate hikes are bearish for the same reasons in reverse. Higher rates increase loan costs, make FDs more attractive than stocks, and compress P/E multiples.',
      'The "stance" matters as much as the rate itself. Stances include: Accommodative (likely to cut), Neutral (could go either way), and Tightening (likely to hike). Markets react to stance changes even without a rate change.',
      'Global interest rates (especially the US Federal Reserve\'s rate) influence India\'s rates. If the Fed hikes aggressively, the RBI often follows to prevent capital outflows and rupee depreciation.'
    ],
    goodBad: {
      good: 'Rate cuts or pause after a cutting cycle = bullish for equity and real estate. Low rates + moderate growth = ideal for investors.',
      bad: 'Aggressive rate hikes (multiple hikes in succession) = markets correct 10-15%. Rate at cycle peak with inflation still high = prolonged market weakness.'
    },
    indianContext: 'The repo rate has ranged from 4% (COVID lows in 2020) to 8%+ (in 2013-14 during the taper tantrum). The current rate cycle is crucial for India\'s housing market — every 25 bps cut saves roughly ₹1,500-2,000 per month on a ₹50 Lakh home loan.'
  },
  'unemployment': {
    title: 'Unemployment Rate',
    icon: Factory,
    intro: 'The unemployment rate measures the percentage of the total labor force that is actively seeking work but cannot find a job. It is one of the most politically sensitive economic indicators.',
    analogy: 'Imagine a college with 100 graduates actively looking for jobs. If 8 of them can\'t find one despite trying, the unemployment rate is 8%. But here\'s the catch — it doesn\'t count the 10 people who gave up looking entirely (they\'re "discouraged workers" and drop out of the labor force calculation).',
    deepDive: [
      'India\'s unemployment data comes from the CMIE (Centre for Monitoring Indian Economy) and the government\'s PLFS (Periodic Labour Force Survey). CMIE provides monthly data while PLFS is quarterly.',
      'Urban unemployment is typically higher than rural because farm work (even if low-paying) absorbs rural labor. Youth unemployment (15-24 age group) in India runs 2-3× the national average — a critical social issue.',
      'The unemployment rate can be misleadingly low if many people have stopped looking for work (they\'re not counted) or if "underemployment" is high (people working jobs far below their qualification).',
      'Low unemployment + rising wages = inflationary pressure. Companies pass higher wage costs to consumers, pushing CPI up, which forces the RBI to hike rates.',
      'Sectoral unemployment matters more than the headline number. IT sector layoffs have very different economic implications than agricultural unemployment.'
    ],
    goodBad: {
      good: 'Falling unemployment with rising labor participation = genuine economic improvement. Unemployment below 6% in India = strong job market.',
      bad: 'Rising unemployment above 8% = recession warning. High youth unemployment = social instability and consumer spending weakness.'
    },
    indianContext: 'India\'s official unemployment hovers around 7-9%, but underemployment (people in low-quality jobs) is a much bigger issue. The Modi government\'s focus on PLI schemes and manufacturing aims to create formal sector jobs. The gig economy (Zomato, Uber, Swiggy drivers) has complicated traditional unemployment measurement.'
  },
  'forex-reserves': {
    title: 'Foreign Exchange Reserves',
    icon: ShieldCheck,
    intro: 'Forex reserves are the foreign currencies, gold, and sovereign bonds held by the RBI. They serve as India\'s economic shield — protecting the rupee from collapse, ensuring India can always pay for imports (especially crude oil), and maintaining global investor confidence.',
    analogy: 'Think of forex reserves like your emergency fund. If you have 12 months of expenses saved, you can survive a job loss without panic. If you only have 1 month saved, any financial shock could bankrupt you. India\'s forex reserves are its national emergency fund against global economic shocks.',
    deepDive: [
      'India\'s forex reserves have grown from ~$300 Billion (2015) to $650+ Billion (2025-26), making it one of the largest reserve holders globally (4th-5th largest).',
      'Reserves are measured in "months of import cover" — how many months of imports India can pay for without earning a single dollar from exports. Currently ~10-11 months, which is very comfortable.',
      'The RBI uses reserves to defend the rupee. When the rupee weakens sharply (say ₹85 → ₹90 per USD), the RBI sells dollars from reserves to buy rupees, artificially creating demand for INR.',
      'Forex reserves include: Foreign Currency Assets (~90%), Gold (~7%), SDRs, and Reserve Position with IMF.',
      'Rapidly depleting reserves are a severe warning sign — it happened during India\'s 2013 "taper tantrum" crisis when reserves dropped $20 Billion in months, the rupee crashed from ₹55 to ₹68, and the stock market plummeted.'
    ],
    goodBad: {
      good: 'Reserves above $600 Billion with 10+ months import cover = fortress India. Rising reserves = RBI accumulating strength.',
      bad: 'Reserves dropping rapidly = RBI burning cash to defend rupee = crisis mode. Reserves below 6 months import cover = severe vulnerability.'
    },
    indianContext: 'India\'s forex reserves hit an all-time high of $700+ Billion in 2024 before settling around $650 Billion. The reserves provide comfort to foreign investors, who know India won\'t face a balance of payments crisis like it did in 1991.'
  },
  'trade-balance': {
    title: 'Trade Balance',
    icon: Scale,
    intro: 'Trade Balance = Exports − Imports. If a country exports more than it imports, it has a "trade surplus" (wealth flowing in). If it imports more, it has a "trade deficit" (wealth flowing out). India has historically run a trade deficit because it imports massive amounts of crude oil.',
    analogy: 'Imagine your household earns ₹1 Lakh per month from freelance work (exports) but spends ₹1.3 Lakhs on groceries, rent, and gadgets (imports). You have a "deficit" of ₹30,000 per month — you\'re spending more than you earn. You cover it by borrowing or dipping into savings. That\'s India\'s trade deficit in a nutshell.',
    deepDive: [
      'India\'s trade deficit is driven primarily by oil imports ($150-180 Billion annually) and gold imports ($40-50 Billion). Without these, India might actually run a surplus.',
      'IT services exports ($200+ Billion) are India\'s biggest foreign exchange earner, partially offsetting the goods trade deficit.',
      'A widening trade deficit puts depreciation pressure on the rupee because India needs more dollars to pay for imports.',
      'Trade wars (tariffs, sanctions) directly impact this number. If the US imposes tariffs on Indian goods, Indian exports decline and the trade balance worsens.',
      'Merchandise trade balance and services trade balance together form the Current Account Balance — a broader measure of international trade.'
    ],
    goodBad: {
      good: 'Narrowing trade deficit = rupee strengthening, less borrowing needed. Export growth outpacing import growth = India\'s competitiveness improving.',
      bad: 'Widening deficit especially from oil = rupee pressure, potential inflation. Trade deficit above 3% of GDP = structural weakness.'
    },
    indianContext: 'India\'s trade deficit typically ranges between $15-25 Billion per month. When global crude oil prices spike (like during Russia-Ukraine conflict), India\'s deficit balloons because we import 85% of our oil. The "Make in India" and PLI schemes aim to boost manufacturing exports and reduce import dependence.'
  },
  'fiscal-deficit': {
    title: 'Fiscal Deficit',
    icon: Building2,
    intro: 'Fiscal deficit occurs when the government spends more money than it earns from taxes. To cover the shortfall, the government borrows by issuing bonds. It\'s expressed as a percentage of GDP — the lower the better.',
    analogy: 'If you earn ₹12 Lakhs per year but spend ₹16 Lakhs (on housing, food, education, investments), you have a deficit of ₹4 Lakhs. You cover it by taking a loan. If you keep doing this every year, your total debt grows until the interest payments start eating into your actual income. That\'s fiscal deficit accumulation.',
    deepDive: [
      'India\'s fiscal deficit target is around 5-5.5% of GDP, with a goal of reaching 4.5% by FY26.',
      'The deficit is funded by government borrowing (issuing G-Secs/bonds). High borrowing increases bond supply, pushing yields up and interest rates higher.',
      'Revenue Deficit (a subset) = Revenue Expenditure − Revenue Income. This measures borrowing to fund day-to-day expenses (bad) versus capital expenditure (less bad).',
      'A moderate fiscal deficit (3-4% of GDP) is perfectly healthy if the borrowed money is spent on infrastructure, education, and productive assets. A high deficit spent on populist subsidies and freebies is destructive.',
      'Credit rating agencies (Moody\'s, S&P, Fitch) closely monitor India\'s fiscal deficit. A downgrade from investment grade (BBB) to junk would trigger massive FII outflows and a market crash.'
    ],
    goodBad: {
      good: 'Deficit below 4.5% of GDP = fiscal discipline. Deficit declining steadily = credit upgrade potential = FII inflows.',
      bad: 'Deficit above 6% = excessive borrowing = crowding out private investment. Rising deficit with slowing growth = danger zone.'
    },
    indianContext: 'India\'s fiscal deficit spiked to 9.5% during COVID (2020-21) as the government spent massively on stimulus. It has since been brought down through revenue recovery and expenditure discipline. Budget day is the most important day for fiscal deficit watchers.'
  },
  'manufacturing-pmi': {
    title: 'Manufacturing PMI',
    icon: Factory,
    intro: 'The Purchasing Managers\' Index (PMI) is a monthly survey of factory managers asking whether business conditions are improving, staying the same, or deteriorating. The magic number is 50 — above means expansion, below means contraction.',
    analogy: 'Imagine asking 100 chai stall owners: "Are you selling more chai, less chai, or the same as last month?" If 60 say "more" and 40 say "less," the PMI would be roughly 60 — strong expansion. If 30 say "more" and 70 say "less," it\'s around 30 — severe contraction. PMI works exactly like this, but for factories across the country.',
    deepDive: [
      'PMI is a composite of 5 sub-indices: New Orders (30% weight), Output (25%), Employment (20%), Supplier Delivery Times (15%), and Stocks of Purchases (10%).',
      'PMI is a LEADING indicator — it tells you what\'s happening NOW and what\'s likely to happen NEXT quarter, unlike GDP which tells you what already happened.',
      'India\'s Manufacturing PMI has been consistently above 50 for most months since 2021, indicating sustained factory expansion.',
      'Services PMI is equally important for India (services contribute 55%+ of GDP). A strong Services PMI + strong Manufacturing PMI = broad-based economic expansion.',
      'The PMI is released on the 1st business day of every month for the previous month — making it one of the earliest available economic indicators.'
    ],
    goodBad: {
      good: 'PMI above 52 = healthy expansion. PMI above 55 = rapid expansion, very bullish for industrial stocks and capex plays.',
      bad: 'PMI below 50 = contraction, recession warning. PMI declining for 3+ months even if above 50 = growth momentum is fading.'
    },
    indianContext: 'India\'s Manufacturing PMI has been one of the strongest globally, consistently outperforming China, Europe, and the US. This supports the "India growth story" narrative that has attracted record FII inflows. Key manufacturing sectors driving PMI: automobiles, chemicals, electronics assembly, and textiles.'
  },
  'rbi-repo-rate': {
    title: 'RBI Repo Rate',
    icon: Landmark,
    intro: 'The Repo Rate is the interest rate at which the Reserve Bank of India (RBI) lends short-term money to commercial banks against government securities. It is the master switch of India\'s entire interest rate environment — when it changes, everything from your home loan EMI to your FD returns shifts accordingly.',
    analogy: 'Think of the RBI as a water tank on the roof of a building. The repo rate controls how fast the tap is turned on. When the RBI lowers the rate (opens the tap wider), cheap money floods the banking system — banks lend more, people borrow more, spend more, and the economy heats up. When it raises the rate (tightens the tap), money becomes expensive — borrowing slows, spending drops, and the economy cools. The RBI uses this tap to keep the economy from boiling over (inflation) or freezing (recession).',
    deepDive: [
      'The Monetary Policy Committee (MPC) — a 6-member panel of 3 RBI officials and 3 external experts — meets every two months to decide the repo rate. The decision is announced by the RBI Governor and markets react within seconds.',
      'Rate cuts are bullish for stocks because: (1) Companies borrow cheaper, boosting profits. (2) FD returns drop, pushing money into equities. (3) Future earnings become more valuable at lower discount rates, expanding P/E multiples. (4) Real estate benefits as home loan EMIs drop.',
      'Rate hikes are bearish for the opposite reasons. Higher rates make loans expensive, FDs attractive, and compress stock valuations.',
      'The "stance" matters as much as the rate itself. Stances: Accommodative = likely to cut. Neutral = could go either way. Withdrawal of Accommodation = likely to hike. Markets react to stance changes even without a rate change.',
      'The repo rate has ranged from 4.0% (COVID lows, 2020-22) to 8%+ (2013-14 taper tantrum). Each 25 basis point (0.25%) cut saves roughly ₹1,500/month on a ₹50 Lakh, 20-year home loan.'
    ],
    goodBad: {
      good: 'Rate cuts or pause after cutting cycle = bullish for equity, real estate, and bonds. Low stable rates + moderate growth = best investing environment.',
      bad: 'Aggressive hikes (multiple consecutive meetings) = markets correct 10-15%. Rate at peak with inflation still high = prolonged market weakness.'
    },
    indianContext: 'The RBI\'s current inflation target is 4% CPI with a ±2% tolerance band (2-6%). If CPI breaches 6% for three consecutive quarters, the RBI must write a formal letter to Parliament explaining why. Global rates (especially the US Fed) influence India\'s rate decisions — if the Fed hikes aggressively, the RBI often follows to prevent capital outflows and rupee depreciation.'
  },
  'reverse-repo': {
    title: 'Reverse Repo Rate',
    icon: Landmark,
    intro: 'The Reverse Repo Rate is the rate at which the RBI borrows money FROM commercial banks. When banks have excess cash they don\'t want to lend out, they can park it with the RBI overnight and earn this rate as interest. It acts as the "floor" for short-term interest rates in the economy.',
    analogy: 'Imagine the RBI is a very safe locker. When banks are nervous about lending (maybe the economy is shaky), they prefer to keep their money in this locker and earn a guaranteed return rather than risk lending to businesses or individuals. The reverse repo rate is the "rent" the RBI pays banks for storing their money. A higher reverse repo = more incentive for banks to hoard cash with the RBI instead of lending it out = less money circulating in the economy.',
    deepDive: [
      'The reverse repo sits below the repo rate, forming the lower end of the "LAF corridor" (Liquidity Adjustment Facility). The spread between repo and reverse repo is typically 25-50 basis points.',
      'When the RBI wants to drain excess liquidity (too much cash sloshing around), it raises the reverse repo rate to incentivize banks to park more funds with it instead of lending.',
      'During COVID, the RBI widened the corridor (repo at 4%, reverse repo at 3.35%) to discourage banks from parking money and encourage them to lend instead.',
      'The Standing Deposit Facility (SDF), introduced in April 2022, has effectively replaced the fixed reverse repo as the new floor of the LAF corridor.',
      'A rising reverse repo rate is a signal that the RBI is beginning to tighten monetary policy — often a precursor to repo rate hikes.'
    ],
    goodBad: {
      good: 'Low or falling reverse repo = RBI encouraging banks to lend = expansionary policy = bullish for credit growth and stocks.',
      bad: 'Rising reverse repo = RBI draining liquidity = tightening = bearish for rate-sensitive sectors like real estate, auto, and banking.'
    },
    indianContext: 'Post-COVID, the reverse repo was kept at 3.35% for an extended period to flood banks with cheap cash. The transition to the SDF (at a higher rate) was the RBI\'s way of gradually normalizing without formally "hiking" the reverse repo — a subtle but significant tightening move.'
  },
  'standing-deposit-facility': {
    title: 'Standing Deposit Facility (SDF)',
    icon: Landmark,
    intro: 'The Standing Deposit Facility is a monetary policy tool introduced by the RBI in April 2022. It allows the central bank to absorb excess liquidity from banks WITHOUT giving them government securities as collateral. The SDF rate has replaced the reverse repo rate as the new floor of the interest rate corridor.',
    analogy: 'Think of the old reverse repo as a pawn shop — banks gave the RBI cash and got government bonds as collateral in return. The SDF is more like a simple savings account — banks hand over cash to the RBI and earn interest, no collateral exchanged. This gives the RBI unlimited capacity to absorb cash from the system, since it doesn\'t need to hold enough bonds to collateralize every rupee it borrows.',
    deepDive: [
      'Before the SDF, the RBI could only absorb liquidity via the reverse repo window, which required it to hand over government securities. This limited how much liquidity it could drain. The SDF removed this constraint.',
      'The SDF rate is set 25 basis points below the repo rate. So if repo = 6.50%, SDF = 6.25%. The Marginal Standing Facility (MSF) sits 25 bps above repo at 6.75%. Together: SDF → Repo → MSF forms the corridor.',
      'Banks voluntarily park excess funds at the SDF rate. No minimum or maximum limits — they can deposit any amount for any duration (typically overnight).',
      'The SDF was recommended by the Urjit Patel Committee (2014) but only implemented 8 years later during the post-COVID liquidity normalization.',
      'For markets, the SDF rate is effectively the "risk-free rate" for overnight money. All other short-term rates in the economy are benchmarked to it.'
    ],
    goodBad: {
      good: 'SDF rate cuts = cheaper overnight money = bullish for short-duration bonds and money market instruments.',
      bad: 'SDF rate hikes = RBI draining liquidity aggressively = tightening financial conditions = cautious signal for markets.'
    },
    indianContext: 'The introduction of the SDF was a watershed moment in India\'s monetary policy. It gave the RBI a much more powerful tool to manage the massive liquidity surplus (₹8+ Lakh Crore) that was pumped into the system during COVID. The transition from reverse repo to SDF as the effective policy floor happened seamlessly, with minimal market disruption.'
  },
  'wpi-inflation': {
    title: 'WPI Inflation (Wholesale Price Index)',
    icon: TrendingUp,
    intro: 'WPI measures the average change in prices of goods at the wholesale/producer level — raw materials, intermediate goods, and finished products traded between businesses. It\'s a leading indicator for retail inflation: when wholesale prices surge, companies eventually pass those costs to consumers (CPI).',
    analogy: 'Think of WPI as the "behind the counter" price list at a grocery store. When the store\'s wholesale supplier raises prices (the wheat flour costs more, the cooking oil is expensive), the shopkeeper doesn\'t immediately change the price tags on the shelf — that\'s CPI. But eventually, within weeks or months, the higher wholesale costs will trickle down to the shelf price you see. WPI captures that upstream price pressure before you feel it at the checkout counter.',
    deepDive: [
      'WPI covers three major groups: Primary Articles (food, minerals — 22.6% weight), Fuel & Power (13.15%), and Manufactured Products (64.23%). The heavy manufacturing weight makes it sensitive to global commodity cycles.',
      'Unlike CPI which tracks consumer prices, WPI doesn\'t include services (rent, healthcare, education). So WPI and CPI can diverge significantly — WPI can be negative while CPI is positive, and vice versa.',
      'A widening gap between WPI and CPI is important: If WPI >> CPI, companies are absorbing input cost increases (crushing their margins). If WPI << CPI, companies have strong pricing power and are passing costs to consumers.',
      'WPI went deeply negative (-3.5%) in 2020 during COVID lockdowns, then spiked to 15%+ in 2021-22 during the global commodity super-cycle. This wild swing showed how sensitive WPI is to global supply chains.',
      'The government uses WPI for deflating GDP (converting nominal to real GDP), making it relevant for macroeconomic calculations even though CPI is the RBI\'s target inflation measure.'
    ],
    goodBad: {
      good: 'WPI falling toward 0-3% = input cost pressures easing = good for corporate margins. WPI and CPI converging = stable pricing environment.',
      bad: 'WPI spiking above 10% = margin pressure bomb incoming for companies = eventually feeds into CPI = rate hike expectations rise.'
    },
    indianContext: 'India experienced WPI inflation of 15-16% during the commodity spike of 2021-22. Companies like paint makers (Asian Paints), FMCG (HUL), and auto companies (Maruti) saw their margins crushed. When WPI cooled down in 2023, these same companies saw massive margin recovery and stock price rallies.'
  },
  'iip-growth': {
    title: 'IIP Growth (Index of Industrial Production)',
    icon: Factory,
    intro: 'IIP measures the actual physical volume of production in India\'s industrial sector — mining, manufacturing, and electricity. Unlike PMI which is based on surveys (what managers "think" is happening), IIP counts what factories actually produced. It\'s the hard data counterpart to the soft data of PMI.',
    analogy: 'PMI is like asking a cricket captain before the match "How do you think you\'ll perform?" — it\'s a sentiment indicator. IIP is the actual scorecard after the match — it tells you exactly how many runs were scored. If IIP says manufacturing grew 5%, it means Indian factories genuinely produced 5% more goods than the same month last year.',
    deepDive: [
      'IIP has three sectors: Mining (14.4% weight), Manufacturing (77.6% — the heavyweight), and Electricity (8%). Manufacturing dominates, making IIP essentially a factory output gauge.',
      'IIP is published monthly with a 6-week lag by the Ministry of Statistics. The base year is 2011-12 = 100.',
      'IIP is a volume index, not a value index. It counts physical units (tonnes of steel, number of cars) regardless of price changes. This makes it immune to inflation distortion.',
      'Use-based classification splits IIP into: Primary Goods, Capital Goods (machinery, heavy equipment — capex indicator), Intermediate Goods, Infrastructure Goods, Consumer Durables, and Consumer Non-Durables. Capital Goods IIP is the best forward indicator of private investment.',
      'Weak IIP growth often precedes poor quarterly results for industrial stocks. If factories are producing less, revenue and profits will follow downward within 1-2 quarters.'
    ],
    goodBad: {
      good: 'IIP growth above 5% = healthy industrial expansion. Capital goods IIP growing = companies investing in new capacity = bullish signal.',
      bad: 'IIP contraction (negative growth) for 2+ months = industrial recession. Manufacturing IIP flat while electricity IIP grows = structural shift, not broad recovery.'
    },
    indianContext: 'India\'s IIP growth has been volatile — contracting sharply during COVID (-57% in April 2020), then rebounding strongly. The "Make in India" and PLI (Production Linked Incentive) schemes aim to structurally boost IIP by attracting manufacturing investment in electronics, pharma, auto, and defense.'
  },
  'fii-flows-cash': {
    title: 'FII Flows (Foreign Institutional Investors)',
    icon: TrendingUp,
    intro: 'FII Flows measure the net amount of money that foreign institutional investors — global funds, banks, pension funds, hedge funds — are investing into or pulling out of Indian markets (both equity and debt). FIIs are the single most powerful force driving short-term market direction.',
    analogy: 'Imagine the Indian stock market as a large swimming pool. FIIs are like a massive fire hose — when they turn it on (buy Indian stocks), the water level rises rapidly. When they reverse it (sell), it drains fast. Even though domestic investors (DIIs) also add water with garden hoses (SIPs), the FII fire hose has more immediate impact on the water level.',
    deepDive: [
      'FII flows are reported daily by NSE/BSE and tracked as "net purchases" = total buying minus total selling, in ₹ Crores. Monthly and yearly trends matter more than daily noise.',
      'FII selling is driven by: (1) Rising US interest rates (US Treasury yields > 5% make India less attractive). (2) Global risk-off events (war, banking crisis). (3) Expensive Indian valuations relative to EM peers. (4) Rupee depreciation fears.',
      'FII buying is driven by: (1) India growth outperformance. (2) Falling US rates. (3) China weakness redirecting capital to India. (4) Index weight increases (MSCI upgrades).',
      'India received record FII inflows in 2023 when global capital fled China and redirected to India. Conversely, FIIs sold over ₹1.2 Lakh Crore in Indian equities during the Oct 2024 selloff.',
      'FII flows and market returns are strongly correlated in the short term but not the long term. Markets can rise despite FII selling if DII (domestic) buying is strong enough — which has been the case since India\'s SIP revolution.'
    ],
    goodBad: {
      good: 'Sustained FII inflows for 3+ months = strong international confidence = bullish. FII buying + DII buying = powerful rally.',
      bad: 'Heavy FII selling for 3+ months = foreign capital flight = market correction. FII selling while rupee weakens = double whammy.'
    },
    indianContext: 'India\'s SIP revolution (₹20,000+ Crore/month flowing via mutual fund SIPs) has fundamentally changed the market structure. Before 2017, FII selling caused automatic market crashes. Now, domestic flows act as a structural cushion — FIIs sold ₹1.7 Lakh Crore in 2022 but the Nifty was broadly flat because DIIs bought the same amount.'
  },
  'fii-flows-mtd': {
    title: 'FII Flows (Month-to-Date)',
    icon: TrendingUp,
    intro: 'FII Flows (MTD) shows the cumulative net investment by foreign institutional investors in Indian equities since the start of the current month. It provides a real-time pulse of foreign capital sentiment.',
    analogy: 'Think of this as your monthly bank statement running total. On the 1st of the month it starts at zero. Every day, as FIIs buy or sell Indian stocks, the running total updates. A positive MTD means foreigners are net buyers this month (optimistic on India). A negative MTD means they\'re pulling money out.',
    deepDive: [
      'FII MTD data is compiled from daily exchange disclosures. It covers both cash market (direct stock purchases) and derivatives (futures/options) activity.',
      'The first and last weeks of a month often see the highest activity as global fund managers rebalance portfolios.',
      'Compare FII MTD with DII MTD — if both are positive, the market has strong underpinning. If FII is negative but DII is strongly positive, the market may hold steady.',
      'FII flow direction often shifts at quarter ends (March, June, September, December) due to global portfolio rebalancing, tax considerations, and benchmark reconstitution.',
      'Single-month FII data can be noisy. Look at 3-month rolling averages for a clearer trend signal.'
    ],
    goodBad: {
      good: 'FII MTD strongly positive (>₹10,000 Cr) = clear bullish signal for the month. Three consecutive positive months = institutional trend shift.',
      bad: 'FII MTD deeply negative (<₹-15,000 Cr) by mid-month = heavy selling pressure. Markets typically need DII support to prevent deeper corrections.'
    },
    indianContext: 'SEBI publishes FII/FPI data daily with a one-day lag. The data covers all FPI-registered entities investing in Indian markets. India is the largest recipient of FPI flows among emerging markets, reflecting its growth premium and improving corporate governance.'
  },
  'dii-flows-cash': {
    title: 'DII Flows (Domestic Institutional Investors)',
    icon: PiggyBank,
    intro: 'DII Flows track the net buying or selling by Indian domestic institutions — mutual funds, insurance companies (LIC, HDFC Life), pension funds (EPFO), and banks. DIIs have become the backbone of the Indian market, providing a structural floor during foreign selloffs.',
    analogy: 'If FIIs are the monsoon rains (powerful but seasonal and unpredictable), DIIs are the steady groundwater recharge. Every month, crores of Indian households invest ₹500-₹10,000 via SIPs into mutual funds. This money then gets deployed by fund managers into the stock market as DII flows. It\'s slow, steady, and relentless — and it has transformed the Indian market from being FII-dependent to being self-sustaining.',
    deepDive: [
      'DII flows are dominated by mutual funds (60-70% of total DII activity), followed by insurance companies (LIC is the single largest DII) and pension/provident funds.',
      'India\'s monthly SIP contributions crossed ₹20,000 Crore in 2024 — this money flows into equity markets regardless of market direction. It\'s the definition of "buy the dip."',
      'Unlike FIIs who are sensitive to global macro (US rates, dollar strength, EM risk), DIIs are driven by domestic savings patterns, which are structurally growing as India\'s middle class expands.',
      'DII buying during FII selloffs has prevented India from experiencing the kind of market crashes that hit other emerging markets. During the 2022 global selloff, DIIs bought over ₹2 Lakh Crore of equities.',
      'LIC alone manages ₹40+ Lakh Crore in assets and is mandated to invest a portion in equities — making it a permanent, government-backed buyer in the Indian market.'
    ],
    goodBad: {
      good: 'Consistent positive DII flows = structural domestic demand for equities. DII buying accelerating during corrections = "smart money" deploying at lower levels.',
      bad: 'DII flows turning negative (rare) = domestic institutions selling = usually happens at market tops when mutual fund redemptions spike. DII selling + FII selling simultaneously = severe correction risk.'
    },
    indianContext: 'The SIP revolution is India\'s most important financial transformation. From ₹3,000 Crore/month in 2016 to ₹20,000+ Crore/month in 2024, retail India has become the stock market\'s anchor. This means the next generation of Indian investors is automatically dollar-cost-averaging into equities — creating long-term wealth and market stability simultaneously.'
  },
  'dii-flows-mtd': {
    title: 'DII Flows (Month-to-Date)',
    icon: PiggyBank,
    intro: 'DII Flows (MTD) shows the cumulative net investment by domestic institutional investors — mutual funds, insurance companies, and pension funds — in Indian equities since the start of the current month.',
    analogy: 'This is the domestic counterpart to FII MTD. While FII MTD tells you what foreign money is doing, DII MTD tells you what Indian institutional money is doing. Together, they paint the complete picture of institutional demand for Indian stocks.',
    deepDive: [
      'DII flows are more predictable than FII flows because they\'re driven by structural factors — monthly SIP inflows, insurance premium collections, and provident fund contributions that come in like clockwork.',
      'DII MTD tends to be counter-cyclical to FII MTD — when FIIs sell aggressively, DIIs step in as buyers (and vice versa). This negative correlation has been a stabilizing force for Indian markets.',
      'Mutual fund NFO (New Fund Offer) collections can cause temporary spikes in DII flows as the collected money gets deployed.',
      'Watch for DII flows relative to market levels. DIIs buying at market highs might indicate retail FOMO (concerning). DIIs buying at market lows is genuinely supportive.',
      'The total AUM (Assets Under Management) of Indian mutual funds crossed ₹60 Lakh Crore in 2024, giving DIIs enormous firepower.'
    ],
    goodBad: {
      good: 'Strong positive DII MTD during market weakness = domestic confidence acting as a floor. Consistent DII buying regardless of market direction = healthy structural demand.',
      bad: 'DII MTD turning negative during a rally = institutions profit-booking = potential near-term top signal.'
    },
    indianContext: 'India\'s domestic institutional landscape is unique among emerging markets. Most EM countries are heavily dependent on FII flows, making them vulnerable to global sentiment shifts. India\'s deep domestic institutional base — powered by SIPs and insurance — provides a cushion that peers like Brazil, South Africa, or Indonesia lack.'
  },
  'govt-borrowing': {
    title: 'Government Borrowing',
    icon: Building2,
    intro: 'Government Borrowing is the amount of money the Indian government raises from the market by issuing bonds (Government Securities / G-Secs) to fund its fiscal deficit. When the government spends more than it earns from taxes, it covers the gap by borrowing — and the size of this borrowing directly impacts interest rates across the entire economy.',
    analogy: 'Imagine a village with one well (the bond market) that everyone draws water from. When the government shows up with a massive tanker truck to fill up (large borrowing), there\'s less water left for everyone else. The price of water goes up (interest rates rise). If the government brings a smaller truck (lower-than-expected borrowing), there\'s more water for farmers and businesses — the price drops (rates fall). This "crowding out" effect is why government borrowing matters to every investor.',
    deepDive: [
      'The government\'s borrowing calendar is announced in the Union Budget (February) with half-yearly targets. "Gross borrowing" is total new bonds issued. "Net borrowing" = Gross minus bonds being repaid (maturing). Net is the real number to watch.',
      'Large government borrowing increases the supply of G-Secs in the market, pushing bond prices down and yields up. Higher G-Sec yields ripple through the entire economy — raising corporate bond rates, loan rates, and mortgage rates.',
      'The RBI manages the government\'s borrowing program and sometimes conducts Open Market Operations (OMOs) to buy G-Secs from the market, effectively absorbing the supply and preventing yields from spiking.',
      'Lower-than-expected borrowing in the Budget is one of the most bullish signals for bond markets. In 2024, when the government announced lower borrowing, 10-year G-Sec yields dropped 15-20 basis points in hours.',
      'India\'s total government debt is ~55% of GDP — moderate by global standards (Japan is 260%, US is 125%). But the interest payment on this debt consumes ~40% of the government\'s revenue — that\'s the real concern.'
    ],
    goodBad: {
      good: 'Lower-than-expected net borrowing = bullish for bonds and stocks. Government reducing borrowing year-over-year = fiscal discipline = potential credit rating upgrade.',
      bad: 'Higher-than-expected borrowing = bond yields spike = interest rates rise = bearish for rate-sensitive stocks. Borrowing to fund consumption spending (subsidies) rather than capital investment = long-term drag.'
    },
    indianContext: 'India\'s gross borrowing program is typically ₹15-17 Lakh Crore annually. The market closely watches whether borrowing is front-loaded (heavy in H1) or spread evenly. The RBI-Government coordination on borrowing is crucial — a botched auction (when banks don\'t buy enough bonds) signals stress in the system.'
  },
  'current-account': {
    title: 'Current Account Balance',
    icon: Scale,
    intro: 'The Current Account Balance is a record of a country\'s transactions with the rest of the world — specifically trade in goods (exports minus imports), trade in services (IT exports, tourism), income flows (dividends, interest earned abroad), and remittances (money sent home by Indians working overseas). A deficit means India sends more money abroad than it receives.',
    analogy: 'Think of India as a household. It earns income from: (1) Selling goods abroad (exports — like selling home-cooked food to neighbors). (2) Providing services (IT consulting — like being a tutor). (3) Remittances (family members working in the Gulf/US sending money home). It spends on: (1) Buying goods from abroad (crude oil, electronics, gold — like grocery shopping). If spending exceeds income, the household runs a "current account deficit" and must borrow to bridge the gap.',
    deepDive: [
      'India typically runs a Current Account Deficit (CAD) of 1-3% of GDP because it imports more goods than it exports — primarily due to massive crude oil imports ($150-180 Billion/year) and gold imports ($40-50 Billion/year).',
      'IT services exports ($200+ Billion annually) and remittances ($100+ Billion — India is the world\'s largest recipient) partially offset the goods trade deficit.',
      'A CAD below 2% of GDP is considered "comfortable." Between 2-3% = manageable but watch closely. Above 3% = danger zone (puts severe pressure on the rupee). India\'s 2013 crisis was triggered by CAD hitting 4.8% of GDP.',
      'The capital account (FII/FDI inflows) must finance the current account deficit. If foreign investors pull out (capital account reverses), and the CAD is large, the rupee crashes and the RBI has to burn forex reserves.',
      'Oil prices are the single biggest variable for India\'s CAD. A $10/barrel rise in crude oil widens India\'s CAD by roughly $10-15 Billion annually.'
    ],
    goodBad: {
      good: 'CAD below 1.5% of GDP = very comfortable. CAD narrowing = positive for rupee and market sentiment. Trade surplus (rare for India) = exceptionally bullish.',
      bad: 'CAD above 3% of GDP = currency crisis risk (2013 repeat). CAD widening while FII flows are negative = perfect storm for rupee depreciation and market selloff.'
    },
    indianContext: 'India\'s CAD management has improved dramatically since the 2013 crisis. Forex reserves have quadrupled, oil import bills have been partially offset by Russian crude discounts, and IT/services exports have boomed. However, the structural dependence on imported crude oil remains India\'s Achilles\' heel — any sustained spike in oil prices immediately threatens the current account.'
  },
  'next-rbi-mpc': {
    title: 'Next RBI MPC Meeting',
    icon: Landmark,
    intro: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India meets every two months (6 times a year) to decide India\'s key interest rates — primarily the repo rate. The MPC\'s decisions directly affect every Indian — from home loan EMIs and FD returns to stock market valuations and corporate borrowing costs.',
    analogy: 'Think of the MPC meeting as a quarterly exam for the economy. The 6-member committee reviews the economy\'s "report card" — inflation data, GDP growth, global conditions, rupee movement — and decides the "grade": rate cut (reward for good behavior), rate hike (punishment for overheating), or pause (status quo). Markets are like anxious students waiting for results — the anticipation and reaction can move billions.',
    deepDive: [
      'The MPC has 6 members: 3 from the RBI (Governor as Chair, Deputy Governor, and one Executive Director) and 3 external members appointed by the government. Decisions are by majority vote; the Governor has a casting vote in case of a tie.',
      'MPC meetings typically last 3 days. The decision is announced at 10 AM on the last day, followed by the Governor\'s press conference. Markets react within seconds of the announcement.',
      'What to watch for: (1) The rate decision itself (cut/hike/pause). (2) The "stance" — more important for signaling future actions. (3) The MPC\'s inflation and GDP forecasts. (4) The vote split (a 4-2 vote to pause means dissenters wanted a cut — dovish signal).',
      'A "hawkish hold" (pause but with hawkish language about inflation risks) is different from a "dovish hold" (pause but signaling cuts are coming). Markets parse every word of the statement.',
      'The RBI publishes detailed MPC minutes two weeks after the meeting, revealing each member\'s individual reasoning and vote. These minutes often move markets as traders assess the likelihood of future rate changes.'
    ],
    goodBad: {
      good: 'Surprise rate cut = immediate 1-2% market rally. Dovish stance change = builds expectations for future cuts = sustained bullishness. Unanimous vote for cut = strong conviction.',
      bad: 'Surprise rate hike = 1-3% market selloff. Hawkish stance shift = markets price in future hikes = sector rotation out of rate-sensitive stocks.'
    },
    indianContext: 'The MPC was established in 2016 to bring transparency and accountability to monetary policy (previously, the RBI Governor decided rates alone). The MPC framework has largely succeeded — inflation expectations are better anchored, and rate decisions are more predictable. Key dates are published a year in advance on the RBI website.'
  },
  'next-event': {
    title: 'Next Economic Event',
    icon: Landmark,
    intro: 'This tracks the next significant scheduled economic event or data release that could impact Indian financial markets — typically the next RBI MPC meeting, Union Budget, GDP data release, or important global central bank decision.',
    analogy: 'Think of the economic calendar as the "fixtures list" for financial markets. Just like cricket fans mark match days, investors mark these event dates because they bring volatility and potentially reshape market direction. Being positioned before a major event can make or break your returns.',
    deepDive: [
      'Key events on the Indian economic calendar: RBI MPC (6 times/year), Union Budget (February), GDP data (quarterly), CPI/WPI inflation (monthly), IIP data (monthly), Trade data (monthly), PMI (monthly).',
      'Global events that impact India: US Fed meetings (8/year), ECB meetings, Bank of Japan meetings, US jobs data (monthly), US CPI (monthly), Chinese GDP and PMI data.',
      'Markets typically exhibit lower volume and range-bound trading in the 2-3 days before a major event as participants wait for clarity. This is called "event risk" — traders reduce positions ahead of potential volatility.',
      'Post-event, markets can gap up or down significantly. The Budget day historically sees 2-4% Nifty moves in either direction. MPC decisions cause 0.5-1.5% moves.',
      'Understanding the economic calendar helps you avoid being caught off-guard by sudden volatility. Never make large trading decisions the day before a major event without understanding the potential outcomes.'
    ],
    goodBad: {
      good: 'Known events with expected outcomes = markets pre-position, reducing surprise risk. Multiple positive catalysts clustered together = rally potential.',
      bad: 'Multiple risk events in a short window = elevated volatility and uncertainty. Unexpected events (geopolitical shocks, bank failures) = worst case since markets can\'t price them in.'
    },
    indianContext: 'The two most market-moving events in the Indian calendar are the Union Budget (February) and the RBI MPC meetings. The Budget can trigger 3-5% moves in a single session. Smart investors track the full calendar and adjust their position sizing around major events.'
  }
};


// ─── Section Component ───────────────────────────────────────────────
function Section({ icon: Icon, title, children, accent = false }: { icon?: any; title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`${accent ? 'bg-[#D4AF37]/5 border border-[#D4AF37]/20' : 'bg-white/[0.03] border border-white/5'} rounded-2xl p-6 md:p-8`}>
      <h3 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 flex items-center gap-3">
        {Icon && <Icon size={22} className="text-[#D4AF37]/70 flex-shrink-0" />}
        {title}
      </h3>
      <div className="text-white/80 leading-relaxed space-y-4 text-[15px]">{children}</div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
function LearnPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const term = params.term as string;
  const symbol = searchParams.get('symbol')?.toUpperCase() || null;
  const company = symbol ? COMPANIES[symbol] : null;

  const metric = METRICS[term];
  const macro = MACRO[term];
  const content = metric || macro;

  if (!content) {
    return (
      <div className="min-h-screen bg-[#111110] text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-[#D4AF37] mb-4">Term Not Found</h1>
          <p className="text-white/60 mb-6">We don't have an explanation for "{term}" yet.</p>
          <button onClick={() => window.history.back()} className="text-[#D4AF37] hover:underline">← Go Back</button>
        </div>
      </div>
    );
  }

  const IconComp = content.icon;
  const companySpecificContent = metric && company ? metric.companySpecific(company.name, company.sector, company.desc) : null;

  return (
    <div className="min-h-screen bg-[#111110] text-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Back Button */}
        <button onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/'} className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors mb-8 text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Go Back
        </button>

        {/* Hero Header */}
        <div className="relative mb-12">
          <div className="absolute -top-8 -right-4 opacity-[0.03]">
            <IconComp size={200} />
          </div>
          <div className="relative z-10">
            {company && (
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-4 text-xs font-bold text-[#D4AF37] tracking-wider uppercase">
                <Building2 size={12} /> Customized for {company.name}
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{content.title}</h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl">{content.intro}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">

          {/* The Analogy */}
          <Section icon={Lightbulb} title="The Simple Analogy" accent>
            <p>{content.analogy}</p>
          </Section>

          {/* Company-Specific Section */}
          {companySpecificContent && (
            <Section icon={Building2} title={`What This Means for ${company!.name}`} accent>
              {companySpecificContent.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </Section>
          )}

          {/* Deep Dive */}
          <Section icon={BookOpen} title="The Full Explanation">
            {content.deepDive.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Section>

          {/* Formula */}
          {content.formula && (
            <Section icon={Zap} title="The Formula">
              <pre className="bg-black/40 p-4 md:p-6 rounded-xl font-mono text-sm text-[#D4AF37] whitespace-pre-wrap border border-[#D4AF37]/10 overflow-x-auto">
                {content.formula}
              </pre>
            </Section>
          )}

          {/* Good vs Bad */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2"><CheckCircle size={18} /> Healthy Signs</h3>
              <p className="text-white/80 text-[15px] leading-relaxed">{content.goodBad.good}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2"><AlertTriangle size={18} /> Red Flags</h3>
              <p className="text-white/80 text-[15px] leading-relaxed">{content.goodBad.bad}</p>
            </div>
          </div>

          {/* Indian Market Context */}
          <Section icon={Landmark} title="Indian Market Context">
            <p>{content.indianContext}</p>
          </Section>

          {/* Financial Statement Connection */}
          {metric && (
            <Section icon={Info} title="Where to Find This on Financial Statements">
              <p>{metric.financialStatementLink}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/learn/profit-loss" className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
                  <Receipt size={12} /> Learn: Profit & Loss
                </Link>
                <Link href="/learn/balance-sheet" className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
                  <Landmark size={12} /> Learn: Balance Sheet
                </Link>
                <Link href="/learn/cash-flow" className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg px-3 py-1.5 text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
                  <Banknote size={12} /> Learn: Cash Flow
                </Link>
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-white/30">Piedmont Terminal · Financial Education · Not Financial Advice</p>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111110] text-white flex items-center justify-center"><div className="text-[#D4AF37] text-xl">Loading...</div></div>}>
      <LearnPageInner />
    </Suspense>
  );
}
