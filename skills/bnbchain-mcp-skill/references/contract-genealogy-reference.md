# Contract Genealogy Reference

## Overview

Traces a smart contract's family tree on BSC. Given a contract address, it identifies the deployer wallet, sibling contracts deployed by the same address, bytecode DNA hash, function selector analysis, and contract type classification.

## Endpoint

`GET /mefai/contract-genealogy?address=0x...`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | The BSC contract address to analyze |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `contractType` | string | Classified contract type (e.g. "ERC20", "DEX Router", "Proxy") |
| `complexity` | string | Contract complexity rating (LOW, MEDIUM, HIGH) |
| `bytecodeHash` | string | Keccak256 hash of the deployed bytecode |
| `selectorCount` | number | Number of unique function selectors found |
| `selectors` | array | List of detected function selectors with names |
| `patterns` | object | Detected contract patterns |
| `patterns.isProxy` | boolean | Whether the contract uses a proxy pattern |
| `patterns.isPausable` | boolean | Whether the contract implements pause functionality |
| `patterns.isOwnable` | boolean | Whether the contract has ownership controls |
| `patterns.isMintable` | boolean | Whether the contract has minting capability |
| `deployer` | object | Information about the deployer wallet |
| `deployer.address` | string | Deployer wallet address |
| `deployer.label` | string | Known label for the deployer (if any) |
| `deployer.bnbBalance` | string | Current BNB balance of the deployer |
| `deployer.txCount` | number | Total transaction count of the deployer |
| `deployer.otherContracts` | number | Number of other contracts deployed by this wallet |
| `siblings` | array | Other contracts deployed by the same deployer |
| `tokenInfo` | object | Token metadata if the contract is an ERC20/BEP20 |
| `marketData` | object | Market data (price, market cap) if available |

## Example Response

```json
{
  "contractType": "ERC20",
  "complexity": "MEDIUM",
  "bytecodeHash": "0xa1b2c3d4e5f6...hash",
  "selectorCount": 12,
  "selectors": [
    { "selector": "0xa9059cbb", "name": "transfer(address,uint256)" },
    { "selector": "0x23b872dd", "name": "transferFrom(address,address,uint256)" },
    { "selector": "0x095ea7b3", "name": "approve(address,uint256)" }
  ],
  "patterns": {
    "isProxy": false,
    "isPausable": true,
    "isOwnable": true,
    "isMintable": true
  },
  "deployer": {
    "address": "0x1234...abcd",
    "label": "Unknown",
    "bnbBalance": "12.45",
    "txCount": 847,
    "otherContracts": 5
  },
  "siblings": [
    {
      "address": "0xaaaa...bbbb",
      "type": "ERC20",
      "deployedAt": "2025-11-20T14:30:00Z"
    }
  ],
  "tokenInfo": {
    "name": "ExampleToken",
    "symbol": "EXT",
    "decimals": 18,
    "totalSupply": "1000000000"
  },
  "marketData": {
    "priceUsd": "0.0042",
    "marketCapUsd": "4200000"
  }
}
```

## Use Cases

- Investigate deployer history to assess contract trustworthiness
- Find sibling contracts from the same deployer for pattern analysis
- Identify proxy contracts and upgradeable patterns
- Detect dangerous function selectors (mint, blacklist, pause)
- Compare bytecode hashes to find cloned contracts

## Notes

- Built with BSC JSON-RPC
- Real-time on-chain data
- No API key required
- Function selector matching uses a known signature database
- Sibling detection limited to the most recent 50 deployer transactions
