---
name: wallet-pnl
description: |
  Portfolio snapshot via on-chain RPC — BNB balance plus top 15 BSC token
  holdings with live prices. Classifies wallet activity level and calculates
  total portfolio value in USD. Use to analyze any BSC wallet's holdings and
  trading performance at a glance.
metadata:
  author: mefai
  version: "1.0"
---

# Wallet PnL Tracker

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Wallet PnL Tracker | Portfolio snapshot with BNB balance, top 15 token holdings, live prices, and activity classification | Analyze any BSC wallet's holdings and performance |

## Use Cases

1. **Portfolio Valuation**: Get instant USD valuation of any BSC wallet including BNB and token holdings
2. **Wallet Profiling**: Classify wallets by activity level — Whale, Power User, Active, Casual, or New
3. **Token Exposure Analysis**: See the top 15 token holdings with live prices to understand portfolio composition
4. **Gas Spending Audit**: Track total gas spent in BNB and USD to understand transaction costs

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Wallet PnL Tracker

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/wallet-pnl
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | BSC wallet address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/wallet-pnl?address=0x8894E0a0c962CB723c1ef8580d0459b45a845D5F'
```

**Response Example**:
```json
{
  "address": "0x8894E0a0c962CB723c1ef8580d0459b45a845D5F",
  "bnbBalance": 42.85,
  "bnbPrice": 612.50,
  "bnbValueUsd": 26255.63,
  "txCount": 1847,
  "totalGasSpent": 1.23,
  "totalGasUsd": 753.38,
  "totalPortfolioUsd": 158420.50,
  "uniqueTokens": 12,
  "activity": "Power User",
  "winRate": 62.5,
  "topTokens": [
    {
      "symbol": "CAKE",
      "balance": 5200.0,
      "priceUsd": 2.85,
      "valueUsd": 14820.00
    },
    {
      "symbol": "USDT",
      "balance": 50000.0,
      "priceUsd": 1.00,
      "valueUsd": 50000.00
    },
    {
      "symbol": "ETH",
      "balance": 8.5,
      "priceUsd": 3450.00,
      "valueUsd": 29325.00
    }
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Queried wallet address |
| bnbBalance | number | Native BNB balance |
| bnbPrice | number | Current BNB price in USD |
| bnbValueUsd | number | BNB balance value in USD |
| txCount | number | Total transaction count |
| totalGasSpent | number | Cumulative gas spent in BNB |
| totalGasUsd | number | Cumulative gas spent in USD |
| totalPortfolioUsd | number | Total portfolio value (BNB + all tokens) |
| uniqueTokens | number | Number of distinct tokens held |
| activity | string | Wallet classification: Whale, Power User, Active, Casual, New |
| winRate | number | Estimated profitable trade percentage |
| topTokens | array | Top 15 token holdings sorted by value |
| topTokens[].symbol | string | Token ticker symbol |
| topTokens[].balance | number | Token balance |
| topTokens[].priceUsd | number | Current token price in USD |
| topTokens[].valueUsd | number | Token holding value in USD |

---

## Data Sources

1. BSC RPC: eth_getBalance, eth_getTransactionCount, eth_call (balanceOf for each token contract)
2. Binance data API: Live token prices for portfolio valuation
3. Tracked tokens: WBNB, USDT, BUSD, CAKE, ETH, BTCB, XRP, USDC, slisBNB, ankrBNB, DOGE, MATIC, AVAX, SOL, ADA

## Notes

1. Activity classification based on transaction count and portfolio size
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Win rate is estimated from on-chain token transfer patterns
