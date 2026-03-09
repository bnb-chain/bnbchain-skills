# Alpha Convergence — Multi-Source Signal Scanner

Real-time signal convergence engine that merges multiple independent data sources (TradingView technical analysis + DexScreener DEX activity) to find tokens where multiple indicators align simultaneously.

---

## How it works

1. **Parallel multi-source scan** — Three independent TradingView queries run concurrently:
   - **Volume Breakouts**: Tokens with >2x average volume + positive change + RSI 40–75
   - **Oversold Bounce**: RSI <35 + Stochastic K <20 + positive recommendation
   - **Strong Momentum**: ADX >35 + positive recommendation + meaningful volume
2. **DexScreener BSC integration** — Pulls real-time DEX trading data (volume, liquidity, price changes) for BSC tokens
3. **Convergence scoring** (0–100):
   - 25 points per confirming source (max 4 sources)
   - +10 bonus for strong ADX (>40)
   - +5 bonus for high recommendation score (>0.3)
4. **Signal classification**:
   - BREAKOUT: Volume breakout + momentum confirmed
   - REVERSAL: Oversold bounce detected
   - MOMENTUM: Single strong momentum signal
   - TREND: Strong directional trend

---

## API

| Endpoint | Method | Parameters | TTL |
|----------|--------|------------|-----|
| `/mefai/alpha-convergence` | GET | (none) | 15s |

### Response fields

| Field | Type | Description |
|-------|------|-------------|
| `totalSignals` | int | Total signals detected |
| `highConvergence` | int | Signals with score ≥60 |
| `breakoutCount` | int | BREAKOUT type signals |
| `sourceStats` | object | Count per source type |
| `signals[]` | array | Sorted by convergenceScore descending |
| `signals[].convergenceScore` | int | 0–100 multi-source agreement |
| `signals[].sourceCount` | int | Number of confirming sources |
| `signals[].sources` | array | List of source names |
| `signals[].signalType` | string | BREAKOUT / REVERSAL / MOMENTUM / TREND |
| `signals[].confidence` | string | High (≥60) / Medium (≥30) / Low |
| `signals[].dexVolume` | number | DEX trading volume (if available) |
| `signals[].dexLiquidity` | number | DEX liquidity depth (if available) |

---

## Data sources

- **TradingView Screener** (3 parallel queries): RSI, ADX, Stochastic K, volume, recommendation, 24h change
- **DexScreener API**: BSC DEX pairs volume, liquidity, price changes
- **BSC JSON-RPC**: Block height for timestamp reference

---

## Frontend panel

- Auto-refreshes every 20 seconds
- Signal cards with source pills (color-coded by source type)
- Convergence score progress bars
- Signal type badges (BREAKOUT, REVERSAL, MOMENTUM, TREND)
- Summary header with source distribution stats
