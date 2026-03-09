# Multi-Token Portfolio Risk Scanner — BNB Chain MCP Skill Reference

## Overview

Scans a BSC wallet's token holdings across 15 major tokens, checking each for dangerous contract selectors (mint, pause, blacklist), liquidity depth, and trading volume. Produces a portfolio health score (0-100) and identifies risky tokens.

## Endpoint

```
GET /mefai/portfolio-risk?address=<wallet_address>
```

## How It Works

1. **BNB Balance** — Checks native BNB balance via `eth_getBalance`.
2. **Token Scanning** — Queries `balanceOf()` for 15 major BSC tokens (USDT, BUSD, USDC, CAKE, ETH, BTCB, DAI, DOGE, LINK, LTC, XRP, DOT, ADA, TUSD, MATIC).
3. **Price Discovery** — Fetches USD price and liquidity data from DexScreener for each held token.
4. **Contract Risk Analysis** — Reads bytecode of each token contract via `eth_getCode` and scans for dangerous function selectors:
   - `mint()` / `mint(uint256)` / `mintTo()` — Unlimited token creation
   - `pause()` — Trading can be halted
   - `blacklist(address)` — Addresses can be blocked
   - `burn(uint256)` — Token burning capability
5. **Health Score Calculation** — Weighted formula based on safe/risky token ratio and total portfolio value.

## BNB Chain Skills Used

| # | Skill | Usage |
|---|-------|-------|
| 1 | `eth_getBalance` | Check native BNB balance |
| 2 | `eth_call` | Read `balanceOf()` for 15 tokens |
| 3 | `eth_getCode` | Retrieve bytecode for dangerous selector scanning |

## Response Fields

- `healthScore` — Portfolio health 0-100
- `verdict` — Healthy Portfolio / Moderate Risk / High Risk Portfolio
- `totalValueUsd` — Total portfolio value in USD
- `totalTokens` — Number of tokens held
- `safeTokens` / `riskTokens` — Count of safe vs risky holdings
- `holdings[]` — Each token with balance, USD value, risk level, and risk flags
- `bnbBalance`, `bnbValueUsd` — Native BNB position

## Architecture

- Parallel batch `balanceOf()` calls via `asyncio.gather`
- Bytecode selector scanning without ABI — works on any contract
- DexScreener for price/liquidity data
- Known dangerous selector database for risk classification
- 15 major BSC tokens pre-configured for efficient scanning
