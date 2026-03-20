# StockIQ — Professional Stock Market Dashboard

> Trade Smarter. Grow Faster.

A production-grade, full-featured stock market dashboard built with **React 18**, complete authentication & authorization, real-time charts, IPO tracker, portfolio analytics, and more.

---  Live Demo :-- https://manav0344.github.io/stockiq/

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Authentication

### Test Accounts
- Click **"Try Demo Account"** on the login page for instant Premium access
- Or **register** a new account — includes email OTP verification (OTP appears in browser console `F12`)

### Auth Flow
| Flow | Steps |
|------|-------|
| **Register** | Fill form → Email OTP (6-digit) → Account created |
| **Login** | Email + Password → Dashboard |
| **Forgot Password** | Enter email → OTP → New password → Done |

### Role-Based Access (RBAC)
| Feature | Retail | Premium | Admin |
|---------|--------|---------|-------|
| Dashboard & Watchlist | ✅ | ✅ | ✅ |
| Price Alerts | ✅ | ✅ | ✅ |
| Portfolio Analytics | ❌ | ✅ | ✅ |
| Advanced Charts | ❌ | ✅ | ✅ |
| Export Data | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ✅ |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Icon.jsx         # SVG icon library (30+ icons)
│   ├── Header.jsx       # Top navigation bar
│   ├── Sidebar.jsx      # Left navigation sidebar
│   ├── TickerBar.jsx    # Live market ticker strip
│   ├── StockChart.jsx   # Chart.js line chart
│   ├── StockCard.jsx    # Stock summary card
│   ├── IPOCard.jsx      # IPO listing card
│   ├── Sparkline.jsx    # Mini SVG sparkline chart
│   ├── Modal.jsx        # Reusable modal dialog
│   └── Skeleton.jsx     # Loading skeleton UI
│
├── pages/
│   ├── auth/
│   │   ├── AuthLayout.jsx    # Split-panel auth wrapper
│   │   ├── LoginPage.jsx     # Sign-in form
│   │   ├── RegisterPage.jsx  # Multi-step registration + OTP
│   │   └── ForgotPage.jsx    # Password reset flow
│   ├── DashboardPage.jsx     # Main dashboard
│   ├── WatchlistPage.jsx     # Stock watchlist
│   ├── PortfolioPage.jsx     # Portfolio tracker
│   ├── IPOPage.jsx           # IPO listings
│   ├── IPODetailPage.jsx     # IPO detail view
│   ├── NewsPage.jsx          # Market news
│   ├── StockDetailPage.jsx   # Individual stock view
│   └── SettingsPage.jsx      # User settings & RBAC view
│
├── context/
│   ├── AuthContext.js    # Authentication state & methods
│   └── AppContext.js     # App-wide state (watchlist, portfolio, etc.)
│
├── hooks/
│   ├── useDebounce.js    # Debounced search
│   ├── useStockData.js   # Stock chart data fetching
│   └── useOTP.js         # OTP input management
│
├── services/
│   ├── api.js            # API calls (Alpha Vantage / Finnhub / mock)
│   └── storage.js        # localStorage abstractions
│
├── utils/
│   ├── mockData.js       # Stock, IPO, news mock data
│   └── helpers.js        # Utility functions (password strength, formatters, RBAC)
│
├── App.jsx               # Root app component
├── index.js              # React entry point
└── index.css             # Global CSS reset
```

---

## 📊 Features

### Dashboard
- Live index ticker (NIFTY, SENSEX, S&P 500, NASDAQ, DOW, BANK NIFTY)
- Interactive price charts with 1D/1W/1M/1Y/MAX filters
- Compare mode — overlay multiple stocks on one chart
- Top Gainers & Losers with sparklines
- Market indices panel
- Watchlist preview table

### Watchlist
- Add/remove stocks with ★ button from anywhere
- Filter: All / Gainers / Losers
- Sparkline, key metrics (P/E, 52W High/Low, Mkt Cap)
- Persisted to localStorage

### Portfolio Tracker
- Add holdings (symbol, quantity, buy price, date)
- Auto-calculates: P&L, P&L %, current value
- Donut chart for allocation
- P&L trend line chart (30 days)
- Full holdings table with per-stock breakdown

### IPO Listings
- 6 mock IPOs (Upcoming, Ongoing, Listed)
- Filter by status
- Bookmark IPOs
- Detail page: financials, subscription bar, GMP tracker, listing gain
- Grey Market Premium (GMP) with disclaimer

### Market News
- 8 news items with category tags
- Filter by: Macro, Earnings, India, Auto, Regulation, Tech

### Stock Detail
- Full price header with 1-click watch / alert / add to portfolio
- Chart with compare mode and all time filters
- Key statistics grid
- Set price alerts (fires notification)

### Settings
- Edit profile (name, phone)
- Dark / Light mode toggle
- Notification preferences
- Currency selector
- Price alerts manager
- RBAC feature access table

---

## 🔧 API Integration

The app works with **mock data by default**. To use real APIs:

### Alpha Vantage (Historical Data)
1. Get free key at [alphavantage.co](https://www.alphavantage.co)
2. Add to `.env`: `REACT_APP_ALPHA_VANTAGE_KEY=your_key`

### Finnhub (Live Quotes)
1. Get free key at [finnhub.io](https://finnhub.io)
2. Add to `.env`: `REACT_APP_FINNHUB_KEY=your_key`

### News API
1. Get free key at [newsapi.org](https://newsapi.org)
2. Add to `.env`: `REACT_APP_NEWS_API_KEY=your_key`

---

## 🎨 Tech Stack

| Technology | Usage |
|-----------|-------|
| **React 18** | UI framework with Hooks |
| **Context API** | AuthContext + AppContext |
| **Chart.js 4** | Line charts, donut charts |
| **localStorage** | Session, watchlist, portfolio persistence |
| **Space Grotesk** | Dashboard typography |
| **JetBrains Mono** | Price / number display |
| **Syne + DM Sans** | Auth page typography |
| **CSS Variables** | Dark/light theming |

---

## 🔒 Security Notes

- Passwords stored as Base64 in localStorage (demo only — use bcrypt + backend in production)
- OTP sent to browser console (demo) — integrate with SendGrid/Twilio for production
- For production: use Firebase Auth, Supabase, or custom Node.js + JWT backend

---

## 🚢 Deployment

```bash
npm run build
# Deploy the /build folder to Vercel, Netlify, or any static host
```

---

## 📄 License

MIT — free for personal and commercial use.
