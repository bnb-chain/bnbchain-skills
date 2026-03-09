---
name: burn-tracker
description: |
  Real-time BNB and token burn tracking on BSC. Monitors the dead address
  for incoming transfers and calculates USD valuations of burned tokens.
  Use for deflationary token analysis.
metadata:
  author: mefai
  version: "1.0"
---

# Burn Engine

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Burn Tracker | Real-time BNB and token burn tracking with USD valuations | Deflationary token analysis |

## Use Cases

1. **Burn Verification**: Verify that a project is actually burning tokens as claimed
2. **Deflation Rate**: Calculate the deflation rate of a token based on burn history
3. **Value Destruction**: Track total USD value destroyed through token burns

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Burn Tracker

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/burn-tracker
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns current burn statistics |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/burn-tracker'
```

**Response Example**:
```json
{
  "dead_address": "0x000000000000000000000000000000000000dEaD",
  "bnb_burned": 124500.32,
  "bnb_burned_usd": 37350096.0,
  "tokens": [
    {
      "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "symbol": "CAKE",
      "burned": 45200000,
      "burned_usd": 106220000,
      "pct_of_supply": 11.55,
      "last_burn_block": 46249800
    },
    {
      "address": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      "symbol": "BUSD",
      "burned": 8500000,
      "burned_usd": 8500000,
      "pct_of_supply": 0.05,
      "last_burn_block": 46248200
    }
  ],
  "total_burned_usd": 152070096,
  "recent_burns": [
    {
      "token_symbol": "CAKE",
      "amount": 50000,
      "amount_usd": 117500,
      "block": 46249800,
      "tx_hash": "0x123..."
    }
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| dead_address | string | The burn address monitored |
| bnb_burned | number | Total BNB sent to dead address |
| bnb_burned_usd | number | USD value of burned BNB |
| tokens | array | Top burned tokens with details |
| tokens[].symbol | string | Token symbol |
| tokens[].burned | number | Amount of tokens burned |
| tokens[].burned_usd | number | USD value of burned tokens |
| tokens[].pct_of_supply | number | Burned tokens as percentage of total supply |
| total_burned_usd | number | Total USD value of all burns |
| recent_burns | array | Most recent burn transactions |

---

## Notes

1. Monitors the standard dead address (0x...dEaD) via BSC JSON-RPC balance queries
2. Responses are cached with 120s fresh TTL
3. No authentication required
4. USD valuations use current token prices from DexScreener
