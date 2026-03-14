---
name: protocol-revenue
description: |
  Real fee revenue vs TVL for BSC DeFi protocols. Ranks protocols by daily
  fees, daily revenue, and revenue-to-TVL efficiency ratio. Use to identify
  the most productive and capital-efficient protocols on BSC.
metadata:
  author: mefai
  version: "1.0"
---

# Protocol Revenue Leaderboard

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Protocol Revenue Leaderboard | Fee revenue vs TVL ranking for BSC DeFi protocols | Identify capital-efficient and revenue-generating protocols |

## Use Cases

1. **Revenue Ranking**: See which BSC protocols generate the most daily fee revenue
2. **Capital Efficiency**: Compare revenue-to-TVL ratios to find the most productive protocols
3. **Protocol Valuation**: Annualized revenue data helps assess whether protocol tokens are over/undervalued
4. **Category Analysis**: Break down revenue generation by DeFi category (DEX, lending, derivatives, etc.)

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Protocol Revenue Leaderboard

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/protocol-revenue
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns revenue data for top BSC DeFi protocols |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/protocol-revenue'
```

**Response Example**:
```json
{
  "totalDailyFees": 4250000,
  "totalDailyRevenue": 1820000,
  "protocolCount": 15,
  "protocols": [
    {
      "name": "PancakeSwap",
      "category": "DEX",
      "dailyFees": 2800000,
      "dailyRevenue": 1120000,
      "annualRevenue": 408800000,
      "tvl": 2150000000,
      "revTvlRatio": 0.19
    },
    {
      "name": "Venus",
      "category": "Lending",
      "dailyFees": 580000,
      "dailyRevenue": 290000,
      "annualRevenue": 105850000,
      "tvl": 1850000000,
      "revTvlRatio": 0.057
    },
    {
      "name": "Thena",
      "category": "DEX",
      "dailyFees": 320000,
      "dailyRevenue": 160000,
      "annualRevenue": 58400000,
      "tvl": 185000000,
      "revTvlRatio": 0.316
    },
    {
      "name": "Radiant",
      "category": "Lending",
      "dailyFees": 210000,
      "dailyRevenue": 105000,
      "annualRevenue": 38325000,
      "tvl": 420000000,
      "revTvlRatio": 0.091
    }
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| totalDailyFees | number | Sum of all protocol daily fees in USD |
| totalDailyRevenue | number | Sum of all protocol daily revenue in USD |
| protocolCount | number | Number of protocols in the leaderboard |
| protocols | array | Protocols sorted by daily revenue descending |
| protocols[].name | string | Protocol name |
| protocols[].category | string | DeFi category (DEX, Lending, Derivatives, Yield, Bridge) |
| protocols[].dailyFees | number | Total fees generated in last 24h (USD) |
| protocols[].dailyRevenue | number | Protocol revenue after LP/user share (USD) |
| protocols[].annualRevenue | number | Annualized revenue projection (USD) |
| protocols[].tvl | number | Total value locked in the protocol (USD) |
| protocols[].revTvlRatio | number | Annual revenue divided by TVL — higher means more capital-efficient |

---

## Data Sources

1. DefiLlama Fees Overview: Daily fees and revenue for BSC protocols
2. DefiLlama Protocols: TVL data for revenue-to-TVL ratio calculation

## Notes

1. Revenue = fees retained by the protocol (after LP/user share deductions)
2. revTvlRatio above 0.10 generally indicates strong capital efficiency
3. Responses are cached with 300s fresh TTL (fee data updates less frequently)
4. No authentication required
5. Annualized revenue is a simple projection (dailyRevenue x 365) and does not account for seasonal variation
