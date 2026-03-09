---
name: liquidity-pulse
description: |
  Real-time liquidity depth analysis for major BSC trading pairs. Shows
  pool sizes, liquidity changes, and concentration across DEXs.
  Use for liquidity monitoring and trading execution planning.
metadata:
  author: mefai
  version: "1.0"
---

# Liquidity Pulse

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Liquidity Pulse | Real-time liquidity depth analysis across major BSC pairs | Liquidity monitoring and execution planning |

## Use Cases

1. **Execution Planning**: Assess liquidity depth before executing large trades
2. **Liquidity Monitoring**: Track liquidity changes across major BSC pools
3. **Pool Health**: Identify pools with declining liquidity that may indicate risk

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Liquidity Pulse

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/liquidity-pulse
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns liquidity data for major BSC pairs |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/liquidity-pulse'
```

**Response Example**:
```json
{
  "pairs": [
    {
      "pair": "WBNB/USDT",
      "dex": "PancakeSwap V3",
      "liquidity_usd": 125000000,
      "volume_24h": 85000000,
      "utilization_pct": 68.0,
      "liquidity_change_24h_pct": 2.1,
      "depth_2pct_usd": 4500000,
      "price_impact_10k": 0.002,
      "price_impact_100k": 0.022,
      "price_impact_1m": 0.24,
      "status": "DEEP"
    },
    {
      "pair": "CAKE/WBNB",
      "dex": "PancakeSwap V2",
      "liquidity_usd": 18500000,
      "volume_24h": 15200000,
      "utilization_pct": 82.2,
      "liquidity_change_24h_pct": -0.8,
      "depth_2pct_usd": 850000,
      "price_impact_10k": 0.012,
      "price_impact_100k": 0.12,
      "price_impact_1m": 1.35,
      "status": "HEALTHY"
    }
  ],
  "total_liquidity_usd": 2100000000,
  "liquidity_change_24h_pct": 0.5,
  "most_liquid": "WBNB/USDT",
  "most_utilized": "CAKE/WBNB"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| pairs | array | Major trading pairs with liquidity data |
| pairs[].pair | string | Trading pair name |
| pairs[].liquidity_usd | number | Pool liquidity in USD |
| pairs[].volume_24h | number | 24h trading volume |
| pairs[].utilization_pct | number | Volume/liquidity ratio as percentage |
| pairs[].liquidity_change_24h_pct | number | Liquidity change in last 24h |
| pairs[].depth_2pct_usd | number | USD amount to move price 2% |
| pairs[].price_impact_10k | number | Price impact for $10K trade (%) |
| pairs[].price_impact_100k | number | Price impact for $100K trade (%) |
| pairs[].price_impact_1m | number | Price impact for $1M trade (%) |
| pairs[].status | string | DEEP, HEALTHY, THIN, or CRITICAL |
| total_liquidity_usd | number | Total tracked liquidity |

---

## Notes

1. Liquidity data from DexScreener API
2. Responses are cached with 60s fresh TTL
3. No authentication required
4. Price impact estimates based on constant product formula approximation
5. Status levels: DEEP (>$50M), HEALTHY (>$5M), THIN (>$500K), CRITICAL (<$500K)
