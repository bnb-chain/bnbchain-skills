---
name: tx-decoder
description: |
  Decode any BSC transaction into human-readable components. Extracts function
  calls, event logs, token transfers, and gas breakdown. Use to understand
  what a transaction actually did on-chain.
metadata:
  author: mefai
  version: "1.0"
---

# TX Decoder

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| TX Decoder | Decode BSC transactions: function calls, events, token transfers, gas breakdown | Understand on-chain transaction details |

## Use Cases

1. **Transaction Analysis**: Decode a transaction to understand what functions were called and what events were emitted
2. **Token Transfer Tracking**: Extract all token transfers within a transaction, including multi-hop swaps
3. **Gas Breakdown**: Analyze gas usage and cost of a transaction
4. **Debugging**: Understand why a transaction failed by examining the decoded data

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: TX Decoder

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/tx-decoder
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| hash | string | Yes | Transaction hash (0x..., 66 characters) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/tx-decoder?hash=0x8f2d0e779c3fcaa9f67403cf22c0afc3a51a7b1b6e7e5a7c0e3f6d1a2b3c4d5e'
```

**Response Example**:
```json
{
  "hash": "0x8f2d0e779c3fcaa9f67403cf22c0afc3a51a7b1b6e7e5a7c0e3f6d1a2b3c4d5e",
  "status": "SUCCESS",
  "block": 46250100,
  "timestamp": "2026-03-08T14:28:45Z",
  "from": "0x1234...5678",
  "to": "0x10ED43C718714eb63d5aA57B78B54917c3e6fE49",
  "value_bnb": 1.5,
  "function": {
    "selector": "0x7ff36ab5",
    "name": "swapExactETHForTokens",
    "params": {
      "amountOutMin": "450000000000000000000",
      "path": ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"],
      "to": "0x1234...5678",
      "deadline": 1709913000
    }
  },
  "token_transfers": [
    {
      "token": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "symbol": "CAKE",
      "from": "0x0eD7...4fD0",
      "to": "0x1234...5678",
      "amount": 478.23
    }
  ],
  "events": [
    {
      "name": "Swap",
      "contract": "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
      "data": {"amount0In": "1500000000000000000", "amount1Out": "478230000000000000000"}
    }
  ],
  "gas": {
    "gas_used": 152340,
    "gas_price_gwei": 3.0,
    "gas_cost_bnb": 0.000457,
    "gas_cost_usd": 0.137
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| hash | string | Transaction hash |
| status | string | SUCCESS or FAILED |
| block | number | Block number |
| timestamp | string | ISO 8601 timestamp |
| from | string | Sender address |
| to | string | Recipient/contract address |
| value_bnb | number | Native BNB value sent |
| function | object | Decoded function call |
| function.name | string | Function name (if known) |
| function.params | object | Decoded function parameters |
| token_transfers | array | ERC20/ERC721 transfers within the transaction |
| events | array | Decoded event logs |
| gas | object | Gas usage and cost breakdown |

---

## Notes

1. Decodes transactions via BSC JSON-RPC `eth_getTransactionByHash` and `eth_getTransactionReceipt`
2. Responses are cached with 120s fresh TTL (transactions are immutable)
3. No authentication required
4. Function selectors are matched against a database of known signatures
