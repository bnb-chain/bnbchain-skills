---
name: network-pulse
description: |
  Network congestion gauge for BSC. Calculates a pressure score based on
  gas utilization, TPS, block timing, and pending transaction count.
  Use for gas optimization and network health monitoring.
metadata:
  author: mefai
  version: "1.0"
---

# Network Pulse

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Network Pulse | Congestion gauge: pressure score, TPS, block timing, gas optimization | Network health monitoring and gas optimization |

## Use Cases

1. **Gas Optimization**: Monitor network pressure to time transactions when gas is cheapest
2. **Network Health**: Track BSC health metrics including TPS, block timing, and congestion
3. **Alert Trigger**: Use pressure score to trigger alerts when network congestion is high

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Network Pulse

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/network-pulse
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns current network metrics |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/network-pulse'
```

**Response Example**:
```json
{
  "pressure_score": 35,
  "pressure_level": "MODERATE",
  "block_height": 46250100,
  "gas_price_gwei": 3.0,
  "tps": 58.4,
  "avg_block_time_ms": 3008,
  "target_block_time_ms": 3000,
  "block_time_deviation_pct": 0.27,
  "gas_utilization_pct": 30.4,
  "recent_blocks": {
    "count": 20,
    "min_txs": 120,
    "max_txs": 245,
    "avg_txs": 168,
    "empty_blocks": 0
  },
  "recommendation": "Network load is moderate. Standard gas price sufficient for timely inclusion.",
  "optimal_gas_gwei": 3.0,
  "peer_count": 42
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| pressure_score | number | Network congestion score 0-100 |
| pressure_level | string | LOW, MODERATE, HIGH, or CRITICAL |
| block_height | number | Current block height |
| gas_price_gwei | number | Current gas price in Gwei |
| tps | number | Transactions per second |
| avg_block_time_ms | number | Average block time in milliseconds |
| target_block_time_ms | number | Target block time (3000ms for BSC) |
| block_time_deviation_pct | number | How far block time deviates from target |
| gas_utilization_pct | number | Percentage of gas limit being used |
| recent_blocks | object | Statistics from recent block analysis |
| recommendation | string | Gas optimization advice |
| optimal_gas_gwei | number | Recommended gas price |
| peer_count | number | Number of connected peers |

---

## Notes

1. Aggregates multiple BSC JSON-RPC calls for comprehensive network view
2. Responses are cached with 10s fresh TTL for near-real-time data
3. No authentication required
4. Pressure levels: LOW (0-25), MODERATE (26-50), HIGH (51-75), CRITICAL (76-100)
