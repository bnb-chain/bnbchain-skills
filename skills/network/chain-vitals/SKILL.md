---
name: chain-vitals
description: |
  Core BSC network health metrics. Shows block height, gas price, peer count,
  sync status, and chain ID. Use as a quick network health check.
metadata:
  author: mefai
  version: "1.0"
---

# Chain Vitals

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Chain Vitals | Core network health: block height, gas price, peer count | Quick BSC network health check |

## Use Cases

1. **Health Check**: Quick verification that BSC network is operational and responsive
2. **Status Dashboard**: Core metrics for network monitoring dashboards
3. **Sync Verification**: Confirm that the RPC node is fully synced

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Chain Vitals

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/chain-vitals
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns current chain vitals |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/chain-vitals'
```

**Response Example**:
```json
{
  "chain_id": 56,
  "chain_name": "BNB Smart Chain",
  "block_height": 46250100,
  "gas_price_gwei": 3.0,
  "peer_count": 42,
  "is_syncing": false,
  "latest_block_time": "2026-03-08T14:28:45Z",
  "block_age_seconds": 2,
  "consensus": "PoSA",
  "validators": 21,
  "status": "HEALTHY"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| chain_id | number | BSC chain ID (56) |
| chain_name | string | Chain name |
| block_height | number | Latest block number |
| gas_price_gwei | number | Current gas price in Gwei |
| peer_count | number | Number of connected peers |
| is_syncing | boolean | Whether the node is syncing |
| latest_block_time | string | Timestamp of the latest block |
| block_age_seconds | number | Seconds since the latest block |
| consensus | string | Consensus mechanism (PoSA) |
| validators | number | Number of active validators |
| status | string | HEALTHY, DEGRADED, or DOWN |

---

## Notes

1. Combines multiple BSC JSON-RPC calls: `eth_blockNumber`, `eth_gasPrice`, `net_peerCount`, `eth_syncing`
2. Responses are cached with 10s fresh TTL
3. No authentication required
4. Status is DEGRADED if block age exceeds 10 seconds, DOWN if over 60 seconds
