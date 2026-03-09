---
name: sniper-detector
description: |
  Detect bot sniping activity on BSC tokens. Analyzes early buyers in the
  first blocks after liquidity is added, tracks hold/dump behavior, and
  assigns a snipe score. Use to identify tokens targeted by MEV bots.
metadata:
  author: mefai
  version: "1.0"
---

# Sniper Detector

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Sniper Detector | Analyze early token buyers for bot sniping patterns, hold/dump tracking, snipe scoring | Identify MEV bot activity on BSC tokens |

## Use Cases

1. **Bot Activity Detection**: Identify tokens where sniper bots dominated early trading blocks
2. **Fair Launch Verification**: Assess whether a token launch was fair or captured by bots
3. **Token Quality Signal**: High snipe scores suggest sophisticated bot targeting, which may indicate pump-and-dump schemes

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Sniper Detector

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/sniper-detector
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Token contract address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/sniper-detector?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "symbol": "CAKE",
  "snipe_score": 12,
  "early_buyers": 8,
  "total_analyzed": 50,
  "snipers": [
    {
      "address": "0x1234...abcd",
      "block_offset": 0,
      "buy_amount_bnb": 5.2,
      "still_holding": false,
      "sold_within_blocks": 15,
      "profit_pct": 340.0,
      "is_bot": true
    }
  ],
  "summary": {
    "bots_detected": 3,
    "avg_hold_blocks": 22,
    "pct_dumped_fast": 37.5,
    "first_block_buys": 5
  },
  "verdict": "LOW SNIPE ACTIVITY"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Token contract address |
| symbol | string | Token symbol |
| snipe_score | number | Snipe activity score 0-100 |
| early_buyers | number | Number of buyers in first few blocks |
| total_analyzed | number | Total transactions analyzed |
| snipers | array | Detected sniper wallet details |
| snipers[].address | string | Sniper wallet address |
| snipers[].block_offset | number | Blocks after liquidity add when buy occurred |
| snipers[].buy_amount_bnb | number | Buy size in BNB |
| snipers[].still_holding | boolean | Whether wallet still holds the token |
| snipers[].sold_within_blocks | number | Blocks until first sell (null if still holding) |
| snipers[].profit_pct | number | Estimated profit percentage |
| snipers[].is_bot | boolean | Whether wallet shows bot characteristics |
| summary | object | Aggregate snipe activity metrics |
| verdict | string | Overall assessment of snipe activity level |

---

## Notes

1. Analyzes early transaction logs via BSC JSON-RPC
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. A snipe_score above 70 indicates heavy bot activity at launch
