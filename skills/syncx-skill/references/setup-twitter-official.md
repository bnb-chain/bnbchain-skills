# X / Twitter Official API Setup

## Goal
Enable reliable tweet publishing through official API mode (`--twitter-mode official`).

## Required Credentials
Put all four values in `.env`:
```env
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
```

## How to Get Them
1. Open X Developer Portal and create/select a project + app.
2. Ensure your app has post/write capability for user-context posting.
3. Generate credentials for the posting account:
- API Key -> `TWITTER_API_KEY`
- API Secret -> `TWITTER_API_SECRET`
- Access Token -> `TWITTER_ACCESS_TOKEN`
- Access Token Secret -> `TWITTER_ACCESS_SECRET`
4. If app permissions are changed later, regenerate access token/secret.
5. Save all four values to `.env`.

## Verify
```bash
python3 scripts/publish_sync.py \
  --doctor \
  --platforms twitter \
  --twitter-mode official
```

## Publish Test
```bash
python3 scripts/publish_sync.py \
  --text "CT sync test from official API" \
  --platforms twitter \
  --twitter-mode official
```

## Endpoint (used by script)
- `POST https://api.x.com/2/tweets`
- OAuth1 user-context signature in `Authorization` header
- JSON body: `{"text": "..."}`

## Source Docs
- X posts creation docs: `https://docs.x.com/x-api/posts/creation-of-a-post`
- X developer portal: `https://developer.x.com/`

## Failure Checklist
1. Check whether app has write permission.
2. Regenerate access token/secret after permission changes.
3. Confirm account is not restricted/suspended.
4. Re-run doctor and verify no missing fields.
