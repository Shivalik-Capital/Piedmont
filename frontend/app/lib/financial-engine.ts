import { INSTITUTIONAL_COMPANIES, CompanyData } from './company-database';

export interface TransmissionVector {
  factor: string;
  target: string;
  direction: 'headwind' | 'tailwind' | 'neutral';
  mechanism: string;
  impactMetrics: string[];
  historicalPrecedent: string;
}

export interface CopilotResponse {
  queryType: 'transmission' | 'company_diagnostic' | 'peer_comparison' | 'macro_outlook' | 'general';
  executiveSummary: string;
  quantitativeMetrics: { label: string; value: string; stance: 'positive' | 'negative' | 'neutral' }[];
  transmissionVectors?: TransmissionVector[];
  duPontBreakdown?: {
    roe: string;
    netMargin: string;
    assetTurnover: string;
    equityMultiplier: string;
    commentary: string;
  };
  risksAndMonitors: string[];
  sourceModel: 'Deterministic Institutional Engine (Tier 1)' | 'Gemini 2.5 Flash Free (Tier 2)' | 'Groq LPU Free (Tier 3)' | 'Custom BYOK';
}

// 1. Cross-Asset Transmission Matrix
export const TRANSMISSION_MATRIX: Record<string, Record<string, {
  direction: 'headwind' | 'tailwind' | 'neutral';
  mechanism: string;
  impactMetrics: string[];
  historicalPrecedent: string;
}>> = {
  crude_oil: {
    paints: {
      direction: 'headwind',
      mechanism: 'Crude derivatives (solvents, phthalic anhydride, monomers) account for 50-55% of raw material COGS in decorative and industrial paints. Rising crude compresses gross margins if pricing power cannot immediately offset cost inflation.',
      impactMetrics: ['Gross Margin: -80 to -120 bps per 10% crude spike', 'Working Capital Cycle: +5-7 days'],
      historicalPrecedent: 'During the 2021-2022 crude spike ($80 to $120), Asian Paints gross margins contracted from 44.3% to 36.8% before gradual pricing recovery.'
    },
    aviation: {
      direction: 'headwind',
      mechanism: 'Aviation Turbine Fuel (ATF) constitutes 38-42% of airline operating costs. Inability to pass on fuel surcharges due to price elasticity compresses EBITDAR.',
      impactMetrics: ['EBITDAR Margin: -150 to -250 bps per 10% crude spike', 'Fuel Cost per Available Seat Kilometer (CASK)'],
      historicalPrecedent: 'In Q1 FY23, IndiGo posted a net loss despite record load factors as fuel expense surged 210% YoY.'
    },
    logistics_quick_commerce: {
      direction: 'headwind',
      mechanism: 'Directly escalates delivery fleet operating costs. Platforms (Swiggy, Zomato, Delhivery) must absorb fuel surcharges or risk order drop-offs if delivery fees are raised.',
      impactMetrics: ['Contribution Margin per Order: -₹1.5 to -₹3.0', 'Driver Partner Incentive Payouts'],
      historicalPrecedent: 'During 2022 fuel price highs, quick-commerce platforms introduced variable distance fees to stem contribution margin erosion.'
    },
    omc: {
      direction: 'headwind',
      mechanism: 'State-owned Oil Marketing Companies (BPCL, IOC, HPCL) suffer marketing margin compression when retail pump prices remain frozen while international crude realizations climb.',
      impactMetrics: ['Marketing Margin: From +₹4.5/L to negative', 'Under-recoveries / Subsidy Dependency'],
      historicalPrecedent: 'In 2022, OMCs posted negative marketing margins exceeding -₹10/litre on diesel when retail prices were held constant.'
    },
    upstream_oil: {
      direction: 'tailwind',
      mechanism: 'Directly expands net crude oil realization per barrel, generating operational leverage and expanding EBITDA margins up to windfall tax caps.',
      impactMetrics: ['Net Realization per Barrel', 'Free Cash Flow Yield'],
      historicalPrecedent: 'ONGC quarterly EBITDA doubled in FY23 as net realizations surpassed $100/barrel before windfall tax implementation.'
    }
  },
  repo_rate: {
    banks: {
      direction: 'neutral',
      mechanism: 'Rate hikes expand Net Interest Margins (NIM) in the short term as floating-rate loans reprice immediately while deposits reprice with a 6-12 month lag. Rate cuts reverse this dynamic.',
      impactMetrics: ['Net Interest Margin (NIM): +/- 15 to 25 bps', 'Credit Growth Elasticity'],
      historicalPrecedent: 'During the 2022-2023 RBI hiking cycle (4.00% to 6.50%), Indian private banks achieved record NIMs above 4.2%.'
    },
    realty: {
      direction: 'tailwind',
      mechanism: 'Rate cuts decrease retail home loan interest rates, lowering EMI affordability ratios and driving housing pre-sales and inventory absorption.',
      impactMetrics: ['Home Loan Affordability Index', 'Residential Pre-sales Velocity', 'Debt Servicing Ratio'],
      historicalPrecedent: 'The 2020-2021 record low 4.00% repo rate triggered a multi-year residential real estate bull cycle across Mumbai, NCR, and Bengaluru.'
    },
    autos: {
      direction: 'tailwind',
      mechanism: 'Over 75% of passenger vehicles and 90% of commercial vehicles in India are financed. Lower financing rates directly reduce monthly EMI burdens.',
      impactMetrics: ['Retail Dealer Footfalls', 'Inventory Days', 'Commercial Vehicle Replacement Demand'],
      historicalPrecedent: 'Vehicle financing rate reductions historically drive double-digit volume growth in entry-level passenger vehicles and light commercial vehicles.'
    }
  },
  usd_inr: {
    it_services: {
      direction: 'tailwind',
      mechanism: 'Indian IT majors bill 60-70% of contracts in USD, 15% in EUR/GBP, while 65%+ of their operating cost base (salaries, overhead) is in Indian Rupees. Rupee depreciation yields immediate margin expansion.',
      impactMetrics: ['Operating EBIT Margin: +25 to +30 bps per 1% USD/INR depreciation', 'Constant-currency to Reported Realization Gap'],
      historicalPrecedent: 'During the 2018 rupee depreciation from 65 to 74, TCS and Infosys operating margins absorbed wage hikes without margin contraction.'
    },
    pharma: {
      direction: 'tailwind',
      mechanism: 'Export-oriented generic pharmaceutical manufacturers receive higher rupee realizations on US and European FDA-approved filings.',
      impactMetrics: ['US Formulation Realizations', 'Export Gross Margin'],
      historicalPrecedent: 'Sun Pharma and Dr. Reddys sustained gross margins above 70% during periods of secular rupee depreciation.'
    }
  }
};

// 2. Query Resolver & Semantic Parser
export function parseAndAnalyzeFinancialQuery(query: string): CopilotResponse {
  const normalized = query.toLowerCase();

  // Check for company-specific queries
  for (const [symbol, comp] of Object.entries(INSTITUTIONAL_COMPANIES)) {
    const nameMatch = normalized.includes(comp.info.name.toLowerCase());
    const symbolMatch = normalized.includes(symbol.toLowerCase());

    if (nameMatch || symbolMatch) {
      return generateCompanyDiagnostic(symbol, comp, normalized);
    }
  }

  // Check for Swiggy / Zomato special mentions
  if (normalized.includes('swig') || normalized.includes('swiggy')) {
    return generateSwiggyLogisticsAnalysis(normalized);
  }

  // Check for Crude Oil transmission queries
  if (normalized.includes('crude') || normalized.includes('oil') || normalized.includes('brent')) {
    return generateCrudeTransmissionAnalysis(normalized);
  }

  // Check for RBI Repo Rate / Interest Rate queries
  if (normalized.includes('repo') || normalized.includes('interest rate') || normalized.includes('rbi') || normalized.includes('rate cut')) {
    return generateRepoRateAnalysis(normalized);
  }

  // Check for Currency / USD-INR queries
  if (normalized.includes('rupee') || normalized.includes('usd') || normalized.includes('dollar') || normalized.includes('inr')) {
    return generateUsdInrAnalysis(normalized);
  }

  // General Macro Synthesis Fallback
  return generateMacroGeneralSynthesis();
}

// 3. Generators for specific domains
function generateCompanyDiagnostic(symbol: string, comp: CompanyData, query: string): CopilotResponse {
  const peVal = comp.metrics.pe?.value ?? 20;
  const roeVal = comp.metrics.roe?.value ?? 15;
  const pbVal = comp.metrics.pb?.value ?? 2.5;
  const debtVal = comp.metrics.debtToEquity?.value ?? 0.3;
  const divVal = comp.metrics.dividendYield?.value ?? 1.0;
  const revVal = comp.metrics.revenue?.value ?? 100000;
  const revFormatted = comp.metrics.revenue?.formatted ?? '₹1.0L Cr';
  const profitVal = comp.metrics.netProfit?.value ?? 15000;

  const isPEHigh = peVal > 30;
  const isROEStrong = roeVal > 15;
  const isDebtLow = debtVal < 0.5;

  // Compute DuPont ROE Breakdown
  // ROE = (Net Profit / Revenue) * (Revenue / Assets) * (Assets / Equity)
  const netMargin = revVal > 0 ? (profitVal / revVal) * 100 : 12;
  const equityMultiplier = 1 + debtVal;
  const assetTurnover = netMargin * equityMultiplier > 0 ? (roeVal / (netMargin * equityMultiplier)).toFixed(2) : '0.85';

  return {
    queryType: 'company_diagnostic',
    executiveSummary: `${comp.info.name} (${symbol}) trades at a P/E multiple of ${peVal.toFixed(1)}x with an ROE of ${roeVal}%. The company exhibits ${isDebtLow ? 'conservative balance sheet leverage' : 'moderate leverage'} and ${isROEStrong ? 'superior capital allocation efficiency' : 'subdued asset efficiency'}.`,
    quantitativeMetrics: [
      { label: 'Price-to-Earnings', value: `${peVal.toFixed(1)}x`, stance: isPEHigh ? 'negative' : 'positive' },
      { label: 'Price-to-Book', value: `${pbVal.toFixed(1)}x`, stance: pbVal > 4 ? 'negative' : 'positive' },
      { label: 'Return on Equity', value: `${roeVal}%`, stance: isROEStrong ? 'positive' : 'negative' },
      { label: 'Debt to Equity', value: `${debtVal.toFixed(2)}x`, stance: isDebtLow ? 'positive' : 'neutral' },
      { label: 'Dividend Yield', value: `${divVal}%`, stance: 'neutral' },
      { label: 'TTM Revenue', value: revFormatted, stance: 'positive' }
    ],
    duPontBreakdown: {
      roe: `${roeVal}%`,
      netMargin: `${netMargin.toFixed(1)}%`,
      assetTurnover: `${assetTurnover}x`,
      equityMultiplier: `${equityMultiplier.toFixed(2)}x`,
      commentary: `The Return on Equity of ${roeVal}% is driven primarily by an operating net margin of ${netMargin.toFixed(1)}% and an asset turnover velocity of ${assetTurnover}x, backed by prudent financial leverage.`
    },
    risksAndMonitors: [
      `Sensitivity to sector raw material input costs and domestic volume demand cycles.`,
      `Upcoming quarterly earnings release and constant-currency revenue guidance.`,
      `Foreign Institutional Investor (FII) ownership shifts in large-cap benchmark indices.`
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateCrudeTransmissionAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'transmission',
    executiveSummary: `Crude oil fluctuations exert direct asymmetric transmission across Indian sectors. Upstream producers gain operational leverage, while decorative paints, aviation, and quick-commerce delivery platforms absorb direct margin compression.`,
    quantitativeMetrics: [
      { label: 'Crude Benchmark (Brent)', value: '$74.20 / bbl', stance: 'neutral' },
      { label: 'Paints Margin Sensitivity', value: '-80 to -120 bps per 10% spike', stance: 'negative' },
      { label: 'Aviation Fuel Cost Share', value: '40% of Operating Expenses', stance: 'negative' },
      { label: 'Upstream Realization', value: 'Direct EBITDA Expansion', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'Brent Crude Oil',
        target: 'Asian Paints / Decorative Paints',
        direction: 'headwind',
        mechanism: TRANSMISSION_MATRIX.crude_oil.paints.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.crude_oil.paints.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.crude_oil.paints.historicalPrecedent
      },
      {
        factor: 'Brent Crude Oil',
        target: 'Quick Commerce / Swiggy / Zomato',
        direction: 'headwind',
        mechanism: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.historicalPrecedent
      },
      {
        factor: 'Brent Crude Oil',
        target: 'Aviation (IndiGo)',
        direction: 'headwind',
        mechanism: TRANSMISSION_MATRIX.crude_oil.aviation.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.crude_oil.aviation.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.crude_oil.aviation.historicalPrecedent
      }
    ],
    risksAndMonitors: [
      'Middle Eastern geopolitical risk premiums affecting daily tanker freight rates.',
      'OPEC+ supply quota compliance and voluntary production roll-forward decisions.',
      'Domestic retail auto fuel excise duty adjustments by the Ministry of Petroleum.'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateSwiggyLogisticsAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'transmission',
    executiveSummary: `Swiggy and quick-commerce platforms operate on thin contribution margins per order. Crude oil spikes directly elevate two-wheeler fleet fuel surcharges and partner compensation, tightening EBITDA margins unless offset by order take-rate increases.`,
    quantitativeMetrics: [
      { label: 'Delivery Cost Share', value: '55-65% of Order Take-Rate', stance: 'negative' },
      { label: 'Crude Sensitivity', value: '-₹2.0 Contribution Margin per ₹10 Fuel Rise', stance: 'negative' },
      { label: 'Average Order Value (AOV)', value: '₹420 Food / ₹490 Instamart', stance: 'neutral' },
      { label: 'Take Rate Benchmark', value: '18-22%', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'Petrol / Fuel Prices',
        target: 'Last-Mile Delivery Fleets',
        direction: 'headwind',
        mechanism: 'Delivery partners require variable distance compensation adjustments when retail petrol prices rise. Platforms must either absorb this in platform EBITDA or introduce surge delivery fees, risking customer order cart abandonment.',
        impactMetrics: ['Contribution Margin per Order: -₹1.50 to -₹2.50', 'Fleet Attrition & Surcharge Burn'],
        historicalPrecedent: 'In 2022, metro fuel prices reaching ₹105-110/litre forced major platforms to introduce tiered distance fees and increase customer subscription hurdle rates.'
      }
    ],
    risksAndMonitors: [
      'Transition speed to Electric Vehicle (EV) fleets to decouple delivery costs from oil prices.',
      'Dark store density optimization to shorten delivery radii under 2.5 kilometers.',
      'Consumer price sensitivity regarding platform convenience fees.'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateRepoRateAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    executiveSummary: `The RBI Repo Rate currently stands at 5.50%. Monetary policy shifts transmit through bank credit spreads, corporate borrowing costs, and residential housing affordability.`,
    quantitativeMetrics: [
      { label: 'Current RBI Repo Rate', value: '5.50%', stance: 'neutral' },
      { label: 'Reverse Repo / SDF', value: '3.35% / 5.00%', stance: 'neutral' },
      { label: 'CPI Inflation (Oct 2026)', value: '5.54%', stance: 'negative' },
      { label: 'Bank Nifty NIM Sensitivity', value: '+/- 20 bps per 50 bps move', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'RBI Repo Rate',
        target: 'Banking Sector (Bank Nifty)',
        direction: 'neutral',
        mechanism: TRANSMISSION_MATRIX.repo_rate.banks.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.repo_rate.banks.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.repo_rate.banks.historicalPrecedent
      },
      {
        factor: 'RBI Repo Rate',
        target: 'Real Estate & Infrastructure',
        direction: 'tailwind',
        mechanism: TRANSMISSION_MATRIX.repo_rate.realty.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.repo_rate.realty.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.repo_rate.realty.historicalPrecedent
      }
    ],
    risksAndMonitors: [
      'Upcoming RBI Monetary Policy Committee (MPC) meeting (Dec 2-4, 2026).',
      'Food inflation prints (vegetables, pulses) impacting headline CPI vs 4% medium-term target.',
      'US Federal Reserve rate trajectory and sovereign yield spread.'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateUsdInrAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    executiveSummary: `USD/INR currently trades at 84.15 backed by historic RBI foreign exchange reserves of $721.0 Billion. Rupee depreciation acts as an operational tailwind for IT and Pharmaceuticals, while creating input cost inflation for imported commodities and capital goods.`,
    quantitativeMetrics: [
      { label: 'USD/INR Exchange Rate', value: '84.15', stance: 'neutral' },
      { label: 'Forex Reserves', value: '$721.0 Billion', stance: 'positive' },
      { label: 'IT EBIT Sensitivity', value: '+25 to +30 bps per 1% depreciation', stance: 'positive' },
      { label: 'Import Inflation Burden', value: 'Electronic components & crude', stance: 'negative' }
    ],
    transmissionVectors: [
      {
        factor: 'USD/INR Depreciation',
        target: 'Information Technology (Nifty IT)',
        direction: 'tailwind',
        mechanism: TRANSMISSION_MATRIX.usd_inr.it_services.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.usd_inr.it_services.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.usd_inr.it_services.historicalPrecedent
      }
    ],
    risksAndMonitors: [
      'RBI foreign exchange spot and forward market interventions to manage volatility.',
      'US Dollar Index (DXY) momentum and global trade balance fluctuations.',
      'Foreign Portfolio Investor (FPI) debt and equity flow trends.'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateMacroGeneralSynthesis(): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    executiveSummary: `The Indian macroeconomic framework exhibits resilient domestic growth (GDP 7.2%, IIP 8.0%) alongside elevated wholesale inflation (WPI 11.39%) and moderate consumer price pressure (CPI 5.54%). Corporate balance sheets remain healthy with low non-performing assets.`,
    quantitativeMetrics: [
      { label: 'GDP Growth Rate', value: '7.2%', stance: 'positive' },
      { label: 'CPI Inflation', value: '5.54%', stance: 'neutral' },
      { label: 'WPI Inflation', value: '11.39%', stance: 'negative' },
      { label: 'Manufacturing PMI', value: '55.1', stance: 'positive' },
      { label: 'RBI Repo Rate', value: '5.50%', stance: 'neutral' },
      { label: 'Forex Reserves', value: '$721.0B', stance: 'positive' }
    ],
    risksAndMonitors: [
      'WPI-CPI spread divergence indicating latent manufacturing cost pressures.',
      'RBI MPC stance ahead of the December policy meeting.',
      'Global crude oil price movements and logistics supply chain fluidity.'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}
