# BNB Chain Skills

> 28 professional on-chain analysis tools for BNB Smart Chain. Built by [Mefai](https://mefai.io).

**Live Demo:** [mefai.io/bnbchain](https://mefai.io/bnbchain)

## Overview

BNB Chain Skills is an open-source collection of real-time blockchain analysis tools built on BSC JSON-RPC and DexScreener APIs. Each skill provides a focused, production-ready analytical capability — from transaction decoding to honeypot detection, from validator monitoring to cross-DEX arbitrage scanning.

## Skills

### Security & Auditing
| Skill | Description | API Endpoint |
|-------|-------------|-------------|
| **Honeypot Check** | Combined honeypot detection: bytecode analysis, buy/sell ratio, owner concentration, dangerous selectors | `/mefai/honeypot-check` |
| **Contract X-Ray** | Deep bytecode analysis: proxy detection, function scanning, mint/pause/blacklist pattern detection | `/mefai/contract-xray` |
| **Approval Scanner** | Token approval checker across 9 major DEX routers — finds unlimited allowances | `/mefai/approval-scanner` |
| **Risk Radar** | Risk scoring (0-100, A-F grade) combining on-chain and market signals | `/mefai/risk-radar` |
| **Upgrade Monitor** | EIP-1967 proxy contract detection with storage slot inspection, admin identification | `/mefai/upgrade-monitor` |
| **Contract Audit** | Smart contract security analysis: ownership, proxy, token standards compliance | `/mefai/contract-audit` |

### Alpha & Intelligence
| Skill | Description | API Endpoint |
|-------|-------------|-------------|
| **Sniper Detector** | Detect bot sniping on any token — early buyer analysis, hold/dump tracking, snipe score | `/mefai/sniper-detector` |
| **Copy Trade** | Alpha wallet activity monitor — tracks known wallets for token interactions | `/mefai/copy-trade` |
| **Smart Money** | Whale transaction tracker — identifies large-value transfers in real-time | `/mefai/smart-money` |
| **Wallet Cluster** | On-chain forensics: discover connected wallets via transfer patterns and shared holdings | `/mefai/wallet-cluster` |

### Market Analysis
| Skill | Description | API Endpoint |
|-------|-------------|-------------|
| **DEX Arbitrage** | Cross-DEX price discrepancy finder with gas-adjusted profit estimates | `/mefai/dex-arb` |
| **Token Battle** | Side-by-side comparison of up to 4 tokens: price, volume, liquidity, burns | `/mefai/token-battle` |
| **Token Birth** | Token genesis analysis: creator profile, supply distribution, age, liquidity history | `/mefai/token-birth` |
| **Pair Analytics** | Deep DEX pair analysis with aggregate stats across multiple pairs | `/mefai/pair-analytics` |
| **PancakeSwap Arena** | PancakeSwap top pairs, volume leaders, trending tokens | `/mefai/pancakeswap-arena` |

### On-Chain Analytics
| Skill | Description | API Endpoint |
|-------|-------------|-------------|
| **TX Decoder** | Decode any BSC transaction: function calls, events, token transfers, gas breakdown | `/mefai/tx-decoder` |
| **Block Autopsy** | Block gas distribution, transaction type breakdown, top gas consumers | `/mefai/block-autopsy` |
| **Token Flow** | Track token transfer movements from recent blocks | `/mefai/token-flow` |
| **Burn Engine** | Real-time BNB and token burn tracking with USD valuations | `/mefai/burn-tracker` |
| **Wallet Scanner** | Complete wallet portfolio analysis: BNB + token balances with USD values | `/mefai/wallet-scanner` |
| **Portfolio Heatmap** | Bloomberg-style portfolio view with 24h performance heatmap | `/mefai/portfolio-heatmap` |

### Network & Infrastructure
| Skill | Description | API Endpoint |
|-------|-------------|-------------|
| **Validator Map** | Live BSC validator monitoring: 21 validators, gas utilization, block production, MEV detection | `/mefai/validator-map` |
| **Network Pulse** | Network congestion gauge: pressure score, TPS, block timing, gas optimization | `/mefai/network-pulse` |
| **BSC Supremacy** | BSC vs Ethereum comparison: speed, cost, TPS — live data | `/mefai/bsc-supremacy` |
| **Gas Calculator** | Operation cost estimator: 10 operations with BSC vs ETH cost comparison | `/mefai/gas-calculator` |
| **Chain Vitals** | Core network health metrics: block height, gas price, peer count | `/mefai/chain-vitals` |

### DeFi
| Skill | Description | API Endpoint |
|-------|-------------|-------------|
| **Yield Finder** | APY estimation from trading fee revenue, sorted by opportunity | `/mefai/yield-finder` |
| **DeFi Leaderboard** | Top DeFi protocols ranked by TVL, volume, and user count | `/mefai/defi-leaderboard` |
| **Liquidity Pulse** | Real-time liquidity depth analysis across major BSC pairs | `/mefai/liquidity-pulse` |

## Architecture

```
+----------------------------------------------+
|              Frontend (Web Components)        |
|  50 panels - _MX premium CSS - BasePanel      |
|  Stale-while-revalidate cache - Auto-refresh  |
+----------------------------------------------+
|              API Layer (FastAPI)               |
|  28 /mefai/* endpoints - async - TTL cache    |
+----------------------------------------------+
|            Data Sources                        |
|  BSC JSON-RPC - DexScreener - BscScan         |
+----------------------------------------------+
```

### Tech Stack
- **Frontend:** Vanilla JS Web Components, zero dependencies
- **Backend:** Python FastAPI with async/await, stale-while-revalidate caching
- **Data:** BSC JSON-RPC (bsc-dataseed1.binance.org), DexScreener API, BscScan API
- **Deployment:** Nginx reverse proxy, systemd services

## API Reference

All endpoints are served under `/superbsc/api/bnbchain/mefai/`.

### Authentication
No authentication required. All endpoints are public and rate-limited via caching.

### Common Response Pattern
```json
{
  "field1": "value",
  "field2": 123,
  "error": null
}
```

Error responses:
```json
{
  "error": "Description of what went wrong"
}
```

### Example Requests

```bash
# Honeypot check
curl https://mefai.io/superbsc/api/bnbchain/mefai/honeypot-check?address=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82

# Network pulse
curl https://mefai.io/superbsc/api/bnbchain/mefai/network-pulse

# Validator map
curl https://mefai.io/superbsc/api/bnbchain/mefai/validator-map

# Gas calculator
curl https://mefai.io/superbsc/api/bnbchain/mefai/gas-calculator
```

## Self-Hosting

### Prerequisites
- Python 3.11+
- Node.js 18+ (for frontend dev only)
- Nginx (production)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/mefai-dev/bnbchain-skills.git
cd bnbchain-skills
```

2. Install Python dependencies:
```bash
pip install fastapi uvicorn httpx
```

3. Start the backend:
```bash
uvicorn api.main:app --host 127.0.0.1 --port 8202
```

4. Serve the frontend:
```bash
# Development
python -m http.server 8080 --directory frontend

# Production: configure nginx to serve frontend/ as static and proxy /api to port 8202
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Related Projects

- [BNB Chain MCP](https://github.com/bnb-chain/bnbchain-mcp) — Model Context Protocol server for BNB Chain
- [Binance Skills Hub](https://github.com/binance/binance-skills-hub) — Official Binance skills collection

## License

MIT License — see [LICENSE](LICENSE) for details.

Built by [Mefai](https://mefai.io) for the BNB Chain community.
