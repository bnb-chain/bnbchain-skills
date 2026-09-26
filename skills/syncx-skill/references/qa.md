# Q&A (Self-Contained)

## Q1: Where do I get Binance Square API key?
From Binance Creator Center -> API section -> create/view Square posting API key. Put into `BINANCE_SQUARE_API_KEY`.

## Q2: Why can Square post fail even with valid key?
Common reasons: empty text (`220011`), risky text (`20022`), daily quota exceeded (`220009`), expired key (`220004`).

## Q3: How do I configure X official API mode?
Prepare 4 values in `.env`:
- `TWITTER_API_KEY`
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_SECRET`
Then run doctor with `--twitter-mode official`.

## Q4: How do I configure X browser mode (token/cookie mode)?
Get `auth_token` and `ct0` cookies from logged-in browser session and set:
- `TWITTER_AUTH_TOKEN`
- `TWITTER_CT0`
Then publish with `--twitter-mode browser`.

## Q5: Official mode vs browser mode, which is better?
Official mode is more stable and recommended. Browser mode is an alternate branch for session-cookie based workflows.

## Q6: How do I send to Telegram channel automatically?
Create bot via `@BotFather`, add bot as channel admin, set:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
Use platform list including `tg`.

## Q7: Can I do one-click sync to Square + X together?
Yes:
```bash
python3 scripts/publish_sync.py \
  --text "你的文案" \
  --platforms square,twitter \
  --twitter-mode official
```

## Q8: Can this also include TG/Threads?
Yes. Add `tg` and/or `threads` to `--platforms` once credentials are configured.

## Q9: Can image/video be synced too?
Current Square open API flow in this skill is text-first. X/TG media can be extended later, but this package focuses on stable text sync MVP.

## Q10: How do I verify setup without posting real content?
Use dry-run:
```bash
python3 scripts/publish_sync.py --text "test" --platforms square,twitter --dry-run
```
And config doctor:
```bash
python3 scripts/publish_sync.py --doctor --platforms square,twitter
```

## Q11: What if `python3` command is missing?
Follow `references/environment.md` and install Python first, then rerun quick checks:
```bash
python3 --version
python3 scripts/publish_sync.py --help
```
