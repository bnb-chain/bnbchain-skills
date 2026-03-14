---
name: honeypot-check
description: |
  Combined honeypot detection for BSC tokens. Analyzes bytecode for dangerous
  selectors, checks buy/sell ratio, owner concentration, and proxy patterns.
  Use when evaluating whether a token contract may be a honeypot or scam.
metadata:
  author: mefai
  version: "1.0"
---

# Honeypot Check

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Honeypot Check | Multi-signal honeypot detection combining bytecode analysis, trading ratio, holder concentration, and dangerous function selectors | Evaluate token safety before trading |

## Use Cases

1. **Pre-Trade Safety Check**: Before buying a token, verify it is not a honeypot by checking for sell-blocking bytecode patterns and dangerous function selectors
2. **Token Audit**: Assess a token's risk profile by analyzing owner concentration, buy/sell ratios, and proxy contract patterns
3. **Portfolio Risk Review**: Scan tokens in a portfolio for honeypot characteristics that may indicate emerging rug-pull risk

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Honeypot Check

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/honeypot-check
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Token contract address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/honeypot-check?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "is_honeypot": false,
  "honeypot_score": 8,
  "checks": {
    "has_dangerous_selectors": false,
    "has_proxy": false,
    "has_mint": true,
    "has_pause": false,
    "has_blacklist": false,
    "buy_sell_ratio": 0.97,
    "top_holder_pct": 12.4,
    "owner_is_renounced": false
  },
  "dangerous_selectors": [],
  "verdict": "LOW RISK",
  "details": "No honeypot indicators detected. Token has mint function but no pause or blacklist."
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Token contract address analyzed |
| is_honeypot | boolean | Whether the token is flagged as a honeypot |
| honeypot_score | number | Risk score 0-100 (higher = more dangerous) |
| checks | object | Individual check results |
| checks.has_dangerous_selectors | boolean | Whether bytecode contains known honeypot selectors |
| checks.has_proxy | boolean | Whether contract is a proxy (upgradeable) |
| checks.has_mint | boolean | Whether contract has a mint function |
| checks.has_pause | boolean | Whether contract has a pause function |
| checks.has_blacklist | boolean | Whether contract has blacklist functionality |
| checks.buy_sell_ratio | number | Ratio of buy to sell transactions (near 1.0 is healthy) |
| checks.top_holder_pct | number | Percentage held by the largest holder |
| checks.owner_is_renounced | boolean | Whether contract ownership is renounced |
| dangerous_selectors | array | List of dangerous function selectors found in bytecode |
| verdict | string | Human-readable risk verdict |
| details | string | Detailed explanation of findings |

---

## Notes

1. All data is sourced from BSC JSON-RPC bytecode analysis and DexScreener APIs
2. Responses are cached with stale-while-revalidate pattern (30s fresh TTL)
3. No authentication required
4. A honeypot_score above 60 warrants extreme caution
