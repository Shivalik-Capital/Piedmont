// Piedmont Historical Research Engine & Point-in-Time Crisis Chronicle Database
// Reconstructs the exact information set available on pivotal historical dates across 25 years.

export interface CrisisDaySnapshot {
  id: string;
  date: string; // e.g. "September 15, 2008"
  shortDate: string; // e.g. "Sep 15"
  isoDate: string; // "2008-09-15"
  dayTitle: string; // e.g. "Lehman Brothers Files Bankruptcy"
  phase: 'onset' | 'acceleration' | 'peak_panic' | 'capitulation' | 'policy_pivot' | 'recovery';
  indices: {
    nifty50: { level: number; change1D: number; pe: number; pb: number };
    sensex: { level: number; change1D: number; pe: number };
    bankNifty?: { level: number; change1D: number; pe: number };
    vix?: number;
  };
  macro: {
    rbiRepo: string;
    reverseRepo?: string;
    cpi: string;
    wpi: string;
    forex: string;
    tenYearYield: string;
    usdInr: string;
    crudeOil: string;
  };
  tapeHeadlines: string[];
  whatWasKnown: string;
  whatWasUnknown: string; // The Lookahead Trap
  corporateFilingInFocus?: {
    symbol: string;
    name: string;
    filing: string;
    revenue: string;
    netProfit: string;
    note: string;
  };
  institutionalAction: string;
  sentiment: 'Extreme Fear' | 'Fear' | 'Panic Selling' | 'Capitulation' | 'Cautious Bottoming' | 'Relief' | 'Complacency' | 'Euphoria';
}

export interface HistoricalCrisisRegime {
  id: string;
  name: string;
  timeRange: string;
  headline: string;
  regimeType: 'crisis' | 'bubble' | 'policy_shock' | 'political_event';
  summary: string;
  totalDrawdown: string;
  troughDate: string;
  recoveryDuration: string;
  chartPath: { date: string; level: number }[];
  days: CrisisDaySnapshot[];
  winningSectors: { name: string; performance: string; rationale: string }[];
  losingSectors: { name: string; performance: string; rationale: string }[];
  institutionalLessons: string[];
}

export const CRISIS_REGIMES: HistoricalCrisisRegime[] = [
  // ==========================================
  // 1. THE 2008 GLOBAL FINANCIAL CRISIS
  // ==========================================
  {
    id: 'gfc-2008',
    name: '2008 Global Financial Crisis & Credit Freeze',
    timeRange: 'September 2008 – May 2009',
    headline: 'Lehman collapse freezes global dollar liquidity; Sensex crashes 60% from peak to capitulation low',
    regimeType: 'crisis',
    summary: 'Following the bankruptcy of Lehman Brothers in September 2008, interbank trust evaporated across London and New York. Global hedge funds faced massive redemption cascades, forcing wholesale liquidation of liquid Indian equity holdings. Over ₹60,000 Crore of foreign capital fled the Indian market, triggering severe liquidity contractions in real estate, private banking, and domestic commercial paper.',
    totalDrawdown: '-59.9% (Peak 6,357 to Trough 2,524)',
    troughDate: 'October 27, 2008 (Nifty 2,524 intraday / 2,584 close)',
    recoveryDuration: '18 months to re-test pre-crisis highs',
    chartPath: [
      { date: 'Sep 01', level: 4400 },
      { date: 'Sep 15', level: 4038 },
      { date: 'Sep 22', level: 4245 },
      { date: 'Sep 29', level: 3985 },
      { date: 'Oct 06', level: 3602 },
      { date: 'Oct 10', level: 3279 },
      { date: 'Oct 15', level: 3122 },
      { date: 'Oct 20', level: 3145 },
      { date: 'Oct 24', level: 2584 },
      { date: 'Nov 06', level: 3040 },
      { date: 'Nov 20', level: 2690 },
      { date: 'Dec 08', level: 2890 },
      { date: 'Jan 07', level: 2950 },
      { date: 'Feb 17', level: 2770 },
      { date: 'Mar 09', level: 2573 },
      { date: 'Apr 02', level: 3210 },
      { date: 'May 18', level: 4321 }
    ],
    winningSectors: [
      { name: 'FMCG (Consumer Staples)', performance: '-12.4% (vs -60% Nifty)', rationale: 'Inelastic everyday demand for soap, tea, and biscuits; pristine debt-free balance sheets preserved capital.' },
      { name: 'Pharmaceuticals', performance: '-18.2%', rationale: 'Non-cyclical healthcare demand combined with dollar-earning generic export realizations.' }
    ],
    losingSectors: [
      { name: 'Real Estate & Land Developers', performance: '-84.5%', rationale: 'Leveraged land acquisitions backed by frozen commercial paper; complete halt in property buyer financing.' },
      { name: 'Capital Goods & Infrastructure', performance: '-68.0%', rationale: 'Freeze in external commercial borrowings (ECB) and private sector capex cancellations.' }
    ],
    institutionalLessons: [
      'Balance sheet leverage kills companies during global liquidity panics, regardless of accounting operating margin.',
      'Trailing P/E multiples below 11x on Nifty 50 have historically signaled once-in-a-generation long-term accumulation zones.',
      'Central bank liquidity backstops (CRR cuts, special repo windows) precede the equity market capitulation bottom.'
    ],
    days: [
      {
        id: 'gfc-2008-09-15',
        date: 'September 15, 2008',
        shortDate: 'Sep 15, 2008',
        isoDate: '2008-09-15',
        dayTitle: 'Lehman Brothers Files Chapter 11 Bankruptcy',
        phase: 'onset',
        indices: {
          nifty50: { level: 4038, change1D: -3.35, pe: 16.2, pb: 2.9 },
          sensex: { level: 13531, change1D: -3.35, pe: 16.5 },
          bankNifty: { level: 6420, change1D: -5.10, pe: 11.2 },
          vix: 34.5
        },
        macro: {
          rbiRepo: '9.00%',
          cpi: '9.02%',
          wpi: '12.14%',
          forex: '$285.0B',
          tenYearYield: '8.48%',
          usdInr: '45.85',
          crudeOil: '$95.70'
        },
        tapeHeadlines: [
          'Lehman Brothers files largest bankruptcy in US corporate history ($613 Billion in debt).',
          'Bank of America agrees to acquire Merrill Lynch for $50 Billion in emergency rescue.',
          'RBI Governor Subbarao issues statement: "Indian banks have no material exposure to US subprime securities."'
        ],
        whatWasKnown: 'Markets understood Lehman had failed, but believed the damage would be quarantined to Wall Street investment banks. Reliance and Tata Steel were still viewed as secular global expansion stories.',
        whatWasUnknown: 'LOOKAHEAD TRAP: On Sep 15, participants did not foresee that AIG would require an $85B bailout within 24 hours, nor that interbank dollar lending would freeze worldwide for months.',
        corporateFilingInFocus: {
          symbol: 'ICICIBANK',
          name: 'ICICI Bank',
          filing: 'Q1 FY09 (ended Jun 30, 2008)',
          revenue: '₹9,840 Cr',
          netProfit: '₹728 Cr',
          note: 'Stock fell 6.8% on rumors of Lehman bond exposure in its UK subsidiary.'
        },
        institutionalAction: 'Foreign institutions began aggressive unwinding of emerging market ADRs to meet Western parent-firm cash calls.',
        sentiment: 'Fear'
      },
      {
        id: 'gfc-2008-09-29',
        date: 'September 29, 2008',
        shortDate: 'Sep 29, 2008',
        isoDate: '2008-09-29',
        dayTitle: 'US House Rejects $700 Billion TARP Bank Bailout',
        phase: 'acceleration',
        indices: {
          nifty50: { level: 3985, change1D: -4.10, pe: 15.8, pb: 2.8 },
          sensex: { level: 12595, change1D: -3.96, pe: 16.1 },
          bankNifty: { level: 6180, change1D: -6.20, pe: 10.8 },
          vix: 41.2
        },
        macro: {
          rbiRepo: '9.00%',
          cpi: '9.80%',
          wpi: '11.85%',
          forex: '$280.0B',
          tenYearYield: '8.32%',
          usdInr: '46.90',
          crudeOil: '$96.30'
        },
        tapeHeadlines: [
          'US House of Representatives unexpectedly rejects $700B Emergency Economic Stabilization Act (228-205).',
          'Dow Jones suffers largest one-day point drop in history: -777 points (-6.98%).',
          'Indian corporate commercial paper rates spike to 14% as mutual funds face redemption notices.'
        ],
        whatWasKnown: 'The political rejection of TARP signaled that Western governments could not easily orchestrate an orderly credit backstop.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Investors did not know TARP would be revised and passed 4 days later; panic selling dominated global order books.',
        institutionalAction: 'Mutual fund treasuries in Mumbai faced panic corporate withdrawals, prompting RBI to open emergency liquidity windows.',
        sentiment: 'Panic Selling'
      },
      {
        id: 'gfc-2008-10-10',
        date: 'October 10, 2008',
        shortDate: 'Oct 10, 2008',
        isoDate: '2008-10-10',
        dayTitle: '"Black Friday" Global Liquidation; RBI Slashes CRR by 150 bps',
        phase: 'acceleration',
        indices: {
          nifty50: { level: 3279, change1D: -7.95, pe: 13.4, pb: 2.4 },
          sensex: { level: 10527, change1D: -7.07, pe: 13.6 },
          bankNifty: { level: 5320, change1D: -9.80, pe: 9.1 },
          vix: 54.0
        },
        macro: {
          rbiRepo: '9.00%',
          cpi: '10.45%',
          wpi: '11.44%',
          forex: '$275.0B',
          tenYearYield: '8.02%',
          usdInr: '48.20',
          crudeOil: '$77.70'
        },
        tapeHeadlines: [
          'World stock markets suffer worst weekly drop in 75 years; Sensex plunges 1,000+ points intraday.',
          'G7 Finance Ministers hold emergency late-night session in Washington.',
          'RBI announces emergency 150 bps cut in Cash Reserve Ratio (CRR) to 7.50%, injecting ₹60,000 Crore.'
        ],
        whatWasKnown: 'Systemic liquidity was seized. Domestic real estate developers could not roll over short-term bank paper.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Double-digit inflation (WPI 11.4%) led consensus to believe the RBI would NOT cut the 9.00% repo rate. In reality, the repo cut arrived 10 days later.',
        corporateFilingInFocus: {
          symbol: 'RELIANCE',
          name: 'Reliance Industries',
          filing: 'Q1 FY09 Audited',
          revenue: '₹41,024 Cr',
          netProfit: '₹4,110 Cr',
          note: 'Traded down 8.4% despite pristine trailing refining margins of $15.7/bbl.'
        },
        institutionalAction: 'FIIs dumped ₹3,200 Cr in a single session; domestic institutions deployed partial cash reserves into large-cap banks.',
        sentiment: 'Extreme Fear'
      },
      {
        id: 'gfc-2008-10-15',
        date: 'October 15, 2008',
        shortDate: 'Oct 15, 2008',
        isoDate: '2008-10-15',
        dayTitle: 'Peak Interbank Freeze; ICICI Bank Branch Rumors',
        phase: 'peak_panic',
        indices: {
          nifty50: { level: 3122, change1D: -5.80, pe: 12.8, pb: 2.3 },
          sensex: { level: 10581, change1D: -5.70, pe: 13.1 },
          bankNifty: { level: 5120, change1D: -7.40, pe: 8.8 },
          vix: 58.2
        },
        macro: {
          rbiRepo: '9.00%',
          cpi: '10.45%',
          wpi: '11.44%',
          forex: '$274.0B',
          tenYearYield: '7.85%',
          usdInr: '48.65',
          crudeOil: '$78.50'
        },
        tapeHeadlines: [
          'Rumors of liquidity stress at ICICI Bank trigger retail depositor queues in Gujarat and Maharashtra.',
          'RBI Governor issues unprecedented public reassurance: "ICICI Bank is completely solvent with abundant liquidity."',
          'Interbank call money rates touch 18% as banks hoard cash overnight.'
        ],
        whatWasKnown: 'Panic had penetrated retail consciousness. Stock valuations were compressed to 2004 levels.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Q2 FY09 GDP was still unknown. Analysts did not know GDP would slow to 5.8% in Q2 until November 28.',
        institutionalAction: 'FII cumulative monthly selling crossed ₹12,000 Crore; domestic mutual funds demanded emergency RBI liquidity repo windows.',
        sentiment: 'Panic Selling'
      },
      {
        id: 'gfc-2008-10-20',
        date: 'October 20, 2008',
        shortDate: 'Oct 20, 2008',
        isoDate: '2008-10-20',
        dayTitle: 'RBI Emergency 100 bps Repo Cut (9.00% to 8.00%)',
        phase: 'policy_pivot',
        indices: {
          nifty50: { level: 3145, change1D: +2.40, pe: 12.9, pb: 2.3 },
          sensex: { level: 10223, change1D: +2.50, pe: 13.2 },
          bankNifty: { level: 5210, change1D: +3.80, pe: 9.0 },
          vix: 52.0
        },
        macro: {
          rbiRepo: '8.00% (Cut 100 bps)',
          cpi: '10.45%',
          wpi: '11.00%',
          forex: '$272.0B',
          tenYearYield: '7.65%',
          usdInr: '48.95',
          crudeOil: '$74.20'
        },
        tapeHeadlines: [
          'RBI delivers first emergency rate cut in 4 years: Repo slashed 100 bps to 8.00%.',
          'RBI opens ₹25,000 Cr liquidity window for mutual funds to halt commercial paper contagion.',
          'Nifty stages relief rally of 2.4%, but global futures point to continued forced deleveraging.'
        ],
        whatWasKnown: 'The central bank had officially abandoned inflation-fighting in favor of preventing systemic financial seizure.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The market did not know that the absolute capitulation bottom was only 4 trading sessions away on Oct 24.',
        institutionalAction: 'Short-covering in private banks (HDFC Bank, Axis Bank), though foreign sell orders remained heavy on open.',
        sentiment: 'Capitulation'
      },
      {
        id: 'gfc-2008-10-24',
        date: 'October 24, 2008',
        shortDate: 'Oct 24, 2008',
        isoDate: '2008-10-24',
        dayTitle: 'The Capitulation Low: Nifty Hits 2,584; P/E Touches 10.5x',
        phase: 'capitulation',
        indices: {
          nifty50: { level: 2584, change1D: -7.20, pe: 10.5, pb: 1.9 },
          sensex: { level: 8701, change1D: -8.10, pe: 10.8 },
          bankNifty: { level: 4180, change1D: -9.80, pe: 7.2 },
          vix: 68.0
        },
        macro: {
          rbiRepo: '8.00%',
          cpi: '10.45%',
          wpi: '11.06%',
          forex: '$252.0B',
          tenYearYield: '7.55%',
          usdInr: '49.85',
          crudeOil: '$64.50'
        },
        tapeHeadlines: [
          'Sensex falls below 9,000 for first time since June 2006; down 60% in 10 months.',
          'Nifty trailing P/E ratio touches 10.5x, matching historic troughs of 2001 and 2003.',
          'Rupee crosses 50 per USD intraday as foreign outflows peak; crude oil collapses to $64.'
        ],
        whatWasKnown: 'Universal despair. Prominent brokerages predicted Nifty would fall below 2,000. Retail investors cancelled SIPs en masse.',
        whatWasUnknown: 'LOOKAHEAD TRAP: This day represented the absolute valuation bottom of the 2008 crisis. Over the next 18 months, Nifty would surge from 2,584 to 5,200 (+101%).',
        corporateFilingInFocus: {
          symbol: 'TCS',
          name: 'Tata Consultancy Services',
          filing: 'Q2 FY09 Audited (reported Oct 21)',
          revenue: '₹6,950 Cr',
          netProfit: '₹1,270 Cr',
          note: 'Stock traded at ₹220 (P/E 9.8x) despite maintaining 23.8% operating margins.'
        },
        institutionalAction: 'Rare, courageous value managers (e.g. PPFAS, DSP) began aggressive buying of zero-debt compounders.',
        sentiment: 'Capitulation'
      },
      {
        id: 'gfc-2008-11-06',
        date: 'November 6, 2008',
        shortDate: 'Nov 6, 2008',
        isoDate: '2008-11-06',
        dayTitle: 'RBI Slashes Repo to 7.50% & CRR to 5.50%',
        phase: 'policy_pivot',
        indices: {
          nifty50: { level: 3040, change1D: +4.20, pe: 12.1, pb: 2.1 },
          sensex: { level: 10120, change1D: +4.35, pe: 12.4 },
          bankNifty: { level: 5010, change1D: +5.80, pe: 8.5 },
          vix: 48.0
        },
        macro: {
          rbiRepo: '7.50%',
          cpi: '10.20%',
          wpi: '10.72%',
          forex: '$250.0B',
          tenYearYield: '7.38%',
          usdInr: '48.20',
          crudeOil: '$61.20'
        },
        tapeHeadlines: [
          'RBI announces second aggressive liquidity package: Repo cut 50 bps to 7.50%, CRR cut 100 bps to 5.50%.',
          'Barack Obama elected 44th US President, triggering a global optimism bounce.',
          'WPI inflation softens from 11.4% to 10.7%, opening door for sustained rate cuts.'
        ],
        whatWasKnown: 'Aggressive central bank backstops were beginning to normalize commercial lending rates.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The Satyam Computer scandal was brewing undetected and would shock corporate governance 2 months later.',
        institutionalAction: 'FII net selling decelerated from ₹15k Cr/mo to under ₹3k Cr/mo.',
        sentiment: 'Cautious Bottoming'
      },
      {
        id: 'gfc-2009-01-07',
        date: 'January 7, 2009',
        shortDate: 'Jan 7, 2009',
        isoDate: '2009-01-07',
        dayTitle: 'Satyam Computer Fraud Confession: "Riding a Tiger"',
        phase: 'acceleration',
        indices: {
          nifty50: { level: 2950, change1D: -6.15, pe: 11.8, pb: 2.0 },
          sensex: { level: 9586, change1D: -7.25, pe: 12.0 },
          bankNifty: { level: 4820, change1D: -4.80, pe: 8.1 },
          vix: 55.4
        },
        macro: {
          rbiRepo: '5.50% (Aggressively cut Dec 08)',
          cpi: '9.70%',
          wpi: '5.60%',
          forex: '$255.0B',
          tenYearYield: '5.85%',
          usdInr: '48.90',
          crudeOil: '$42.50'
        },
        tapeHeadlines: [
          'Satyam Chairman B. Ramalinga Raju admits to ₹7,136 Crore accounting fraud: "It was like riding a tiger, not knowing how to get off without being eaten."',
          'Satyam stock collapses 78% in a single session; IT index crashes 20%.',
          'PwC audited balance sheets across corporate India come under intense institutional scrutiny.'
        ],
        whatWasKnown: 'Corporate governance panic renewed. International investors questioned veracity of all Indian financial statements.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Satyam would be successfully auctioned to Tech Mahindra within 90 days, preserving 40,000 jobs and client contracts.',
        institutionalAction: 'Flight to quality: capital rotated out of mid-cap tech into Tata Group and HDFC Group blue-chips.',
        sentiment: 'Extreme Fear'
      },
      {
        id: 'gfc-2009-03-09',
        date: 'March 9, 2009',
        shortDate: 'Mar 9, 2009',
        isoDate: '2009-03-09',
        dayTitle: 'Global Capitulation Low: S&P 500 at 666; Nifty Double Bottom',
        phase: 'capitulation',
        indices: {
          nifty50: { level: 2573, change1D: -2.10, pe: 10.4, pb: 1.8 },
          sensex: { level: 8160, change1D: -2.30, pe: 10.6 },
          bankNifty: { level: 3950, change1D: -3.20, pe: 6.9 },
          vix: 52.0
        },
        macro: {
          rbiRepo: '5.00%',
          cpi: '8.03%',
          wpi: '1.20%',
          forex: '$249.0B',
          tenYearYield: '6.45%',
          usdInr: '51.80',
          crudeOil: '$44.10'
        },
        tapeHeadlines: [
          'S&P 500 touches historic "devil\'s trough" of 666; down 57% from 2007 highs.',
          'Nifty 50 successfully re-tests October lows (2,573) and forms textbook double bottom.',
          'WPI inflation collapses to 1.20%; RBI repo rate reduced to 5.00%.'
        ],
        whatWasKnown: 'Global media proclaimed the death of free-market capitalism and predicted a decade-long depression.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The global liquidity pump was about to trigger the greatest synchronized bull market of the modern era.',
        institutionalAction: 'Foreign capital flight halted; domestic mutual funds recorded highest net equity purchases of the fiscal year.',
        sentiment: 'Capitulation'
      },
      {
        id: 'gfc-2009-05-18',
        date: 'May 18, 2009',
        shortDate: 'May 18, 2009',
        isoDate: '2009-05-18',
        dayTitle: 'Election Landslide: Twin Upper Circuits (+20% in 30 Seconds)',
        phase: 'recovery',
        indices: {
          nifty50: { level: 4321, change1D: +17.74, pe: 17.5, pb: 3.1 },
          sensex: { level: 14284, change1D: +17.34, pe: 17.8 },
          bankNifty: { level: 7120, change1D: +22.40, pe: 12.4 },
          vix: 28.0
        },
        macro: {
          rbiRepo: '4.75%',
          cpi: '8.65%',
          wpi: '0.61%',
          forex: '$258.0B',
          tenYearYield: '6.30%',
          usdInr: '47.90',
          crudeOil: '$58.20'
        },
        tapeHeadlines: [
          'UPA coalition wins decisive stable mandate (262 seats); trading halted within 30 seconds of market open.',
          'Second upper circuit triggered at 11:55 AM; trading suspended for entire day for first time in NSE history.',
          'Sensex gains 2,110 points (+17.34%) in one session; FIIs pour in ₹2,500 Cr in single afternoon.'
        ],
        whatWasKnown: 'Political stability unlocked immediate institutional risk appetite. Sovereign CDS spreads collapsed.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Bears who remained in cash waiting for sub-2,000 Nifty levels missed a 70% rally in under 60 days.',
        institutionalAction: 'Massive global short squeeze; institutional funds forced to chase benchmark weights at any price.',
        sentiment: 'Euphoria'
      }
    ]
  },

  // ==========================================
  // 2. THE 2020 COVID-19 CRASH & RECOVERY
  // ==========================================
  {
    id: 'covid-2020',
    name: '2020 COVID-19 Circuit Breaker & Pandemic Crash',
    timeRange: 'January 2020 – October 2020',
    headline: '10% lower circuit triggered as 21-day complete lockdown halts economy; Nifty drops to 7,511 before historic liquidity boom',
    regimeType: 'crisis',
    summary: 'The rapid escalation of novel coronavirus from a localized Wuhan outbreak into a global pandemic triggered unprecedented asset liquidation. On March 23, 2020, India announced a 21-day complete nationwide lockdown. Nifty hit its 10% lower circuit within 15 minutes of open, crude oil plunged under $25, and India VIX spiked to 83.6. However, historic emergency interventions by the RBI (repo cut to 4.00%, loan moratorium, TLTRO) ignited the fastest recovery in stock market history.',
    totalDrawdown: '-39.6% (Peak 12,430 to Trough 7,511)',
    troughDate: 'March 23, 2020 (Nifty 7,511 intraday low)',
    recoveryDuration: '7 months to fully reclaim all-time highs',
    chartPath: [
      { date: 'Jan 20', level: 12224 },
      { date: 'Feb 19', level: 12125 },
      { date: 'Feb 24', level: 11829 },
      { date: 'Mar 05', level: 11269 },
      { date: 'Mar 09', level: 10451 },
      { date: 'Mar 12', level: 9590 },
      { date: 'Mar 16', level: 9197 },
      { date: 'Mar 23', level: 7610 },
      { date: 'Mar 27', level: 8660 },
      { date: 'Apr 09', level: 9111 },
      { date: 'Apr 22', level: 9187 },
      { date: 'May 12', level: 9196 },
      { date: 'May 22', level: 9039 },
      { date: 'Jun 15', level: 9813 },
      { date: 'Aug 10', level: 11270 },
      { date: 'Oct 19', level: 12000 }
    ],
    winningSectors: [
      { name: 'Pharmaceuticals & Active Ingredients', performance: '+58.0% over 6 months', rationale: 'Global scramble for hydroxychloroquine, paracetamol, and antibiotic supply security.' },
      { name: 'Information Technology & Cloud', performance: '+64.0% over 6 months', rationale: 'Mandatory work-from-home accelerated multi-year enterprise digital and cloud migrations into quarters.' }
    ],
    losingSectors: [
      { name: 'Aviation, Multiplexes & Hotels', performance: '-62.0%', rationale: 'Total domestic and international flight ground-stop; zero ticket and hospitality revenue for months.' },
      { name: 'Banking & Financial Services', performance: '-48.0%', rationale: 'Panic fears that nationwide moratorium would result in 15%+ Non-Performing Assets (NPAs).' }
    ],
    institutionalLessons: [
      'VIX above 80 accompanied by trading halts marks peak panic and capitulation troughs.',
      'Unprecedented monetary stimulus (Fed unlimited QE + RBI TLTROs) reflates financial assets far faster than real economic activity.',
      'Companies with zero debt and essential business models survive and compound post-crisis.'
    ],
    days: [
      {
        id: 'covid-2020-01-30',
        date: 'January 30, 2020',
        shortDate: 'Jan 30, 2020',
        isoDate: '2020-01-30',
        dayTitle: 'WHO Declares Global Health Emergency; 1st Case in Kerala',
        phase: 'onset',
        indices: {
          nifty50: { level: 12035, change1D: -0.75, pe: 28.1, pb: 3.3 },
          sensex: { level: 40913, change1D: -0.70, pe: 28.4 },
          bankNifty: { level: 30820, change1D: -0.90, pe: 18.2 },
          vix: 17.2
        },
        macro: {
          rbiRepo: '5.15%',
          cpi: '7.59%',
          wpi: '3.10%',
          forex: '$466.0B',
          tenYearYield: '6.55%',
          usdInr: '71.50',
          crudeOil: '$58.20'
        },
        tapeHeadlines: [
          'World Health Organization declares coronavirus outbreak a Public Health Emergency of International Concern (PHEIC).',
          'First confirmed COVID-19 case in India detected in Thrissur, Kerala (student returned from Wuhan University).',
          'Equity markets consolidate near all-time highs; market consensus considers it a localized China supply issue.'
        ],
        whatWasKnown: 'Market consensus believed the outbreak was geographically quarantined to Hubei province.',
        whatWasUnknown: 'LOOKAHEAD TRAP: No analyst foresaw that 6 weeks later, global air travel would completely cease.',
        institutionalAction: 'Routine portfolio rebalancing; domestic retail SIP inflows steady at ₹8,500 Cr/month.',
        sentiment: 'Complacency'
      },
      {
        id: 'covid-2020-03-05',
        date: 'March 5, 2020',
        shortDate: 'Mar 5, 2020',
        isoDate: '2020-03-05',
        dayTitle: 'Yes Bank Moratorium Imposed by RBI',
        phase: 'acceleration',
        indices: {
          nifty50: { level: 11269, change1D: -2.25, pe: 25.1, pb: 2.9 },
          sensex: { level: 38470, change1D: -2.30, pe: 25.4 },
          bankNifty: { level: 28815, change1D: -4.10, pe: 16.2 },
          vix: 25.8
        },
        macro: {
          rbiRepo: '5.15%',
          cpi: '6.58%',
          wpi: '2.26%',
          forex: '$476.0B',
          tenYearYield: '6.22%',
          usdInr: '73.30',
          crudeOil: '$46.80'
        },
        tapeHeadlines: [
          'RBI places Yes Bank under 30-day moratorium; caps depositor withdrawals at ₹50,000.',
          'SBI-led institutional consortium steps in to rescue Yes Bank with ₹10,000 Cr equity infusion.',
          'Global coronavirus cases cross 100,000 as Italian death toll accelerates.'
        ],
        whatWasKnown: 'Domestic private banking vulnerabilities compounded global viral spread concerns.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Investors did not realize that nationwide lockdown was only 18 days away.',
        institutionalAction: 'FIIs escalated selling in Indian private banks; cash allocations raised to 15%.',
        sentiment: 'Fear'
      },
      {
        id: 'covid-2020-03-09',
        date: 'March 9, 2020',
        shortDate: 'Mar 9, 2020',
        isoDate: '2020-03-09',
        dayTitle: '"Black Monday I": Saudi-Russia Oil Price War',
        phase: 'acceleration',
        indices: {
          nifty50: { level: 10451, change1D: -4.90, pe: 23.2, pb: 2.6 },
          sensex: { level: 35634, change1D: -5.10, pe: 23.5 },
          bankNifty: { level: 26460, change1D: -5.80, pe: 14.8 },
          vix: 38.0
        },
        macro: {
          rbiRepo: '5.15%',
          cpi: '6.58%',
          wpi: '2.26%',
          forex: '$481.0B',
          tenYearYield: '6.08%',
          usdInr: '74.15',
          crudeOil: '$31.10 (Plunged 25%)'
        },
        tapeHeadlines: [
          'Brent crude plunges 25% to $31/bbl after OPEC+ negotiations collapse between Saudi Arabia and Russia.',
          'US stock markets halt trading for 15 minutes after S&P 500 triggers Level 1 circuit breaker.',
          'Nifty falls 538 points; Reliance Industries drops 12% in its worst single-day loss in a decade.'
        ],
        whatWasKnown: 'A commodity price war erupted simultaneously with an accelerating global pandemic.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The crash was just beginning. Nifty had another 28% to fall before the bottom.',
        corporateFilingInFocus: {
          symbol: 'RELIANCE',
          name: 'Reliance Industries',
          filing: 'Q3 FY20 Audited',
          revenue: '₹1,52,939 Cr',
          netProfit: '₹11,640 Cr',
          note: 'Stock dropped from ₹1,550 to ₹1,114 on fears refining GRMs would collapse.'
        },
        institutionalAction: 'Systematic risk-parity funds initiated massive cross-asset liquidations worldwide.',
        sentiment: 'Panic Selling'
      },
      {
        id: 'covid-2020-03-12',
        date: 'March 12, 2020',
        shortDate: 'Mar 12, 2020',
        isoDate: '2020-03-12',
        dayTitle: '"Black Thursday": WHO Declares Pandemic; Trading Halted on NSE',
        phase: 'peak_panic',
        indices: {
          nifty50: { level: 9590, change1D: -8.30, pe: 20.8, pb: 2.4 },
          sensex: { level: 32778, change1D: -8.18, pe: 21.0 },
          bankNifty: { level: 23970, change1D: -9.40, pe: 13.2 },
          vix: 58.0
        },
        macro: {
          rbiRepo: '5.15%',
          cpi: '6.58%',
          wpi: '2.26%',
          forex: '$487.0B',
          tenYearYield: '6.24%',
          usdInr: '74.40',
          crudeOil: '$33.20'
        },
        tapeHeadlines: [
          'World Health Organization declares COVID-19 a global pandemic; US suspends travel from Europe.',
          'NSE and BSE halt trading for 45 minutes as Nifty plunges over 8% in morning panic.',
          'India suspends all tourist visas; sporting events and public gatherings shut nationwide.'
        ],
        whatWasKnown: 'Global borders were shutting down. Analysts realized consumer mobility would freeze.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Even on Black Thursday, the concept of a total 21-day stay-at-home lockdown was not priced in.',
        institutionalAction: 'Foreign investors sold ₹8,000 Cr in a single day; retail buyers entered on margin.',
        sentiment: 'Extreme Fear'
      },
      {
        id: 'covid-2020-03-23',
        date: 'March 23, 2020',
        shortDate: 'Mar 23, 2020',
        isoDate: '2020-03-23',
        dayTitle: 'The 10% Lower Circuit: Complete Nationwide Lockdown Announced',
        phase: 'capitulation',
        indices: {
          nifty50: { level: 7610, change1D: -12.98, pe: 14.2, pb: 1.9 },
          sensex: { level: 25981, change1D: -13.15, pe: 14.8 },
          bankNifty: { level: 16917, change1D: -16.20, pe: 9.8 },
          vix: 83.6
        },
        macro: {
          rbiRepo: '5.15% (Emergency cut to 4.40% on Mar 27)',
          cpi: '5.91%',
          wpi: '0.42%',
          forex: '$470.0B',
          tenYearYield: '6.20%',
          usdInr: '76.30',
          crudeOil: '$24.80'
        },
        tapeHeadlines: [
          '10% Lower Circuit triggered within 15 minutes of open; trading halted for 45 minutes across all exchanges.',
          'Prime Minister Narendra Modi announces 21-day complete nationwide lockdown: "Jaan hai toh jahaan hai."',
          'India VIX surges to 83.6—highest level since the 2008 Lehman crisis.',
          'Brent crude drops under $25; Bank Nifty plunges 16.2% in single session.'
        ],
        whatWasKnown: 'Total economic standstill. Zero trains, zero flights, zero factory operations for 3 weeks.',
        whatWasUnknown: 'LOOKAHEAD TRAP: This day represented the absolute bottom of the pandemic crash (Nifty 7,511). In 18 months, Nifty would trade above 18,600 (+148%).',
        corporateFilingInFocus: {
          symbol: 'HDFCBANK',
          name: 'HDFC Bank',
          filing: 'Q3 FY20 Audited',
          revenue: '₹38,000 Cr',
          netProfit: '₹7,416 Cr',
          note: 'Stock dropped to ₹760 (P/B 2.2x), marking a once-in-a-decade valuation entry.'
        },
        institutionalAction: 'Generational capitulation selling by foreign funds (₹65,000 Cr in March); domestic mutual funds quietly absorbed supply.',
        sentiment: 'Capitulation'
      },
      {
        id: 'covid-2020-03-27',
        date: 'March 27, 2020',
        shortDate: 'Mar 27, 2020',
        isoDate: '2020-03-27',
        dayTitle: 'RBI Emergency "Bazooka": 75 bps Repo Cut & 3-Month Loan Moratorium',
        phase: 'policy_pivot',
        indices: {
          nifty50: { level: 8660, change1D: +0.25, pe: 16.1, pb: 2.1 },
          sensex: { level: 29815, change1D: -0.40, pe: 16.5 },
          bankNifty: { level: 19965, change1D: +1.80, pe: 11.2 },
          vix: 71.0
        },
        macro: {
          rbiRepo: '4.40% (Cut 75 bps)',
          cpi: '5.91%',
          wpi: '0.42%',
          forex: '$475.0B',
          tenYearYield: '6.15%',
          usdInr: '75.20',
          crudeOil: '$27.90'
        },
        tapeHeadlines: [
          'RBI Governor Shaktikanta Das announces sweeping liquidity measures: Repo cut 75 bps to 4.40%, Reverse Repo cut 90 bps to 4.00%.',
          '3-month moratorium granted on all term loan EMIs and credit card dues.',
          'RBI injects ₹3.74 Lakh Crore (3.2% of GDP) via Targeted Long-Term Repo Operations (TLTRO) and CRR cuts.'
        ],
        whatWasKnown: 'The central bank provided a blanket safety net to prevent widespread borrower insolvencies during the shutdown.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Critics argued the moratorium would create bad loans; instead, it preserved household solvency until the economy reopened.',
        institutionalAction: 'Short sellers covered leveraged put options; systemic risk premium collapsed.',
        sentiment: 'Relief'
      },
      {
        id: 'covid-2020-04-22',
        date: 'April 22, 2020',
        shortDate: 'Apr 22, 2020',
        isoDate: '2020-04-22',
        dayTitle: 'Facebook Invests ₹43,574 Cr in Jio; Tech Supercycle Begins',
        phase: 'recovery',
        indices: {
          nifty50: { level: 9187, change1D: +2.11, pe: 17.2, pb: 2.3 },
          sensex: { level: 31379, change1D: +2.42, pe: 17.6 },
          bankNifty: { level: 20740, change1D: +1.40, pe: 11.8 },
          vix: 42.0
        },
        macro: {
          rbiRepo: '4.40%',
          cpi: '7.22%',
          wpi: '-1.57%',
          forex: '$479.0B',
          tenYearYield: '6.02%',
          usdInr: '76.40',
          crudeOil: '$13.80 (2 days after WTI -$37)'
        },
        tapeHeadlines: [
          'Facebook invests $5.7 Billion (₹43,574 Crore) for 9.99% stake in Jio Platforms; largest FDI in Indian tech.',
          'Reliance shares surge 10% in a day; kickstarts ₹1.52 Lakh Crore global fundraise across Silver Lake, Vista, KKR, Google.',
          'WTI crude oil trades back positive after historic intraday plunge to -$37.63 on April 20.'
        ],
        whatWasKnown: 'Global tech giants viewed Indian digital infrastructure as a premier growth destination regardless of the virus.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Investors waiting for a second crash missed the mega-cap tech rotation that carried Nifty higher.',
        corporateFilingInFocus: {
          symbol: 'RELIANCE',
          name: 'Reliance Industries',
          filing: 'Corporate Action',
          revenue: '₹1.5L Cr Q3',
          netProfit: '₹11.6k Cr Q3',
          note: 'Stock rallied from ₹875 low to ₹1,360, on its way to ₹2,300.'
        },
        institutionalAction: 'FII flows reversed from historic outflows to net buyers of Indian technology and healthcare assets.',
        sentiment: 'Relief'
      },
      {
        id: 'covid-2020-10-19',
        date: 'October 19, 2020',
        shortDate: 'Oct 19, 2020',
        isoDate: '2020-10-19',
        dayTitle: 'Nifty Reclaims 12,000 Milestone: Full Pandemic Recovery in 7 Months',
        phase: 'recovery',
        indices: {
          nifty50: { level: 12000, change1D: +0.65, pe: 34.2, pb: 3.5 },
          sensex: { level: 40758, change1D: +0.70, pe: 34.5 },
          bankNifty: { level: 24150, change1D: +1.20, pe: 15.4 },
          vix: 22.0
        },
        macro: {
          rbiRepo: '4.00% (All-time low)',
          cpi: '7.61%',
          wpi: '1.48%',
          forex: '$555.0B',
          tenYearYield: '5.92%',
          usdInr: '73.40',
          crudeOil: '$42.60'
        },
        tapeHeadlines: [
          'Nifty closes at 12,000 for first time since February 2020, gaining 4,500 points (+60%) from March 23 trough.',
          'Millions of new retail investors open demat accounts; monthly SIP inflows cross ₹8,000 Crore.',
          'Corporate balance sheets show aggressive debt reduction as free cash flows rebound.'
        ],
        whatWasKnown: 'Zero interest rates and global quantitative easing ignited the largest retail investing boom in Indian history.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The bull market was still in early innings; Nifty would continue climbing to 18,600 by October 2021.',
        institutionalAction: 'Institutional portfolios pivoted to cyclical capital goods, IT, and metals.',
        sentiment: 'Euphoria'
      }
    ]
  },

  // ==========================================
  // 3. THE 2024 ELECTION FLASH CRASH
  // ==========================================
  {
    id: 'election-2024',
    name: '2024 Lok Sabha Election Verdict Crash & 72-Hour V-Recovery',
    timeRange: 'May 2024 – September 2024',
    headline: 'Exit polls fail as coalition verdict triggers 5.93% crash; DII liquidity absorbs record FII dump to power 3-day recovery',
    regimeType: 'political_event',
    summary: 'Following exit polls predicting an unassailable 370+ seat landslide, vote counting on June 4 revealed the ruling BJP won 240 seats, necessitating coalition partners (TDP, JD-U). Leveraged retail and institutional positions liquidated simultaneously, causing the sharpest single-day crash in four years (Nifty down 1,379 points, PSU index down 16.4%). However, domestic institutional investors deployed ₹21,118 Crore of counter-cyclical buying, allowing the market to completely erase the entire crash in 72 hours.',
    totalDrawdown: '-5.93% single-day crash',
    troughDate: 'June 4, 2024 (Nifty 21,281 intraday low / 21,884 close)',
    recoveryDuration: '3 trading sessions to erase loss; 3 months to hit 25,000',
    chartPath: [
      { date: 'May 31', level: 22530 },
      { date: 'Jun 03', level: 23263 },
      { date: 'Jun 04', level: 21884 },
      { date: 'Jun 05', level: 22620 },
      { date: 'Jun 07', level: 23290 },
      { date: 'Jun 14', level: 23465 },
      { date: 'Jul 15', level: 24586 },
      { date: 'Sep 04', level: 25250 }
    ],
    winningSectors: [
      { name: 'Fast Moving Consumer Goods (FMCG)', performance: '+6.1% on crash day', rationale: 'Expectations that a coalition government would tilt fiscal budget allocations toward rural cash transfers and consumption.' }
    ],
    losingSectors: [
      { name: 'Public Sector Undertakings (PSUs)', performance: '-16.4% in one day', rationale: 'Severe multiple de-rating on fears coalition politics would stall privatization and infrastructure capex.' },
      { name: 'Defence & Railway Infrastructure', performance: '-18.5% in one day', rationale: 'Violent unwinding of high-beta election momentum trades.' }
    ],
    institutionalLessons: [
      'Political sentiment flash crashes in structurally growing economies present premier liquidity accumulation windows.',
      'Domestic institutional liquidity (SIPs, pension funds) now possesses sufficient depth to absorb even record FII liquidations.',
      'Underlying macroeconomic compounding (7.8% GDP growth) remains the ultimate anchor of equity prices.'
    ],
    days: [
      {
        id: 'elec-2024-05-31',
        date: 'May 31, 2024',
        shortDate: 'May 31, 2024',
        isoDate: '2024-05-31',
        dayTitle: 'GDP Blockbuster: India FY24 Growth Hits 8.2%',
        phase: 'onset',
        indices: {
          nifty50: { level: 22530, change1D: +0.19, pe: 21.6, pb: 3.8 },
          sensex: { level: 73961, change1D: +0.10, pe: 22.1 },
          bankNifty: { level: 48980, change1D: +0.45, pe: 15.2 },
          vix: 24.6
        },
        macro: {
          rbiRepo: '6.50%',
          cpi: '4.83%',
          wpi: '1.26%',
          forex: '$651.5B',
          tenYearYield: '6.98%',
          usdInr: '83.42',
          crudeOil: '$81.60'
        },
        tapeHeadlines: [
          'India GDP grows 7.8% in Q4 FY24; full-year FY24 economic growth reaches stellar 8.2%.',
          'Voting concludes across all 7 phases of 2024 Lok Sabha elections.',
          'Market participants await exit poll releases scheduled for June 1 evening.'
        ],
        whatWasKnown: 'Underlying macroeconomic fundamentals were among the strongest in the emerging world.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The market did not know that exit polls would wildly overestimate the ruling coalition.',
        institutionalAction: 'FIIs maintained heavy index put hedges due to elevated India VIX (24.6).',
        sentiment: 'Complacency'
      },
      {
        id: 'elec-2024-06-03',
        date: 'June 3, 2024',
        shortDate: 'Jun 3, 2024',
        isoDate: '2024-06-03',
        dayTitle: 'Exit Poll Euphoria: Nifty Surges +3.25% to Record 23,263',
        phase: 'onset',
        indices: {
          nifty50: { level: 23263, change1D: +3.25, pe: 22.3, pb: 3.9 },
          sensex: { level: 76468, change1D: +3.39, pe: 22.8 },
          bankNifty: { level: 50979, change1D: +4.07, pe: 15.9 },
          vix: 20.9
        },
        macro: {
          rbiRepo: '6.50%',
          cpi: '4.83%',
          wpi: '1.26%',
          forex: '$651.5B',
          tenYearYield: '6.94%',
          usdInr: '83.15',
          crudeOil: '$78.30'
        },
        tapeHeadlines: [
          'Exit polls project historic third term for Modi government with 350-400 seats.',
          'Nifty surges 733 points in its biggest single-day point gain in 4 years.',
          'PSU stocks, defence, and infrastructure rally 8-12% on capex continuity expectations.'
        ],
        whatWasKnown: 'Unanimous market consensus priced in an unassailable single-party majority.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Actual vote counting 24 hours later would reveal the BJP won 240 seats, necessitating coalition partners.',
        institutionalAction: 'Massive retail call option buying; aggressive short squeeze on foreign institutional puts.',
        sentiment: 'Euphoria'
      },
      {
        id: 'elec-2024-06-04',
        date: 'June 4, 2024',
        shortDate: 'Jun 4, 2024',
        isoDate: '2024-06-04',
        dayTitle: 'The Flash Crash: Nifty Plunges 5.93%; PSU Index Drops 16.4%',
        phase: 'capitulation',
        indices: {
          nifty50: { level: 21884, change1D: -5.93, pe: 21.2, pb: 3.7 },
          sensex: { level: 72079, change1D: -5.74, pe: 21.8 },
          bankNifty: { level: 46928, change1D: -7.95, pe: 14.8 },
          vix: 26.7
        },
        macro: {
          rbiRepo: '6.50%',
          cpi: '4.75%',
          wpi: '2.61%',
          forex: '$651.5B',
          tenYearYield: '7.04%',
          usdInr: '83.52',
          crudeOil: '$77.20'
        },
        tapeHeadlines: [
          'Election results show BJP winning 240 seats; NDA crosses 293 majority mark with TDP and JD(U) allies.',
          'Nifty crashes 1,379 points (-5.93%); intraday low reaches 21,281 (-8.5%).',
          'FIIs net sell record ₹12,436 Crore; Domestic institutional investors deploy counter-cyclical ₹21,118 Crore.',
          'State Bank of India drops 14.2%; Hindustan Unilever gains +6.1% on FMCG rotation.'
        ],
        whatWasKnown: 'Political repricing. Investors feared coalition bargaining would dilute fiscal discipline and slow infrastructure orders.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The crash was 100% sentiment-driven. Both coalition allies affirmed full unconditional support within 24 hours.',
        corporateFilingInFocus: {
          symbol: 'SBIN',
          name: 'State Bank of India',
          filing: 'Q4 FY24 Audited (reported May 9)',
          revenue: '₹1,28,400 Cr',
          netProfit: '₹20,698 Cr',
          note: 'Crashed to ₹750 intraday despite record quarterly profit and gross NPAs at decade-low 2.24%.'
        },
        institutionalAction: 'DIIs executed the largest single-day net equity purchase in Indian history (₹21,118 Cr), absorbing all FII panic selling.',
        sentiment: 'Panic Selling'
      },
      {
        id: 'elec-2024-06-05',
        date: 'June 5, 2024',
        shortDate: 'Jun 5, 2024',
        isoDate: '2024-06-05',
        dayTitle: 'The Coalition Rebound: TDP & JD(U) Pledge Support; Nifty +3.4%',
        phase: 'policy_pivot',
        indices: {
          nifty50: { level: 22620, change1D: +3.36, pe: 21.9, pb: 3.8 },
          sensex: { level: 74382, change1D: +3.20, pe: 22.3 },
          bankNifty: { level: 49050, change1D: +4.52, pe: 15.3 },
          vix: 18.9
        },
        macro: {
          rbiRepo: '6.50%',
          cpi: '4.75%',
          wpi: '2.61%',
          forex: '$651.5B',
          tenYearYield: '6.99%',
          usdInr: '83.38',
          crudeOil: '$78.40'
        },
        tapeHeadlines: [
          'NDA coalition partners meet at 7 Lok Kalyan Marg; pass unanimous resolution electing Narendra Modi as leader.',
          'Nifty stages ferocious 736-point rebound (+3.36%); Bank Nifty jumps 2,120 points.',
          'Global investment banks (Morgan Stanley, CLSA) reiterate Overweight rating on India.'
        ],
        whatWasKnown: 'Government formation was secured. Policy continuity was reaffirmed.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Bears who sold on June 4 were trapped as prices surged back toward pre-election levels.',
        institutionalAction: 'Massive short covering by FIIs; domestic mutual fund retail investors poured fresh cash into equities.',
        sentiment: 'Relief'
      },
      {
        id: 'elec-2024-06-07',
        date: 'June 7, 2024',
        shortDate: 'Jun 7, 2024',
        isoDate: '2024-06-07',
        dayTitle: 'RBI MPC Holds Repo at 6.50% & Upgrades GDP to 7.2%; Crash Fully Erased',
        phase: 'recovery',
        indices: {
          nifty50: { level: 23290, change1D: +2.05, pe: 22.4, pb: 3.9 },
          sensex: { level: 76693, change1D: +2.16, pe: 22.8 },
          bankNifty: { level: 49803, change1D: +1.50, pe: 15.6 },
          vix: 16.8
        },
        macro: {
          rbiRepo: '6.50% (Status Quo)',
          cpi: '4.75%',
          wpi: '2.61%',
          forex: '$651.5B',
          tenYearYield: '6.95%',
          usdInr: '83.40',
          crudeOil: '$79.60'
        },
        tapeHeadlines: [
          'RBI holds repo rate at 6.50% and upgrades FY25 GDP growth forecast from 7.0% to 7.2%.',
          'Nifty closes at 23,290—completely erasing the entire 1,379-point June 4 crash in exactly 3 trading sessions.',
          'Council of Ministers portfolio allocation confirms key economic ministers retain charge.'
        ],
        whatWasKnown: 'The election volatility shock was officially absorbed. Structural compounding resumed.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Nifty was embarking on a non-stop rally that would take it past 25,000 by September 2024.',
        institutionalAction: 'FIIs turned net buyers (₹4,391 Cr), joining domestic institutions in fueling fresh highs.',
        sentiment: 'Euphoria'
      }
    ]
  },

  // ==========================================
  // 4. THE 2016 DEMONETIZATION CASH SHOCK
  // ==========================================
  {
    id: 'demonetization-2016',
    name: '2016 Demonetization Overnight Cash Shock',
    timeRange: 'November 2016 – May 2017',
    headline: 'Prime Minister invalidates 86% of currency in circulation; bank deposits surge as cash-heavy sectors freeze',
    regimeType: 'policy_shock',
    summary: 'On the evening of November 8, 2016, the Government of India demonetized all ₹500 and ₹1,000 banknotes to curb black money and counterfeit notes. The immediate cash crunch halted rural commerce, unorganized retail, and real estate transactions, while Donald Trump\'s simultaneous US election victory triggered global capital flight. However, trillions of rupees in physical cash flooded commercial banks, crashing sovereign bond yields and catalyzing India\'s digital payments and UPI revolution.',
    totalDrawdown: '-8.5% over 6 weeks',
    troughDate: 'December 26, 2016 (Nifty 7,893 low)',
    recoveryDuration: '3 months to reach fresh all-time highs',
    chartPath: [
      { date: 'Nov 01', level: 8625 },
      { date: 'Nov 08', level: 8543 },
      { date: 'Nov 09', level: 8432 },
      { date: 'Nov 15', level: 8108 },
      { date: 'Nov 21', level: 7929 },
      { date: 'Dec 02', level: 8086 },
      { date: 'Dec 07', level: 8102 },
      { date: 'Dec 26', level: 7893 },
      { date: 'Jan 15', level: 8400 },
      { date: 'Feb 01', level: 8716 },
      { date: 'May 09', level: 9400 }
    ],
    winningSectors: [
      { name: 'Commercial Banking (CASA)', performance: '+6.5%', rationale: 'Trillions in low-cost deposits lowered cost of funds; CASA ratios surged across SBI and HDFC Bank.' },
      { name: 'Organized Retail & Digital Payments', performance: '+24.0% over 6M', rationale: 'Cashless mandate accelerated adoption of debit cards, organized retail, and the UPI payments revolution.' }
    ],
    losingSectors: [
      { name: 'Real Estate & Land Developers', performance: '-24.0%', rationale: 'Historically high cash transaction component caused immediate transaction freeze in secondary property.' },
      { name: 'Jewellery & Consumer Discretionary', performance: '-18.5%', rationale: 'Physical retail footfalls collapsed during peak wedding season.' }
    ],
    institutionalLessons: [
      'Cash liquidity shocks create transient demand destruction but permanent market share shifts toward organized leaders.',
      'Sovereign bond yields plunge when central banks or systemic policies force massive artificial banking liquidity.',
      'Organized market leaders (Titan, Asian Paints, Bajaj Finance) emerged vastly stronger post-remonetization.'
    ],
    days: [
      {
        id: 'demo-2016-11-08',
        date: 'November 8, 2016',
        shortDate: 'Nov 8, 2016',
        isoDate: '2016-11-08',
        dayTitle: '8:00 PM Address: Invalidation of ₹500 & ₹1,000 Currency Notes',
        phase: 'onset',
        indices: {
          nifty50: { level: 8543, change1D: +0.60, pe: 22.0, pb: 3.2 },
          sensex: { level: 27591, change1D: +0.48, pe: 22.3 },
          bankNifty: { level: 19680, change1D: +0.80, pe: 19.1 }
        },
        macro: {
          rbiRepo: '6.25%',
          cpi: '4.20%',
          wpi: '3.39%',
          forex: '$368.0B',
          tenYearYield: '6.85%',
          usdInr: '66.40',
          crudeOil: '$46.00'
        },
        tapeHeadlines: [
          'Prime Minister Narendra Modi announces ₹500 and ₹1,000 notes cease to be legal tender from midnight.',
          'Banks and ATMs closed for 48 hours for logistical transition; new ₹500 and ₹2,000 notes introduced.',
          'US presidential election voting underway between Hillary Clinton and Donald Trump.'
        ],
        whatWasKnown: '86% of currency in circulation (₹17.97 Lakh Crore) was rendered invalid overnight.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The government anticipated remonetization in 50 days; full cash restoration took nearly 6 months.',
        institutionalAction: 'Gold and luxury retail witnessed frantic late-night purchasing before midnight deadline.',
        sentiment: 'Complacency'
      },
      {
        id: 'demo-2016-11-09',
        date: 'November 9, 2016',
        shortDate: 'Nov 9, 2016',
        isoDate: '2016-11-09',
        dayTitle: 'Double Shock: Donald Trump Wins US Presidency; Demonetization Day 1',
        phase: 'peak_panic',
        indices: {
          nifty50: { level: 8432, change1D: -1.30, pe: 21.8, pb: 3.2 },
          sensex: { level: 27252, change1D: -1.22, pe: 22.1 },
          bankNifty: { level: 19445, change1D: +0.10, pe: 18.8 }
        },
        macro: {
          rbiRepo: '6.25%',
          cpi: '4.20%',
          wpi: '3.39%',
          forex: '$368.0B',
          tenYearYield: '6.80%',
          usdInr: '66.85',
          crudeOil: '$45.30'
        },
        tapeHeadlines: [
          'Donald Trump elected 45th US President, confounding pollsters and triggering global risk-off waves.',
          'Indian markets open down 6% intraday before recovering to close down 1.3%.',
          'Real estate developer stocks plunge 15-20% on expectations of secondary market collapse.'
        ],
        whatWasKnown: 'Dual macro shock: domestic cash freeze combined with US protectionist trade policy fears.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Surging bank deposits would soon drive 10Y G-Sec yields from 6.80% down to 6.20%.',
        corporateFilingInFocus: {
          symbol: 'TITAN',
          name: 'Titan Company',
          filing: 'Q2 FY17 Audited',
          revenue: '₹2,680 Cr',
          netProfit: '₹180 Cr',
          note: 'Stock dropped 8.5% on cash jewellery buying freeze; proved to be an elite multi-bagger entry.'
        },
        institutionalAction: 'FIIs dumped Indian equities on US bond yield spikes; domestic funds bought banking stocks.',
        sentiment: 'Fear'
      },
      {
        id: 'demo-2016-11-24',
        date: 'November 24, 2016',
        shortDate: 'Nov 24, 2016',
        isoDate: '2016-11-24',
        dayTitle: 'Bank Deposits Top ₹5 Lakh Crore; Sovereign Yields Collapse',
        phase: 'policy_pivot',
        indices: {
          nifty50: { level: 7965, change1D: -0.80, pe: 20.6, pb: 3.0 },
          sensex: { level: 25860, change1D: -0.75, pe: 20.9 },
          bankNifty: { level: 18450, change1D: -0.40, pe: 17.5 }
        },
        macro: {
          rbiRepo: '6.25%',
          cpi: '3.63%',
          wpi: '3.15%',
          forex: '$365.0B',
          tenYearYield: '6.22% (Plunged 60 bps)',
          usdInr: '68.75',
          crudeOil: '$48.20'
        },
        tapeHeadlines: [
          'Deposits of demonetized notes cross ₹5.1 Lakh Crore across commercial banks.',
          '10-Year Indian Government Benchmark Bond yield collapses to 6.22%—lowest since 2009.',
          'RBI imposes temporary 100% incremental CRR on surplus deposits to absorb bank liquidity.'
        ],
        whatWasKnown: 'Banks were flush with low-cost liquidity, enabling sharp lending rate cuts across housing and retail loans.',
        whatWasUnknown: 'LOOKAHEAD TRAP: The cash crunch was nearing its trough; Nifty bottomed 4 weeks later before climbing to 9,400.',
        institutionalAction: 'Institutional bond desks made extraordinary capital gains as G-Sec prices soared.',
        sentiment: 'Capitulation'
      },
      {
        id: 'demo-2017-05-09',
        date: 'May 9, 2017',
        shortDate: 'May 9, 2017',
        isoDate: '2017-05-09',
        dayTitle: 'Nifty Reaches All-Time High of 9,400; Formalization Complete',
        phase: 'recovery',
        indices: {
          nifty50: { level: 9400, change1D: +0.95, pe: 23.4, pb: 3.3 },
          sensex: { level: 30582, change1D: +0.90, pe: 23.8 },
          bankNifty: { level: 22750, change1D: +1.40, pe: 20.2 }
        },
        macro: {
          rbiRepo: '6.25%',
          cpi: '2.99%',
          wpi: '3.85%',
          forex: '$378.0B',
          tenYearYield: '6.88%',
          usdInr: '64.60',
          crudeOil: '$49.10'
        },
        tapeHeadlines: [
          'Nifty closes above 9,400 for first time in history; gains 19% from December 2016 lows.',
          'Organized sector leaders report record market share gains as unorganized businesses struggle.',
          'Goods and Services Tax (GST) rollout scheduled for July 1, 2017.'
        ],
        whatWasKnown: 'Remonetization was 85% complete. Domestic mutual fund equity inflows hit ₹10,000 Cr/month.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Titan, Bajaj Finance, and private banks had established multi-year leadership moats.',
        institutionalAction: 'FIIs turned aggressive net buyers as Rupee appreciated from 68.7 to 64.6 per USD.',
        sentiment: 'Euphoria'
      }
    ]
  },

  // ==========================================
  // 5. THE 2000 DOT-COM PEAK & TECH WINTER
  // ==========================================
  {
    id: 'dot-com-2000',
    name: '2000 Dot-Com Tech Euphoria & 80% Software Meltdown',
    timeRange: 'February 2000 – November 2001',
    headline: 'Nifty IT reaches 100x+ P/E multiples before 80% collapse in speculative software listings',
    regimeType: 'bubble',
    summary: 'The millennium tech mania saw Indian IT majors and speculative small-caps trade at astronomical valuation multiples above 100x P/E, completely decoupled from cash flow fundamentals. When the US Federal Reserve raised rates and the Nasdaq bubble burst in March 2000, global tech capital retreated, triggering a severe multi-year tech winter.',
    totalDrawdown: '-53.5% on Nifty 50; -82.0% on Nifty IT',
    troughDate: 'September 21, 2001 (Nifty 854 post-9/11 trough)',
    recoveryDuration: '3.5 years for Nifty 50; 6+ years for pure tech multiples',
    chartPath: [
      { date: 'Feb 11', level: 1720 },
      { date: 'Mar 10', level: 1658 },
      { date: 'Apr 14', level: 1390 },
      { date: 'May 02', level: 1280 },
      { date: 'Sep 21', level: 1190 },
      { date: 'Mar 02', level: 1020 },
      { date: 'Sep 21 (01)', level: 854 },
      { date: 'Nov 01 (01)', level: 980 }
    ],
    winningSectors: [
      { name: 'Old Economy Consumer & FMCG', performance: '+8.4% (vs -82% Tech)', rationale: 'Investors rotated into defensive cash-generating consumer staples like HUL and ITC.' },
      { name: 'Pharmaceuticals', performance: '+5.2%', rationale: 'Generic export players like Cipla and Ranbaxy provided non-cyclical defensive earnings.' }
    ],
    losingSectors: [
      { name: 'Information Technology & Software', performance: '-82.0%', rationale: 'Severe multiple contraction across software services and speculative dot-com startups.' },
      { name: 'Media & Telecom Convergence', performance: '-74.0%', rationale: 'Venture and enterprise advertising budgets collapsed.' }
    ],
    institutionalLessons: [
      'Never confuse top-line narrative growth with sustainable free cash flow generation.',
      'Sovereign bond yields at 10.85% provided a high hurdle rate that speculative equities failed to clear.'
    ],
    days: [
      {
        id: 'dot-com-2000-02-11',
        date: 'February 11, 2000',
        shortDate: 'Feb 11, 2000',
        isoDate: '2000-02-11',
        dayTitle: 'Peak Tech Euphoria: Infosys & Wipro P/E Tops 140x',
        phase: 'onset',
        indices: {
          nifty50: { level: 1720, change1D: +2.10, pe: 29.5, pb: 5.2 },
          sensex: { level: 5933, change1D: +2.30, pe: 30.1 }
        },
        macro: {
          rbiRepo: '8.00% (Bank Rate)',
          cpi: '3.60%',
          wpi: '6.20%',
          forex: '$37.0B',
          tenYearYield: '10.95%',
          usdInr: '43.60',
          crudeOil: '$29.80'
        },
        tapeHeadlines: [
          'Wipro market capitalization touches ₹2.2 Lakh Crore; Azim Premji briefly becomes world\'s second richest man.',
          'Infosys Technologies ADR commands 120x forward earnings multiple on Nasdaq.',
          'Old-economy cement, steel, and banking stocks ignored as retail investors chase tech IPOs.'
        ],
        whatWasKnown: 'Unconditional belief in the software services supercycle and internet revolution.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Nasdaq would peak 4 weeks later; tech stocks would lose 80% of value over next 24 months.',
        institutionalAction: 'Foreign venture capital flooded Bangalore tech startups; retail day-trading volumes reached record highs.',
        sentiment: 'Euphoria'
      },
      {
        id: 'dot-com-2000-03-10',
        date: 'March 10, 2000',
        shortDate: 'Mar 10, 2000',
        isoDate: '2000-03-10',
        dayTitle: 'Nasdaq Peaks at 5,048; Nifty Closes at 1,658',
        phase: 'peak_panic',
        indices: {
          nifty50: { level: 1658, change1D: -1.20, pe: 28.5, pb: 4.8 },
          sensex: { level: 5001, change1D: -1.40, pe: 29.1 }
        },
        macro: {
          rbiRepo: '8.00%',
          cpi: '3.80%',
          wpi: '6.45%',
          forex: '$38.0B',
          tenYearYield: '10.85%',
          usdInr: '43.60',
          crudeOil: '$31.50'
        },
        tapeHeadlines: [
          'Nasdaq Composite touches historic intraday peak of 5,132 before settling at 5,048.',
          'US Federal Reserve signals further interest rate hikes to cool equity market over-investment.',
          'Indian software exports projected to grow 45% CAGR, but valuation multiples face scrutiny.'
        ],
        whatWasKnown: 'Valuations were recognized as stretched, but consensus argued "this time is different" due to Y2K and internet adoption.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Nasdaq would not re-test 5,000 for another 15 years (until 2015).',
        institutionalAction: 'Smart money began rotating capital into defensive FMCG (Hindustan Lever) and pharma (Cipla).',
        sentiment: 'Complacency'
      },
      {
        id: 'dot-com-2000-04-14',
        date: 'April 14, 2000',
        shortDate: 'Apr 14, 2000',
        isoDate: '2000-04-14',
        dayTitle: '"Black Friday": Nasdaq Drops 9.7%; Indian Software Hits Lower Circuit',
        phase: 'capitulation',
        indices: {
          nifty50: { level: 1390, change1D: -6.40, pe: 23.5, pb: 3.9 },
          sensex: { level: 4680, change1D: -6.80, pe: 24.0 }
        },
        macro: {
          rbiRepo: '8.00%',
          cpi: '4.10%',
          wpi: '6.80%',
          forex: '$38.2B',
          tenYearYield: '10.80%',
          usdInr: '43.85',
          crudeOil: '$25.50'
        },
        tapeHeadlines: [
          'Nasdaq suffers worst single-day percentage drop in history: -9.67% (-355 points).',
          'Indian software stocks hit lower 8% price freeze within seconds of open.',
          'US government antitrust ruling against Microsoft triggers tech liquidation.'
        ],
        whatWasKnown: 'The speculative tech bubble had burst. Inflow of global venture capital halted overnight.',
        whatWasUnknown: 'LOOKAHEAD TRAP: Multiple compression would continue relentlessly through 2001 down to 18x P/E.',
        institutionalAction: 'Aggressive margin calls for retail traders; FIIs liquidated speculative ICE (Information, Communication, Entertainment) stocks.',
        sentiment: 'Panic Selling'
      }
    ]
  }
];

export function getAllRegimes(): HistoricalCrisisRegime[] {
  return CRISIS_REGIMES;
}

export function getRegimeById(id: string): HistoricalCrisisRegime | undefined {
  return CRISIS_REGIMES.find(r => r.id === id);
}

// Modern Baseline for comparison
export const MODERN_BASELINE = {
  date: 'November 2026',
  niftyLevel: 25800,
  niftyPE: 22.8,
  repoRate: '5.50%',
  cpi: '6.09%',
  wpi: '2.36%',
  pmi: '54.7',
  iip: '6.7%',
  forex: '$719.55B',
  tenYearYield: '6.78%',
  usdInr: '84.38',
  crudeOil: '$72.80'
};
