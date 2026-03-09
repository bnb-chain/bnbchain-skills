---
name: gas-calculator
description: |
  Operation cost estimator for BSC. Calculates gas costs for 10 common
  operations (transfer, swap, deploy, etc.) with BSC vs ETH cost comparison.
  Use for cost planning and gas budgeting.
metadata:
  author: mefai
  version: "1.0"
---

# Gas Calculator

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Gas Calculator | Cost estimator for 10 operations with BSC vs ETH comparison | Cost planning and gas budgeting |

## Use Cases

1. **Cost Estimation**: Calculate the exact USD cost of common BSC operations at current gas prices
2. **Budget Planning**: Estimate deployment and operational costs for BSC-based projects
3. **Cross-Chain Cost Comparison**: Compare operation costs between BSC and Ethereum

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Gas Calculator

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/gas-calculator
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns current gas cost estimates |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/gas-calculator'
```

**Response Example**:
```json
{
  "gas_price_gwei": 3.0,
  "bnb_price_usd": 300.0,
  "eth_gas_price_gwei": 25.0,
  "eth_price_usd": 3200.0,
  "operations": [
    {
      "name": "BNB Transfer",
      "gas_units": 21000,
      "bsc_cost_bnb": 0.000063,
      "bsc_cost_usd": 0.019,
      "eth_cost_eth": 0.000525,
      "eth_cost_usd": 1.68,
      "savings_pct": 98.9
    },
    {
      "name": "ERC20 Transfer",
      "gas_units": 65000,
      "bsc_cost_bnb": 0.000195,
      "bsc_cost_usd": 0.059,
      "eth_cost_eth": 0.001625,
      "eth_cost_usd": 5.20,
      "savings_pct": 98.9
    },
    {
      "name": "DEX Swap",
      "gas_units": 150000,
      "bsc_cost_bnb": 0.00045,
      "bsc_cost_usd": 0.135,
      "eth_cost_eth": 0.00375,
      "eth_cost_usd": 12.00,
      "savings_pct": 98.9
    },
    {
      "name": "ERC20 Approval",
      "gas_units": 46000,
      "bsc_cost_bnb": 0.000138,
      "bsc_cost_usd": 0.041,
      "eth_cost_eth": 0.00115,
      "eth_cost_usd": 3.68,
      "savings_pct": 98.9
    },
    {
      "name": "Add Liquidity",
      "gas_units": 250000,
      "bsc_cost_bnb": 0.00075,
      "bsc_cost_usd": 0.225,
      "eth_cost_eth": 0.00625,
      "eth_cost_usd": 20.00,
      "savings_pct": 98.9
    },
    {
      "name": "NFT Mint",
      "gas_units": 120000,
      "bsc_cost_bnb": 0.00036,
      "bsc_cost_usd": 0.108,
      "eth_cost_eth": 0.003,
      "eth_cost_usd": 9.60,
      "savings_pct": 98.9
    },
    {
      "name": "NFT Transfer",
      "gas_units": 85000,
      "bsc_cost_bnb": 0.000255,
      "bsc_cost_usd": 0.077,
      "eth_cost_eth": 0.002125,
      "eth_cost_usd": 6.80,
      "savings_pct": 98.9
    },
    {
      "name": "Contract Deploy (small)",
      "gas_units": 500000,
      "bsc_cost_bnb": 0.0015,
      "bsc_cost_usd": 0.45,
      "eth_cost_eth": 0.0125,
      "eth_cost_usd": 40.00,
      "savings_pct": 98.9
    },
    {
      "name": "Contract Deploy (large)",
      "gas_units": 3000000,
      "bsc_cost_bnb": 0.009,
      "bsc_cost_usd": 2.70,
      "eth_cost_eth": 0.075,
      "eth_cost_usd": 240.00,
      "savings_pct": 98.9
    },
    {
      "name": "Multi-sig Execution",
      "gas_units": 200000,
      "bsc_cost_bnb": 0.0006,
      "bsc_cost_usd": 0.18,
      "eth_cost_eth": 0.005,
      "eth_cost_usd": 16.00,
      "savings_pct": 98.9
    }
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| gas_price_gwei | number | Current BSC gas price |
| bnb_price_usd | number | Current BNB price |
| eth_gas_price_gwei | number | Current Ethereum gas price |
| eth_price_usd | number | Current ETH price |
| operations | array | Cost estimates for each operation |
| operations[].name | string | Operation name |
| operations[].gas_units | number | Estimated gas consumption |
| operations[].bsc_cost_bnb | number | BSC cost in BNB |
| operations[].bsc_cost_usd | number | BSC cost in USD |
| operations[].eth_cost_usd | number | Equivalent Ethereum cost in USD |
| operations[].savings_pct | number | Percentage savings on BSC vs Ethereum |

---

## Notes

1. Gas prices from BSC and Ethereum JSON-RPC, token prices from market data
2. Responses are cached with 15s fresh TTL
3. No authentication required
4. Gas unit estimates are based on typical transaction complexity
