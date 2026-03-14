---
name: validator-map
description: |
  Live BSC validator monitoring. Tracks all 21 active validators with
  gas utilization, block production stats, and MEV detection signals.
  Use for network health monitoring and validator analysis.
metadata:
  author: mefai
  version: "1.0"
---

# Validator Map

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Validator Map | Live monitoring of 21 BSC validators: gas utilization, block production, MEV detection | Network health and validator analysis |

## Use Cases

1. **Validator Monitoring**: Track block production and gas utilization across all 21 BSC validators
2. **MEV Detection**: Identify validators with unusual transaction ordering patterns
3. **Network Decentralization**: Assess block production distribution among validators

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Validator Map

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/validator-map
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns current validator stats |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/validator-map'
```

**Response Example**:
```json
{
  "active_validators": 21,
  "current_block": 46250100,
  "validators": [
    {
      "address": "0x72b61c6014342d914470eC7aC2975bE345796c2b",
      "name": "NodeReal",
      "blocks_produced": 48,
      "blocks_share_pct": 4.76,
      "avg_gas_utilization_pct": 32.5,
      "avg_tx_count": 175,
      "last_block": 46250095,
      "mev_score": 12,
      "status": "ACTIVE"
    },
    {
      "address": "0x2465176C461AfB316ebc773C61fAee85A6515DAA",
      "name": "Binance Node 1",
      "blocks_produced": 52,
      "blocks_share_pct": 5.14,
      "avg_gas_utilization_pct": 28.1,
      "avg_tx_count": 162,
      "last_block": 46250098,
      "mev_score": 5,
      "status": "ACTIVE"
    }
  ],
  "network_stats": {
    "avg_block_time_ms": 3012,
    "avg_gas_utilization_pct": 30.8,
    "avg_txs_per_block": 168,
    "blocks_analyzed": 1008
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| active_validators | number | Number of active validators |
| current_block | number | Latest block number |
| validators | array | Validator details |
| validators[].address | string | Validator address |
| validators[].name | string | Known validator name |
| validators[].blocks_produced | number | Blocks produced in sample period |
| validators[].blocks_share_pct | number | Share of total blocks |
| validators[].avg_gas_utilization_pct | number | Average gas usage in produced blocks |
| validators[].mev_score | number | MEV activity score (0-100) |
| validators[].status | string | ACTIVE or INACTIVE |
| network_stats | object | Aggregate network statistics |
| network_stats.avg_block_time_ms | number | Average block time in milliseconds |

---

## Notes

1. Analyzes recent blocks via BSC JSON-RPC to build validator statistics
2. Responses are cached with 15s fresh TTL
3. No authentication required
4. BSC uses Proof of Staked Authority (PoSA) with 21 active validators
