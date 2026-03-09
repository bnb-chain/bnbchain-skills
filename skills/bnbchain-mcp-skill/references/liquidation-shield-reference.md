# Liquidation Shield — Cascade Risk Heatmap

Real-time cascade liquidation risk scanner that combines technical analysis from TradingView Screener with on-chain data to identify tokens at highest risk of liquidation cascades.

---

## How it works

1. **TradingView Screener scan** — Queries top 30 crypto tokens by volume, pulling RSI, Bollinger Bands, ADX, Stochastic, volatility, and recommendation data
2. **4-Factor Cascade Risk Model** — Each token scored 0–100:
   - **RSI Risk (0–25)**: Extreme RSI (<25 or >75) signals crowded positioning
   - **BB Risk (0–25)**: Wide Bollinger Band width indicates price expansion/squeeze risk
   - **Volatility + Trend Risk (0–25)**: High volatility combined with strong trend (ADX) amplifies cascade potential
   - **MA Extension Risk (0–25)**: Distance from moving averages measures overextension
3. **Risk classification**: CRITICAL (≥70), HIGH (≥55), ELEVATED (≥40), LOW (<40)
4. **Cascade bias detection**: SHORT CASCADE (RSI >75), LONG CASCADE (RSI <25), BOTH SIDES (high volatility + strong trend)

---

## API

| Endpoint | Method | Parameters | TTL |
|----------|--------|------------|-----|
| `/mefai/liquidation-shield` | GET | (none) | 15s |

### Response fields

| Field | Type | Description |
|-------|------|-------------|
| `totalScanned` | int | Number of tokens analyzed |
| `criticalCount` | int | Tokens with CRITICAL risk |
| `highRiskCount` | int | Tokens with HIGH or above risk |
| `marketRisk` | string | Overall market risk assessment |
| `tokens[]` | array | Sorted by cascadeScore descending |
| `tokens[].cascadeScore` | int | 0–100 composite risk score |
| `tokens[].riskLevel` | string | CRITICAL / HIGH / ELEVATED / LOW |
| `tokens[].bias` | string | SHORT CASCADE / LONG CASCADE / BOTH SIDES / NEUTRAL |
| `tokens[].breakdown` | object | Individual factor scores |
| `tokens[].signals` | array | Human-readable risk signals |

---

## Data sources

- **TradingView Screener** (via `tradingview_screener` Python library): RSI, BB width, ADX, Stochastic K, volatility, recommendation score, 24h change
- **BSC JSON-RPC**: Block height for timestamp reference

---

## Frontend panel

- Auto-refreshes every 15 seconds
- Color-coded heatmap grid: red (CRITICAL), orange (HIGH), yellow (ELEVATED), green (LOW)
- Risk factor breakdown bars for each token
- Market-wide risk summary header
