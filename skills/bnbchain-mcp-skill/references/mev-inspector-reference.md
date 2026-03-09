# MEV Inspector Reference

## Overview

Detects sandwich attacks in recent BSC blocks by analyzing transaction ordering around DEX routers. Scans 15 blocks, identifies frontrun/backrun patterns, and calculates estimated profit extracted by MEV bots.

## Endpoint

`GET /mefai/mev-inspector`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Auto-refresh; no parameters needed |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `sandwichCount` | number | Total sandwich attacks detected in scanned blocks |
| `mevActivityScore` | number | Overall MEV activity score (0-100) |
| `sandwiches` | array | List of detected sandwich attacks |
| `sandwiches[].attackerTx` | string | Transaction hash of the frontrun transaction |
| `sandwiches[].victimTx` | string | Transaction hash of the victim swap |
| `sandwiches[].backrunTx` | string | Transaction hash of the backrun transaction |
| `sandwiches[].estimatedProfitBnb` | string | Estimated profit extracted in BNB |
| `sandwiches[].block` | number | Block number where the sandwich occurred |
| `latestBlock` | number | Most recent block scanned |
| `blocksScanned` | number | Number of blocks analyzed (default 15) |

## Example Response

```json
{
  "sandwichCount": 3,
  "mevActivityScore": 42,
  "sandwiches": [
    {
      "attackerTx": "0xabc123...frontrun",
      "victimTx": "0xdef456...victim",
      "backrunTx": "0x789abc...backrun",
      "estimatedProfitBnb": "0.0347",
      "block": 48120455
    },
    {
      "attackerTx": "0x112233...frontrun",
      "victimTx": "0x445566...victim",
      "backrunTx": "0x778899...backrun",
      "estimatedProfitBnb": "0.0891",
      "block": 48120452
    }
  ],
  "latestBlock": 48120460,
  "blocksScanned": 15
}
```

## Use Cases

- Monitor MEV bot activity on BSC in real time
- Identify wallets frequently targeted by sandwich attacks
- Estimate total MEV extraction across recent blocks
- Alert users when MEV activity spikes above normal levels
- Research DEX router vulnerability to frontrunning

## Notes

- Built with BSC JSON-RPC
- Real-time on-chain data
- No API key required
- Scans PancakeSwap and other major DEX router addresses for sandwich patterns
- Profit estimation is approximate, based on transaction value differentials
