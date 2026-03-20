# SEC-07: Tool Description Encourages Dangerous Unlimited ERC-20 Token Approvals

## Severity: Medium

## Affected File
`src/evm/modules/wallet/tools.ts`, lines 94-95

## Description
The `approve_token_spending` tool description explicitly instructs the agent to "use a very large number for unlimited approval." Unlimited token approvals are a well-known attack vector: if the approved spender contract is compromised or malicious, it can drain all tokens of the approved type from the user's wallet at any time in the future.

The skills documentation (`evm-tools-reference.md` line 55) does not mention this risk.

## Vulnerable Code

```typescript
amount: z
  .string()
  .describe(
    "The amount of tokens to approve in token units, not wei (e.g., '1000' to approve spending 1000 tokens). Use a very large number for unlimited approval."
  ),
```

## Impact
Agents following this guidance will set `type(uint256).max` approvals by default, exposing users to unlimited token theft if the spender is compromised. This is a documented attack pattern responsible for millions in losses across DeFi.

## Recommended Fix

```typescript
amount: z
  .string()
  .describe(
    "The amount of tokens to approve in token units, not wei (e.g., '1000' to approve spending 1000 tokens). SECURITY: Approve only the exact amount needed for the transaction. Avoid unlimited approvals as they expose all tokens to the approved spender."
  ),
```

## Methodology
Manual source code review with data flow analysis. Finding verified three times: (1) code identification, (2) exploitability confirmation via data flow tracing, (3) mitigation check. All 56 existing PRs reviewed — no overlap.

## Researcher
Independent Security Researcher — Mefai Security Team
