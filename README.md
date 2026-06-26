
<p align="center">
  <img src="app/v2-help.png" alt="BBTerminal — Command Center" width="720">
</p>

<p align="center">
  <strong>BBTERMINAL</strong><br>
  A Bloomberg-grade intelligence terminal for the command line.<br>
  Real-time data. Signal-driven insights. Free.
</p>

<p align="center">
  <code>./start.sh</code> · <code>⌘+K</code> · <code>⌘+⇥</code>
</p>

<br>

---

<br>

## ˢᵗᵃʳᵗ ʰᵉʳᵉ

```bash
curl -fsSL https://raw.githubusercontent.com/vaughanf1/BB-Terminal/main/install.sh | bash
```

Installs OpenBB Platform + UI with zero config. Real-time prices via TradingView. Historical data via Yahoo Finance. No API keys required.

**Prerequisites:** macOS/Linux, Python 3.10+, Node.js 18+, ~2 GB free disk.  
**Windows:** run inside WSL (Ubuntu) or Git Bash.

---

```bash
cd ~/BB-Terminal
./start.sh     # launches API (6900) + relay (6901) + UI (5173)
./stop.sh      # shuts everything down
```

The UI opens at **`http://localhost:5173/`**. Start typing.

---

<br>

## ᵗʰᵉ ᵐᵃᶜʰⁱⁿᵉ

### Every page is real-time

A Node.js WebSocket relay (`realtime-server.cjs`) subscribes to **TradingView** via `@mathieuc/tradingview` and pushes ticks to every open tab simultaneously. Prices update in sub-second — no polling, no refresh button, no stale data.

| Layer | Stack |
|-------|-------|
| **Real-time feed** | TradingView WebSocket relay (port 6901) |
| **Historical data** | OpenBB Platform → Yahoo Finance (port 6900) |
| **UI** | Vite + React 18 + TypeScript + Tailwind |
| **Charts** | TradingView Lightweight Charts™ |
| **Signals engine** | TypeScript rules engine (`signals.ts`) |

---

### 17 function codes

| Code | What it does |
|------|--------------|
| `CC` | Command Center – 14 indices, yield curve, FX majors, BTC/ETH, gainers/losers/active, 20 headlines |
| `INTEL` | Intelligence scorecard – 12 signals → bullish/bearish verdict |
| `DES` | Company profile & description |
| `GP` | Candlestick chart, 1M–5Y with volume |
| `QR` | Live quote – bid, ask, open, high, low, 52w range |
| `HP` | Historical prices table |
| `FA` | 5-year annual income statements |
| `KEY` | 30+ valuation, growth & margin ratios |
| `DVD` | Dividend history + annual totals |
| `EE` | Analyst targets & consensus recommendation |
| `NI` | 50 company headlines |
| `OMON` | Full options chain – calls / strikes / puts |
| `WEI` | 16 world equity indices by region |
| `MOV` | Top 100 gainers / losers / most active |
| `CRYPTO` | 12 crypto prices, 24h Δ, real-time sparklines |
| `FXC` | 12 major FX pairs with sparklines |
| `CURV` | US Treasury yield curve – 11 tenors, 3 spreads |

**Syntax:** `[SYMBOL] [CODE]` — e.g., `TSLA KEY`, `NVDA` (defaults to INTEL), or standalone `WEI`.

**Keyboard:** `/` focuses the command bar · `↑/↓` history · `⇥` autocomplete · `Enter` executes.

---

<br>

## ᵃʳᶜʰⁱᵗᵉᶜᵗᵘʳᵉ

```
┌────────────────────┐       ┌──────────────────────┐       ┌────────────────────┐
│   Browser (5173)   │  WS   │  TradingView Relay   │  WS   │  TradingView       │
│  React + Tailwind  │◄─────▶│  realtime-server.cjs │◄─────▶│  @mathieuc/        │
│                    │       │  port 6901            │       │  tradingview       │
└────────────────────┘       └──────────────────────┘       └────────────────────┘
         │                                                           │
         │ HTTP /api                                                 │ sub-second ticks
         ▼                                                           ▼
┌────────────────────┐
│  OpenBB Platform   │──▶ Yahoo Finance · FRED · SEC · FMP · …
│  FastAPI · port 6900
└────────────────────┘
```

- The **TradingView relay** is a singleton Node.js WebSocket server. One TV client, one quote session, reference-counted markets. Auto-reconnects on disconnect with exponential backoff and periodic session refresh.
- The **OpenBB API** serves historical data, fundamentals, options chains, and company news. Vite proxies `/api` to port 6900.
- All RT data persists to `localStorage` — refresh the page and prices appear instantly before live data arrives.

---

<br>

## ᵗʰᵉ ˢⁱᵍⁿᵃˡˢ ᵉⁿᵍⁱⁿᵉ

INTEL doesn't just show raw numbers. It runs each ticker through 12 rules in `app/src/lib/signals.ts`:

```
TECHNICAL          VALUATION        FUNDAMENTALS
· Above 50d MA     · Fair P/E       · Revenue growth
· Above 200d MA    · Rich EV/EBITDA  · Operating margin
· 52w range %      · Fwd P/E trend   · Leverage ratio
· RSI oversold     · PEG ratio       · ROE
· Volume spike
```

Each rule produces a **bullish**, **bearish**, or **neutral** dot. The verdict badge aggregates them. Transparent, auditable, tweakable — change a threshold and every ticker re-evaluates.

---

<br>

## ᵏⁿᵒʷⁿ ˡⁱᵐⁱᵗˢ

- **Signals are heuristics** – rules of thumb, not predictions. Adjust thresholds in `signals.ts`.
- **Free-tier data** – Yahoo Finance covers 95% of use. Premium providers (FRED, TradingEconomics, Polygon) need API keys in `~/.openbb_platform/user_settings.json`.
- **Some symbols** may not resolve on TradingView (MATIC→POL, certain regional indices). Open an issue.
- **Economic calendar / world news** – require provider keys; the UI handles 401 gracefully.

---

<br>

## ˡⁱᶜᵉⁿˢᵉ

- **BBTerminal code**: yours to relicense.
- **OpenBB Platform**: AGPL-v3 (upstream).
- **Yahoo Finance data**: subject to Yahoo's terms — personal use only.

---

<p align="center">
  <sub>BBTerminal · build your own terminal · free data · real-time · open source</sub>
</p>
