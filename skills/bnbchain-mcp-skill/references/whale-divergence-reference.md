# Whale Divergence Index Reference

## Overview

Compares whale (>=10 BNB) vs retail (<1 BNB) DEX trading behavior on BSC. Scans 200 blocks, classifies swap transactions by size, calculates net flow direction and divergence score. A high divergence score indicates whales and retail are moving in opposite directions — a historically significant signal.

## Endpoint

`GET /mefai/whale-divergence`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Auto-refresh; no parameters needed |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `divergenceScore` | number | Divergence between whale and retail behavior (0-100) |
| `signal` | string | Interpreted signal: WHALE ACCUMULATION, WHALE DISTRIBUTION, ALIGNED, or NEUTRAL |
| `signalStrength` | string | Signal strength rating (WEAK, MODERATE, STRONG) |
| `whale` | object | Whale tier stats (>=10 BNB swaps) |
| `whale.buyCount` | number | Number of whale buy transactions |
| `whale.sellCount` | number | Number of whale sell transactions |
| `whale.buyVolume` | string | Total whale buy volume in BNB |
| `whale.sellVolume` | string | Total whale sell volume in BNB |
| `whale.netFlow` | string | Net whale flow in BNB (positive = buying) |
| `whale.direction` | string | BUYING or SELLING |
| `retail` | object | Retail tier stats (<1 BNB swaps), same fields as whale |
| `medium` | object | Medium tier stats (1-10 BNB swaps), same fields as whale |
| `topWhales` | array | Largest whale transactions observed |
| `totalVolumeUsd` | string | Combined volume across all tiers in USD |

## Example Response

```json
{
  "divergenceScore": 78,
  "signal": "WHALE ACCUMULATION",
  "signalStrength": "STRONG",
  "whale": {
    "buyCount": 14,
    "sellCount": 3,
    "buyVolume": "284.5",
    "sellVolume": "42.1",
    "netFlow": "242.4",
    "direction": "BUYING"
  },
  "retail": {
    "buyCount": 89,
    "sellCount": 156,
    "buyVolume": "31.2",
    "sellVolume": "54.8",
    "netFlow": "-23.6",
    "direction": "SELLING"
  },
  "medium": {
    "buyCount": 45,
    "sellCount": 38,
    "buyVolume": "127.3",
    "sellVolume": "98.7",
    "netFlow": "28.6",
    "direction": "BUYING"
  },
  "topWhales": [
    {
      "txHash": "0xabc123...def",
      "value": "85.2",
      "direction": "BUY",
      "block": 48120300
    }
  ],
  "totalVolumeUsd": "382,400"
}
```

## Use Cases

- Detect smart money accumulation before price moves
- Identify distribution phases where whales exit while retail buys
- Gauge market sentiment divergence between participant tiers
- Generate contrarian signals based on whale/retail disagreement
- Track whale flow trends across consecutive time windows

## Notes

- Built with BSC JSON-RPC
- Real-time on-chain data
- No API key required
- Classifies transactions targeting known DEX router swap methods
- Tier thresholds: whale >=10 BNB, medium 1-10 BNB, retail <1 BNB
- 200-block window covers approximately 10 minutes of BSC activity
