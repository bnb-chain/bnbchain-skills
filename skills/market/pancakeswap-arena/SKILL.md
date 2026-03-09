---
name: pancakeswap-arena
description: |
  PancakeSwap market overview for BSC. Shows top trading pairs, volume
  leaders, and trending tokens on PancakeSwap V2 and V3. Use for
  PancakeSwap-specific market intelligence.
metadata:
  author: mefai
  version: "1.0"
---

# PancakeSwap Arena

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| PancakeSwap Arena | Top pairs, volume leaders, trending tokens on PancakeSwap | PancakeSwap-specific market intelligence |

## Use Cases

1. **Market Overview**: See the most active trading pairs on PancakeSwap
2. **Trend Discovery**: Identify trending tokens with surging volume
3. **Liquidity Monitoring**: Track top liquidity pools and their performance

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: PancakeSwap Arena

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/pancakeswap-arena
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns current PancakeSwap market data |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/pancakeswap-arena'
```

**Response Example**:
```json
{
  "top_pairs": [
    {
      "pair": "CAKE/WBNB",
      "pair_address": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      "dex": "PancakeSwap V2",
      "price_usd": 2.35,
      "volume_24h": 15200000,
      "liquidity_usd": 18500000,
      "txns_24h": 12450,
      "price_change_24h": -1.2
    }
  ],
  "trending": [
    {
      "symbol": "NEWTOKEN",
      "address": "0xabc...",
      "price_usd": 0.0042,
      "volume_24h": 850000,
      "volume_change_pct": 420.0,
      "price_change_24h": 85.3,
      "age_hours": 6
    }
  ],
  "stats": {
    "total_pairs": 3250,
    "total_volume_24h": 425000000,
    "total_liquidity": 1800000000,
    "active_pairs_24h": 1840
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| top_pairs | array | Top trading pairs by volume |
| top_pairs[].pair | string | Trading pair name |
| top_pairs[].volume_24h | number | 24h trading volume in USD |
| top_pairs[].liquidity_usd | number | Pool liquidity in USD |
| trending | array | Tokens with rapidly increasing volume |
| trending[].volume_change_pct | number | Volume change vs previous 24h |
| trending[].age_hours | number | Hours since pair was created |
| stats | object | Aggregate PancakeSwap statistics |
| stats.total_pairs | number | Total number of trading pairs |
| stats.total_volume_24h | number | Total 24h volume across PancakeSwap |

---

## Notes

1. Data sourced from DexScreener API filtered for PancakeSwap pairs
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Includes both PancakeSwap V2 and V3 pairs
