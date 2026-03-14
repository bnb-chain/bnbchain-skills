---
name: smart-money
description: |
  Whale transaction tracker for BSC. Identifies large-value transfers in
  real-time by monitoring recent blocks for high-value BNB and token movements.
  Use to detect whale accumulation or distribution.
metadata:
  author: mefai
  version: "1.0"
---

# Smart Money

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Smart Money | Real-time whale transaction detection — identifies large-value BNB and token transfers from recent blocks | Detect whale accumulation and distribution |

## Use Cases

1. **Whale Watching**: Monitor large-value transactions to detect whale accumulation or distribution
2. **Market Sentiment**: Gauge market direction from aggregate whale activity
3. **Early Warning**: Detect large exchange deposits that may precede selling pressure

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Smart Money

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/smart-money
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns recent whale transactions |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/smart-money'
```

**Response Example**:
```json
{
  "whale_txs": [
    {
      "hash": "0xdef456...",
      "from": "0x1234...5678",
      "to": "0xabcd...ef01",
      "value_bnb": 5200.0,
      "value_usd": 1560000.0,
      "block": 46250095,
      "age_seconds": 45,
      "type": "TRANSFER",
      "from_label": "Unknown Whale",
      "to_label": "Binance Deposit"
    }
  ],
  "summary": {
    "total_whale_txs": 15,
    "total_volume_usd": 8420000.0,
    "net_exchange_flow_usd": -2100000.0,
    "largest_tx_usd": 3200000.0,
    "blocks_scanned": 10
  },
  "trend": "NET OUTFLOW"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| whale_txs | array | List of whale transactions |
| whale_txs[].hash | string | Transaction hash |
| whale_txs[].from | string | Sender address |
| whale_txs[].to | string | Recipient address |
| whale_txs[].value_bnb | number | Transaction value in BNB |
| whale_txs[].value_usd | number | Transaction value in USD |
| whale_txs[].age_seconds | number | Seconds since transaction |
| whale_txs[].type | string | TRANSFER, SWAP, or CONTRACT_CALL |
| whale_txs[].from_label | string | Known label for sender |
| whale_txs[].to_label | string | Known label for recipient |
| summary | object | Aggregate whale activity metrics |
| summary.net_exchange_flow_usd | number | Net flow to/from exchanges (negative = outflow) |
| trend | string | NET INFLOW, NET OUTFLOW, or BALANCED |

---

## Notes

1. Scans recent blocks via BSC JSON-RPC for transactions exceeding value thresholds
2. Responses are cached with 15s fresh TTL for near-real-time data
3. No authentication required
4. Whale threshold: transactions above 100 BNB or equivalent token value
