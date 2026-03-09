---
name: bsc-supremacy
description: |
  BSC vs Ethereum live comparison. Compares speed, cost, TPS, block time,
  and gas prices between BSC and Ethereum using real-time data from both
  chains. Use for cross-chain performance benchmarking.
metadata:
  author: mefai
  version: "1.0"
---

# BSC Supremacy

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| BSC Supremacy | BSC vs Ethereum comparison: speed, cost, TPS — live data | Cross-chain performance benchmarking |

## Use Cases

1. **Chain Comparison**: Compare BSC and Ethereum performance metrics in real-time
2. **Cost Analysis**: Show the cost advantage of BSC for common operations
3. **Performance Benchmarking**: Track TPS and block time differences between chains

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |
| Ethereum | 1 |

---

## API: BSC Supremacy

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/bsc-supremacy
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns live comparison data |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/bsc-supremacy'
```

**Response Example**:
```json
{
  "bsc": {
    "block_height": 46250100,
    "block_time_ms": 3008,
    "gas_price_gwei": 3.0,
    "tps": 58.4,
    "transfer_cost_usd": 0.025,
    "swap_cost_usd": 0.15,
    "consensus": "PoSA"
  },
  "ethereum": {
    "block_height": 19450000,
    "block_time_ms": 12080,
    "gas_price_gwei": 25.0,
    "tps": 15.2,
    "transfer_cost_usd": 1.85,
    "swap_cost_usd": 12.50,
    "consensus": "PoS"
  },
  "advantages": {
    "speed_multiplier": 4.01,
    "cost_ratio_transfer": 74.0,
    "cost_ratio_swap": 83.3,
    "tps_multiplier": 3.84
  },
  "summary": "BSC is 4x faster, 74x cheaper for transfers, and 3.8x higher throughput than Ethereum"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| bsc | object | BSC network metrics |
| ethereum | object | Ethereum network metrics |
| bsc.block_time_ms | number | BSC average block time |
| bsc.gas_price_gwei | number | BSC gas price |
| bsc.tps | number | BSC transactions per second |
| bsc.transfer_cost_usd | number | Cost of a simple transfer on BSC |
| bsc.swap_cost_usd | number | Cost of a DEX swap on BSC |
| advantages | object | BSC advantage ratios |
| advantages.speed_multiplier | number | How many times faster BSC is |
| advantages.cost_ratio_transfer | number | How many times cheaper BSC transfers are |
| advantages.tps_multiplier | number | BSC TPS advantage |
| summary | string | Human-readable comparison summary |

---

## Notes

1. BSC data from BSC JSON-RPC, Ethereum data from public Ethereum RPC
2. Responses are cached with 15s fresh TTL
3. No authentication required
4. Cost estimates based on current gas prices and standard gas usage for each operation
