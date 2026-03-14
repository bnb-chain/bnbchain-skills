---
name: staking-intel
description: |
  BNB staking ecosystem analysis — total staked BNB, liquid staking protocol
  comparison, and APY benchmarks. Reads on-chain data from TokenHub and
  liquid staking token contracts. Use to evaluate staking opportunities
  and monitor the BNB staking landscape.
metadata:
  author: mefai
  version: "1.0"
---

# Staking Intelligence

## Overview

| API | Function | Use Case |
|-----|----------|----------|
| Staking Intelligence | BNB staking ecosystem analysis with total staked, liquid staking protocols, and APY comparison | Evaluate staking opportunities and monitor the BNB staking landscape |

## Use Cases

1. **Staking Overview**: See total BNB staked and the overall staking ratio for the network
2. **Liquid Staking Comparison**: Compare APY, TVL, and exchange rates across slisBNB, ankrBNB, BNBx, stkBNB, and rBNB
3. **Yield Optimization**: Find the best staking yield between native staking and liquid staking protocols
4. **Staking Ratio Tracking**: Monitor what percentage of BNB supply is staked — rising ratios reduce sell pressure

## Supported Chains

| Chain Name | chainId |
|------------|---------|
| BSC | 56 |

---

## API: Staking Intelligence

### Method: GET

**URL**:
```
https://mefai.io/superbsc/api/bnbchain/mefai/staking-intel
```

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| (none) | — | — | Returns BNB staking ecosystem data |

**Example Request**:
```bash
curl 'https://mefai.io/superbsc/api/bnbchain/mefai/staking-intel'
```

**Response Example**:
```json
{
  "bnbPrice": 612.50,
  "totalStakedBnb": 31200000,
  "totalStakedUsd": 19110000000,
  "stakingRatio": 19.8,
  "activeValidators": 45,
  "nativeApy": 2.8,
  "liquidStaking": [
    {
      "protocol": "Lista DAO",
      "token": "slisBNB",
      "contractAddress": "0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B",
      "totalSupply": 285000,
      "exchangeRate": 1.042,
      "tvlBnb": 297070,
      "tvlUsd": 181907375,
      "apy": 3.2
    },
    {
      "protocol": "Ankr",
      "token": "ankrBNB",
      "contractAddress": "0x52F24a5e03aee032804b19dCf825d83709c5f3fc",
      "totalSupply": 198000,
      "exchangeRate": 1.068,
      "tvlBnb": 211464,
      "tvlUsd": 129521700,
      "apy": 3.5
    },
    {
      "protocol": "Stader",
      "token": "BNBx",
      "contractAddress": "0x1bdd3Cf7F79cfB8EdbB955f20ad99211551BA275",
      "totalSupply": 145000,
      "exchangeRate": 1.055,
      "tvlBnb": 152975,
      "tvlUsd": 93697188,
      "apy": 3.1
    },
    {
      "protocol": "pSTAKE",
      "token": "stkBNB",
      "contractAddress": "0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16",
      "totalSupply": 82000,
      "exchangeRate": 1.038,
      "tvlBnb": 85116,
      "tvlUsd": 52133550,
      "apy": 2.9
    },
    {
      "protocol": "StaFi",
      "token": "rBNB",
      "contractAddress": "0xF027E525D491ef6ffCC478555FBb3CFabB3406a6",
      "totalSupply": 35000,
      "exchangeRate": 1.045,
      "tvlBnb": 36575,
      "tvlUsd": 22402188,
      "apy": 3.0
    }
  ],
  "totalLiquidStaked": 783200,
  "stakingYields": [
    { "type": "Native Staking", "apy": 2.8 },
    { "type": "ankrBNB (Ankr)", "apy": 3.5 },
    { "type": "slisBNB (Lista DAO)", "apy": 3.2 },
    { "type": "BNBx (Stader)", "apy": 3.1 },
    { "type": "rBNB (StaFi)", "apy": 3.0 },
    { "type": "stkBNB (pSTAKE)", "apy": 2.9 }
  ]
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| bnbPrice | number | Current BNB price in USD |
| totalStakedBnb | number | Total BNB staked on the network |
| totalStakedUsd | number | Total staked value in USD |
| stakingRatio | number | Percentage of circulating BNB that is staked |
| activeValidators | number | Number of active validators on BSC |
| nativeApy | number | Native staking APY percentage |
| liquidStaking | array | Liquid staking protocol details |
| liquidStaking[].protocol | string | Protocol name |
| liquidStaking[].token | string | Liquid staking token symbol |
| liquidStaking[].contractAddress | string | Token contract address on BSC |
| liquidStaking[].totalSupply | number | Total supply of the liquid staking token |
| liquidStaking[].exchangeRate | number | Token to BNB exchange rate (always >= 1.0) |
| liquidStaking[].tvlBnb | number | Total BNB represented (supply x exchangeRate) |
| liquidStaking[].tvlUsd | number | TVL in USD |
| liquidStaking[].apy | number | Current APY percentage |
| totalLiquidStaked | number | Sum of all liquid staking TVL in BNB |
| stakingYields | array | All staking options sorted by APY descending |

---

## Liquid Staking Tokens Tracked

| Token | Protocol | Description |
|-------|----------|-------------|
| slisBNB | Lista DAO | Lista liquid staking BNB |
| ankrBNB | Ankr | Ankr liquid staking BNB |
| BNBx | Stader | Stader liquid staking BNB |
| stkBNB | pSTAKE | pSTAKE liquid staking BNB |
| rBNB | StaFi | StaFi liquid staking BNB |

## Data Sources

1. BSC RPC: TokenHub (0x0000000000000000000000000000000000001004) balance for total staked BNB
2. BSC RPC: totalSupply() and exchangeRate() calls on each liquid staking token contract
3. Binance Data API: BNB price for USD conversion

## Notes

1. Exchange rates increase over time as staking rewards accrue — this is how liquid staking tokens appreciate
2. Responses are cached with 120s fresh TTL
3. No authentication required
4. APY figures are trailing estimates and may vary based on network conditions and validator performance
