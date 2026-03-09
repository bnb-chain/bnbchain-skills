# Smart Contract Similarity Scanner — BNB Chain MCP Skill Reference

## Overview

Compares two BSC smart contracts by analyzing their bytecode at three levels: chunk-based similarity, function selector overlap (Jaccard index), and size ratio. Produces an overall similarity percentage and classifies the relationship (Identical, Clone, Fork, Related, Unrelated).

## Endpoint

```
GET /mefai/contract-similarity?address1=<contract_a>&address2=<contract_b>
```

## How It Works

1. **Bytecode Retrieval** — Fetches deployed bytecode for both contracts via `eth_getCode`.
2. **Size Comparison** — Computes the byte-size ratio between the two contracts.
3. **Selector Extraction** — Scans bytecode for PUSH4 opcodes (0x63) to extract all 4-byte function selectors, then computes Jaccard similarity (intersection / union).
4. **Chunk Similarity** — Splits bytecode into 64-byte chunks and computes set overlap.
5. **Weighted Score** — Overall = (chunk × 0.50) + (selector × 0.35) + (size × 0.15).
6. **Relationship Classification**:
   - ≥95% → Identical (likely same source)
   - ≥80% → Clone (minor modifications)
   - ≥60% → Fork (significant shared code)
   - ≥40% → Related (shared patterns)
   - ≥20% → Loosely Related
   - <20% → Unrelated

## BNB Chain Skills Used

| # | Skill | Usage |
|---|-------|-------|
| 1 | `eth_getCode` | Retrieve deployed bytecode for both contracts |

## Response Fields

- `overallSimilarity` — Weighted similarity percentage
- `relationship` — Human-readable classification
- `chunkSimilarity` — 64-byte chunk overlap percentage
- `selectorOverlap` — Function selector Jaccard similarity
- `sizeRatio` — Byte-size ratio percentage
- `commonFunctions[]` — Shared function selectors with known names
- `onlyInA[]` — Functions unique to contract A
- `onlyInB[]` — Functions unique to contract B

## Architecture

- Pure bytecode analysis — no source code or ABI required
- Known selector database maps common selectors to human-readable names
- Parallel bytecode fetch via `asyncio.gather`
- PUSH4 opcode scanning for selector extraction
- Set-based Jaccard similarity for both selectors and chunks
