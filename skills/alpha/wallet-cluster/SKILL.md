---
name: wallet-cluster
description: |
  On-chain forensics tool for BSC. Discovers connected wallets via transfer
  patterns, shared token holdings, and common funding sources. Use for
  wallet attribution and Sybil detection.
metadata:
  author: mefai
  version: "1.0"
---

# Wallet Cluster

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Wallet Cluster | Discover connected wallets via transfer patterns, shared holdings, and common funding sources | On-chain forensics and Sybil detection |

## Use Cases

1. **Wallet Attribution**: Discover wallets that are likely controlled by the same entity
2. **Sybil Detection**: Identify airdrop farming clusters or wash trading rings
3. **Whale Profiling**: Map the full wallet constellation of a whale to understand their total exposure

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Wallet Cluster

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/wallet-cluster
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Wallet address to analyze (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/wallet-cluster?address=0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b'
```

**Response Example**:
```json
{
  "address": "0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b",
  "cluster_size": 5,
  "connections": [
    {
      "address": "0x2345...6789",
      "relationship": "DIRECT_TRANSFER",
      "transfer_count": 12,
      "total_value_bnb": 450.0,
      "shared_tokens": ["CAKE", "USDT", "BUSD"],
      "confidence": 0.92
    },
    {
      "address": "0x3456...7890",
      "relationship": "COMMON_FUNDING",
      "transfer_count": 3,
      "total_value_bnb": 120.0,
      "shared_tokens": ["USDT"],
      "confidence": 0.78
    }
  ],
  "shared_holdings": [
    {"token": "CAKE", "wallets_holding": 4},
    {"token": "USDT", "wallets_holding": 5}
  ],
  "funding_sources": [
    {"address": "0xBinance...", "label": "Binance Hot Wallet", "funded_wallets": 3}
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Root wallet address analyzed |
| cluster_size | number | Total wallets in the discovered cluster |
| connections | array | Connected wallets with relationship details |
| connections[].relationship | string | DIRECT_TRANSFER, COMMON_FUNDING, or SHARED_HOLDINGS |
| connections[].transfer_count | number | Number of transfers between wallets |
| connections[].total_value_bnb | number | Total value transferred in BNB |
| connections[].shared_tokens | array | Tokens held by both wallets |
| connections[].confidence | number | Confidence score 0-1 that wallets are related |
| shared_holdings | array | Tokens held across multiple cluster wallets |
| funding_sources | array | Common funding source wallets |

---

## Notes

1. Analyzes transfer history and token holdings via BSC JSON-RPC
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Cluster discovery is limited to 2 hops from the root address to maintain response times
