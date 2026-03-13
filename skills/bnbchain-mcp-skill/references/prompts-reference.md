# MCP prompts reference

The BNB Chain MCP server exposes **prompts** that return guided analysis or explanations. Use these prompt names when invoking MCP prompts (e.g. from Cursor or Claude).

| Prompt name | When to use | Parameters |
|-------------|-------------|------------|
| **analyze_block** | User wants detailed information about a block (transactions, gas, etc.). | `blockNumber` (required), `network` (optional) |
| **analyze_transaction** | User wants analysis of a specific transaction (hash). | `txHash` (required), `network` (optional) |
| **analyze_address** | User wants analysis of an EVM address (balances, contracts, activity). | `address` (required), `network` (optional) |
| **interact_with_contract** | User needs guidance on how to interact with a smart contract (read/write, ABI, params). | `contractAddress` (required), `network` (optional) |
| **explain_evm_concept** | User asks about an EVM concept (gas, opcodes, ABI, etc.). | `concept` (required) |
| **compare_networks** | User wants to compare EVM-compatible networks (BSC, opBNB, Ethereum, etc.). | `networks` (required, e.g. “bsc, opbnb”) |
| **analyze_token** | User wants to analyze an ERC20 or NFT token (metadata, supply, etc.). | `tokenAddress` (required), `network` (optional) |
| **how_to_register_mcp_as_erc8004_agent** | User wants step-by-step guidance on registering an MCP server as an ERC-8004 agent. | (none) |

Prefer these prompts when the user asks for “analysis,” “explanation,” or “how to” rather than a single raw tool call.
