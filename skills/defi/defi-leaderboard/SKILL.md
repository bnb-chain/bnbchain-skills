---
name: defi-leaderboard
description: |
  Top DeFi protocols on BSC ranked by TVL, volume, and user activity.
  Provides a comprehensive overview of the BSC DeFi ecosystem.
  Use for protocol comparison and ecosystem analysis.
metadata:
  author: mefai
  version: "1.0"
---

# DeFi Leaderboard

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| DeFi Leaderboard | Top DeFi protocols ranked by TVL, volume, and user count | BSC DeFi ecosystem overview |

## Use Cases

1. **Ecosystem Overview**: See the top DeFi protocols on BSC ranked by key metrics
2. **Protocol Comparison**: Compare TVL, volume, and user activity across BSC DeFi protocols
3. **Trend Tracking**: Monitor changes in protocol rankings over time

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: DeFi Leaderboard

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/defi-leaderboard
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns current DeFi rankings |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/defi-leaderboard'
```

**Response Example**:
```json
{
  "protocols": [
    {
      "rank": 1,
      "name": "PancakeSwap",
      "category": "DEX",
      "tvl_usd": 1800000000,
      "volume_24h": 425000000,
      "users_24h": 185000,
      "tvl_change_24h_pct": 1.2,
      "token": "CAKE",
      "token_price": 2.35
    },
    {
      "rank": 2,
      "name": "Venus",
      "category": "Lending",
      "tvl_usd": 950000000,
      "volume_24h": 52000000,
      "users_24h": 12000,
      "tvl_change_24h_pct": -0.5,
      "token": "XVS",
      "token_price": 8.42
    },
    {
      "rank": 3,
      "name": "Alpaca Finance",
      "category": "Yield",
      "tvl_usd": 420000000,
      "volume_24h": 18000000,
      "users_24h": 8500,
      "tvl_change_24h_pct": 0.8,
      "token": "ALPACA",
      "token_price": 0.21
    }
  ],
  "total_bsc_tvl": 5200000000,
  "total_protocols": 85,
  "categories": {
    "DEX": 12,
    "Lending": 8,
    "Yield": 15,
    "Bridge": 5,
    "Other": 45
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| protocols | array | DeFi protocols sorted by TVL |
| protocols[].rank | number | Current ranking position |
| protocols[].name | string | Protocol name |
| protocols[].category | string | Protocol category (DEX, Lending, Yield, etc.) |
| protocols[].tvl_usd | number | Total value locked in USD |
| protocols[].volume_24h | number | 24h trading/lending volume |
| protocols[].users_24h | number | Unique users in last 24h |
| protocols[].tvl_change_24h_pct | number | TVL change in last 24h |
| total_bsc_tvl | number | Total BSC ecosystem TVL |
| total_protocols | number | Number of protocols tracked |
| categories | object | Protocol count by category |

---

## Notes

1. Protocol data aggregated from DexScreener and on-chain queries
2. Responses are cached with 60s fresh TTL
3. No authentication required
4. TVL figures represent total value deposited in smart contracts
