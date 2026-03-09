---
name: bridge-flow
description: |
  Cross-chain capital flow analysis via bridge contract balances on BSC.
  Monitors TVL across major bridge protocols to detect capital inflows
  and outflows. Use to understand cross-chain liquidity movement and
  market sentiment on BSC.
metadata:
  author: mefai
  version: "1.0"
---

# Bridge Flow Monitor

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Bridge Flow Monitor | Cross-chain capital flow analysis via bridge contract balances on BSC | Detect capital inflows/outflows and gauge cross-chain sentiment |

## Use Cases

1. **Capital Flow Detection**: Monitor whether capital is flowing into or out of BSC via bridge protocols
2. **Bridge TVL Comparison**: Compare total value locked across Stargate, Celer, Multichain, LayerZero, Wormhole, and Axelar
3. **Market Sentiment Gauge**: Inflows signal bullish sentiment on BSC; outflows suggest capital rotation to other chains
4. **Liquidity Depth Analysis**: Assess available bridge liquidity for large cross-chain transfers

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Bridge Flow Monitor

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/bridge-flow
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns bridge flow data for all monitored bridges |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/bridge-flow'
```

**Response Example**:
```json
{
  "totalBridgeTvl": 285400000,
  "bnbPrice": 612.50,
  "bridgeCount": 6,
  "bridges": [
    {
      "name": "Stargate",
      "address": "0x6694340fc020c5E6B96567843da2df01b2cE1eb6",
      "balanceBnb": 12500.0,
      "stablesUsd": 45000000,
      "tvlUsd": 52656250
    },
    {
      "name": "Celer cBridge",
      "address": "0x5d96d4287D1ff115eE50faC0526CF43eCf79bFc6",
      "balanceBnb": 8200.0,
      "stablesUsd": 28000000,
      "tvlUsd": 33022500
    },
    {
      "name": "LayerZero",
      "address": "0x3c2269811836af69497E5F486A85D7316753cf62",
      "balanceBnb": 15800.0,
      "stablesUsd": 62000000,
      "tvlUsd": 71677500
    },
    {
      "name": "Wormhole",
      "address": "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B",
      "balanceBnb": 9400.0,
      "stablesUsd": 38000000,
      "tvlUsd": 43757500
    },
    {
      "name": "Multichain",
      "address": "0xf8650eD81442dbbC6B3a9D0b5086F1a0B5a17aFe",
      "balanceBnb": 5600.0,
      "stablesUsd": 18000000,
      "tvlUsd": 21430000
    },
    {
      "name": "Axelar",
      "address": "0x304acf330bbE08d1e512eefaa92F6a57871fD895",
      "balanceBnb": 4200.0,
      "stablesUsd": 12000000,
      "tvlUsd": 14572500
    }
  ],
  "flowDirection": "net_inflow",
  "sentiment": "Bullish — capital flowing into BSC from other chains"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| totalBridgeTvl | number | Combined TVL across all monitored bridges in USD |
| bnbPrice | number | Current BNB price used for valuation |
| bridgeCount | number | Number of bridges monitored |
| bridges | array | Per-bridge breakdown |
| bridges[].name | string | Bridge protocol name |
| bridges[].address | string | Bridge contract address on BSC |
| bridges[].balanceBnb | number | BNB held in bridge contract |
| bridges[].stablesUsd | number | Stablecoin value (USDT + USDC + BUSD) in bridge |
| bridges[].tvlUsd | number | Total bridge TVL in USD |
| flowDirection | string | net_inflow, net_outflow, or neutral |
| sentiment | string | Human-readable market sentiment based on flow direction |

---

## Bridges Monitored

| Bridge | Description |
|--------|-------------|
| Stargate | LayerZero-based omnichain bridge |
| Celer cBridge | Celer Network cross-chain bridge |
| Multichain | Multi-chain router protocol |
| LayerZero | Omnichain interoperability protocol |
| Wormhole | Cross-chain messaging and bridge |
| Axelar | Universal cross-chain communication |

## Data Sources

1. BSC RPC: eth_getBalance for BNB balances, eth_call balanceOf for USDT/USDC/BUSD on each bridge contract
2. Binance Data API: BNB price for USD conversion

## Notes

1. Flow direction is determined by comparing current balances against 24h moving average
2. Responses are cached with 60s fresh TTL
3. No authentication required
4. Multichain bridge may show reduced balances due to the July 2023 exploit — included for historical tracking
