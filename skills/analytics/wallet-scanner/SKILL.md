---
name: wallet-scanner
description: |
  Complete wallet portfolio analysis for BSC. Shows BNB balance plus top
  token holdings with USD values, total portfolio value, and asset
  allocation breakdown. Use for wallet profiling.
metadata:
  author: mefai
  version: "1.0"
---

# Wallet Scanner

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Wallet Scanner | Complete wallet portfolio: BNB + token balances with USD values | Wallet profiling and portfolio analysis |

## Use Cases

1. **Portfolio Overview**: Get a complete view of any wallet's holdings with current USD values
2. **Whale Profiling**: Analyze the portfolio composition of whale wallets
3. **Asset Allocation**: Understand how a wallet's value is distributed across different tokens

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Wallet Scanner

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/wallet-scanner
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Wallet address to scan (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/wallet-scanner?address=0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b'
```

**Response Example**:
```json
{
  "address": "0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b",
  "bnb_balance": 125430.5,
  "bnb_value_usd": 37629150.0,
  "tokens": [
    {
      "address": "0x55d398326f99059fF775485246999027B3197955",
      "symbol": "USDT",
      "balance": 45000000.0,
      "decimals": 18,
      "price_usd": 1.0,
      "value_usd": 45000000.0,
      "pct_of_portfolio": 42.1
    },
    {
      "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "symbol": "CAKE",
      "balance": 2500000.0,
      "decimals": 18,
      "price_usd": 2.35,
      "value_usd": 5875000.0,
      "pct_of_portfolio": 5.5
    }
  ],
  "total_value_usd": 106904150.0,
  "token_count": 28,
  "is_contract": false,
  "label": "Binance Hot Wallet 6"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Wallet address scanned |
| bnb_balance | number | BNB balance |
| bnb_value_usd | number | BNB balance value in USD |
| tokens | array | Token holdings with values |
| tokens[].symbol | string | Token symbol |
| tokens[].balance | number | Token balance |
| tokens[].price_usd | number | Current token price |
| tokens[].value_usd | number | Holding value in USD |
| tokens[].pct_of_portfolio | number | Percentage of total portfolio value |
| total_value_usd | number | Total portfolio value in USD |
| token_count | number | Number of different tokens held |
| is_contract | boolean | Whether the address is a contract |
| label | string | Known label for the address |

---

## Notes

1. BNB balance from JSON-RPC, token balances and prices from DexScreener
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Shows top token holdings sorted by USD value
