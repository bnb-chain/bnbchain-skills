---
name: bnbchain-mcp
displayName: bnbchain-mcp
version: 1.0.0
description: BNB Chain MCP server connection and tool usage. Covers npx @bnb-chain/mcp@latest, PRIVATE_KEY and RPC, and every MCP tool — blocks, transactions, contracts, ERC20/NFT transfers, wallet, ERC-8004 agent registration, Greenfield. Use when connecting to bnbchain-mcp, querying or transacting on BNB Chain/opBNB/EVM, registering as ERC-8004 agent, or using Greenfield.
---

# BNB Chain MCP Skill

How to connect to the BNB Chain MCP server and use its tools: blocks, transactions, contracts, tokens, NFTs, wallet, ERC-8004 agents, and Greenfield. Use this skill when working with BNB Chain / opBNB / EVM or Greenfield via MCP.

---

## Connection and credentials

- **Run the server:** `npx @bnb-chain/mcp@latest` (fetches from npm at runtime). Source: [github.com/bnb-chain/bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp).
- **RPC:** Default chains use built-in RPC; no config unless self-hosting or custom RPC.
- **PRIVATE_KEY:** Omit or leave empty for read-only (blocks, balances, contract reads). Set in the MCP server `env` for state-changing tools (transfers, `write_contract`, `approve_token_spending`, ERC-8004 register/set_uri, Greenfield writes). Never log or expose private keys.
- **Read-only vs state-changing:** Block/balance/contract-read tools work without a key; transfers and writes require `PRIVATE_KEY` in the server environment.

---

## 1. MCP server config

Add the `bnbchain-mcp` server to the MCP client config (e.g. Cursor MCP settings, Claude Desktop `claude_desktop_config.json`).

**Default (stdio):**

```json
{
  "mcpServers": {
    "bnbchain-mcp": {
      "command": "npx",
      "args": ["-y", "@bnb-chain/mcp@latest"],
      "env": {
        "PRIVATE_KEY": ""
      }
    }
  }
}
```

**SSE mode:** `"args": ["-y", "@bnb-chain/mcp@latest", "--sse"]` (and client SSE URL if required). **Local dev server** (e.g. `bun dev:sse` in bnbchain-mcp): `"url": "http://localhost:3001/sse"` with the same `env`.

Restart or reload the MCP client after changing config so the server starts.

---

## 2. Credentials and environment

- **RPC:** Built-in for default chains.
- **PRIVATE_KEY:** Set in the server’s `env` when state-changing tools are needed; leave empty for read-only. Do not commit or echo keys.

---

## 3. Agent registration (ERC-8004)

1. Register the agent on-chain with the MCP tool **`register_erc8004_agent`** (see [references/erc8004-tools-reference.md](references/erc8004-tools-reference.md)).
2. Owners can then check registration on 8004scan (mainnet) or 8004scan (testnet).

---

## 4. Quick reference — tools and prompts

### Network parameter

Most EVM tools accept **`network`** (optional): chain name or ID, e.g. `bsc`, `opbnb`, `ethereum`, `base`. Default is `bsc`. Use **`get_supported_networks`** to list supported networks.

### Tool categories

| Category | Examples | Needs PRIVATE_KEY? |
|----------|----------|--------------------|
| Blocks | `get_latest_block`, `get_block_by_number`, `get_block_by_hash` | No |
| Transactions | `get_transaction`, `get_transaction_receipt`, `estimate_gas` | No (estimate only) |
| Network | `get_chain_info`, `get_supported_networks` | No |
| Wallet / balance | `get_native_balance`, `get_erc20_balance`, `get_address_from_private_key` | Balance: optional address or privateKey |
| Transfers / writes | `transfer_native_token`, `transfer_erc20`, `transfer_nft`, `transfer_erc1155`, `approve_token_spending`, `write_contract` | Yes |
| Contracts | `read_contract`, `is_contract` | No for read |
| Tokens / NFT | `get_erc20_token_info`, `get_nft_info`, `get_erc1155_token_metadata`, `check_nft_ownership`, `get_nft_balance`, `get_erc1155_balance` | No for read |
| ERC-8004 | `register_erc8004_agent`, `set_erc8004_agent_uri`, `get_erc8004_agent`, `get_erc8004_agent_wallet` | Register/set_uri: Yes |
| Greenfield | `gnfd_*` bucket/object/payment tools | Writes: Yes |

### Prompts (MCP prompts)

Use the MCP prompt names when the user wants analysis or guidance:

- **analyze_block** — Analyze a block and its contents
- **analyze_transaction** — Analyze a specific transaction
- **analyze_address** — Analyze an EVM address
- **interact_with_contract** — Guidance on interacting with a smart contract
- **explain_evm_concept** — Explain an EVM concept
- **compare_networks** — Compare EVM-compatible networks
- **analyze_token** — Analyze an ERC20 or NFT token
- **how_to_register_mcp_as_erc8004_agent** — Guidance on registering MCP as ERC-8004 agent

---

## 5. Reference files (per-tool usage)

For **parameter names, examples, and detailed usage** of each tool, use:

| Reference | Content |
|-----------|---------|
| [references/evm-tools-reference.md](references/evm-tools-reference.md) | Blocks, transactions, network, wallet, contracts, tokens, NFT — all EVM tools |
| [references/erc8004-tools-reference.md](references/erc8004-tools-reference.md) | register_erc8004_agent, set_erc8004_agent_uri, get_erc8004_agent, get_erc8004_agent_wallet |
| [references/greenfield-tools-reference.md](references/greenfield-tools-reference.md) | Buckets, objects, folders, payment accounts — all Greenfield tools |
| [references/prompts-reference.md](references/prompts-reference.md) | All MCP prompts and when to use them |

---

## 6. Safety and best practices

1. **Confirm before sending transactions:** For `transfer_*`, `write_contract`, or `approve_token_spending`, confirm recipient, amount, and network before calling the tool.
2. **Prefer testnet** when the network is unspecified for writes or agent registration.
3. **Private keys:** Only in MCP server `env`; never in chat or logs.
4. **ERC-8004 agentURI:** JSON metadata per the Agent Metadata Profile (name, description, image, services e.g. MCP endpoint).

---

## Documentation links

- **BNB Chain MCP repo:** https://github.com/bnb-chain/bnbchain-mcp
- **npm:** `npx @bnb-chain/mcp@latest`
- **ERC-8004** (Identity Registry); **Agent Metadata Profile** for agentURI format.
