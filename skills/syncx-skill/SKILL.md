---
name: syncx
displayName: syncx
version: 1.0.0
description: One-stop crypto creator autopost workflow for syncing the same text post to Binance Square and X/Twitter (plus optional Telegram, Threads, and Farcaster via Neynar) in a single command. Use when user asks to "sync post", "cross-post", "一键同步", "同时发推和广场", "发到 TG/Threads/Farcaster", or needs setup/troubleshooting for Binance Square API key, X API credentials, X browser-cookie mode, Telegram bot/channel posting, Farcaster Neynar signer setup, and multi-platform posting automation.
---

# SyncX｜加密信息一站式同步器

## Overview
Use this skill as an interaction-first autopost operator for crypto creators.
Guide user through setup, verification, and publishing with clear branch routing, with Binance Square + X as the default target pair.

## Prerequisites
All command examples assume you run from `SyncX/skills/syncx`:

```bash
git clone https://github.com/SyncX2026/SyncX.git
cd SyncX/skills/syncx
```

## Core Workflow
1. Route intent first.
- `publish-now`: user already has content and wants immediate sync.
- `setup`: user asks how to configure API/token.
- `troubleshoot`: user has failure codes or partial success.
2. Confirm target platforms.
- Default to `square,twitter` when user says "同步" but does not specify.
3. Select X mode as a normal branch.
- Branch A: `official` (X developer credentials path).
- Branch B: `browser` (session cookie path: `auth_token + ct0`).
4. Ensure config exists.
- Run `python3 scripts/publish_sync.py --init-config` if `.env` is missing.
- Or copy `.env.example` to `.env`.
5. Fill config safely.
- Never print full secret values back to user.
- If user shares keys in chat, persist only to local `.env` and mask in output.
6. Validate before posting.
- Run `python3 scripts/publish_sync.py --doctor --platforms <...> --twitter-mode <...>`.
7. Publish and return structured result.
- Run `python3 scripts/publish_sync.py --text "..." --platforms <...> --twitter-mode <...>`.
- Return success/failure per platform with URL/ID when available.

## Interactive Routing Rules
Apply this branch logic in every conversation:

1. If user says "直接发" and provided text:
- Run doctor first.
- If doctor fails, ask only for missing keys and provide the exact reference file.
- Once doctor passes, execute publish.

2. If user asks "怎么配":
- Route by platform and mode.
- For X: ask whether they want `official` or `browser` path.
- Return copy-ready `.env` keys and exact command sequence.

3. If user says "报错了":
- Ask for raw JSON output or error code.
- Route to `references/troubleshooting.md`.
- Retry with single-platform test, then fan-out test.

4. If environment is missing (`python` not found, command not found):
- Route to `references/environment.md`.
- Complete environment checks first, then continue normal flow.

## Command Patterns
Use these exact command shapes.

### 1) Initialize local config
```bash
python3 scripts/publish_sync.py --init-config
```

### 2) Validate config only
```bash
python3 scripts/publish_sync.py \
  --doctor \
  --platforms square,twitter \
  --twitter-mode official
```

### 3) Publish to Binance Square + X (default MVP)
```bash
python3 scripts/publish_sync.py \
  --text "BTC 回踩后继续上攻，关注 4h 结构" \
  --platforms square,twitter \
  --twitter-mode official
```

### 4) Publish to X browser-session mode + Square
```bash
python3 scripts/publish_sync.py \
  --text "今日策略更新：严格风控" \
  --platforms square,twitter \
  --twitter-mode browser
```

### 5) Publish to Square + X + Telegram
```bash
python3 scripts/publish_sync.py \
  --text "晚间复盘：BTC 关键位 68k" \
  --platforms square,twitter,tg \
  --twitter-mode official
```

### 6) Dry run for safe pre-check
```bash
python3 scripts/publish_sync.py \
  --text "test" \
  --platforms square,twitter,tg,threads,farcaster \
  --twitter-mode official \
  --dry-run
```

### 7) Publish to Farcaster only
```bash
python3 scripts/publish_sync.py \
  --text "今日复盘：BTC 4h 级别出现结构拐点" \
  --platforms farcaster
```

## Farcaster Neynar Setup
Farcaster 通过 Neynar managed signer 路径接入，必须完成 signer 批准后才能发帖。

Required env keys:
- `NEYNAR_API_KEY`
- `FARCASTER_SIGNER_UUID`

Steps:
1. 在 Neynar 注册并创建 App，获取 `NEYNAR_API_KEY`。
2. 在 Neynar 发起 signer request。
3. 用 Warpcast 打开签名链接并批准 signer。
4. 将 signer UUID 写入 `FARCASTER_SIGNER_UUID`。

Verification:
```bash
python3 scripts/publish_sync.py --doctor --platforms farcaster
```

## Platform Matrix
- `square`: Binance Square OpenAPI text publishing.
- `twitter` (`official`): X API v2 `/2/tweets` with OAuth1 user credentials.
- `twitter` (`browser`): X web-session mode using `auth_token + ct0` cookies.
- `tg`: Telegram Bot API `sendMessage` to channel/group/chat.
- `threads`: Optional Graph API two-step publish.
- `farcaster`: Neynar `cast` API with approved `signer_uuid`.

## Setup References
Load only the file you need:
- Quick start: `references/get-started.md`
- Environment and runtime checks: `references/environment.md`
- Binance Square setup: `references/setup-square.md`
- X official API setup: `references/setup-twitter-official.md`
- X browser mode setup: `references/setup-twitter-browser.md`
- Telegram setup: `references/setup-telegram.md`
- Threads setup: `references/setup-threads.md`
- Farcaster (Neynar) setup: `SKILL.md#farcaster-neynar-setup`
- Troubleshooting: `references/troubleshooting.md`
- Q&A script: `references/qa.md`
- Source links: `references/sources.md`

## Behavior Rules
1. Prefer execution over explanation.
- If user gave text and asked to sync, run doctor then post.
2. Fail partially, report fully.
- One platform failure must not block others.
- Return per-platform status with error details.
3. Keep secrets safe.
- Never echo full tokens.
- Use masked format like `abc12...9xyz` in summaries.
4. Respect content limitations.
- Binance Square API currently supports text-only posts in this flow.
5. Ask only when truly blocked.
- Missing required key/token should trigger a concise request for exactly the missing item.
6. Keep interactions stepwise.
- Ask one blocking question at a time.
- Always provide the next executable command, not generic advice.

## Practical Defaults
- Default `platforms`: `square,twitter`
- Default `twitter-mode`: `official`
- Default config path: `SyncX/skills/syncx/.env`
- Timeout: `25s`

## Quick Troubleshooting Hooks
When publish fails, run these in order:
1. `python3 scripts/publish_sync.py --doctor --platforms <...> --twitter-mode <...>`
2. `python3 scripts/publish_sync.py --text "ping" --platforms <...> --dry-run`
3. Re-run publish and inspect platform-specific error in JSON output.

## Local Validation
Run smoke test before release changes:
```bash
python3 scripts/smoke_test.py
```
