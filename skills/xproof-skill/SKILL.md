---
name: xproof
displayName: xProof
version: 1.0.0
description: On-chain certification and audit trail for AI agents. Certify outputs, enforce pre-execution audit logging for critical actions, and build verifiable track records. Anchored on MultiversX, payments via x402 (USDC on Base). Use when an agent needs proof-of-existence, proof-of-authorship, or pre-execution audit compliance.
homepage: https://xproof.app
---

# xProof -- On-Chain Certification & Audit Trail for AI Agents

Certify agent outputs on-chain and enforce pre-execution audit logging for critical actions. Creates immutable, publicly verifiable proofs of existence, authorship, and timestamp.

**Base URL:** `https://xproof.app`

---

## When to use this skill

- After completing a deliverable (code, report, analysis, data) -- certify it to prove the agent did the work.
- Before executing a critical action (trade, deploy, data access, transfer) -- audit the decision on-chain first. No proof = no execution.
- Before sending outputs to another agent -- certify first so they can verify authenticity.
- When building a verifiable track record for an ERC-8004 registered agent.
- When a client, creator, or peer agent asks for proof of work.

---

## Authentication

Two methods. Choose based on your situation:

### Option A: API Key (recommended for registered agents)

Register once, get an API key with 10 free certifications:

```bash
curl -s -X POST https://xproof.app/api/agent/register \
  -H "Content-Type: application/json" \
  -d '{"agent_name": "my-bnb-agent"}'
```

Response:
```json
{"api_key": "pm_abc123...", "trial_quota": 10}
```

Use in subsequent requests:
```
Authorization: Bearer pm_abc123...
```

Top up with USDC on Base or EGLD when the trial runs out.

### Option B: x402 Payment Protocol (no account needed)

Send a request without auth. The server responds with HTTP 402 and payment requirements. Pay $0.05 in USDC on Base (eip155:8453) and retry with the `X-Payment` header. No account, no API key, no registration required.

See [references/x402-reference.md](references/x402-reference.md) for the complete flow.

---

## Quick reference -- tools

| Operation | Method | Endpoint | Auth required? |
|-----------|--------|----------|----------------|
| Certify single file | POST | `/api/proof` | API key or x402 |
| Certify batch (up to 50) | POST | `/api/batch` | API key or x402 |
| Audit a decision | POST | `/api/audit` | API key or x402 |
| Verify a proof | GET | `/api/proof/:id` | No |
| Get proof JSON | GET | `/proof/:id.json` | No |
| Register agent | POST | `/api/agent/register` | No |

---

## Core operations

### 1. Hash a file

Before certifying, compute the SHA-256 hash:

```bash
sha256sum /path/to/file | awk '{print $1}'
```

For content generated in memory, write to file first, then hash.

### 2. Certify a single file -- `POST /api/proof`

```bash
curl -s -X POST https://xproof.app/api/proof \
  -H "Authorization: Bearer $XPROOF_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "file_hash": "<64-char-sha256-hex>",
    "filename": "output.pdf",
    "author_name": "my-bnb-agent"
  }'
```

See [references/certification-reference.md](references/certification-reference.md) for full request/response schema.

### 3. Certify multiple files -- `POST /api/batch`

```bash
curl -s -X POST https://xproof.app/api/batch \
  -H "Authorization: Bearer $XPROOF_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {"file_hash": "<hash1>", "filename": "report.txt"},
      {"file_hash": "<hash2>", "filename": "model.bin"}
    ],
    "author_name": "my-bnb-agent"
  }'
```

### 4. Audit a critical action -- `POST /api/audit`

Before executing trades, deployments, or transfers, certify the decision on-chain. If this fails or returns no `proof_id`, the agent MUST NOT proceed.

```bash
curl -s -X POST https://xproof.app/api/audit \
  -H "Authorization: Bearer $XPROOF_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "erc8004:56:42",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "action_type": "trade",
    "action_description": "Swap 100 USDC for BNB on PancakeSwap",
    "inputs_hash": "<sha256-of-action-inputs>",
    "risk_level": "high",
    "risk_summary": "Market swap on volatile pair",
    "decision": "approved"
  }'
```

**Enforcement rule:** If `proof_id` is absent, if the API returns an error, or if the request times out -- STOP execution. No fallback. No soft fail.

### 5. Verify a proof

```bash
curl -s https://xproof.app/api/proof/<proof_id>
```

Human-readable: `https://xproof.app/proof/<proof_id>`
Machine-readable: `https://xproof.app/proof/<proof_id>.json`

---

## Integration with ERC-8004

BNB Chain agents registered via ERC-8004 can use their agent identity as the `agent_id` in audit calls. Format: `erc8004:<chainId>:<agentId>`.

| ERC-8004 Action | xProof Complement |
|:---|:---|
| `register_erc8004_agent` | Certify agent metadata for integrity |
| Agent executes a trade | Audit the decision before execution |
| Agent produces output | Certify the output hash as proof-of-work |
| Agent submits to another agent | Certify deliverable before handoff |

---

## Architecture

xProof uses two chains with distinct roles:

- **Base** -- handles payments via x402 in USDC. Where BNB Chain agents already operate cross-chain.
- **MultiversX** -- handles on-chain anchoring. 6-second finality, $0.001/tx cost. Optimized for high-throughput certification.

No MultiversX wallet is required on the agent side. Agents pay on Base, proofs are recorded on MultiversX.

---

## Reference files

| Reference | Content |
|-----------|---------|
| [references/certification-reference.md](references/certification-reference.md) | Full API schema: certify, batch, audit, verify |
| [references/x402-reference.md](references/x402-reference.md) | x402 payment flow: 402 challenge, USDC on Base, retry |

---

## Safety and best practices

1. **Always hash locally.** Never send file contents to xProof -- only the SHA-256 hash. Files stay private.
2. **Audit before executing.** For trades, deploys, transfers -- certify the decision first. If the audit call fails, do not proceed.
3. **Store proof_ids.** Keep `proof_id` and `verify_url` for every certification. These are your agent's permanent receipts.
4. **Use batch for multiple files.** Up to 50 files per call, same cost per file.

---

## Live endpoints

- **App:** https://xproof.app
- **API:** `POST https://xproof.app/api/proof`
- **x402:** `POST https://xproof.app/api/proof` (no auth, pay per request)
- **Docs:** https://xproof.app/docs
- **Machine-readable:** https://xproof.app/llms-full.txt
