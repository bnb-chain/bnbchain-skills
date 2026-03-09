---
name: block-autopsy
description: |
  Block-level analysis for BSC. Breaks down gas distribution, transaction
  types, top gas consumers, and validator information for any block.
  Use for network analysis and MEV research.
metadata:
  author: mefai
  version: "1.0"
---

# Block Autopsy

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Block Autopsy | Gas distribution, transaction type breakdown, top gas consumers per block | Network analysis and MEV research |

## Use Cases

1. **Gas Analysis**: Understand gas distribution within a block to identify congestion patterns
2. **MEV Detection**: Identify sandwiching or front-running patterns by analyzing transaction ordering
3. **Validator Analysis**: Track which validators produce blocks and their gas utilization

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Block Autopsy

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/block-autopsy
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| number | string | No | Block number (decimal). Defaults to latest block. |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/block-autopsy?number=46250100'
```

**Response Example**:
```json
{
  "block_number": 46250100,
  "timestamp": "2026-03-08T14:28:45Z",
  "validator": "0x72b61c6014342d914470eC7aC2975bE345796c2b",
  "validator_name": "NodeReal",
  "tx_count": 185,
  "gas_used": 42500000,
  "gas_limit": 140000000,
  "gas_utilization_pct": 30.4,
  "tx_types": {
    "transfers": 45,
    "swaps": 78,
    "contract_creation": 2,
    "other": 60
  },
  "top_gas_consumers": [
    {
      "address": "0x10ED43C718714eb63d5aA57B78B54917c3e6fE49",
      "label": "PancakeSwap V2 Router",
      "gas_used": 8500000,
      "gas_share_pct": 20.0,
      "tx_count": 42
    }
  ],
  "gas_price_stats": {
    "min_gwei": 1.0,
    "max_gwei": 10.0,
    "avg_gwei": 3.0,
    "median_gwei": 3.0
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| block_number | number | Block number analyzed |
| timestamp | string | Block timestamp |
| validator | string | Validator (miner) address |
| validator_name | string | Known validator name |
| tx_count | number | Number of transactions in the block |
| gas_used | number | Total gas consumed |
| gas_limit | number | Block gas limit |
| gas_utilization_pct | number | Percentage of gas limit used |
| tx_types | object | Transaction type breakdown |
| top_gas_consumers | array | Contracts consuming the most gas |
| gas_price_stats | object | Gas price statistics across transactions |

---

## Notes

1. Fetches full block data via BSC JSON-RPC `eth_getBlockByNumber` with transaction details
2. Responses are cached with 15s fresh TTL
3. No authentication required
4. Defaults to the latest block if no number is specified
