---
name: contract-xray
description: |
  Deep bytecode analysis for BSC smart contracts. Detects proxy patterns,
  scans for mint/pause/blacklist functions, identifies dangerous selectors,
  and classifies contract type. Use for security auditing of any BSC contract.
metadata:
  author: mefai
  version: "1.0"
---

# Contract X-Ray

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Contract X-Ray | Deep bytecode inspection: proxy detection, function selector scanning, dangerous pattern identification | Security audit of BSC smart contracts |

## Use Cases

1. **Security Audit**: Analyze a contract's bytecode for proxy patterns, minting capabilities, pausability, and blacklist functions before interacting with it
2. **Proxy Detection**: Identify whether a contract is upgradeable via EIP-1967 or other proxy patterns
3. **Function Discovery**: Extract and classify all function selectors present in the bytecode

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Contract X-Ray

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/contract-xray
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Smart contract address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/contract-xray?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "is_contract": true,
  "bytecode_size": 12847,
  "is_proxy": false,
  "proxy_type": null,
  "implementation": null,
  "has_selfdestruct": false,
  "has_delegatecall": false,
  "has_mint": true,
  "has_pause": false,
  "has_blacklist": false,
  "has_fee_on_transfer": false,
  "function_count": 42,
  "selectors": ["0x06fdde03", "0x095ea7b3", "0x18160ddd", "0x23b872dd"],
  "known_functions": {
    "0x06fdde03": "name()",
    "0x095ea7b3": "approve(address,uint256)",
    "0x18160ddd": "totalSupply()",
    "0x23b872dd": "transferFrom(address,address,uint256)"
  },
  "dangerous_patterns": [],
  "contract_type": "ERC20"
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Contract address analyzed |
| is_contract | boolean | Whether the address contains bytecode |
| bytecode_size | number | Size of the deployed bytecode in bytes |
| is_proxy | boolean | Whether the contract is a proxy |
| proxy_type | string/null | Proxy pattern type (EIP-1967, EIP-1822, etc.) |
| implementation | string/null | Implementation contract address if proxy |
| has_selfdestruct | boolean | Whether bytecode contains SELFDESTRUCT opcode |
| has_delegatecall | boolean | Whether bytecode contains DELEGATECALL opcode |
| has_mint | boolean | Whether a mint function is detected |
| has_pause | boolean | Whether a pause function is detected |
| has_blacklist | boolean | Whether blacklist functionality is detected |
| has_fee_on_transfer | boolean | Whether fee-on-transfer logic is detected |
| function_count | number | Number of public function selectors found |
| selectors | array | List of 4-byte function selectors |
| known_functions | object | Mapping of selectors to known function signatures |
| dangerous_patterns | array | List of dangerous bytecode patterns detected |
| contract_type | string | Classified contract type (ERC20, ERC721, etc.) |

---

## Notes

1. Bytecode analysis is performed directly via BSC JSON-RPC `eth_getCode`
2. Responses are cached with a 5-minute fresh TTL due to immutable bytecode
3. No authentication required
4. Proxy contracts will show the proxy's bytecode; use `implementation` address for the actual logic
