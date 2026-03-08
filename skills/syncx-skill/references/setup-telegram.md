# Telegram Setup (Bot -> Channel/Group)

## Goal
Allow the same post to be pushed to Telegram via Bot API (`--platforms ... ,tg`).

## Required Values
```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
# Optional:
TELEGRAM_PARSE_MODE=
TELEGRAM_CHANNEL_USERNAME=
```

## Step-by-Step
1. Open `@BotFather` and create a bot (`/newbot`), copy token.
2. Add the bot into target group/channel.
3. Grant admin posting permission if target is a channel.
4. Determine `chat_id`.

## Getting `chat_id`
- Private chat with bot: send any message to bot, then inspect `getUpdates`.
- Group/channel: add bot, send one message, inspect `getUpdates` result.
- Channel IDs are often negative numeric values (for example `-100...`).

## Verify
```bash
python3 scripts/publish_sync.py --doctor --platforms tg
```

## Publish Test
```bash
python3 scripts/publish_sync.py \
  --text "CT sync test to telegram" \
  --platforms tg
```

## Channel URL Notes
- If channel has public username, set `TELEGRAM_CHANNEL_USERNAME` (without `@`) to get clickable URL output.
- Without public username, message can still send successfully but URL may be unavailable.

## Source References
- Telegram Bot API: `https://core.telegram.org/bots/api`
- sendMessage: `https://core.telegram.org/bots/api#sendmessage`
