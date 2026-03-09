# Flash Loan Detector Reference

## Overview

Identifies flash loan transactions in recent BSC blocks using heuristics: high gas limit (>300k), complex input data (>500 bytes), and known flash loan provider interactions. Fetches transaction receipts for confidence scoring.

## Endpoint

`GET /mefai/flash-loan-detector`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Auto-refresh; no parameters needed |

## Response

| Field | Type | Description |
|-------|------|-------------|
| `flashLoanCount` | number | Total flash loan transactions detected |
| `highConfidence` | number | Number of high-confidence detections |
| `riskLevel` | string | Overall risk assessment (LOW, MEDIUM, HIGH, CRITICAL) |
| `providers` | array | Flash loan providers observed (e.g. PancakeSwap, Venus, AAVE) |
| `recentFlashLoans` | array | List of detected flash loan transactions |
| `recentFlashLoans[].txHash` | string | Transaction hash |
| `recentFlashLoans[].value` | string | Transaction value in BNB |
| `recentFlashLoans[].gasLimit` | number | Gas limit set for the transaction |
| `recentFlashLoans[].logCount` | number | Number of event logs in the receipt |
| `recentFlashLoans[].pattern` | string | Detected pattern type (e.g. "HIGH_GAS_COMPLEX_INPUT") |
| `recentFlashLoans[].confidence` | string | Detection confidence (LOW, MEDIUM, HIGH) |
| `totalVolumeUsd` | string | Estimated total volume of detected flash loans in USD |
| `bnbPrice` | string | Current BNB price used for USD calculations |

## Example Response

```json
{
  "flashLoanCount": 7,
  "highConfidence": 3,
  "riskLevel": "MEDIUM",
  "providers": ["PancakeSwap V3", "Venus Protocol"],
  "recentFlashLoans": [
    {
      "txHash": "0xabc123...def456",
      "value": "0.0",
      "gasLimit": 1250000,
      "logCount": 24,
      "pattern": "HIGH_GAS_COMPLEX_INPUT",
      "confidence": "HIGH"
    },
    {
      "txHash": "0x789abc...012def",
      "value": "0.0",
      "gasLimit": 480000,
      "logCount": 12,
      "pattern": "KNOWN_PROVIDER_INTERACTION",
      "confidence": "MEDIUM"
    }
  ],
  "totalVolumeUsd": "1,245,000",
  "bnbPrice": "612.50"
}
```

## Use Cases

- Monitor flash loan activity on BSC for security research
- Detect potential flash loan attacks in progress
- Track flash loan usage patterns across DeFi protocols
- Identify high-risk periods with elevated flash loan activity
- Correlate flash loan transactions with price manipulation events

## Notes

- Built with BSC JSON-RPC
- Real-time on-chain data
- No API key required
- Detection uses heuristic-based analysis, not protocol-specific decoding
- Confidence scoring combines gas limit, input data length, log count, and known provider addresses
- Receipt fetching adds latency but significantly improves detection accuracy
