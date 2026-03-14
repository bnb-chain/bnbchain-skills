---
name: copy-trade
description: |
  Alpha wallet activity monitor for BSC. Tracks known high-performance
  wallets for recent token interactions, swaps, and position changes.
  Use to discover alpha by following successful traders.
metadata:
  author: mefai
  version: "1.0"
---

# Copy Trade

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Copy Trade | Monitor known alpha wallets for recent token interactions and trading activity | Discover trading opportunities by following successful wallets |

## Use Cases

1. **Alpha Discovery**: Track what tokens top-performing wallets are buying or selling
2. **Trend Detection**: Spot emerging trends by aggregating activity across multiple alpha wallets
3. **Entry Timing**: Observe wallet activity patterns to time entries on tokens of interest

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Copy Trade

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/copy-trade
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns latest activity from tracked wallets |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/copy-trade'
```

**Response Example**:
```json
{
  "tracked_wallets": 12,
  "recent_activity": [
    {
      "wallet": "0x8894...02b",
      "wallet_label": "Binance Hot Wallet",
      "action": "BUY",
      "token": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "token_symbol": "CAKE",
      "amount_usd": 125000.0,
      "amount_tokens": 48076.92,
      "tx_hash": "0xabc123...",
      "block": 46250100,
      "age_minutes": 12
    }
  ],
  "hot_tokens": [
    {
      "token": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "symbol": "CAKE",
      "wallet_count": 4,
      "net_flow_usd": 350000.0,
      "sentiment": "BULLISH"
    }
  ],
  "last_updated": "2026-03-08T14:30:00Z"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| tracked_wallets | number | Number of alpha wallets being monitored |
| recent_activity | array | Recent transactions from tracked wallets |
| recent_activity[].wallet | string | Wallet address (truncated) |
| recent_activity[].wallet_label | string | Known label for the wallet |
| recent_activity[].action | string | BUY, SELL, or TRANSFER |
| recent_activity[].token_symbol | string | Token symbol traded |
| recent_activity[].amount_usd | number | Transaction value in USD |
| recent_activity[].age_minutes | number | Minutes since transaction |
| hot_tokens | array | Tokens with activity from multiple tracked wallets |
| hot_tokens[].wallet_count | number | How many tracked wallets are active in this token |
| hot_tokens[].net_flow_usd | number | Net USD flow (positive = buying) |
| hot_tokens[].sentiment | string | Aggregate sentiment: BULLISH, BEARISH, or NEUTRAL |
| last_updated | string | ISO 8601 timestamp of last data refresh |

---

## Notes

1. Monitors known BSC wallets via JSON-RPC transaction and log queries
2. Responses are cached with 15s fresh TTL for near-real-time data
3. No authentication required
4. Tracked wallets include known whale wallets, fund wallets, and historically high-performance addresses
