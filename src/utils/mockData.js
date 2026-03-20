// ─── STOCK DATA ───────────────────────────────────────────────────────────────
export const STOCKS = {
  AAPL: { name: "Apple Inc.", price: 189.45, change: 2.31, changePct: 1.24, volume: "52.3M", mktCap: "2.94T", sector: "Technology", pe: 31.2, high52: 199.62, low52: 143.9 },
  MSFT: { name: "Microsoft Corp.", price: 415.32, change: -3.18, changePct: -0.76, volume: "18.9M", mktCap: "3.09T", sector: "Technology", pe: 37.5, high52: 430.82, low52: 309.45 },
  GOOGL: { name: "Alphabet Inc.", price: 175.98, change: 1.87, changePct: 1.07, volume: "23.4M", mktCap: "2.18T", sector: "Technology", pe: 25.8, high52: 191.75, low52: 120.21 },
  AMZN: { name: "Amazon.com Inc.", price: 198.12, change: 4.56, changePct: 2.36, volume: "41.2M", mktCap: "2.08T", sector: "Consumer Disc.", pe: 62.1, high52: 201.2, low52: 118.35 },
  NVDA: { name: "NVIDIA Corp.", price: 875.39, change: 22.45, changePct: 2.63, volume: "38.7M", mktCap: "2.16T", sector: "Technology", pe: 89.4, high52: 953.86, low52: 393.28 },
  TSLA: { name: "Tesla Inc.", price: 182.63, change: -8.21, changePct: -4.30, volume: "97.3M", mktCap: "583B", sector: "Auto", pe: 56.3, high52: 299.29, low52: 138.8 },
  META: { name: "Meta Platforms", price: 527.18, change: 9.34, changePct: 1.80, volume: "14.6M", mktCap: "1.35T", sector: "Technology", pe: 28.9, high52: 531.49, low52: 274.38 },
  JPM:  { name: "JPMorgan Chase", price: 212.45, change: -1.23, changePct: -0.58, volume: "9.8M", mktCap: "612B", sector: "Financials", pe: 12.4, high52: 220.82, low52: 133.79 },
  NFLX: { name: "Netflix Inc.", price: 634.78, change: 11.23, changePct: 1.80, volume: "5.4M", mktCap: "278B", sector: "Communication", pe: 48.2, high52: 700.95, low52: 344.74 },
  AMD:  { name: "Advanced Micro Devices", price: 168.92, change: -2.87, changePct: -1.67, volume: "44.1M", mktCap: "273B", sector: "Technology", pe: 45.6, high52: 227.3, low52: 93.12 },
  RELIANCE: { name: "Reliance Industries", price: 2987.45, change: 34.20, changePct: 1.16, volume: "8.2M", mktCap: "20.2T", sector: "Conglomerate", pe: 28.4, high52: 3217.90, low52: 2220.30 },
  TCS: { name: "Tata Consultancy Services", price: 3876.60, change: -22.40, changePct: -0.57, volume: "1.9M", mktCap: "14.1T", sector: "IT Services", pe: 32.1, high52: 4255.75, low52: 3311.45 },
};

// ─── MARKET INDICES ───────────────────────────────────────────────────────────
export const INDICES = [
  { name: "NIFTY 50",    value: "22,419.95", change: "+142.35", pct: "+0.64%", positive: true  },
  { name: "SENSEX",      value: "73,961.28", change: "+496.13", pct: "+0.67%", positive: true  },
  { name: "S&P 500",     value: "5,308.13",  change: "-12.54",  pct: "-0.24%", positive: false },
  { name: "NASDAQ",      value: "16,742.39", change: "+87.23",  pct: "+0.52%", positive: true  },
  { name: "DOW JONES",   value: "38,972.14", change: "-86.74",  pct: "-0.22%", positive: false },
  { name: "BANK NIFTY",  value: "48,201.05", change: "+312.87", pct: "+0.65%", positive: true  },
];

// ─── IPO DATA ─────────────────────────────────────────────────────────────────
export const IPOS_DATA = [
  {
    id: 1, company: "ZenTech Solutions", symbol: "ZTS", status: "upcoming",
    issuePrice: "₹240-252", lotSize: 59, openDate: "Apr 15, 2024", closeDate: "Apr 17, 2024",
    listingDate: "Apr 22, 2024", subscribed: null, gmp: "+₹42", sector: "SaaS",
    size: "₹1,240 Cr", desc: "Cloud-based enterprise SaaS platform for SMEs across India and Southeast Asia.",
    revenue: "₹382 Cr", profit: "₹47 Cr", bookmarked: false,
  },
  {
    id: 2, company: "BharatEV Motors", symbol: "BEVM", status: "ongoing",
    issuePrice: "₹185-196", lotSize: 76, openDate: "Mar 18, 2024", closeDate: "Mar 20, 2024",
    listingDate: "Mar 25, 2024", subscribed: "4.21x", gmp: "+₹28", sector: "EV/Auto",
    size: "₹890 Cr", desc: "Electric two-wheeler manufacturer targeting Tier-2 and Tier-3 cities.",
    revenue: "₹1,120 Cr", profit: "₹89 Cr", bookmarked: false,
  },
  {
    id: 3, company: "AgroFinance Ltd.", symbol: "AFL", status: "ongoing",
    issuePrice: "₹310-325", lotSize: 46, openDate: "Mar 19, 2024", closeDate: "Mar 21, 2024",
    listingDate: "Mar 26, 2024", subscribed: "7.83x", gmp: "+₹65", sector: "Fintech",
    size: "₹2,100 Cr", desc: "Digital lending platform for agricultural supply chain financing.",
    revenue: "₹678 Cr", profit: "₹132 Cr", bookmarked: true,
  },
  {
    id: 4, company: "MediScan Diagnostics", symbol: "MSD", status: "listed",
    issuePrice: "₹420-440", lotSize: 34, openDate: "Feb 28, 2024", closeDate: "Mar 01, 2024",
    listingDate: "Mar 06, 2024", subscribed: "12.4x", gmp: "+₹110", sector: "Healthcare",
    size: "₹3,450 Cr", listingPrice: "₹572", currentPrice: "₹618",
    desc: "AI-powered diagnostic imaging network across 200+ cities.",
    revenue: "₹1,890 Cr", profit: "₹287 Cr", bookmarked: false,
  },
  {
    id: 5, company: "DataVault AI", symbol: "DVA", status: "listed",
    issuePrice: "₹890-940", lotSize: 16, openDate: "Feb 14, 2024", closeDate: "Feb 16, 2024",
    listingDate: "Feb 21, 2024", subscribed: "31.2x", gmp: "+₹320", sector: "AI/ML",
    size: "₹6,800 Cr", listingPrice: "₹1,280", currentPrice: "₹1,420",
    desc: "Enterprise AI infrastructure and vector database solutions.",
    revenue: "₹2,340 Cr", profit: "₹412 Cr", bookmarked: true,
  },
  {
    id: 6, company: "GreenGrid Power", symbol: "GGP", status: "upcoming",
    issuePrice: "₹155-165", lotSize: 90, openDate: "Apr 22, 2024", closeDate: "Apr 24, 2024",
    listingDate: "Apr 29, 2024", subscribed: null, gmp: "+₹18", sector: "Renewable Energy",
    size: "₹4,200 Cr", desc: "Solar and wind energy developer with 3.2 GW installed capacity.",
    revenue: "₹890 Cr", profit: "₹67 Cr", bookmarked: false,
  },
];

// ─── NEWS DATA ────────────────────────────────────────────────────────────────
export const NEWS_DATA = [
  { id: 1, title: "Fed signals potential rate cuts amid cooling inflation data", source: "Reuters", time: "2h ago", tag: "Macro", emoji: "📰", summary: "Federal Reserve officials indicated they may cut rates three times in 2024 as inflation trends toward the 2% target, boosting equity markets globally." },
  { id: 2, title: "NVIDIA Q4 earnings shatter expectations, stock surges pre-market", source: "Bloomberg", time: "4h ago", tag: "Earnings", emoji: "📊", summary: "NVIDIA reported revenue of $22.1B, up 265% YoY, driven by surging AI chip demand from hyperscalers and data center clients worldwide." },
  { id: 3, title: "Reliance Industries eyes $3B investment in green hydrogen", source: "Economic Times", time: "5h ago", tag: "India", emoji: "🌱", summary: "RIL plans to set up 10 GW of electrolyzer capacity by 2030, positioning India as a global green hydrogen hub under its New Energy vertical." },
  { id: 4, title: "Tesla deliveries miss Q1 estimates by 20%, shares fall 5%", source: "CNBC", time: "6h ago", tag: "Auto", emoji: "⚡", summary: "Tesla delivered 386,810 vehicles in Q1 2024, below analyst estimates of 449,080, raising serious demand concerns amid EV market saturation." },
  { id: 5, title: "SEBI tightens F&O rules, increases lot sizes across segments", source: "Mint", time: "8h ago", tag: "Regulation", emoji: "⚖️", summary: "Markets regulator SEBI has revised F&O framework to curb retail speculation after recording historic derivatives losses for individual investors." },
  { id: 6, title: "Apple's India manufacturing reaches 14% of global iPhone output", source: "Financial Times", time: "10h ago", tag: "Tech", emoji: "🍎", summary: "Apple's India production milestone signals deepening supply chain diversification from China, with three new assembly lines coming online in Chennai." },
  { id: 7, title: "Adani Group secures $1.2B in fresh green bonds for airport expansion", source: "Business Standard", time: "12h ago", tag: "India", emoji: "🏗️", summary: "Adani Airports Holdings raised $1.2 billion at competitive rates to fund expansion of seven major airports including Mumbai and Ahmedabad." },
  { id: 8, title: "Global crude oil prices rise 3% on Middle East supply concerns", source: "Reuters", time: "14h ago", tag: "Macro", emoji: "🛢️", summary: "Brent crude surged above $87/barrel as geopolitical tensions in the Middle East raised fears of supply disruptions from key OPEC+ producers." },
];

// ─── GENERATE PRICE DATA ──────────────────────────────────────────────────────
export function generatePriceData(basePrice, periods = 30, volatility = 0.02) {
  const data = [];
  let price = basePrice * (0.85 + Math.random() * 0.1);
  for (let i = 0; i < periods; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, price * 0.5);
    const open = price;
    const close = price + (Math.random() - 0.5) * volatility * price;
    const high = Math.max(open, close) + Math.random() * volatility * price * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * price * 0.5;
    data.push({ open: +open.toFixed(2), close: +close.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), price: +close.toFixed(2) });
    price = close;
  }
  return data;
}

export function getPeriods(filter) {
  return { "1D": 24, "1W": 7, "1M": 30, "3M": 90, "1Y": 52, "MAX": 100 }[filter] || 30;
}

export function getVolatility(filter) {
  return { "1D": 0.004, "1W": 0.008, "1M": 0.018, "3M": 0.022, "1Y": 0.025, "MAX": 0.03 }[filter] || 0.018;
}
