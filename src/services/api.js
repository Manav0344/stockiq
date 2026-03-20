import { STOCKS, generatePriceData, getPeriods, getVolatility } from '../utils/mockData';

const ALPHA_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;

// ─── STOCK QUOTE ──────────────────────────────────────────────────────────────
export async function fetchQuote(symbol) {
  // Use real API if key available
  if (FINNHUB_KEY) {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
      const data = await res.json();
      if (data.c) {
        return {
          price: data.c,
          change: +(data.c - data.pc).toFixed(2),
          changePct: +((data.c - data.pc) / data.pc * 100).toFixed(2),
          high: data.h, low: data.l, open: data.o, prevClose: data.pc,
        };
      }
    } catch (e) { console.warn("Finnhub API failed, using mock data"); }
  }
  // Fallback to mock
  const stock = STOCKS[symbol];
  if (!stock) return null;
  return { price: stock.price, change: stock.change, changePct: stock.changePct };
}

// ─── HISTORICAL DATA ──────────────────────────────────────────────────────────
export async function fetchHistory(symbol, filter = "1M") {
  // Use real API if key available
  if (ALPHA_KEY) {
    try {
      const fn = filter === "1D" ? "TIME_SERIES_INTRADAY&interval=60min" : "TIME_SERIES_DAILY";
      const res = await fetch(`https://www.alphavantage.co/query?function=${fn}&symbol=${symbol}&apikey=${ALPHA_KEY}`);
      const data = await res.json();
      const ts = data["Time Series (Daily)"] || data["Time Series (60min)"];
      if (ts) {
        return Object.entries(ts).slice(0, getPeriods(filter)).reverse().map(([date, v]) => ({
          date,
          open:  +v["1. open"],
          high:  +v["2. high"],
          low:   +v["3. low"],
          close: +v["4. close"],
          price: +v["4. close"],
          volume: +v["5. volume"],
        }));
      }
    } catch (e) { console.warn("Alpha Vantage API failed, using mock data"); }
  }
  // Fallback to generated mock
  const stock = STOCKS[symbol];
  return generatePriceData(stock?.price || 100, getPeriods(filter), getVolatility(filter));
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
export function searchStocks(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return Object.entries(STOCKS)
    .filter(([sym, s]) => sym.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    .slice(0, 6)
    .map(([symbol, data]) => ({ symbol, ...data }));
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export async function fetchNews() {
  const NEWS_KEY = process.env.REACT_APP_NEWS_API_KEY;
  if (NEWS_KEY) {
    try {
      const res = await fetch(`https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${NEWS_KEY}`);
      const data = await res.json();
      if (data.articles) return data.articles;
    } catch (e) { console.warn("News API failed, using mock data"); }
  }
  return null; // caller uses mock
}
