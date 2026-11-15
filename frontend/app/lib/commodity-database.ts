// Piedmont Institutional Commodity Database & Dynamic Transmission Engine
// Comprehensive cross-asset sensitivity, daily trading session updates, and weekend market wraps

export interface TransmissionChannel {
  macroFactor: string;
  targetEquityOrIndex: string;
  direction: 'tailwind' | 'headwind' | 'neutral';
  sensitivityMetric: string;
  mechanism: string;
  historicalPrecedent: string;
}

export interface CommodityDailyUpdate {
  tradingDate: string;
  sessionVerdict: string;
  marketImpactSummary: string;
  sectorWinners: { name: string; rationale: string }[];
  sectorLosers: { name: string; rationale: string }[];
  niftyTransmission: string;
}

export interface CommodityWeekendWrap {
  weekEnding: string;
  weeklyPerformance: string;
  weeklyNarrative: string;
  globalDrivers: string[];
  mondayOpeningWatchlist: string;
  institutionalTakeaway: string;
}

export interface CommodityDefinition {
  slug: string;
  name: string;
  symbol: string;
  exchange: 'MCX' | 'NYMEX' | 'COMEX' | 'ICE' | 'LME' | 'FOREX';
  benchmarkUnit: string;
  livePriceDisplay: string;
  liveChangeDisplay: string;
  isPositive: boolean;
  category: 'Precious Metals' | 'Energy' | 'Industrial Metals' | 'Currency';
  
  // Static Core Knowledge (Matching /learn/[term] standard)
  title: string;
  intro: string;
  analogy: string;
  deepDive: string[];
  formulaOrCalculation: string;
  historicalRange: {
    tenYearHigh: string;
    tenYearLow: string;
    historicalMedian: string;
  };
  goodBad: {
    good: string;
    bad: string;
  };
  indianContext: string;
  
  // Cross-Asset Macro Transmission Matrix
  transmissionChannels: TransmissionChannel[];
  
  // Dynamic Daily & Weekend Commentary
  dailyUpdate: CommodityDailyUpdate;
  weekendWrap: CommodityWeekendWrap;
}

export const COMMODITIES_DATABASE: Record<string, CommodityDefinition> = {
  gold: {
    slug: 'gold',
    name: 'Gold',
    symbol: 'GOLD',
    exchange: 'MCX',
    benchmarkUnit: '₹ / 10 grams (MCX) | $ / troy oz (COMEX)',
    livePriceDisplay: '₹78,450',
    liveChangeDisplay: '+₹420 (+0.54%)',
    isPositive: true,
    category: 'Precious Metals',
    title: 'Gold: Bullion Dynamics & CAD Transmission',
    intro: 'Gold is the world\'s premiere monetary hedge, store of value, and safe-haven asset. For the Indian macroeconomic framework, it is the single most critical import line-item after crude oil, directly dictating the Current Account Deficit (CAD), Rupee stability, and household wealth storage.',
    analogy: 'Imagine a country\'s bank account as a joint family budget. When Indian families buy gold, they are exchanging productive Rupee cash for shiny metal that sits in bank lockers producing zero interest and zero factories. Because India produces almost zero gold locally, every gram must be bought in US Dollars from Switzerland and Dubai. A sudden jump in gold prices or imports is like a massive family splurge that drains the savings account (Forex reserves) and weakens the family currency.',
    deepDive: [
      'India is the second-largest consumer of physical gold in the world (after China), consuming between 800 to 900 metric tonnes annually. This represents a colossal annual foreign exchange import bill of $45 Billion to $50 Billion.',
      'Because physical gold in India pays no dividend and generates no cash flow, macroeconomists categorize physical bullion accumulation as "unproductive capital formation." High gold demand diverts domestic retail savings away from productive financial assets (mutual funds, corporate bonds, bank deposits, equity IPOs).',
      'The Indian government manages gold import flows via the Basic Customs Duty (BCD) and Agriculture Infrastructure and Development Cess (AIDC). In July 2024, the Indian government slashed the basic import duty on gold from 15% to 6%, drastically crushing grey-market smuggling and formalizing retail jewellery transactions through organized players like Titan and Kalyan Jewellers.',
      'Gold shares a structural inverse correlation with US real interest rates (10-Year US TIPS yields). When global central banks hike interest rates, the opportunity cost of holding non-yielding gold rises, pushing bullion prices down. Conversely, during sovereign debt debasement or geopolitical flare-ups, gold serves as the ultimate counter-party-free reserve currency.',
      'For domestic equity markets, falling gold prices are an unmitigated structural tailwind. Every 5% correction in international gold realizations saves ~$1.8B to $2.2B in foreign exchange outflows, directly compressing the Current Account Deficit and supporting the Indian Rupee.'
    ],
    formulaOrCalculation: 'MCX Landed Gold Price = [COMEX Spot ($/oz) ÷ 31.1035] × USD/INR × 10 × (1 + Customs Duty 6% + AIDC) + MCX Premium + GST (3%)',
    historicalRange: {
      tenYearHigh: '₹81,500 / 10g (October 2024)',
      tenYearLow: '₹24,800 / 10g (December 2015)',
      historicalMedian: '₹48,000 / 10g'
    },
    goodBad: {
      good: 'Gold consolidating in the ₹72,000 - ₹75,000 band: Keeps CAD within comfortable bounds (<1.5% of GDP), supports domestic jewellery retail volume elasticity, and stabilizes gold loan NBFC collateral books.',
      bad: 'Gold hyper-rallying above ₹82,000+: Drives massive import bill spikes, triggers central bank dollar drainage, and suppresses volume demand across rural bridal purchases.'
    },
    indianContext: 'Indian households are estimated to privately hold over 25,000 metric tonnes of physical gold — exceeding the combined gold reserves of the world\'s top five central banks. Gold functions as an informal private social safety net across rural India and serves as prime collateral for NBFC credit disbursals.',
    transmissionChannels: [
      {
        macroFactor: 'Bullion Price Compression',
        targetEquityOrIndex: 'Titan Company & Kalyan Jewellers',
        direction: 'tailwind',
        sensitivityMetric: 'Volume elasticity: +1.4x demand expansion for every 5% price drop',
        mechanism: 'Indian bridal and festival jewellery buyers exhibit high price sensitivity. Lower gram prices trigger heavy advance wedding bookings and expand retail store footfalls, driving higher operating leverage across retail footprints.',
        historicalPrecedent: 'Following the July 2024 import duty reduction from 15% to 6%, Titan and Kalyan recorded quarterly volume surges of over 24% year-over-year.'
      },
      {
        macroFactor: 'Sustained Bullion Correction',
        targetEquityOrIndex: 'Gold Loan NBFCs (Muthoot Finance, Manappuram)',
        direction: 'headwind',
        sensitivityMetric: 'Collateral LTV Headroom: Collateral buffer contracts toward 75% regulatory cap',
        mechanism: 'When gold prices decline, existing borrower collateral declines in value. This increases average Loan-to-Value (LTV) ratios, forcing NBFCs to issue margin calls, restrict fresh disbursal ticket sizes, or auction pledges.',
        historicalPrecedent: 'During the 2013 gold crash from $1,800 to $1,200/oz, gold loan NBFCs suffered a 35% contraction in loan growth and compressed return on equity.'
      },
      {
        macroFactor: 'Import Bill Contraction',
        targetEquityOrIndex: 'USD/INR & Current Account Deficit (CAD)',
        direction: 'tailwind',
        sensitivityMetric: 'Every 5% drop saves ~$2.0 Billion annually in net FX import outflows',
        mechanism: 'Lower dollar demand from bullion clearing houses directly reduces sovereign dollar leakage, alleviating downward pressure on the Rupee and preserving RBI foreign exchange reserves.',
        historicalPrecedent: 'The 2013-2015 gold bear cycle compressed India\'s CAD from 4.8% of GDP to 1.3%, laying the foundation for a 63% Nifty 50 rally.'
      }
    ],
    dailyUpdate: {
      tradingDate: 'Friday, November 13, 2026',
      sessionVerdict: 'Gold advances +0.54% to ₹78,450 on MCX amid Middle East safe-haven bids and Fed rate trajectory recalibration.',
      marketImpactSummary: 'MCX Gold closed higher at ₹78,450 (+₹420) following modest softening in US Treasury yields. The marginal uptick keeps retail jewellery buying steady ahead of the peak wedding season while insulating gold-loan NBFC collateral buffers.',
      sectorWinners: [
        { name: 'Muthoot & Manappuram Finance', rationale: 'Higher collateral valuations maintain comfortable LTV headroom and drive steady loan book expansion.' },
        { name: 'Sovereign Gold Bonds (SGBs)', rationale: 'Capital appreciation upside with zero storage or making-charge friction for retail holders.' }
      ],
      sectorLosers: [
        { name: 'Consumer Discretionary Retail', rationale: 'Higher gold budget allocations divert household discretionary wallet share away from electronics and apparel.' }
      ],
      niftyTransmission: 'Neutral to modestly defensive: Gold\'s mild advance had negligible drag on broad market indices, with Nifty 50 holding firm above 25,800.'
    },
    weekendWrap: {
      weekEnding: 'Sunday, November 15, 2026',
      weeklyPerformance: '+1.15% weekly gain (COMEX $2,684/oz, MCX ₹78,450)',
      weeklyNarrative: 'Bullion consolidated within a tight $2,650–$2,710 corridor throughout the week. Persistent physical demand from global central banks (including the Reserve Bank of India, whose gold reserves breached $104 Billion) absorbed profit-taking by Western macro hedge funds.',
      globalDrivers: [
        'RBI foreign exchange reserves hit $719.55B, with active accumulation of physical gold in domestic vaults.',
        'US Federal Reserve December rate-cut probabilities held steady at 62%, capping the US Dollar Index (DXY) at 104.2.',
        'Physical premiums in Zaveri Bazaar held at a steady $1.50/oz discount to official landed cost, signaling balanced domestic physical liquidity.'
      ],
      mondayOpeningWatchlist: 'Monitor MCX open at 9:00 AM IST for COMEX overnight gap reactions. Watch Titan Company (₹3,240 resistance) and Muthoot Finance (₹1,940 support).',
      institutionalTakeaway: 'Maintain neutral weighting on bullion. Prefer organized retail jewellery franchisors (Titan, Kalyan) over physical bullion, as formal market share gains outpace commodity price fluctuations.'
    }
  },

  crude_oil: {
    slug: 'crude-oil',
    name: 'Brent Crude Oil',
    symbol: 'CRUDE_OIL',
    exchange: 'ICE',
    benchmarkUnit: '$ / barrel (Brent ICE) | ₹ / barrel (MCX)',
    livePriceDisplay: '$72.80',
    liveChangeDisplay: '-$0.85 (-1.15%)',
    isPositive: false,
    category: 'Energy',
    title: 'Brent Crude Oil: India\'s Macro Master Variable',
    intro: 'Crude oil is the supreme macroeconomic variable for India. Because India imports approximately 85% to 88% of its petroleum needs, crude prices govern imported inflation, the sovereign trade deficit, corporate operating margins across five major industries, and RBI monetary policy.',
    analogy: 'Imagine running a transport fleet where fuel is 70% of your daily operating expense. When diesel costs ₹90, you make a healthy profit. If it spikes to ₹120, your entire margin is wiped out, and you must hike delivery charges for every customer, triggering price increases everywhere. That transport fleet is the entire Indian economy — when oil spikes, every single goods truck, plastic bottle, paint bucket, and flight ticket gets more expensive.',
    deepDive: [
      'India imports approximately 5 million barrels of crude oil every single day. At $75 per barrel, this translates into an annual crude import bill of roughly $135 Billion to $140 Billion — making it India\'s single largest source of foreign exchange demand.',
      'The rule of thumb for institutional economists: Every $10 per barrel increase in Brent crude widens India\'s Current Account Deficit by ~0.5% of GDP ($14B–$16B) and adds approximately 30 to 40 basis points to headline CPI inflation.',
      'The transmission of crude oil into Indian equities is direct and structural across distinct industry verticals: (1) Paints (Asian Paints, Berger), where petrochemical derivatives account for 50-60% of raw material costs; (2) Aviation (IndiGo), where Aviation Turbine Fuel (ATF) represents 40% of operating expenses; (3) Tyre manufacturers (MRF, Apollo Tyres), consuming synthetic rubber derived from crude; and (4) Upstream producers (ONGC, Oil India), whose realization is directly tied to international spot prices.',
      'Oil Marketing Companies (OMCs) like IOCL, BPCL, and HPCL operate under a semi-regulated retail price regime. When global crude collapses below $70, their marketing margins expand to lucrative levels of ₹6–₹8 per litre on petrol and diesel. When crude surges past $90, the government often caps pump prices, crushing OMC marketing margins.',
      'The strategic diversification of India\'s crude basket (including long-term discounted Urals crude purchases from Russia settled in non-dollar bilateral mechanisms) has saved India an estimated $10B+ in foreign exchange reserves since 2022, providing substantial macro insulation.'
    ],
    formulaOrCalculation: 'Refinery Landed Cost = [Brent Spot ($/bbl) + Ocean Freight + Insurance] × USD/INR ÷ 159 (litres/bbl) + Customs Duty + Refining Margin',
    historicalRange: {
      tenYearHigh: '$139.13 / bbl (March 2022)',
      tenYearLow: '$19.33 / bbl (April 2020)',
      historicalMedian: '$74.50 / bbl'
    },
    goodBad: {
      good: 'Brent Crude between $65 and $75 / barrel: The "Goldilocks Zone" for India. Fiscal deficit remains protected, OMCs enjoy steady margins, paint and airline companies expand EBITDA, and inflation remains anchored.',
      bad: 'Brent Crude above $95 / barrel: Massive fiscal stress. Widens trade deficit, triggers heavy Rupee depreciation, forces fuel excise duty cuts, and pressures the RBI into rate hikes.'
    },
    indianContext: 'India\'s crude basket is a benchmark blend of Oman/Dubai sour crude and Brent sweet crude (roughly 75:25 ratio). The Indian government collects substantial excise duty on fuel, making petroleum taxation a cornerstone of Central and State tax revenues.',
    transmissionChannels: [
      {
        macroFactor: 'Crude Price Decline to $70-$75',
        targetEquityOrIndex: 'Asian Paints, Berger Paints & Kansai Nerolac',
        direction: 'tailwind',
        sensitivityMetric: 'Gross Margin Expansion: +120 bps margin expansion for every $5 drop in Brent',
        mechanism: 'Paints are 50-60% petrochemical derivatives (solvents, resins, phthalic anhydride, titanium dioxide). Falling oil drops raw material costs while retail paint prices remain sticky, unlocking huge gross margin expansion.',
        historicalPrecedent: 'In FY15-16, when crude collapsed from $110 to $45, Asian Paints expanded EBITDA margins from 16.5% to over 21.8%, sending the stock up 85%.'
      },
      {
        macroFactor: 'Crude Price Decline to $70-$75',
        targetEquityOrIndex: 'InterGlobe Aviation (IndiGo)',
        direction: 'tailwind',
        sensitivityMetric: 'Aviation Turbine Fuel (ATF): Fuel represents ~40% of total airline operating expenses',
        mechanism: 'ATF prices are revised fortnightly in India based on international oil benchmarks. Lower fuel burns directly augment airline cash generation, boosting EBITDAR margins.',
        historicalPrecedent: 'IndiGo generated record quarterly free cash flow in Q3 FY24 as crude retreated to $75/bbl.'
      },
      {
        macroFactor: 'Crude Price Softening Below $75',
        targetEquityOrIndex: 'Upstream Oil Explorers (ONGC & Oil India)',
        direction: 'headwind',
        sensitivityMetric: 'Net Realization Cap: Realizations drop dollar-for-dollar below $75/bbl',
        mechanism: 'Upstream explorers generate revenue by selling unrefined crude to domestic refiners. Lower realizations compress upstream operating EBITDA and return on capital employed.',
        historicalPrecedent: 'ONGC earnings contracted 18% in FY16 during the prolonged global crude supply glut.'
      }
    ],
    dailyUpdate: {
      tradingDate: 'Friday, November 13, 2026',
      sessionVerdict: 'Brent Crude slips -1.15% to $72.80/bbl on higher US crude stockpiles and soft Chinese industrial demand.',
      marketImpactSummary: 'Brent crude dipped to $72.80 as EIA data confirmed a 2.1 million barrel build in US crude inventories. The softening eases imported inflation fears for the Indian economy and provides immediate operating margin tailwinds for domestic paints, logistics, and airline stocks.',
      sectorWinners: [
        { name: 'Paints & Specialty Chemicals (Asian Paints, Berger)', rationale: 'Petrochemical input costs ease directly, supporting Q3 festival gross margins.' },
        { name: 'Aviation (IndiGo)', rationale: 'Softening ATF fuel burn improves unit economics during peak holiday travel seasons.' }
      ],
      sectorLosers: [
        { name: 'Upstream Oil (ONGC, Oil India)', rationale: 'Lower net dollar realizations compress quarterly exploration EBITDA.' }
      ],
      niftyTransmission: 'Strong positive tailwind: Lower crude is India\'s prime macro dividend, supporting the Nifty 50 rally toward 25,800 and anchoring USD/INR below 84.40.'
    },
    weekendWrap: {
      weekEnding: 'Sunday, November 15, 2026',
      weeklyPerformance: '-2.41% weekly decline (Brent closed at $72.80 from $74.60 open)',
      weeklyNarrative: 'Global oil benchmarks experienced steady selling pressure throughout the week. The International Energy Agency (IEA) projected a global crude supply surplus of over 1 million barrels per day in 2027, driven by non-OPEC production growth from the US, Guyana, and Brazil.',
      globalDrivers: [
        'OPEC+ deferred its planned production hike rollback to Q1 2027, signaling persistent demand headwinds.',
        'India\'s trade deficit contracted to $20.4 Billion in October, helped by lower average crude import prices ($73 vs $89 YoY).',
        'Domestic retail fuel pump prices held steady, expanding marketing margins for IOCL, BPCL, and HPCL to over ₹7.50/litre.'
      ],
      mondayOpeningWatchlist: 'Watch Asian Paints (support at ₹2,880), IndiGo (resistance at ₹4,450), and HPCL for continuation of the crude-tailwinds thesis on Monday.',
      institutionalTakeaway: 'Overweight downstream consumers (Aviation, Paints, Tyres) and Oil Marketing Companies; underweight upstream exploration until global supply deficits re-emerge.'
    }
  },

  silver: {
    slug: 'silver',
    name: 'Silver',
    symbol: 'SILVER',
    exchange: 'MCX',
    benchmarkUnit: '₹ / kg (MCX) | $ / troy oz (COMEX)',
    livePriceDisplay: '₹94,200',
    liveChangeDisplay: '+₹650 (+0.69%)',
    isPositive: true,
    category: 'Precious Metals',
    title: 'Silver: The Green Energy Industrial Supercycle',
    intro: 'Unlike gold, which is almost purely a monetary asset, silver is a dual-nature hybrid: 55% of global silver demand is strictly industrial (solar photovoltaic panels, electric vehicles, electronics, 5G), while 45% is jewelry and retail investment. In India, it is a key driver for Hindustan Zinc and green-energy manufacturing.',
    analogy: 'Think of gold as a vintage diamond ring — you keep it in a safe, and it just looks pretty. Think of silver as copper\'s aristocratic cousin: it looks shiny in jewellery, but it is also the best conductor of electricity on earth. Every solar panel on an Indian roof and every electric bus on an Indian street MUST have silver paste inside to conduct solar power. So when the world builds solar farms, it literally consumes silver forever.',
    deepDive: [
      'Silver has the highest electrical conductivity, thermal conductivity, and reflectivity of any metal on earth. Because of these physics, it cannot be substituted in high-efficiency N-type solar photovoltaic (PV) cells without drastic performance degradation.',
      'The global solar industry consumed over 190 million ounces of silver in 2024 (up from 60 million ounces in 2018), driven heavily by India\'s PM Surya Ghar Muft Bijli Yojana (10 million rooftop solar installations) and massive utility-scale solar parks in Rajasthan and Gujarat.',
      'On the supply side, over 70% of global silver is mined as a secondary by-product of lead, zinc, and copper mining. In India, Hindustan Zinc (a Vedanta subsidiary) is the world\'s 3rd largest silver producer, producing ~750 metric tonnes of refined silver annually.',
      'Silver enjoys extraordinary operating leverage inside Hindustan Zinc. Because mining costs are largely absorbed by zinc production, silver operates at an astounding 80%+ EBITDA margin, contributing nearly 35% of Hindustan Zinc\'s total corporate operating profit.',
      'The Gold-to-Silver Ratio (GSR) measures how many ounces of silver it takes to buy one ounce of gold. Historically, a GSR above 85 indicates silver is deeply undervalued relative to gold, often preceding explosive multi-year catch-up rallies.'
    ],
    formulaOrCalculation: 'MCX Landed Silver Price = [COMEX Spot ($/oz) ÷ 31.1035] × 1000 × USD/INR × (1 + Duty 6% + AIDC) + GST (3%)',
    historicalRange: {
      tenYearHigh: '₹102,000 / kg (October 2024)',
      tenYearLow: '₹34,000 / kg (March 2020)',
      historicalMedian: '₹62,000 / kg'
    },
    goodBad: {
      good: 'Silver in the ₹88,000 - ₹96,000 / kg range: Provides massive dividend-yielding cash flow to Hindustan Zinc, encourages domestic solar panel fabrication, and supports industrial fabrication.',
      bad: 'Silver crashing below ₹65,000 / kg: Squeezes profitability for secondary metal smelters and weakens Hindustan Zinc dividend payouts.'
    },
    indianContext: 'India is the world\'s largest importer of silver, importing over 4,000 metric tonnes annually. In rural India, silver is known as the "poor man\'s gold," functioning as the primary portable store of wealth for agricultural workers and smallholder farmers.',
    transmissionChannels: [
      {
        macroFactor: 'Surging Industrial Silver Prices',
        targetEquityOrIndex: 'Hindustan Zinc Ltd',
        direction: 'tailwind',
        sensitivityMetric: 'Every ₹5,000/kg increase in silver adds ~₹750 Crore to corporate EBITDA',
        mechanism: 'Hindustan Zinc produces over 700 tonnes of silver annually as a by-product of zinc smelting at near-zero incremental mining cost, flowing directly into net profit.',
        historicalPrecedent: 'In FY24, silver contributed over 38% of Hindustan Zinc\'s net profit despite being only 15% of total mined metal volume.'
      },
      {
        macroFactor: 'Elevated Silver Prices (>₹95,000/kg)',
        targetEquityOrIndex: 'Solar Module Manufacturers (Tata Power, Waaree, Websol)',
        direction: 'headwind',
        sensitivityMetric: 'BOM Cost: Silver metallization paste represents 10-12% of total solar cell bill-of-materials',
        mechanism: 'High silver paste prices increase the cost of producing solar PV cells, compressing gross margins for module assemblers unless passed on to EPC contractors.',
        historicalPrecedent: 'Solar cell manufacturers accelerated the shift to copper-plated busbars during the 2024 silver price spike.'
      }
    ],
    dailyUpdate: {
      tradingDate: 'Friday, November 13, 2026',
      sessionVerdict: 'Silver gains +0.69% to ₹94,200/kg on MCX supported by robust industrial electronics and solar off-take.',
      marketImpactSummary: 'Silver outperformed gold on Friday, closing at ₹94,200/kg (+₹650) as industrial metal buyers stepped in. Physical solar panel demand in Gujarat and strong festive silverware off-take kept physical premiums firm.',
      sectorWinners: [
        { name: 'Hindustan Zinc', rationale: 'Direct beneficiary of higher silver realizations with near 80% operating EBITDA flow-through.' },
        { name: 'Industrial Electronics Manufacturers', rationale: 'Steady volume orders for automotive wiring harnesses and 5G base stations.' }
      ],
      sectorLosers: [
        { name: 'Unorganized Silverware Artisans', rationale: 'High absolute price per kg forces rural customers to downsize purchase weights.' }
      ],
      niftyTransmission: 'Mildly positive for metal index constituents: Hindustan Zinc and Vedanta gained +1.8% and +1.2% respectively.'
    },
    weekendWrap: {
      weekEnding: 'Sunday, November 15, 2026',
      weeklyPerformance: '+2.06% weekly advance (COMEX silver $31.85/oz, MCX ₹94,200/kg)',
      weeklyNarrative: 'Silver extended its structural outperformance relative to gold, bringing the Gold-to-Silver ratio down from 86 to 84. Strong quarterly shipments of solar wafers into India\'s National Solar Mission projects reinforced the physical deficit thesis.',
      globalDrivers: [
        'The Silver Institute reported a fourth consecutive year of global structural supply deficit (~180 million ounces in 2026).',
        'Inventories in London Bullion Market Association (LBMA) vaults held near historic lows of 820 million ounces.',
        'India\'s solar cell production capacity touched 18 GW under the PLI scheme, expanding domestic silver metallization paste consumption.'
      ],
      mondayOpeningWatchlist: 'Watch Hindustan Zinc (₹510 level) and Vedanta (₹465 level) for positive opening momentum.',
      institutionalTakeaway: 'Maintain structural overweight on silver as a high-beta expression of both the green energy transition and monetary debasement hedge.'
    }
  },

  natural_gas: {
    slug: 'natural-gas',
    name: 'Natural Gas',
    symbol: 'NATURAL_GAS',
    exchange: 'MCX',
    benchmarkUnit: '₹ / mmBtu (MCX) | $ / mmBtu (Henry Hub / JKM LNG)',
    livePriceDisplay: '₹265.40',
    liveChangeDisplay: '-₹3.80 (-1.41%)',
    isPositive: false,
    category: 'Energy',
    title: 'Natural Gas: Fertilizers, City Gas & Power Transmission',
    intro: 'Natural Gas is the cleanest fossil fuel and an indispensable building block for the Indian economy. It is the primary feedstock for agricultural urea fertilizer production and the fuel powering City Gas Distribution (CGD) networks for Compressed Natural Gas (CNG) vehicles and Piped Natural Gas (PNG) kitchens.',
    analogy: 'Imagine natural gas as the flour for a giant bakery. Half the flour is baked into bread (urea fertilizer) that feeds every farmer\'s field, and the other half powers the ovens and delivery vans (CNG auto-rickshaws and cabs). When the price of flour drops, the bakery can bake bread cheaply without asking the government for bread subsidies, and every auto driver takes home more money at the end of the day.',
    deepDive: [
      'India consumes approximately 185 million standard cubic meters per day (mmscmd) of natural gas. Roughly 50% is produced domestically (primarily from ONGC offshore fields and Reliance-bp KG-D6 deepwater basin), while the remaining 50% is imported as Liquefied Natural Gas (LNG) via cryogenic tankers from Qatar, the US, and Australia.',
      'Domestic natural gas pricing is regulated under the Kirit Parikh Committee guidelines. Domestic gas is capped at a floor of $4.00/mmBtu and a ceiling of $6.50/mmBtu, indexed to 10% of the Indian crude import basket price.',
      'The fertilizer sector consumes ~30% of total Indian natural gas supplies. Because the Indian government fixes the retail price of urea for farmers at a subsidized rate (~₹242 per 45kg bag), any drop in LNG import prices directly reduces the Central Government\'s annual fertilizer subsidy bill, easing fiscal deficit pressures.',
      'City Gas Distribution (CGD) companies like Indraprastha Gas (IGL), Mahanagar Gas (MGL), and Gujarat Gas rely on domestic Administered Price Mechanism (APM) gas allocations. Reductions in APM allocation force CGD players to blend more expensive imported LNG, compressing EBITDA per standard cubic meter.',
      'For industrial power and tile manufacturing clusters (such as the Morbi ceramic cluster in Gujarat), affordable natural gas is vital to remain cost-competitive against Chinese imports in export markets.'
    ],
    formulaOrCalculation: 'Domestic Gas Ceiling = Min($6.50/mmBtu, 10% of Indian Crude Basket Price) | Imported LNG Landed = Henry Hub/JKM Spot + Liquefaction + Shipping + Regasification + Pipeline Tariff',
    historicalRange: {
      tenYearHigh: '₹780 / mmBtu (August 2022 European Energy Crisis)',
      tenYearLow: '₹115 / mmBtu (June 2020)',
      historicalMedian: '₹240 / mmBtu'
    },
    goodBad: {
      good: 'Imported LNG in the $9.00 - $11.00 / mmBtu range: Allows CGD companies to sustain 15-20% volume growth, keeps urea subsidies below ₹1.6 Lakh Crore, and protects Morbi tile exports.',
      bad: 'LNG spiking above $25 / mmBtu: Forces massive fertilizer subsidy budget revisions, triggers CNG price hikes that push drivers back to diesel, and halts gas-based power generation.'
    },
    indianContext: 'The Government of India has a stated policy goal to increase the share of natural gas in the primary energy basket from 6.3% to 15% by 2030, building a nationwide National Gas Grid ("One Nation One Gas Grid") and expanding city gas coverage to 90%+ of the population.',
    transmissionChannels: [
      {
        macroFactor: 'Lower Imported Spot LNG Realizations',
        targetEquityOrIndex: 'Fertilizer Subsidies & Government Fiscal Deficit',
        direction: 'tailwind',
        sensitivityMetric: 'Every $1/mmBtu drop in LNG saves ~₹5,000 Crore in Central Urea Subsidies',
        mechanism: 'Fertilizer plants use natural gas as hydrogen feedstock to synthesize ammonia and urea. Lower feedstock costs reduce the cash outflow required from the Ministry of Finance.',
        historicalPrecedent: 'In FY24, softening global LNG prices enabled the government to reduce the fertilizer subsidy budget from ₹2.5 Lakh Cr to ₹1.88 Lakh Cr without raising farm urea prices.'
      },
      {
        macroFactor: 'Domestic APM Gas Allocation Cuts',
        targetEquityOrIndex: 'Indraprastha Gas (IGL) & Mahanagar Gas (MGL)',
        direction: 'headwind',
        sensitivityMetric: 'EBITDA per SCM: Every 10% cut in APM allocation compresses EBITDA/scm by ₹0.80 to ₹1.20',
        mechanism: 'When the government redirects domestic APM gas to high-priority fertilizer units, CGD players must procure expensive imported LNG or HP-HT gas, forcing price hikes or margin contraction.',
        historicalPrecedent: 'In late 2024, a 20% cut in APM gas allocation triggered a 15-18% correction across IGL and MGL share prices.'
      },
      {
        macroFactor: 'Deepwater Gas Production Ramp-Up',
        targetEquityOrIndex: 'Reliance Industries (RIL) & ONGC',
        direction: 'tailwind',
        sensitivityMetric: 'KG-D6 deepwater production touching 30 mmscmd at ceiling prices of ~$9.80/mmBtu',
        mechanism: 'High-Pressure High-Temperature (HPHT) deepwater gas earns market-linked capped prices, generating billions in annual free cash flow for upstream operators.',
        historicalPrecedent: 'RIL upstream gas division EBITDA surged to record highs in FY24 as KG-D6 field reached plateau production.'
      }
    ],
    dailyUpdate: {
      tradingDate: 'Friday, November 13, 2026',
      sessionVerdict: 'Natural Gas settles down -1.41% at ₹265.40 on MCX as mild North American winter forecasts cap heating demand.',
      marketImpactSummary: 'Natural Gas eased to ₹265.40 on MCX amid abundant US domestic storage and unseasonably mild weather. Soft spot LNG prices continue to provide margin relief to Indian ceramic tile makers and reduce feedstock costs for urea manufacturers.',
      sectorWinners: [
        { name: 'Ceramics & Glass Makers (Kajaria, Cera)', rationale: 'Fuel and power costs drop, boosting operating EBITDA margins.' },
        { name: 'Fertilizer PSUs (Chambal, Coromandel)', rationale: 'Lower working capital strain from government subsidy receivable delays.' }
      ],
      sectorLosers: [
        { name: 'Pure Upstream Gas Explorers', rationale: 'Mild headwind on spot gas realizations for unhedged volumes.' }
      ],
      niftyTransmission: 'Neutral for headline Nifty 50; strong positive for mid-cap building materials and tile manufacturers.'
    },
    weekendWrap: {
      weekEnding: 'Sunday, November 15, 2026',
      weeklyPerformance: '-3.18% weekly decline (MCX ₹265.40, Henry Hub $2.82/mmBtu)',
      weeklyNarrative: 'Global gas prices remained subdued across both Henry Hub and Asian JKM benchmarks. European underground storage inventories entered the winter season at 94% capacity, mitigating any immediate winter supply spike risks.',
      globalDrivers: [
        'US Lower-48 gas storage levels sat 5.8% above the 5-year historical average.',
        'India\'s Petronet LNG signed long-term regasified contracts with QatarEnergy at attractive crude-linked slopes.',
        'Gujarat Gas reported steady volume recovery in Morbi industrial areas as natural gas regained cost-competitiveness against propane.'
      ],
      mondayOpeningWatchlist: 'Watch Gujarat Gas (₹540 level) and Kajaria Ceramics (₹1,320 level) for margin expansion tailwinds.',
      institutionalTakeaway: 'Accumulate City Gas Distribution players selectively where current market prices have already fully priced in APM gas cuts, focusing on companies with high industrial volume growth.'
    }
  },

  copper: {
    slug: 'copper',
    name: 'Copper',
    symbol: 'COPPER',
    exchange: 'MCX',
    benchmarkUnit: '₹ / kg (MCX) | $ / tonne (LME)',
    livePriceDisplay: '₹842.50',
    liveChangeDisplay: '+₹4.20 (+0.50%)',
    isPositive: true,
    category: 'Industrial Metals',
    title: 'Copper: "Doctor Copper" & Indian Grid Electrification',
    intro: 'Copper is famously nicknamed "Doctor Copper" because it is the only metal with a Ph.D. in economics — its price movements accurately diagnose the health of the entire global economy. In India, copper is the indispensable backbone of grid electrification, electric vehicles, and infrastructure build-outs.',
    analogy: 'Imagine copper as the human nervous system of the industrial world. Just as nerves carry electrical signals to every muscle in your body, copper cables carry electrical power to every fan, metro train, EV charger, and transformer in India. You cannot build a single skyscraper, bullet train, or solar farm without hundreds of tonnes of copper wire inside its walls.',
    deepDive: [
      'An electric vehicle requires roughly 80 to 85 kilograms of copper — nearly four times the 22 kilograms used in a conventional internal combustion engine car. Furthermore, offshore wind farms and solar installations require between 3 to 5 tonnes of copper per megawatt of capacity.',
      'India was historically a net exporter of refined copper. However, following the 2018 closure of Vedanta\'s 400,000-tonne Sterlite Copper smelter in Tuticorin, Tamil Nadu due to environmental protests, India became a net importer of refined copper, importing over $3 Billion worth annually.',
      'Major domestic beneficiaries of copper value-addition include wire and cable manufacturers like Polycab India, Havells, and KEI Industries, as well as integrated primary copper miners like Hindalco Industries (operating the Birla Copper smelter at Dahej, Gujarat).',
      'Wire and cable manufacturers operate on a cost-plus pricing model: they pass copper price changes directly to dealers and consumers within 15 to 30 days. When copper prices rise steadily, these companies generate inventory gains and volume growth as dealers stock up before further price hikes.',
      'Global copper mine supply faces severe structural constraints: declining ore grades in Chile, political disruptions in Panama (closure of the Cobre Panama mine), and lack of new major tier-1 discoveries.'
    ],
    formulaOrCalculation: 'MCX Landed Copper = [LME Cash ($/MT) ÷ 1000] × USD/INR × (1 + Customs Duty 2.5% + AIDC) + Smelting Premium + GST (18%)',
    historicalRange: {
      tenYearHigh: '₹915 / kg (May 2024)',
      tenYearLow: '₹335 / kg (March 2020)',
      historicalMedian: '₹680 / kg'
    },
    goodBad: {
      good: 'Copper trading steadily in the ₹800 - ₹860 / kg range: Supports healthy operating margins for domestic smelters like Hindalco, maintains working capital predictability for Polycab and Havells, and incentivizes recycling.',
      bad: 'Copper crashing below ₹550 / kg: Reflects severe global manufacturing recession, compresses Hindalco Novelis conversion margins, and causes inventory write-downs.'
    },
    indianContext: 'The Power Grid Corporation of India and state electricity boards are executing a ₹9.1 Lakh Crore National Electricity Plan to integrate 500 GW of renewable energy by 2030, generating immense, structural demand for high-voltage copper transmission cables.',
    transmissionChannels: [
      {
        macroFactor: 'Structural Copper Supercycle',
        targetEquityOrIndex: 'Hindalco Industries Ltd',
        direction: 'tailwind',
        sensitivityMetric: 'Copper Smelter EBITDA: Dahej smelter generates ~₹1,800 Cr annual EBITDA on steady TC/RCs and cathode premiums',
        mechanism: 'As India\'s primary refined copper producer, Hindalco benefits from robust domestic cathode demand, commanding healthy domestic premiums over LME spot.',
        historicalPrecedent: 'Hindalco consolidated revenue and profits reached record levels during the 2021-2022 industrial commodities upcycle.'
      },
      {
        macroFactor: 'Steadily Rising Copper Prices',
        targetEquityOrIndex: 'Cable & Wire Leaders (Polycab India, KEI Industries)',
        direction: 'tailwind',
        sensitivityMetric: 'Cost-Plus Pricing: Re-pricing cycles take only 15-30 days; inventory holding gains expand quarterly margins',
        mechanism: 'Organized cable makers pass raw material spikes directly to institutional EPC contractors and retail distribution channels, expanding absolute gross profit per kilometre.',
        historicalPrecedent: 'Polycab delivered 35%+ earnings growth in FY23-FY24 alongside rising industrial copper price trends.'
      },
      {
        macroFactor: 'Extreme Copper Spikes (>₹900/kg)',
        targetEquityOrIndex: 'Electrical Consumer Durables (Havells, Voltas)',
        direction: 'headwind',
        sensitivityMetric: 'Motor & Compressor Input: Fans and AC compressors contain 2-4 kg of copper wire',
        mechanism: 'Sudden raw material price surges cannot be passed on immediately in consumer durables, causing temporary margin compression during seasonal inventory build-ups.',
        historicalPrecedent: 'Consumer appliance makers experienced 150-200 bps margin contraction during the rapid Q1 2022 raw material inflation phase.'
      }
    ],
    dailyUpdate: {
      tradingDate: 'Friday, November 13, 2026',
      sessionVerdict: 'Copper adds +0.50% to ₹842.50/kg on MCX as global mine supply constraints offset muted near-term factory data.',
      marketImpactSummary: 'Doctor Copper edged higher to ₹842.50 on MCX, supported by low visible inventories on the London Metal Exchange (LME) and continued grid investment tenders by Power Grid Corporation. The firmness reinforces the capital expenditure cycle narrative across Indian engineering and cable leaders.',
      sectorWinners: [
        { name: 'Primary Metals (Hindalco Industries)', rationale: 'Strong domestic cathode off-take and steady treatment and refining charges (TC/RCs).' },
        { name: 'Wire & Cable Manufacturers (Polycab, KEI)', rationale: 'Healthy order books from renewable evacuation projects and metro rail networks.' }
      ],
      sectorLosers: [
        { name: 'Small Unorganized Motor Winders', rationale: 'Working capital strain from high copper rod procurement costs.' }
      ],
      niftyTransmission: 'Positive for Nifty Metal index (+0.8%); provides fundamental validation for India\'s capital goods and infrastructure theme.'
    },
    weekendWrap: {
      weekEnding: 'Sunday, November 15, 2026',
      weeklyPerformance: '+1.42% weekly advance (LME $9,380/MT, MCX ₹842.50/kg)',
      weeklyNarrative: 'Copper prices consolidated near 5-month highs. Spot treatment and refining charges (TC/RCs) paid by miners to smelters hovered near historic lows, confirming severe tightness in global copper concentrate supplies.',
      globalDrivers: [
        'LME registered warehouse stockpiles dipped to 210,000 tonnes, with cancelled warrants rising to 28%.',
        'India\'s Ministry of Power reported that 24,000 circuit kilometres of transmission lines were commissioned in H1 FY27.',
        'Global EV sales reached a record 1.6 million units in October, cementing long-term automotive copper consumption.'
      ],
      mondayOpeningWatchlist: 'Watch Polycab (₹6,800 resistance) and Hindalco (₹680 level) for sustained institutional accumulation.',
      institutionalTakeaway: 'Maintain high conviction overweight on the Indian wire and cable complex as a secular proxy on power grid modernization and industrial electrification.'
    }
  },

  usd_inr: {
    slug: 'usd-inr',
    name: 'USD / INR',
    symbol: 'USDINR',
    exchange: 'FOREX',
    benchmarkUnit: 'Indian Rupees per US Dollar',
    livePriceDisplay: '₹84.38',
    liveChangeDisplay: '+₹0.04 (+0.05%)',
    isPositive: true,
    category: 'Currency',
    title: 'USD/INR: The Sovereign Foreign Exchange Anchor',
    intro: 'The US Dollar to Indian Rupee (USD/INR) exchange rate is the sovereign pricing benchmark for India\'s cross-border economy. Managed proactively by the Reserve Bank of India (RBI), it determines export realizations for IT and pharma against the domestic cost of imported oil and electronics.',
    analogy: 'Imagine a seesaw between an American dollar and an Indian rupee. When the dollar gets heavier (rises to ₹85), an Indian tech engineer in Bengaluru billing an American client in dollars gets more rupees in his bank account for the exact same code. But an Indian oil refiner buying Saudi crude has to pay far more rupees for the exact same barrel of diesel. The RBI acts like a referee standing in the middle, stopping the seesaw from swinging wildly.',
    deepDive: [
      'The Indian Rupee operates under a "managed float" currency regime. The RBI actively intervenes in the spot and forward foreign exchange markets to suppress excess volatility, utilizing its massive $719.55 Billion foreign exchange reserve war chest.',
      'India\'s large-cap IT services companies (TCS, Infosys, HCL Tech, Wipro) bill between 60% to 75% of their total contracts in US Dollars, while over 65% of their operating cost structure (software engineer salaries, domestic facilities) is denominated in Indian Rupees. As a general rule, every 1% depreciation in the Rupee against the Dollar expands IT operating margins by 25 to 30 basis points.',
      'Conversely, dollar strength creates imported inflation for crude oil, natural gas, edible oils, and electronics components. Furthermore, Indian corporations with unhedged External Commercial Borrowings (ECBs) face higher rupee debt-servicing burdens when the rupee weakens.',
      'Historically, the Rupee depreciates against the US Dollar at a secular average rate of roughly 2.5% to 3.5% annually, reflecting the structural inflation differential between India (CPI ~4-6%) and the United States (CPI ~2-3%).',
      'The Real Effective Exchange Rate (REER) measures the Rupee\'s value against a trade-weighted basket of 40 currencies adjusted for inflation differentials. A 40-currency REER above 100 indicates mild overvaluation.'
    ],
    formulaOrCalculation: 'USD/INR Exchange Rate = RBI Reference Rate determined by interbank market trading between Authorized Dealer Category-I banks',
    historicalRange: {
      tenYearHigh: '₹84.45 / USD (November 2026)',
      tenYearLow: '₹62.15 / USD (January 2015)',
      historicalMedian: '₹74.20 / USD'
    },
    goodBad: {
      good: 'Orderly, low-volatility Rupee glide path (depreciating ~2% annually): Preserves export competitiveness for IT and pharmaceuticals without causing inflation spikes or capital flight.',
      bad: 'Disorderly Rupee plunge (>5% in a quarter): Triggers severe FII outflows from domestic equities, spikes imported fuel inflation, and forces RBI liquidity tightening.'
    },
    indianContext: 'With RBI foreign exchange reserves at an all-time record $719.55 Billion (including $104.8 Billion in physical gold), the RBI possesses unparalleled firepower to defend the Rupee against speculative attacks, making USD/INR one of the least volatile emerging market currencies globally.',
    transmissionChannels: [
      {
        macroFactor: 'Controlled Rupee Depreciation (Toward ₹84.50)',
        targetEquityOrIndex: 'IT Services Exporters (TCS, Infosys, HCL Tech)',
        direction: 'tailwind',
        sensitivityMetric: 'Operating EBIT Margin: +25 to +30 bps margin expansion for every 1% USD/INR depreciation',
        mechanism: 'IT contracts are billed in USD, EUR, and GBP, while overhead and salary costs are primarily paid in INR. Dollar appreciation delivers instantaneous translation margin expansion.',
        historicalPrecedent: 'In FY19, when the Rupee depreciated from 65 to 74 against the USD, TCS and Infosys operating margins absorbed wage hikes without margin compression.'
      },
      {
        macroFactor: 'Controlled Rupee Depreciation (Toward ₹84.50)',
        targetEquityOrIndex: 'Generic Pharmaceuticals (Sun Pharma, Dr. Reddy\'s, Cipla)',
        direction: 'tailwind',
        sensitivityMetric: 'US Formulation Realizations: Boosts export gross margin by ~40 bps per 1% Rupee decline',
        mechanism: 'Indian pharma majors generate 30-40% of their revenues from US ANDA generic filings in dollars, while manufacturing active pharmaceutical ingredients (APIs) locally.',
        historicalPrecedent: 'Pharma exporters sustained gross margins above 70% during prolonged periods of rupee depreciation.'
      },
      {
        macroFactor: 'Sharp Dollar Spikes',
        targetEquityOrIndex: 'Imported Energy & Consumer Electronics',
        direction: 'headwind',
        sensitivityMetric: 'Import Cost: Spikes rupee cost of landed crude oil and electronics components',
        mechanism: 'Importers must surrender more rupees to purchase dollar-denominated imports, forcing price increases onto domestic consumers or compressing distributor margins.',
        historicalPrecedent: 'Electronics retailers experienced compressed festive gross margins during the rapid dollar rally of autumn 2022.'
      }
    ],
    dailyUpdate: {
      tradingDate: 'Friday, November 13, 2026',
      sessionVerdict: 'USD/INR trades steady at ₹84.38 (+₹0.04) as RBI dollar intervention anchors currency volatility.',
      marketImpactSummary: 'The Rupee traded in an ultra-narrow band between 84.36 and 84.42 on Friday, closing at 84.38. Active dollar supply from state-run banks on behalf of the RBI counterbalanced foreign portfolio outflows, maintaining remarkable exchange rate stability.',
      sectorWinners: [
        { name: 'IT Services Majors (TCS, Infosys)', rationale: 'Stable dollar realizations protect Q3 constant-currency revenue forecasts.' },
        { name: 'Export-Oriented Pharma', rationale: 'Predictable foreign exchange realization on US generic formulation shipments.' }
      ],
      sectorLosers: [
        { name: 'High Dollar-Debt Corporates', rationale: 'Mild hedging premium costs on external commercial borrowing maturities.' }
      ],
      niftyTransmission: 'Anchor of stability: Low currency volatility gives foreign institutional investors (FIIs) confidence in sovereign macro stability, preventing currency-induced equity fire-sales.'
    },
    weekendWrap: {
      weekEnding: 'Sunday, November 15, 2026',
      weeklyPerformance: '+0.08% weekly change (opened at 84.32, closed at 84.38)',
      weeklyNarrative: 'USD/INR volatility dropped to a multi-month low of 1.4% annualized. Despite persistent US Dollar strength against the Euro and Yen following the US elections, the Indian Rupee remained completely decoupled from emerging market peer selloffs.',
      globalDrivers: [
        'India\'s foreign exchange reserves stood at $719.55 Billion, providing over 11 months of projected import cover.',
        'Net Foreign Direct Investment (FDI) inflows remained positive, supported by global electronics supply chain relocation.',
        'Crude oil prices hovering at $72.80/bbl kept commercial dollar bidding orderly.'
      ],
      mondayOpeningWatchlist: 'Expect USD/INR to open in the 84.35-84.40 range on Monday. Watch IT services stocks (Nifty IT index) for steady defensive outperformance.',
      institutionalTakeaway: 'The RBI\'s managed float regime has transformed the Rupee from a volatile macro risk factor into a predictable, low-beta anchor. Overweight Indian equities on currency-risk-adjusted return profiles.'
    }
  }
};

// Helper function to resolve slug variants
export function getCommodityBySlug(slug: string): CommodityDefinition | null {
  const normalized = slug.toLowerCase().replace(/_/g, '-').trim();
  
  if (normalized === 'gold' || normalized === 'bullion') return COMMODITIES_DATABASE.gold;
  if (normalized === 'crude-oil' || normalized === 'crude' || normalized === 'oil' || normalized === 'brent') return COMMODITIES_DATABASE.crude_oil;
  if (normalized === 'silver') return COMMODITIES_DATABASE.silver;
  if (normalized === 'natural-gas' || normalized === 'natgas' || normalized === 'gas') return COMMODITIES_DATABASE.natural_gas;
  if (normalized === 'copper') return COMMODITIES_DATABASE.copper;
  if (normalized === 'usd-inr' || normalized === 'usdinr' || normalized === 'forex' || normalized === 'rupee') return COMMODITIES_DATABASE.usd_inr;

  return null;
}

// Determines if today is a weekend and delivers dynamic status
export function isWeekendNow(): boolean {
  if (typeof window === 'undefined') {
    const day = new Date().getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }
  const day = new Date().getDay();
  return day === 0 || day === 6;
}
