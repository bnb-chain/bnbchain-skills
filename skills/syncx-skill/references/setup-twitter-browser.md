# X / Twitter Browser Session Mode

## When to Use
Use this when user chooses session-cookie branch (`--twitter-mode browser`) for their workflow.

## Required Values
```env
TWITTER_AUTH_TOKEN=
TWITTER_CT0=
# Optional, script has built-in default value:
TWITTER_WEB_BEARER_TOKEN=
```

## How to Collect
1. Log in to X in a browser profile.
2. Open DevTools -> Application/Storage -> Cookies for `x.com`.
3. Copy values for:
- `auth_token`
- `ct0`
4. Save to `.env` as `TWITTER_AUTH_TOKEN` and `TWITTER_CT0`.

## Verify
```bash
python3 scripts/publish_sync.py \
  --doctor \
  --platforms twitter \
  --twitter-mode browser
```

## Publish Test
```bash
python3 scripts/publish_sync.py \
  --text "CT sync test from browser mode" \
  --platforms twitter \
  --twitter-mode browser
```

## Important Risks
- Cookie tokens expire or are revoked frequently.
- 2FA/account checks can break automation unexpectedly.
- Anti-abuse systems may block requests.
- This mode is less stable than official API mode.

## Source References
- Browser-session style reference implementation: `https://github.com/d60/twikit`

## Recovery
1. Re-export fresh `auth_token` and `ct0`.
2. Ensure the same account remains logged in.
3. Retry with short test text before production posts.
