export interface HistoricalEpoch {
  id: string;
  name: string;
  date: string;
  headline: string;
  regimeType: 'crisis' | 'bubble' | 'policy_shock' | 'political_event' | 'baseline';
  summary: string;
  indices: {
    nifty50: { level: number; pe: number; pb: number; divYield: number; change1D: number; change1M: number };
    sensex: { level: number; pe: number; pb: number; change1D: number; change1M: number };
    bankNifty: { level: number; pe: number; pb: number; change1D: number; change1M: number };
  };
  macro: {
    rbiRepo: string;
    reverseRepo: string;
    cpi: string;
    wpi: string;
    pmi: string;
    iip: string;
    gdpGrowth: string;
    forexReserves: string;
    gsecYield10Y: string;
    usdInr: string;
    crudeOil: string;
  };
  analysis: {
    catalysts: string[];
    transmissionMechanism: string[];
    winningSectors: { name: string; performance: string; rationale: string }[];
    losingSectors: { name: string; performance: string; rationale: string }[];
    institutionalLessons: string[];
    recoveryTimeline: string;
  };
  notableStocks: {
    symbol: string;
    name: string;
    price: string;
    change: string;
    pe: string;
    note: string;
  }[];
}

export const HISTORICAL_EPOCHS: HistoricalEpoch[] = [
  {
    id: 'dot-com-2000',
    name: 'Dot-Com Tech Mania & Bust',
    date: 'March 10, 2000',
    headline: 'Nifty IT reaches peak euphoria before 80% collapse in speculative software listings',
    regimeType: 'bubble',
    summary: 'The millennium tech mania saw Indian IT majors and speculative small-caps trade at astronomical valuation multiples above 100x P/E, completely decoupled from cash flow fundamentals. When the Nasdaq bubble burst, global tech capital retreated, triggering a severe multi-year tech winter.',
    indices: {
      nifty50: { level: 1658, pe: 28.5, pb: 4.8, divYield: 0.9, change1D: -1.2, change1M: -6.4 },
      sensex: { level: 5001, pe: 29.1, pb: 5.1, change1D: -1.4, change1M: -7.1 },
      bankNifty: { level: 1120, pe: 14.2, pb: 1.8, change1D: -0.5, change1M: -2.3 },
    },
    macro: {
      rbiRepo: '8.00% (Bank Rate)',
      reverseRepo: '6.00%',
      cpi: '3.80%',
      wpi: '6.45%',
      pmi: '51.2',
      iip: '6.5%',
      gdpGrowth: '4.0%',
      forexReserves: '$38.0B',
      gsecYield10Y: '10.85%',
      usdInr: '43.60',
      crudeOil: '$31.50',
    },
    analysis: {
      catalysts: [
        'Massive global speculative flows into any company with .com or software branding.',
        'US Federal Reserve monetary tightening cycle raising rates to cool over-investment.',
        'Extreme valuation divergence where loss-making tech companies surpassed old-economy market caps.'
      ],
      transmissionMechanism: [
        'Nasdaq top-out in March 2000 triggered immediate institutional selling in Indian technology ADRs (Infosys, Satyam).',
        'Venture and institutional liquidity dried up, halting enterprise IT spend contracts in the US.',
        'Earnings downgrades sparked multiple compression from 100x P/E down to sub-20x.'
      ],
      winningSectors: [
        { name: 'Old Economy & FMCG', performance: '+8.4%', rationale: 'Investors rotated into defensive cash-generating consumer staples like HUL and ITC.' },
        { name: 'Pharmaceuticals', performance: '+5.2%', rationale: 'Generic export players like Cipla and Ranbaxy provided non-cyclical defensive earnings.' }
      ],
      losingSectors: [
        { name: 'Information Technology', performance: '-78.5%', rationale: 'Severe multiple contraction across software services and speculative dot-com startups.' },
        { name: 'Media & Telecom', performance: '-64.0%', rationale: 'Convergence plays collapsed as advertising budgets and capital expenditure dried up.' }
      ],
      institutionalLessons: [
        'Never confuse top-line narrative growth with sustainable free cash flow generation.',
        'Extreme valuation multiples require flawless execution; any revenue deceleration triggers exponential price drawdowns.',
        'Sovereign bond yields at 10.85% provided a high hurdle rate that speculative equities failed to clear.'
      ],
      recoveryTimeline: '3.5 years for Nifty 50 to reclaim its 2000 high; 6+ years for pure tech multiples to normalize.'
    },
    notableStocks: [
      { symbol: 'INFY', name: 'Infosys Technologies', price: '₹9,800', change: '-5.2%', pe: '115.0x', note: 'Trading at triple-digit multiple despite pristine balance sheet.' },
      { symbol: 'WIPRO', name: 'Wipro Limited', price: '₹2,450', change: '-6.8%', pe: '140.0x', note: 'Extreme valuation multiple made founder Azim Premji briefly one of the worlds richest men.' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: '₹265', change: '+1.4%', pe: '32.0x', note: 'Served as an institutional safe haven during the tech rout.' },
      { symbol: 'SBIN', name: 'State Bank of India', price: '₹195', change: '-0.8%', pe: '7.8x', note: 'Ignored by retail during tech frenzy; traded at deep single-digit P/E.' }
    ]
  },
  {
    id: 'gfc-2008',
    name: 'Global Financial Crisis & Lehman Collapse',
    date: 'October 24, 2008',
    headline: 'Sensex plunges under 8,500 as global credit freezes and FIIs dump Indian equities',
    regimeType: 'crisis',
    summary: 'Following the bankruptcy of Lehman Brothers in September 2008, a systemic dollar shortage seized global interbank lending. Foreign Institutional Investors (FIIs) repatriated over ₹50,000 Crore from Indian equities, causing a 60% peak-to-trough collapse in Nifty 50 and severe liquidity tightness in domestic real estate and NBFCs.',
    indices: {
      nifty50: { level: 2584, pe: 10.5, pb: 1.9, divYield: 2.4, change1D: -7.2, change1M: -32.8 },
      sensex: { level: 8701, pe: 10.8, pb: 2.1, change1D: -8.1, change1M: -34.5 },
      bankNifty: { level: 4180, pe: 7.2, pb: 1.1, change1D: -9.8, change1M: -41.2 },
    },
    macro: {
      rbiRepo: '7.50% (Emergency Cut from 9.0%)',
      reverseRepo: '6.00%',
      cpi: '10.45%',
      wpi: '11.06%',
      pmi: '44.8',
      iip: '1.2%',
      gdpGrowth: '3.1%',
      forexReserves: '$252.0B',
      gsecYield10Y: '7.55%',
      usdInr: '49.85',
      crudeOil: '$64.50',
    },
    analysis: {
      catalysts: [
        'Insolvency of Lehman Brothers triggered immediate counterparty freeze in US/European credit markets.',
        'Global hedge funds faced redemption cascades, forcing liquidation of liquid emerging market assets (India, Brazil).',
        'Double-digit domestic inflation (WPI 11%) initially restricted the RBIs ability to aggressively ease rates.'
      ],
      transmissionMechanism: [
        'FII dollar outflows placed massive downward pressure on INR, forcing RBI to defend the currency by burning forex reserves.',
        'Indian corporate external commercial borrowings (ECB) froze overnight, leaving leveraged infrastructure firms in liquidity stress.',
        'Mutual funds faced runs on liquid debt funds as NBFC paper encountered liquidity deficits.'
      ],
      winningSectors: [
        { name: 'Fast Moving Consumer Goods', performance: '-14.2%', rationale: 'Relatively preserved capital due to inelastic demand for essential staples.' },
        { name: 'Information Technology', performance: '-22.0%', rationale: 'Rupee depreciation from 40 to 50 provided currency cushion against US demand drop.' }
      ],
      losingSectors: [
        { name: 'Real Estate & Infrastructure', performance: '-84.5%', rationale: 'Massive leverage, freeze in commercial paper markets, and halt in land purchases.' },
        { name: 'Banking & Financial Services', performance: '-62.0%', rationale: 'Severe asset-liability mismatch fears and sharp mark-to-market bond portfolio hits.' }
      ],
      institutionalLessons: [
        'P/E ratios below 11x on Nifty 50 marked the buying opportunity of a generation.',
        'Balance sheet leverage kills companies during liquidity freezes regardless of asset value.',
        'Central bank liquidity backstops (CRR cuts, special repo windows) mark the true capitulation bottom.'
      ],
      recoveryTimeline: '18 months for Nifty to double from 2,584 to 5,200 by mid-2010.'
    },
    notableStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹1,050', change: '-8.5%', pe: '11.2x', note: 'Down 60% from peak despite massive cash generation from refining.' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '₹320', change: '-12.4%', pe: '6.8x', note: 'Subjected to intense liquidity panic and retail branch rumors; survived and rebounded 5x.' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹220', change: '-4.1%', pe: '10.1x', note: 'Traded at decade-low valuation; operating margins remained above 24%.' },
      { symbol: 'LT', name: 'Larsen & Toubro', price: '₹680', change: '-9.2%', pe: '12.0x', note: 'Severe hit on order book execution concerns before infrastructure rebound.' }
    ]
  },
  {
    id: 'demonetization-2016',
    name: 'Demonetization Policy Shock',
    date: 'November 9, 2016',
    headline: 'Prime Minister invalidates ₹500 and ₹1,000 banknotes; cash-dependent sectors freeze',
    regimeType: 'policy_shock',
    summary: 'On the evening of November 8, 2016, the Government of India demonetized 86% of the nations currency in circulation to combat counterfeit money and unaccounted cash. The immediate cash crunch halted rural commerce, unorganized retail, real estate transactions, and consumer discretionary spending.',
    indices: {
      nifty50: { level: 8200, pe: 21.4, pb: 3.1, divYield: 1.4, change1D: -1.3, change1M: -5.8 },
      sensex: { level: 26500, pe: 21.8, pb: 3.2, change1D: -1.2, change1M: -5.5 },
      bankNifty: { level: 18800, pe: 18.5, pb: 2.2, change1D: +0.2, change1M: -4.1 },
    },
    macro: {
      rbiRepo: '6.25%',
      reverseRepo: '5.75%',
      cpi: '3.63%',
      wpi: '3.15%',
      pmi: '52.3 (dropped to 49.6 in Dec)',
      iip: '2.8%',
      gdpGrowth: '7.1%',
      forexReserves: '$365.0B',
      gsecYield10Y: '6.52% (dropped from 6.85%)',
      usdInr: '66.85',
      crudeOil: '$46.20',
    },
    analysis: {
      catalysts: [
        'Sudden invalidation of high-denomination currency notes constituting 86% of cash supply.',
        'Severe transaction friction as banks focused exclusively on currency exchange over 50 days.',
        'Concurrent uncertainty from Donald Trumps election victory in the United States.'
      ],
      transmissionMechanism: [
        'Rural agricultural and wholesale supply chains halted due to lack of physical currency.',
        'Trillions in physical cash deposited into the banking system, causing CASA ratios and bank liquidity to surge.',
        'Sovereign bond yields plunged 35 bps as banks were forced to park surplus deposits in government securities.'
      ],
      winningSectors: [
        { name: 'Banking Sector (Temporary)', performance: '+2.5%', rationale: 'Massive deposit inflows lowered cost of funds; CASA ratios expanded rapidly.' },
        { name: 'Digital Payments & Formalization', performance: '+15.0%', rationale: 'Beginning of the UPI and digital wallet revolution; organized retail took market share.' }
      ],
      losingSectors: [
        { name: 'Real Estate & Construction', performance: '-18.5%', rationale: 'High historical reliance on cash transactions caused immediate transaction volume freeze.' },
        { name: 'Jewellery & Consumer Discretionary', performance: '-14.0%', rationale: 'Footfalls collapsed as consumer discretionary purchases were postponed.' }
      ],
      institutionalLessons: [
        'Cash shocks create sharp transient demand contraction but catalyze long-term formalization of the economy.',
        'Sovereign bond yields plunge when central banks or systemic policies force artificial banking liquidity.',
        'Organized market leaders (Titan, Asian Paints) emerged stronger by capturing unorganized market share.'
      ],
      recoveryTimeline: '3 months for domestic consumption to re-monetize; Nifty broke to fresh all-time highs by March 2017.'
    },
    notableStocks: [
      { symbol: 'TITAN', name: 'Titan Company', price: '₹315', change: '-8.5%', pe: '38.0x', note: 'Immediate slump on jewellery cash buying halt; later gained massive organized share.' },
      { symbol: 'SBIN', name: 'State Bank of India', price: '₹260', change: '+3.1%', pe: '11.5x', note: 'Received tens of thousands of crores in low-cost savings deposits.' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: '₹840', change: '-9.4%', pe: '26.0x', note: 'Short-term consumer durable financing dip; proved to be an elite multi-bagger entry.' },
      { symbol: 'ASIANPAINT', name: 'Asian Paints', price: '₹920', change: '-7.2%', pe: '42.0x', note: 'Home renovation delays hurt Q3 volumes before swift V-shaped recovery.' }
    ]
  },
  {
    id: 'covid-crash-2020',
    name: 'COVID-19 Global Pandemic Circuit Breaker',
    date: 'March 23, 2020',
    headline: '10% lower circuit halted trading; Nifty crashes to 7,511 on nationwide lockdown panic',
    regimeType: 'crisis',
    summary: 'The escalation of COVID-19 to a global pandemic and the announcement of a complete nationwide lockdown triggered systemic liquidation across global financial markets. India VIX spiked to 83.6, crude oil crashed below $25, and foreign investors dumped over ₹65,000 Crore in equities in a single month.',
    indices: {
      nifty50: { level: 7610, pe: 14.2, pb: 1.9, divYield: 2.1, change1D: -12.98, change1M: -35.2 },
      sensex: { level: 25981, pe: 14.8, pb: 2.0, change1D: -13.15, change1M: -36.1 },
      bankNifty: { level: 16917, pe: 9.8, pb: 1.2, change1D: -16.20, change1M: -45.0 },
    },
    macro: {
      rbiRepo: '4.40% (Emergency 75 bps cut)',
      reverseRepo: '4.00% (later cut to 3.35%)',
      cpi: '5.91%',
      wpi: '0.42%',
      pmi: '51.8 (collapsed to 27.4 in April)',
      iip: '-18.7%',
      gdpGrowth: '-23.9% (Q1 FY21)',
      forexReserves: '$470.0B',
      gsecYield10Y: '6.20%',
      usdInr: '76.30',
      crudeOil: '$24.80',
    },
    analysis: {
      catalysts: [
        'Systemic risk of novel coronavirus forcing global economic shutdown and travel bans.',
        'Prime Minister announced total 21-day nationwide lockdown on March 24, 2020.',
        'Crude oil price war between Saudi Arabia and Russia triggering liquidation in commodities.'
      ],
      transmissionMechanism: [
        'Global hedge funds executed cross-asset risk-parity selloffs; gold, bonds, and equities sold together for USD cash.',
        'Fears of massive corporate bankruptcies in aviation, hotels, retail, and unhedged NBFCs.',
        'RBI initiated historic emergency monetary intervention: 75 bps repo cut, Targeted Long-Term Repo Operations (TLTRO), and debt moratorium.'
      ],
      winningSectors: [
        { name: 'Pharmaceuticals & Healthcare', performance: '+28.0% (over next 6M)', rationale: 'Unprecedented demand for active pharmaceutical ingredients (APIs), vaccines, and hospital care.' },
        { name: 'IT Services & Digital Transformation', performance: '+45.0% (over next 6M)', rationale: 'Global enterprise scramble for cloud infrastructure and work-from-home software enablement.' }
      ],
      losingSectors: [
        { name: 'Aviation & Hospitality', performance: '-65.0%', rationale: 'Total ground stop of domestic and international flights; zero revenue for quarter.' },
        { name: 'Banking & Financials', performance: '-48.0%', rationale: 'Expectations of 15%+ Non-Performing Assets (NPAs) due to nationwide moratorium.' }
      ],
      institutionalLessons: [
        'VIX above 80 and widespread lower circuits signal generational capitulation troughs.',
        'When central banks inject unlimited liquidity (Federal Reserve QE infinity + RBI TLTRO), asset prices re-inflate rapidly.',
        'Companies with zero debt and essential business models survive and compound post-crisis.'
      ],
      recoveryTimeline: '7 months to reclaim pre-COVID highs (12,400); 18 months to achieve 18,600.'
    },
    notableStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹875', change: '-12.5%', pe: '12.8x', note: 'Bottomed on March 23 before announcing ₹1.5L Cr rights issue and tech stake sales.' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹1,630', change: '-6.2%', pe: '17.4x', note: 'Showcased pristine balance sheet and cash flows; kickstarted tech supercycle.' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹760', change: '-14.0%', pe: '15.2x', note: 'Rarely trades below 2.5x book value; represented once-in-a-decade valuation window.' },
      { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: '₹340', change: '+2.1%', pe: '18.0x', note: 'Defensive outperformance as healthcare took center stage.' }
    ]
  },
  {
    id: 'retail-boom-2021',
    name: 'Post-Pandemic Retail Boom & Tech IPO Mania',
    date: 'October 18, 2021',
    headline: 'Nifty reaches historic 18,604 milestone fueled by retail demat surge and zero-rate liquidity',
    regimeType: 'bubble',
    summary: 'A combination of record-low interest rates (RBI Repo 4.00%), aggressive global quantitative easing, and millions of new first-time retail demat accounts propelled Indian equities into an unprecedented bull market. Unprofitable consumer internet platforms listed at 20x-40x price-to-sales multiples.',
    indices: {
      nifty50: { level: 18604, pe: 26.8, pb: 4.4, divYield: 1.1, change1D: +0.8, change1M: +5.2 },
      sensex: { level: 61765, pe: 28.0, pb: 4.6, change1D: +0.7, change1M: +5.4 },
      bankNifty: { level: 39684, pe: 22.4, pb: 2.8, change1D: +1.4, change1M: +8.2 },
    },
    macro: {
      rbiRepo: '4.00% (All-time low)',
      reverseRepo: '3.35%',
      cpi: '4.48%',
      wpi: '12.87%',
      pmi: '55.9',
      iip: '3.1%',
      gdpGrowth: '8.4%',
      forexReserves: '$641.0B',
      gsecYield10Y: '6.37%',
      usdInr: '75.10',
      crudeOil: '$84.50',
    },
    analysis: {
      catalysts: [
        'Global central bank zero-interest rate policies and trillions in stimulus expanding liquidity.',
        'Explosion in retail demat accounts (surpassing 70 million), driving massive domestic SIP inflows.',
        'FOMO-driven subscription frenzies in new-age technology IPOs (Zomato, Nykaa, Policybazaar, Paytm).'
      ],
      transmissionMechanism: [
        'DII systematic investment plans (SIPs) surpassed ₹10,000 Crore/month, creating an institutional bid that absorbed FII profit-taking.',
        'Corporates executed balance sheet deleveraging, taking advantage of equity bull market to raise primary capital.',
        'Commodity and input inflation (WPI 12.87%) began quietly eroding manufacturing gross margins.'
      ],
      winningSectors: [
        { name: 'Specialty Chemicals & Metals', performance: '+95.0%', rationale: 'China+1 narrative combined with multi-year commodity upcycle.' },
        { name: 'Information Technology', performance: '+68.0%', rationale: 'Massive enterprise cloud migration contracts led to double-digit revenue growth.' }
      ],
      losingSectors: [
        { name: 'Automobiles', performance: '-4.2%', rationale: 'Global semiconductor chip shortage throttled vehicle assembly lines despite high waiting lists.' },
        { name: 'FMCG', performance: '+6.1% (severe lag)', rationale: 'Raw material inflation (palm oil, packaging) compressed gross margins by 200-400 bps.' }
      ],
      institutionalLessons: [
        'When unprofitable IPOs trade on adjusted EBITDA and future gross merchandise value (GMV), the liquidity regime is near its peak.',
        'Record low interest rates distort discount rates, making distant cash flows appear artificially valuable.',
        'Watch the divergence between WPI (12.87%) and CPI (4.48%); corporate gross margins inevitably suffer.'
      ],
      recoveryTimeline: 'Nifty consolidated for 18 months in a sideways range (15,200 - 18,500) before resuming secular advance.'
    },
    notableStocks: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: '₹140', change: '+3.8%', pe: '4.8x', note: 'Generated record cash flows; used proceeds to pay down billions in European debt.' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: '₹7,800', change: '+1.8%', pe: '85.0x', note: 'Achieved peak valuation multiple as consumer credit appetite fully normalized.' },
      { symbol: 'INFY', name: 'Infosys', price: '₹1,780', change: '+1.2%', pe: '34.0x', note: 'Traded at decade-high valuation multiple with attrition peaking at 27%.' },
      { symbol: 'ITC', name: 'ITC Limited', price: '₹240', change: '-0.5%', pe: '17.0x', note: 'Out of favor during high-growth rally; later became the ultimate defensive compounder.' }
    ]
  },
  {
    id: 'election-shock-2024',
    name: 'Lok Sabha Election Volatility Crash',
    date: 'June 4, 2024',
    headline: 'Nifty crashes 5.93% intraday on surprise election coalition results; PSU index plunges 16%',
    regimeType: 'political_event',
    summary: 'Following exit polls predicting an overwhelming 370+ seat majority for the ruling coalition, actual vote counting on June 4 revealed a narrow verdict requiring coalition support. Shocked institutional and retail investors liquidated leveraged positions, causing the sharpest single-day crash in four years before a historic V-shaped recovery within 72 hours.',
    indices: {
      nifty50: { level: 21884, pe: 21.2, pb: 3.7, divYield: 1.3, change1D: -5.93, change1M: -2.4 },
      sensex: { level: 72079, pe: 21.8, pb: 3.8, change1D: -5.74, change1M: -2.1 },
      bankNifty: { level: 46928, pe: 14.8, pb: 2.3, change1D: -7.95, change1M: -4.8 },
    },
    macro: {
      rbiRepo: '6.50%',
      reverseRepo: '3.35%',
      cpi: '4.75%',
      wpi: '2.61%',
      pmi: '58.3',
      iip: '5.0%',
      gdpGrowth: '7.8%',
      forexReserves: '$651.5B',
      gsecYield10Y: '7.04%',
      usdInr: '83.52',
      crudeOil: '$77.20',
    },
    analysis: {
      catalysts: [
        'Exit polls had heavily priced in an unassailable single-party majority.',
        'Actual election results showed the ruling BJP winning 240 seats, necessitating coalition allies (TDP, JDU).',
        'Fears that coalition politics would slow infrastructure capex and public sector privatization.'
      ],
      transmissionMechanism: [
        'High-beta PSU stocks, defence companies, and capital goods that ran up 200%+ experienced massive retail margin calls.',
        'Foreign portfolio investors dumped ₹12,436 Crore in cash equity during the day.',
        'Domestic Institutional Investors (DIIs) stepped in with counter-cyclical buying of ₹21,118 Crore, halting the panic.'
      ],
      winningSectors: [
        { name: 'Fast Moving Consumer Goods', performance: '+1.5%', rationale: 'Expectations that a coalition government would tilt budget allocations toward rural consumption.' },
        { name: 'Information Technology', performance: '-1.8% (outperformed)', rationale: 'Defensive dollar-earning business models unaffected by domestic political composition.' }
      ],
      losingSectors: [
        { name: 'Public Sector Undertakings (PSU)', performance: '-16.4%', rationale: 'Severe multiple de-rating on fears of policy interference and capex slowdown.' },
        { name: 'Infrastructure & Capital Goods', performance: '-12.8%', rationale: 'Unwinding of high-conviction election capex momentum trades.' }
      ],
      institutionalLessons: [
        'Single-day political flash crashes in fundamentally growing economies present premier liquidity buying windows.',
        'Domestic institutional liquidity (SIPs, insurance funds) now has sufficient depth to absorb even record FII liquidation.',
        'Underlying macroeconomic trajectory (7.8% GDP growth) remains the ultimate anchor of equity prices.'
      ],
      recoveryTimeline: 'Just 3 trading sessions for Nifty to completely erase the 1,300-point drop and hit fresh all-time highs above 23,000.'
    },
    notableStocks: [
      { symbol: 'SBIN', name: 'State Bank of India', price: '₹750', change: '-14.2%', pe: '9.2x', note: 'Massive intraday crash from ₹900; completely recovered within two weeks.' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: '₹2,500', change: '+6.1%', pe: '54.0x', note: 'Prime beneficiary of rotation into defensive rural consumption.' },
      { symbol: 'LT', name: 'Larsen & Toubro', price: '₹3,400', change: '-12.5%', pe: '31.0x', note: 'Order book remained pristine at ₹4.7L Cr despite market political overreaction.' },
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,780', change: '-7.1%', pe: '24.0x', note: 'Absorbed institutional selling before spearheading the V-shaped recovery.' }
    ]
  },
  {
    id: 'modern-baseline-2026',
    name: 'Modern Institutional Benchmark (Present Day)',
    date: 'October 2026',
    headline: 'Nifty 50 at 25,800 with robust corporate balance sheets, low fiscal deficit, and stable policy',
    regimeType: 'baseline',
    summary: 'The modern operating baseline of Piedmont terminal. The Indian economy operates with resilient corporate balance sheets, healthy bank credit growth, strong domestic institutional flows, and record foreign exchange reserves above $721 Billion.',
    indices: {
      nifty50: { level: 25800, pe: 22.8, pb: 3.8, divYield: 1.2, change1D: +0.45, change1M: +1.8 },
      sensex: { level: 84500, pe: 23.2, pb: 3.9, change1D: +0.42, change1M: +1.6 },
      bankNifty: { level: 53200, pe: 15.6, pb: 2.4, change1D: +0.65, change1M: +2.1 },
    },
    macro: {
      rbiRepo: '5.50%',
      reverseRepo: '3.35%',
      cpi: '5.54%',
      wpi: '11.39%',
      pmi: '55.1',
      iip: '8.0%',
      gdpGrowth: '7.2%',
      forexReserves: '$721.0B',
      gsecYield10Y: '6.78%',
      usdInr: '84.15',
      crudeOil: '$74.20',
    },
    analysis: {
      catalysts: [
        'Sustained corporate earnings compounding across banking, automotive, and infrastructure.',
        'High domestic retail participation via mutual fund SIPs exceeding ₹24,000 Crore monthly.',
        'Prudent RBI inflation targeting and steady government capex execution.'
      ],
      transmissionMechanism: [
        'Domestic institutional liquidity acts as a structural stabilizer against global geopolitical shocks.',
        'Bank balance sheets boast decade-low gross NPAs (<3%) driving healthy private sector credit expansion.',
        'Manufacturing expansion supported by domestic consumer demand and export competitiveness.'
      ],
      winningSectors: [
        { name: 'Capital Goods & Power', performance: '+28.5%', rationale: 'Multidecade energy transition and private industrial capex revitalization.' },
        { name: 'Automotive & Mobility', performance: '+22.0%', rationale: 'Strong premiumization trends across utility vehicles and commercial vehicles.' }
      ],
      losingSectors: [
        { name: 'Information Technology', performance: '+4.2% (lagging)', rationale: 'Cautious global enterprise discretionary tech spending.' },
        { name: 'Chemicals & Agrochemicals', performance: '-2.1%', rationale: 'Global inventory destocking pressure and Chinese dumping.' }
      ],
      institutionalLessons: [
        'India has transitioned from an FII-dependent market into an organically funded domestic liquidity powerhouse.',
        'Macro stability (low current account deficit, \$721B reserves) minimizes systemic currency fragility.'
      ],
      recoveryTimeline: 'Operating at active baseline regime.'
    },
    notableStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,847.50', change: '+1.24%', pe: '28.4x', note: 'Market cap ₹19.2L Cr; retail, telecom, and new energy expansion.' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹3,920.00', change: '+0.45%', pe: '29.2x', note: 'Operating margins resilient at 24.5% with strong deal pipeline.' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,680.00', change: '+0.85%', pe: '18.4x', note: 'Post-merger loan-to-deposit ratio normalization progressing ahead of target.' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '₹1,240.00', change: '+1.10%', pe: '17.2x', note: 'Industry-leading ROE at 18.5% with stellar asset quality.' }
    ]
  }
];

export function getEpochById(id: string): HistoricalEpoch | undefined {
  return HISTORICAL_EPOCHS.find(e => e.id === id);
}

export function getModernBaseline(): HistoricalEpoch {
  return HISTORICAL_EPOCHS.find(e => e.id === 'modern-baseline-2026') || HISTORICAL_EPOCHS[HISTORICAL_EPOCHS.length - 1];
}

export function getAllEpochs(): HistoricalEpoch[] {
  return HISTORICAL_EPOCHS;
}
