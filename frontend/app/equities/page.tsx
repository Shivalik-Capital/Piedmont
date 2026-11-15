'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  X, 
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Activity,
  Layers,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Constituent {
  symbol: string;
  name: string;
  weight: string;
  price: number;
  changePct: number;
}

interface SectorIndex {
  key: string;
  name: string;
  symbol: string;
  category: string;
  price: number;
  change: number;
  changePct: number;
  pe: number;
  pb: number;
  divYield: number;
  high52: number;
  low52: number;
  description: string;
  sparkline: number[];
  constituents: Constituent[];
  chartData: {
    '1D': { points: string; high: number; low: number; change: string };
    '1W': { points: string; high: number; low: number; change: string };
    '1M': { points: string; high: number; low: number; change: string };
    '1Y': { points: string; high: number; low: number; change: string };
    'ALL': { points: string; high: number; low: number; change: string };
  };
}

const SECTOR_INDICES: SectorIndex[] = [
  {
    key: 'nifty_50',
    name: 'NIFTY 50 Benchmark',
    symbol: 'NIFTY 50',
    category: 'Benchmark',
    price: 25810.45,
    change: 108.20,
    changePct: 0.42,
    pe: 22.8,
    pb: 3.8,
    divYield: 1.25,
    high52: 26277.35,
    low52: 21281.45,
    description: 'Flagship benchmark index representing the 50 largest and most liquid Indian blue-chip companies listed on the NSE.',
    sparkline: [25620, 25680, 25640, 25710, 25750, 25720, 25810],
    constituents: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', weight: '9.8%', price: 2840.5, changePct: 1.1 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', weight: '8.9%', price: 1720.0, changePct: -0.4 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', weight: '7.8%', price: 1260.0, changePct: 0.6 },
      { symbol: 'INFY', name: 'Infosys', weight: '6.1%', price: 1880.0, changePct: 1.2 },
      { symbol: 'TCS', name: 'Tata Consultancy Services', weight: '4.2%', price: 3950.0, changePct: 0.8 },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', weight: '3.9%', price: 1680.0, changePct: 1.8 },
      { symbol: 'ITC', name: 'ITC', weight: '3.8%', price: 490.0, changePct: -0.2 },
      { symbol: 'LT', name: 'Larsen & Toubro', weight: '3.6%', price: 3680.0, changePct: 1.4 },
    ],
    chartData: {
      '1D': { points: 'M 0,65 L 50,60 L 100,55 L 150,70 L 200,45 L 250,50 L 300,35 L 350,28 L 400,18', high: 25845.2, low: 25680.1, change: '+0.42%' },
      '1W': { points: 'M 0,80 L 60,75 L 120,62 L 180,68 L 240,40 L 300,32 L 360,25 L 400,12', high: 25920.0, low: 25540.8, change: '+1.05%' },
      '1M': { points: 'M 0,40 L 80,65 L 160,82 L 240,55 L 320,38 L 400,15', high: 26150.0, low: 25180.2, change: '+2.48%' },
      '1Y': { points: 'M 0,95 L 70,82 L 140,68 L 210,48 L 280,35 L 350,22 L 400,8', high: 26277.3, low: 21281.4, change: '+21.3%' },
      'ALL': { points: 'M 0,98 L 80,90 L 160,75 L 240,55 L 320,30 L 400,5', high: 26277.3, low: 5500.0, change: '+369.2%' },
    }
  },
  {
    key: 'nifty_bank',
    name: 'NIFTY Bank',
    symbol: 'BANKNIFTY',
    category: 'Banking',
    price: 52480.30,
    change: -168.40,
    changePct: -0.32,
    pe: 16.4,
    pb: 2.3,
    divYield: 0.95,
    high52: 54467.35,
    low52: 43230.15,
    description: 'Comprises the 12 most capitalized and liquid Indian banking stocks across private and public sectors.',
    sparkline: [52800, 52710, 52650, 52580, 52400, 52520, 52480],
    constituents: [
      { symbol: 'HDFCBANK', name: 'HDFC Bank', weight: '28.5%', price: 1720.0, changePct: -0.4 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', weight: '24.2%', price: 1260.0, changePct: 0.6 },
      { symbol: 'SBIN', name: 'State Bank of India', weight: '16.1%', price: 810.0, changePct: 0.3 },
      { symbol: 'AXISBANK', name: 'Axis Bank', weight: '12.4%', price: 1180.0, changePct: -0.3 },
      { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', weight: '10.8%', price: 1780.0, changePct: -0.5 },
    ],
    chartData: {
      '1D': { points: 'M 0,25 L 60,35 L 120,42 L 180,55 L 240,68 L 300,62 L 360,75 L 400,70', high: 52750.0, low: 52380.0, change: '-0.32%' },
      '1W': { points: 'M 0,35 L 80,48 L 160,52 L 240,65 L 320,58 L 400,66', high: 52920.0, low: 52110.0, change: '-0.68%' },
      '1M': { points: 'M 0,85 L 80,72 L 160,58 L 240,42 L 320,38 L 400,45', high: 53200.0, low: 51050.0, change: '+1.85%' },
      '1Y': { points: 'M 0,90 L 80,80 L 160,65 L 240,48 L 320,32 L 400,20', high: 54467.3, low: 43230.1, change: '+21.4%' },
      'ALL': { points: 'M 0,98 L 80,88 L 160,70 L 240,45 L 320,25 L 400,10', high: 54467.3, low: 8500.0, change: '+517.4%' },
    }
  },
  {
    key: 'nifty_it',
    name: 'NIFTY IT',
    symbol: 'NIFTY IT',
    category: 'Technology',
    price: 42150.80,
    change: 760.50,
    changePct: 1.84,
    pe: 28.5,
    pb: 8.4,
    divYield: 2.15,
    high52: 44280.00,
    low52: 30450.20,
    description: 'Tracks leading Indian enterprise software and IT service exporters with heavy revenue exposure to North America and Europe.',
    sparkline: [41200, 41350, 41500, 41800, 41950, 42050, 42150],
    constituents: [
      { symbol: 'TCS', name: 'Tata Consultancy Services', weight: '26.8%', price: 3950.0, changePct: 0.8 },
      { symbol: 'INFY', name: 'Infosys', weight: '25.4%', price: 1880.0, changePct: 1.2 },
      { symbol: 'HCLTECH', name: 'HCL Technologies', weight: '14.2%', price: 1780.0, changePct: 1.5 },
      { symbol: 'TECHM', name: 'Tech Mahindra', weight: '10.5%', price: 1620.0, changePct: 2.0 },
      { symbol: 'WIPRO', name: 'Wipro', weight: '9.2%', price: 545.0, changePct: 0.9 },
    ],
    chartData: {
      '1D': { points: 'M 0,85 L 60,70 L 120,60 L 180,45 L 240,32 L 300,28 L 360,18 L 400,10', high: 42280.0, low: 41350.0, change: '+1.84%' },
      '1W': { points: 'M 0,90 L 70,78 L 140,65 L 210,50 L 280,35 L 350,22 L 400,12', high: 42350.0, low: 40820.0, change: '+3.25%' },
      '1M': { points: 'M 0,75 L 80,68 L 160,52 L 240,38 L 320,25 L 400,15', high: 42800.0, low: 39500.0, change: '+6.70%' },
      '1Y': { points: 'M 0,95 L 80,75 L 160,58 L 240,42 L 320,28 L 400,15', high: 44280.0, low: 30450.2, change: '+38.4%' },
      'ALL': { points: 'M 0,98 L 80,85 L 160,65 L 240,40 L 320,20 L 400,5', high: 44280.0, low: 4500.0, change: '+836.7%' },
    }
  },
  {
    key: 'nifty_pharma',
    name: 'NIFTY Pharma',
    symbol: 'NIFTY PHARMA',
    category: 'Healthcare',
    price: 22840.15,
    change: 215.30,
    changePct: 0.95,
    pe: 34.2,
    pb: 5.6,
    divYield: 0.72,
    high52: 23450.80,
    low52: 15280.40,
    description: 'Encompasses 20 prominent Indian pharmaceutical innovators, generic manufacturers, and hospitals.',
    sparkline: [22500, 22580, 22620, 22700, 22750, 22800, 22840],
    constituents: [
      { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', weight: '24.2%', price: 1880.0, changePct: 0.7 },
      { symbol: 'CIPLA', name: 'Cipla', weight: '16.5%', price: 1540.0, changePct: 0.3 },
      { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", weight: '14.1%', price: 6580.0, changePct: 0.4 },
      { symbol: 'DIVISLAB', name: "Divi's Laboratories", weight: '12.8%', price: 5800.0, changePct: 1.6 },
      { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', weight: '11.5%', price: 7100.0, changePct: 0.8 },
    ],
    chartData: {
      '1D': { points: 'M 0,75 L 70,65 L 140,55 L 210,48 L 280,35 L 350,25 L 400,18', high: 22890.0, low: 22580.0, change: '+0.95%' },
      '1W': { points: 'M 0,82 L 80,70 L 160,58 L 240,45 L 320,32 L 400,20', high: 22950.0, low: 22350.0, change: '+2.19%' },
      '1M': { points: 'M 0,65 L 80,55 L 160,42 L 240,35 L 320,28 L 400,18', high: 23120.0, low: 21800.0, change: '+4.77%' },
      '1Y': { points: 'M 0,95 L 80,72 L 160,55 L 240,40 L 320,25 L 400,10', high: 23450.8, low: 15280.4, change: '+49.5%' },
      'ALL': { points: 'M 0,98 L 80,82 L 160,65 L 240,45 L 320,22 L 400,8', high: 23450.8, low: 3200.0, change: '+613.8%' },
    }
  },
  {
    key: 'nifty_auto',
    name: 'NIFTY Auto',
    symbol: 'NIFTY AUTO',
    category: 'Automobile',
    price: 24980.50,
    change: 194.20,
    changePct: 0.78,
    pe: 26.4,
    pb: 4.8,
    divYield: 1.35,
    high52: 26200.00,
    low52: 16800.00,
    description: 'Reflects the performance of 15 passenger, commercial, two-wheeler OEMs and auto component leaders in India.',
    sparkline: [24700, 24780, 24820, 24900, 24920, 24950, 24980],
    constituents: [
      { symbol: 'M&M', name: 'Mahindra & Mahindra', weight: '19.5%', price: 2820.0, changePct: 2.1 },
      { symbol: 'MARUTI', name: 'Maruti Suzuki', weight: '18.8%', price: 12400.0, changePct: 0.5 },
      { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', weight: '14.2%', price: 9800.0, changePct: 1.4 },
      { symbol: 'EICHERMOT', name: 'Eicher Motors', weight: '11.8%', price: 4820.0, changePct: 1.2 },
      { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', weight: '10.5%', price: 5240.0, changePct: 0.5 },
    ],
    chartData: {
      '1D': { points: 'M 0,70 L 60,62 L 120,52 L 180,48 L 240,35 L 300,28 L 360,20 L 400,15', high: 25050.0, low: 24720.0, change: '+0.78%' },
      '1W': { points: 'M 0,60 L 80,68 L 160,55 L 240,42 L 320,30 L 400,22', high: 25150.0, low: 24500.0, change: '+1.96%' },
      '1M': { points: 'M 0,45 L 80,58 L 160,70 L 240,52 L 320,35 L 400,25', high: 25400.0, low: 24100.0, change: '+3.65%' },
      '1Y': { points: 'M 0,92 L 80,75 L 160,58 L 240,40 L 320,25 L 400,12', high: 26200.0, low: 16800.0, change: '+48.7%' },
      'ALL': { points: 'M 0,98 L 80,85 L 160,68 L 240,48 L 320,28 L 400,10', high: 26200.0, low: 2500.0, change: '+899.2%' },
    }
  },
  {
    key: 'nifty_fmcg',
    name: 'NIFTY FMCG',
    symbol: 'NIFTY FMCG',
    category: 'Consumer Staples',
    price: 58320.20,
    change: -264.10,
    changePct: -0.45,
    pe: 44.8,
    pb: 12.5,
    divYield: 1.95,
    high52: 66438.00,
    low52: 51200.00,
    description: 'Tracks 15 household consumer goods, tobacco, personal care, and food manufacturing powerhouses.',
    sparkline: [58700, 58650, 58520, 58450, 58380, 58340, 58320],
    constituents: [
      { symbol: 'ITC', name: 'ITC', weight: '32.5%', price: 490.0, changePct: -0.2 },
      { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', weight: '28.4%', price: 2480.0, changePct: 0.2 },
      { symbol: 'NESTLEIND', name: 'Nestle India', weight: '10.2%', price: 2410.0, changePct: -0.4 },
      { symbol: 'BRITANNIA', name: 'Britannia Industries', weight: '8.8%', price: 5750.0, changePct: -0.5 },
      { symbol: 'TATACONSUM', name: 'Tata Consumer Products', weight: '7.8%', price: 1120.0, changePct: 0.3 },
    ],
    chartData: {
      '1D': { points: 'M 0,20 L 70,32 L 140,45 L 210,58 L 280,68 L 350,72 L 400,80', high: 58750.0, low: 58280.0, change: '-0.45%' },
      '1W': { points: 'M 0,35 L 80,48 L 160,62 L 240,70 L 320,65 L 400,75', high: 59100.0, low: 58150.0, change: '-1.32%' },
      '1M': { points: 'M 0,25 L 80,40 L 160,55 L 240,65 L 320,72 L 400,85', high: 60200.0, low: 58050.0, change: '-3.12%' },
      '1Y': { points: 'M 0,75 L 80,60 L 160,45 L 240,30 L 320,20 L 400,45', high: 66438.0, low: 51200.0, change: '+13.9%' },
      'ALL': { points: 'M 0,98 L 80,82 L 160,60 L 240,42 L 320,25 L 400,15', high: 66438.0, low: 4800.0, change: '+1115.0%' },
    }
  },
  {
    key: 'nifty_metal',
    name: 'NIFTY Metal',
    symbol: 'NIFTY METAL',
    category: 'Materials',
    price: 9420.75,
    change: 113.50,
    changePct: 1.22,
    pe: 18.5,
    pb: 2.1,
    divYield: 1.65,
    high52: 10180.00,
    low52: 6750.00,
    description: 'Tracks base metal producers, primary steel mills, and aluminum smelters linked to global commodity cycles.',
    sparkline: [9280, 9310, 9350, 9380, 9400, 9410, 9420],
    constituents: [
      { symbol: 'TATASTEEL', name: 'Tata Steel', weight: '22.4%', price: 152.0, changePct: 0.4 },
      { symbol: 'JSWSTEEL', name: 'JSW Steel', weight: '20.8%', price: 960.0, changePct: -0.2 },
      { symbol: 'HINDALCO', name: 'Hindalco Industries', weight: '18.5%', price: 710.0, changePct: -0.3 },
      { symbol: 'COALINDIA', name: 'Coal India', weight: '16.2%', price: 475.0, changePct: 1.1 },
    ],
    chartData: {
      '1D': { points: 'M 0,80 L 60,68 L 120,55 L 180,42 L 240,35 L 300,28 L 360,18 L 400,12', high: 9460.0, low: 9280.0, change: '+1.22%' },
      '1W': { points: 'M 0,85 L 80,72 L 160,58 L 240,45 L 320,32 L 400,20', high: 9520.0, low: 9150.0, change: '+2.95%' },
      '1M': { points: 'M 0,70 L 80,62 L 160,50 L 240,38 L 320,25 L 400,15', high: 9650.0, low: 9020.0, change: '+4.44%' },
      '1Y': { points: 'M 0,95 L 80,75 L 160,55 L 240,40 L 320,25 L 400,15', high: 10180.0, low: 6750.0, change: '+39.5%' },
      'ALL': { points: 'M 0,98 L 80,85 L 160,65 L 240,45 L 320,25 L 400,12', high: 10180.0, low: 1200.0, change: '+685.0%' },
    }
  },
  {
    key: 'nifty_energy',
    name: 'NIFTY Energy',
    symbol: 'NIFTY ENERGY',
    category: 'Energy',
    price: 39840.10,
    change: 257.00,
    changePct: 0.65,
    pe: 14.8,
    pb: 2.4,
    divYield: 2.40,
    high52: 44100.00,
    low52: 29500.00,
    description: 'Petroleum refining, gas distribution, power generation, and green renewable utilities.',
    sparkline: [39500, 39580, 39650, 39720, 39780, 39820, 39840],
    constituents: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', weight: '33.5%', price: 2840.5, changePct: 1.1 },
      { symbol: 'NTPC', name: 'NTPC', weight: '18.2%', price: 405.0, changePct: 1.8 },
      { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', weight: '16.5%', price: 285.0, changePct: -0.6 },
      { symbol: 'POWERGRID', name: 'Power Grid Corp', weight: '14.8%', price: 335.0, changePct: 0.8 },
      { symbol: 'BPCL', name: 'Bharat Petroleum', weight: '8.5%', price: 340.0, changePct: -0.8 },
    ],
    chartData: {
      '1D': { points: 'M 0,72 L 70,62 L 140,52 L 210,45 L 280,32 L 350,22 L 400,15', high: 39950.0, low: 39480.0, change: '+0.65%' },
      '1W': { points: 'M 0,78 L 80,68 L 160,55 L 240,42 L 320,30 L 400,20', high: 40150.0, low: 39250.0, change: '+1.50%' },
      '1M': { points: 'M 0,65 L 80,55 L 160,45 L 240,35 L 320,25 L 400,18', high: 40600.0, low: 38900.0, change: '+2.42%' },
      '1Y': { points: 'M 0,92 L 80,72 L 160,55 L 240,38 L 320,22 L 400,12', high: 44100.0, low: 29500.0, change: '+35.0%' },
      'ALL': { points: 'M 0,98 L 80,82 L 160,65 L 240,45 L 320,25 L 400,10', high: 44100.0, low: 4500.0, change: '+785.3%' },
    }
  }
];

// ─── Nifty 50 Constituent Universe ───────────────────────────────────────────
interface CompanyRow {
  symbol: string;
  name: string;
  sector: string;
  market_cap: number;
  pe_ratio: number | null;
  roe: number | null;
  price: number;
  change_pct: number;
  debt_to_equity: number | null;
}

const NIFTY_50_UNIVERSE: CompanyRow[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', market_cap: 19800000000000, price: 2840.5, change_pct: 1.1, pe_ratio: 27.8, roe: 14.2, debt_to_equity: 0.38 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', market_cap: 14200000000000, price: 3950.0, change_pct: 0.8, pe_ratio: 29.5, roe: 48.5, debt_to_equity: 0.05 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Financials', market_cap: 12900000000000, price: 1720.0, change_pct: -0.4, pe_ratio: 18.2, roe: 16.8, debt_to_equity: 1.2 },
  { symbol: 'INFY', name: 'Infosys', sector: 'Technology', market_cap: 7800000000000, price: 1880.0, change_pct: 1.2, pe_ratio: 28.1, roe: 31.8, debt_to_equity: 0.08 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Financials', market_cap: 8900000000000, price: 1260.0, change_pct: 0.6, pe_ratio: 17.4, roe: 18.4, debt_to_equity: 1.1 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', market_cap: 9600000000000, price: 1680.0, change_pct: 1.8, pe_ratio: 54.0, roe: 19.5, debt_to_equity: 1.4 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financials', market_cap: 7200000000000, price: 810.0, change_pct: 0.3, pe_ratio: 10.5, roe: 17.2, debt_to_equity: 1.5 },
  { symbol: 'ITC', name: 'ITC', sector: 'Consumer Goods', market_cap: 6100000000000, price: 490.0, change_pct: -0.2, pe_ratio: 28.6, roe: 29.4, debt_to_equity: 0.01 },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', market_cap: 5100000000000, price: 3680.0, change_pct: 1.4, pe_ratio: 35.8, roe: 16.2, debt_to_equity: 0.85 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Financials', market_cap: 4400000000000, price: 7120.0, change_pct: -1.1, pe_ratio: 29.8, roe: 21.6, debt_to_equity: 3.8 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'Consumer Goods', market_cap: 5800000000000, price: 2480.0, change_pct: 0.2, pe_ratio: 56.4, roe: 20.3, debt_to_equity: 0.03 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Automobile', market_cap: 3900000000000, price: 12400.0, change_pct: 0.5, pe_ratio: 28.2, roe: 17.1, debt_to_equity: 0.02 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'Technology', market_cap: 4800000000000, price: 1780.0, change_pct: 1.5, pe_ratio: 27.4, roe: 26.5, debt_to_equity: 0.12 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Healthcare', market_cap: 4500000000000, price: 1880.0, change_pct: 0.7, pe_ratio: 38.6, roe: 17.4, debt_to_equity: 0.08 },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Financials', market_cap: 3600000000000, price: 1180.0, change_pct: -0.3, pe_ratio: 13.8, roe: 16.5, debt_to_equity: 1.2 },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer Goods', market_cap: 3100000000000, price: 3450.0, change_pct: 1.3, pe_ratio: 78.4, roe: 32.5, debt_to_equity: 0.45 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Materials', market_cap: 3200000000000, price: 11100.0, change_pct: 0.9, pe_ratio: 42.5, roe: 12.8, debt_to_equity: 0.28 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Financials', market_cap: 3500000000000, price: 1780.0, change_pct: -0.5, pe_ratio: 19.5, roe: 15.3, debt_to_equity: 1.0 },
  { symbol: 'NTPC', name: 'NTPC', sector: 'Energy', market_cap: 3900000000000, price: 405.0, change_pct: 1.8, pe_ratio: 18.2, roe: 13.5, debt_to_equity: 1.3 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy', market_cap: 3600000000000, price: 285.0, change_pct: -0.6, pe_ratio: 7.8, roe: 14.8, debt_to_equity: 0.42 },
  { symbol: 'TATASTEEL', name: 'Tata Steel', sector: 'Materials', market_cap: 1900000000000, price: 152.0, change_pct: 0.4, pe_ratio: 38.0, roe: 6.2, debt_to_equity: 0.88 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', sector: 'Utilities', market_cap: 3100000000000, price: 335.0, change_pct: 0.8, pe_ratio: 19.4, roe: 18.5, debt_to_equity: 1.4 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', sector: 'Automobile', market_cap: 3400000000000, price: 2820.0, change_pct: 2.1, pe_ratio: 29.4, roe: 19.2, debt_to_equity: 0.15 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Conglomerate', market_cap: 3200000000000, price: 2850.0, change_pct: -0.9, pe_ratio: 88.0, roe: 10.4, debt_to_equity: 1.1 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto', sector: 'Automobile', market_cap: 2800000000000, price: 9800.0, change_pct: 1.4, pe_ratio: 34.2, roe: 27.8, debt_to_equity: 0.01 },
  { symbol: 'COALINDIA', name: 'Coal India', sector: 'Materials', market_cap: 2900000000000, price: 475.0, change_pct: 1.1, pe_ratio: 8.4, roe: 42.0, debt_to_equity: 0.05 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', sector: 'Financials', market_cap: 2700000000000, price: 1710.0, change_pct: -0.4, pe_ratio: 32.5, roe: 14.1, debt_to_equity: 2.8 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', sector: 'Infrastructure', market_cap: 2900000000000, price: 1360.0, change_pct: 0.7, pe_ratio: 31.0, roe: 16.8, debt_to_equity: 1.1 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', sector: 'Materials', market_cap: 2300000000000, price: 960.0, change_pct: -0.2, pe_ratio: 26.5, roe: 12.1, debt_to_equity: 1.05 },
  { symbol: 'CIPLA', name: 'Cipla', sector: 'Healthcare', market_cap: 1250000000000, price: 1540.0, change_pct: 0.3, pe_ratio: 27.5, roe: 16.2, debt_to_equity: 0.02 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', sector: 'Automobile', market_cap: 1320000000000, price: 4820.0, change_pct: 1.2, pe_ratio: 31.2, roe: 22.4, debt_to_equity: 0.04 },
  { symbol: 'BPCL', name: 'Bharat Petroleum', sector: 'Energy', market_cap: 1450000000000, price: 340.0, change_pct: -0.8, pe_ratio: 5.6, roe: 36.2, debt_to_equity: 0.75 },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Healthcare', market_cap: 1100000000000, price: 6580.0, change_pct: 0.4, pe_ratio: 21.0, roe: 18.6, debt_to_equity: 0.06 },
  { symbol: 'GRASIM', name: 'Grasim Industries', sector: 'Materials', market_cap: 1700000000000, price: 2540.0, change_pct: 0.1, pe_ratio: 32.0, roe: 7.5, debt_to_equity: 0.72 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', sector: 'Consumer Goods', market_cap: 1380000000000, price: 5750.0, change_pct: -0.5, pe_ratio: 58.2, roe: 54.0, debt_to_equity: 0.78 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'Consumer Goods', market_cap: 1080000000000, price: 1120.0, change_pct: 0.3, pe_ratio: 76.0, roe: 8.2, debt_to_equity: 0.12 },
  { symbol: 'TECHM', name: 'Tech Mahindra', sector: 'Technology', market_cap: 1550000000000, price: 1620.0, change_pct: 2.0, pe_ratio: 48.0, roe: 11.8, debt_to_equity: 0.10 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', sector: 'Automobile', market_cap: 1050000000000, price: 5240.0, change_pct: 0.5, pe_ratio: 25.8, roe: 23.5, debt_to_equity: 0.02 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', sector: 'Healthcare', market_cap: 1020000000000, price: 7100.0, change_pct: 0.8, pe_ratio: 82.0, roe: 16.5, debt_to_equity: 0.65 },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories", sector: 'Healthcare', market_cap: 1540000000000, price: 5800.0, change_pct: 1.6, pe_ratio: 86.0, roe: 13.2, debt_to_equity: 0.01 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', sector: 'Materials', market_cap: 1580000000000, price: 710.0, change_pct: -0.3, pe_ratio: 16.2, roe: 9.8, debt_to_equity: 0.55 },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', sector: 'Financials', market_cap: 1280000000000, price: 3420.0, change_pct: 1.1, pe_ratio: 16.5, roe: 15.6, debt_to_equity: 3.5 },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance', sector: 'Financials', market_cap: 1720000000000, price: 1720.0, change_pct: -0.1, pe_ratio: 78.0, roe: 14.8, debt_to_equity: 0.0 },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance', sector: 'Financials', market_cap: 1580000000000, price: 735.0, change_pct: 0.2, pe_ratio: 88.0, roe: 12.5, debt_to_equity: 0.0 },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'Technology', market_cap: 2850000000000, price: 545.0, change_pct: 0.9, pe_ratio: 24.8, roe: 15.6, debt_to_equity: 0.22 },
  { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'Consumer Goods', market_cap: 2320000000000, price: 2410.0, change_pct: -0.4, pe_ratio: 72.0, roe: 108.0, debt_to_equity: 0.08 },
];

function formatMcap(mcap: number): string {
  if (mcap >= 1e12) return `₹${(mcap / 1e12).toFixed(1)}L Cr`;
  if (mcap >= 1e9) return `₹${(mcap / 1e9).toFixed(0)} Cr`;
  return `₹${mcap.toLocaleString('en-IN')}`;
}

export default function EquitiesOverviewPage() {
  const [selectedSector, setSelectedSector] = useState<SectorIndex | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  // Top Gainers and Losers
  const sortedByChange = [...NIFTY_50_UNIVERSE].sort((a, b) => b.change_pct - a.change_pct);
  const topGainers = sortedByChange.slice(0, 5);
  const topLosers = [...NIFTY_50_UNIVERSE].sort((a, b) => a.change_pct - b.change_pct).slice(0, 5);

  // Sector categories
  const sectorsList = ['All', 'Financials', 'Technology', 'Energy', 'Automobile', 'Healthcare', 'Consumer Goods', 'Materials'];

  // Filtered Nifty 50 table
  const filteredCompanies = useMemo(() => {
    return NIFTY_50_UNIVERSE.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.symbol.toLowerCase().includes(search.toLowerCase());
      const matchSector = sectorFilter === 'All' || c.sector === sectorFilter;
      return matchSearch && matchSector;
    });
  }, [search, sectorFilter]);

  return (
    <div className="w-full text-white pb-24">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex flex-col gap-6 sm:gap-8">
        
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262626] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#479ffa] animate-pulse" />
              <span className="font-mono-data text-[10px] sm:text-[11px] tracking-widest text-[#868f97] uppercase font-semibold">
                National Stock Exchange of India &bull; Real-Time Diagnostics
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.08em] leading-tight text-white">
              Indian Equity <span className="fey-gradient-volt">Universe.</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-[#868f97] mt-1.5 max-w-2xl leading-relaxed">
              Real-time sectoral indices, constituent weight matrices, and institutional financials for all Nifty 50 leaders. Click any index to view interactive charts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/screener"
              className="px-4 py-2 rounded-full border border-[#333333] bg-[#191919] hover:bg-[#222222] text-xs font-semibold text-white flex items-center gap-2 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#ffa16c]" />
              <span>Institutional Screener</span>
            </Link>
          </div>
        </div>

        {/* 2. Sectoral Indices Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#479ffa]" />
              <h2 className="text-base font-bold text-white tracking-[-0.02em]">
                Sectoral & Benchmark Indices
              </h2>
              <span className="text-[10px] font-mono-data text-[#868f97] bg-[#191919] px-2 py-0.5 rounded-full border border-[#2a2a2a]">
                Click card to open live chart
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {SECTOR_INDICES.map((idx) => {
              const isPositive = idx.changePct >= 0;
              return (
                <div
                  key={idx.key}
                  onClick={() => {
                    setSelectedSector(idx);
                    setActiveTimeframe('1D');
                  }}
                  className="bg-[#191919] border border-[#262626] hover:border-[#479ffa]/60 rounded-[14px] p-4 cursor-pointer transition-all hover:shadow-[0_0_24px_rgba(71,159,250,0.2)] group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-mono-data text-[#868f97] uppercase">
                        {idx.category}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#479ffa] transition-colors">
                        {idx.name}
                      </h3>
                    </div>
                    <span className={`text-[11px] font-mono-data font-semibold px-2 py-0.5 rounded-full border ${
                      isPositive 
                        ? 'bg-[#4ebe96]/10 text-[#4ebe96] border-[#4ebe96]/20' 
                        : 'bg-[#eb5757]/10 text-[#eb5757] border-[#eb5757]/20'
                    }`}>
                      {isPositive ? '+' : ''}{idx.changePct.toFixed(2)}%
                    </span>
                  </div>

                  {/* Price & Sparkline */}
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <div className="text-xl font-bold font-mono-data text-white tabular-nums tracking-tight">
                        ₹{idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] font-mono-data text-[#868f97]">
                        P/E {idx.pe}x &bull; Div {idx.divYield}%
                      </div>
                    </div>

                    {/* Mini Sparkline */}
                    <div className="w-16 h-8 flex items-center justify-end">
                      <svg viewBox="0 0 70 30" className="w-full h-full overflow-visible">
                        <polyline
                          fill="none"
                          stroke={isPositive ? '#4ebe96' : '#eb5757'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={idx.sparkline.map((val, i) => {
                            const min = Math.min(...idx.sparkline);
                            const max = Math.max(...idx.sparkline);
                            const range = max - min || 1;
                            const y = 26 - ((val - min) / range) * 22;
                            const x = (i / (idx.sparkline.length - 1)) * 68;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#222222] flex items-center justify-between text-[10px] text-[#868f97]">
                    <span>Top: {idx.constituents[0]?.name.split(' ')[0]}</span>
                    <span className="text-[#479ffa] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Open Chart &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Today's Top Gainers & Losers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gainers */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-3 border-b border-[#262626] pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4ebe96]" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono-data">
                  Top Market Gainers
                </h3>
              </div>
              <span className="text-[10px] font-mono-data text-[#868f97]">NIFTY 50</span>
            </div>

            <div className="space-y-2">
              {topGainers.map(c => (
                <Link
                  key={c.symbol}
                  href={`/equities/companies/${c.symbol}`}
                  className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#141414] hover:bg-[#1c1c1c] border border-[#262626] hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono-data text-xs font-bold text-white group-hover:text-[#479ffa] transition-colors">
                      {c.symbol}
                    </span>
                    <span className="text-xs text-[#868f97] truncate max-w-[140px] sm:max-w-[200px]">
                      {c.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono-data text-xs font-semibold text-white">
                      ₹{c.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="font-mono-data text-xs font-bold text-[#4ebe96] bg-[#4ebe96]/10 px-2 py-0.5 rounded-full border border-[#4ebe96]/20">
                      +{c.change_pct.toFixed(2)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-3 border-b border-[#262626] pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#eb5757]" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono-data">
                  Top Market Losers
                </h3>
              </div>
              <span className="text-[10px] font-mono-data text-[#868f97]">NIFTY 50</span>
            </div>

            <div className="space-y-2">
              {topLosers.map(c => (
                <Link
                  key={c.symbol}
                  href={`/equities/companies/${c.symbol}`}
                  className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#141414] hover:bg-[#1c1c1c] border border-[#262626] hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono-data text-xs font-bold text-white group-hover:text-[#479ffa] transition-colors">
                      {c.symbol}
                    </span>
                    <span className="text-xs text-[#868f97] truncate max-w-[140px] sm:max-w-[200px]">
                      {c.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono-data text-xs font-semibold text-white">
                      ₹{c.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="font-mono-data text-xs font-bold text-[#eb5757] bg-[#eb5757]/10 px-2 py-0.5 rounded-full border border-[#eb5757]/20">
                      {c.change_pct.toFixed(2)}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Complete NIFTY 50 Universe Directory */}
        <div className="bg-[#191919] border border-[#262626] rounded-[16px] p-5 sm:p-6 shadow-[0_0_44px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#d6fe51]" />
                <h2 className="text-lg font-bold text-white tracking-[-0.03em]">
                  NIFTY 50 Constituent Companies
                </h2>
              </div>
              <p className="text-xs text-[#868f97] font-mono-data mt-0.5">
                Click any company to open its interactive price chart, key metrics, and multi-year balance sheets
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#868f97]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by symbol or name..."
                className="w-full bg-[#121212] border border-[#2a2a2a] rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#666666] outline-none focus:border-[#479ffa] transition-colors font-sans"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#868f97] hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Sector Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {sectorsList.map((sec) => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-3 py-1 rounded-full text-xs font-mono-data transition-all whitespace-nowrap ${
                  sectorFilter === sec
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-[#141414] hover:bg-[#202020] text-[#868f97] hover:text-white border border-[#262626]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Companies Table */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#262626] text-[10px] text-[#868f97] uppercase tracking-wider font-mono-data">
                  <th className="py-3 px-3">Symbol & Company</th>
                  <th className="py-3 px-3">Sector</th>
                  <th className="py-3 px-3 text-right">Price</th>
                  <th className="py-3 px-3 text-right">Day Chg</th>
                  <th className="py-3 px-3 text-right">Mkt Cap</th>
                  <th className="py-3 px-3 text-right">P/E</th>
                  <th className="py-3 px-3 text-right">ROE</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222] text-xs font-sans">
                {filteredCompanies.map((c) => {
                  const isPositive = c.change_pct >= 0;
                  return (
                    <tr
                      key={c.symbol}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <Link 
                          href={`/equities/companies/${c.symbol}`}
                          className="flex flex-col group-hover:text-[#479ffa] transition-colors"
                        >
                          <span className="font-mono-data font-bold text-white text-xs">
                            {c.symbol}
                          </span>
                          <span className="text-[11px] text-[#868f97] truncate max-w-[180px]">
                            {c.name}
                          </span>
                        </Link>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[11px] text-[#868f97] font-mono-data bg-[#121212] px-2 py-0.5 rounded-full border border-[#222222]">
                          {c.sector}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono-data font-semibold text-white tabular-nums">
                        ₹{c.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono-data text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          isPositive
                            ? 'bg-[#4ebe96]/10 text-[#4ebe96] border-[#4ebe96]/20'
                            : 'bg-[#eb5757]/10 text-[#eb5757] border-[#eb5757]/20'
                        }`}>
                          {isPositive ? '+' : ''}{c.change_pct.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono-data text-white/90 tabular-nums">
                        {formatMcap(c.market_cap)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono-data text-[#868f97]">
                        {c.pe_ratio ? `${c.pe_ratio.toFixed(1)}x` : '—'}
                      </td>

                      <td className="py-3 px-3 text-right font-mono-data text-[#4ebe96]">
                        {c.roe ? `${c.roe.toFixed(1)}%` : '—'}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/equities/companies/${c.symbol}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#141414] hover:bg-[#202020] border border-[#262626] hover:border-white/30 text-[11px] font-medium text-white transition-all"
                        >
                          <span>Chart & Statements</span>
                          <ChevronRight className="w-3 h-3 text-[#479ffa]" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 5. INTERACTIVE SECTOR INDEX CHART MODAL */}
      <AnimatePresence>
        {selectedSector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#161616] border border-[#2a2a2a] rounded-[20px] w-full max-w-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] text-white flex flex-col max-h-[90vh]"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1e1e1e] border border-[#333333] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#479ffa]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{selectedSector.name}</span>
                      <span className="text-[10px] font-mono-data text-[#868f97] bg-[#222222] px-2 py-0.5 rounded-full border border-[#333333]">
                        {selectedSector.symbol}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#868f97]">{selectedSector.description}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSector(null)}
                  className="w-8 h-8 rounded-full bg-[#202020] hover:bg-[#282828] border border-[#333333] flex items-center justify-center text-[#868f97] hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 no-scrollbar">
                
                {/* Price & Timeframe Controls */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#121212] p-4 rounded-[14px] border border-[#262626]">
                  <div>
                    <div className="text-[10px] font-mono-data text-[#868f97] uppercase">Current Level</div>
                    <div className="text-3xl font-bold font-mono-data text-white tabular-nums">
                      ₹{selectedSector.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-mono-data font-bold px-2 py-0.5 rounded-full ${
                        selectedSector.changePct >= 0 
                          ? 'text-[#4ebe96] bg-[#4ebe96]/10' 
                          : 'text-[#eb5757] bg-[#eb5757]/10'
                      }`}>
                        {selectedSector.changePct >= 0 ? '+' : ''}{selectedSector.changePct.toFixed(2)}% ({selectedSector.chartData[activeTimeframe].change})
                      </span>
                      <span className="text-[10px] font-mono-data text-[#868f97]">
                        High: ₹{selectedSector.chartData[activeTimeframe].high.toLocaleString()} &bull; Low: ₹{selectedSector.chartData[activeTimeframe].low.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Timeframe Buttons */}
                  <div className="flex items-center gap-1.5 bg-[#191919] p-1 rounded-full border border-[#262626]">
                    {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setActiveTimeframe(tf)}
                        className={`px-3 py-1 rounded-full text-xs font-mono-data transition-all ${
                          activeTimeframe === tf
                            ? 'bg-[#479ffa] text-white font-bold shadow-sm'
                            : 'text-[#868f97] hover:text-white'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Line / Area Chart */}
                <div className="h-56 bg-[#101010] p-4 rounded-[14px] border border-[#262626] flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] font-mono-data text-[#555555]">
                    <span>High: ₹{selectedSector.chartData[activeTimeframe].high.toLocaleString()}</span>
                    <span>Range: {activeTimeframe} Interactive Trajectory</span>
                  </div>

                  <svg viewBox="0 0 400 100" className="w-full h-36 overflow-visible">
                    <defs>
                      <linearGradient id="sectorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#479ffa" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#479ffa" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d={`${selectedSector.chartData[activeTimeframe].points} L 400,100 L 0,100 Z`}
                      fill="url(#sectorGrad)"
                    />
                    {/* Line stroke */}
                    <path
                      d={selectedSector.chartData[activeTimeframe].points}
                      fill="none"
                      stroke="#479ffa"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex justify-between items-center text-[10px] font-mono-data text-[#555555]">
                    <span>Low: ₹{selectedSector.chartData[activeTimeframe].low.toLocaleString()}</span>
                    <span>Status: Real-Time NSE Telemetry</span>
                  </div>
                </div>

                {/* Key Statistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-[#141414] border border-[#262626] p-3 rounded-[12px]">
                    <span className="text-[10px] font-mono-data text-[#868f97] uppercase block">52-Week High</span>
                    <span className="font-mono-data text-sm font-bold text-white tabular-nums mt-0.5 block">
                      ₹{selectedSector.high52.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-[#141414] border border-[#262626] p-3 rounded-[12px]">
                    <span className="text-[10px] font-mono-data text-[#868f97] uppercase block">52-Week Low</span>
                    <span className="font-mono-data text-sm font-bold text-white tabular-nums mt-0.5 block">
                      ₹{selectedSector.low52.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-[#141414] border border-[#262626] p-3 rounded-[12px]">
                    <span className="text-[10px] font-mono-data text-[#868f97] uppercase block">P/E Ratio</span>
                    <span className="font-mono-data text-sm font-bold text-[#479ffa] tabular-nums mt-0.5 block">
                      {selectedSector.pe}x
                    </span>
                  </div>

                  <div className="bg-[#141414] border border-[#262626] p-3 rounded-[12px]">
                    <span className="text-[10px] font-mono-data text-[#868f97] uppercase block">Dividend Yield</span>
                    <span className="font-mono-data text-sm font-bold text-[#4ebe96] tabular-nums mt-0.5 block">
                      {selectedSector.divYield}%
                    </span>
                  </div>
                </div>

                {/* Top Index Constituents with Clickable Links */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wider uppercase font-mono-data">
                      Key Index Constituents ({selectedSector.name})
                    </span>
                    <span className="text-[10px] font-mono-data text-[#868f97]">
                      Click company to view balance sheet & financials
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {selectedSector.constituents.map((item) => (
                      <Link
                        key={item.symbol}
                        href={`/equities/companies/${item.symbol}`}
                        className="flex items-center justify-between p-3 rounded-[10px] bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] hover:border-white/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono-data bg-[#1e1e1e] text-[#479ffa] px-2 py-0.5 rounded-full border border-[#333333]">
                            {item.weight}
                          </span>
                          <div>
                            <span className="font-mono-data font-bold text-white text-xs group-hover:text-[#479ffa] transition-colors block">
                              {item.symbol}
                            </span>
                            <span className="text-[11px] text-[#868f97]">
                              {item.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-mono-data text-xs font-semibold text-white block">
                              ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <span className={`font-mono-data text-[10px] ${
                              item.changePct >= 0 ? 'text-[#4ebe96]' : 'text-[#eb5757]'
                            }`}>
                              {item.changePct >= 0 ? '+' : ''}{item.changePct.toFixed(2)}%
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#868f97] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
