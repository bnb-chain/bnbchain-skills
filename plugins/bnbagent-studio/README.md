# BNB Agent Studio plugin

Generated from `packages/studio-cli/skills` at Studio commit `49d7b28505b78cf0b75ac36f060d3b5ddb4c2de1`. Do not edit this snapshot directly.

Plugin version: `0.0.14`. Required runtime: `bag >=0.0.14`.
CLI build paired with this snapshot: `0.0.14`. Prerelease CLI builds are not covered by the stable minimum-version range.

This plugin is distributed under Apache-2.0; see [LICENSE](LICENSE). The hosting repository may use a different license for other content.

The marketplace contains the bnbagent-studio plugin. bnbchain-mcp-skill uses the separate skills installation path.

distribution.json checksums are verified by Studio's release tooling. Native plugin clients do not verify this custom metadata; install only from the intended repository and review its signed source commit.
Content changes require a new plugin version so installed clients receive the update.

Install or upgrade the runtime explicitly:

```bash
npm install -g @bnbagent/studio-cli@latest
bag --version
```

The plugin never installs `bag` automatically.

Release order: publish Studio first, then publish the matching plugin snapshot to bnb-chain/bnbchain-skills. The remote commands below require the marketplace manifests to be published on that official repository's default branch. Before publication, use a reviewed local export with `claude plugin marketplace add /absolute/path/to/bnbchain-skills`.

## Claude Code

```text
/plugin marketplace add bnb-chain/bnbchain-skills
/plugin install bnbagent-studio@bnbchain-skills
```

## Cursor

Open **Customize → Plugins**, select the BNB Chain marketplace, and install **BNB Agent Studio**.

## Codex

```bash
codex plugin marketplace add bnb-chain/bnbchain-skills
codex plugin add bnbagent-studio@bnbchain-skills
```

Restart or open a new Codex session after installation.
