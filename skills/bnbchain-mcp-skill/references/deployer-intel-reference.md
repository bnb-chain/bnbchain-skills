# Token Deployer Intel — BNB Chain MCP Skill Reference

## Overview

Traces the deployer of any BSC token contract, derives all sibling contracts deployed by the same address using Ethereum CREATE address derivation (RLP encoding + Keccak-256), and checks each sibling's market survival status. This reveals serial deployers and rug pull patterns.

## Endpoint

```
GET /mefai/deployer-intel?address=<token_contract_address>
```

## How It Works

1. **Deployer Discovery** — Calls `owner()` on the target token to identify the deployer address.
2. **Nonce Analysis** — Gets the deployer's current nonce via `eth_getTransactionCount` to determine how many contracts they may have deployed.
3. **CREATE Address Derivation** — For each nonce 0 to N, computes the deterministic contract address using `keccak256(rlp([deployer_address, nonce]))`. This is the Ethereum CREATE opcode formula.
4. **Sibling Verification** — Batch-checks `eth_getCode` on each derived address to confirm which ones are actual deployed contracts.
5. **Survival Analysis** — Queries DexScreener for each sibling to check if it has active trading pairs with liquidity > $100.
6. **Risk Assessment** — Calculates deployer risk based on the dead-to-alive ratio of sibling contracts.

## BNB Chain Skills Used

| # | Skill | Usage |
|---|-------|-------|
| 1 | `eth_call` | Read `owner()`, `name()`, `symbol()` |
| 2 | `eth_getTransactionCount` | Get deployer nonce |
| 3 | `eth_getBalance` | Check deployer BNB balance |
| 4 | `eth_getCode` | Verify which derived addresses are contracts |

## Response Fields

- `deployer` — Deployer address
- `deployerRisk` — Risk assessment based on sibling survival rate
- `totalContractsDeployed` — Number of contracts from this deployer
- `aliveContracts` — Contracts with active trading
- `deadContracts` — Contracts with no liquidity
- `siblings[]` — List of sibling contracts with name, symbol, alive status, and market data

## Architecture

- Uses `rlp` and `eth-hash` Python libraries for CREATE address derivation
- Checks up to 50 nonces (covers most deployers)
- Parallel batch RPC calls for code verification
- DexScreener for market survival validation
- Known entity lookup for deployer identification
