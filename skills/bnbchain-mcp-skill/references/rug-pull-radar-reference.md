# Rug Pull Radar Reference

## Overview

Scans recent BSC blocks for newly deployed contracts and analyzes them for rug pull risk. Checks for dangerous function selectors (mint, blacklist, pause, setFee), owner token concentration, liquidity levels, and ownership renouncement status.

## Endpoint

`GET /mefai/rug-radar`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Auto-refresh; no parameters needed |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `newPairs24h` | number | Number of new token pairs detected in the last 24 hours |
| `analyzedContracts` | number | Number of contracts analyzed in this scan |
| `highRiskCount` | number | Number of contracts flagged as high risk |
| `safeCount` | number | Number of contracts that passed all checks |
| `pairs` | array | List of analyzed token contracts |
| `pairs[].tokenName` | string | Token name from the contract |
| `pairs[].tokenSymbol` | string | Token symbol |
| `pairs[].rugScore` | number | Rug pull risk score (0-100, higher = more dangerous) |
| `pairs[].verdict` | string | Risk verdict: SAFE, LOW RISK, MEDIUM RISK, HIGH RISK, CRITICAL |
| `pairs[].flags` | array | List of triggered risk flags |
| `pairs[].ownerConcentration` | string | Percentage of supply held by owner/deployer |
| `pairs[].isRenounced` | boolean | Whether contract ownership has been renounced |
| `pairs[].hasMint` | boolean | Whether the contract has a mint function |
| `pairs[].hasPause` | boolean | Whether the contract has a pause function |
| `pairs[].hasBlacklist` | boolean | Whether the contract has blacklist functionality |

## Example Response

```json
{
  "newPairs24h": 142,
  "analyzedContracts": 25,
  "highRiskCount": 8,
  "safeCount": 4,
  "pairs": [
    {
      "tokenName": "SafeMoonRocket",
      "tokenSymbol": "SMR",
      "rugScore": 92,
      "verdict": "CRITICAL",
      "flags": [
        "Owner holds 85% of supply",
        "Mint function detected",
        "Blacklist function detected",
        "Ownership not renounced",
        "Low liquidity (<$5,000)"
      ],
      "ownerConcentration": "85.2%",
      "isRenounced": false,
      "hasMint": true,
      "hasPause": true,
      "hasBlacklist": true
    },
    {
      "tokenName": "BuilderDAO",
      "tokenSymbol": "BLDAO",
      "rugScore": 15,
      "verdict": "LOW RISK",
      "flags": [
        "Pause function detected"
      ],
      "ownerConcentration": "3.1%",
      "isRenounced": true,
      "hasMint": false,
      "hasPause": true,
      "hasBlacklist": false
    }
  ]
}
```

## Use Cases

- Screen newly launched BSC tokens before investing
- Monitor for high-risk contract deployments in real time
- Identify common rug pull patterns across new token launches
- Build watchlists of suspicious deployer wallets
- Alert communities when a new token fails multiple safety checks

## Notes

- Built with BSC JSON-RPC
- Real-time on-chain data
- No API key required
- Function selector detection covers: mint, blacklist, pause, setFee, setMaxTx, excludeFromFee
- Owner concentration calculated from deployer balance vs total supply
- Ownership renouncement checked via owner() returning zero address
- Risk scoring weighs multiple factors: selectors, concentration, liquidity, renouncement
