# SEC-05: Path Traversal in Greenfield Download Allows Arbitrary File Write (RCE)

## Severity: High

## Affected File
`src/gnfd/services/object.ts`, lines 352-405

## Description
The `objectName` parameter comes from the Greenfield bucket listing and is not sanitized. An attacker who controls a Greenfield bucket could create an object named `../../.ssh/authorized_keys` or `../../../etc/cron.d/backdoor`. When the MCP server downloads that object, `path.join(targetPath, objectName)` resolves to an arbitrary path, and `writeFileSync` overwrites the target file.

## Vulnerable Code

```typescript
export const downloadObject = async (network, { privateKey, bucketName, objectName, targetPath }) => {
  let filePath = ""
  if (!targetPath || !existsSync(targetPath)) {
    filePath = path.join(process.cwd(), "tmp-" + objectName)
  } else {
    filePath = path.join(targetPath, objectName)
  }
  // ...
  writeFileSync(filePath, Buffer.from(buffer))
```

## Proof of Concept

An attacker uploads an object to Greenfield testnet with name `../../../tmp/pwned.txt`. When the victim runs:

```json
{
  "name": "gnfd_download_object",
  "arguments": {
    "network": "testnet",
    "bucketName": "attacker-bucket",
    "objectName": "../../../tmp/pwned.txt",
    "targetPath": "/home/user/downloads"
  }
}
```

The file is written to `/tmp/pwned.txt` instead of the intended directory. More dangerous payloads include writing to `.bashrc`, cron directories, or SSH authorized_keys for remote code execution.

## Recommended Fix

```typescript
function safeJoin(base: string, name: string): string {
  const resolved = path.resolve(base, name)
  if (!resolved.startsWith(path.resolve(base) + path.sep) && resolved !== path.resolve(base)) {
    throw new Error(`Path traversal detected: ${name} resolves outside ${base}`)
  }
  return resolved
}

// Replace path.join usage:
filePath = safeJoin(targetPath, objectName)
```

## Methodology
Manual source code review with data flow analysis. Finding verified three times: (1) code identification, (2) exploitability confirmation via data flow tracing, (3) mitigation check. All 56 existing PRs reviewed — no overlap.

## Researcher
Independent Security Researcher — Mefai Security Team
