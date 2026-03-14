---
name: token-battle
description: |
  Side-by-side comparison of up to 4 BSC tokens. Compares price, volume,
  liquidity, market cap, holder count, and burn metrics. Use for comparative
  token analysis and investment decisions.
metadata:
  author: mefai
  version: "1.0"
---

# Token Battle

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Token Battle | Compare up to 4 tokens side-by-side: price, volume, liquidity, burns | Comparative token analysis |

## Use Cases

1. **Investment Comparison**: Compare key metrics across competing tokens to make informed allocation decisions
2. **Sector Analysis**: Compare tokens within a sector (e.g., DEX tokens: CAKE vs BSW vs BANANA)
3. **Burn Rate Comparison**: Evaluate token burn programs across different projects

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Token Battle

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/token-battle
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tokens | string | Yes | Comma-separated token addresses (2-4 tokens) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/token-battle?tokens=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82,0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
```

**Response Example**:
```json
{
  "tokens": [
    {
      "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "symbol": "CAKE",
      "name": "PancakeSwap Token",
      "price_usd": 2.35,
      "price_change_24h": -1.2,
      "volume_24h": 28500000,
      "market_cap": 680000000,
      "liquidity_usd": 42300000,
      "fdv": 920000000,
      "total_supply": 391350000,
      "burned_pct": 12.8
    },
    {
      "address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      "symbol": "WBNB",
      "name": "Wrapped BNB",
      "price_usd": 300.50,
      "price_change_24h": 0.8,
      "volume_24h": 145000000,
      "market_cap": 46200000000,
      "liquidity_usd": 890000000,
      "fdv": 46200000000,
      "total_supply": 153856000,
      "burned_pct": 0
    }
  ],
  "winner": {
    "by_volume": "WBNB",
    "by_liquidity": "WBNB",
    "by_price_change": "WBNB",
    "by_mcap_ratio": "CAKE"
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| tokens | array | Array of token data objects |
| tokens[].symbol | string | Token symbol |
| tokens[].price_usd | number | Current price in USD |
| tokens[].price_change_24h | number | 24h price change percentage |
| tokens[].volume_24h | number | 24h trading volume in USD |
| tokens[].market_cap | number | Market capitalization in USD |
| tokens[].liquidity_usd | number | Total DEX liquidity in USD |
| tokens[].burned_pct | number | Percentage of supply burned |
| winner | object | Category winners across compared tokens |

---

## Notes

1. Token data sourced from DexScreener API
2. Responses are cached with 60s fresh TTL
3. No authentication required
4. Supports 2 to 4 tokens per comparison
