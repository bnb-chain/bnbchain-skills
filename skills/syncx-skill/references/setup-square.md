# Binance Square Setup

## Goal
Enable OpenClaw/AI to publish text posts to Binance Square using `BINANCE_SQUARE_API_KEY`.

## Steps
1. Open Binance App or Web and go to Creator Center (`创作者中心`).
2. Enter the API section and create/refresh your Square publishing API key.
3. Copy the key and store it in `.env`:
```env
BINANCE_SQUARE_API_KEY=your_real_key
```
4. Verify with doctor:
```bash
python3 scripts/publish_sync.py --doctor --platforms square
```

## Source References
- Binance official Square skill reference:
  - `https://github.com/binance/binance-skills-hub/tree/main/skills/binance/square-post`
- Endpoint definition in cloned reference:
  - `references/binance-skills-hub/skills/binance/square-post/SKILL.md`

## Publish Endpoint (used by script)
- `POST https://www.binance.com/bapi/composite/v1/public/pgc/openApi/content/add`
- Header `X-Square-OpenAPI-Key: <key>`
- Body field `bodyTextOnly`

## Known Limits
- Current skill flow is text-only for Square.
- Each API key has a daily success quota (commonly 100/day by default).

## Common Square Error Codes
- `000000`: success
- `220003`: API key not found
- `220004`: API key expired
- `220009`: daily OpenAPI quota exceeded
- `220010`: unsupported content type
- `220011`: content is empty
- `20013`: content too long
- `20022`: sensitive/risky content detected

## Security
- Do not share key screenshots.
- Rotate key immediately if leaked.
- Keep a dedicated posting key with minimal scope.
