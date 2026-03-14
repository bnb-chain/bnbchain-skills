---
name: token-birth
description: |
  Token genesis analysis for BSC. Examines token creation details including
  creator wallet profile, initial supply distribution, contract age,
  and early liquidity history. Use to evaluate a token's origins.
metadata:
  author: mefai
  version: "1.0"
---

# Token Birth

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Token Birth | Token genesis analysis: creator profile, supply distribution, age, liquidity history | Evaluate token origins and creator credibility |

## Use Cases

1. **Creator Due Diligence**: Analyze the creator wallet's history and other token deployments
2. **Supply Distribution Review**: Check initial token distribution to assess centralization risk
3. **Liquidity Timeline**: Understand when and how liquidity was added and whether it is locked

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Token Birth

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/token-birth
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Token contract address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/token-birth?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "symbol": "CAKE",
  "name": "PancakeSwap Token",
  "creator": "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
  "creation_block": 628285,
  "creation_date": "2020-09-25T09:22:12Z",
  "age_days": 1990,
  "initial_supply": 15000000,
  "current_supply": 391350000,
  "supply_growth_pct": 2509.0,
  "creator_profile": {
    "contracts_deployed": 24,
    "bnb_balance": 0.0,
    "is_contract": true,
    "label": "PancakeSwap: MasterChef"
  },
  "initial_distribution": {
    "creator_pct": 100.0,
    "top_5_holders_pct": 100.0
  },
  "first_liquidity": {
    "dex": "PancakeSwap V1",
    "pair": "CAKE/BNB",
    "block": 628350,
    "initial_liquidity_usd": 50000
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Token contract address |
| symbol | string | Token symbol |
| creator | string | Creator wallet address |
| creation_block | number | Block number of contract deployment |
| creation_date | string | ISO 8601 deployment timestamp |
| age_days | number | Days since deployment |
| initial_supply | number | Initial token supply |
| current_supply | number | Current token supply |
| supply_growth_pct | number | Supply growth percentage since creation |
| creator_profile | object | Creator wallet analysis |
| initial_distribution | object | Initial supply distribution metrics |
| first_liquidity | object | First liquidity addition details |

---

## Notes

1. Combines BSC JSON-RPC contract history with DexScreener data
2. Responses are cached with 60s fresh TTL
3. No authentication required
4. Creator profile includes number of contracts deployed and current balance
