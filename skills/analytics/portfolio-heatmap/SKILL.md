---
name: portfolio-heatmap
description: |
  Bloomberg-style portfolio heatmap for BSC wallets. Displays token holdings
  with 24h performance coloring, allocation weights, and gain/loss metrics.
  Use for visual portfolio performance analysis.
metadata:
  author: mefai
  version: "1.0"
---

# Portfolio Heatmap

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Portfolio Heatmap | Bloomberg-style portfolio view with 24h performance heatmap | Visual portfolio performance analysis |

## Use Cases

1. **Performance Overview**: Quickly see which holdings are gaining or losing in the last 24 hours
2. **Allocation Analysis**: Visualize portfolio concentration and diversification
3. **Risk Assessment**: Identify overweight positions in volatile tokens

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Portfolio Heatmap

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/portfolio-heatmap
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Wallet address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/portfolio-heatmap?address=0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b'
```

**Response Example**:
```json
{
  "address": "0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b",
  "total_value_usd": 106904150.0,
  "pnl_24h_usd": 1250000.0,
  "pnl_24h_pct": 1.18,
  "holdings": [
    {
      "symbol": "USDT",
      "value_usd": 45000000.0,
      "weight_pct": 42.1,
      "change_24h_pct": 0.01,
      "pnl_24h_usd": 4500.0,
      "heat": "NEUTRAL"
    },
    {
      "symbol": "BNB",
      "value_usd": 37629150.0,
      "weight_pct": 35.2,
      "change_24h_pct": 2.1,
      "pnl_24h_usd": 790212.0,
      "heat": "HOT"
    },
    {
      "symbol": "CAKE",
      "value_usd": 5875000.0,
      "weight_pct": 5.5,
      "change_24h_pct": -1.2,
      "pnl_24h_usd": -70500.0,
      "heat": "COLD"
    }
  ],
  "best_performer": {"symbol": "BNB", "change_pct": 2.1},
  "worst_performer": {"symbol": "CAKE", "change_pct": -1.2}
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Wallet address |
| total_value_usd | number | Total portfolio value |
| pnl_24h_usd | number | Portfolio P&L in last 24 hours |
| pnl_24h_pct | number | Portfolio P&L percentage |
| holdings | array | Token holdings with heatmap data |
| holdings[].symbol | string | Token symbol |
| holdings[].value_usd | number | Current holding value |
| holdings[].weight_pct | number | Percentage of total portfolio |
| holdings[].change_24h_pct | number | 24h price change |
| holdings[].pnl_24h_usd | number | 24h P&L in USD |
| holdings[].heat | string | Heatmap classification: HOT, WARM, NEUTRAL, COOL, COLD |
| best_performer | object | Best performing token in 24h |
| worst_performer | object | Worst performing token in 24h |

---

## Notes

1. Combines wallet balances from JSON-RPC with DexScreener price data
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Heat levels: HOT (>5%), WARM (>2%), NEUTRAL (-2% to 2%), COOL (<-2%), COLD (<-5%)
