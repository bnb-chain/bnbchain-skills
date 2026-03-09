---
name: upgrade-monitor
description: |
  EIP-1967 proxy contract detector for BSC. Inspects storage slots to identify
  proxy patterns, find implementation addresses, and identify admin accounts.
  Use when assessing upgrade risk of a smart contract.
metadata:
  author: mefai
  version: "1.0"
---

# Upgrade Monitor

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Upgrade Monitor | Detect proxy contracts via EIP-1967 storage slot inspection, identify admin and implementation addresses | Assess upgrade risk of BSC smart contracts |

## Use Cases

1. **Proxy Detection**: Determine whether a contract is upgradeable by checking EIP-1967 storage slots
2. **Admin Identification**: Find the admin address that controls proxy upgrades
3. **Implementation Tracking**: Identify the current implementation contract behind a proxy

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Upgrade Monitor

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/upgrade-monitor
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Contract address to inspect (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/upgrade-monitor?address=0x55d398326f99059fF775485246999027B3197955'
```

**Response Example**:
```json
{
  "address": "0x55d398326f99059fF775485246999027B3197955",
  "is_proxy": false,
  "proxy_type": null,
  "implementation": null,
  "admin": null,
  "beacon": null,
  "storage_slots": {
    "eip1967_implementation": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip1967_admin": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip1967_beacon": "0x0000000000000000000000000000000000000000000000000000000000000000"
  },
  "bytecode_has_delegatecall": false,
  "upgrade_risk": "NONE"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Contract address inspected |
| is_proxy | boolean | Whether the contract is a proxy |
| proxy_type | string/null | Proxy standard detected (EIP-1967, EIP-1822, custom) |
| implementation | string/null | Implementation contract address |
| admin | string/null | Admin address that can trigger upgrades |
| beacon | string/null | Beacon contract address (if beacon proxy) |
| storage_slots | object | Raw EIP-1967 storage slot values |
| bytecode_has_delegatecall | boolean | Whether DELEGATECALL opcode is present |
| upgrade_risk | string | Risk level: NONE, LOW, MEDIUM, HIGH, CRITICAL |

---

## Notes

1. Inspects EIP-1967 standard storage slots via `eth_getStorageAt`
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. HIGH/CRITICAL upgrade risk means the contract can be changed at any time by the admin
