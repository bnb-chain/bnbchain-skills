# Troubleshooting Playbook

## Fast Triage (always run this first)
1. Config check:
```bash
python3 scripts/publish_sync.py --doctor --platforms square,twitter,tg --twitter-mode official
```
2. Dry-run check:
```bash
python3 scripts/publish_sync.py --text "ping" --platforms square,twitter,tg --dry-run
```
3. Real publish and inspect per-platform JSON errors.

## Binance Square Issues

### `220011` / content empty
- Cause: empty `bodyTextOnly`.
- Fix: pass `--text` or `--text-file` with non-empty content.

### `220003` / key not found
- Cause: wrong API key.
- Fix: regenerate key from Creator Center and update `BINANCE_SQUARE_API_KEY`.

### `220004` / key expired
- Fix: rotate and replace key.

### `220009` / daily limit exceeded
- Fix: wait quota reset; avoid repeated retries.

### `20022` / risky content
- Fix: remove risky words/URLs and retry.

## X Official API Issues

### Missing credential keys
- Run doctor and fill all 4 fields:
- `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_SECRET`

### 401 / 403-like API failure
- Check app write permission.
- Regenerate access token after permission update.
- Ensure posting account is healthy and not restricted.

## X Browser Mode Issues

### Cookie mode always fails
- Re-export `auth_token` and `ct0` from fresh logged-in session.
- Keep same browser account login alive.
- Confirm `--twitter-mode browser` is used.

### Works once then fails later
- Tokens expired or invalidated by security checks.
- Re-capture cookies and retry.

## Telegram Issues

### Bot cannot post to channel
- Bot not admin or no posting rights.
- Add bot as admin and enable post permission.

### Wrong chat ID
- Re-fetch from Bot API `getUpdates` after sending a fresh message.

### No URL returned
- Channel may not have public username.
- Set `TELEGRAM_CHANNEL_USERNAME` if available.

## Threads Issues

### Publish step fails after create succeeds
- Token lacks publish scope or token expired.
- Re-authorize app and refresh access token.

## Debugging Tips
- Keep first test text short and plain.
- Test one platform at a time before full fan-out.
- Use JSON output as source of truth; do not assume partial success.
