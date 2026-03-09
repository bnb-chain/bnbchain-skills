---
name: pair-analytics
description: |
  Deep DEX pair analysis for BSC tokens. Aggregates data across multiple
  trading pairs for a token including volume, liquidity, price impact,
  and trading activity. Use for comprehensive pair-level market analysis.
metadata:
  author: mefai
  version: "1.0"
---

# Pair Analytics

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Pair Analytics | Deep DEX pair analysis with aggregate stats across multiple pairs | Comprehensive pair-level market intelligence |

## Use Cases

1. **Liquidity Assessment**: Evaluate liquidity depth and distribution across all pairs for a token
2. **Best Execution**: Identify the most liquid pair for trade execution
3. **Market Structure**: Understand volume distribution across DEXs and pair types

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Pair Analytics

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/pair-analytics
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Token contract address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/pair-analytics?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "symbol": "CAKE",
  "total_pairs": 12,
  "total_liquidity_usd": 42300000,
  "total_volume_24h": 28500000,
  "pairs": [
    {
      "pair_address": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      "dex": "PancakeSwap V2",
      "base_token": "CAKE",
      "quote_token": "WBNB",
      "price_usd": 2.35,
      "liquidity_usd": 18500000,
      "volume_24h": 15200000,
      "txns_24h": 12450,
      "price_change_24h": -1.2,
      "volume_share_pct": 53.3
    }
  ],
  "aggregate": {
    "avg_price_usd": 2.352,
    "max_price_usd": 2.358,
    "min_price_usd": 2.341,
    "price_spread_pct": 0.72,
    "dominant_dex": "PancakeSwap V2",
    "dominant_dex_share_pct": 53.3
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Token contract address |
| symbol | string | Token symbol |
| total_pairs | number | Number of active trading pairs |
| total_liquidity_usd | number | Aggregate liquidity across all pairs |
| total_volume_24h | number | Aggregate 24h volume across all pairs |
| pairs | array | Individual pair details |
| pairs[].dex | string | DEX name |
| pairs[].liquidity_usd | number | Pair liquidity in USD |
| pairs[].volume_24h | number | Pair 24h volume in USD |
| pairs[].volume_share_pct | number | This pair's share of total volume |
| aggregate | object | Cross-pair aggregate statistics |
| aggregate.price_spread_pct | number | Price spread across all pairs |
| aggregate.dominant_dex | string | DEX with the most volume |

---

## Notes

1. Pair data sourced from DexScreener API
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Price spread can indicate arbitrage opportunities or thin liquidity
