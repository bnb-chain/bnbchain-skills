---
name: dex-arb
description: |
  Cross-DEX arbitrage scanner for BSC. Finds price discrepancies across
  PancakeSwap, BiSwap, ApeSwap, and other DEXs with gas-adjusted profit
  estimates. Use to identify arbitrage opportunities.
metadata:
  author: mefai
  version: "1.0"
---

# DEX Arbitrage

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| DEX Arbitrage | Cross-DEX price comparison with gas-adjusted profit calculation | Identify arbitrage opportunities across BSC DEXs |

## Use Cases

1. **Arbitrage Detection**: Find tokens with significant price differences across DEXs
2. **Profit Estimation**: Calculate gas-adjusted profit for potential arbitrage trades
3. **Market Efficiency Monitoring**: Track how quickly price discrepancies are closed across DEXs

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: DEX Arbitrage

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/dex-arb
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | No | Token address to check (0x...). If omitted, scans top tokens. |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/dex-arb?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "opportunities": [
    {
      "token": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "symbol": "CAKE",
      "buy_dex": "BiSwap",
      "buy_price": 2.341,
      "sell_dex": "PancakeSwap V3",
      "sell_price": 2.358,
      "spread_pct": 0.73,
      "gas_cost_usd": 0.15,
      "net_profit_pct": 0.58,
      "trade_size_usd": 1000.0,
      "estimated_profit_usd": 5.80
    }
  ],
  "dexes_checked": ["PancakeSwap V2", "PancakeSwap V3", "BiSwap", "ApeSwap", "BabySwap", "MDEX"],
  "total_opportunities": 3,
  "timestamp": "2026-03-08T14:30:00Z"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| opportunities | array | List of arbitrage opportunities found |
| opportunities[].symbol | string | Token symbol |
| opportunities[].buy_dex | string | DEX with the lower price |
| opportunities[].buy_price | number | Price on the buy-side DEX |
| opportunities[].sell_dex | string | DEX with the higher price |
| opportunities[].sell_price | number | Price on the sell-side DEX |
| opportunities[].spread_pct | number | Price spread percentage |
| opportunities[].gas_cost_usd | number | Estimated gas cost in USD |
| opportunities[].net_profit_pct | number | Profit after gas costs |
| opportunities[].estimated_profit_usd | number | Estimated profit for trade_size_usd |
| dexes_checked | array | DEXs included in the scan |
| total_opportunities | number | Count of profitable opportunities |

---

## Notes

1. Prices sourced from DexScreener API across multiple BSC DEXs
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Gas costs estimated at current BSC gas prices via JSON-RPC
