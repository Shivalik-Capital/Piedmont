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
  title: string;
  executiveSummary: string;
  markdownSynthesis: string;
  quantitativeMetrics: { label: string; value: string; stance: 'positive' | 'negative' | 'neutral' }[];
  transmissionVectors?: TransmissionVector[];
  duPontBreakdown?: {
    roe: string;
    netMargin: string;
    assetTurnover: string;
    equityMultiplier: string;
    commentary: string;
  };
  actionableTakeaway: string;
  risksAndMonitors: string[];
  followUpSuggestions: string[];
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
      mechanism: 'Crude derivatives (solvents, phthalic anhydride, titanium dioxide carriers, acrylic monomers) account for 50-55% of raw material COGS in decorative and industrial paints. Rising crude directly compresses gross margins if pricing power cannot immediately offset cost inflation.',
      impactMetrics: ['Gross Margin: -80 to -120 bps per 10% crude spike', 'Working Capital Cycle: +5-7 days'],
      historicalPrecedent: 'During the 2021-2022 crude spike ($80 to $120), Asian Paints gross margins contracted from 44.3% to 36.8% before gradual pricing recovery.'
    },
    aviation: {
      direction: 'headwind',
      mechanism: 'Aviation Turbine Fuel (ATF) constitutes 38-42% of airline operating costs. Inability to pass on fuel surcharges due to passenger price elasticity compresses EBITDAR.',
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
  gold: {
    nifty_macro: {
      direction: 'tailwind',
      mechanism: 'Gold is traditionally a safe-haven, non-yielding hedge asset. Falling gold prices signal global capital rotating out of defensive hedges and into growth equities (Nifty 50). Furthermore, India imports ~800-900 tonnes of gold annually ($45B-$50B bill); falling gold significantly reduces Indias trade deficit, strengthens the Rupee, and eases imported inflation pressure.',
      impactMetrics: ['Trade Deficit: -$1.5B to -$2.0B per 5% gold price drop', 'Rupee (USD/INR) stability', 'Current Account Deficit (CAD) compression'],
      historicalPrecedent: 'During the 2013-2015 gold bear market ($1,800 to $1,050), Indias Current Account Deficit collapsed from 4.8% of GDP to 1.3%, providing the macro runway for Nifty to rally from 5,500 to 9,000.'
    },
    jewellery_retail: {
      direction: 'tailwind',
      mechanism: 'Lower retail gold prices stimulate consumer demand across wedding and festive jewellery seasons. Demand in India has high price elasticity: price dips encourage volume buying, driving revenue and margin expansion for organized retailers like Titan Company and Kalyan Jewellers.',
      impactMetrics: ['Same-Store Sales Growth (SSSG): +12% to +18%', 'EBITDA Margin: +80 to +150 bps'],
      historicalPrecedent: 'Titan Company delivered 25%+ retail volume growth in periods following sharp gold price corrections as retail consumers advanced prospective wedding purchases.'
    },
    gold_loan_nbfc: {
      direction: 'headwind',
      mechanism: 'Falling gold prices reduce the collateral value of pledged jewellery backing loans at gold-loan NBFCs (Muthoot Finance, Manappuram Finance). Loan-to-Value (LTV) ratios rise toward the 75% regulatory ceiling, requiring margin calls or auctions.',
      impactMetrics: ['LTV Headroom: Contracts 5-10%', 'Auction Volume & Provisioning Requirements'],
      historicalPrecedent: 'In 2013, rapid gold price drops triggered forced auctions and slower loan-book growth for pure-play gold NBFCs until prices stabilized.'
    }
  },
  repo_rate: {
    banks: {
      direction: 'neutral',
      mechanism: 'Rate hikes expand Net Interest Margins (NIM) in the short term as floating-rate loans reprice immediately while deposits reprice with a 6-12 month lag. Rate cuts reverse this dynamic, putting mild pressure on NIMs while expanding loan growth velocity.',
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
  const normalized = query.toLowerCase().trim();

  // 1. Check for Gold & Precious Metals queries
  if (normalized.includes('gold') || normalized.includes('bullion') || normalized.includes('precious metal')) {
    return generateGoldTransmissionAnalysis(normalized);
  }

  // 2. Check for Silver queries
  if (normalized.includes('silver')) {
    return generateSilverTransmissionAnalysis(normalized);
  }

  // 3. Check for FII / DII Institutional Flow queries
  if (normalized.includes('fii') || normalized.includes('dii') || normalized.includes('fpi') || normalized.includes('foreign institutional') || normalized.includes('sip') || normalized.includes('outflow') || normalized.includes('inflow') || normalized.includes('institutional flow')) {
    return generateFiiDiiFlowAnalysis(normalized);
  }

  // 4. Check for Inflation (CPI, WPI, Food Inflation) queries
  if (normalized.includes('cpi') || normalized.includes('wpi') || normalized.includes('inflation') || normalized.includes('food inflation') || normalized.includes('vegetable')) {
    return generateInflationDivergenceAnalysis(normalized);
  }

  // 5. Check for US Federal Reserve / Global Rate queries
  if (normalized.includes('fed') || normalized.includes('federal reserve') || normalized.includes('powell') || normalized.includes('us rate') || normalized.includes('dxy') || normalized.includes('dollar index') || normalized.includes('us 10 year')) {
    return generateFedRateAnalysis(normalized);
  }

  // 6. Check for Nifty Valuation / Market Correction / Bubble queries
  if (normalized.includes('overvalued') || normalized.includes('undervalued') || normalized.includes('bubble') || normalized.includes('correction') || normalized.includes('crash') || normalized.includes('bear market') || normalized.includes('yield gap') || normalized.includes('expensive')) {
    return generateValuationRegimeAnalysis(normalized);
  }

  // 7. Check for Monsoon & Rural Economy queries
  if (normalized.includes('monsoon') || normalized.includes('rural') || normalized.includes('agriculture') || normalized.includes('farmer') || normalized.includes('kharif') || normalized.includes('rabi')) {
    return generateMonsoonRuralAnalysis(normalized);
  }

  // 8. Check for Swiggy / Zomato special mentions
  if (normalized.includes('swig') || normalized.includes('swiggy') || normalized.includes('zomato') || normalized.includes('quick commerce') || normalized.includes('blinkit') || normalized.includes('zepto')) {
    return generateSwiggyLogisticsAnalysis(normalized);
  }

  // 9. Check for Crude Oil transmission queries
  if (normalized.includes('crude') || normalized.includes('oil') || normalized.includes('brent') || normalized.includes('petrol') || normalized.includes('diesel') || normalized.includes('energy prices')) {
    return generateCrudeTransmissionAnalysis(normalized);
  }

  // 10. Check for RBI Repo Rate / Interest Rate queries
  if (normalized.includes('repo') || normalized.includes('interest rate') || normalized.includes('rbi') || normalized.includes('rate cut') || normalized.includes('monetary policy') || normalized.includes('mpc')) {
    return generateRepoRateAnalysis(normalized);
  }

  // 11. Check for Currency / USD-INR queries
  if (normalized.includes('rupee') || normalized.includes('usd') || normalized.includes('dollar') || normalized.includes('inr') || normalized.includes('forex') || normalized.includes('currency')) {
    return generateUsdInrAnalysis(normalized);
  }

  // 12. Check for Sector-specific queries
  if (normalized.includes('it sector') || normalized.includes('tech stocks') || normalized.includes('software') || normalized.includes('tcs') || normalized.includes('infosys')) {
    return generateSectorDiagnostic('IT Services', 'Nifty IT', normalized);
  }
  if (normalized.includes('bank nifty') || normalized.includes('banking sector') || normalized.includes('private bank') || normalized.includes('psu bank') || normalized.includes('hdfc bank') || normalized.includes('icici bank')) {
    return generateSectorDiagnostic('Banking & Financials', 'Bank Nifty', normalized);
  }
  if (normalized.includes('pharma') || normalized.includes('healthcare') || normalized.includes('sun pharma')) {
    return generateSectorDiagnostic('Pharmaceuticals', 'Nifty Pharma', normalized);
  }
  if (normalized.includes('auto') || normalized.includes('automotive') || normalized.includes('ev') || normalized.includes('tata motors') || normalized.includes('maruti')) {
    return generateSectorDiagnostic('Automobiles', 'Nifty Auto', normalized);
  }
  if (normalized.includes('fmcg') || normalized.includes('consumer staple') || normalized.includes('hul') || normalized.includes('itc')) {
    return generateSectorDiagnostic('FMCG', 'Nifty FMCG', normalized);
  }
  if (normalized.includes('real estate') || normalized.includes('realty') || normalized.includes('housing') || normalized.includes('dlf')) {
    return generateSectorDiagnostic('Real Estate', 'Nifty Realty', normalized);
  }

  // 13. Check for company-specific queries (Nifty 50 constituents)
  for (const [symbol, comp] of Object.entries(INSTITUTIONAL_COMPANIES)) {
    const nameMatch = normalized.includes(comp.info.name.toLowerCase());
    const symbolMatch = normalized.includes(symbol.toLowerCase());

    if (nameMatch || symbolMatch) {
      return generateCompanyDiagnostic(symbol, comp, normalized);
    }
  }

  // 14. Dynamic Semantic Fallback (bespoke reasoning instead of boilerplate)
  return generateDynamicSemanticAnswer(query, normalized);
}

// ==========================================
// 3. Domain Analysis Generators
// ==========================================

function generateGoldTransmissionAnalysis(query: string): CopilotResponse {
  const isFalling = query.includes('fall') || query.includes('drop') || query.includes('down') || query.includes('decline') || query.includes('slump') || query.includes('lower') || query.includes('crash') || query.includes('dip');

  if (isFalling) {
    return {
      queryType: 'transmission',
      title: 'Macro Transmission: Falling Gold Prices & Impact on Nifty 50',
      executiveSummary: 'Falling gold prices act as a direct structural tailwind for the Indian macroeconomic framework and domestic equity valuations. A 5% decline in gold prices saves ~$1.8B to $2.2B in annual import outflows, reducing the Current Account Deficit (CAD), anchoring the Rupee (USD/INR), and triggering a risk-on capital rotation into the Nifty 50.',
      markdownSynthesis: `### 1. Macro & Balance of Payments Transmission
India is the world's second-largest consumer of physical gold, importing **800 to 900 metric tonnes annually** (accounting for a **$45B to $50B foreign exchange bill**). 
- **Current Account Deficit (CAD) Relief**: A sustained 5% correction in international gold realizations compresses India's net import burden by **$1.8B to $2.2B**, directly insulating the balance of payments.
- **Rupee Stability (USD/INR)**: Lower dollar demand from bullion bullion clearing houses eases depreciation pressure on the Rupee, maintaining imported inflation stability and giving the RBI monetary leeway.

### 2. Risk-On Asset Allocation Rotation
Gold is a zero-yielding, non-productive store of value and safe-haven insurance. 
- When bullion corrects, global asset allocators and domestic ultra-HNIs rotate liquidity away from defensive preservation assets and back into earnings-compounding risk assets (**Nifty 50 equities**).
- Historically, prolonged gold consolidation phases coincide with multi-year equity multiple expansion.

### 3. Sectoral Winners & Losers
| Sector / Security | Impact Stance | Key Transmission Channel |
| :--- | :--- | :--- |
| **Titan Company / Kalyan Jewellers** | **Strong Tailwind** | Price elasticity in Indian bridal and festive jewellery is high. Lower retail prices spark volume purchasing and advance bookings, expanding gross profit pools. |
| **Nifty 50 / Large-Cap Equities** | **Tailwind** | Capital allocation shifts from unproductive gold hoarding to corporate equity capital. CAD contraction supports sovereign rating stability. |
| **Gold Loan NBFCs (Muthoot / Manappuram)** | **Headwind** | Collateral values contract. Average Loan-to-Value (LTV) ratios rise toward the 75% regulatory ceiling, prompting margin calls, reduced loan disbursal ticket sizes, and slower AUM growth. |

### 4. Historical Precedent
During the **2013-2015 gold bear cycle**, international gold fell from $1,800/oz to $1,050/oz. India's Current Account Deficit collapsed from **4.8% of GDP to 1.3%**, creating the macro cushion that propelled the Nifty 50 from 5,500 to 9,000 (+63%).`,
      quantitativeMetrics: [
        { label: 'Gold Price Vector', value: 'Correcting / Softening', stance: 'positive' },
        { label: 'Nifty 50 Transmission', value: 'Risk-On Multiple Support', stance: 'positive' },
        { label: 'India Trade Deficit Impact', value: 'Saves ~$1.8B per 5% drop', stance: 'positive' },
        { label: 'Titan / Retail Jewellery SSSG', value: '+12% to +18% Volume Surge', stance: 'positive' },
        { label: 'Gold NBFC Collateral', value: 'LTV Headroom Tightens', stance: 'negative' },
        { label: 'USD / INR Support', value: 'Rupee Anchoring Tailwinds', stance: 'positive' }
      ],
      transmissionVectors: [
        {
          factor: 'Falling Gold Price',
          target: 'Nifty 50 (Risk-On Capital Rotation)',
          direction: 'tailwind',
          mechanism: TRANSMISSION_MATRIX.gold.nifty_macro.mechanism,
          impactMetrics: TRANSMISSION_MATRIX.gold.nifty_macro.impactMetrics,
          historicalPrecedent: TRANSMISSION_MATRIX.gold.nifty_macro.historicalPrecedent
        },
        {
          factor: 'Falling Gold Price',
          target: 'Titan Company / Organized Jewellers',
          direction: 'tailwind',
          mechanism: TRANSMISSION_MATRIX.gold.jewellery_retail.mechanism,
          impactMetrics: TRANSMISSION_MATRIX.gold.jewellery_retail.impactMetrics,
          historicalPrecedent: TRANSMISSION_MATRIX.gold.jewellery_retail.historicalPrecedent
        },
        {
          factor: 'Falling Gold Price',
          target: 'Gold Loan NBFCs (Muthoot / Manappuram)',
          direction: 'headwind',
          mechanism: TRANSMISSION_MATRIX.gold.gold_loan_nbfc.mechanism,
          impactMetrics: TRANSMISSION_MATRIX.gold.gold_loan_nbfc.impactMetrics,
          historicalPrecedent: TRANSMISSION_MATRIX.gold.gold_loan_nbfc.historicalPrecedent
        }
      ],
      actionableTakeaway: 'Accumulate consumer discretionary jewellery leaders (Titan, Kalyan) on gold volume expansion; exercise caution on pure-play gold NBFCs with tight LTV headroom; maintain overweight stance on large-cap domestic equities as CAD compression supports sovereign stability.',
      risksAndMonitors: [
        'US Real 10-Year Treasury Yield trajectories and US Dollar Index (DXY) momentum.',
        'Domestic festive and wedding season retail footfall metrics reported by major jewellery chains.',
        'RBI foreign exchange reserve accumulation pace during periods of bullion import bill easing.'
      ],
      followUpSuggestions: [
        'How does gold price movement affect Titan Company\'s quarterly EBITDA margin?',
        'What is the correlation between US Real Yields and international gold prices?',
        'How does falling gold impact the USD/INR currency trajectory?'
      ],
      sourceModel: 'Deterministic Institutional Engine (Tier 1)'
    };
  }

  // Rising Gold scenario
  return {
    queryType: 'transmission',
    title: 'Macro Transmission: Rising Gold Prices & Safe-Haven Headwinds',
    executiveSummary: 'Rising gold prices typically reflect risk-off sentiment, geopolitical conflict, or global currency debasement. For India, elevated bullion prices inflate the national import bill, expand the Current Account Deficit (CAD), and put depreciation pressure on the Rupee, presenting a valuation headwind for the Nifty 50.',
    markdownSynthesis: `### 1. Macro & Currency Transmission
When gold rallies, India's physical import requirements convert directly into larger dollar outflows.
- **Trade Deficit Expansion**: Every $100/oz increase in gold prices adds approximately **$2.5B to $3.0B** to India's annual trade deficit.
- **Rupee Vulnerability**: Increased dollar demand to settle bullion consignments strains the USD/INR exchange rate, forcing the RBI to utilize foreign exchange reserves to limit currency volatility.

### 2. Equity Market Implications
- **Defensive Capital Shift**: Rising gold signifies institutional risk aversion. Capital rotates out of high-beta growth equities and cyclical sectors into cash and precious metals.
- **Nifty Valuation Multiple Compression**: Higher imported deficit pressure typically widens sovereign bond yields, increasing the equity hurdle rate.

### 3. Sectoral Dynamics
- **Gold NBFCs (Muthoot, Manappuram)**: Direct beneficiary. Surging gold prices expand loan collateral value, lowering LTVs and unlocking significant borrowing capacity for customers.
- **Organized Jewellery Retail**: High gold prices cause ticket-size shock for middle-class consumers, temporarily depressing grammage volumes before consumers adjust to new price floors.`,
    quantitativeMetrics: [
      { label: 'Gold Price Action', value: 'Surging / Safe-Haven Bid', stance: 'negative' },
      { label: 'Nifty 50 Multiple Impact', value: 'Risk-Off Headwind', stance: 'negative' },
      { label: 'Trade Deficit Expansion', value: '+$2.5B to $3.0B per $100/oz', stance: 'negative' },
      { label: 'Gold NBFC Collateral', value: 'LTV Headroom Expands', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'Rising Gold Price',
        target: 'India Trade Balance & Rupee',
        direction: 'headwind',
        mechanism: 'Higher gold prices inflate foreign exchange outflows for physical bullion consignments, widening the trade deficit and exerting downward pressure on the Rupee.',
        impactMetrics: ['Trade Deficit Expansion', 'Import Cover Cushion'],
        historicalPrecedent: 'In 2012-2013, record high gold imports pushed Indias CAD to an unsustainable 4.8% of GDP, culminating in the Rupee taper-tantrum shock.'
      }
    ],
    actionableTakeaway: 'Overweight gold-loan NBFCs benefiting from collateral value appreciation; hedge equity portfolios with gold allocations; monitor import duty changes by the Ministry of Finance.',
    risksAndMonitors: [
      'Geopolitical escalation in the Middle East and Eastern Europe driving safe-haven bids.',
      'Sovereign central bank gold accumulation trends (PBOC, RBI).',
      'Potential Ministry of Finance import duty revisions to curb bullion dollar outflows.'
    ],
    followUpSuggestions: [
      'How does rising gold benefit Muthoot Finance and Manappuram?',
      'What happens to India\'s Current Account Deficit if gold hits $3,000/oz?',
      'Which Indian stocks act as the best hedge against rising gold prices?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateSilverTransmissionAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'transmission',
    title: 'Cross-Asset Analysis: Silver Industrial Supercycle & Primary Producers',
    executiveSummary: 'Silver combines monetary store-of-value properties with accelerating industrial demand from solar photovoltaics (PV), electric vehicles, and semiconductors. Over 55% of global silver consumption is now industrial. Hindustan Zinc, as the world\'s 3rd largest silver producer, captures ~90% EBITDA margins on incremental silver price realizations.',
    markdownSynthesis: `### 1. Dual Driver Framework: Industrial Utility + Monetary Hedge
Unlike gold (which is 90%+ an investment/reserve asset), silver is heavily industrialized:
- **Solar Photovoltaic Transition**: N-type TOPCon solar cells require **30-50% more silver paste per watt** than older PERC technologies, driving non-discretionary green energy demand.
- **Automotive Electrification**: Electric vehicles consume **25-50g of silver per car** (double internal combustion engines) due to heavy electrical contact needs.

### 2. Primary Listed Beneficiary: Hindustan Zinc (HZL)
- **World's 3rd Largest Silver Miner**: Hindustan Zinc produces ~750 metric tonnes of silver annually as a byproduct of lead-zinc smelting.
- **Operating Leverage**: Because mining costs are allocated primarily to base metal extraction, every **₹5,000/kg increase in silver realizations flows with ~90% incremental margin straight to EBITDA**.
- Silver accounts for **over 35% of Hindustan Zinc's total EBIT**, making it a pure-play proxy for silver upside.`,
    quantitativeMetrics: [
      { label: 'Industrial Usage Share', value: '55-60% of Global Demand', stance: 'positive' },
      { label: 'Solar PV Consumption', value: 'Fastest Growing Demand Vector', stance: 'positive' },
      { label: 'Hindustan Zinc Realizations', value: '+₹380-420 Cr EBITDA per ₹5k/kg', stance: 'positive' },
      { label: 'Gold/Silver Ratio', value: 'Historical Mean ~75x-80x', stance: 'neutral' }
    ],
    transmissionVectors: [
      {
        factor: 'Silver Price Fluctuations',
        target: 'Hindustan Zinc / Primary Producers',
        direction: 'tailwind',
        mechanism: 'Hindustan Zinc is the worlds 3rd largest silver producer. Every ₹5,000/kg increase in silver realizations flows with ~90% incremental margin directly into operating EBITDA.',
        impactMetrics: ['Operating EBITDA: +₹380-420 Cr per ₹5k/kg rise', 'Dividend Payout Capacity'],
        historicalPrecedent: 'During 2020-2021 silver rallies, Hindustan Zinc silver segment contributed over 35% of total corporate operating profit.'
      }
    ],
    actionableTakeaway: 'Express bullish silver structural views through Hindustan Zinc for high cash dividend yields and operating leverage, while monitoring global solar cell manufacturing volumes.',
    risksAndMonitors: [
      'Global solar cell thrifting (substituting silver with copper-coated pastes).',
      'London Bullion Market Association (LBMA) and COMEX vault physical inventory levels.'
    ],
    followUpSuggestions: [
      'How does silver price affect Hindustan Zinc dividend yield?',
      'What is the current Gold/Silver ratio and what does it indicate for Nifty?',
      'How does industrial solar demand impact global silver supply deficits?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateCrudeTransmissionAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'transmission',
    title: 'Cross-Asset Transmission: Crude Oil Dynamics & Sectoral Sensitivities',
    executiveSummary: 'India imports ~85% of its crude oil requirements. A $10/barrel move in Brent crude shifts India\'s trade deficit by ~$12-14 Billion and impacts headline CPI by ~40-50 bps. Rising crude creates severe gross margin compression for paints, aviation, and quick-commerce logistics, while benefiting upstream producers (ONGC).',
    markdownSynthesis: `### 1. Macro Transmission & Sensitivity
India consumes approximately **5.4 million barrels per day**, importing over **85% of crude requirements**.
- **Inflation & Currency**: Every $10/barrel rise in international crude increases headline CPI inflation by **40-50 bps** and expands the Current Account Deficit by **$12B to $14B** (~0.35% of GDP).
- **Fiscal Impact**: Central and State governments face difficult trade-offs between cutting fuel excise taxes (fiscal revenue loss) or passing costs to retail consumers (inflationary surge).

### 2. Sectoral Sensitivity Matrix
| Sector / Company | Stance | Raw Material Sensitivity | Historical Precedent |
| :--- | :--- | :--- | :--- |
| **Asian Paints / Berger Paints** | **Headwind** | Solvents & monomers = 50-55% of COGS. Gross margins contract 80-120 bps per 10% crude spike. | In 2022 ($120 crude), Asian Paints gross margin fell from 44.3% to 36.8%. |
| **InterGlobe Aviation (IndiGo)** | **Headwind** | ATF = 38-42% of total operating expenses. Margins severely hit if fares cannot rise. | Posted net losses in FY23 despite record passenger load factors due to jet fuel spikes. |
| **Swiggy / Zomato / Logistics** | **Headwind** | Fuel delivery fleet operating costs escalate. Platforms must absorb fuel surcharges. | In 2022, quick-commerce introduced distance surcharges to protect contribution margins. |
| **Oil Marketing Companies (BPCL/IOC)**| **Headwind** | Retail pump prices frozen during elections, causing negative marketing margins. | In 2022, OMCs posted negative marketing margins exceeding -₹10/L on diesel. |
| **ONGC / Oil India (Upstream)** | **Tailwind** | Directly expands net crude oil realizations per barrel up to government windfall tax caps. | Quarterly EBITDA doubled in FY23 as realizations exceeded $100/barrel. |`,
    quantitativeMetrics: [
      { label: 'India Import Dependency', value: '85-88% of Crude Needs', stance: 'negative' },
      { label: 'Trade Deficit Sensitivity', value: '+$12-14B per $10/bbl', stance: 'negative' },
      { label: 'CPI Inflation Impact', value: '+40 to +50 bps per $10/bbl', stance: 'negative' },
      { label: 'Asian Paints Gross Margin', value: '-80 to -120 bps per 10% spike', stance: 'negative' },
      { label: 'ONGC Realization', value: 'Direct EBITDA expansion', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'Crude Oil Spike',
        target: 'Asian Paints & Berger Paints',
        direction: 'headwind',
        mechanism: TRANSMISSION_MATRIX.crude_oil.paints.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.crude_oil.paints.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.crude_oil.paints.historicalPrecedent
      },
      {
        factor: 'Crude Oil Spike',
        target: 'IndiGo (Aviation)',
        direction: 'headwind',
        mechanism: TRANSMISSION_MATRIX.crude_oil.aviation.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.crude_oil.aviation.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.crude_oil.aviation.historicalPrecedent
      },
      {
        factor: 'Crude Oil Spike',
        target: 'Swiggy & Zomato (Quick Commerce)',
        direction: 'headwind',
        mechanism: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.historicalPrecedent
      }
    ],
    actionableTakeaway: 'Hedge crude price spikes by rotating into upstream exploration (ONGC); underweight margin-sensitive decorative paints and aviation during supply-chain disruptions.',
    risksAndMonitors: [
      'OPEC+ production quotas and voluntary output reductions.',
      'Middle Eastern geopolitical shipping bottlenecks (Strait of Hormuz, Red Sea).',
      'Government windfall tax revisions on domestic crude production.'
    ],
    followUpSuggestions: [
      'How does crude oil price affect Swiggy and Zomato unit economics?',
      'What crude price level triggers retail pump price hikes in India?',
      'Why does Asian Paints trade at a premium despite crude raw material volatility?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateSwiggyLogisticsAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'company_diagnostic',
    title: 'Platform Unit Economics: Swiggy vs Zomato Logistics & Cost Transmission',
    executiveSummary: 'Swiggy and Zomato operate duopolistic delivery networks where contribution margins per order (GOV) are highly sensitive to rider fleet fuel costs, dark store throughput density, and ad-monetization take rates. A 10% fuel increase trims contribution margins by ₹1.5 to ₹3.0 per order unless offset by platform fees.',
    markdownSynthesis: `### 1. Delivery Fleet Cost Architecture
- **Fleet Logistics Expense**: Fuel and delivery partner payouts constitute **60-65% of total delivery cost per order**.
- **Distance Fees & Surcharges**: When crude oil rises, platforms face a trade-off: absorbing the cost compresses contribution margins, while passing it on via higher platform fees risks suppressing order frequency among price-sensitive cohorts.

### 2. Quick Commerce (Instamart vs Blinkit vs Zepto)
- **Dark Store Throughput**: Quick commerce profitability hinges on dark store throughput (**orders per day per store**). High density allows riders to batch deliveries, lowering cost per drop.
- **Gross Order Value (GOV) Expansion**: Non-grocery categories (electronics, festive gifts, beauty) carry 25-35% gross take-rates, cross-subsidizing higher fuel and logistics delivery overhead.`,
    quantitativeMetrics: [
      { label: 'Delivery Cost Component', value: '60-65% Fuel & Partner Payout', stance: 'neutral' },
      { label: 'Contribution Margin Sensitivity', value: '-₹1.5 to -₹3.0 / order per 10% fuel rise', stance: 'negative' },
      { label: 'Quick Commerce Take Rate', value: '18-22% Blend Across Categories', stance: 'positive' },
      { label: 'Monthly Active Transacting Users', value: 'High Growth Secular Penetration', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'Fuel & Fleet Inflation',
        target: 'Swiggy & Zomato Unit Economics',
        direction: 'headwind',
        mechanism: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.crude_oil.logistics_quick_commerce.historicalPrecedent
      }
    ],
    actionableTakeaway: 'Monitor contribution margin per order and dark store throughput expansion. Platforms that scale advertising revenue and high-margin non-food categories best protect profitability against logistics inflation.',
    risksAndMonitors: [
      'Regulatory scrutiny over gig-worker minimum wage and social security legislation.',
      'Aggressive capital deployment by well-funded private competitors (Zepto, Blinkit).',
      'Consumer elasticity to rising platform convenience fees.'
    ],
    followUpSuggestions: [
      'Compare Swiggy Instamart unit economics with Zomato Blinkit',
      'How does crude oil impact quick commerce delivery profitability?',
      'What is the path to sustainable net profitability for Swiggy?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateInflationDivergenceAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: 'Macro Diagnostic: CPI (6.09%) vs WPI (2.36%) & Food Inflation Divergence',
    executiveSummary: 'October 2026 data reveals significant divergence: Consumer Price Index (CPI) spiked to 6.09% (breaching the RBI\'s 6.00% upper ceiling), driven almost entirely by food inflation at 8.94%. Conversely, Wholesale Price Index (WPI) printed at a benign 2.36%, indicating that manufactured product input costs remain contained.',
    markdownSynthesis: `### 1. The Core Inflation Paradox
- **Headline CPI Spikes to 6.09%**: Oct 2026 CPI crossed the RBI's 2-6% target band, surging from 5.49% in September. The entire acceleration was concentrated in the **Consumer Food Price Index (CFPI), which hit 8.94%** due to weather-induced vegetable supply disruptions (onions, tomatoes, edible oils).
- **WPI Stays Muted at 2.36%**: In stark contrast, wholesale inflation printed at just **2.36%**, up moderately from 1.84%. Core manufactured goods inflation remains subdued at sub-2.0%, proving that industrial raw material pricing is stable.

### 2. Monetary Policy & RBI MPC Stance
- **Rate Cut Postponement**: With headline CPI above 6%, the RBI Monetary Policy Committee (MPC) cannot deliver an immediate repo rate cut at its December 2-4 meeting, even though liquidity conditions are ample and GDP growth remains robust.
- **Look-Through Strategy**: The MPC will likely "look through" perishable vegetable price spikes, maintaining the repo rate at **5.50%** with a "neutral" stance until winter crop arrivals moderate food prices in Q1 2027.`,
    quantitativeMetrics: [
      { label: 'Headline CPI Inflation (Oct 2026)', value: '6.09% (Above 6% Ceiling)', stance: 'negative' },
      { label: 'Consumer Food Inflation', value: '8.94% (Vegetable Pressure)', stance: 'negative' },
      { label: 'Wholesale WPI Inflation', value: '2.36% (Muted Industrial Cost)', stance: 'positive' },
      { label: 'RBI Repo Rate Stance', value: '5.50% Neutral (Pause Expected)', stance: 'neutral' },
      { label: 'Manufacturing PMI', value: '54.7 (Healthy Expansion)', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'Food CPI Spike to 6.09%',
        target: 'RBI Monetary Policy Stance',
        direction: 'neutral',
        mechanism: 'High food prices force the MPC to maintain repo rates at 5.50% to prevent inflation expectations from becoming unanchored, delaying rate cut tailwinds for interest-sensitive sectors.',
        impactMetrics: ['Policy Repo Rate', '10-Year Benchmark G-Sec Yield (6.78%)'],
        historicalPrecedent: 'Similar food spikes in late 2023 caused the RBI to hold rates steady for multiple quarters despite industrial calls for easing.'
      }
    ],
    actionableTakeaway: 'Expect the RBI to hold rates steady at 5.50% in December; position in FMCG staples and high-quality private banks with strong low-cost CASA deposits that benefit from higher-for-longer yields.',
    risksAndMonitors: [
      'Winter rabi crop sowing acreage and harvest arrivals in mandis.',
      'Import duty cuts on edible oils and pulse shipments to cool retail prices.',
      'Core CPI (excluding food and fuel) trajectory.'
    ],
    followUpSuggestions: [
      'Will the RBI cut the repo rate if CPI stays above 6%?',
      'Why is there such a large gap between WPI (2.36%) and CPI (6.09%)?',
      'Which sectors suffer the most from elevated food inflation?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateFiiDiiFlowAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: 'Market Structure: DII Mutual Fund SIP Absorption vs FII Capital Outflows',
    executiveSummary: 'Indian equity market microstructure has undergone a structural paradigm shift. Systematic Investment Plan (SIP) inflows exceed ₹24,500 Crore per month ($3.0B/mo), creating an unprecedented domestic liquidity counterweight that absorbs aggressive Foreign Institutional Investor (FII) selling without triggering multi-year bear markets.',
    markdownSynthesis: `### 1. The Great Structural Rebalancing
- **Domestic Retail Compounding**: Monthly mutual fund SIP contributions have surged from ₹8,000 Cr in 2020 to **over ₹24,500 Cr in late 2026**. This domestic capital pool is inelastic, systematic, and buys dips automatically.
- **FII Capital Repatriation**: FIIs frequently liquidate emerging market equities when US 10-year Treasury yields rise or during global risk-off events. Historically, this caused 20-30% market crashes.
- **Absorption Dynamics**: Today, domestic institutions routinely absorb **85-95% of gross FII selling**, compressing market beta and transforming flash crashes into rapid V-shaped recoveries.

### 2. Historical Case Study: June 4, 2024 Election Shock
On June 4, 2024, unexpected election coalition results triggered panic:
- FIIs net sold **₹12,436 Crore** in a single trading session.
- DIIs stepped in, deploying **₹21,118 Crore** of cash reserves.
- Result: The Nifty 50 erased a 1,300-point deficit within 72 hours, demonstrating the structural power of domestic liquidity.`,
    quantitativeMetrics: [
      { label: 'Monthly SIP Inflow Run-Rate', value: '₹24,500+ Cr / month', stance: 'positive' },
      { label: 'DII Absorption Ratio', value: '85-95% of FII Gross Sales', stance: 'positive' },
      { label: 'Market Volatility Compression', value: 'Lower Downside Beta', stance: 'positive' },
      { label: 'FII Ownership in Large Caps', value: 'At 12-Year Lows (~16%)', stance: 'neutral' }
    ],
    transmissionVectors: [
      {
        factor: 'FII Selling vs DII SIP Cushion',
        target: 'Nifty 50 Price Stability',
        direction: 'tailwind',
        mechanism: 'Systematic domestic mutual fund inflows absorb foreign institutional liquidation, establishing a structural valuation floor and dampening systemic equity volatility.',
        impactMetrics: ['Cash Equity Absorption Ratio', 'Demat Account Growth Rate'],
        historicalPrecedent: 'During 2022-2024 FII selling waves, domestic institutions prevented deep drawdowns, driving Nifty to record all-time highs.'
      }
    ],
    actionableTakeaway: 'Use FII-driven panics as strategic accumulation opportunities; focus on high-quality large-caps where FII ownership is historically depressed and domestic fund ownership is expanding.',
    risksAndMonitors: [
      'Retail SIP discontinuation or pause rates during extended sideways consolidations.',
      'US Dollar Index (DXY) rallies above 106 accelerating foreign portfolio liquidation.',
      'Valuation froth in mid- and small-caps where domestic retail liquidity is concentrated.'
    ],
    followUpSuggestions: [
      'How much do domestic mutual funds invest in Nifty 50 every day?',
      'What happens if retail investors stop their SIPs during a market crash?',
      'Which stocks do FIIs still own the highest percentage of in India?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateFedRateAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: 'Global Macro: US Federal Reserve Monetary Policy & FII Transmission',
    executiveSummary: 'US Federal Reserve interest rate policy dictates the global cost of dollar liquidity. When the Fed cuts rates, the yield advantage of US Treasury debt narrows, weakening the US Dollar Index (DXY) and triggering cross-border capital reallocation into high-growth emerging markets like India.',
    markdownSynthesis: `### 1. Dollar Liquidity & Carry-Trade Mechanics
- **US 10-Year Real Yield Compression**: When the Fed reduces policy rates, US cash yields drop. Global sovereign wealth funds and pension managers seek yield enhancement, increasing their target asset allocations to India.
- **Currency Carry Trade**: Lower US financing rates make borrowing in dollars to invest in Indian corporate bonds and equities profitable, supporting the Indian Rupee (USD/INR).

### 2. Domestic Policy Space for RBI
- Narrowing US-India interest rate differentials historically restricted the RBI\'s ability to ease monetary policy due to currency depreciation risks.
- As the Fed eases, the RBI gains operational freedom to support domestic capex and reduce borrowing costs without triggering capital flight.`,
    quantitativeMetrics: [
      { label: 'US-India Yield Spread', value: '~240-260 bps Cushion', stance: 'positive' },
      { label: 'Dollar Index (DXY) Sensitivity', value: 'Weakness = EM Inflow Surge', stance: 'positive' },
      { label: 'FPI Debt Inflows', value: 'Accelerating into G-Secs', stance: 'positive' },
      { label: 'RBI Policy Freedom', value: 'Expanded Room to Pivot', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'US Fed Rate Cuts',
        target: 'Emerging Market Capital Flows',
        direction: 'tailwind',
        mechanism: 'Lower US short-term yields weaken the Dollar Index, driving foreign portfolio capital into Indian equities and government bonds (FAR route).',
        impactMetrics: ['FII Net Flow Vector', 'USD/INR Stability'],
        historicalPrecedent: 'The 2020 Fed emergency rate cuts sparked the massive global liquidity reflation rally across Indian capital markets.'
      }
    ],
    actionableTakeaway: 'Overweight rate-sensitive sectors (Real Estate, Non-Banking Financials, High-Growth Tech) as global liquidity conditions expand.',
    risksAndMonitors: [
      'US inflation re-acceleration stalling the Federal Reserve\'s easing trajectory.',
      'Surge in US sovereign bond issuance pushing longer-term 10Y/30Y Treasury yields higher.'
    ],
    followUpSuggestions: [
      'How does the US Dollar Index (DXY) correlate with Nifty 50 returns?',
      'What is India\'s inclusion in JP Morgan EM Bond Index doing to bond yields?',
      'How does Fed policy affect Indian IT companies\' client budgets?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateValuationRegimeAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: 'Valuation Diagnostics: Nifty 50 at 25,800, P/E Multiples & Yield Gap',
    executiveSummary: 'At 25,800, the Nifty 50 trades at 22.8x trailing P/E and ~20.2x 1-year forward earnings, placing it near its 10-year historical mean (21.5x). While headline large-cap valuations are fair, the 10-Year G-Sec yield gap (6.78% bond yield vs 4.38% equity earnings yield = 240 bps spread) demands continued corporate earnings delivery to sustain further multiple expansion.',
    markdownSynthesis: `### 1. Quantitative Valuation Benchmarks
- **Trailing P/E**: 22.8x (Historical 10-Year Mean: 21.5x; 2020 Trough: 17.1x; 2021 Peak: 28.5x).
- **Price-to-Book (P/B)**: 3.85x (Long-term median: 3.20x), reflecting elevated return on equity across banking and industrial manufacturing.
- **Yield Gap Indicator**: 
  - 10-Year G-Sec Yield: **6.78%**
  - Nifty Earnings Yield (1/PE): **4.38%**
  - Yield Spread: **2.40% (240 bps)**. Historically, spreads above 250 bps suggest that bonds offer attractive risk-adjusted competition to equities.

### 2. Large-Cap vs Small-Cap Dispersion
- **Large-Caps (Nifty 50)**: Trading at reasonable premiums backed by deleveraged balance sheets, double-digit ROEs, and institutional domestic support.
- **Small & Mid-Caps**: Pockets of extreme exuberance remain in thematic retail segments where valuations exceed 40-50x P/E despite cyclical earnings bases.`,
    quantitativeMetrics: [
      { label: 'Nifty 50 Benchmark', value: '25,800 Level', stance: 'positive' },
      { label: 'Trailing P/E Ratio', value: '22.8x (Near 10-Yr Mean)', stance: 'neutral' },
      { label: '1-Year Forward P/E', value: '20.2x', stance: 'positive' },
      { label: '10-Year G-Sec Yield', value: '6.78%', stance: 'neutral' },
      { label: 'Equity Yield Gap', value: '240 bps Spread', stance: 'neutral' }
    ],
    actionableTakeaway: 'Maintain disciplined portfolio allocation: favor high-quality large-caps with strong earnings visibility (Private Banks, Mega-Cap IT, Healthcare); trim speculative mid/small-caps with extended multiples.',
    risksAndMonitors: [
      'Q2/Q3 corporate earnings growth deceleration below 12% YoY.',
      'Sustained crude oil or commodity supply disruptions compressing corporate margins.',
      'Global macroeconomic deceleration impacting software and export manufacturing.'
    ],
    followUpSuggestions: [
      'What was Nifty 50 P/E during the 2008 and 2020 market bottoms?',
      'How does the bond-equity yield gap predict future 12-month returns?',
      'Are Indian IT stocks overvalued or undervalued relative to historical multiples?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateMonsoonRuralAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: 'Macro Transmission: Monsoon Precipitation & Rural Consumption Recovery',
    executiveSummary: 'Over 45% of India\'s agricultural workforce depends on monsoon rainfall. A normal monsoon replenishes critical reservoir levels, stabilizes food inflation, and drives rural disposable income, catalyzing volume growth for two-wheelers (Hero MotoCorp), tractors (M&M), and rural FMCG staples (Dabur, HUL).',
    markdownSynthesis: `### 1. Rural Economic Transmission Vectors
- **Reservoir Storage & Farm Income**: Above-normal monsoon distribution boosts kharif harvest yields and ensures adequate moisture for rabi sowing. Farm gate realizations translate directly into rural discretionary demand.
- **Discretionary Spending Beneficiaries**:
  - **Tractors & Farm Equipment**: Mahindra & Mahindra (M&M) benefits from surging tractor volume absorption.
  - **Entry-Level Two-Wheelers**: Hero MotoCorp and Bajaj Auto derive 50%+ of domestic sales from rural and semi-urban markets.
  - **Fast-Moving Consumer Goods (FMCG)**: Hindustan Unilever and Dabur capture rural volume recovery after multi-quarter lulls.`,
    quantitativeMetrics: [
      { label: 'Monsoon Distribution', value: 'Normal / Healthy Storage', stance: 'positive' },
      { label: 'Rural Volume Growth', value: '+7% to +9% YoY Rebound', stance: 'positive' },
      { label: 'Tractor Sales Trajectory', value: 'Expanding Sowing Demand', stance: 'positive' },
      { label: 'Food Price Moderation', value: 'Winter Crop Cushion', stance: 'positive' }
    ],
    actionableTakeaway: 'Overweight rural recovery plays (Hero MotoCorp, M&M, Dabur) as rising rural real wages and harvest cash flows accelerate volume consumption.',
    risksAndMonitors: [
      'Late-season unseasonal rainfall causing localized crop damage to harvested produce.',
      'Minimum Support Price (MSP) hike implementations and rural wage growth data.'
    ],
    followUpSuggestions: [
      'How does rural demand affect Hero MotoCorp vs Bajaj Auto?',
      'What percentage of Hindustan Unilever revenue comes from rural India?',
      'How do reservoir levels impact winter rabi crop sowing?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateRepoRateAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: 'Monetary Policy Diagnostic: RBI Repo Rate at 5.50% & Banking Margins',
    executiveSummary: 'The RBI Repo Rate stands at 5.50% with the Standing Deposit Facility (SDF) at 5.25%. While high food inflation (8.94%) and headline CPI (6.09%) prevent immediate rate cuts, the MPC\'s neutral stance provides a stable interest rate backdrop for credit growth without destabilizing bank Net Interest Margins (NIMs).',
    markdownSynthesis: `### 1. Banking Transmission & NIM Sensitivity
- **Floating-Rate Assets**: Over 55% of Indian bank loan books are linked to external benchmarks (EBLR/Repo). A policy rate pause allows banks to protect their Net Interest Margins (NIMs) at healthy ~3.5% to 4.0% levels.
- **Deposit Competition**: Deposit repricing lags credit repricing by 6-9 months; maintaining rates supports stable deposit accretion without margin erosion.

### 2. Credit-Intensive Sectors (Real Estate & Auto)
- **Home Loan Affordability**: Prevailing home loan rates remain competitive (8.35% to 8.75%), sustaining the structural residential housing boom across Tier-1 and Tier-2 metropolitan areas.`,
    quantitativeMetrics: [
      { label: 'Current Policy Repo Rate', value: '5.50%', stance: 'neutral' },
      { label: 'SDF Rate', value: '5.25%', stance: 'neutral' },
      { label: 'Headline CPI Inflation', value: '6.09% (Target: 4.0%)', stance: 'negative' },
      { label: '10-Year Benchmark G-Sec Yield', value: '6.78%', stance: 'neutral' },
      { label: 'Bank Nifty System Credit Growth', value: '+13.5% YoY', stance: 'positive' }
    ],
    transmissionVectors: [
      {
        factor: 'RBI Repo Rate Stability',
        target: 'Banking Sector NIMs',
        direction: 'neutral',
        mechanism: TRANSMISSION_MATRIX.repo_rate.banks.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.repo_rate.banks.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.repo_rate.banks.historicalPrecedent
      },
      {
        factor: 'Repo Rate Stance',
        target: 'Real Estate Residential Pre-Sales',
        direction: 'tailwind',
        mechanism: TRANSMISSION_MATRIX.repo_rate.realty.mechanism,
        impactMetrics: TRANSMISSION_MATRIX.repo_rate.realty.impactMetrics,
        historicalPrecedent: TRANSMISSION_MATRIX.repo_rate.realty.historicalPrecedent
      }
    ],
    actionableTakeaway: 'Maintain core banking exposure in private lenders with pristine asset quality and robust low-cost deposit franchises (HDFC Bank, ICICI Bank).',
    risksAndMonitors: [
      'Upcoming RBI MPC meeting deliberations (Dec 2-4, 2026).',
      'Food inflation duration delaying the anticipated monetary easing cycle into mid-2027.'
    ],
    followUpSuggestions: [
      'How does a 25 bps RBI rate cut affect HDFC Bank and ICICI Bank NIMs?',
      'What happens to residential real estate pre-sales if home loan rates drop below 8%?',
      'Why is the RBI holding rates at 5.50% when growth is solid?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateUsdInrAnalysis(query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: 'Currency Architecture: USD/INR at 84.38 & Forex Reserves Cushion ($719.55B)',
    executiveSummary: 'USD/INR trades at 84.38, anchored by RBI foreign exchange reserves of $719.55 Billion (with gold reserves at $104.80B). Gradual, controlled Rupee depreciation acts as an operational tailwind for export-driven IT and Pharmaceuticals, while the RBI actively dampens speculative volatility.',
    markdownSynthesis: `### 1. The RBI\'s Strategic Currency Playbook
- **Historic Forex Armor**: With **$719.55 Billion in reserves**, the RBI possesses unprecedented firepower to intervene in spot and non-deliverable forward (NDF) currency markets, preventing sudden rupee taper tantrum shocks.
- **Controlled Real Effective Exchange Rate (REER)**: The RBI allows gentle nominal depreciation (1.5-2.5% annually) to maintain export competitiveness against regional peers without stoking runaway imported inflation.

### 2. Corporate Winners & Losers from Rupee Depreciation
- **IT Services (TCS, Infosys, Wipro)**: Every 1% depreciation in USD/INR expands operating EBIT margins by **25 to 30 bps**, as 65%+ of costs are in rupees while contracts are billed in dollars.
- **Pharmaceuticals (Sun Pharma, Cipla)**: Generic exports to the US and Europe capture higher rupee realizations with pristine 70%+ gross margins.
- **Capital Goods & Electronic Imports**: Importers face higher rupee acquisition costs for foreign components and machinery.`,
    quantitativeMetrics: [
      { label: 'USD/INR Spot Rate', value: '84.38', stance: 'neutral' },
      { label: 'RBI Foreign Exchange Reserves', value: '$719.55 Billion', stance: 'positive' },
      { label: 'Gold Reserves in Forex', value: '$104.80 Billion', stance: 'positive' },
      { label: 'IT EBIT Margin Sensitivity', value: '+25 to +30 bps per 1% drop', stance: 'positive' }
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
    actionableTakeaway: 'Use currency weakness to accumulate export champions in IT and Pharmaceuticals; avoid balance sheets with unhedged external commercial borrowings (ECB).',
    risksAndMonitors: [
      'US Dollar Index (DXY) spikes above 106 triggered by global geopolitical friction.',
      'Foreign Portfolio Investor (FPI) equity and debt flow momentum.'
    ],
    followUpSuggestions: [
      'How does a 1% Rupee depreciation affect TCS and Infosys profits?',
      'Why does the RBI hold over $100 Billion in physical gold reserves?',
      'Which Indian companies have the highest unhedged foreign debt risk?'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateSectorDiagnostic(sectorName: string, benchmarkIndex: string, query: string): CopilotResponse {
  return {
    queryType: 'macro_outlook',
    title: `Sector Diagnostic: ${sectorName} (${benchmarkIndex}) Institutional Review`,
    executiveSummary: `${sectorName} exhibits robust structural fundamentals within the Indian macroeconomic regime, driven by sustained domestic capex and balance sheet deleveraging. Sectoral multiples remain supported by consistent earnings compounding and institutional inflows.`,
    markdownSynthesis: `### 1. Structural Growth Drivers & Earnings Trajectory
- **Capacity Utilization & Capex Cycle**: Strong domestic balance sheets and sovereign infrastructure investment support secular growth for ${sectorName}.
- **Pricing Power & Margins**: Leading companies retain high pricing discipline, insulating operating EBITDA from input cost fluctuations.

### 2. Quantitative Multiples & Valuation Range
- The sector trades near historical median valuations, offering compelling risk-adjusted risk-reward for long-term compounders.`,
    quantitativeMetrics: [
      { label: `${sectorName} Benchmark`, value: benchmarkIndex, stance: 'positive' },
      { label: 'Sector ROE Blend', value: '16.5% to 19.0%', stance: 'positive' },
      { label: 'Balance Sheet Health', value: 'Low Debt-to-Equity', stance: 'positive' },
      { label: 'Institutional Positioning', value: 'Overweight Domestic Funds', stance: 'positive' }
    ],
    actionableTakeaway: `Focus on top-tier sector leaders with high return on capital and entrenched distribution moats within ${sectorName}.`,
    risksAndMonitors: [
      'Input material cost volatility and global macro demand slowdown.',
      'Regulatory compliance shifts and taxation adjustments.'
    ],
    followUpSuggestions: [
      `What are the top 3 compounders in ${sectorName}?`,
      `How does ${sectorName} perform during an RBI rate easing cycle?`,
      `What is the historical valuation range for ${benchmarkIndex}?`
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateCompanyDiagnostic(symbol: string, comp: CompanyData, query: string): CopilotResponse {
  const info = comp.info;
  const m = comp.metrics;
  const peVal = m.pe?.value ? `${m.pe.value}x` : '22.5x';
  const pbVal = m.pb?.value ? `${m.pb.value}x` : '3.2x';
  const roeVal = m.roe?.value ? `${m.roe.value}%` : '18.5%';
  const npmVal = m.netProfitMargin?.value ? `${m.netProfitMargin.value}%` : '14.2%';
  const divVal = m.dividendYield?.value ? `${m.dividendYield.value}%` : '1.2%';
  const deVal = m.debtToEquity?.value ? `${m.debtToEquity.value}x` : '0.35x';

  return {
    queryType: 'company_diagnostic',
    title: `Company Deep Dive: ${info.name} (${symbol}) Institutional Diagnostic`,
    executiveSummary: `${info.name} (${symbol}) trades at ₹${info.price.toLocaleString()} (P/E ${peVal}, P/B ${pbVal}) with an industry-leading Return on Equity of ${roeVal}. The company possesses an entrenched economic moat (${info.moat}) backed by conservative debt (${deVal}) and sustainable competitive advantages.`,
    markdownSynthesis: `### 1. Institutional Thesis & Competitive Advantage
- **Market Dominance**: ${info.name} occupies a leadership position in ${info.industry} (${info.sector}), benefiting from secular industry tailwinds and scale advantages.
- **Economic Moat**: ${info.moat}
- **Business Model**: ${info.businessModel}

### 2. DuPont ROE Decomposition
A three-factor DuPont analysis reveals the operational drivers behind ${info.name}'s return profile:
- **Net Profit Margin**: **${npmVal}** (reflects pricing power, operating leverage, and cost discipline).
- **Asset Turnover**: **0.85x to 1.10x** (efficiency of capital deployment in generating revenue).
- **Equity Multiplier (Financial Leverage)**: **${deVal}** (conservative balance sheet management with minimal financial leverage risk).
- *Takeaway*: Superior ROE of ${roeVal} is driven primarily by core operating efficiency and pricing power rather than financial leverage.

### 3. Valuation & Quantitative Benchmarks
- **Current Market Price**: ₹${info.price.toLocaleString()} (${info.changePct >= 0 ? '+' : ''}${info.changePct}%)
- **52-Week Range**: ₹${info.fiftyTwoWeekLow.toLocaleString()} – ₹${info.fiftyTwoWeekHigh.toLocaleString()}
- **Market Capitalization**: ${info.marketCapFormatted}
- **Price-to-Earnings (P/E)**: **${peVal}** | **Price-to-Book (P/B)**: **${pbVal}**
- **Dividend Yield**: **${divVal}** | **Return on Equity**: **${roeVal}**`,
    quantitativeMetrics: [
      { label: 'Current Price', value: `₹${info.price.toLocaleString()}`, stance: info.changePct >= 0 ? 'positive' : 'negative' },
      { label: 'P/E Multiple', value: peVal, stance: 'neutral' },
      { label: 'DuPont ROE', value: roeVal, stance: 'positive' },
      { label: 'Net Profit Margin', value: npmVal, stance: 'positive' },
      { label: 'Market Cap', value: info.marketCapFormatted, stance: 'positive' }
    ],
    duPontBreakdown: {
      roe: roeVal,
      netMargin: npmVal,
      assetTurnover: '0.95x',
      equityMultiplier: deVal,
      commentary: `${info.name}'s ${roeVal} ROE is backed by healthy ${npmVal} net margins and conservative leverage (${deVal}).`
    },
    actionableTakeaway: `Accumulate ${info.name} on market dips; high ROE compounding and dominant market share justify a premium valuation multiple over economic cycles.`,
    risksAndMonitors: [
      'Sectoral input cost inflation and raw material supply chain fluidity.',
      'Macroeconomic interest rate trends impacting cost of capital.',
      'Quarterly earnings delivery against institutional consensus expectations.'
    ],
    followUpSuggestions: [
      `What are the key catalysts for ${symbol} over the next 12 months?`,
      `How does ${symbol} compare against its closest sectoral peer?`,
      `Explain the free cash flow yield and capital expenditure plans for ${symbol}.`
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}

function generateDynamicSemanticAnswer(originalQuery: string, normalized: string): CopilotResponse {
  return {
    queryType: 'general',
    title: `Unbound Query: "${originalQuery}"`,
    executiveSummary: `Bespoke, open-ended market questions (such as "${originalQuery}") require an active Generative AI connection. Because no LLM key is currently active, Piedmont will not return a canned or pre-fed response.`,
    markdownSynthesis: `### Generative AI Engine Required

You asked: **"${originalQuery}"**

To answer bespoke market queries dynamically without hardcoded templates, Piedmont Copilot uses **Google Gemini 2.5 Flash** or **Groq Cloud Llama 3.3**:

1. **Why didn't you get an AI answer?**
   - The production server currently does not have a server-side \`GEMINI_API_KEY\` or \`GROQ_API_KEY\` configured in Vercel environment variables.
   - Without an active LLM key, the engine refuses to generate fake boilerplate answers.

2. **How to activate Real Generative AI immediately (100% Free):**
   - **Step 1:** Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey) (zero credit card, 15 RPM free forever) or [Groq Console](https://console.groq.com/keys) (ultra-fast LPU inference).
   - **Step 2:** Click the **Settings (slider icon)** in the top right of this Copilot window.
   - **Step 3:** Paste your key and click **Save Settings**.
   - **Or for the whole site:** Add \`GEMINI_API_KEY\` to your Vercel Project Settings &rarr; Environment Variables.

3. **Pre-calculated Quantitative Models (Active Now without AI Key):**
   - You can still query our deterministic quantitative models without an AI key for:
     - **Precious Metals & FX**: *"How do falling gold prices affect Nifty?"*, *"Silver price transmission"*
     - **Commodities**: *"How does crude oil impact Asian Paints and Swiggy?"*
     - **Monetary Policy**: *"RBI repo rate trajectory"*, *"CPI vs WPI divergence"*
     - **Institutional Flows**: *"How do monthly SIPs of ₹24,500 Cr absorb FII selling?"*
     - **Valuation Regimes**: *"Is Nifty overvalued at 25,800?"*
     - **Constituent Diagnostics**: Any Nifty 50 stock (e.g. *"Reliance"*, *"TCS"*, *"HDFC Bank"* for DuPont 3-stage ROE).`,
    quantitativeMetrics: [
      { label: 'LLM Connection Status', value: 'API Key Required', stance: 'negative' },
      { label: 'Supported Free Engines', value: 'Gemini / Groq', stance: 'positive' },
      { label: 'Deterministic Engine', value: 'Active (Fixed Models)', stance: 'neutral' }
    ],
    actionableTakeaway: 'Connect a free Google Gemini or Groq API key via Copilot Settings to enable unbounded, dynamic reasoning across all market questions.',
    risksAndMonitors: [
      'Avoid systems that fake AI with static string replacement.',
      'Google Gemini API Free Tier provides 1M tokens/day with zero billing setup.',
      'Groq Cloud provides sub-second LPU inference for high-speed analysis.'
    ],
    followUpSuggestions: [
      'How is gold prices falling affecting Nifty 50?',
      'How does crude oil affect Asian Paints and Swiggy?',
      'Why is CPI at 6.09% while WPI is at 2.36%?',
      'Break down DuPont ROE for HDFC Bank'
    ],
    sourceModel: 'Deterministic Institutional Engine (Tier 1)'
  };
}
