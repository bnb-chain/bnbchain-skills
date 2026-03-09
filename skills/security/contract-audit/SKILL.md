---
name: contract-audit
description: |
  Smart contract security analysis for BSC. Checks ownership status, proxy
  patterns, token standard compliance, and common vulnerability patterns.
  Use for a quick security overview of any BSC smart contract.
metadata:
  author: mefai
  version: "1.0"
---

# Contract Audit

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Contract Audit | Smart contract security analysis: ownership, proxy detection, token standard compliance, vulnerability patterns | Quick security overview of BSC contracts |

## Use Cases

1. **Quick Contract Review**: Get a fast security overview of a contract before interacting with it
2. **Token Standard Verification**: Confirm a token properly implements ERC20/ERC721 standards
3. **Ownership Analysis**: Check whether contract ownership is renounced, multi-sig, or held by a single EOA

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Contract Audit

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/contract-audit
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Contract address to audit (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/contract-audit?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "is_contract": true,
  "bytecode_size": 12847,
  "owner": "0x73feaa1ee314f8c655e354234017bE2193C9E24E",
  "owner_type": "contract",
  "is_renounced": false,
  "is_proxy": false,
  "token_standard": "ERC20",
  "has_mint": true,
  "has_pause": false,
  "has_blacklist": false,
  "has_fee_on_transfer": false,
  "compliant": true,
  "findings": [
    {"severity": "INFO", "message": "Contract has mint function — supply is not fixed"},
    {"severity": "INFO", "message": "Owner is a contract (likely governance/timelock)"}
  ],
  "audit_score": 85,
  "verdict": "PASS"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Contract address audited |
| is_contract | boolean | Whether the address is a contract |
| bytecode_size | number | Deployed bytecode size in bytes |
| owner | string | Current owner address |
| owner_type | string | Owner type: EOA, contract, or renounced |
| is_renounced | boolean | Whether ownership is renounced |
| is_proxy | boolean | Whether the contract is a proxy |
| token_standard | string | Detected token standard (ERC20, ERC721, etc.) |
| has_mint | boolean | Whether mint function exists |
| has_pause | boolean | Whether pause function exists |
| has_blacklist | boolean | Whether blacklist function exists |
| has_fee_on_transfer | boolean | Whether fee-on-transfer logic exists |
| compliant | boolean | Whether token standard is properly implemented |
| findings | array | List of audit findings with severity and message |
| audit_score | number | Audit score 0-100 (higher is better) |
| verdict | string | PASS, CAUTION, or FAIL |

---

## Notes

1. Analyzes bytecode and on-chain state via BSC JSON-RPC
2. Responses are cached with 30s fresh TTL
3. No authentication required
4. Audit score considers ownership, proxy risk, dangerous functions, and standard compliance
