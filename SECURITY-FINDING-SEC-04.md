# SEC-04: Private Key Logged in Plaintext via MCP Message Logging

## Severity: High

## Affected File
`src/server/stdio.ts`, lines 16-18

## Description
Every incoming MCP message is logged at ERROR level (which is always enabled). Tool call messages for `transfer_native_token`, `transfer_erc20`, `write_contract`, etc. contain the `privateKey` parameter in their arguments object. This dumps private keys to stderr in plaintext.

Additionally, the Logger uses `util.inspect` with `depth: 5` and `colors: true` (`src/utils/logger.ts` line 33), which recursively serializes the entire message object including all nested parameters.

## Vulnerable Code

```typescript
transport.onmessage = (message) => {
  Logger.error("Received message:", message)
}
```

## Proof of Concept

When a user calls `transfer_native_token` with `privateKey: "0xabc123..."`, the stderr output contains:

```
[2026-03-20T10:00:00.000Z] ERROR: Received message: { jsonrpc: '2.0', method: 'tools/call', params: { name: 'transfer_native_token', arguments: { privateKey: '0xabc123...', toAddress: '0x...', amount: '1', network: 'bsc' } } }
```

In containerized deployments, log aggregation systems, or shared-terminal environments, this exposes wallet private keys to anyone with log access.

## Recommended Fix

```typescript
// Redact sensitive fields before logging
function redactMessage(message: any): any {
  if (!message?.params?.arguments) return message
  const redacted = JSON.parse(JSON.stringify(message))
  if (redacted.params.arguments.privateKey) {
    redacted.params.arguments.privateKey = "[REDACTED]"
  }
  return redacted
}

transport.onmessage = (message) => {
  Logger.debug("Received message:", redactMessage(message))  // debug, not error
}
```

## Methodology
Manual source code review with data flow analysis. Finding verified three times: (1) code identification, (2) exploitability confirmation via data flow tracing, (3) mitigation check. All 56 existing PRs reviewed — no overlap.

## Researcher
Independent Security Researcher — Mefai Security Team
