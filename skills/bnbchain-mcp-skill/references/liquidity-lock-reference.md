# Liquidity Lock Verifier — BNB Chain MCP Skill Reference

## Overview

Verifies whether a BSC token's liquidity pool (LP) tokens are locked in known lock contracts (PinkLock, Unicrypt, Mudra, Team Finance) or burned. This is a critical safety check for token investors — unlocked LP means the deployer can rug pull at any time.

## Endpoint

```
GET /mefai/liquidity-lock?address=<token_contract_address>
```

## How It Works

1. **Token Identification** — Reads `name()`, `symbol()`, `totalSupply()` from the token contract.
2. **LP Pair Discovery** — Calls PancakeSwap V2 Factory `getPair(token, WBNB)` to find the LP pair address.
3. **Lock Contract Scanning** — Checks `balanceOf(lockContract)` on the LP pair for each known lock contract:
   - PinkLock V1 (`0x7ee0...`)
   - PinkLock V2 (`0x4079...`)
   - Unicrypt V2 (`0x663a...`)
   - Mudra (`0xc765...`)
   - Team Finance (`0xe2fe...`)
   - Burn addresses (`0xdead...`, `0x0000...`)
4. **Safety Assessment** — Calculates total locked percentage and assigns a safety level.

## BNB Chain Skills Used

| # | Skill | Usage |
|---|-------|-------|
| 1 | `eth_call` | Read token name, symbol, totalSupply |
| 2 | `eth_call` | Query PancakeSwap Factory `getPair()` |
| 3 | `eth_call` | Read LP `totalSupply()` |
| 4 | `eth_call` | Check `balanceOf()` for each lock contract on LP pair |

## Response Fields

- `lockStatus` — Fully Locked / Partially Locked / Minimally Locked / No Lock Found
- `safetyLevel` — Safe / Moderate / Caution / Warning
- `totalLockedPercent` — Percentage of LP tokens in lock contracts
- `locks[]` — Array of detected locks with contract name, type, amount, and percentage
- `hasLiquidityPair` — Whether a PancakeSwap LP pair exists
- `priceUsd`, `liquidityUsd` — Market data from DexScreener

## Architecture

- Checks 7 known lock/burn contracts in parallel
- PancakeSwap V2 Factory at `0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73`
- All on-chain via `eth_call` — no external indexers
- DexScreener for supplementary price/liquidity data
