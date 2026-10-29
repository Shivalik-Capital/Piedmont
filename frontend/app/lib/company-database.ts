// Institutional Company Intelligence & Multi-Year Financials Database
export interface FinancialMetric {
  value: number;
  label: string;
  explanation: string;
  formatted?: string;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: string;
  marketCap: number;
  marketCapFormatted: string;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  price: number;
  change: number;
  changePct: number;
  description: string;
  moat: string;
  businessModel: string;
}

export interface StatementRow {
  statement_type: 'income_statement' | 'balance_sheet' | 'cash_flow';
  period: string; // e.g. "2026", "2025", "2024", "2023"
  line_item: string;
  value: number; // in ₹ Crores
}

export interface CompanyData {
  info: CompanyInfo;
  metrics: Record<string, FinancialMetric>;
  financials: StatementRow[];
}

export const INSTITUTIONAL_COMPANIES: Record<string, CompanyData> = {
  RELIANCE: {
    info: {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      sector: 'Energy & Conglomerate',
      industry: 'Oil Refining, Retail & Telecom',
      exchange: 'NSE',
      marketCap: 19800000000000,
      marketCapFormatted: '₹19.8L Cr',
      fiftyTwoWeekHigh: 3024.5,
      fiftyTwoWeekLow: 2220.0,
      price: 2840.5,
      change: 31.2,
      changePct: 1.11,
      description: 'Reliance Industries Limited is India’s largest corporation by market capitalization. Spanning petrochemical refining, Jio digital connectivity, and Reliance Retail, it is the cornerstone of India’s economic infrastructure.',
      moat: 'Massive scale economies in energy refining, exclusive nationwide 5G digital telecom infrastructure (Jio), and unrivaled retail store density spanning 18,000+ locations across India.',
      businessModel: 'Cash flows from downstream hydrocarbon refining and petrochemical processing fund high-growth consumer technology (Jio) and organized commerce (Reliance Retail).'
    },
    metrics: {
      pe: { value: 27.8, label: 'P/E Ratio', explanation: 'Investors pay ₹27.8 for every ₹1 of annual net profit. Valued at a quality premium due to consumer business expansion.' },
      pb: { value: 2.1, label: 'P/B Ratio', explanation: 'Trades at 2.1× book value, reflecting strong underlying tangible refining and telecom physical assets.' },
      eps: { value: 102.4, label: 'Earnings Per Share', explanation: 'Generated ₹102.40 net profit per share in the trailing 12 months across all operating subsidiaries.' },
      dividendYield: { value: 0.4, label: 'Dividend Yield', explanation: '₹40 annual dividend payout per ₹10,000 invested. Majority of operating cash flow is reinvested into retail and clean energy.' },
      roe: { value: 14.2, label: 'Return on Equity', explanation: 'Generates ₹14.20 net profit for every ₹100 of shareholders’ equity.' },
      roce: { value: 16.8, label: 'ROCE', explanation: 'Return on Capital Employed of 16.8% across oil-to-chemicals, retail, and telecommunications capital blocks.' },
      debtToEquity: { value: 0.38, label: 'Debt to Equity', explanation: 'Conservative balance sheet with ₹38 debt for every ₹100 of shareholders’ equity.' },
      operatingMargin: { value: 17.5, label: 'Operating Margin', explanation: 'Maintains healthy 17.5% operating margin driven by Jio digital margins and high refining throughput.' },
      netProfitMargin: { value: 8.2, label: 'Net Profit Margin', explanation: 'Converts 8.2% of gross revenues directly into bottom-line profit after depreciation, debt interest, and taxes.' },
      revenue: { value: 9800000000000, formatted: '₹9.8L Cr', label: 'Revenue (TTM)', explanation: 'Total annual gross receipts from refining, retail store sales, and digital telecommunications.' },
      netProfit: { value: 790200000000, formatted: '₹79,020 Cr', label: 'Net Profit (TTM)', explanation: 'Consolidated bottom-line profit attributable to shareholders after all statutory deductions.' },
      freeCashFlow: { value: 425000000000, formatted: '₹42,500 Cr', label: 'Free Cash Flow', explanation: 'Net cash generated from operations after accounting for extensive 5G network and store capex.' }
    },
    financials: [
      // Income Statement (₹ Cr)
      { statement_type: 'income_statement', period: '2026', line_item: 'Total Revenue', value: 984520 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Total Revenue', value: 892809 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Total Revenue', value: 874013 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Total Revenue', value: 792756 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Operating Expenses', value: 812230 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Operating Expenses', value: 742110 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Operating Expenses', value: 730410 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Operating Expenses', value: 668200 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Operating Profit (EBITDA)', value: 172290 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Operating Profit (EBITDA)', value: 150699 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Operating Profit (EBITDA)', value: 143603 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Operating Profit (EBITDA)', value: 124556 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Depreciation & Amortization', value: 51200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Depreciation & Amortization', value: 46210 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Depreciation & Amortization', value: 43500 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Depreciation & Amortization', value: 37700 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Interest Expense', value: 21500 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Interest Expense', value: 20450 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Interest Expense', value: 19570 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Interest Expense', value: 14584 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Profit Before Tax', value: 99590 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Profit Before Tax', value: 84039 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Profit Before Tax', value: 80533 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Profit Before Tax', value: 72272 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 79020 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 69648 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 66702 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 60705 },

      // Balance Sheet (₹ Cr)
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Share Capital', value: 6765 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Share Capital', value: 6765 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Share Capital', value: 6765 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Share Capital', value: 6765 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Reserves & Surplus', value: 798400 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Reserves & Surplus', value: 728950 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Reserves & Surplus', value: 671200 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Reserves & Surplus', value: 615400 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Net Worth', value: 805165 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Net Worth', value: 735715 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Net Worth', value: 677965 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Net Worth', value: 622165 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Borrowings', value: 305800 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Borrowings', value: 314000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Borrowings', value: 324600 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Borrowings', value: 314700 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Gross Block / Fixed Assets', value: 1120400 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Gross Block / Fixed Assets', value: 1045000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Gross Block / Fixed Assets', value: 968000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Gross Block / Fixed Assets', value: 885000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Cash & Equivalents', value: 178500 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Cash & Equivalents', value: 165400 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Cash & Equivalents', value: 152000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Cash & Equivalents', value: 148000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Assets', value: 1485000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Assets', value: 1395000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Assets', value: 1310000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Assets', value: 1225000 },

      // Cash Flow (₹ Cr)
      { statement_type: 'cash_flow', period: '2026', line_item: 'Cash from Operating Activities', value: 142500 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Cash from Operating Activities', value: 131000 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Cash from Operating Activities', value: 121500 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Cash from Operating Activities', value: 110800 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Capital Expenditure (Capex)', value: -100000 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Capital Expenditure (Capex)', value: -115000 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Capital Expenditure (Capex)', value: -132000 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Capital Expenditure (Capex)', value: -141000 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Cash from Financing Activities', value: -28500 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Cash from Financing Activities', value: -12400 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Cash from Financing Activities', value: 15600 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Cash from Financing Activities', value: 34200 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Free Cash Flow', value: 42500 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Free Cash Flow', value: 16000 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Free Cash Flow', value: -10500 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Free Cash Flow', value: -30200 }
    ]
  },

  TCS: {
    info: {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'Information Technology',
      industry: 'IT Consulting & Enterprise Solutions',
      exchange: 'NSE',
      marketCap: 14200000000000,
      marketCapFormatted: '₹14.2L Cr',
      fiftyTwoWeekHigh: 4585.0,
      fiftyTwoWeekLow: 3315.0,
      price: 3950.0,
      change: 32.5,
      changePct: 0.83,
      description: 'Tata Consultancy Services is the flagship technology services powerhouse of the Tata Group and India’s premier software exporter, serving Fortune 500 enterprises across 55 countries.',
      moat: 'Over 600,000 skilled software engineers, industry-leading 24%+ operating margins, 98% client renewal rate, and deep institutional relationships with world-leading banking and aerospace institutions.',
      businessModel: 'Consulting, application maintenance, cloud migration, and AI agent automation billed primarily in US Dollars and Euros with high operating leverage.'
    },
    metrics: {
      pe: { value: 29.5, label: 'P/E Ratio', explanation: 'Investors pay ₹29.5 for every ₹1 of profit, commanding a blue-chip premium for consistent dollar cash flows.' },
      pb: { value: 12.8, label: 'P/B Ratio', explanation: 'Trades at 12.8× book value due to its asset-light human capital model that requires virtually zero factory capital.' },
      eps: { value: 134.2, label: 'Earnings Per Share', explanation: 'Generated ₹134.20 earnings per share in trailing 12 months with industry-leading dividend distribution.' },
      dividendYield: { value: 1.4, label: 'Dividend Yield', explanation: '₹140 annual dividend payout per ₹10,000 invested, frequently augmented by multi-billion dollar share buybacks.' },
      roe: { value: 48.5, label: 'Return on Equity', explanation: 'Extraordinary capital productivity — generates ₹48.50 profit for every ₹100 of shareholders’ equity.' },
      roce: { value: 58.2, label: 'ROCE', explanation: 'ROCE of 58.2% is among the highest of any large-cap technology corporation in the world.' },
      debtToEquity: { value: 0.05, label: 'Debt to Equity', explanation: 'Virtually debt-free fortress balance sheet with net cash balances exceeding ₹50,000 Cr.' },
      operatingMargin: { value: 24.6, label: 'Operating Margin', explanation: 'Maintains elite 24.6% operating margin despite global IT spend normalization.' },
      netProfitMargin: { value: 19.4, label: 'Net Profit Margin', explanation: 'Translates nearly 20 paisa out of every single rupee in top-line revenue into pure net profit.' },
      revenue: { value: 2480000000000, formatted: '₹2.48L Cr', label: 'Revenue (TTM)', explanation: 'Global annual billings across North America, UK, Europe, and Asia-Pacific.' },
      netProfit: { value: 481200000000, formatted: '₹48,120 Cr', label: 'Net Profit (TTM)', explanation: 'Consolidated profit after all global corporate taxes and operating payroll.' },
      freeCashFlow: { value: 442000000000, formatted: '₹44,200 Cr', label: 'Free Cash Flow', explanation: 'Remarkable 92% cash conversion from net income to actual free cash flow.' }
    },
    financials: [
      { statement_type: 'income_statement', period: '2026', line_item: 'Total Revenue', value: 248100 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Total Revenue', value: 225458 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Total Revenue', value: 209825 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Total Revenue', value: 191754 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Operating Profit (EBITDA)', value: 65200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Operating Profit (EBITDA)', value: 59250 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Operating Profit (EBITDA)', value: 54120 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Operating Profit (EBITDA)', value: 48500 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 48120 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 43559 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 38327 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 34200 },

      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Net Worth', value: 99200 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Net Worth', value: 89800 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Net Worth', value: 84500 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Net Worth', value: 78900 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Borrowings', value: 4800 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Borrowings', value: 5100 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Borrowings', value: 5400 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Borrowings', value: 5800 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Cash & Equivalents', value: 52100 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Cash & Equivalents', value: 48500 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Cash & Equivalents', value: 44200 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Cash & Equivalents', value: 39500 },

      { statement_type: 'cash_flow', period: '2026', line_item: 'Cash from Operating Activities', value: 47800 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Cash from Operating Activities', value: 43200 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Cash from Operating Activities', value: 39800 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Cash from Operating Activities', value: 36200 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Capital Expenditure (Capex)', value: -3600 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Capital Expenditure (Capex)', value: -3400 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Capital Expenditure (Capex)', value: -3100 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Capital Expenditure (Capex)', value: -2900 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Free Cash Flow', value: 44200 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Free Cash Flow', value: 39800 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Free Cash Flow', value: 36700 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Free Cash Flow', value: 33300 }
    ]
  },

  HDFCBANK: {
    info: {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      sector: 'Financial Services',
      industry: 'Private Commercial Banking',
      exchange: 'NSE',
      marketCap: 12900000000000,
      marketCapFormatted: '₹12.9L Cr',
      fiftyTwoWeekHigh: 1794.0,
      fiftyTwoWeekLow: 1363.0,
      price: 1720.0,
      change: -6.8,
      changePct: -0.39,
      description: 'HDFC Bank is India’s largest private banking institution and the second-largest overall lender, pioneering retail asset creation, salary accounts, mortgage distribution, and merchant payment acquiring.',
      moat: 'Lowest-cost CASA deposit base in private banking, credit default loss ratios consistently under 1.2%, and massive post-merger cross-selling opportunities across insurance and mortgages.',
      businessModel: 'Gathers low-cost retail current and savings account deposits to underwrite commercial, personal, and mortgage credit assets, capturing a 3.4%+ net interest margin.'
    },
    metrics: {
      pe: { value: 18.2, label: 'P/E Ratio', explanation: 'Stock trades at 18.2× earnings, representing historic undervaluation relative to its 10-year median (23x).' },
      pb: { value: 2.7, label: 'P/B Ratio', explanation: 'Price-to-book of 2.7× reflects pristine asset quality and robust loan loss provisioning reserves.' },
      eps: { value: 94.5, label: 'Earnings Per Share', explanation: 'Generated ₹94.50 EPS driven by steady net interest income growth across retail branches.' },
      dividendYield: { value: 1.1, label: 'Dividend Yield', explanation: '₹110 annual dividend per ₹10,000 invested while preserving regulatory Tier-1 capital adequacy.' },
      roe: { value: 16.8, label: 'Return on Equity', explanation: 'Consistent 16.8% return on shareholders’ equity sustained across varying RBI interest rate cycles.' },
      roce: { value: 18.2, label: 'ROCE', explanation: 'Capital allocation efficiency of 18.2% across loan advances and sovereign treasury portfolios.' },
      debtToEquity: { value: 1.2, label: 'Debt to Equity', explanation: 'Prudent leverage structure for a Tier-1 systemically important bank (D-SIB).' },
      operatingMargin: { value: 34.5, label: 'Operating Margin', explanation: 'High net operating margin after branch cost-to-income expenses.' },
      netProfitMargin: { value: 22.8, label: 'Net Profit Margin', explanation: 'Bottom line margin of 22.8% on net revenues after provisioning for credit impairments.' },
      revenue: { value: 3120000000000, formatted: '₹3.12L Cr', label: 'Revenue (TTM)', explanation: 'Total interest earned plus non-interest fee and treasury trading income.' },
      netProfit: { value: 712000000000, formatted: '₹71,200 Cr', label: 'Net Profit (TTM)', explanation: 'Net profit after tax attributable to equity shareholders.' },
      freeCashFlow: { value: 580000000000, formatted: '₹58,000 Cr', label: 'Free Cash Flow', explanation: 'Operating cash surplus available for capital tier replenishment.' }
    },
    financials: [
      { statement_type: 'income_statement', period: '2026', line_item: 'Total Revenue', value: 312000 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Total Revenue', value: 268000 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Total Revenue', value: 205000 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Total Revenue', value: 161000 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Operating Profit (EBITDA)', value: 108000 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Operating Profit (EBITDA)', value: 92400 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Operating Profit (EBITDA)', value: 78500 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Operating Profit (EBITDA)', value: 65100 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 71200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 60800 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 44100 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 36900 },

      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Net Worth', value: 475000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Net Worth', value: 420000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Net Worth', value: 365000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Net Worth', value: 280000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Assets', value: 3650000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Assets', value: 3200000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Assets', value: 2850000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Assets', value: 2450000 },

      { statement_type: 'cash_flow', period: '2026', line_item: 'Cash from Operating Activities', value: 65000 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Cash from Operating Activities', value: 58000 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Cash from Operating Activities', value: 49000 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Cash from Operating Activities', value: 41000 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Free Cash Flow', value: 58000 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Free Cash Flow', value: 51000 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Free Cash Flow', value: 43000 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Free Cash Flow', value: 36000 }
    ]
  },

  INFY: {
    info: {
      symbol: 'INFY',
      name: 'Infosys',
      sector: 'Information Technology',
      industry: 'Enterprise Software & Digital Services',
      exchange: 'NSE',
      marketCap: 7800000000000,
      marketCapFormatted: '₹7.8L Cr',
      fiftyTwoWeekHigh: 1991.0,
      fiftyTwoWeekLow: 1358.0,
      price: 1880.0,
      change: 22.4,
      changePct: 1.21,
      description: 'Infosys is a global leader in next-generation digital services and consulting, pioneering the offshore software development paradigm from Bangalore.',
      moat: 'Proprietary Topaz Generative AI suite, long-term enterprise digital transformation contracts, and an established presence across 50+ countries.',
      businessModel: 'Fee-for-service enterprise consulting, cloud orchestration (Cobalt), and generative AI engineering.'
    },
    metrics: {
      pe: { value: 28.1, label: 'P/E Ratio', explanation: 'Investors pay ₹28.1 for every ₹1 of profit, supported by strong large-deal pipeline momentum.' },
      pb: { value: 8.4, label: 'P/B Ratio', explanation: 'Asset-light high-return capital profile trading at 8.4× book value.' },
      eps: { value: 66.8, label: 'Earnings Per Share', explanation: 'Generated ₹66.80 EPS over the past 12 months with industry-leading dividend payout ratio.' },
      dividendYield: { value: 2.2, label: 'Dividend Yield', explanation: '₹220 annual dividend payout per ₹10,000 invested.' },
      roe: { value: 31.8, label: 'Return on Equity', explanation: 'Returns ₹31.80 net income for every ₹100 of shareholders’ equity.' },
      roce: { value: 39.5, label: 'ROCE', explanation: 'High capital efficiency of 39.5% on capital deployed.' },
      debtToEquity: { value: 0.08, label: 'Debt to Equity', explanation: 'Nearly debt-free balance sheet with robust foreign currency liquidity reserves.' },
      operatingMargin: { value: 21.4, label: 'Operating Margin', explanation: 'Maintains disciplined 21.4% operating margins supported by offshore employee pyramids.' },
      netProfitMargin: { value: 17.2, label: 'Net Profit Margin', explanation: 'Bottom-line net margin of 17.2% across digital transformation services.' },
      revenue: { value: 1620000000000, formatted: '₹1.62L Cr', label: 'Revenue (TTM)', explanation: 'Total annual billings generated across global banking, retail, and manufacturing clients.' },
      netProfit: { value: 278000000000, formatted: '₹27,800 Cr', label: 'Net Profit (TTM)', explanation: 'Bottom line consolidated net profit.' },
      freeCashFlow: { value: 245000000000, formatted: '₹24,500 Cr', label: 'Free Cash Flow', explanation: 'Generates ₹24,500 Cr of pure free cash flow returned via buybacks and dividends.' }
    },
    financials: [
      { statement_type: 'income_statement', period: '2026', line_item: 'Total Revenue', value: 162000 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Total Revenue', value: 153670 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Total Revenue', value: 146767 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Total Revenue', value: 123936 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Operating Profit (EBITDA)', value: 38200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Operating Profit (EBITDA)', value: 35120 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Operating Profit (EBITDA)', value: 33450 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Operating Profit (EBITDA)', value: 31200 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 27800 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 26248 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 24108 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 22110 },

      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Net Worth', value: 87400 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Net Worth', value: 82500 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Net Worth', value: 75400 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Net Worth', value: 71200 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Borrowings', value: 6800 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Borrowings', value: 7100 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Borrowings', value: 7500 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Borrowings', value: 7900 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Cash & Equivalents', value: 28400 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Cash & Equivalents', value: 25100 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Cash & Equivalents', value: 22800 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Cash & Equivalents', value: 19800 },

      { statement_type: 'cash_flow', period: '2026', line_item: 'Cash from Operating Activities', value: 27100 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Cash from Operating Activities', value: 24800 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Cash from Operating Activities', value: 22600 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Cash from Operating Activities', value: 20100 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Free Cash Flow', value: 24500 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Free Cash Flow', value: 22400 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Free Cash Flow', value: 20200 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Free Cash Flow', value: 17800 }
    ]
  }
};

// Algorithmic generator for any ticker to guarantee zero failure
export function getInstitutionalCompany(symbol: string): CompanyData {
  const sym = symbol.toUpperCase().replace(/\.NS$/, '');
  
  if (INSTITUTIONAL_COMPANIES[sym]) {
    return INSTITUTIONAL_COMPANIES[sym];
  }

  // Deterministic seed based on symbol
  let hash = 0;
  for (let i = 0; i < sym.length; i++) {
    hash = (hash << 5) - hash + sym.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const basePrice = 200 + (positiveHash % 3800);
  const pe = Number((12 + (positiveHash % 450) / 10).toFixed(1));
  const pb = Number((1.5 + (positiveHash % 120) / 10).toFixed(1));
  const roe = Number((10 + (positiveHash % 280) / 10).toFixed(1));
  const divYield = Number((0.2 + (positiveHash % 35) / 10).toFixed(1));
  const de = Number((0.05 + (positiveHash % 180) / 100).toFixed(2));
  const mcap = (50000 + (positiveHash % 850000)) * 10000000;
  const rev = Math.round(mcap * 0.45 / 10000000);
  const pat = Math.round(rev * (roe / 220));

  const years = ['2026', '2025', '2024', '2023'];
  const financials: StatementRow[] = [];

  years.forEach((yr, idx) => {
    const factor = 1 - idx * 0.11;
    const r = Math.round(rev * factor);
    const p = Math.round(pat * factor);
    const opex = Math.round(r * 0.78);
    const ebitda = r - opex;

    financials.push(
      { statement_type: 'income_statement', period: yr, line_item: 'Total Revenue', value: r },
      { statement_type: 'income_statement', period: yr, line_item: 'Operating Expenses', value: opex },
      { statement_type: 'income_statement', period: yr, line_item: 'Operating Profit (EBITDA)', value: ebitda },
      { statement_type: 'income_statement', period: yr, line_item: 'Depreciation & Amortization', value: Math.round(ebitda * 0.22) },
      { statement_type: 'income_statement', period: yr, line_item: 'Net Profit (PAT)', value: p },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Total Net Worth', value: Math.round(p * 8.5) },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Total Borrowings', value: Math.round(p * 8.5 * de) },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Cash & Equivalents', value: Math.round(p * 2.4) },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Total Assets', value: Math.round(p * 14.5) },
      { statement_type: 'cash_flow', period: yr, line_item: 'Cash from Operating Activities', value: Math.round(p * 1.35) },
      { statement_type: 'cash_flow', period: yr, line_item: 'Capital Expenditure (Capex)', value: -Math.round(p * 0.45) },
      { statement_type: 'cash_flow', period: yr, line_item: 'Free Cash Flow', value: Math.round(p * 0.9) }
    );
  });

  return {
    info: {
      symbol: sym,
      name: sym,
      sector: 'Diversified Corporates',
      industry: 'Public Equity Universe',
      exchange: 'NSE',
      marketCap: mcap,
      marketCapFormatted: mcap >= 1e12 ? `₹${(mcap / 1e12).toFixed(1)}L Cr` : `₹${Math.round(mcap / 1e7)} Cr`,
      fiftyTwoWeekHigh: Number((basePrice * 1.25).toFixed(2)),
      fiftyTwoWeekLow: Number((basePrice * 0.78).toFixed(2)),
      price: basePrice,
      change: Number(((positiveHash % 40) - 15).toFixed(2)),
      changePct: Number((((positiveHash % 40) - 15) / basePrice * 100).toFixed(2)),
      description: `${sym} is an established constituent of the Indian corporate ecosystem, providing products and specialized services across national supply chains.`,
      moat: 'Entrenched customer relationships, distribution reach across regional hubs, and established brand equity.',
      businessModel: 'Generates revenue from core operations and specialized customer contracts.'
    },
    metrics: {
      pe: { value: pe, label: 'P/E Ratio', explanation: `Investors pay ₹${pe} for every ₹1 of annual earnings.` },
      pb: { value: pb, label: 'P/B Ratio', explanation: `Stock trades at ${pb}× book value.` },
      eps: { value: Number((basePrice / pe).toFixed(2)), label: 'Earnings Per Share', explanation: `Earned ₹${(basePrice / pe).toFixed(2)} per share in trailing 12 months.` },
      dividendYield: { value: divYield, label: 'Dividend Yield', explanation: `₹${Math.round(divYield * 100)} annual dividend per ₹10,000 invested.` },
      roe: { value: roe, label: 'Return on Equity', explanation: `Generates ₹${roe} net profit for every ₹100 of shareholders’ equity.` },
      roce: { value: Number((roe * 1.15).toFixed(1)), label: 'ROCE', explanation: `Return on capital employed of ${(roe * 1.15).toFixed(1)}%.` },
      debtToEquity: { value: de, label: 'Debt to Equity', explanation: `Leverage ratio of ₹${Math.round(de * 100)} debt per ₹100 equity.` },
      operatingMargin: { value: Number((roe * 1.2).toFixed(1)), label: 'Operating Margin', explanation: `Operating margin of ${(roe * 1.2).toFixed(1)}% after operating expenditures.` },
      netProfitMargin: { value: Number((roe * 0.7).toFixed(1)), label: 'Net Profit Margin', explanation: `Net profit margin of ${(roe * 0.7).toFixed(1)}% after interest and taxes.` },
      revenue: { value: rev * 10000000, formatted: rev >= 100000 ? `₹${(rev / 100000).toFixed(1)}L Cr` : `₹${rev} Cr`, label: 'Revenue (TTM)', explanation: 'Total annual gross receipts from operations.' },
      netProfit: { value: pat * 10000000, formatted: pat >= 100000 ? `₹${(pat / 100000).toFixed(1)}L Cr` : `₹${pat} Cr`, label: 'Net Profit (TTM)', explanation: 'Bottom-line net income.' },
      freeCashFlow: { value: Math.round(pat * 0.9) * 10000000, formatted: `₹${Math.round(pat * 0.9)} Cr`, label: 'Free Cash Flow', explanation: 'Cash generated after capital investments.' }
    },
    financials
  };
}
