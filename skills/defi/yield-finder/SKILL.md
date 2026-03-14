---
name: yield-finder
description: |
  APY estimation engine for BSC DEX pairs. Calculates yield from trading fee
  revenue based on volume and liquidity, sorted by opportunity. Use to find
  the best yield farming opportunities on BSC DEXs.
metadata:
  author: mefai
  version: "1.0"
---

# Yield Finder

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Yield Finder | APY estimation from trading fee revenue, sorted by opportunity | Find best yield farming opportunities on BSC |

## Use Cases

1. **Yield Comparison**: Compare estimated APYs across BSC DEX pools to find the best opportunities
2. **LP Decision Making**: Evaluate whether providing liquidity to a pool is profitable
3. **Fee Revenue Analysis**: Understand how trading volume translates to LP fee income

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Yield Finder

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/yield-finder
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns yield estimates for top BSC pools |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/yield-finder'
```

**Response Example**:
```json
{
  "pools": [
    {
      "pair": "CAKE/WBNB",
      "dex": "PancakeSwap V3",
      "pair_address": "0x133B3D95bAD5405d14d53473671200e9342b...",
      "liquidity_usd": 18500000,
      "volume_24h": 15200000,
      "fee_tier": 0.25,
      "fees_24h_usd": 38000.0,
      "apy_estimate_pct": 74.9,
      "apr_estimate_pct": 56.2,
      "volume_to_liquidity": 0.82,
      "risk_level": "LOW"
    },
    {
      "pair": "USDT/BUSD",
      "dex": "PancakeSwap V3",
      "pair_address": "0x4f3126d5DE26413AbDCF6948943FB9D0847d9C15",
      "liquidity_usd": 85000000,
      "volume_24h": 42000000,
      "fee_tier": 0.01,
      "fees_24h_usd": 4200.0,
      "apy_estimate_pct": 1.8,
      "apr_estimate_pct": 1.8,
      "volume_to_liquidity": 0.49,
      "risk_level": "MINIMAL"
    }
  ],
  "total_pools_analyzed": 50,
  "avg_apy_pct": 28.5,
  "disclaimer": "APY estimates are based on 24h fee revenue extrapolated annually. Actual returns may vary due to impermanent loss, volume changes, and market conditions."
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| pools | array | Yield opportunities sorted by APY |
| pools[].pair | string | Trading pair name |
| pools[].dex | string | DEX name |
| pools[].liquidity_usd | number | Pool liquidity in USD |
| pools[].volume_24h | number | 24h trading volume |
| pools[].fee_tier | number | Fee percentage (e.g., 0.25 = 0.25%) |
| pools[].fees_24h_usd | number | Fees generated in last 24h |
| pools[].apy_estimate_pct | number | Estimated APY from fees (compounded) |
| pools[].apr_estimate_pct | number | Estimated APR from fees (simple) |
| pools[].volume_to_liquidity | number | Volume/liquidity ratio |
| pools[].risk_level | string | MINIMAL, LOW, MEDIUM, HIGH |
| total_pools_analyzed | number | Number of pools evaluated |
| disclaimer | string | Important notice about estimates |

---

## Notes

1. Fee revenue data from DexScreener API volume and fee tier information
2. Responses are cached with 60s fresh TTL
3. No authentication required
4. APY estimates do not account for impermanent loss — actual returns may be lower
