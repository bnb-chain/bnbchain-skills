# BNB Chain Skills

> Official skills and plugins for building with BNB Chain.

## Introduction

BNB Chain Skills helps AI coding agents install and use BNB Chain developer tools. It includes the BNB Chain MCP skill and the BNB Agent Studio plugin for Claude Code, Cursor, and Codex.

## Marketplace plugins

| Plugin | Description |
|--------|-------------|
| **bnbagent-studio** | Build, run, diagnose, deploy, and monetize BNB Chain seller agents with `bag`. |

This marketplace distributes only `bnbagent-studio`. For `bnbchain-mcp-skill`, use the [standalone skills installation](#standalone-skills) below.

### Install BNB Agent Studio

The `bnbagent-studio` plugin guides agents through creating, running, diagnosing, and deploying BNB Chain seller agents with the `bag` CLI. The plugin does not install the CLI automatically; install it explicitly and verify the version first:

```bash
npm install -g @bnbagent/studio-cli@latest
bag --version
```

Release order: publish Studio first, then publish the matching plugin snapshot to `bnb-chain/bnbchain-skills`. The remote commands below require the marketplace manifests to be merged into that official repository’s default branch. Until that release is published, use a reviewed local checkout with `claude plugin marketplace add /absolute/path/to/bnbchain-skills` or `codex plugin marketplace add /absolute/path/to/bnbchain-skills`.

#### Claude Code

```text
/plugin marketplace add bnb-chain/bnbchain-skills
/plugin install bnbagent-studio@bnbchain-skills
```

#### Cursor

Open **Customize → Plugins**, select the BNB Chain marketplace, and install **BNB Agent Studio**.

#### Codex

```bash
codex plugin marketplace add bnb-chain/bnbchain-skills
codex plugin add bnbagent-studio@bnbchain-skills
```

The marketplace currently contains only `bnbagent-studio`; it does not install `bnbchain-mcp-skill`. The three platform manifests install the same versioned Studio skill payload. See [`plugins/bnbagent-studio`](plugins/bnbagent-studio) for its version, minimum compatible `bag` version, and source commit.

## Claude/Cursor skills vs OpenClaw skills

| | **This repo (bnbchain-skills)** | **OpenClaw skills** |
|---|--------------------------------|---------------------|
| **Who installs** | The **user** installs the skill (e.g. `npx skills add bnb-chain/bnbchain-skills` or copy into `~/.cursor/skills/`). | The **OpenClaw bot** fetches the skill page itself (e.g. `curl` the [OpenClaw Skills](https://docs.bnbchain.org/showcase/mcp/skills) URL) and learns from it. |
| **Who acts** | The **agent** (Cursor/Claude) reads the skill and then **sets up MCP for the user**—adds the bnbchain-mcp server to the user’s MCP config and uses the tools. | The **OpenClaw bot** autonomously knows the `npx @bnb-chain/mcp@latest` command and installs/uses the MCP based on that page. |
| **Purpose** | Teach the in-IDE agent to configure bnbchain-mcp in the user’s environment and use every MCP tool. | Give OpenClaw (and similar agents) a single fetchable page so they can discover and use BNB Chain MCP on their own. |

So: **Claude/Cursor skills** = user installs skill → agent uses it to **set MCP for the user** and call tools. **OpenClaw skills** = bot fetches the skill page → bot **installs and uses** MCP autonomously.

## What are Skills?

Skills are structured knowledge files that give AI coding agents domain-specific expertise. They follow a portable format that works across different AI tools. When you install a skill, the agent learns how to install bnbchain-mcp and how to use each MCP tool without needing to search external docs.

## Standalone skills

These portable skills use `npx skills add` or manual copy. These commands do not register marketplace plugins.

| Skill | Description |
|-------|-------------|
| **bnbchain-mcp-skill** | Install and use BNB Chain MCP — blocks, transactions, contracts, tokens, NFTs, wallet, ERC-8004 agents, and Greenfield. Available through this skills path only. |
| **bnbagent-studio** | The portable Studio skill, as an alternative to the marketplace plugin above. |

Install just the MCP skill:

```bash
npx skills add bnb-chain/bnbchain-skills --skill bnbchain-mcp-skill
```

### Quick Install (Recommended)

```bash
npx skills add bnb-chain/bnbchain-skills
```

Install only the BNB Agent Studio skill:

```bash
npx skills add bnb-chain/bnbchain-skills --skill bnbagent-studio
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
