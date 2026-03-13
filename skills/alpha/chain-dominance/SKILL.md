---
name: chain-dominance
description: |
  Composite BSC dominance score vs other L1/L2 chains. Weighs TVL (40%),
  DEX volume (30%), fees (20%), and cost efficiency (10%) to produce a
  0-100 score. Use to benchmark BSC's competitive position in the
  multi-chain landscape.
metadata:
  author: mefai
  version: "1.0"
---

# Chain Dominance Index

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Chain Dominance Index | Composite BSC score vs other L1/L2 chains weighted by TVL, volume, fees, and efficiency | Benchmark BSC's competitive position across chains |

## Use Cases

1. **BSC Positioning**: Understand where BSC ranks among competing L1/L2 chains
2. **Capital Rotation Signals**: Rising dominance score signals capital inflow; falling score may indicate rotation to other chains
3. **Multi-Chain Comparison**: Compare TVL, DEX volume, and fee generation across Ethereum, BSC, Arbitrum, Solana, and more
4. **Ecosystem Health**: Track whether BSC is gaining or losing market share over time

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Chain Dominance Index

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/chain-dominance
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns BSC dominance score and multi-chain comparison |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/chain-dominance'
```

**Response Example**:
```json
{
  "dominanceScore": 72,
  "bscRank": 3,
  "bscTvl": 5800000000,
  "bscDominance": 5.2,
  "bscDailyFees": 4250000,
  "bscDexVolume": 850000000,
  "chains": [
    {
      "chain": "Ethereum",
      "symbol": "ETH",
      "tvl": 62000000000,
      "dominance": 55.8,
      "dailyFees": 18500000,
      "dexVolume": 3200000000
    },
    {
      "chain": "BSC",
      "symbol": "BNB",
      "tvl": 5800000000,
      "dominance": 5.2,
      "dailyFees": 4250000,
      "dexVolume": 850000000
    },
    {
      "chain": "Arbitrum",
      "symbol": "ARB",
      "tvl": 4200000000,
      "dominance": 3.8,
      "dailyFees": 1800000,
      "dexVolume": 620000000
    },
    {
      "chain": "Solana",
      "symbol": "SOL",
      "tvl": 8500000000,
      "dominance": 7.6,
      "dailyFees": 5200000,
      "dexVolume": 2100000000
    }
  ],
  "scoreBreakdown": {
    "tvlScore": 28.8,
    "dexVolumeScore": 21.6,
    "feesScore": 14.4,
    "costEfficiencyScore": 7.2
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| dominanceScore | number | Composite BSC score (0-100) |
| bscRank | number | BSC rank among all chains by composite score |
| bscTvl | number | BSC total value locked (USD) |
| bscDominance | number | BSC TVL as percentage of total DeFi TVL |
| bscDailyFees | number | BSC total daily fees (USD) |
| bscDexVolume | number | BSC total 24h DEX volume (USD) |
| chains | array | Top chains sorted by TVL |
| chains[].chain | string | Chain name |
| chains[].symbol | string | Native token symbol |
| chains[].tvl | number | Chain TVL (USD) |
| chains[].dominance | number | TVL market share percentage |
| chains[].dailyFees | number | 24h fee revenue (USD) |
| chains[].dexVolume | number | 24h DEX trading volume (USD) |
| scoreBreakdown | object | Component scores that sum to dominanceScore |
| scoreBreakdown.tvlScore | number | TVL component (max 40 points) |
| scoreBreakdown.dexVolumeScore | number | DEX volume component (max 30 points) |
| scoreBreakdown.feesScore | number | Fees component (max 20 points) |
| scoreBreakdown.costEfficiencyScore | number | Cost efficiency component (max 10 points) |

---

## Scoring Methodology

| Component | Weight | Source | Calculation |
|-----------|--------|--------|-------------|
| TVL | 40% | DefiLlama chains | BSC TVL rank percentile among top 20 chains |
| DEX Volume | 30% | DefiLlama DEX volumes | BSC DEX volume rank percentile |
| Fees | 20% | DefiLlama fees overview | BSC fee generation rank percentile |
| Cost Efficiency | 10% | BSC RPC block data | Inverse of avg gas cost relative to peers |

## Data Sources

1. DefiLlama Chains: TVL data for all L1/L2 chains
2. DefiLlama Fees Overview: Daily fee generation per chain
3. DefiLlama DEX Volumes: 24h DEX trading volume per chain
4. BSC RPC: Block height and gas price for cost efficiency calculation

## Notes

1. Dominance score is relative — it measures BSC's position vs the top 20 chains
2. Responses are cached with 300s fresh TTL
3. No authentication required
4. Score of 50 means average among tracked chains; above 70 is strong positioning
