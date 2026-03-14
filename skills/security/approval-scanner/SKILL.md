---
name: approval-scanner
description: |
  Token approval checker for BSC wallets. Scans 9 major DEX routers for
  unlimited or excessive token allowances that could be exploited.
  Use to audit wallet security and revoke risky approvals.
metadata:
  author: mefai
  version: "1.0"
---

# Approval Scanner

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Approval Scanner | Check token approvals across 9 BSC DEX routers, flag unlimited allowances | Wallet security audit and approval management |

## Use Cases

1. **Wallet Security Audit**: Scan a wallet for unlimited token approvals to DEX routers that could be exploited if a router contract is compromised
2. **Approval Cleanup**: Identify stale or excessive approvals that should be revoked to reduce attack surface
3. **Risk Assessment**: Quantify the total value at risk through outstanding token approvals

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Approval Scanner

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/approval-scanner
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Wallet address to scan (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/approval-scanner?address=0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b'
```

**Response Example**:
```json
{
  "address": "0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b",
  "total_approvals": 5,
  "unlimited_approvals": 2,
  "routers_checked": 9,
  "approvals": [
    {
      "token": "0x55d398326f99059fF775485246999027B3197955",
      "token_symbol": "USDT",
      "spender": "0x10ED43C718714eb63d5aA57B78B54917c3e6fE49",
      "spender_name": "PancakeSwap V2 Router",
      "allowance": "unlimited",
      "allowance_raw": "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      "risk": "HIGH"
    },
    {
      "token": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      "token_symbol": "CAKE",
      "spender": "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4",
      "spender_name": "PancakeSwap V3 Router",
      "allowance": "1000.00",
      "allowance_raw": "1000000000000000000000",
      "risk": "LOW"
    }
  ],
  "routers": [
    "PancakeSwap V2 Router",
    "PancakeSwap V3 Router",
    "BiSwap Router",
    "ApeSwap Router",
    "BabySwap Router",
    "MDEX Router",
    "BakerySwap Router",
    "Uniswap V3 Router",
    "1inch Router"
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Wallet address scanned |
| total_approvals | number | Total number of active approvals found |
| unlimited_approvals | number | Count of unlimited (max uint256) approvals |
| routers_checked | number | Number of DEX routers checked |
| approvals | array | List of approval details |
| approvals[].token | string | Token contract address |
| approvals[].token_symbol | string | Token symbol |
| approvals[].spender | string | Spender (router) contract address |
| approvals[].spender_name | string | Human-readable router name |
| approvals[].allowance | string | Allowance amount (or "unlimited") |
| approvals[].allowance_raw | string | Raw allowance in wei |
| approvals[].risk | string | Risk level: HIGH, MEDIUM, or LOW |
| routers | array | List of all routers checked |

---

## Notes

1. Checks approvals across 9 major BSC DEX routers via `eth_call` to each token's `allowance()` function
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. "Unlimited" means the approval was set to max uint256 (2^256 - 1)
