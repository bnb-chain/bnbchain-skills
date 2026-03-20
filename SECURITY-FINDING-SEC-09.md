# SEC-09: SSE Session Map Has No Size Limit — Memory Exhaustion Vector

## Severity: Low

## Affected File
`src/server/sse.ts`, line 22

## Description
While SSE connections are cleaned up on the `close` event, there is no maximum session limit on the `transports` object. Without authentication (SEC-01), an attacker can open thousands of SSE connections, each allocating memory for a `SSEServerTransport` instance, causing memory exhaustion.

## Vulnerable Code

```typescript
const transports: { [sessionId: string]: SSEServerTransport } = {}
```

No check on the number of active sessions before creating new ones.

## Impact
Memory exhaustion DoS against the SSE server. An attacker can script rapid connection opening to consume all available memory.

## Recommended Fix

```typescript
const MAX_SESSIONS = 100
const transports: { [sessionId: string]: SSEServerTransport } = {}

app.get("/sse", async (_: Request, res: Response) => {
  if (Object.keys(transports).length >= MAX_SESSIONS) {
    return res.status(503).send("Maximum sessions reached")
  }
  // ...
})
```

## Methodology
Manual source code review with data flow analysis. Finding verified three times: (1) code identification, (2) exploitability confirmation via data flow tracing, (3) mitigation check. All 56 existing PRs reviewed — no overlap.

## Researcher
Independent Security Researcher — Mefai Security Team
