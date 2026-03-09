---
name: risk-radar
description: |
  Token risk scoring engine for BSC. Produces a 0-100 risk score and A-F
  letter grade by combining on-chain signals (holder distribution, liquidity,
  contract patterns) with market signals (volume, price action).
metadata:
  author: mefai
  version: "1.0"
---

# Risk Radar

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Risk Radar | Multi-signal risk scoring (0-100) with letter grade (A-F) combining on-chain and market data | Quantitative token risk assessment |

## Use Cases

1. **Token Due Diligence**: Get a quantitative risk score before investing in a BSC token
2. **Portfolio Risk Monitoring**: Periodically check risk scores of held tokens for deteriorating fundamentals
3. **Comparative Analysis**: Compare risk grades across multiple tokens to allocate capital to lower-risk opportunities

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Risk Radar

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/risk-radar
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | Token contract address (0x...) |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/risk-radar?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
```

**Response Example**:
```json
{
  "address": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "symbol": "CAKE",
  "risk_score": 18,
  "grade": "A",
  "signals": {
    "holder_concentration": {"score": 15, "detail": "Top holder owns 8.2% — well distributed"},
    "liquidity_depth": {"score": 5, "detail": "$42.3M total liquidity across 12 pairs"},
    "contract_risk": {"score": 20, "detail": "Has mint function, ownership not renounced"},
    "volume_health": {"score": 10, "detail": "$28.5M 24h volume, healthy volume/mcap ratio"},
    "price_stability": {"score": 25, "detail": "7.2% max drawdown in 24h"},
    "age_factor": {"score": 0, "detail": "Contract deployed 1,247 days ago"}
  },
  "recommendation": "Low risk. Established token with deep liquidity and diversified holder base."
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| address | string | Token contract address |
| symbol | string | Token symbol |
| risk_score | number | Composite risk score 0-100 (lower is safer) |
| grade | string | Letter grade: A (0-20), B (21-40), C (41-60), D (61-80), F (81-100) |
| signals | object | Individual risk signal breakdowns |
| signals.*.score | number | Individual signal score contribution |
| signals.*.detail | string | Human-readable explanation |
| recommendation | string | Overall risk assessment summary |

---

## Notes

1. Combines BSC JSON-RPC on-chain data with DexScreener market data
2. Responses are cached with 60s fresh TTL
3. No authentication required
4. Grade thresholds: A (0-20), B (21-40), C (41-60), D (61-80), F (81-100)
