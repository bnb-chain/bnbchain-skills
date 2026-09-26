# Quick Start (10 Minutes)

## 0) Verify environment
```bash
python3 --version
python3 scripts/publish_sync.py --help
```
If this fails, follow `references/environment.md`.

## 1) Generate local config template
```bash
python3 scripts/publish_sync.py --init-config
```

## 2) Fill minimum fields for MVP (Square + X)
Edit `.env`:
```env
BINANCE_SQUARE_API_KEY=...
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_SECRET=...
```

## 3) Validate credentials
```bash
python3 scripts/publish_sync.py \
  --doctor \
  --platforms square,twitter \
  --twitter-mode official
```

## 4) Post once
```bash
python3 scripts/publish_sync.py \
  --text "BTC 日内关注 68k 支撑，严格止损" \
  --platforms square,twitter \
  --twitter-mode official
```

## 5) Expand to Telegram
Append to `.env`:
```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```
Then publish:
```bash
python3 scripts/publish_sync.py \
  --text "复盘更新" \
  --platforms square,twitter,tg
```
