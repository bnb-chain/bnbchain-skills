# x402 payment reference

HTTP 402 Payment Required protocol for zero-account certification. Pay per request in USDC on Base -- no API key, no signup, no account needed.

---

## Payment flow

### Step 1 -- Send request without auth

```bash
curl -i -X POST https://xproof.app/api/proof \
  -H "Content-Type: application/json" \
  -d '{
    "file_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "filename": "agent_output.pdf"
  }'
```

### Step 2 -- Parse the 402 challenge

```
HTTP/1.1 402 Payment Required
```

```json
{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "exact",
      "price": "$0.05",
      "network": "eip155:8453",
      "asset": "USDC",
      "payTo": "0x...",
      "maxTimeoutSeconds": 60,
      "description": "xproof single file certification"
    }
  ],
  "resource": "https://xproof.app/api/proof",
  "description": "xproof single file certification",
  "mimeType": "application/json"
}
```

Read `accepts[0]` to extract `network`, `price`, `payTo`, and `asset`.

### Step 3 -- Pay on Base and retry

1. Transfer 0.05 USDC to `payTo` on Base Mainnet (eip155:8453) via an x402 facilitator
2. Get a signed payment receipt (base64-encoded JSON)
3. Retry the original request with the `X-Payment` header:

```bash
curl -X POST https://xproof.app/api/proof \
  -H "Content-Type: application/json" \
  -H "X-Payment: eyJ4NDAyVmVyc2lvbiI6MSwi..." \
  -d '{
    "file_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "filename": "agent_output.pdf"
  }'
```

### Step 4 -- Receive proof

```json
{
  "proof_id": "prf_abc123",
  "status": "certified",
  "verify_url": "https://xproof.app/proof/prf_abc123",
  "blockchain": {
    "network": "MultiversX",
    "transaction_hash": "0xabc...",
    "explorer_url": "https://explorer.multiversx.com/transactions/0xabc..."
  }
}
```

---

## Pricing

| Endpoint | Price |
|----------|-------|
| `POST /api/proof` | $0.05 per certification |
| `POST /api/batch` | $0.05 per file in batch |
| `POST /api/audit` | $0.05 per audit entry |

---

## Network details

| Parameter | Value |
|-----------|-------|
| Chain | Base Mainnet |
| Chain ID | eip155:8453 |
| Asset | USDC (USD Coin) |
| Facilitator | https://www.x402.org/facilitator |

---

## Supported endpoints

Both certification and audit endpoints support x402:

- `POST /api/proof` -- single file
- `POST /api/batch` -- batch (up to 50 files)
- `POST /api/audit` -- audit entry

---

## Why x402 for BNB Chain agents?

- **No account required** -- any agent with USDC on Base can certify immediately
- **Cross-chain native** -- BNB Chain agents already interact with Base/EVM ecosystems
- **Standard protocol** -- follows the x402 HTTP payment specification
- **Composable** -- works alongside ERC-8004 identity, no wallet conflict
- **Low friction** -- one round-trip: request, pay, certified
