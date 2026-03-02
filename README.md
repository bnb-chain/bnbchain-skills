# BNB Chain Skills

> A collection of AI agent skills for the [BNB Chain MCP](https://github.com/bnb-chain/bnbchain-mcp) (Model Context Protocol) server.

## Introduction

BNB Chain Skills helps AI agents (e.g. Cursor, Claude) install and use the BNB Chain MCP server effectively. It provides structured knowledge on how to connect the MCP server, configure credentials, and use each available tool for blocks, transactions, contracts, tokens, NFTs, wallet operations, ERC-8004 agent registration, and Greenfield storage.

## Claude/Cursor skills vs OpenClaw skills

| | **This repo (bnbchain-skills)** | **OpenClaw skills** |
|---|--------------------------------|---------------------|
| **Who installs** | The **user** installs the skill (e.g. `npx skills add bnb-chain/bnbchain-skills` or copy into `~/.cursor/skills/`). | The **OpenClaw bot** fetches the skill page itself (e.g. `curl` the [OpenClaw Skills](https://docs.bnbchain.org/showcase/mcp/skills) URL) and learns from it. |
| **Who acts** | The **agent** (Cursor/Claude) reads the skill and then **sets up MCP for the user**—adds the bnbchain-mcp server to the user’s MCP config and uses the tools. | The **OpenClaw bot** autonomously knows the `npx @bnb-chain/mcp@latest` command and installs/uses the MCP based on that page. |
| **Purpose** | Teach the in-IDE agent to configure bnbchain-mcp in the user’s environment and use every MCP tool. | Give OpenClaw (and similar agents) a single fetchable page so they can discover and use BNB Chain MCP on their own. |

So: **Claude/Cursor skills** = user installs skill → agent uses it to **set MCP for the user** and call tools. **OpenClaw skills** = bot fetches the skill page → bot **installs and uses** MCP autonomously.

## What are Skills?

Skills are structured knowledge files that give AI coding agents domain-specific expertise. They follow a portable format that works across different AI tools. When you install a skill, the agent learns how to install bnbchain-mcp and how to use each MCP tool without needing to search external docs.

## Available Skills

| Skill | Description |
|-------|-------------|
| **bnbchain-mcp-skill** | Install and use BNB Chain MCP — blocks, transactions, contracts, tokens, NFTs, wallet, ERC-8004 agents, Greenfield. Covers connection, credentials, and every MCP tool. |

## Installation

### Quick Install (Recommended)

```bash
npx skills add bnb-chain/bnbchain-skills
```

Install globally (available across all projects):

```bash
npx skills add bnb-chain/bnbchain-skills -g
```

### Manual Install (Cursor / Claude)

**Personal skill** (available across all projects):

```bash
git clone https://github.com/bnb-chain/bnbchain-skills.git
cp -r bnbchain-skills/skills/* ~/.cursor/skills/
```

**Project skill** (current project only):

```bash
git clone https://github.com/bnb-chain/bnbchain-skills.git
cp -r bnbchain-skills/skills/* .cursor/skills/
```

### Using the skill

Once installed, the agent will use the skill when you ask to:

- Install or connect BNB Chain MCP
- Query blocks, transactions, balances, or contracts on BNB Chain or other EVM networks
- Transfer tokens or NFTs, or interact with smart contracts
- Register or resolve ERC-8004 agents
- Use Greenfield storage (buckets, objects, payments)

Example prompts:

- "How do I install bnbchain-mcp in Cursor?"
- "Get the latest block on BSC"
- "Check the ERC-20 balance of 0x... on opBNB"
- "Register this MCP as an ERC-8004 agent"
- "List my Greenfield buckets"

## Skill Structure

```
bnbchain-skills/
├── skills/
│   └── bnbchain-mcp-skill/
│       ├── SKILL.md                    # Main skill: install + tool usage
│       └── references/
│           ├── evm-tools-reference.md     # Blocks, transactions, contracts, tokens, NFT, wallet, network
│           ├── erc8004-tools-reference.md  # ERC-8004 agent tools
│           ├── greenfield-tools-reference.md # Greenfield storage & payment tools
│           └── prompts-reference.md         # MCP prompts
├── LICENSE
└── README.md
```

## References

- **BNB Chain MCP:** https://github.com/bnb-chain/bnbchain-mcp
- **npm package:** `@bnb-chain/mcp` — run with `npx @bnb-chain/mcp@latest`
- **ERC-8004** (Identity Registry); **Agent Metadata Profile** for agentURI format.

## License

MIT License — see [LICENSE](LICENSE) for details.
