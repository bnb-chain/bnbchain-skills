# Certification tools reference

Certify files, audit decisions, and verify proofs via the xProof REST API.

**Base URL:** `https://xproof.app`

---

## POST /api/proof **(certify single file)**

Create an immutable, blockchain-anchored proof of existence for a file.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file_hash | string | yes | SHA-256 hex hash (exactly 64 characters) |
| filename | string | yes | Original filename |
| author_name | string | no | Defaults to "AI Agent" |
| webhook_url | string | no | HTTPS URL to receive confirmation callback |

**Headers:** `Authorization: Bearer pm_<api_key>` or `X-Payment: <base64>` (x402)

**Response (200):**

```json
{
  "proof_id": "uuid",
  "status": "certified",
  "file_hash": "e3b0c44298fc1c149afbf4c8996fb924...",
  "filename": "output.pdf",
  "verify_url": "https://xproof.app/proof/uuid",
  "certificate_url": "https://xproof.app/api/certificates/uuid.pdf",
  "proof_json_url": "https://xproof.app/proof/uuid.json",
  "blockchain": {
    "network": "MultiversX",
    "transaction_hash": "txhash...",
    "explorer_url": "https://explorer.multiversx.com/transactions/txhash..."
  },
  "timestamp": "2026-03-08T00:00:00.000Z"
}
```

If the file was already certified, the existing proof is returned with the same structure.

---

## POST /api/batch **(certify multiple files)**

Certify up to 50 files in a single call.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| files | array | yes | Array of `{file_hash, filename}` objects |
| author_name | string | no | Applied to all files |

**Response (200):** Array of certification results, one per file.

---

## POST /api/audit **(audit a decision)**

Certify an agent decision on-chain BEFORE executing a critical action.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| agent_id | string | yes | Agent identifier (wallet, DID, ERC-8004 ID, or name) |
| session_id | string | yes | UUID for this execution session |
| action_type | string | yes | Category: trade, deploy, data_access, transfer, api_call |
| action_description | string | yes | Human-readable description of intent |
| inputs_hash | string | yes | SHA-256 of the action inputs (64 hex chars) |
| risk_level | enum | yes | low, medium, high, critical |
| risk_summary | string | no | Explanation of risk factors |
| decision | enum | yes | approved, rejected, deferred |
| context | object | no | Additional metadata (model, environment, etc.) |

**Response (200):**

```json
{
  "proof_id": "uuid",
  "audit_url": "https://xproof.app/audit/uuid",
  "proof_url": "https://xproof.app/proof/uuid",
  "decision": "approved",
  "risk_level": "high",
  "inputs_hash": "abc123...",
  "blockchain": {
    "network": "mainnet",
    "transaction_hash": "txhash...",
    "explorer_url": "https://explorer.multiversx.com/transactions/txhash..."
  }
}
```

**Enforcement:** If `proof_id` is absent, the API errors, or the request times out -- agent MUST stop execution. No fallback.

**Canonical schema:** `https://xproof.app/.well-known/agent-audit-schema.json`

---

## GET /api/proof/:id **(verify a proof)**

Retrieve the full certification record for a given proof.

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (path) | The proof_id from a certification response |

**Response:** Same structure as the POST response.

---

## GET /proof/:id.json **(machine-readable proof)**

Returns a structured JSON proof document suitable for automated verification.

---

## POST /api/agent/register **(register agent)**

Register a new agent and get an API key with 10 free certifications.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| agent_name | string | yes | Agent display name |

**Response (200):**

```json
{
  "api_key": "pm_abc123...",
  "trial_quota": 10,
  "wallet_address": "erd1trial..."
}
```

No wallet or payment required for registration. Top up with USDC on Base or EGLD after the trial.
