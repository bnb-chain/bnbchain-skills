---
name: token-flow
description: |
  Track token transfer movements on BSC from recent blocks. Shows transfer
  volume, unique senders/receivers, and flow direction for any ERC20 token.
  Use for token activity monitoring and flow analysis.
metadata:
  author: mefai
  version: "1.0"
---

# Token Flow

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Token Flow | Track ERC20 token transfer movements from recent blocks | Token activity monitoring and flow analysis |

## Use Cases

1. **Transfer Monitoring**: Track recent transfer activity for a specific token
2. **Flow Direction**: Determine net flow direction (accumulation vs distribution)
3. **Whale Transfer Detection**: Identify large transfers in recent blocks

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Token Flow

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/token-flow
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contract | string | Yes | Token contract address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/token-flow?contract=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "token": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "symbol": "CAKE",
  "blocks_scanned": 20,
  "transfers": [
    {
      "from": "0x1234...5678",
      "to": "0xabcd...ef01",
      "amount": 12500.0,
      "amount_usd": 29375.0,
      "block": 46250100,
      "tx_hash": "0xdef...",
      "from_label": "Unknown",
      "to_label": "PancakeSwap V2 Pair"
    }
  ],
  "summary": {
    "total_transfers": 145,
    "total_volume": 2850000.0,
    "total_volume_usd": 6697500.0,
    "unique_senders": 112,
    "unique_receivers": 98,
    "largest_transfer": 125000.0,
    "avg_transfer": 19655.17
  },
  "flow": {
    "to_exchanges_usd": 1200000.0,
    "from_exchanges_usd": 850000.0,
    "net_exchange_flow_usd": -350000.0,
    "direction": "NET OUTFLOW FROM EXCHANGES"
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| token | string | Token contract address |
| symbol | string | Token symbol |
| blocks_scanned | number | Number of recent blocks scanned |
| transfers | array | Recent transfer events |
| transfers[].amount | number | Transfer amount in token units |
| transfers[].amount_usd | number | Transfer value in USD |
| transfers[].from_label | string | Known label for sender |
| transfers[].to_label | string | Known label for recipient |
| summary | object | Aggregate transfer statistics |
| summary.total_transfers | number | Total number of transfers |
| summary.unique_senders | number | Unique sender addresses |
| flow | object | Net flow analysis |
| flow.net_exchange_flow_usd | number | Net flow to/from exchanges |
| flow.direction | string | Human-readable flow direction |

---

## Notes

1. Scans Transfer event logs via BSC JSON-RPC `eth_getLogs`
2. Responses are cached with 15s fresh TTL
3. No authentication required
4. Scans the most recent 20 blocks for transfer events
