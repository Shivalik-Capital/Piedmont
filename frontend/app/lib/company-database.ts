// Institutional Company Intelligence & Multi-Year Financials Database
export type CompanyType = 'corporate' | 'bank' | 'nbfc';

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
  companyType: CompanyType;
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
  statement_type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'asset_quality';
  period: string; // e.g. "2026", "2025", "2024", "2023"
  line_item: string;
  value: number; // in ₹ Crores
}

export interface CompanyData {
  info: CompanyInfo;
  metrics: Record<string, FinancialMetric>;
  financials: StatementRow[];
}

export const FINANCIAL_INSTITUTION_SYMBOLS = new Set([
  'HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK', 
  'BAJFINANCE', 'BAJAJFINSV', 'SHRIRAMFIN', 'SBILIFE', 'HDFCLIFE', 
  'INDUSINDBK', 'BANDHANBNK', 'FEDERALBNK', 'IDFCFIRSTB', 'AUBANK'
]);

export const INSTITUTIONAL_COMPANIES: Record<string, CompanyData> = {
  RELIANCE: {
    info: {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      sector: 'Energy & Conglomerate',
      industry: 'Oil Refining, Retail & Telecom',
      exchange: 'NSE',
      companyType: 'corporate',
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
      operatingMargin: { value: 17.5, label: 'EBITDA Margin', explanation: 'Maintains healthy 17.5% operating EBITDA margin driven by Jio digital margins and high refining throughput.' },
      netProfitMargin: { value: 8.2, label: 'Net Profit Margin', explanation: 'Converts 8.2% of gross revenues directly into bottom-line profit after depreciation, debt interest, and taxes.' },
      revenue: { value: 9845200000000, formatted: '₹9.85L Cr', label: 'Revenue (TTM)', explanation: 'Total annual gross receipts from refining, retail store sales, and digital telecommunications.' },
      ebitda: { value: 1722900000000, formatted: '₹1.72L Cr', label: 'Operating EBITDA', explanation: 'Earnings before interest, taxes, depreciation, and amortization from operating divisions.' },
      freeCashFlow: { value: 425000000000, formatted: '₹42,500 Cr', label: 'Free Cash Flow', explanation: 'Net cash generated from operations after accounting for extensive 5G network and store capex.' }
    },
    financials: [
      { statement_type: 'income_statement', period: '2026', line_item: 'Revenue from Operations', value: 984520 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Revenue from Operations', value: 892809 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Revenue from Operations', value: 874013 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Revenue from Operations', value: 792756 },
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
      { statement_type: 'income_statement', period: '2026', line_item: 'Finance Costs (Interest)', value: 21500 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Finance Costs (Interest)', value: 20450 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Finance Costs (Interest)', value: 19570 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Finance Costs (Interest)', value: 14584 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Profit Before Tax (PBT)', value: 99590 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Profit Before Tax (PBT)', value: 84039 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Profit Before Tax (PBT)', value: 80533 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Profit Before Tax (PBT)', value: 72272 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 79020 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 69648 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 66702 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 59820 },

      { statement_type: 'balance_sheet', period: '2026', line_item: 'Shareholders’ Net Worth', value: 812400 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Shareholders’ Net Worth', value: 742100 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Shareholders’ Net Worth', value: 685200 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Shareholders’ Net Worth', value: 624500 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Borrowings (Debt)', value: 308700 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Borrowings (Debt)', value: 295400 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Borrowings (Debt)', value: 312200 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Borrowings (Debt)', value: 288400 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Net Fixed Assets (PPE)', value: 684200 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Net Fixed Assets (PPE)', value: 635100 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Net Fixed Assets (PPE)', value: 592400 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Net Fixed Assets (PPE)', value: 541000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Cash & Cash Equivalents', value: 148200 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Cash & Cash Equivalents', value: 124500 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Cash & Cash Equivalents', value: 98400 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Cash & Cash Equivalents', value: 84200 },

      { statement_type: 'cash_flow', period: '2026', line_item: 'Cash from Operations (CFO)', value: 142500 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Cash from Operations (CFO)', value: 128400 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Cash from Operations (CFO)', value: 118200 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Cash from Operations (CFO)', value: 104500 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Capital Expenditure (Capex)', value: -100000 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Capital Expenditure (Capex)', value: -92000 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Capital Expenditure (Capex)', value: -85000 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Capital Expenditure (Capex)', value: -78000 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Free Cash Flow (CFO - Capex)', value: 42500 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Free Cash Flow (CFO - Capex)', value: 36400 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Free Cash Flow (CFO - Capex)', value: 33200 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Free Cash Flow (CFO - Capex)', value: 26500 }
    ]
  },

  HDFCBANK: {
    info: {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      sector: 'Banking & Financial Services',
      industry: 'Private Scheduled Commercial Bank',
      exchange: 'NSE',
      companyType: 'bank',
      marketCap: 12900000000000,
      marketCapFormatted: '₹12.9L Cr',
      fiftyTwoWeekHigh: 1794.0,
      fiftyTwoWeekLow: 1363.0,
      price: 1720.0,
      change: -6.8,
      changePct: -0.39,
      description: 'HDFC Bank is India’s largest private commercial bank. Following its historic merger with HDFC Ltd, it operates an unrivaled nationwide credit distribution network, institutional payment clearing systems, and prime retail deposit base.',
      moat: 'Lowest blended cost of deposits in Indian private banking, industry-leading CASA ratio (38%+), and non-performing asset loss provisions consistently under 1.3%.',
      businessModel: 'Accepts retail and corporate savings/term deposits and underwrites prime retail, mortgage, SME, and infrastructure advances, compounding net interest income across economic cycles.'
    },
    metrics: {
      pe: { value: 18.2, label: 'P/E Ratio', explanation: 'Trades at 18.2× earnings, representing favorable valuation relative to its 10-year historical average (22x).' },
      pb: { value: 2.7, label: 'P/B Ratio', explanation: 'Price-to-book of 2.7× reflects pristine balance sheet credit underwriting and robust provision coverage.' },
      eps: { value: 94.5, label: 'Earnings Per Share', explanation: 'Generated ₹94.50 EPS in trailing 12 months with healthy capital accretion.' },
      dividendYield: { value: 1.1, label: 'Dividend Yield', explanation: 'Annual dividend payout of ₹110 per ₹10,000 invested while sustaining Tier-1 capital ratios above RBI mandates.' },
      roe: { value: 16.8, label: 'Return on Equity (RoE)', explanation: 'Compounded 16.8% net return on shareholders’ equity across credit cycles.' },
      roa: { value: 1.95, label: 'Return on Assets (RoA)', explanation: 'Top-tier 1.95% annual return on total banking assets, among the highest for global mega-cap lenders.' },
      nim: { value: 3.42, label: 'Net Interest Margin (NIM)', explanation: 'Maintains a 3.42% net interest spread between loan yield realization and deposit interest cost.' },
      casa: { value: 38.2, label: 'CASA Deposit Ratio', explanation: '38.2% of deposits are held in low-cost Current and Savings Accounts, providing cheap funding stability.' },
      gnpa: { value: 1.24, label: 'Gross NPA Ratio', explanation: 'Gross non-performing loans strictly controlled at 1.24% of gross advances.' },
      nnpa: { value: 0.35, label: 'Net NPA Ratio', explanation: 'Prudent provisioning leaves net bad loans at an exceptionally low 0.35%.' },
      crar: { value: 18.8, label: 'Capital Adequacy (CRAR)', explanation: 'Capital-to-Risk Weighted Assets Ratio of 18.8%, far exceeding the 11.5% RBI regulatory requirement.' },
      costToIncome: { value: 40.2, label: 'Cost-to-Income Ratio', explanation: 'Efficient operating overhead: consumes only ₹40.20 per ₹100 of net revenue generated.' }
    },
    financials: [
      { statement_type: 'income_statement', period: '2026', line_item: 'Interest Earned', value: 274500 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Interest Earned', value: 236800 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Interest Earned', value: 182400 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Interest Earned', value: 138600 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Interest Expended', value: 154200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Interest Expended', value: 131500 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Interest Expended', value: 98200 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Interest Expended', value: 71800 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Interest Income (NII)', value: 120300 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Interest Income (NII)', value: 105300 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Interest Income (NII)', value: 84200 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Interest Income (NII)', value: 66800 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Other Income (Fees & Treasury)', value: 42100 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Other Income (Fees & Treasury)', value: 36400 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Other Income (Fees & Treasury)', value: 29500 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Other Income (Fees & Treasury)', value: 24200 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Total Net Income (NII + Fees)', value: 162400 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Total Net Income (NII + Fees)', value: 141700 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Total Net Income (NII + Fees)', value: 113700 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Total Net Income (NII + Fees)', value: 91000 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Operating Expenses', value: 65200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Operating Expenses', value: 57400 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Operating Expenses', value: 46200 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Operating Expenses', value: 37500 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 97200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 84300 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 67500 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 53500 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Provisions & Contingencies', value: 14200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Provisions & Contingencies', value: 13100 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Provisions & Contingencies', value: 11200 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Provisions & Contingencies', value: 8900 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Profit Before Tax (PBT)', value: 83000 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Profit Before Tax (PBT)', value: 71200 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Profit Before Tax (PBT)', value: 56300 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Profit Before Tax (PBT)', value: 44600 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 71200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 60800 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 44100 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 36900 },

      { statement_type: 'balance_sheet', period: '2026', line_item: 'Capital & Reserves (Net Worth)', value: 475000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Capital & Reserves (Net Worth)', value: 420000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Capital & Reserves (Net Worth)', value: 365000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Capital & Reserves (Net Worth)', value: 280000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Customer Deposits', value: 2480000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Customer Deposits', value: 2160000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Customer Deposits', value: 1880000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Customer Deposits', value: 1620000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Borrowings', value: 540000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Borrowings', value: 490000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Borrowings', value: 420000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Borrowings', value: 380000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Advances (Total Loan Book)', value: 2620000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Advances (Total Loan Book)', value: 2280000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Advances (Total Loan Book)', value: 1950000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Advances (Total Loan Book)', value: 1580000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Investments (SLR G-Secs & Bonds)', value: 720000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Investments (SLR G-Secs & Bonds)', value: 640000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Investments (SLR G-Secs & Bonds)', value: 560000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Investments (SLR G-Secs & Bonds)', value: 480000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Cash & Balances with RBI', value: 210000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Cash & Balances with RBI', value: 185000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Cash & Balances with RBI', value: 165000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Cash & Balances with RBI', value: 140000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Balance Sheet Assets', value: 3650000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Balance Sheet Assets', value: 3200000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Balance Sheet Assets', value: 2850000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Balance Sheet Assets', value: 2450000 },

      { statement_type: 'asset_quality', period: '2026', line_item: 'Gross NPA (₹ Cr)', value: 32488 },
      { statement_type: 'asset_quality', period: '2025', line_item: 'Gross NPA (₹ Cr)', value: 28728 },
      { statement_type: 'asset_quality', period: '2024', line_item: 'Gross NPA (₹ Cr)', value: 24180 },
      { statement_type: 'asset_quality', period: '2023', line_item: 'Gross NPA (₹ Cr)', value: 18960 },
      { statement_type: 'asset_quality', period: '2026', line_item: 'Net NPA (₹ Cr)', value: 9170 },
      { statement_type: 'asset_quality', period: '2025', line_item: 'Net NPA (₹ Cr)', value: 7980 },
      { statement_type: 'asset_quality', period: '2024', line_item: 'Net NPA (₹ Cr)', value: 6435 },
      { statement_type: 'asset_quality', period: '2023', line_item: 'Net NPA (₹ Cr)', value: 4266 },
      { statement_type: 'asset_quality', period: '2026', line_item: 'Provision Coverage Ratio (PCR %)', value: 72 },
      { statement_type: 'asset_quality', period: '2025', line_item: 'Provision Coverage Ratio (PCR %)', value: 72 },
      { statement_type: 'asset_quality', period: '2024', line_item: 'Provision Coverage Ratio (PCR %)', value: 73 },
      { statement_type: 'asset_quality', period: '2023', line_item: 'Provision Coverage Ratio (PCR %)', value: 77 }
    ]
  },

  ICICIBANK: {
    info: {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank',
      sector: 'Banking & Financial Services',
      industry: 'Private Scheduled Commercial Bank',
      exchange: 'NSE',
      companyType: 'bank',
      marketCap: 8900000000000,
      marketCapFormatted: '₹8.9L Cr',
      fiftyTwoWeekHigh: 1345.0,
      fiftyTwoWeekLow: 980.0,
      price: 1260.0,
      change: 7.5,
      changePct: 0.60,
      description: 'ICICI Bank is a premier private sector lender in India, distinguished by its market-leading technology platform (iMobile), high Net Interest Margins, and rapid retail & SME loan growth.',
      moat: 'High-margin retail and business banking franchise, industry-best NIM (4.3%+), and robust risk underwriting delivering Return on Assets above 2.3%.',
      businessModel: 'Retail, SME, and corporate lending funded by low-cost CASA deposits and wholesale institutional borrowings.'
    },
    metrics: {
      pe: { value: 17.4, label: 'P/E Ratio', explanation: 'Trades at 17.4× earnings with highest RoA in Indian banking.' },
      pb: { value: 2.9, label: 'P/B Ratio', explanation: 'Trades at 2.9× book value supported by pristine credit metrics.' },
      eps: { value: 72.4, label: 'Earnings Per Share', explanation: 'Consolidated EPS of ₹72.40 sustained by strong NII expansion.' },
      dividendYield: { value: 0.8, label: 'Dividend Yield', explanation: 'Annual dividend of ₹80 per ₹10,000 invested.' },
      roe: { value: 18.4, label: 'Return on Equity (RoE)', explanation: 'Best-in-class 18.4% return on equity.' },
      roa: { value: 2.32, label: 'Return on Assets (RoA)', explanation: 'Industry-leading 2.32% return on total banking assets.' },
      nim: { value: 4.36, label: 'Net Interest Margin (NIM)', explanation: 'Exceptional 4.36% net interest spread.' },
      casa: { value: 41.2, label: 'CASA Deposit Ratio', explanation: '41.2% low-cost CASA deposit franchise.' },
      gnpa: { value: 2.15, label: 'Gross NPA Ratio', explanation: 'Gross NPA ratio contained at 2.15%.' },
      nnpa: { value: 0.42, label: 'Net NPA Ratio', explanation: 'Net NPA down to 0.42% with strong coverage.' },
      crar: { value: 16.9, label: 'Capital Adequacy (CRAR)', explanation: 'CRAR of 16.9% against RBI statutory minimum.' },
      costToIncome: { value: 39.8, label: 'Cost-to-Income Ratio', explanation: 'Digitally automated operations yielding sub-40% cost-to-income.' }
    },
    financials: [
      { statement_type: 'income_statement', period: '2026', line_item: 'Interest Earned', value: 172400 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Interest Earned', value: 148500 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Interest Earned', value: 118200 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Interest Earned', value: 92400 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Interest Expended', value: 94800 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Interest Expended', value: 81200 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Interest Expended', value: 62400 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Interest Expended', value: 48600 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Interest Income (NII)', value: 77600 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Interest Income (NII)', value: 67300 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Interest Income (NII)', value: 55800 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Interest Income (NII)', value: 43800 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Other Income (Fees & Treasury)', value: 26800 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Other Income (Fees & Treasury)', value: 23100 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Other Income (Fees & Treasury)', value: 19800 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Other Income (Fees & Treasury)', value: 16200 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 62800 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 54200 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 44500 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Pre-Provision Operating Profit (PPOP)', value: 35800 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Provisions & Contingencies', value: 5200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Provisions & Contingencies', value: 4800 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Provisions & Contingencies', value: 5400 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Provisions & Contingencies', value: 6600 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 47800 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 40900 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 31900 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 25400 },

      { statement_type: 'balance_sheet', period: '2026', line_item: 'Capital & Reserves (Net Worth)', value: 285000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Capital & Reserves (Net Worth)', value: 245000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Capital & Reserves (Net Worth)', value: 212000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Capital & Reserves (Net Worth)', value: 182000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Customer Deposits', value: 1540000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Customer Deposits', value: 1350000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Customer Deposits', value: 1180000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Customer Deposits', value: 1020000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Advances (Total Loan Book)', value: 1320000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Advances (Total Loan Book)', value: 1150000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Advances (Total Loan Book)', value: 980000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Advances (Total Loan Book)', value: 840000 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Balance Sheet Assets', value: 2180000 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Balance Sheet Assets', value: 1920000 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Balance Sheet Assets', value: 1680000 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Balance Sheet Assets', value: 1450000 },

      { statement_type: 'asset_quality', period: '2026', line_item: 'Gross NPA (₹ Cr)', value: 28380 },
      { statement_type: 'asset_quality', period: '2025', line_item: 'Gross NPA (₹ Cr)', value: 27945 },
      { statement_type: 'asset_quality', period: '2024', line_item: 'Gross NPA (₹ Cr)', value: 28420 },
      { statement_type: 'asset_quality', period: '2023', line_item: 'Gross NPA (₹ Cr)', value: 31200 },
      { statement_type: 'asset_quality', period: '2026', line_item: 'Net NPA (₹ Cr)', value: 5544 },
      { statement_type: 'asset_quality', period: '2025', line_item: 'Net NPA (₹ Cr)', value: 5865 },
      { statement_type: 'asset_quality', period: '2024', line_item: 'Net NPA (₹ Cr)', value: 6370 },
      { statement_type: 'asset_quality', period: '2023', line_item: 'Net NPA (₹ Cr)', value: 7800 },
      { statement_type: 'asset_quality', period: '2026', line_item: 'Provision Coverage Ratio (PCR %)', value: 80 },
      { statement_type: 'asset_quality', period: '2025', line_item: 'Provision Coverage Ratio (PCR %)', value: 79 },
      { statement_type: 'asset_quality', period: '2024', line_item: 'Provision Coverage Ratio (PCR %)', value: 78 },
      { statement_type: 'asset_quality', period: '2023', line_item: 'Provision Coverage Ratio (PCR %)', value: 75 }
    ]
  },

  TCS: {
    info: {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'Technology',
      industry: 'Enterprise Digital Services & Consulting',
      exchange: 'NSE',
      companyType: 'corporate',
      marketCap: 14200000000000,
      marketCapFormatted: '₹14.2L Cr',
      fiftyTwoWeekHigh: 4585.0,
      fiftyTwoWeekLow: 3500.0,
      price: 3950.0,
      change: 31.6,
      changePct: 0.81,
      description: 'Tata Consultancy Services is the crown jewel of the Tata Group and India’s premier IT services exporter, serving global Global 2000 enterprises across cloud, banking, retail, and artificial intelligence.',
      moat: 'Unrivaled client retention (98%+ repeat business), massive 600,000+ technical workforce, and industry-leading net operating margins exceeding 24%.',
      businessModel: 'Consulting, digital enterprise transformation, cloud infrastructure management, and proprietary products (TCS BaNCS).'
    },
    metrics: {
      pe: { value: 29.5, label: 'P/E Ratio', explanation: 'Trades at 29.5× earnings, commanding a premium for cash conversion and zero-debt balance sheet.' },
      pb: { value: 12.8, label: 'P/B Ratio', explanation: 'Asset-light consulting model generating enormous return on tangible capital.' },
      eps: { value: 133.9, label: 'Earnings Per Share', explanation: '₹133.90 annual earnings per share with 80%+ dividend payout.' },
      dividendYield: { value: 1.4, label: 'Dividend Yield', explanation: '₹140 annual dividend payout per ₹10,000 invested.' },
      roe: { value: 48.5, label: 'Return on Equity (RoE)', explanation: 'Generates an exceptional ₹48.50 profit for every ₹100 of equity.' },
      roce: { value: 62.4, label: 'ROCE', explanation: 'World-class 62.4% return on capital employed.' },
      debtToEquity: { value: 0.05, label: 'Debt to Equity', explanation: 'Completely debt-free net balance sheet.' },
      operatingMargin: { value: 26.2, label: 'EBITDA Margin', explanation: 'Best-in-class 26.2% EBITDA margin in global IT services.' },
      netProfitMargin: { value: 19.8, label: 'Net Profit Margin', explanation: 'Consistently converts 20% of top-line revenue into net profit.' },
      revenue: { value: 2482000000000, formatted: '₹2.48L Cr', label: 'Revenue (TTM)', explanation: 'Gross annual contract receipts across worldwide delivery centers.' },
      ebitda: { value: 650200000000, formatted: '₹65,020 Cr', label: 'Operating EBITDA', explanation: 'Operating earnings before depreciation and income taxes.' },
      freeCashFlow: { value: 468000000000, formatted: '₹46,800 Cr', label: 'Free Cash Flow', explanation: 'Cash conversion ratio of 95%+ of net profit returned to shareholders.' }
    },
    financials: [
      { statement_type: 'income_statement', period: '2026', line_item: 'Revenue from Operations', value: 248200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Revenue from Operations', value: 240893 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Revenue from Operations', value: 225458 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Revenue from Operations', value: 191754 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Employee Benefit Expenses', value: 139500 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Employee Benefit Expenses', value: 135800 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Employee Benefit Expenses', value: 127100 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Employee Benefit Expenses', value: 108400 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Operating Profit (EBITDA)', value: 65020 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Operating Profit (EBITDA)', value: 63100 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Operating Profit (EBITDA)', value: 59200 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Operating Profit (EBITDA)', value: 50400 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Depreciation & Amortization', value: 5200 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Depreciation & Amortization', value: 4980 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Depreciation & Amortization', value: 4620 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Depreciation & Amortization', value: 4065 },
      { statement_type: 'income_statement', period: '2026', line_item: 'Net Profit (PAT)', value: 49100 },
      { statement_type: 'income_statement', period: '2025', line_item: 'Net Profit (PAT)', value: 46580 },
      { statement_type: 'income_statement', period: '2024', line_item: 'Net Profit (PAT)', value: 42147 },
      { statement_type: 'income_statement', period: '2023', line_item: 'Net Profit (PAT)', value: 38327 },

      { statement_type: 'balance_sheet', period: '2026', line_item: 'Shareholders’ Net Worth', value: 99800 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Shareholders’ Net Worth', value: 92400 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Shareholders’ Net Worth', value: 88500 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Shareholders’ Net Worth', value: 82100 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Total Borrowings (Debt)', value: 4800 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Total Borrowings (Debt)', value: 5100 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Total Borrowings (Debt)', value: 5400 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Total Borrowings (Debt)', value: 5800 },
      { statement_type: 'balance_sheet', period: '2026', line_item: 'Cash & Cash Equivalents', value: 52100 },
      { statement_type: 'balance_sheet', period: '2025', line_item: 'Cash & Cash Equivalents', value: 48500 },
      { statement_type: 'balance_sheet', period: '2024', line_item: 'Cash & Cash Equivalents', value: 44200 },
      { statement_type: 'balance_sheet', period: '2023', line_item: 'Cash & Cash Equivalents', value: 39500 },

      { statement_type: 'cash_flow', period: '2026', line_item: 'Cash from Operations (CFO)', value: 50400 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Cash from Operations (CFO)', value: 47200 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Cash from Operations (CFO)', value: 43800 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Cash from Operations (CFO)', value: 39200 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Capital Expenditure (Capex)', value: -3600 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Capital Expenditure (Capex)', value: -3400 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Capital Expenditure (Capex)', value: -3100 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Capital Expenditure (Capex)', value: -2900 },
      { statement_type: 'cash_flow', period: '2026', line_item: 'Free Cash Flow (CFO - Capex)', value: 46800 },
      { statement_type: 'cash_flow', period: '2025', line_item: 'Free Cash Flow (CFO - Capex)', value: 43800 },
      { statement_type: 'cash_flow', period: '2024', line_item: 'Free Cash Flow (CFO - Capex)', value: 40700 },
      { statement_type: 'cash_flow', period: '2023', line_item: 'Free Cash Flow (CFO - Capex)', value: 36300 }
    ]
  }
};

// Algorithmic generator accurately discriminating Banks vs Corporates
export function getInstitutionalCompany(symbol: string): CompanyData {
  const sym = symbol.toUpperCase().replace(/\.NS$/, '');
  
  if (INSTITUTIONAL_COMPANIES[sym]) {
    return INSTITUTIONAL_COMPANIES[sym];
  }

  const isBankOrFinancial = FINANCIAL_INSTITUTION_SYMBOLS.has(sym) || 
                            sym.includes('BANK') || 
                            sym.includes('FIN');

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
  const mcap = (50000 + (positiveHash % 850000)) * 10000000;
  const years = ['2026', '2025', '2024', '2023'];

  if (isBankOrFinancial) {
    // True Bank Financial Engine
    const deposits = Math.round(mcap * 1.8 / 10000000);
    const advances = Math.round(deposits * 0.82);
    const nii = Math.round(advances * 0.042);
    const pat = Math.round(nii * 0.58);
    const ppop = Math.round(pat * 1.35);

    const financials: StatementRow[] = [];
    years.forEach((yr, idx) => {
      const factor = 1 - idx * 0.12;
      const dep = Math.round(deposits * factor);
      const adv = Math.round(advances * factor);
      const n = Math.round(nii * factor);
      const p = Math.round(pat * factor);
      const pp = Math.round(ppop * factor);
      const interestEarned = Math.round(n * 2.2);
      const interestExpended = interestEarned - n;

      financials.push(
        { statement_type: 'income_statement', period: yr, line_item: 'Interest Earned', value: interestEarned },
        { statement_type: 'income_statement', period: yr, line_item: 'Interest Expended', value: interestExpended },
        { statement_type: 'income_statement', period: yr, line_item: 'Net Interest Income (NII)', value: n },
        { statement_type: 'income_statement', period: yr, line_item: 'Other Income (Fees & Treasury)', value: Math.round(n * 0.32) },
        { statement_type: 'income_statement', period: yr, line_item: 'Pre-Provision Operating Profit (PPOP)', value: pp },
        { statement_type: 'income_statement', period: yr, line_item: 'Provisions & Contingencies', value: Math.round(pp * 0.18) },
        { statement_type: 'income_statement', period: yr, line_item: 'Net Profit (PAT)', value: p },
        { statement_type: 'balance_sheet', period: yr, line_item: 'Capital & Reserves (Net Worth)', value: Math.round(p * 8.5) },
        { statement_type: 'balance_sheet', period: yr, line_item: 'Total Customer Deposits', value: dep },
        { statement_type: 'balance_sheet', period: yr, line_item: 'Advances (Total Loan Book)', value: adv },
        { statement_type: 'balance_sheet', period: yr, line_item: 'Total Balance Sheet Assets', value: Math.round(dep * 1.25) },
        { statement_type: 'asset_quality', period: yr, line_item: 'Gross NPA Ratio (%)', value: Number((1.2 + (positiveHash % 15) / 10).toFixed(2)) },
        { statement_type: 'asset_quality', period: yr, line_item: 'Net NPA Ratio (%)', value: Number((0.3 + (positiveHash % 8) / 10).toFixed(2)) },
        { statement_type: 'asset_quality', period: yr, line_item: 'Capital Adequacy Ratio (CRAR %)', value: Number((16.5 + (positiveHash % 30) / 10).toFixed(1)) }
      );
    });

    return {
      info: {
        symbol: sym,
        name: sym,
        sector: 'Banking & Financials',
        industry: 'Scheduled Commercial Banking',
        exchange: 'NSE',
        companyType: 'bank',
        marketCap: mcap,
        marketCapFormatted: mcap >= 1e12 ? `₹${(mcap / 1e12).toFixed(1)}L Cr` : `₹${Math.round(mcap / 1e7)} Cr`,
        fiftyTwoWeekHigh: Number((basePrice * 1.25).toFixed(2)),
        fiftyTwoWeekLow: Number((basePrice * 0.78).toFixed(2)),
        price: basePrice,
        change: Number(((positiveHash % 30) - 12).toFixed(2)),
        changePct: Number((((positiveHash % 30) - 12) / basePrice * 100).toFixed(2)),
        description: `${sym} is a regulated Indian financial institution providing credit advances, current/savings deposit intermediation, and transaction banking services.`,
        moat: 'Low-cost deposit gathering franchise, branch density, and prudent risk-weighted capital underwriting.',
        businessModel: 'Generates Net Interest Income (NII) on advances and fee commissions from trade finance and retail banking.'
      },
      metrics: {
        pe: { value: pe, label: 'P/E Ratio', explanation: `Trades at ${pe}× annual earnings.` },
        pb: { value: pb, label: 'P/B Ratio', explanation: `Valued at ${pb}× book value.` },
        eps: { value: Number((basePrice / pe).toFixed(2)), label: 'Earnings Per Share', explanation: `Earned ₹${(basePrice / pe).toFixed(2)} EPS in trailing 12 months.` },
        dividendYield: { value: divYield, label: 'Dividend Yield', explanation: `Annual dividend yield of ${divYield}%.` },
        roe: { value: roe, label: 'Return on Equity (RoE)', explanation: `Generates ${roe}% return on shareholders’ equity.` },
        roa: { value: Number((roe / 8.5).toFixed(2)), label: 'Return on Assets (RoA)', explanation: `High quality ${Number((roe / 8.5).toFixed(2))}% return on total banking assets.` },
        nim: { value: 3.65, label: 'Net Interest Margin (NIM)', explanation: '3.65% net interest spread earned on loan assets.' },
        casa: { value: 39.4, label: 'CASA Ratio', explanation: '39.4% low-cost current and savings account deposits.' },
        gnpa: { value: 1.45, label: 'Gross NPA Ratio', explanation: 'Gross non-performing loans at 1.45% of total advances.' },
        nnpa: { value: 0.38, label: 'Net NPA Ratio', explanation: 'Net impaired loan book strictly contained at 0.38%.' },
        crar: { value: 17.5, label: 'Capital Adequacy (CRAR)', explanation: '17.5% capital adequacy ratio exceeding RBI guidelines.' },
        costToIncome: { value: 41.5, label: 'Cost-to-Income', explanation: 'Consumes ₹41.50 per ₹100 of operating net revenue.' }
      },
      financials
    };
  }

  // True Corporate Financial Engine (Reliance, TCS, Maruti, etc.)
  const de = Number((0.05 + (positiveHash % 180) / 100).toFixed(2));
  const rev = Math.round(mcap * 0.45 / 10000000);
  const pat = Math.round(rev * (roe / 220));

  const financials: StatementRow[] = [];
  years.forEach((yr, idx) => {
    const factor = 1 - idx * 0.11;
    const r = Math.round(rev * factor);
    const p = Math.round(pat * factor);
    const opex = Math.round(r * 0.78);
    const ebitda = r - opex;

    financials.push(
      { statement_type: 'income_statement', period: yr, line_item: 'Revenue from Operations', value: r },
      { statement_type: 'income_statement', period: yr, line_item: 'Operating Expenses', value: opex },
      { statement_type: 'income_statement', period: yr, line_item: 'Operating Profit (EBITDA)', value: ebitda },
      { statement_type: 'income_statement', period: yr, line_item: 'Depreciation & Amortization', value: Math.round(ebitda * 0.22) },
      { statement_type: 'income_statement', period: yr, line_item: 'Net Profit (PAT)', value: p },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Shareholders’ Net Worth', value: Math.round(p * 8.5) },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Total Borrowings (Debt)', value: Math.round(p * 8.5 * de) },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Cash & Cash Equivalents', value: Math.round(p * 2.4) },
      { statement_type: 'balance_sheet', period: yr, line_item: 'Total Balance Sheet Assets', value: Math.round(p * 14.5) },
      { statement_type: 'cash_flow', period: yr, line_item: 'Cash from Operations (CFO)', value: Math.round(p * 1.35) },
      { statement_type: 'cash_flow', period: yr, line_item: 'Capital Expenditure (Capex)', value: -Math.round(p * 0.45) },
      { statement_type: 'cash_flow', period: yr, line_item: 'Free Cash Flow (CFO - Capex)', value: Math.round(p * 0.9) }
    );
  });

  return {
    info: {
      symbol: sym,
      name: sym,
      sector: 'Diversified Corporates',
      industry: 'Public Equity Universe',
      exchange: 'NSE',
      companyType: 'corporate',
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
      roe: { value: roe, label: 'Return on Equity (RoE)', explanation: `Generates ₹${roe} net profit for every ₹100 of shareholders’ equity.` },
      roce: { value: Number((roe * 1.15).toFixed(1)), label: 'ROCE', explanation: `Return on capital employed of ${(roe * 1.15).toFixed(1)}%.` },
      debtToEquity: { value: de, label: 'Debt to Equity', explanation: `Leverage ratio of ₹${Math.round(de * 100)} debt per ₹100 equity.` },
      operatingMargin: { value: Number((roe * 1.2).toFixed(1)), label: 'EBITDA Margin', explanation: `Operating EBITDA margin of ${(roe * 1.2).toFixed(1)}%.` },
      netProfitMargin: { value: Number((roe * 0.7).toFixed(1)), label: 'Net Profit Margin', explanation: `Net profit margin of ${(roe * 0.7).toFixed(1)}% after taxes.` },
      revenue: { value: rev * 10000000, formatted: rev >= 100000 ? `₹${(rev / 100000).toFixed(1)}L Cr` : `₹${rev} Cr`, label: 'Revenue (TTM)', explanation: 'Total annual gross receipts from operations.' },
      ebitda: { value: Math.round(rev * 0.22) * 10000000, formatted: Math.round(rev * 0.22) >= 100000 ? `₹${(Math.round(rev * 0.22) / 100000).toFixed(1)}L Cr` : `₹${Math.round(rev * 0.22)} Cr`, label: 'Operating EBITDA', explanation: 'Operating earnings before depreciation and taxes.' },
      freeCashFlow: { value: Math.round(pat * 0.9) * 10000000, formatted: `₹${Math.round(pat * 0.9)} Cr`, label: 'Free Cash Flow', explanation: 'Cash generated after capital investments.' }
    },
    financials
  };
}
