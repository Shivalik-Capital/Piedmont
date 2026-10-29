export interface PointInTimeIndicator {
  metric: string;
  value: string;
  periodCovered: string;
  releaseDate: string;
  reportingLag: string;
  lookaheadTrap: string;
}

export interface PointInTimeFiling {
  symbol: string;
  name: string;
  latestAvailableFiling: string;
  filingDate: string;
  revenue: string;
  netProfit: string;
  peAsOfDate: string;
  upcomingFiling: string;
  whatWasKnown: string;
}

export interface SimulationStep {
  horizon: '+1W' | '+1M' | '+3M' | '+6M' | '+1Y';
  futureDate: string;
  niftyLevel: number;
  niftyChange: string;
  macroReleasesUnlocked: string[];
  corporateEarningsUnlocked: string[];
  marketNarrative: string;
  thesisGrading: {
    bullishOutcome: string;
    bearishOutcome: string;
    winningPlay: string;
  };
}

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
  pointInTimeMacro: PointInTimeIndicator[];
  pointInTimeFilings: PointInTimeFiling[];
  newsAndConsensus: {
    headlineQuotes: string[];
    analystConsensus: string;
    centralBankStance: string;
    marketPsychology: string;
  };
  analysis: {
    catalysts: string[];
    transmissionMechanism: string[];
    winningSectors: { name: string; performance: string; rationale: string }[];
    losingSectors: { name: string; performance: string; rationale: string }[];
    institutionalLessons: string[];
    recoveryTimeline: string;
  };
  simulationSteps: SimulationStep[];
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
    id: 'gfc-oct-2008',
    name: 'Global Financial Crisis & Lehman Freeze',
    date: 'October 15, 2008',
    headline: 'Interbank credit freezes; Sensex and Nifty crash as foreign institutional funds liquidate',
    regimeType: 'crisis',
    summary: 'One month after Lehman Brothers filed for bankruptcy, global dollar funding markets completely froze. On October 15, 2008, Indian markets were in the grip of unprecedented panic. Foreign institutional investors liquidated over ₹12,000 Crore in a single fortnight to cover Western margin calls.',
    indices: {
      nifty50: { level: 3122, pe: 12.8, pb: 2.3, divYield: 2.1, change1D: -5.8, change1M: -28.4 },
      sensex: { level: 10581, pe: 13.1, pb: 2.4, change1D: -5.7, change1M: -29.2 },
      bankNifty: { level: 5120, pe: 8.8, pb: 1.3, change1D: -7.4, change1M: -36.5 },
    },
    macro: {
      rbiRepo: '9.00% (Emergency 100 bps cut happened Oct 20)',
      reverseRepo: '6.00%',
      cpi: '10.45%',
      wpi: '11.44%',
      pmi: '46.2',
      iip: '1.7%',
      gdpGrowth: '7.9% (Q1 FY09 reported Aug 29)',
      forexReserves: '$274.0B',
      gsecYield10Y: '7.85%',
      usdInr: '48.65',
      crudeOil: '$78.50',
    },
    pointInTimeMacro: [
      {
        metric: 'Gross Domestic Product (GDP)',
        value: '7.9% (Q1 FY09)',
        periodCovered: 'April 1 – June 30, 2008',
        releaseDate: 'August 29, 2008',
        reportingLag: '60 days lag',
        lookaheadTrap: 'CRITICAL LOOKAHEAD TRAP: On October 15, researchers often assume the market knew growth was slowing to 5.8%. In reality, Q2 FY09 GDP was not published until November 28, 2008! Investors on Oct 15 only knew 7.9%.'
      },
      {
        metric: 'Wholesale Inflation (WPI)',
        value: '11.44% (Sep 2008)',
        periodCovered: 'September 2008',
        releaseDate: 'October 10, 2008',
        reportingLag: '10 days lag',
        lookaheadTrap: 'Double-digit inflation was actively restraining the RBI from immediate aggressive rate cuts, creating a stagflation fear among bond managers.'
      },
      {
        metric: 'RBI Repo Rate Policy',
        value: '9.00%',
        periodCovered: 'Active as of Oct 15, 2008',
        releaseDate: 'July 29, 2008 MPC',
        reportingLag: 'Active policy rate',
        lookaheadTrap: 'The famous emergency 100 bps repo cut to 8.00% did NOT occur until October 20, 2008. On Oct 15, the repo rate was still at a restrictive 9.00%.'
      },
      {
        metric: 'Cash Reserve Ratio (CRR)',
        value: '7.50%',
        periodCovered: 'Emergency reduction',
        releaseDate: 'October 10, 2008',
        reportingLag: 'Immediate implementation',
        lookaheadTrap: 'RBI had just slashed CRR by 150 bps to release ₹60,000 Crore into the interbank system, yet commercial paper rates remained stressed above 14%.'
      }
    ],
    pointInTimeFilings: [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        latestAvailableFiling: 'Q1 FY09 (ended June 30, 2008)',
        filingDate: 'July 24, 2008',
        revenue: '₹41,024 Cr',
        netProfit: '₹4,110 Cr',
        peAsOfDate: '13.4x',
        upcomingFiling: 'Q2 FY09 expected October 23, 2008 (8 days away - not yet available)',
        whatWasKnown: 'Reliance had delivered record Q1 profits driven by gross refining margins (GRMs) of $15.7/barrel. The market did not yet know how severely petrochemical demand would contract in Q2.'
      },
      {
        symbol: 'ICICIBANK',
        name: 'ICICI Bank',
        latestAvailableFiling: 'Q1 FY09 (ended June 30, 2008)',
        filingDate: 'July 26, 2008',
        revenue: '₹9,840 Cr',
        netProfit: '₹728 Cr',
        peAsOfDate: '8.2x',
        upcomingFiling: 'Q2 FY09 expected October 25, 2008 (10 days away - not yet available)',
        whatWasKnown: 'Subject to intense retail branch run rumors regarding UK subsidiary exposure to Lehman Brothers. RBI issued a statement on Oct 1 affirming ICICI had sufficient liquidity.'
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        latestAvailableFiling: 'Q1 FY09 (ended June 30, 2008)',
        filingDate: 'July 17, 2008',
        revenue: '₹6,410 Cr',
        netProfit: '₹1,290 Cr',
        peAsOfDate: '11.8x',
        upcomingFiling: 'Q2 FY09 expected October 21, 2008 (6 days away - not yet available)',
        whatWasKnown: 'TCS maintained 24% operating margins in Q1, but investors feared widespread project cancellations by Wall Street banking clients.'
      }
    ],
    newsAndConsensus: {
      headlineQuotes: [
        '"Indian financial system is safe and well-capitalized, but global contagion cannot be ruled out." — RBI Governor D. Subbarao (Oct 13, 2008)',
        '"FIIs are selling liquid emerging market blue-chips not because India is broken, but because they need cash to survive Western redemptions." — Dalal Street Institutional Note (Oct 14, 2008)',
        '"Commercial paper yields hit 14.5% as mutual funds face redemptions from corporate treasuries." — Financial Express (Oct 15, 2008)'
      ],
      analystConsensus: 'Consensus was split: Foreign brokers urged extreme cash preservation predicting Nifty could test 2,500; domestic value managers argued Nifty P/E at 12.8x represented a historic multi-year accumulation zone.',
      centralBankStance: 'Transitioning rapidly from fighting domestic inflation (WPI 11.4%) to emergency liquidity provision via CRR cuts and dollar-rupee swap facilities.',
      marketPsychology: 'Peak panic and liquidity paralysis. Leveraged real estate and infrastructure firms faced acute refinancing barriers.'
    },
    analysis: {
      catalysts: [
        'Lehman Brothers bankruptcy triggered interbank trust collapse across London and New York.',
        'Western hedge funds faced massive redemption cascades, forcing wholesale liquidation of liquid Indian equity holdings.',
        'High domestic inflation restricted RBI from aggressive early easing, exacerbating the funding squeeze.'
      ],
      transmissionMechanism: [
        'Massive FII outflows led to rapid rupee depreciation (40 to 49 per USD), forcing RBI to intervene.',
        'Domestic mutual funds experienced severe redemptions in liquid debt funds, choking off NBFC commercial paper funding.',
        'High real borrowing costs compressed corporate capital expenditure plans.'
      ],
      winningSectors: [
        { name: 'Fast Moving Consumer Goods', performance: '-8.2%', rationale: 'Massive relative outperformance as consumer staples demand remained insulated from global banking chaos.' },
        { name: 'Pharmaceuticals', performance: '-12.0%', rationale: 'Generic export earnings cushioned by rupee depreciation.' }
      ],
      losingSectors: [
        { name: 'Real Estate & Construction', performance: '-74.0%', rationale: 'Refinancing dried up completely; debt servicing became impossible without emergency restructuring.' },
        { name: 'Private Sector Banking', performance: '-52.0%', rationale: 'Asset-liability mismatch concerns and systemic mark-to-market bond losses.' }
      ],
      institutionalLessons: [
        'Balance sheet leverage kills companies during liquidity freezes regardless of operating profitability.',
        'Lookahead bias causes analysts to forget that central banks initially fought inflation before slashing rates.',
        'Buying blue-chips at single-digit P/E multiples during liquidity panics generates extraordinary 5-year compounding.'
      ],
      recoveryTimeline: '5 months to reach ultimate bottom (March 2009 at 2,584); 12 months to reclaim 5,000.'
    },
    simulationSteps: [
      {
        horizon: '+1W',
        futureDate: 'October 22, 2008',
        niftyLevel: 2850,
        niftyChange: '-8.7%',
        macroReleasesUnlocked: [
          'RBI Emergency 100 bps Repo Cut announced Oct 20 (Repo dropped from 9.00% to 8.00%).',
          'Interbank overnight call rates dropped from 18% to 8% following repo window easing.'
        ],
        corporateEarningsUnlocked: [
          'TCS Q2 FY09 reported: Revenue ₹6,950 Cr (+8.4% QoQ), EBIT margin 23.8% resilient.',
          'Reliance Q2 FY09 preview shows initial softening in refining margins.'
        ],
        marketNarrative: 'The emergency repo cut confirms the depth of the crisis. Relief rally was brief; global hedge fund forced liquidations continued.',
        thesisGrading: {
          bullishOutcome: 'Early buyers suffered another 8-10% drawdown as forced selling peaked.',
          bearishOutcome: 'Shorting high-beta banks or holding cash generated significant alpha.',
          winningPlay: 'Buying deep out-of-the-money puts or accumulating defensive cash equivalents.'
        }
      },
      {
        horizon: '+1M',
        futureDate: 'November 15, 2008',
        niftyLevel: 2810,
        niftyChange: '-10.0%',
        macroReleasesUnlocked: [
          'G20 Leaders Summit in Washington pledges coordinated fiscal and monetary stimulus.',
          'October WPI inflation drops to 10.72%, opening the door for larger rate cuts.'
        ],
        corporateEarningsUnlocked: [
          'Reliance Q2 FY09 net profit ₹4,120 Cr; petrochemical division reports inventory write-downs.',
          'ICICI Bank Q2 results show asset quality held, dispelling bankruptcy rumors.'
        ],
        marketNarrative: 'Markets begin carving out a trading range between 2,700 and 3,100 as systemic insolvency fears recede.',
        thesisGrading: {
          bullishOutcome: 'Drawdown slowed; portfolio value stabilized.',
          bearishOutcome: 'Short positions started facing violent two-way volatility.',
          winningPlay: 'Accumulating FMCG (HUL, ITC) and top-tier private banks (HDFC Bank).'
        }
      },
      {
        horizon: '+3M',
        futureDate: 'January 15, 2009',
        niftyLevel: 2735,
        niftyChange: '-12.4%',
        macroReleasesUnlocked: [
          'Q2 FY09 GDP released on Nov 28 at 5.8% (confirming sharp economic slowdown).',
          'RBI Repo Rate slashed further to 5.50%; Reverse Repo at 4.00%.'
        ],
        corporateEarningsUnlocked: [
          'Satyam Computer Services fraud confession by B. Ramalinga Raju on Jan 7, 2009 shocks corporate India.',
          'IT index crashes 25% in a week as investors doubt reported balance sheets.'
        ],
        marketNarrative: 'Satyam scandal creates a secondary crisis of confidence in Indian corporate governance just as global markets attempted to stabilize.',
        thesisGrading: {
          bullishOutcome: 'Severe test of conviction; Satyam scandal tested even long-term bulls.',
          bearishOutcome: 'Shorting IT and mid-cap real estate paid off handsomely.',
          winningPlay: 'Pristine balance sheets (Tata Group, HDFC Group, Reliance) with transparent audits.'
        }
      },
      {
        horizon: '+6M',
        futureDate: 'April 15, 2009',
        niftyLevel: 3380,
        niftyChange: '+8.3%',
        macroReleasesUnlocked: [
          'March 2009 absolute bottom reached at 2,584; aggressive global QE takes hold.',
          'WPI inflation plunges below 1.5%; RBI Repo at historic low 4.75%.'
        ],
        corporateEarningsUnlocked: [
          'Q3 FY09 corporate earnings confirm Indian banking system suffered zero systemic insolvencies.',
          'Tech Mahindra acquires Satyam, restoring institutional confidence in the sector.'
        ],
        marketNarrative: 'Massive pre-election liquidity rally begins. Domestic mutual funds and value investors begin driving the market upward.',
        thesisGrading: {
          bullishOutcome: 'Patient value accumulators are now comfortably in the green.',
          bearishOutcome: 'Bears caught off guard by the ferocious 30% rally off the March 2,584 low.',
          winningPlay: 'High-beta cyclicals (L&T, ICICI Bank, Tata Motors) beginning multi-bagger runs.'
        }
      },
      {
        horizon: '+1Y',
        futureDate: 'October 15, 2009',
        niftyLevel: 5120,
        niftyChange: '+64.0%',
        macroReleasesUnlocked: [
          'UPA coalition wins decisive 2009 election victory triggering two upper circuits (May 18, 2009).',
          'GDP growth rebounds back toward 8.0%; foreign institutional flows turn positive with ₹85,000 Cr.'
        ],
        corporateEarningsUnlocked: [
          'Full-year FY09 audited numbers demonstrate Indian corporate resilience.',
          'Automobile and banking earnings break out to fresh historical highs.'
        ],
        marketNarrative: 'The greatest financial crisis of a generation evolved into one of the most explosive bull market rallies in Indian history.',
        thesisGrading: {
          bullishOutcome: 'Generational returns (+64% index return; individual leaders +150% to +300%).',
          bearishOutcome: 'Catastrophic losses for persistent bears who waited for previous lows.',
          winningPlay: 'Equities as the ultimate asset class when purchased at single-digit earnings multiples.'
        }
      }
    ],
    notableStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹1,240', change: '-5.2%', pe: '13.4x', note: 'Down 50% from ₹2,600 peak; refining GRMs remained strong at $15/bbl.' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '₹410', change: '-11.2%', pe: '8.2x', note: 'Subject to intense retail branch run rumors; survived and went on to 5x over subsequent cycle.' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹280', change: '-3.8%', pe: '11.8x', note: 'Traded at decade-low P/E; operating margins remained rock-solid at 24%.' },
      { symbol: 'LT', name: 'Larsen & Toubro', price: '₹840', change: '-8.5%', pe: '14.5x', note: 'Severe hit on order execution concerns before infrastructure rebound.' }
    ]
  },
  {
    id: 'covid-mar-2020',
    name: 'COVID-19 The Gathering Storm (Pre-Lockdown)',
    date: 'March 1, 2020',
    headline: 'Novel coronavirus spreads across Italy and Iran; Indian markets consolidate near highs',
    regimeType: 'crisis',
    summary: 'On March 1, 2020, India had reported only 3 confirmed COVID-19 cases in Kerala (all students returned from Wuhan). The Nifty 50 stood at 11,201, down just 9% from its all-time high of 12,430. Brokerages maintained Nifty year-end targets above 13,000. Nationwide lockdown was completely unimagined by the consensus.',
    indices: {
      nifty50: { level: 11201, pe: 24.2, pb: 2.8, divYield: 1.3, change1D: -0.8, change1M: -6.4 },
      sensex: { level: 38297, pe: 24.8, pb: 2.9, change1D: -0.9, change1M: -6.1 },
      bankNifty: { level: 29147, pe: 16.5, pb: 2.1, change1D: -1.2, change1M: -7.5 },
    },
    macro: {
      rbiRepo: '5.15%',
      reverseRepo: '4.90%',
      cpi: '7.59% (Jan 2020 print released Feb 12)',
      wpi: '3.10%',
      pmi: '54.5',
      iip: '2.0%',
      gdpGrowth: '4.7% (Q3 FY20 released Feb 28)',
      forexReserves: '$476.0B',
      gsecYield10Y: '6.37%',
      usdInr: '72.20',
      crudeOil: '$50.50',
    },
    pointInTimeMacro: [
      {
        metric: 'Gross Domestic Product (GDP)',
        value: '4.7% (Q3 FY20)',
        periodCovered: 'October 1 – December 31, 2019',
        releaseDate: 'February 28, 2020 (2 days prior)',
        reportingLag: '60 days lag',
        lookaheadTrap: 'CRITICAL LOOKAHEAD TRAP: On March 1, markets were discussing sluggish 4.7% GDP growth from late 2019. Nobody foresaw the -23.9% GDP contraction that would strike in Q1 FY21!'
      },
      {
        metric: 'Headline CPI Inflation',
        value: '7.59% (Jan 2020)',
        periodCovered: 'January 2020',
        releaseDate: 'February 12, 2020',
        reportingLag: '12 days lag',
        lookaheadTrap: 'Driven by an onion price spike above ₹100/kg, CPI was above the RBIs 6% tolerance band, leading consensus to believe rate cuts were off the table.'
      },
      {
        metric: 'RBI Policy Stance',
        value: '5.15% (Accommodative)',
        periodCovered: 'February 6, 2020 MPC',
        releaseDate: 'February 6, 2020',
        reportingLag: 'Active policy rate',
        lookaheadTrap: 'The emergency 75 bps repo cut, 3-month loan moratorium, and TLTRO injections were completely unannounced on March 1.'
      }
    ],
    pointInTimeFilings: [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        latestAvailableFiling: 'Q3 FY20 (ended Dec 31, 2019)',
        filingDate: 'January 17, 2020',
        revenue: '₹1,52,939 Cr',
        netProfit: '₹11,640 Cr',
        peAsOfDate: '23.8x',
        upcomingFiling: 'Q4 FY20 expected April 30, 2020',
        whatWasKnown: 'Jio was adding 10 million subscribers monthly; retail division EBITDA had doubled. Net debt was ₹1.53L Cr; target was zero net debt by 2021.'
      },
      {
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        latestAvailableFiling: 'Q3 FY20 (ended Dec 31, 2019)',
        filingDate: 'January 10, 2020',
        revenue: '₹39,854 Cr',
        netProfit: '₹8,118 Cr',
        peAsOfDate: '24.1x',
        upcomingFiling: 'Q4 FY20 expected April 16, 2020',
        whatWasKnown: 'Pristine balance sheet with zero debt. European and North American enterprise IT pipelines were expanding steadily.'
      }
    ],
    newsAndConsensus: {
      headlineQuotes: [
        '"India is geographically isolated from novel coronavirus epicenter in Wuhan; supply chain disruption remains minimal." — Brokerage Strategy Note (Feb 28, 2020)',
        '"WHO raises global risk assessment to Very High, but travel restrictions are expected to be localized." — Reuters (Feb 29, 2020)',
        '"Yes Bank restructuring plan under active RBI consideration." — Economic Times (March 1, 2020)'
      ],
      analystConsensus: 'Consensus viewed COVID-19 as a brief supply-chain friction for China-dependent chemical and electronics importers, not a systemic threat to domestic services or consumer mobility.',
      centralBankStance: 'RBI maintained watchfulness over onion inflation while monitoring Yes Bank capital adequacy.',
      marketPsychology: 'Complacent optimism. Buy-the-dip mentality prevailed among domestic retail SIP investors.'
    },
    analysis: {
      catalysts: [
        'Outbreak accelerated exponentially in Northern Italy and Iran in late February 2020.',
        'Initial international supply chain halts in automotive components and pharmaceutical APIs.',
        'Domestic banking stress centered on Yes Bank capital depletion.'
      ],
      transmissionMechanism: [
        'Global hedge funds executed cross-asset risk-parity selloffs as western lockdowns commenced.',
        'Panic margin calls triggered simultaneous selling in equities, commodities, and corporate debt for USD cash.'
      ],
      winningSectors: [
        { name: 'Pharmaceuticals & APIs', performance: '+35.0% (over next 6M)', rationale: 'Global scramble for hydroxychloroquine, paracetamol, and active pharmaceutical ingredients.' },
        { name: 'IT & Cloud Services', performance: '+48.0% (over next 6M)', rationale: 'Work-from-home mandate catalyzed multi-year enterprise cloud migration.' }
      ],
      losingSectors: [
        { name: 'Aviation & Multiplexes', performance: '-65.0%', rationale: 'Total domestic and international ground stop; zero ticket sales for months.' },
        { name: 'Non-Banking Financials', performance: '-48.0%', rationale: 'Asset quality panic on fears of widespread borrower defaults during lockdown.' }
      ],
      institutionalLessons: [
        'Black swan events strike when consensus is complacent and valuations are elevated (24x P/E).',
        'Lookahead bias hides the fact that on March 1, virtually no Wall Street analyst predicted global lockdowns.'
      ],
      recoveryTimeline: '23 days of precipitous drop (March 1 to March 23 lower circuit); 7 months to fully reclaim pre-COVID highs.'
    },
    simulationSteps: [
      {
        horizon: '+1W',
        futureDate: 'March 8, 2020',
        niftyLevel: 10989,
        niftyChange: '-1.9%',
        macroReleasesUnlocked: [
          'RBI places Yes Bank under 30-day moratorium on March 5; SBI-led bailout announced.',
          'Italy announces quarantine of Lombardy and 14 northern provinces.'
        ],
        corporateEarningsUnlocked: [
          'Yes Bank depositors face ₹50,000 withdrawal cap; systemic liquidity panic in private banks.'
        ],
        marketNarrative: 'Domestic banking stress combines with accelerating European coronavirus cases; volatility index (India VIX) spikes above 25.',
        thesisGrading: {
          bullishOutcome: 'Initial dip buyers trapped as global liquidity begins tightening.',
          bearishOutcome: 'Shorting private banks or buying protective index puts generated large gains.',
          winningPlay: 'Liquidating vulnerable travel/leisure names and moving to cash.'
        }
      },
      {
        horizon: '+1M',
        futureDate: 'April 1, 2020',
        niftyLevel: 8250,
        niftyChange: '-26.3%',
        macroReleasesUnlocked: [
          'March 23 historic crash: 10% lower circuit triggered within 15 minutes of open; Nifty hits 7,511.',
          'Prime Minister announces 21-day nationwide lockdown on March 24.',
          'RBI delivers emergency 75 bps repo rate cut to 4.40% and announces 3-month loan moratorium on March 27.'
        ],
        corporateEarningsUnlocked: [
          'Automakers report zero domestic sales for late March as showrooms and factories shut.'
        ],
        marketNarrative: 'Unprecedented market capitulation; India VIX hits 83.6. FIIs dump ₹65,000 Cr in a single month.',
        thesisGrading: {
          bullishOutcome: 'Devastating 26% drawdown for anyone who failed to hedge on March 1.',
          bearishOutcome: 'Spectacular short gains, but short sellers faced extreme squeeze risk off the March 23 bottom.',
          winningPlay: 'Stepping in to buy quality blue-chips (Reliance, TCS, HDFC Bank) on March 23-25.'
        }
      },
      {
        horizon: '+3M',
        futureDate: 'June 1, 2020',
        niftyLevel: 9825,
        niftyChange: '-12.3%',
        macroReleasesUnlocked: [
          'Federal Reserve unlimited QE and RBI Targeted Long-Term Repo Operations (TLTRO) flood the system with liquidity.',
          'RBI cuts repo rate again by 40 bps to historic low 4.00% on May 22.'
        ],
        corporateEarningsUnlocked: [
          'Reliance Industries announces ₹1.52L Cr fundraising across Jio Platforms (Facebook, Silver Lake, Google).',
          'Pharmaceutical majors report record export margins.'
        ],
        marketNarrative: 'The great liquidity reflation begins. Retail demat accounts explode as millions of locked-down citizens begin trading equities.',
        thesisGrading: {
          bullishOutcome: 'V-shaped recovery well underway; Nifty already up 30% from 7,511 low.',
          bearishOutcome: 'Bears waiting for a second crash to 6,000 missed the entire recovery.',
          winningPlay: 'Buying Reliance and IT/Pharma leaders for the secular bull run.'
        }
      },
      {
        horizon: '+1Y',
        futureDate: 'March 1, 2021',
        niftyLevel: 14929,
        niftyChange: '+33.3%',
        macroReleasesUnlocked: [
          'Vaccine rollout commences across India and globally.',
          'Q3 FY21 GDP rebounds into positive territory (+0.4%), ending the technical recession.'
        ],
        corporateEarningsUnlocked: [
          'IT services report highest deal total contract values in history.',
          'Corporate balance sheets show aggressive deleveraging.'
        ],
        marketNarrative: 'The onset of a historic multi-year bull market that pushed Nifty from 7,511 to 18,600.',
        thesisGrading: {
          bullishOutcome: '+33.3% return from March 1, 2020 (and +98% from the March 23 bottom).',
          bearishOutcome: 'Bears completely washed out as corporate profitability reached record levels.',
          winningPlay: 'Holding through black swan volatility and accumulating during peak panic.'
        }
      }
    ],
    notableStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹1,325', change: '-1.4%', pe: '23.8x', note: 'Dropped to ₹875 on March 23 before announcing landmark tech monetization.' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹2,020', change: '-0.8%', pe: '24.1x', note: 'Bottomed at ₹1,630; benefited from accelerated global enterprise cloud migration.' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '₹1,180', change: '-1.5%', pe: '22.0x', note: 'Dipped to ₹760 during lower circuit panic; pristine loan underwriting preserved equity.' },
      { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: '₹375', change: '+1.2%', pe: '19.5x', note: 'Became an institutional safe haven during the healthcare crisis.' }
    ]
  },
  {
    id: 'demonetization-nov-2016',
    name: 'Demonetization Cash Shock',
    date: 'November 9, 2016',
    headline: 'Overnight invalidation of 86% of currency notes; cash-dependent sectors freeze',
    regimeType: 'policy_shock',
    summary: 'On the evening of November 8, 2016, the Government of India declared all ₹500 and ₹1,000 banknotes illegal tender. On November 9, Indian markets woke up to a severe transaction liquidity shock, compounded by Donald Trumps unexpected US presidential election victory.',
    indices: {
      nifty50: { level: 8432, pe: 21.8, pb: 3.2, divYield: 1.4, change1D: -1.3, change1M: -3.2 },
      sensex: { level: 27252, pe: 22.1, pb: 3.3, change1D: -1.2, change1M: -3.0 },
      bankNifty: { level: 19445, pe: 18.8, pb: 2.3, change1D: +0.1, change1M: -2.1 },
    },
    macro: {
      rbiRepo: '6.25%',
      reverseRepo: '5.75%',
      cpi: '4.20% (Oct 2016 print)',
      wpi: '3.39%',
      pmi: '54.5 (dropped to 49.6 in Dec)',
      iip: '1.2%',
      gdpGrowth: '7.5%',
      forexReserves: '$368.0B',
      gsecYield10Y: '6.85% (plunged to 6.20% within weeks)',
      usdInr: '66.45',
      crudeOil: '$45.30',
    },
    pointInTimeMacro: [
      {
        metric: 'Currency in Circulation',
        value: '₹17.97 Lakh Crore (86% invalidated)',
        periodCovered: 'November 8, 2016',
        releaseDate: 'November 8, 2016 Address to Nation',
        reportingLag: 'Immediate shock',
        lookaheadTrap: 'Markets did not know the remonetization would take over 5 months. Initial government estimates suggested normalcy within 50 days.'
      },
      {
        metric: 'Banking System Deposit Surge',
        value: 'Surplus Liquidity',
        periodCovered: 'Nov-Dec 2016',
        releaseDate: 'Weekly RBI Statistical Bulletin',
        reportingLag: 'Weekly reporting',
        lookaheadTrap: 'Banks received over ₹15 Lakh Crore in low-cost deposits, driving 10Y sovereign yields from 6.85% down to 6.20% as banks parked cash in G-Secs.'
      }
    ],
    pointInTimeFilings: [
      {
        symbol: 'TITAN',
        name: 'Titan Company',
        latestAvailableFiling: 'Q2 FY17 (ended Sep 30, 2016)',
        filingDate: 'November 3, 2016',
        revenue: '₹2,680 Cr',
        netProfit: '₹180 Cr',
        peAsOfDate: '38.5x',
        upcomingFiling: 'Q3 FY17 expected February 2017',
        whatWasKnown: 'Titan had strong festive jewellery sales in Q2. Demonetization halted jewellery transactions overnight, but long-term catalyzed massive formalization.'
      }
    ],
    newsAndConsensus: {
      headlineQuotes: [
        '"₹500 and ₹1,000 currency notes will cease to be legal tender from midnight tonight." — Prime Minister Narendra Modi (Nov 8, 2016)',
        '"Cash-intensive sectors like real estate, jewellers, and luxury discretionary will face immediate demand destruction." — Kotak Institutional Equities (Nov 9, 2016)'
      ],
      analystConsensus: 'Short-term panic in domestic consumption, but bullish for banking CASA ratios and digital payment infrastructure.',
      centralBankStance: 'RBI focused on managing bank branch logistics and currency replacement queues.',
      marketPsychology: 'Disruption fear followed by formalization optimism.'
    },
    analysis: {
      catalysts: [
        'Invalidation of high-denomination currency notes constituting 86% of cash supply.',
        'Simultaneous global market shock from Donald Trumps US election victory.'
      ],
      transmissionMechanism: [
        'Cash wholesale supply chains froze; unorganized retail suffered heavy volume drop.',
        'Trillions in cash flooded commercial bank deposits, crashing borrowing rates and sovereign yields.'
      ],
      winningSectors: [
        { name: 'Commercial Banking', performance: '+4.5%', rationale: 'Massive surge in low-cost current and savings account (CASA) deposits.' },
        { name: 'Organized Retail & Digital Platforms', performance: '+18.0%', rationale: 'Formalization tailwind; launch of the UPI digital payments era.' }
      ],
      losingSectors: [
        { name: 'Real Estate & Land Developers', performance: '-24.0%', rationale: 'High cash component in historical land deals caused complete transaction freeze.' },
        { name: 'Microfinance & Rural NBFCs', performance: '-22.0%', rationale: 'Rural collection efficiency plummeted due to physical cash shortages.' }
      ],
      institutionalLessons: [
        'Structural policy shocks create transient demand destruction but permanent market share shifts toward organized leaders.'
      ],
      recoveryTimeline: '3 months for cash velocity to normalize; Nifty broke to fresh all-time highs above 9,000 by March 2017.'
    },
    simulationSteps: [
      {
        horizon: '+1M',
        futureDate: 'December 9, 2016',
        niftyLevel: 8260,
        niftyChange: '-2.0%',
        macroReleasesUnlocked: [
          'November PMI collapses from 54.5 to 46.7; wholesale supply chains contract.',
          '10Y G-Sec yield drops to 6.20% as banks park surplus cash in government bonds.'
        ],
        corporateEarningsUnlocked: [
          'Consumer discretionary companies announce 20-30% volume drops in wholesale channels.'
        ],
        marketNarrative: 'Market experiences persistent consolidation; foreign investors pull ₹18,000 Cr on US rate hike expectations.',
        thesisGrading: {
          bullishOutcome: 'Subdued index return, but high-quality banking stocks held ground.',
          bearishOutcome: 'Shorting real estate was the dominant winning trade.',
          winningPlay: 'Accumulating top-tier private banks (HDFC Bank, Kotak Bank).'
        }
      },
      {
        horizon: '+6M',
        futureDate: 'May 9, 2017',
        niftyLevel: 9400,
        niftyChange: '+11.5%',
        macroReleasesUnlocked: [
          'Re-monetization completes; currency in circulation recovers to 80% of pre-shock levels.',
          'Goods and Services Tax (GST) rollout announced for July 1, 2017.'
        ],
        corporateEarningsUnlocked: [
          'Organized sector leaders (Titan, Asian Paints, Marico) report massive market share gains from unorganized competitors.'
        ],
        marketNarrative: 'Nifty breaks 9,000 for the first time in history, led by formalization and domestic mutual fund inflows.',
        thesisGrading: {
          bullishOutcome: '+11.5% index return and major outperformance in organized leaders.',
          bearishOutcome: 'Bears trapped waiting for protracted cash depression.',
          winningPlay: 'Buying market leaders who capitalized on unorganized sector weakness.'
        }
      }
    ],
    notableStocks: [
      { symbol: 'TITAN', name: 'Titan Company', price: '₹340', change: '-7.5%', pe: '38.5x', note: 'Bottomed during cash panic; went on to become one of the greatest compounders of the decade.' },
      { symbol: 'SBIN', name: 'State Bank of India', price: '₹280', change: '+2.8%', pe: '12.0x', note: 'Massive deposit inflows lowered cost of funds; NIM expanded.' }
    ]
  },
  {
    id: 'election-jun-2024',
    name: 'Lok Sabha Election Verdict Flash Crash',
    date: 'June 4, 2024',
    headline: 'Exit polls fail; Nifty crashes 5.93% intraday on surprise coalition election results',
    regimeType: 'political_event',
    summary: 'Following exit polls predicting an unassailable 370+ seat landslide, vote counting on June 4, 2024 revealed the ruling party won 240 seats, necessitating coalition allies. Shocked institutional investors liquidated leveraged positions, causing the sharpest single-day crash in four years before a historic V-shaped recovery within 72 hours.',
    indices: {
      nifty50: { level: 21884, pe: 21.2, pb: 3.7, divYield: 1.3, change1D: -5.93, change1M: -2.4 },
      sensex: { level: 72079, pe: 21.8, pb: 3.8, change1D: -5.74, change1M: -2.1 },
      bankNifty: { level: 46928, pe: 14.8, pb: 2.3, change1D: -7.95, change1M: -4.8 },
    },
    macro: {
      rbiRepo: '6.50%',
      reverseRepo: '3.35%',
      cpi: '4.75% (April 2024 print)',
      wpi: '2.61%',
      pmi: '58.3',
      iip: '5.0%',
      gdpGrowth: '7.8% (FY24 GDP reported May 31 at 8.2%)',
      forexReserves: '$651.5B',
      gsecYield10Y: '7.04%',
      usdInr: '83.52',
      crudeOil: '$77.20',
    },
    pointInTimeMacro: [
      {
        metric: 'Full-Year FY24 GDP Growth',
        value: '8.2% (Released May 31, 2024)',
        periodCovered: 'FY 2023-24',
        releaseDate: 'May 31, 2024 (4 days prior)',
        reportingLag: '60 days lag',
        lookaheadTrap: 'Underlying macroeconomic fundamentals were among the strongest in the world (8.2% GDP growth, forex reserves at record $651B). The crash was 100% political sentiment repricing, not economic impairment.'
      }
    ],
    pointInTimeFilings: [
      {
        symbol: 'SBIN',
        name: 'State Bank of India',
        latestAvailableFiling: 'Q4 FY24 (ended March 31, 2024)',
        filingDate: 'May 9, 2024',
        revenue: '₹1,28,400 Cr',
        netProfit: '₹20,698 Cr',
        peAsOfDate: '9.2x',
        upcomingFiling: 'Q1 FY25 expected August 2024',
        whatWasKnown: 'State Bank of India reported record quarterly profits of ₹20,698 Cr with gross NPAs at a decade-low of 2.24%. The stock crashed 14.2% on June 4 purely on PSU sentiment.'
      }
    ],
    newsAndConsensus: {
      headlineQuotes: [
        '"Election results necessitate NDA coalition government; Modi to form government with TDP and JD(U)." — National Media (June 4, 2024)',
        '"Foreign institutional investors net sold ₹12,436 Crore; Domestic institutional investors net bought ₹21,118 Crore." — NSE Trade Report (June 4, 2024)'
      ],
      analystConsensus: 'Fears that coalition politics would slow infrastructure capex and public sector privatization.',
      centralBankStance: 'RBI maintained status quo on 6.50% repo rate with robust foreign exchange reserves.',
      marketPsychology: 'Extreme intraday panic selling by retail traders on margin.'
    },
    analysis: {
      catalysts: [
        'Exit polls had heavily priced in an unassailable single-party majority.',
        'High-beta PSU stocks, defence companies, and capital goods experienced severe retail margin calls.'
      ],
      transmissionMechanism: [
        'Foreign institutional liquidation absorbed by counter-cyclical domestic institutional liquidity (SIPs, insurance funds).'
      ],
      winningSectors: [
        { name: 'Fast Moving Consumer Goods', performance: '+1.5%', rationale: 'Expectations that a coalition government would tilt budget allocations toward rural consumption.' }
      ],
      losingSectors: [
        { name: 'Public Sector Undertakings (PSU)', performance: '-16.4%', rationale: 'Severe multiple de-rating on fears of policy interference and capex slowdown.' },
        { name: 'Infrastructure & Capital Goods', performance: '-12.8%', rationale: 'Unwinding of high-conviction election capex momentum trades.' }
      ],
      institutionalLessons: [
        'Single-day political flash crashes in fundamentally growing economies present premier liquidity buying windows.'
      ],
      recoveryTimeline: 'Just 3 trading sessions for Nifty to completely erase the 1,300-point drop and hit fresh all-time highs above 23,000.'
    },
    simulationSteps: [
      {
        horizon: '+1W',
        futureDate: 'June 11, 2024',
        niftyLevel: 23265,
        niftyChange: '+6.3%',
        macroReleasesUnlocked: [
          'NDA coalition cabinet sworn in; key economic ministers (Finance, Commerce, Railways) retain portfolios.',
          'RBI holds repo rate at 6.50% on June 7, raising FY25 GDP forecast to 7.2%.'
        ],
        corporateEarningsUnlocked: [
          'PSU bank fundamentals reaffirmed; management confirms zero disruption to infrastructure lending.'
        ],
        marketNarrative: 'Nifty completely recovers the entire 1,300-point crash in 3 sessions; bears caught in historic short squeeze.',
        thesisGrading: {
          bullishOutcome: '+6.3% index gain in 7 days; PSU stocks rallied 12-18% off June 4 lows.',
          bearishOutcome: 'Catastrophic losses for panic sellers on June 4.',
          winningPlay: 'Aggressively buying State Bank of India, L&T, and Nifty index on June 4 close.'
        }
      },
      {
        horizon: '+3M',
        futureDate: 'September 4, 2024',
        niftyLevel: 25250,
        niftyChange: '+15.4%',
        macroReleasesUnlocked: [
          'Union Budget FY25 maintains ₹11.11 Lakh Crore infrastructure capital expenditure target.',
          'Foreign exchange reserves reach new all-time high of $683 Billion.'
        ],
        corporateEarningsUnlocked: [
          'Q1 FY25 corporate earnings confirm steady double-digit profit compounding.'
        ],
        marketNarrative: 'Nifty breaks 25,000 for the first time in history; June 4 crash remembered as a generational false breakout.',
        thesisGrading: {
          bullishOutcome: '+15.4% return in 90 days; political discount fully erased.',
          bearishOutcome: 'Underperformed by staying in cash.',
          winningPlay: 'Remaining invested in structural India growth proxies.'
        }
      }
    ],
    notableStocks: [
      { symbol: 'SBIN', name: 'State Bank of India', price: '₹750', change: '-14.2%', pe: '9.2x', note: 'Crashed to ₹750 intraday; rebounded back above ₹850 within two weeks.' },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: '₹2,500', change: '+6.1%', pe: '54.0x', note: 'Sole large-cap gainer on June 4 as investors rotated into defensive consumption.' }
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
    pointInTimeMacro: [
      {
        metric: 'CPI Inflation (Headline)',
        value: '5.54% (October 2026)',
        periodCovered: 'October 2026',
        releaseDate: 'October 2026 Official Release',
        reportingLag: 'Current reporting period',
        lookaheadTrap: 'Current live baseline; metrics reflect active verified values without lag.'
      },
      {
        metric: 'RBI Policy Stance',
        value: '5.50% Repo Rate',
        periodCovered: 'October 2026 MPC',
        releaseDate: 'Active policy stance',
        reportingLag: 'Next MPC Dec 2-4, 2026',
        lookaheadTrap: 'Active monetary baseline.'
      }
    ],
    pointInTimeFilings: [
      {
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        latestAvailableFiling: 'Q1 FY27',
        filingDate: 'July 2026',
        revenue: '₹9,80,000 Cr (TTM)',
        netProfit: '₹79,000 Cr (TTM)',
        peAsOfDate: '28.4x',
        upcomingFiling: 'Q2 FY27 in pipeline',
        whatWasKnown: 'Market capitalization ₹19.2 Lakh Crore; telecom and retail expansion steady.'
      }
    ],
    newsAndConsensus: {
      headlineQuotes: [
        '"Indian macro fundamentals demonstrate remarkable resilience; domestic SIP inflows exceed ₹24,000 Crore monthly." — Piedmont Terminal Dispatch (Oct 2026)'
      ],
      analystConsensus: 'Steady compounder thesis with premium valuation multiples.',
      centralBankStance: 'Prudent inflation monitoring with focus on core CPI convergence.',
      marketPsychology: 'Stable institutional confidence.'
    },
    analysis: {
      catalysts: [
        'Sustained corporate earnings compounding across banking, automotive, and infrastructure.',
        'High domestic retail participation via mutual fund SIPs.'
      ],
      transmissionMechanism: [
        'Domestic institutional liquidity acts as a structural stabilizer against global geopolitical shocks.'
      ],
      winningSectors: [
        { name: 'Capital Goods & Power', performance: '+28.5%', rationale: 'Multidecade energy transition and private industrial capex revitalization.' }
      ],
      losingSectors: [
        { name: 'Information Technology', performance: '+4.2% (lagging)', rationale: 'Cautious global enterprise discretionary tech spending.' }
      ],
      institutionalLessons: [
        'India has transitioned from an FII-dependent market into an organically funded domestic liquidity powerhouse.'
      ],
      recoveryTimeline: 'Operating at active baseline regime.'
    },
    simulationSteps: [],
    notableStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '₹2,847.50', change: '+1.24%', pe: '28.4x', note: 'Market cap ₹19.2L Cr; retail, telecom, and new energy expansion.' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: '₹3,920.00', change: '+0.45%', pe: '29.2x', note: 'Operating margins resilient at 24.5% with strong deal pipeline.' }
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
