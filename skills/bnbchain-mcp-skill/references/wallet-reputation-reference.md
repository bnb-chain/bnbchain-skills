# Wallet Reputation Score — BNB Chain MCP Skill Reference

## Overview

On-chain wallet reputation scoring system that analyzes BSC wallet addresses and produces a composite score (0-100) based on five key dimensions: transaction volume, balance strength, protocol diversity, token portfolio, and network strength.

## Endpoint

```
GET /mefai/wallet-reputation?address=<wallet_address>
```

## How It Works

1. **Transaction Volume (0-20)** — Queries `eth_getTransactionCount` to measure wallet activity. Higher nonce = more transactions = higher score.
2. **Balance Strength (0-20)** — Checks native BNB balance via `eth_getBalance`, converts to USD using DexScreener WBNB price.
3. **Protocol Diversity (0-20)** — Samples recent blocks for transactions involving known BSC protocols (PancakeSwap, Venus, etc.).
4. **Token Portfolio (0-20)** — Checks balances of top BSC tokens (USDT, BUSD, USDC, CAKE, ETH, BTCB, DAI) via `eth_call` with `balanceOf()`.
5. **Network Strength (0-20)** — Counts unique counterparty addresses from recent transactions.

## BNB Chain Skills Used

| # | Skill | Usage |
|---|-------|-------|
| 1 | `eth_blockNumber` | Get current block height |
| 2 | `eth_getBalance` | Check native BNB balance |
| 3 | `eth_getCode` | Determine if address is EOA or contract |
| 4 | `eth_getTransactionCount` | Get total transaction count (nonce) |
| 5 | `eth_getBlockByNumber` | Sample recent blocks for activity analysis |
| 6 | `eth_call` | Read ERC-20 `balanceOf()` for token holdings |

## Response Fields

- `reputationScore` — Composite score 0-100
- `grade` — Letter grade (A+, A, B, C, D, F)
- `riskLevel` — Low / Medium / High
- `breakdown` — Individual dimension scores
- `protocolsUsed` — List of identified DeFi protocols
- `tokenHoldings` — Detected token balances
- `counterpartyCount` — Unique addresses interacted with
- `entityLabel` — Known entity name (Binance, PancakeSwap, etc.)

## Architecture

- Pure on-chain analysis — no external APIs except DexScreener for BNB price
- Parallel RPC calls via `asyncio.gather` for performance
- Known entity/protocol lookup tables for enrichment
- No private keys or signing required (read-only)
