"""BNB Chain on-chain data — TX Explorer, NFT Portfolio, Greenfield Storage."""

from fastapi import APIRouter, Query
from api.cache import fetch_json, post_json

router = APIRouter()

BSC_RPC = "https://bsc-dataseed1.binance.org"
GREENFIELD_API = "https://greenfield-sp.bnbchain.org"
BSC_SCAN = "https://api.bscscan.com/api"


async def _rpc_call(method: str, params: list, ttl: int = 30) -> dict:
    """Execute a BSC JSON-RPC call via the cache layer."""
    return await post_json(
        BSC_RPC,
        body={"jsonrpc": "2.0", "method": method, "params": params, "id": 1},
        ttl=ttl,
    )


# ── TX Explorer ──────────────────────────────────────────────────────


@router.get("/block")
async def get_block(
    number: str = Query("latest", description="Block number (hex) or 'latest'"),
    full: bool = Query(False, description="Include full TX objects"),
):
    """Get block by number. Use hex like '0x1234' or 'latest'."""
    return await _rpc_call("eth_getBlockByNumber", [number, full], ttl=15)


@router.get("/tx")
async def get_transaction(
    hash: str = Query(..., min_length=66, max_length=66),
):
    """Get transaction by hash."""
    return await _rpc_call("eth_getTransactionByHash", [hash], ttl=60)


@router.get("/receipt")
async def get_receipt(
    hash: str = Query(..., min_length=66, max_length=66),
):
    """Get transaction receipt (status, gas used, logs)."""
    return await _rpc_call("eth_getTransactionReceipt", [hash], ttl=60)


@router.get("/balance")
async def get_balance(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Get BNB balance for address."""
    return await _rpc_call("eth_getBalance", [address.lower(), "latest"], ttl=15)


@router.get("/block-number")
async def block_number():
    """Get latest block number."""
    return await _rpc_call("eth_blockNumber", [], ttl=5)


@router.get("/gas-price")
async def gas_price():
    """Get current gas price."""
    return await _rpc_call("eth_gasPrice", [], ttl=10)


# ── NFT Portfolio ────────────────────────────────────────────────────

# ERC721 balanceOf(address) selector
_ERC721_BALANCE = "0x70a08231"
# ERC721 tokenOfOwnerByIndex(address,index) selector
_ERC721_TOKEN_BY_INDEX = "0x2f745c59"


@router.get("/nft-balance")
async def nft_balance(
    owner: str = Query(..., min_length=42, max_length=42),
    contract: str = Query(..., min_length=42, max_length=42),
):
    """Get NFT balance (ERC721) for owner at contract."""
    data = owner.lower().replace("0x", "").zfill(64)
    return await _rpc_call(
        "eth_call",
        [{"to": contract.lower(), "data": f"{_ERC721_BALANCE}{data}"}, "latest"],
        ttl=30,
    )


@router.get("/nft-tokens")
async def nft_tokens(
    owner: str = Query(..., min_length=42, max_length=42),
    contract: str = Query(..., min_length=42, max_length=42),
    count: int = Query(10, ge=1, le=50),
):
    """Get NFT token IDs owned by address (ERC721Enumerable)."""
    addr_padded = owner.lower().replace("0x", "").zfill(64)
    results = []
    for i in range(count):
        idx = hex(i)[2:].zfill(64)
        r = await _rpc_call(
            "eth_call",
            [
                {
                    "to": contract.lower(),
                    "data": f"{_ERC721_TOKEN_BY_INDEX}{addr_padded}{idx}",
                },
                "latest",
            ],
            ttl=60,
        )
        if r and r.get("result") and r["result"] != "0x":
            results.append({"index": i, "tokenId": r["result"]})
        else:
            break
    return {"tokens": results, "contract": contract, "owner": owner}


# ── Greenfield Storage ───────────────────────────────────────────────


@router.get("/greenfield/status")
async def greenfield_status():
    """Greenfield SP (Storage Provider) status."""
    return await fetch_json(f"{GREENFIELD_API}/status", ttl=30)


@router.get("/greenfield/buckets")
async def greenfield_buckets(
    address: str = Query(..., min_length=42, max_length=42),
):
    """List buckets for a Greenfield account address."""
    import httpx
    import xml.etree.ElementTree as ET

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{GREENFIELD_API}/",
                headers={"X-Gnfd-User-Address": address},
            )
        if resp.status_code != 200:
            return {"buckets": [], "error": resp.text}
        # Parse XML response
        root = ET.fromstring(resp.text)
        ns = root.tag.split("}")[0] + "}" if "}" in root.tag else ""
        buckets = []
        for bi_elem in root.iter(f"{ns}BucketInfo"):
            bucket = {}
            for child in bi_elem:
                tag = child.tag.replace(ns, "")
                bucket[tag] = child.text
            if bucket:
                buckets.append({"bucket_info": bucket})
        # Fallback: if no BucketInfo found, try simpler structure
        if not buckets:
            for elem in root:
                tag = elem.tag.replace(ns, "")
                if "bucket" in tag.lower():
                    bucket = {}
                    for child in elem:
                        ctag = child.tag.replace(ns, "")
                        bucket[ctag] = child.text
                    if bucket:
                        buckets.append({"bucket_info": bucket})
        return {"buckets": buckets}
    except Exception as e:
        return {"buckets": [], "error": str(e)}


# ── Contract Reader ─────────────────────────────────────────────────

# ERC20 selectors
_ERC20_NAME = "0x06fdde03"
_ERC20_SYMBOL = "0x95d89b41"
_ERC20_DECIMALS = "0x313ce567"
_ERC20_TOTAL_SUPPLY = "0x18160ddd"
_ERC20_BALANCE_OF = "0x70a08231"


@router.get("/token-info")
async def token_info(
    contract: str = Query(..., min_length=42, max_length=42),
):
    """Get ERC20 token info (name, symbol, decimals, totalSupply)."""
    addr = contract.lower()
    calls = [
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_NAME}, "latest"], ttl=300),
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_SYMBOL}, "latest"], ttl=300),
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_DECIMALS}, "latest"], ttl=300),
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_TOTAL_SUPPLY}, "latest"], ttl=60),
    ]
    import asyncio
    results = await asyncio.gather(*calls, return_exceptions=True)
    return {
        "contract": addr,
        "name": results[0] if not isinstance(results[0], Exception) else None,
        "symbol": results[1] if not isinstance(results[1], Exception) else None,
        "decimals": results[2] if not isinstance(results[2], Exception) else None,
        "totalSupply": results[3] if not isinstance(results[3], Exception) else None,
    }


@router.get("/token-balance")
async def token_balance(
    contract: str = Query(..., min_length=42, max_length=42),
    address: str = Query(..., min_length=42, max_length=42),
):
    """Get ERC20 token balance for address."""
    addr_padded = address.lower().replace("0x", "").zfill(64)
    return await _rpc_call(
        "eth_call",
        [{"to": contract.lower(), "data": f"{_ERC20_BALANCE_OF}{addr_padded}"}, "latest"],
        ttl=15,
    )


@router.get("/read-contract")
async def read_contract(
    contract: str = Query(..., min_length=42, max_length=42),
    data: str = Query(..., description="ABI-encoded call data (hex)"),
):
    """Read from a smart contract (view/pure function call)."""
    return await _rpc_call(
        "eth_call",
        [{"to": contract.lower(), "data": data}, "latest"],
        ttl=15,
    )


@router.get("/estimate-gas")
async def estimate_gas(
    to: str = Query(..., min_length=42, max_length=42),
    data: str = Query("0x", description="Call data (hex)"),
    value: str = Query("0x0", description="Value in wei (hex)"),
):
    """Estimate gas for a transaction."""
    return await _rpc_call(
        "eth_estimateGas",
        [{"to": to.lower(), "data": data, "value": value}],
        ttl=10,
    )


@router.get("/code")
async def get_code(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Get contract bytecode at address (returns '0x' if EOA)."""
    return await _rpc_call("eth_getCode", [address.lower(), "latest"], ttl=300)


# ── Network Info ────────────────────────────────────────────────────


@router.get("/chain-id")
async def chain_id():
    """Get BSC chain ID."""
    return await _rpc_call("eth_chainId", [], ttl=3600)


@router.get("/peer-count")
async def peer_count():
    """Get connected peer count."""
    return await _rpc_call("net_peerCount", [], ttl=30)


@router.get("/syncing")
async def syncing():
    """Check if node is syncing."""
    return await _rpc_call("eth_syncing", [], ttl=10)


@router.get("/supported-networks")
async def supported_networks():
    """List supported EVM networks for BNB Chain MCP."""
    return {
        "networks": [
            {"name": "BNB Smart Chain", "chainId": 56, "rpc": "https://bsc-dataseed1.binance.org", "symbol": "BNB", "explorer": "https://bscscan.com"},
            {"name": "BNB Smart Chain Testnet", "chainId": 97, "rpc": "https://data-seed-prebsc-1-s1.binance.org:8545", "symbol": "tBNB", "explorer": "https://testnet.bscscan.com"},
            {"name": "opBNB", "chainId": 204, "rpc": "https://opbnb-mainnet-rpc.bnbchain.org", "symbol": "BNB", "explorer": "https://opbnbscan.com"},
            {"name": "opBNB Testnet", "chainId": 5611, "rpc": "https://opbnb-testnet-rpc.bnbchain.org", "symbol": "tBNB", "explorer": "https://testnet.opbnbscan.com"},
            {"name": "BNB Greenfield", "chainId": 1017, "rpc": "https://greenfield-chain.bnbchain.org", "symbol": "BNB", "explorer": "https://greenfieldscan.com"},
        ]
    }


# ── ERC-8004 Agent Registry ────────────────────────────────────────

# ERC-8004 Identity Registry on BSC
_ERC8004_REGISTRY = "0x5901DeB30816E210B2C4cFeDC21De5f288Ec4C73"
# Function selectors
_ERC8004_GET_AGENT = "0xc12c21c0"  # getAgent(uint256)
_ERC8004_AGENT_URI = "0xc87b56dd"  # tokenURI(uint256)
_ERC8004_BALANCE = "0x70a08231"    # balanceOf(address)


@router.get("/erc8004/agent")
async def get_erc8004_agent(
    token_id: str = Query(..., description="Agent token ID (decimal or hex)"),
):
    """Get ERC-8004 agent info by token ID."""
    tid = token_id if token_id.startswith("0x") else hex(int(token_id))
    tid_padded = tid.replace("0x", "").zfill(64)

    import asyncio
    uri_res, agent_res = await asyncio.gather(
        _rpc_call("eth_call", [{"to": _ERC8004_REGISTRY, "data": f"{_ERC8004_AGENT_URI}{tid_padded}"}, "latest"], ttl=60),
        _rpc_call("eth_call", [{"to": _ERC8004_REGISTRY, "data": f"{_ERC8004_GET_AGENT}{tid_padded}"}, "latest"], ttl=60),
    )
    return {"tokenId": token_id, "tokenURI": uri_res, "agentData": agent_res}


@router.get("/erc8004/balance")
async def get_erc8004_balance(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Get number of ERC-8004 agent NFTs owned by address."""
    addr_padded = address.lower().replace("0x", "").zfill(64)
    return await _rpc_call(
        "eth_call",
        [{"to": _ERC8004_REGISTRY, "data": f"{_ERC8004_BALANCE}{addr_padded}"}, "latest"],
        ttl=30,
    )


# ── Address Profile ─────────────────────────────────────────────────


# ── Market Data (DexScreener + CoinGecko) ─────────────────────────

DEXSCREENER = "https://api.dexscreener.com"
COINGECKO = "https://api.coingecko.com/api/v3"

# Well-known BSC token contracts
_BSC_TOKENS = [
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",  # WBNB
    "0x55d398326f99059fF775485246999027B3197955",  # USDT
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",  # BUSD
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",  # CAKE
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",  # ETH
    "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",  # BTCB
]


@router.get("/market/top-tokens")
async def market_top_tokens():
    """Top BSC tokens by volume from DexScreener."""
    return await fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(_BSC_TOKENS[:6]),
        ttl=60,
    )


@router.get("/market/search")
async def market_search(
    q: str = Query(..., min_length=1, max_length=100, description="Token name or address"),
):
    """Search BSC tokens on DexScreener."""
    return await fetch_json(
        f"{DEXSCREENER}/latest/dex/search",
        params={"q": f"{q} bsc"},
        ttl=30,
    )


@router.get("/market/token")
async def market_token(
    address: str = Query(..., min_length=42, max_length=42, description="Token contract"),
):
    """Get token market data from DexScreener."""
    return await fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/{address}",
        ttl=30,
    )


@router.get("/market/new-pairs")
async def market_new_pairs():
    """Latest BSC token pairs from DexScreener."""
    return await fetch_json(
        f"{DEXSCREENER}/token-profiles/latest/v1",
        ttl=60,
    )


@router.get("/address-profile")
async def address_profile(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Comprehensive address profile: balance, tx count, contract check."""
    addr = address.lower()
    import asyncio
    bal, nonce, code = await asyncio.gather(
        _rpc_call("eth_getBalance", [addr, "latest"], ttl=15),
        _rpc_call("eth_getTransactionCount", [addr, "latest"], ttl=15),
        _rpc_call("eth_getCode", [addr, "latest"], ttl=300),
    )
    is_contract = code and code.get("result") and code["result"] != "0x"
    return {
        "address": addr,
        "balance": bal,
        "transactionCount": nonce,
        "isContract": is_contract,
        "codeSize": len(code.get("result", "0x")) // 2 - 1 if is_contract else 0,
    }


# ── Mefai Skills: Advanced combined on-chain + market ─────────────

_TOP_BSC_PORTFOLIO = {
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": "WBNB",
    "0x55d398326f99059fF775485246999027B3197955": "USDT",
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56": "BUSD",
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": "CAKE",
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8": "ETH",
    "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": "BTCB",
    "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE": "XRP",
    "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47": "ADA",
}


@router.get("/mefai/wallet-scanner")
async def mefai_wallet_scanner(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Mefai Wallet Scanner: BNB balance + top token holdings with USD prices."""
    import asyncio

    addr = address.lower()
    addr_padded = addr.replace("0x", "").zfill(64)

    # Fetch BNB balance + all token balances in parallel
    tasks = [_rpc_call("eth_getBalance", [addr, "latest"], ttl=15)]
    token_list = list(_TOP_BSC_PORTFOLIO.items())
    for contract, _ in token_list:
        tasks.append(
            _rpc_call(
                "eth_call",
                [{"to": contract.lower(), "data": f"{_ERC20_BALANCE_OF}{addr_padded}"}, "latest"],
                ttl=15,
            )
        )
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Parse BNB
    bnb_raw = results[0]
    bnb_wei = int(bnb_raw.get("result", "0x0"), 16) if isinstance(bnb_raw, dict) else 0
    bnb_bal = bnb_wei / 1e18

    # Parse tokens
    holdings = []
    for i, (contract, symbol) in enumerate(token_list):
        r = results[i + 1]
        if isinstance(r, Exception) or not isinstance(r, dict):
            continue
        raw = r.get("result", "0x0")
        if raw and raw != "0x":
            val = int(raw, 16)
            if val > 0:
                # Use 18 decimals for all (standard for BSC top tokens)
                bal = val / 1e18
                holdings.append({"contract": contract, "symbol": symbol, "balance": bal})

    # Fetch market prices for tokens with balances
    price_contracts = [h["contract"] for h in holdings]
    if price_contracts:
        addrs = ",".join(price_contracts[:6])
        try:
            market = await fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addrs}", ttl=60)
            pairs = market.get("pairs", []) if isinstance(market, dict) else []
            price_map = {}
            for p in pairs:
                addr_key = (p.get("baseToken", {}).get("address") or "").lower()
                if addr_key and addr_key not in price_map and p.get("priceUsd"):
                    price_map[addr_key] = {
                        "price": float(p["priceUsd"]),
                        "change24h": p.get("priceChange", {}).get("h24"),
                    }
            for h in holdings:
                pm = price_map.get(h["contract"].lower(), {})
                h["priceUsd"] = pm.get("price")
                h["change24h"] = pm.get("change24h")
                if h["priceUsd"]:
                    h["valueUsd"] = h["balance"] * h["priceUsd"]
        except Exception:
            pass

    # Get BNB price
    try:
        bnb_market = await fetch_json(
            f"{DEXSCREENER}/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            ttl=60,
        )
        bnb_pairs = bnb_market.get("pairs", []) if isinstance(bnb_market, dict) else []
        bnb_price = float(bnb_pairs[0]["priceUsd"]) if bnb_pairs else None
    except Exception:
        bnb_price = None

    return {
        "address": addr,
        "bnb": {"balance": bnb_bal, "priceUsd": bnb_price, "valueUsd": bnb_bal * bnb_price if bnb_price else None},
        "tokens": holdings,
    }


@router.get("/mefai/contract-audit")
async def mefai_contract_audit(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Mefai Contract Audit: on-chain verification + market data + safety score."""
    import asyncio

    addr = address.lower()
    dead = "000000000000000000000000000000000000dead".zfill(64)

    # On-chain checks in parallel
    code_call, name_call, sym_call, dec_call, supply_call, dead_bal = await asyncio.gather(
        _rpc_call("eth_getCode", [addr, "latest"], ttl=300),
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_NAME}, "latest"], ttl=300),
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_SYMBOL}, "latest"], ttl=300),
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_DECIMALS}, "latest"], ttl=300),
        _rpc_call("eth_call", [{"to": addr, "data": _ERC20_TOTAL_SUPPLY}, "latest"], ttl=60),
        _rpc_call("eth_call", [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{dead}"}, "latest"], ttl=60),
    )

    has_code = code_call.get("result", "0x") not in ("0x", "0x0", None, "")
    code_size = (len(code_call.get("result", "0x")) - 2) // 2 if has_code else 0

    # Decode token info
    def _dec_str(hex_val):
        if not hex_val or hex_val == "0x" or len(hex_val) < 66:
            return ""
        try:
            raw = hex_val.replace("0x", "")
            offset = int(raw[:64], 16) * 2
            length = int(raw[offset:offset + 64], 16)
            data = raw[offset + 64:offset + 64 + length * 2]
            return bytes.fromhex(data).decode("utf-8", errors="ignore").strip("\x00")
        except Exception:
            return ""

    name = _dec_str(name_call.get("result"))
    symbol = _dec_str(sym_call.get("result"))
    decimals = int(dec_call.get("result", "0x0"), 16) if dec_call.get("result") else None
    total_supply_raw = int(supply_call.get("result", "0x0"), 16) if supply_call.get("result") else 0
    dead_bal_raw = int(dead_bal.get("result", "0x0"), 16) if dead_bal.get("result") else 0

    dec = decimals if decimals and decimals <= 18 else 18
    total_supply = total_supply_raw / (10 ** dec) if total_supply_raw else 0
    burned = dead_bal_raw / (10 ** dec) if dead_bal_raw else 0
    burn_pct = (burned / total_supply * 100) if total_supply > 0 else 0

    # Market data
    try:
        market = await fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addr}", ttl=30)
        pairs = [p for p in (market.get("pairs") or []) if p.get("chainId") == "bsc"]
    except Exception:
        pairs = []

    top = pairs[0] if pairs else {}
    price = float(top.get("priceUsd", 0)) if top.get("priceUsd") else None
    volume = top.get("volume", {}).get("h24")
    liquidity = top.get("liquidity", {}).get("usd")
    pair_count = len(pairs)
    dex = top.get("dexId")
    change24h = top.get("priceChange", {}).get("h24")

    # Safety score (0-100)
    score = 0
    checks = []
    if has_code:
        score += 15
        checks.append({"name": "Contract Code", "pass": True, "detail": f"{code_size} bytes"})
    else:
        checks.append({"name": "Contract Code", "pass": False, "detail": "No code (EOA)"})
    if name:
        score += 10
        checks.append({"name": "ERC20 name()", "pass": True, "detail": name})
    else:
        checks.append({"name": "ERC20 name()", "pass": False, "detail": "Not readable"})
    if symbol:
        score += 10
        checks.append({"name": "ERC20 symbol()", "pass": True, "detail": symbol})
    else:
        checks.append({"name": "ERC20 symbol()", "pass": False, "detail": "Not readable"})
    if decimals is not None and 0 <= decimals <= 18:
        score += 10
        checks.append({"name": "Decimals", "pass": True, "detail": str(decimals)})
    else:
        checks.append({"name": "Decimals", "pass": False, "detail": "Invalid"})
    if total_supply > 0:
        score += 10
        checks.append({"name": "Total Supply", "pass": True, "detail": f"{total_supply:,.0f}"})
    else:
        checks.append({"name": "Total Supply", "pass": False, "detail": "Zero or unreadable"})
    if liquidity and liquidity > 1000:
        score += 15
        checks.append({"name": "DEX Liquidity", "pass": True, "detail": f"${liquidity:,.0f}"})
    elif liquidity:
        score += 5
        checks.append({"name": "DEX Liquidity", "pass": False, "detail": f"${liquidity:,.0f} (low)"})
    else:
        checks.append({"name": "DEX Liquidity", "pass": False, "detail": "Not found"})
    if pair_count >= 2:
        score += 10
        checks.append({"name": "DEX Pairs", "pass": True, "detail": f"{pair_count} pairs"})
    elif pair_count == 1:
        score += 5
        checks.append({"name": "DEX Pairs", "pass": True, "detail": "1 pair"})
    else:
        checks.append({"name": "DEX Pairs", "pass": False, "detail": "No pairs"})
    if volume and volume > 1000:
        score += 10
        checks.append({"name": "24h Volume", "pass": True, "detail": f"${volume:,.0f}"})
    else:
        checks.append({"name": "24h Volume", "pass": volume is not None and volume > 0, "detail": f"${volume:,.0f}" if volume else "No volume"})
    if burn_pct > 1:
        score += 10
        checks.append({"name": "Burn Address", "pass": True, "detail": f"{burn_pct:.1f}% burned"})
    else:
        checks.append({"name": "Burn Address", "pass": False, "detail": f"{burn_pct:.2f}% burned"})

    grade = "A" if score >= 80 else "B" if score >= 60 else "C" if score >= 40 else "D" if score >= 20 else "F"

    return {
        "address": addr,
        "name": name or (top.get("baseToken", {}).get("name")),
        "symbol": symbol or (top.get("baseToken", {}).get("symbol")),
        "decimals": decimals,
        "totalSupply": total_supply,
        "burnedPct": burn_pct,
        "codeSize": code_size,
        "price": price,
        "change24h": change24h,
        "volume24h": volume,
        "liquidity": liquidity,
        "pairCount": pair_count,
        "dex": dex,
        "score": score,
        "grade": grade,
        "checks": checks,
    }


@router.get("/mefai/liquidity-pulse")
async def mefai_liquidity_pulse():
    """Mefai Liquidity Pulse: BSC tokens ranked by volume/liquidity ratio."""
    data = await fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(_BSC_TOKENS),
        ttl=60,
    )
    pairs = data.get("pairs", []) if isinstance(data, dict) else []
    bsc_pairs = [p for p in pairs if p.get("chainId") == "bsc"]

    # Deduplicate by base token, keep highest volume
    seen = {}
    for p in bsc_pairs:
        sym = (p.get("baseToken", {}).get("symbol") or "").upper()
        if not sym:
            continue
        vol = p.get("volume", {}).get("h24") or 0
        if sym not in seen or vol > (seen[sym].get("volume", {}).get("h24") or 0):
            seen[sym] = p

    results = []
    for sym, p in seen.items():
        vol = p.get("volume", {}).get("h24") or 0
        liq = p.get("liquidity", {}).get("usd") or 0
        ratio = vol / liq if liq > 0 else 0
        results.append({
            "symbol": sym,
            "name": p.get("baseToken", {}).get("name", ""),
            "address": p.get("baseToken", {}).get("address", ""),
            "price": p.get("priceUsd"),
            "change24h": p.get("priceChange", {}).get("h24"),
            "change1h": p.get("priceChange", {}).get("h1"),
            "volume24h": vol,
            "liquidity": liq,
            "vlRatio": round(ratio, 2),
            "dex": p.get("dexId"),
            "txns24h": (p.get("txns", {}).get("h24", {}).get("buys", 0) or 0) + (p.get("txns", {}).get("h24", {}).get("sells", 0) or 0),
            "buys24h": p.get("txns", {}).get("h24", {}).get("buys", 0),
            "sells24h": p.get("txns", {}).get("h24", {}).get("sells", 0),
        })

    results.sort(key=lambda x: x["vlRatio"], reverse=True)
    return {"tokens": results}


# ── Mefai Skills Batch 2: CZ-approved BNB ecosystem showcase ─────

_DEAD_ADDR = "0x000000000000000000000000000000000000dEaD"
_ZERO_ADDR = "0x0000000000000000000000000000000000000000"

# Top burn-tracked tokens
_BURN_TOKENS = {
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": ("WBNB", 18),
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": ("CAKE", 18),
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56": ("BUSD", 18),
    "0x55d398326f99059fF775485246999027B3197955": ("USDT", 18),
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8": ("ETH", 18),
    "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": ("BTCB", 18),
    "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3": ("DAI", 18),
    "0xba2ae424d960c26247dd6c32edc70b295c744c43": ("DOGE", 8),
}

# Top DeFi protocols on BSC
_DEFI_TOKENS = [
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",  # CAKE (PancakeSwap)
    "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",  # XVS (Venus)
    "0xa184088a740c695E156F91f5cC086a06bb78b827",  # AUTO (AutoFarm)
    "0xfb6115445bff7b52feb98650c87f44907e58f802",  # AAVE on BSC
    "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",  # LTC (Litecoin)
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",  # USDC
    "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",  # XRP
    "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",  # DOT
    "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",  # UNI
    "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",  # ADA
]


@router.get("/mefai/burn-tracker")
async def mefai_burn_tracker():
    """BNB Burn Tracker: burned tokens at dead/zero addresses with USD values."""
    import asyncio

    dead_padded = _DEAD_ADDR.replace("0x", "").zfill(64)
    zero_padded = _ZERO_ADDR.replace("0x", "").zfill(64)

    # Query BNB balance at dead+zero, plus all token balances at dead addr
    tasks = [
        _rpc_call("eth_getBalance", [_DEAD_ADDR, "latest"], ttl=60),
        _rpc_call("eth_getBalance", [_ZERO_ADDR, "latest"], ttl=60),
    ]
    token_list = list(_BURN_TOKENS.items())
    for contract, _ in token_list:
        # balanceOf(dead)
        tasks.append(_rpc_call("eth_call", [
            {"to": contract, "data": f"{_ERC20_BALANCE_OF}{dead_padded}"},
            "latest",
        ], ttl=60))
        # totalSupply
        tasks.append(_rpc_call("eth_call", [
            {"to": contract, "data": _ERC20_TOTAL_SUPPLY},
            "latest",
        ], ttl=60))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    # BNB burned
    bnb_dead = 0
    bnb_zero = 0
    try:
        bnb_dead = int(results[0].get("result", "0x0"), 16) / 1e18
    except Exception:
        pass
    try:
        bnb_zero = int(results[1].get("result", "0x0"), 16) / 1e18
    except Exception:
        pass

    # Get all prices in a single batch DexScreener call (max 30 addresses)
    all_addrs = ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"] + [c for c in _BURN_TOKENS.keys()]
    price_map = {}
    try:
        px = await fetch_json(
            f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(all_addrs),
            ttl=120,
        )
        for p in (px.get("pairs", []) if isinstance(px, dict) else []):
            if p.get("chainId") != "bsc" or not p.get("priceUsd"):
                continue
            # Track base token price
            addr = (p.get("baseToken", {}).get("address") or "").lower()
            vol = p.get("volume", {}).get("h24") or 0
            if addr and (addr not in price_map or vol > price_map[addr][1]):
                price_map[addr] = (float(p["priceUsd"]), vol)
            # Also track quote token price via priceNative inverse
            qaddr = (p.get("quoteToken", {}).get("address") or "").lower()
            if qaddr and qaddr not in price_map:
                try:
                    base_price = float(p["priceUsd"])
                    native = float(p.get("priceNative") or 0)
                    if native > 0:
                        price_map[qaddr] = (base_price / native, 0)
                except Exception:
                    pass
    except Exception:
        pass
    # Hardcode stablecoin prices as fallback
    for sa in ["0x55d398326f99059ff775485246999027b3197955",
               "0xe9e7cea3dedca5984780bafc599bd69add087d56",
               "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"]:
        if sa not in price_map:
            price_map[sa] = (1.0, 0)

    bnb_price = price_map.get("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", (0, 0))[0]

    tokens = []
    for i, (contract, (sym, dec)) in enumerate(token_list):
        idx = 2 + i * 2
        burned = 0
        supply = 0
        try:
            r = results[idx]
            if isinstance(r, dict) and r.get("result"):
                burned = int(r["result"], 16) / (10 ** dec)
        except Exception:
            pass
        try:
            r = results[idx + 1]
            if isinstance(r, dict) and r.get("result"):
                supply = int(r["result"], 16) / (10 ** dec)
        except Exception:
            pass
        pct = (burned / supply * 100) if supply > 0 else 0
        price = price_map.get(contract.lower(), (0, 0))[0]

        tokens.append({
            "symbol": sym,
            "address": contract,
            "burned": round(burned, 4),
            "totalSupply": round(supply, 2),
            "burnedPct": round(pct, 4),
            "priceUsd": price,
            "burnedValueUsd": round(burned * price, 2),
        })

    total_bnb_burned = bnb_dead + bnb_zero
    return {
        "bnb": {
            "deadBalance": round(bnb_dead, 4),
            "zeroBalance": round(bnb_zero, 4),
            "totalBurned": round(total_bnb_burned, 4),
            "priceUsd": bnb_price,
            "burnedValueUsd": round(total_bnb_burned * bnb_price, 2),
        },
        "tokens": tokens,
        "totalBurnedUsd": round(
            total_bnb_burned * bnb_price + sum(t["burnedValueUsd"] for t in tokens), 2
        ),
    }


@router.get("/mefai/pancakeswap-arena")
async def mefai_pancakeswap_arena():
    """PancakeSwap Arena: top trading pairs with volume and price data."""
    data = await fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(_BSC_TOKENS[:6]),
        ttl=30,
    )
    pairs = data.get("pairs", []) if isinstance(data, dict) else []
    # Only PancakeSwap pairs
    pcs_pairs = [p for p in pairs if p.get("chainId") == "bsc" and "pancake" in (p.get("dexId") or "").lower()]

    # Sort by volume desc
    pcs_pairs.sort(key=lambda p: p.get("volume", {}).get("h24") or 0, reverse=True)

    results = []
    seen = set()
    for p in pcs_pairs[:20]:
        pair_key = p.get("pairAddress", "")
        if pair_key in seen:
            continue
        seen.add(pair_key)
        base = p.get("baseToken", {})
        quote = p.get("quoteToken", {})
        vol = p.get("volume", {})
        chg = p.get("priceChange", {})
        txns = p.get("txns", {}).get("h24", {})
        liq = p.get("liquidity", {})
        results.append({
            "pair": f"{base.get('symbol', '?')}/{quote.get('symbol', '?')}",
            "baseSymbol": base.get("symbol", ""),
            "baseAddress": base.get("address", ""),
            "quoteSymbol": quote.get("symbol", ""),
            "price": p.get("priceUsd"),
            "priceNative": p.get("priceNative"),
            "change5m": chg.get("m5"),
            "change1h": chg.get("h1"),
            "change6h": chg.get("h6"),
            "change24h": chg.get("h24"),
            "volume24h": vol.get("h24") or 0,
            "volume6h": vol.get("h6") or 0,
            "volume1h": vol.get("h1") or 0,
            "liquidity": liq.get("usd") or 0,
            "buys24h": txns.get("buys") or 0,
            "sells24h": txns.get("sells") or 0,
            "pairAddress": pair_key,
            "pairCreated": p.get("pairCreatedAt"),
        })

    return {"pairs": results}


@router.get("/mefai/chain-vitals")
async def mefai_chain_vitals():
    """BSC Chain Vitals: real-time TPS, block time, gas efficiency from last N blocks."""
    import asyncio

    # Get latest block number
    bn = await _rpc_call("eth_blockNumber", [], ttl=5)
    latest = 0
    try:
        latest = int(bn.get("result", "0x0"), 16)
    except Exception:
        pass
    if latest == 0:
        return {"error": "Cannot fetch block number"}

    # Fetch last 10 blocks in parallel
    n_blocks = 10
    tasks = []
    for i in range(n_blocks):
        num = latest - i
        tasks.append(_rpc_call("eth_getBlockByNumber", [hex(num), False], ttl=15))

    # Also get gas price
    tasks.append(_rpc_call("eth_gasPrice", [], ttl=10))
    results = await asyncio.gather(*tasks, return_exceptions=True)

    blocks = []
    for i in range(n_blocks):
        r = results[i]
        if isinstance(r, dict) and r.get("result"):
            b = r["result"]
            blocks.append({
                "number": int(b.get("number", "0x0"), 16),
                "timestamp": int(b.get("timestamp", "0x0"), 16),
                "txCount": len(b.get("transactions", [])),
                "gasUsed": int(b.get("gasUsed", "0x0"), 16),
                "gasLimit": int(b.get("gasLimit", "0x0"), 16),
                "size": int(b.get("size", "0x0"), 16),
                "miner": b.get("miner", ""),
            })

    gas_price = 0
    try:
        gas_price = int(results[n_blocks].get("result", "0x0"), 16) / 1e9
    except Exception:
        pass

    if len(blocks) < 2:
        return {"error": "Insufficient block data"}

    # Calculate metrics
    blocks.sort(key=lambda b: b["number"])
    block_times = []
    for i in range(1, len(blocks)):
        dt = blocks[i]["timestamp"] - blocks[i - 1]["timestamp"]
        if dt > 0:
            block_times.append(dt)

    avg_block_time = sum(block_times) / len(block_times) if block_times else 3
    total_tx = sum(b["txCount"] for b in blocks)
    time_span = blocks[-1]["timestamp"] - blocks[0]["timestamp"]
    tps = total_tx / time_span if time_span > 0 else 0
    avg_gas_used = sum(b["gasUsed"] for b in blocks) / len(blocks)
    avg_gas_limit = sum(b["gasLimit"] for b in blocks) / len(blocks)
    gas_utilization = (avg_gas_used / avg_gas_limit * 100) if avg_gas_limit > 0 else 0
    avg_tx_per_block = total_tx / len(blocks)
    avg_block_size = sum(b["size"] for b in blocks) / len(blocks)

    # Validator distribution
    validators = {}
    for b in blocks:
        v = b["miner"]
        validators[v] = validators.get(v, 0) + 1

    return {
        "latestBlock": blocks[-1]["number"],
        "blocksAnalyzed": len(blocks),
        "avgBlockTime": round(avg_block_time, 2),
        "tps": round(tps, 1),
        "avgTxPerBlock": round(avg_tx_per_block, 1),
        "gasPrice": round(gas_price, 2),
        "gasUtilization": round(gas_utilization, 1),
        "avgGasUsed": int(avg_gas_used),
        "avgGasLimit": int(avg_gas_limit),
        "avgBlockSize": int(avg_block_size),
        "totalTx": total_tx,
        "timeSpan": time_span,
        "validators": [
            {"address": addr, "blocks": count}
            for addr, count in sorted(validators.items(), key=lambda x: -x[1])
        ],
        "blockDetails": [
            {
                "number": b["number"],
                "txCount": b["txCount"],
                "gasUsed": b["gasUsed"],
                "gasLimit": b["gasLimit"],
                "gasPct": round(b["gasUsed"] / b["gasLimit"] * 100, 1) if b["gasLimit"] > 0 else 0,
                "size": b["size"],
                "time": b["timestamp"],
            }
            for b in blocks
        ],
    }


@router.get("/mefai/token-trends")
async def mefai_token_trends():
    """Token Trends: trending and boosted tokens on BSC from DexScreener."""
    import asyncio

    profiles_task = fetch_json(f"{DEXSCREENER}/token-profiles/latest/v1", ttl=60)
    boosts_task = fetch_json(f"{DEXSCREENER}/token-boosts/latest/v1", ttl=60)

    profiles_raw, boosts_raw = await asyncio.gather(profiles_task, boosts_task, return_exceptions=True)

    # Filter BSC profiles
    profiles = []
    if isinstance(profiles_raw, list):
        for p in profiles_raw:
            if p.get("chainId") == "bsc" and p.get("tokenAddress"):
                profiles.append({
                    "address": p["tokenAddress"],
                    "description": p.get("description", ""),
                    "icon": p.get("icon", ""),
                    "url": p.get("url", ""),
                })
    # Max 15
    profiles = profiles[:15]

    # Filter BSC boosts
    boosts = []
    if isinstance(boosts_raw, list):
        for b in boosts_raw:
            if b.get("chainId") == "bsc" and b.get("tokenAddress"):
                boosts.append({
                    "address": b["tokenAddress"],
                    "amount": b.get("amount", 0),
                    "totalAmount": b.get("totalAmount", 0),
                    "icon": b.get("icon", ""),
                    "description": b.get("description", ""),
                    "url": b.get("url", ""),
                })
    boosts = boosts[:15]

    # Enrich with market data: gather all unique addresses
    all_addrs = list({p["address"] for p in profiles} | {b["address"] for b in boosts})
    if not all_addrs:
        return {"profiles": [], "boosts": [], "enriched": []}

    # Batch fetch from DexScreener (max 30 addresses at once)
    enriched = []
    batch = all_addrs[:30]
    try:
        market = await fetch_json(
            f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(batch),
            ttl=60,
        )
        pairs = market.get("pairs", []) if isinstance(market, dict) else []
        # Group by token address, take best pair
        token_data = {}
        for p in pairs:
            if p.get("chainId") != "bsc":
                continue
            addr = (p.get("baseToken", {}).get("address") or "").lower()
            vol = p.get("volume", {}).get("h24") or 0
            if addr not in token_data or vol > (token_data[addr].get("volume", {}).get("h24") or 0):
                token_data[addr] = p

        for addr in batch:
            p = token_data.get(addr.lower())
            if not p:
                continue
            base = p.get("baseToken", {})
            chg = p.get("priceChange", {})
            enriched.append({
                "address": addr,
                "symbol": base.get("symbol", ""),
                "name": base.get("name", ""),
                "price": p.get("priceUsd"),
                "change1h": chg.get("h1"),
                "change24h": chg.get("h24"),
                "volume24h": p.get("volume", {}).get("h24") or 0,
                "liquidity": p.get("liquidity", {}).get("usd") or 0,
                "dex": p.get("dexId", ""),
                "buys24h": p.get("txns", {}).get("h24", {}).get("buys") or 0,
                "sells24h": p.get("txns", {}).get("h24", {}).get("sells") or 0,
                "isBoosted": any(b["address"].lower() == addr.lower() for b in boosts),
                "boostAmount": next((b.get("totalAmount", 0) for b in boosts if b["address"].lower() == addr.lower()), 0),
            })
    except Exception:
        pass

    enriched.sort(key=lambda x: x.get("volume24h", 0), reverse=True)
    return {"profiles": profiles, "boosts": boosts, "enriched": enriched}


@router.get("/mefai/defi-leaderboard")
async def mefai_defi_leaderboard():
    """DeFi Leaderboard: top BSC DeFi protocols by volume and liquidity."""
    data = await fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(_DEFI_TOKENS),
        ttl=60,
    )
    pairs = data.get("pairs", []) if isinstance(data, dict) else []
    bsc_pairs = [p for p in pairs if p.get("chainId") == "bsc"]

    # Group by base token, aggregate metrics
    tokens = {}
    for p in bsc_pairs:
        base = p.get("baseToken", {})
        sym = base.get("symbol", "").upper()
        addr = base.get("address", "")
        if not sym:
            continue

        vol = p.get("volume", {}).get("h24") or 0
        liq = p.get("liquidity", {}).get("usd") or 0

        if sym not in tokens:
            tokens[sym] = {
                "symbol": sym,
                "name": base.get("name", ""),
                "address": addr,
                "price": p.get("priceUsd"),
                "change24h": p.get("priceChange", {}).get("h24"),
                "change1h": p.get("priceChange", {}).get("h1"),
                "totalVolume24h": 0,
                "totalLiquidity": 0,
                "pairCount": 0,
                "topDex": "",
                "topDexVolume": 0,
                "totalBuys": 0,
                "totalSells": 0,
            }
        t = tokens[sym]
        t["totalVolume24h"] += vol
        t["totalLiquidity"] += liq
        t["pairCount"] += 1
        txns = p.get("txns", {}).get("h24", {})
        t["totalBuys"] += txns.get("buys") or 0
        t["totalSells"] += txns.get("sells") or 0
        if vol > t["topDexVolume"]:
            t["topDex"] = p.get("dexId", "")
            t["topDexVolume"] = vol
            t["price"] = p.get("priceUsd")
            t["change24h"] = p.get("priceChange", {}).get("h24")

    results = list(tokens.values())
    for t in results:
        t["totalVolume24h"] = round(t["totalVolume24h"], 2)
        t["totalLiquidity"] = round(t["totalLiquidity"], 2)
    results.sort(key=lambda x: x["totalVolume24h"], reverse=True)
    return {"tokens": results}


@router.get("/mefai/bsc-supremacy")
async def mefai_bsc_supremacy():
    """BSC vs ETH: real-time comparison proving BSC superiority."""
    import asyncio

    # BSC real data
    bn_task = _rpc_call("eth_blockNumber", [], ttl=5)
    gas_task = _rpc_call("eth_gasPrice", [], ttl=10)
    bn_res, gas_res = await asyncio.gather(bn_task, gas_task, return_exceptions=True)

    bsc_block = 0
    try:
        bsc_block = int(bn_res.get("result", "0x0"), 16)
    except Exception:
        pass
    bsc_gas = 0
    try:
        bsc_gas = int(gas_res.get("result", "0x0"), 16) / 1e9
    except Exception:
        pass

    # Fetch last 5 BSC blocks for real TPS + block time
    tasks = []
    for i in range(5):
        tasks.append(_rpc_call("eth_getBlockByNumber", [hex(bsc_block - i), False], ttl=15))
    blocks_res = await asyncio.gather(*tasks, return_exceptions=True)

    bsc_blocks = []
    for r in blocks_res:
        if isinstance(r, dict) and r.get("result"):
            b = r["result"]
            bsc_blocks.append({
                "number": int(b.get("number", "0x0"), 16),
                "timestamp": int(b.get("timestamp", "0x0"), 16),
                "txCount": len(b.get("transactions", [])),
                "gasUsed": int(b.get("gasUsed", "0x0"), 16),
                "gasLimit": int(b.get("gasLimit", "0x0"), 16),
            })
    bsc_blocks.sort(key=lambda b: b["number"])

    bsc_block_time = 3.0
    bsc_tps = 0
    if len(bsc_blocks) >= 2:
        times = [bsc_blocks[i]["timestamp"] - bsc_blocks[i - 1]["timestamp"] for i in range(1, len(bsc_blocks))]
        times = [t for t in times if t > 0]
        if times:
            bsc_block_time = sum(times) / len(times)
        total_tx = sum(b["txCount"] for b in bsc_blocks)
        span = bsc_blocks[-1]["timestamp"] - bsc_blocks[0]["timestamp"]
        bsc_tps = total_tx / span if span > 0 else 0

    avg_gas_used = sum(b["gasUsed"] for b in bsc_blocks) / len(bsc_blocks) if bsc_blocks else 0
    avg_gas_limit = sum(b["gasLimit"] for b in bsc_blocks) / len(bsc_blocks) if bsc_blocks else 1
    bsc_gas_util = avg_gas_used / avg_gas_limit * 100 if avg_gas_limit > 0 else 0

    # BNB price
    bnb_price = 0
    try:
        px = await fetch_json(
            f"{DEXSCREENER}/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            ttl=60,
        )
        for p in px.get("pairs", []):
            if p.get("chainId") == "bsc" and p.get("priceUsd"):
                bnb_price = float(p["priceUsd"])
                break
    except Exception:
        pass

    # BSC transfer cost in USD
    bsc_transfer_cost = bsc_gas * 21000 / 1e9 * bnb_price
    bsc_swap_cost = bsc_gas * 200000 / 1e9 * bnb_price

    # ETH known averages (updated periodically)
    eth_block_time = 12.1
    eth_tps = 15
    eth_gas_gwei = 8.0
    eth_price = 1950.0
    eth_transfer_cost = eth_gas_gwei * 21000 / 1e9 * eth_price
    eth_swap_cost = eth_gas_gwei * 200000 / 1e9 * eth_price

    # Multipliers
    speed_mult = round(eth_block_time / bsc_block_time, 1) if bsc_block_time > 0 else 0
    tps_mult = round(bsc_tps / eth_tps, 1) if eth_tps > 0 else 0
    cost_mult = round(eth_transfer_cost / bsc_transfer_cost, 0) if bsc_transfer_cost > 0 else 0

    return {
        "bsc": {
            "blockTime": round(bsc_block_time, 1),
            "tps": round(bsc_tps, 1),
            "gasGwei": round(bsc_gas, 2),
            "gasUtilization": round(bsc_gas_util, 1),
            "transferCost": round(bsc_transfer_cost, 4),
            "swapCost": round(bsc_swap_cost, 4),
            "latestBlock": bsc_block,
            "validators": 40,
            "finality": "1 block (~1s)",
            "nativePrice": bnb_price,
        },
        "eth": {
            "blockTime": eth_block_time,
            "tps": eth_tps,
            "gasGwei": eth_gas_gwei,
            "transferCost": round(eth_transfer_cost, 4),
            "swapCost": round(eth_swap_cost, 4),
            "validators": 1000000,
            "finality": "2 epochs (~12.8min)",
            "nativePrice": eth_price,
        },
        "advantage": {
            "speedMultiplier": speed_mult,
            "tpsMultiplier": tps_mult,
            "costMultiplier": int(cost_mult),
            "transferSavings": round(eth_transfer_cost - bsc_transfer_cost, 4),
            "swapSavings": round(eth_swap_cost - bsc_swap_cost, 4),
        },
    }


# Well-known BSC wallets for labeling
_KNOWN_WALLETS = {
    "0x8894e0a0c962cb723c1ef8a1b6737b4e1e2ae02b": "Binance Hot Wallet",
    "0xe2fc31f816a9b94326492132018c3aecc4a93ae1": "Binance Hot 2",
    "0x3c783c21a0383057d128bae431894a5c19f9cf06": "Binance Hot 3",
    "0xf977814e90da44bfa03b6295a0616a897441acec": "Binance Cold",
    "0x4b16c5de96eb2117bbe5fd171e4d203624b014aa": "CZ Wallet",
    "0x631fc1ea2270e98fbd9d92658ece0f5a269aa161": "Binance Staking",
    "0xb1256d6b31e4ae87da1d56e5890c66be7f1c038e": "PancakeSwap",
    "0x10ed43c718714eb63d5aa57b78b54917c3e6fe49": "PancakeSwap Router",
    "0x000000000000000000000000000000000000dead": "Burn Address",
    "0x0000000000000000000000000000000000000000": "Zero Address",
}


@router.get("/mefai/smart-money")
async def mefai_smart_money():
    """Smart Money Radar: whale transactions and flow analysis from recent blocks."""
    import asyncio

    # Get latest block
    bn = await _rpc_call("eth_blockNumber", [], ttl=5)
    latest = 0
    try:
        latest = int(bn.get("result", "0x0"), 16)
    except Exception:
        pass
    if latest == 0:
        return {"error": "Cannot fetch block number"}

    # Fetch last 10 blocks with full transactions
    n_scan = 10
    tasks = []
    for i in range(n_scan):
        tasks.append(_rpc_call("eth_getBlockByNumber", [hex(latest - i), True], ttl=10))

    # Get BNB price
    tasks.append(fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        ttl=60,
    ))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    bnb_price = 0
    try:
        px = results[n_scan]
        for p in px.get("pairs", []):
            if p.get("chainId") == "bsc" and p.get("priceUsd"):
                bnb_price = float(p["priceUsd"])
                break
    except Exception:
        pass

    whale_txs = []
    total_volume = 0
    total_txs = 0
    inflow = 0  # to known wallets
    outflow = 0  # from known wallets

    for i in range(n_scan):
        r = results[i]
        if not isinstance(r, dict) or not r.get("result"):
            continue
        block = r["result"]
        block_num = int(block.get("number", "0x0"), 16)
        block_time = int(block.get("timestamp", "0x0"), 16)
        txs = block.get("transactions", [])
        total_txs += len(txs)

        for tx in txs:
            val = int(tx.get("value", "0x0"), 16) / 1e18
            if val < 0.0001:
                continue
            total_volume += val
            from_addr = (tx.get("from") or "").lower()
            to_addr = (tx.get("to") or "").lower()

            from_label = _KNOWN_WALLETS.get(from_addr, "")
            to_label = _KNOWN_WALLETS.get(to_addr, "")

            if from_label:
                outflow += val
            if to_label:
                inflow += val

            if val >= 0.0001:  # Track any meaningful BNB transfer
                whale_txs.append({
                    "hash": tx.get("hash", ""),
                    "from": from_addr,
                    "fromLabel": from_label,
                    "to": to_addr,
                    "toLabel": to_label,
                    "value": round(val, 4),
                    "valueUsd": round(val * bnb_price, 2),
                    "block": block_num,
                    "time": block_time,
                    "gasPrice": round(int(tx.get("gasPrice", "0x0"), 16) / 1e9, 2),
                })

    # Sort by value desc
    whale_txs.sort(key=lambda x: x["value"], reverse=True)
    whale_txs = whale_txs[:25]

    net_flow = inflow - outflow
    flow_direction = "accumulation" if net_flow > 0 else "distribution" if net_flow < 0 else "neutral"

    return {
        "bnbPrice": bnb_price,
        "blocksScanned": n_scan,
        "latestBlock": latest,
        "totalTxs": total_txs,
        "totalVolume": round(total_volume, 2),
        "totalVolumeUsd": round(total_volume * bnb_price, 2),
        "whaleCount": len(whale_txs),
        "inflow": round(inflow, 2),
        "outflow": round(outflow, 2),
        "netFlow": round(net_flow, 2),
        "netFlowUsd": round(net_flow * bnb_price, 2),
        "flowDirection": flow_direction,
        "whales": whale_txs,
    }


# ── Mefai Skills Batch 3: Deep Chain Analytics ──────────────────────

_FUNC_SIGS = {
    "0xa9059cbb": "transfer(address,uint256)",
    "0x095ea7b3": "approve(address,uint256)",
    "0x23b872dd": "transferFrom(address,address,uint256)",
    "0x38ed1739": "swapExactTokensForTokens",
    "0x7ff36ab5": "swapExactETHForTokens",
    "0x18cbafe5": "swapExactTokensForETH",
    "0x5c11d795": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    "0xb6f9de95": "swapExactETHForTokensSupportingFeeOnTransferTokens",
    "0x791ac947": "swapExactTokensForETHSupportingFeeOnTransferTokens",
    "0xe8e33700": "addLiquidity",
    "0xf305d719": "addLiquidityETH",
    "0xbaa2abde": "removeLiquidity",
    "0x02751cec": "removeLiquidityETH",
    "0x40c10f19": "mint(address,uint256)",
    "0x42966c68": "burn(uint256)",
    "0x70a08231": "balanceOf(address)",
    "0xdd62ed3e": "allowance(address,address)",
}

_EVENT_TOPICS = {
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": "Transfer",
    "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": "Approval",
    "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822": "Swap",
    "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1": "Sync",
}

_PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54917c3e6fE49"
_1INCH_ROUTER = "0x1111111254EEB25477B68fb85Ed929f73A960582"


@router.get("/mefai/tx-decoder")
async def mefai_tx_decoder(
    hash: str = Query(..., min_length=66, max_length=66, description="Transaction hash"),
):
    """Decode any BSC transaction: function, events, token transfers, gas."""
    import asyncio

    tx_task = _rpc_call("eth_getTransactionByHash", [hash], ttl=120)
    receipt_task = _rpc_call("eth_getTransactionReceipt", [hash], ttl=120)
    tx_raw, receipt_raw = await asyncio.gather(tx_task, receipt_task, return_exceptions=True)

    tx = tx_raw.get("result") if isinstance(tx_raw, dict) else None
    receipt = receipt_raw.get("result") if isinstance(receipt_raw, dict) else None

    if not tx:
        return {"error": "Transaction not found"}

    # Decode function selector
    input_data = tx.get("input", "0x")
    func_selector = input_data[:10] if len(input_data) >= 10 else ""
    func_name = _FUNC_SIGS.get(func_selector, "unknown")

    # Parse value
    value_wei = int(tx.get("value", "0x0"), 16)
    value_bnb = value_wei / 1e18

    # Gas info from receipt
    gas_used = int(receipt.get("gasUsed", "0x0"), 16) if receipt else 0
    gas_price = int(tx.get("gasPrice", "0x0"), 16)
    gas_cost_bnb = gas_used * gas_price / 1e18
    status = int(receipt.get("status", "0x1"), 16) if receipt else None

    # Parse event logs
    events = []
    token_transfers = []
    logs = receipt.get("logs", []) if receipt else []
    for log in logs:
        topics = log.get("topics", [])
        if not topics:
            continue
        event_name = _EVENT_TOPICS.get(topics[0], "Unknown")
        event = {
            "event": event_name,
            "address": log.get("address", ""),
            "topic0": topics[0] if len(topics) > 0 else "",
            "data": log.get("data", "0x"),
        }
        events.append(event)

        # Extract Transfer events for token transfers
        if event_name == "Transfer" and len(topics) >= 3:
            try:
                from_addr = "0x" + topics[1][-40:]
                to_addr = "0x" + topics[2][-40:]
                raw_amount = int(log.get("data", "0x0"), 16) if log.get("data") and log["data"] != "0x" else 0
                token_transfers.append({
                    "token": log.get("address", ""),
                    "from": from_addr,
                    "fromLabel": _KNOWN_WALLETS.get(from_addr.lower(), ""),
                    "to": to_addr,
                    "toLabel": _KNOWN_WALLETS.get(to_addr.lower(), ""),
                    "rawAmount": str(raw_amount),
                })
            except Exception:
                pass

    return {
        "hash": hash,
        "from": tx.get("from", ""),
        "fromLabel": _KNOWN_WALLETS.get((tx.get("from") or "").lower(), ""),
        "to": tx.get("to", ""),
        "toLabel": _KNOWN_WALLETS.get((tx.get("to") or "").lower(), ""),
        "value": value_bnb,
        "function": func_name,
        "functionSelector": func_selector,
        "status": "success" if status == 1 else "failed" if status == 0 else "unknown",
        "gasUsed": gas_used,
        "gasPrice": round(gas_price / 1e9, 2),
        "gasCostBnb": round(gas_cost_bnb, 6),
        "blockNumber": int(tx.get("blockNumber", "0x0"), 16) if tx.get("blockNumber") else None,
        "nonce": int(tx.get("nonce", "0x0"), 16),
        "events": events,
        "tokenTransfers": token_transfers,
    }


@router.get("/mefai/contract-xray")
async def mefai_contract_xray(
    address: str = Query(..., min_length=42, max_length=42, description="Contract address"),
):
    """Deep contract analysis: bytecode selectors, proxy check, ownership, patterns."""
    import asyncio

    addr = address.lower()

    # Parallel: code, owner, name, symbol, decimals, proxy impl slot
    code_task = _rpc_call("eth_getCode", [addr, "latest"], ttl=300)
    owner_task = _rpc_call("eth_call", [{"to": addr, "data": "0x8da5cb5b"}, "latest"], ttl=300)
    name_task = _rpc_call("eth_call", [{"to": addr, "data": _ERC20_NAME}, "latest"], ttl=300)
    sym_task = _rpc_call("eth_call", [{"to": addr, "data": _ERC20_SYMBOL}, "latest"], ttl=300)
    dec_task = _rpc_call("eth_call", [{"to": addr, "data": _ERC20_DECIMALS}, "latest"], ttl=300)
    proxy_task = _rpc_call(
        "eth_getStorageAt",
        [addr, "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc", "latest"],
        ttl=300,
    )

    code_res, owner_res, name_res, sym_res, dec_res, proxy_res = await asyncio.gather(
        code_task, owner_task, name_task, sym_task, dec_task, proxy_task,
        return_exceptions=True,
    )

    # Parse code
    bytecode = ""
    if isinstance(code_res, dict):
        bytecode = code_res.get("result", "0x")
    code_size = (len(bytecode) - 2) // 2 if bytecode and bytecode != "0x" else 0

    if code_size == 0:
        return {"address": addr, "isContract": False, "codeSize": 0, "error": "Not a contract (EOA)"}

    # Scan for PUSH4 opcodes (0x63) to extract function selectors
    detected_funcs = []
    all_sigs = {**_FUNC_SIGS, _ERC20_NAME: "name()", _ERC20_SYMBOL: "symbol()",
                _ERC20_DECIMALS: "decimals()", _ERC20_TOTAL_SUPPLY: "totalSupply()",
                _ERC20_BALANCE_OF: "balanceOf(address)"}
    try:
        code_hex = bytecode[2:]  # strip 0x
        i = 0
        found_selectors = set()
        while i < len(code_hex) - 10:
            # PUSH4 = 0x63
            if code_hex[i:i + 2] == "63":
                selector = "0x" + code_hex[i + 2:i + 10]
                found_selectors.add(selector)
                i += 10
            else:
                i += 2
        for sel in found_selectors:
            name = all_sigs.get(sel, "")
            detected_funcs.append({"selector": sel, "name": name})
    except Exception:
        pass

    # Proxy check
    is_proxy = False
    impl_addr = ""
    if isinstance(proxy_res, dict):
        slot_val = proxy_res.get("result", "0x" + "0" * 64)
        if slot_val and slot_val != "0x" + "0" * 64 and int(slot_val, 16) != 0:
            is_proxy = True
            impl_addr = "0x" + slot_val[-40:]

    # Owner
    owner = ""
    if isinstance(owner_res, dict) and owner_res.get("result") and len(owner_res["result"]) >= 42:
        raw = owner_res["result"]
        if int(raw, 16) != 0:
            owner = "0x" + raw[-40:]

    # Patterns
    has_mint = any(f["selector"] == "0x40c10f19" for f in detected_funcs)
    has_pause = any(f["selector"] == "0x8456cb59" for f in detected_funcs)
    has_burn = any(f["selector"] == "0x42966c68" for f in detected_funcs)
    has_blacklist = any(f["selector"] in ("0x44337ea1", "0xe47d6060") for f in detected_funcs)

    # ERC20 info
    def _dec_str(res):
        if not isinstance(res, dict):
            return ""
        hex_val = res.get("result", "0x")
        if not hex_val or hex_val == "0x" or len(hex_val) < 66:
            return ""
        try:
            raw = hex_val.replace("0x", "")
            offset = int(raw[:64], 16) * 2
            length = int(raw[offset:offset + 64], 16)
            data = raw[offset + 64:offset + 64 + length * 2]
            return bytes.fromhex(data).decode("utf-8", errors="ignore").strip("\x00")
        except Exception:
            return ""

    name = _dec_str(name_res)
    symbol = _dec_str(sym_res)
    decimals = None
    if isinstance(dec_res, dict) and dec_res.get("result"):
        try:
            decimals = int(dec_res["result"], 16)
        except Exception:
            pass

    erc20_info = None
    if name or symbol or decimals is not None:
        erc20_info = {"name": name, "symbol": symbol, "decimals": decimals}

    return {
        "address": addr,
        "isContract": True,
        "codeSize": code_size,
        "isProxy": is_proxy,
        "implementationAddress": impl_addr if is_proxy else None,
        "owner": owner or None,
        "ownerLabel": _KNOWN_WALLETS.get(owner.lower(), "") if owner else None,
        "detectedFunctions": sorted(detected_funcs, key=lambda x: x["name"], reverse=True)[:50],
        "hasPatterns": {
            "mintable": has_mint,
            "pausable": has_pause,
            "burnable": has_burn,
            "blacklistable": has_blacklist,
        },
        "erc20Info": erc20_info,
    }


@router.get("/mefai/approval-scanner")
async def mefai_approval_scanner(
    address: str = Query(..., min_length=42, max_length=42, description="Wallet address"),
):
    """Check token approvals for a wallet against major BSC DEX routers."""
    import asyncio

    addr = address.lower()
    addr_padded = addr.replace("0x", "").zfill(64)

    # Major BSC DEX routers and protocols
    spenders = {
        "0x10ed43c718714eb63d5aa57b78b54704e256024e": "PancakeSwap V2",
        "0x13f4ea83d0bd40e75c8222255bc855a974568dd4": "PancakeSwap V3",
        "0x1b81d678ffb9c0263b24a97847620c99d213eb14": "PancakeSwap Smart",
        "0x05ff2b0db69458a0750badebc4f9e13add608c7f": "PancakeSwap V1",
        _1INCH_ROUTER.lower(): "1inch Router",
        "0xeaf1ac8e89ea0ae13e0cee2bda2c84ab5b1d8e09": "Biswap",
        "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7": "ApeSwap",
        "0x1111111254eeb25477b68fb85ed929f73a960582": "1inch v5",
        "0xdef171fe48cf0115b1d80b88dc8eab59176fee57": "ParaSwap",
    }

    tasks = []
    task_keys = []
    token_list = list(_TOP_BSC_PORTFOLIO.items())

    for contract, symbol in token_list:
        for spender, label in spenders.items():
            spender_padded = spender.replace("0x", "").zfill(64)
            data = f"0xdd62ed3e{addr_padded}{spender_padded}"
            tasks.append(
                _rpc_call("eth_call", [{"to": contract.lower(), "data": data}, "latest"], ttl=30)
            )
            task_keys.append((contract, symbol, spender, label))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    approvals = []
    for i, (contract, symbol, spender, label) in enumerate(task_keys):
        r = results[i]
        if isinstance(r, Exception) or not isinstance(r, dict):
            continue
        raw = r.get("result", "0x0")
        if raw and raw != "0x":
            try:
                allowance = int(raw, 16)
            except Exception:
                allowance = 0
            if allowance > 0:
                is_unlimited = allowance > 10 ** 50
                approvals.append({
                    "token": contract,
                    "symbol": symbol,
                    "spender": spender,
                    "spenderLabel": label,
                    "allowance": str(allowance),
                    "isUnlimited": is_unlimited,
                })

    # Sort: unlimited first, then by symbol
    approvals.sort(key=lambda a: (0 if a["isUnlimited"] else 1, a["symbol"]))

    return {
        "address": addr,
        "tokensChecked": len(token_list),
        "spendersChecked": len(spenders),
        "totalApprovals": len(approvals),
        "approvals": approvals,
    }


@router.get("/mefai/block-autopsy")
async def mefai_block_autopsy(
    number: str = Query("latest", description="Block number in hex or 'latest'"),
):
    """Drill into a block: TX types, gas consumers, value transferred."""
    import asyncio

    # If 'latest', resolve to actual number
    if number == "latest":
        bn = await _rpc_call("eth_blockNumber", [], ttl=5)
        try:
            number = bn.get("result", "0x0")
        except Exception:
            return {"error": "Cannot fetch block number"}

    block_res = await _rpc_call("eth_getBlockByNumber", [number, True], ttl=15)
    block = block_res.get("result") if isinstance(block_res, dict) else None
    if not block:
        return {"error": "Block not found"}

    block_num = int(block.get("number", "0x0"), 16)
    timestamp = int(block.get("timestamp", "0x0"), 16)
    gas_used = int(block.get("gasUsed", "0x0"), 16)
    gas_limit = int(block.get("gasLimit", "0x0"), 16)
    miner = block.get("miner", "")
    txs = block.get("transactions", [])

    tx_types = {"transfer": 0, "swap": 0, "approve": 0, "other": 0}
    total_value = 0
    gas_by_contract = {}

    swap_selectors = {"0x38ed1739", "0x7ff36ab5", "0x18cbafe5", "0x5c11d795", "0xb6f9de95", "0x791ac947"}
    approve_selectors = {"0x095ea7b3"}
    transfer_selectors = {"0xa9059cbb", "0x23b872dd"}

    for tx in txs:
        val = int(tx.get("value", "0x0"), 16) / 1e18
        total_value += val
        to_addr = (tx.get("to") or "").lower()
        input_data = tx.get("input", "0x")
        selector = input_data[:10] if len(input_data) >= 10 else ""
        tx_gas = int(tx.get("gas", "0x0"), 16)

        if selector in swap_selectors:
            tx_types["swap"] += 1
        elif selector in approve_selectors:
            tx_types["approve"] += 1
        elif selector in transfer_selectors or (input_data == "0x" and val > 0):
            tx_types["transfer"] += 1
        else:
            tx_types["other"] += 1

        if to_addr:
            if to_addr not in gas_by_contract:
                gas_by_contract[to_addr] = {"gasUsed": 0, "txCount": 0}
            gas_by_contract[to_addr]["gasUsed"] += tx_gas
            gas_by_contract[to_addr]["txCount"] += 1

    # Top 5 gas consumers
    top_gas = sorted(gas_by_contract.items(), key=lambda x: x[1]["gasUsed"], reverse=True)[:5]
    top_consumers = [
        {
            "address": addr,
            "label": _KNOWN_WALLETS.get(addr, ""),
            "gasUsed": info["gasUsed"],
            "txCount": info["txCount"],
        }
        for addr, info in top_gas
    ]

    return {
        "blockNumber": block_num,
        "timestamp": timestamp,
        "txCount": len(txs),
        "gasUsed": gas_used,
        "gasLimit": gas_limit,
        "gasPct": round(gas_used / gas_limit * 100, 1) if gas_limit > 0 else 0,
        "totalValue": round(total_value, 4),
        "txTypes": tx_types,
        "topGasConsumers": top_consumers,
        "miner": miner,
        "minerLabel": _KNOWN_WALLETS.get(miner.lower(), ""),
    }


@router.get("/mefai/gas-calculator")
async def mefai_gas_calculator():
    """Operation cost estimator: gas costs for common BSC operations vs ETH."""
    import asyncio

    gas_task = _rpc_call("eth_gasPrice", [], ttl=15)
    bnb_task = fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        ttl=60,
    )
    gas_res, bnb_market = await asyncio.gather(gas_task, bnb_task, return_exceptions=True)

    bsc_gas_gwei = 0
    try:
        bsc_gas_gwei = int(gas_res.get("result", "0x0"), 16) / 1e9
    except Exception:
        pass

    bnb_price = 0
    try:
        for p in bnb_market.get("pairs", []):
            if p.get("chainId") == "bsc" and p.get("priceUsd"):
                bnb_price = float(p["priceUsd"])
                break
    except Exception:
        pass

    operations = [
        ("BNB Transfer", 21000),
        ("ERC20 Transfer", 65000),
        ("ERC20 Approve", 46000),
        ("PancakeSwap Swap", 200000),
        ("Add Liquidity", 250000),
        ("Remove Liquidity", 220000),
        ("Contract Deploy (small)", 500000),
        ("Contract Deploy (large)", 3000000),
        ("NFT Mint", 150000),
        ("NFT Transfer", 85000),
    ]

    eth_gas_gwei = 8.0
    eth_price = 1950.0

    costs = []
    for name, gas_units in operations:
        bsc_cost_bnb = bsc_gas_gwei * gas_units / 1e9
        bsc_cost_usd = bsc_cost_bnb * bnb_price
        eth_cost_eth = eth_gas_gwei * gas_units / 1e9
        eth_cost_usd = eth_cost_eth * eth_price
        savings = eth_cost_usd - bsc_cost_usd

        costs.append({
            "operation": name,
            "gasUnits": gas_units,
            "bsc": {
                "costBnb": round(bsc_cost_bnb, 8),
                "costUsd": round(bsc_cost_usd, 6),
            },
            "eth": {
                "costEth": round(eth_cost_eth, 8),
                "costUsd": round(eth_cost_usd, 4),
            },
            "savingsUsd": round(savings, 4),
        })

    return {
        "bscGasGwei": round(bsc_gas_gwei, 2),
        "bnbPrice": bnb_price,
        "ethGasGwei": eth_gas_gwei,
        "ethPrice": eth_price,
        "operations": costs,
    }


@router.get("/mefai/token-battle")
async def mefai_token_battle(
    tokens: str = Query(..., description="Comma separated token addresses, max 4"),
):
    """Compare tokens side-by-side: on-chain + market data."""
    import asyncio

    addresses = [a.strip().lower() for a in tokens.split(",") if a.strip()][:4]
    if not addresses:
        return {"error": "Provide at least one token address"}

    dead_padded = _DEAD_ADDR.replace("0x", "").zfill(64)

    # Build all tasks
    tasks = []
    task_map = []  # (token_idx, field)
    for idx, addr in enumerate(addresses):
        tasks.append(_rpc_call("eth_call", [{"to": addr, "data": _ERC20_NAME}, "latest"], ttl=300))
        task_map.append((idx, "name"))
        tasks.append(_rpc_call("eth_call", [{"to": addr, "data": _ERC20_SYMBOL}, "latest"], ttl=300))
        task_map.append((idx, "symbol"))
        tasks.append(_rpc_call("eth_call", [{"to": addr, "data": _ERC20_DECIMALS}, "latest"], ttl=300))
        task_map.append((idx, "decimals"))
        tasks.append(_rpc_call("eth_call", [{"to": addr, "data": _ERC20_TOTAL_SUPPLY}, "latest"], ttl=60))
        task_map.append((idx, "totalSupply"))
        tasks.append(_rpc_call("eth_getCode", [addr, "latest"], ttl=300))
        task_map.append((idx, "code"))
        tasks.append(_rpc_call("eth_call", [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{dead_padded}"}, "latest"], ttl=60))
        task_map.append((idx, "burned"))

    # DexScreener batch
    dex_addr_str = ",".join(addresses)
    tasks.append(fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{dex_addr_str}", ttl=60))
    task_map.append((-1, "dex"))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    def _dec_str(res):
        if not isinstance(res, dict):
            return ""
        hex_val = res.get("result", "0x")
        if not hex_val or hex_val == "0x" or len(hex_val) < 66:
            return ""
        try:
            raw = hex_val.replace("0x", "")
            offset = int(raw[:64], 16) * 2
            length = int(raw[offset:offset + 64], 16)
            data = raw[offset + 64:offset + 64 + length * 2]
            return bytes.fromhex(data).decode("utf-8", errors="ignore").strip("\x00")
        except Exception:
            return ""

    # Parse on-chain results
    token_data = [{} for _ in addresses]
    for i, (tidx, field) in enumerate(task_map):
        if tidx < 0:
            continue
        r = results[i]
        if isinstance(r, Exception):
            continue
        if field == "name":
            token_data[tidx]["name"] = _dec_str(r)
        elif field == "symbol":
            token_data[tidx]["symbol"] = _dec_str(r)
        elif field == "decimals":
            try:
                token_data[tidx]["decimals"] = int(r.get("result", "0x0"), 16) if isinstance(r, dict) and r.get("result") else None
            except Exception:
                token_data[tidx]["decimals"] = None
        elif field == "totalSupply":
            try:
                token_data[tidx]["totalSupplyRaw"] = int(r.get("result", "0x0"), 16) if isinstance(r, dict) and r.get("result") else 0
            except Exception:
                token_data[tidx]["totalSupplyRaw"] = 0
        elif field == "code":
            code = r.get("result", "0x") if isinstance(r, dict) else "0x"
            token_data[tidx]["codeSize"] = (len(code) - 2) // 2 if code and code != "0x" else 0
        elif field == "burned":
            try:
                token_data[tidx]["burnedRaw"] = int(r.get("result", "0x0"), 16) if isinstance(r, dict) and r.get("result") else 0
            except Exception:
                token_data[tidx]["burnedRaw"] = 0

    # Parse DexScreener
    dex_res = results[-1]
    dex_pairs = (dex_res.get("pairs", []) if isinstance(dex_res, dict) else [])
    price_map = {}
    for p in dex_pairs:
        if p.get("chainId") != "bsc":
            continue
        base_addr = (p.get("baseToken", {}).get("address") or "").lower()
        vol = p.get("volume", {}).get("h24") or 0
        if base_addr and (base_addr not in price_map or vol > (price_map[base_addr].get("volume24h") or 0)):
            price_map[base_addr] = {
                "price": p.get("priceUsd"),
                "volume24h": p.get("volume", {}).get("h24"),
                "liquidity": p.get("liquidity", {}).get("usd"),
                "change24h": p.get("priceChange", {}).get("h24"),
                "change1h": p.get("priceChange", {}).get("h1"),
                "pairs": sum(1 for pp in dex_pairs if (pp.get("baseToken", {}).get("address") or "").lower() == base_addr),
                "dex": p.get("dexId", ""),
                "buys24h": p.get("txns", {}).get("h24", {}).get("buys") or 0,
                "sells24h": p.get("txns", {}).get("h24", {}).get("sells") or 0,
            }

    # Combine
    output = []
    for idx, addr in enumerate(addresses):
        td = token_data[idx]
        dec = td.get("decimals") or 18
        total_supply = td.get("totalSupplyRaw", 0) / (10 ** dec) if td.get("totalSupplyRaw") else 0
        burned = td.get("burnedRaw", 0) / (10 ** dec) if td.get("burnedRaw") else 0
        market = price_map.get(addr, {})

        output.append({
            "address": addr,
            "name": td.get("name", ""),
            "symbol": td.get("symbol", ""),
            "decimals": td.get("decimals"),
            "totalSupply": total_supply,
            "codeSize": td.get("codeSize", 0),
            "burned": burned,
            "burnPct": round(burned / total_supply * 100, 2) if total_supply > 0 else 0,
            "price": market.get("price"),
            "volume24h": market.get("volume24h"),
            "liquidity": market.get("liquidity"),
            "change24h": market.get("change24h"),
            "change1h": market.get("change1h"),
            "pairs": market.get("pairs", 0),
            "dex": market.get("dex", ""),
            "buys24h": market.get("buys24h", 0),
            "sells24h": market.get("sells24h", 0),
        })

    return {"tokens": output}


@router.get("/mefai/pair-analytics")
async def mefai_pair_analytics(
    address: str = Query(..., min_length=42, max_length=42, description="Token address"),
):
    """Deep pair analysis from DexScreener for a token."""
    data = await fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{address.lower()}", ttl=30)
    all_pairs = data.get("pairs", []) if isinstance(data, dict) else []
    bsc_pairs = [p for p in all_pairs if p.get("chainId") == "bsc"]

    if not bsc_pairs:
        return {"address": address.lower(), "pairCount": 0, "pairs": [], "aggregate": {}}

    pairs_out = []
    total_volume = 0
    total_liquidity = 0
    total_txns = 0

    for p in bsc_pairs:
        base = p.get("baseToken", {})
        quote = p.get("quoteToken", {})
        vol = p.get("volume", {})
        chg = p.get("priceChange", {})
        txns_h24 = p.get("txns", {}).get("h24", {})
        liq = p.get("liquidity", {}).get("usd") or 0
        v24 = vol.get("h24") or 0
        buys = txns_h24.get("buys") or 0
        sells = txns_h24.get("sells") or 0

        total_volume += v24
        total_liquidity += liq
        total_txns += buys + sells

        pairs_out.append({
            "pairAddress": p.get("pairAddress", ""),
            "dex": p.get("dexId", ""),
            "baseSymbol": base.get("symbol", ""),
            "quoteSymbol": quote.get("symbol", ""),
            "price": p.get("priceUsd"),
            "priceNative": p.get("priceNative"),
            "volume5m": vol.get("m5"),
            "volume1h": vol.get("h1"),
            "volume6h": vol.get("h6"),
            "volume24h": v24,
            "liquidity": liq,
            "buys24h": buys,
            "sells24h": sells,
            "change5m": chg.get("m5"),
            "change1h": chg.get("h1"),
            "change6h": chg.get("h6"),
            "change24h": chg.get("h24"),
            "pairCreated": p.get("pairCreatedAt"),
        })

    pairs_out.sort(key=lambda x: x["volume24h"] or 0, reverse=True)
    avg_trade = total_volume / total_txns if total_txns > 0 else 0

    return {
        "address": address.lower(),
        "pairCount": len(pairs_out),
        "aggregate": {
            "totalVolume24h": round(total_volume, 2),
            "totalLiquidity": round(total_liquidity, 2),
            "totalTxns24h": total_txns,
            "avgTradeSize": round(avg_trade, 2),
        },
        "pairs": pairs_out,
    }


@router.get("/mefai/token-flow")
async def mefai_token_flow(
    contract: str = Query(..., min_length=42, max_length=42, description="Token contract address"),
):
    """Track token movements in recent blocks by scanning block receipts."""
    import asyncio

    token_addr = contract.lower()

    # Get latest block number
    bn = await _rpc_call("eth_blockNumber", [], ttl=5)
    latest = 0
    try:
        latest = int(bn.get("result", "0x0"), 16)
    except Exception:
        pass
    if latest == 0:
        return {"error": "Cannot fetch block number"}

    # Fetch last 10 blocks with full transactions
    n_blocks = 10
    block_tasks = [
        _rpc_call("eth_getBlockByNumber", [hex(latest - i), True], ttl=15)
        for i in range(n_blocks)
    ]
    block_results = await asyncio.gather(*block_tasks, return_exceptions=True)

    # Find TXs that interact with the token contract OR have input data calling it
    matching_hashes = []
    for r in block_results:
        if not isinstance(r, dict) or not r.get("result"):
            continue
        txs = r["result"].get("transactions", [])
        for tx in txs:
            to_addr = (tx.get("to") or "").lower()
            input_data = tx.get("input", "0x") or "0x"
            # Match direct calls to token contract OR any contract call that might transfer this token
            if to_addr == token_addr:
                matching_hashes.append(tx.get("hash", ""))
            elif len(input_data) >= 10 and token_addr[2:] in input_data.lower():
                matching_hashes.append(tx.get("hash", ""))

    # If no direct matches, grab all contract interactions and check receipts
    if len(matching_hashes) < 5:
        for r in block_results:
            if not isinstance(r, dict) or not r.get("result"):
                continue
            txs = r["result"].get("transactions", [])
            for tx in txs:
                h = tx.get("hash", "")
                if h not in matching_hashes and len(tx.get("input", "0x")) > 10:
                    matching_hashes.append(h)
                    if len(matching_hashes) >= 50:
                        break
            if len(matching_hashes) >= 50:
                break

    if not matching_hashes:
        return {
            "contract": token_addr,
            "blocksScanned": n_blocks,
            "latestBlock": latest,
            "totalTransfers": 0,
            "uniqueAddresses": 0,
            "transfers": [],
        }

    # Fetch receipts in parallel
    receipt_tasks = [
        _rpc_call("eth_getTransactionReceipt", [h], ttl=15)
        for h in matching_hashes[:50]
    ]
    receipt_results = await asyncio.gather(*receipt_tasks, return_exceptions=True)

    transfer_topic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    transfers = []
    unique_addrs = set()

    for r in receipt_results:
        if not isinstance(r, dict) or not r.get("result"):
            continue
        receipt = r["result"]
        tx_hash = receipt.get("transactionHash", "")
        block_num = int(receipt.get("blockNumber", "0x0"), 16)
        for log in receipt.get("logs", []):
            if (log.get("address") or "").lower() != token_addr:
                continue
            topics = log.get("topics", [])
            if len(topics) >= 3 and topics[0] == transfer_topic:
                try:
                    from_addr = "0x" + topics[1][-40:]
                    to_addr = "0x" + topics[2][-40:]
                    raw_amount = int(log.get("data", "0x0"), 16) if log.get("data") and log["data"] != "0x" else 0
                    unique_addrs.add(from_addr)
                    unique_addrs.add(to_addr)
                    transfers.append({
                        "txHash": tx_hash,
                        "block": block_num,
                        "from": from_addr,
                        "fromLabel": _KNOWN_WALLETS.get(from_addr.lower(), ""),
                        "to": to_addr,
                        "toLabel": _KNOWN_WALLETS.get(to_addr.lower(), ""),
                        "rawAmount": str(raw_amount),
                    })
                except Exception:
                    pass

    # Sort by amount desc
    transfers.sort(key=lambda x: int(x["rawAmount"]), reverse=True)
    largest = transfers[0]["rawAmount"] if transfers else "0"

    return {
        "contract": token_addr,
        "blocksScanned": n_blocks,
        "latestBlock": latest,
        "totalTransfers": len(transfers),
        "uniqueAddresses": len(unique_addrs),
        "largestTransfer": largest,
        "transfers": transfers[:20],
    }


@router.get("/mefai/yield-finder")
async def mefai_yield_finder():
    """Find best yield opportunities on BSC by trading fee proxy."""
    all_addrs = list(_TOP_BSC_PORTFOLIO.keys()) + _DEFI_TOKENS[:6]
    data = await fetch_json(
        f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(all_addrs),
        ttl=60,
    )
    pairs = data.get("pairs", []) if isinstance(data, dict) else []
    bsc_pairs = [p for p in pairs if p.get("chainId") == "bsc"]

    # Deduplicate by pair address
    seen = {}
    for p in bsc_pairs:
        pa = p.get("pairAddress", "")
        if pa not in seen:
            seen[pa] = p

    results = []
    for p in seen.values():
        vol = p.get("volume", {}).get("h24") or 0
        liq = p.get("liquidity", {}).get("usd") or 0
        if liq < 10000:
            continue

        # Annualized fee yield estimate: (volume * 0.3% fee * 365) / liquidity
        fee_yield = (vol * 0.003 * 365) / liq * 100

        txns = p.get("txns", {}).get("h24", {})
        buys = txns.get("buys") or 0
        sells = txns.get("sells") or 0
        total = buys + sells
        buy_pressure = (buys / total * 100) if total > 0 else 50

        base = p.get("baseToken", {})
        quote = p.get("quoteToken", {})

        results.append({
            "pair": f"{base.get('symbol', '?')}/{quote.get('symbol', '?')}",
            "pairAddress": p.get("pairAddress", ""),
            "dex": p.get("dexId", ""),
            "baseAddress": base.get("address", ""),
            "price": p.get("priceUsd"),
            "volume24h": vol,
            "liquidity": liq,
            "vlRatio": round(vol / liq, 2) if liq > 0 else 0,
            "estimatedApy": round(fee_yield, 2),
            "buyPressure": round(buy_pressure, 1),
            "buys24h": buys,
            "sells24h": sells,
            "change24h": p.get("priceChange", {}).get("h24"),
        })

    results.sort(key=lambda x: x["estimatedApy"], reverse=True)
    return {"opportunities": results[:15]}


@router.get("/mefai/risk-radar")
async def mefai_risk_radar(
    address: str = Query(..., min_length=42, max_length=42, description="Address or contract"),
):
    """Comprehensive risk assessment for any BSC address/contract."""
    import asyncio

    addr = address.lower()

    # Parallel checks
    code_task = _rpc_call("eth_getCode", [addr, "latest"], ttl=60)
    bal_task = _rpc_call("eth_getBalance", [addr, "latest"], ttl=15)
    nonce_task = _rpc_call("eth_getTransactionCount", [addr, "latest"], ttl=15)
    owner_task = _rpc_call("eth_call", [{"to": addr, "data": "0x8da5cb5b"}, "latest"], ttl=60)
    name_task = _rpc_call("eth_call", [{"to": addr, "data": _ERC20_NAME}, "latest"], ttl=60)
    sym_task = _rpc_call("eth_call", [{"to": addr, "data": _ERC20_SYMBOL}, "latest"], ttl=60)
    dead_padded = _DEAD_ADDR.replace("0x", "").zfill(64)
    burn_task = _rpc_call("eth_call", [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{dead_padded}"}, "latest"], ttl=60)
    dex_task = fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addr}", ttl=60)

    code_res, bal_res, nonce_res, owner_res, name_res, sym_res, burn_res, dex_res = await asyncio.gather(
        code_task, bal_task, nonce_task, owner_task, name_task, sym_task, burn_task, dex_task,
        return_exceptions=True,
    )

    # Parse code
    bytecode = code_res.get("result", "0x") if isinstance(code_res, dict) else "0x"
    is_contract = bytecode not in ("0x", "0x0", None, "")
    code_size = (len(bytecode) - 2) // 2 if is_contract else 0

    # Balance
    balance = 0
    try:
        balance = int(bal_res.get("result", "0x0"), 16) / 1e18
    except Exception:
        pass

    # TX count
    tx_count = 0
    try:
        tx_count = int(nonce_res.get("result", "0x0"), 16)
    except Exception:
        pass

    # Owner
    owner = ""
    if isinstance(owner_res, dict) and owner_res.get("result") and len(owner_res["result"]) >= 42:
        raw = owner_res["result"]
        try:
            if int(raw, 16) != 0:
                owner = "0x" + raw[-40:]
        except Exception:
            pass

    # Name/Symbol
    def _dec_str(res):
        if not isinstance(res, dict):
            return ""
        hex_val = res.get("result", "0x")
        if not hex_val or hex_val == "0x" or len(hex_val) < 66:
            return ""
        try:
            raw = hex_val.replace("0x", "")
            offset = int(raw[:64], 16) * 2
            length = int(raw[offset:offset + 64], 16)
            data = raw[offset + 64:offset + 64 + length * 2]
            return bytes.fromhex(data).decode("utf-8", errors="ignore").strip("\x00")
        except Exception:
            return ""

    name = _dec_str(name_res)
    symbol = _dec_str(sym_res)

    # Burn balance
    has_burn_tokens = False
    try:
        burn_val = int(burn_res.get("result", "0x0"), 16) if isinstance(burn_res, dict) and burn_res.get("result") else 0
        has_burn_tokens = burn_val > 0
    except Exception:
        pass

    # Dangerous selectors in bytecode
    has_mint = False
    has_pause = False
    has_blacklist = False
    has_selfdestruct = False
    if is_contract:
        code_hex = bytecode[2:] if bytecode.startswith("0x") else bytecode
        # Check for PUSH4 selectors
        has_mint = "40c10f19" in code_hex
        has_pause = "8456cb59" in code_hex
        has_blacklist = "44337ea1" in code_hex or "e47d6060" in code_hex
        has_selfdestruct = "ff" in code_hex  # SELFDESTRUCT opcode

    # DexScreener market data
    market_data = None
    liquidity = 0
    volume = 0
    pair_count = 0
    try:
        pairs = [p for p in (dex_res.get("pairs", []) if isinstance(dex_res, dict) else []) if p.get("chainId") == "bsc"]
        pair_count = len(pairs)
        if pairs:
            top = pairs[0]
            liquidity = top.get("liquidity", {}).get("usd") or 0
            volume = top.get("volume", {}).get("h24") or 0
            market_data = {
                "price": top.get("priceUsd"),
                "volume24h": volume,
                "liquidity": liquidity,
                "change24h": top.get("priceChange", {}).get("h24"),
                "pairs": pair_count,
                "dex": top.get("dexId", ""),
            }
    except Exception:
        pass

    # Calculate risk score (0-100, higher=safer)
    score = 0
    risks = []
    positives = []

    if is_contract:
        score += 20
        positives.append("Is a contract")
    if name and symbol:
        score += 15
        positives.append(f"Has name ({name}) and symbol ({symbol})")
    if liquidity > 10000:
        score += 15
        positives.append(f"Liquidity ${liquidity:,.0f}")
    if volume > 1000:
        score += 10
        positives.append(f"24h volume ${volume:,.0f}")
    if pair_count > 1:
        score += 10
        positives.append(f"{pair_count} trading pairs")
    if not has_mint:
        score += 10
        positives.append("No mint function detected")
    else:
        score -= 20
        risks.append("Owner can mint new tokens")
    if not has_pause:
        score += 10
        positives.append("No pause function detected")
    else:
        score -= 15
        risks.append("Contract is pausable")
    if not has_blacklist:
        score += 5
        positives.append("No blacklist function detected")
    else:
        score -= 10
        risks.append("Contract has blacklist capability")
    if has_burn_tokens:
        score += 5
        positives.append("Tokens burned at dead address")
    if has_selfdestruct and is_contract:
        risks.append("Contains SELFDESTRUCT opcode")

    # Clamp score
    score = max(0, min(100, score))
    grade = "A" if score >= 80 else "B" if score >= 60 else "C" if score >= 40 else "D" if score >= 20 else "F"

    return {
        "address": addr,
        "isContract": is_contract,
        "codeSize": code_size,
        "balance": round(balance, 6),
        "txCount": tx_count,
        "owner": owner or None,
        "ownerLabel": _KNOWN_WALLETS.get(owner.lower(), "") if owner else None,
        "name": name,
        "symbol": symbol,
        "riskScore": score,
        "grade": grade,
        "risks": risks,
        "positives": positives,
        "marketData": market_data,
    }


# ── Mefai Advanced Endpoints (10 new) ────────────────────────────────

_BSC_VALIDATORS = {
    "0x72b61c6014342d914470ec7ac2975be345796c2b": "Ankr",
    "0x2465176c461afb316ebc773c61faee85a6515daa": "BNB48 Club",
    "0x295e26495cef6f69dfa69911d9d8e4f3bbadb89b": "Legend",
    "0xe2d3a739effcd3a99387d015e260eefac72ebea1": "Fuji",
    "0xb218c5d6af1f979ac42bc68d98a5a0d796c6ab01": "Namelix",
    "0xa6f79b60359f141df90a0c745125b131caaffd12": "Certik",
    "0xee226379db83cffc681495730c11fdde79ba4c0c": "Avengers",
    "0x2d4c407bbe49438ed859fe965b140dcf1aab71a9": "TW Staking",
    "0x685b1ded8013785d6623cc18d214320b6bb64759": "NodeReal",
    "0xe9ae3261a475a27bb1028f140bc2a7c843318afd": "Defibit",
    "0x70f657164e5b75689b64b7fd1fa275f334f28e18": "InfStones",
    "0xbe807dddb074639cd9fa61b47676c064fc50d62c": "Tranchess",
    "0x4396e28197653d0c244d95f8c1e57da902a72b4e": "MathWallet",
    "0xef0274e31810c9df02f98fafde0f841f4e66a1cd": "Celer Network",
    "0x9bb832254baf4e8b4cc26bd2b52b31389b56e98b": "Legend II",
    "0x980a75ecd1309ea12fa2ed87a8744fbfc9b863d5": "HashQuark",
    "0x3f349bbafec1551819b8be1efea2fc46ca749aa1": "Pexmons",
    "0x35ead5bca32d21bead5c6b603e8de8ad4a35e24c": "Stakely",
    "0x4430b3230294d12c6ab2aac5c2cd68e80b16b581": "BSCValidator",
    "0xcc8e6d00c17eb431350c6c50d8b8f4d23c4c3d23": "Validator 20",
    "0xbbb2d18aced2fa6a426448a4bea99d1e7b7ef2cc": "Validator 21",
}

_EXTENDED_TOKENS = {
    "0xbA2aE424d960c26247Dd6c32edC70B295c744C43": "DOGE",
    "0x7083609fce4d1d8Dc0C979AAb8c869Ea2C873402": "DOT",
    "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD": "LINK",
    "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF": "SOL",
    "0xCC42724C6683B7E57334c4E856f4c9965ED682bD": "MATIC",
    "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1": "UNI",
    "0xfb6115445Bff7b52FeB98650C87f44907E58f802": "AAVE",
}

_TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"


def _dec_str_util(hex_val):
    """Decode ABI-encoded string from hex result."""
    if not hex_val or hex_val == "0x" or len(hex_val) < 66:
        return ""
    try:
        raw = hex_val.replace("0x", "")
        offset = int(raw[:64], 16) * 2
        length = int(raw[offset:offset + 64], 16)
        data = raw[offset + 64:offset + 64 + length * 2]
        return bytes.fromhex(data).decode("utf-8", errors="ignore").strip("\x00")
    except Exception:
        return ""


def _safe_int(hex_val, default=0):
    """Safely convert hex string to int."""
    try:
        if hex_val and hex_val not in ("0x", "0x0", None, ""):
            return int(hex_val, 16)
    except Exception:
        pass
    return default


# ── 1. Sniper Detector ──────────────────────────────────────────────

@router.get("/mefai/sniper-detector")
async def mefai_sniper_detector(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Detect sniper bot activity on a token by analyzing early block buys."""
    import asyncio

    addr = address.lower()
    try:
        # Get token pairs from DexScreener
        dex_data = await fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addr}", ttl=30)
        pairs = [p for p in (dex_data.get("pairs") or []) if p.get("chainId") == "bsc"]
        if not pairs:
            return {"error": "No BSC pairs found for this token", "address": addr}

        pair_addr = pairs[0].get("pairAddress", "").lower()
        token_symbol = pairs[0].get("baseToken", {}).get("symbol", "UNKNOWN")

        # Get latest block number
        bn = await _rpc_call("eth_blockNumber", [], ttl=5)
        latest = _safe_int(bn.get("result"))
        if latest == 0:
            return {"error": "Cannot fetch block number"}

        # Fetch last 20 blocks with full transactions
        block_tasks = [
            _rpc_call("eth_getBlockByNumber", [hex(latest - i), True], ttl=10)
            for i in range(20)
        ]
        block_results = await asyncio.gather(*block_tasks, return_exceptions=True)

        # Find transactions involving the token or pair contracts
        candidate_txs = []
        for idx, br in enumerate(block_results):
            if isinstance(br, Exception) or not br.get("result"):
                continue
            block = br["result"]
            block_num = _safe_int(block.get("number"))
            for tx in (block.get("transactions") or []):
                to_addr = (tx.get("to") or "").lower()
                if to_addr in (addr, pair_addr, _PANCAKE_ROUTER.lower()):
                    candidate_txs.append({
                        "hash": tx["hash"],
                        "from": tx.get("from", "").lower(),
                        "to": to_addr,
                        "block": block_num,
                        "blockIndex": idx,
                        "value": _safe_int(tx.get("value")),
                    })

        # Fetch receipts for candidate TXs to find Transfer events
        receipt_tasks = [
            _rpc_call("eth_getTransactionReceipt", [tx["hash"]], ttl=30)
            for tx in candidate_txs[:30]  # limit to 30 receipts
        ]
        receipts = await asyncio.gather(*receipt_tasks, return_exceptions=True)

        early_buyers = {}
        for i, rcpt in enumerate(receipts):
            if isinstance(rcpt, Exception) or not rcpt.get("result"):
                continue
            logs = rcpt["result"].get("logs") or []
            for log in logs:
                topics = log.get("topics") or []
                if len(topics) >= 3 and topics[0] == _TRANSFER_TOPIC:
                    log_addr = (log.get("address") or "").lower()
                    if log_addr == addr:
                        buyer = "0x" + topics[2][-40:]
                        amount_raw = _safe_int(log.get("data"))
                        if buyer not in early_buyers:
                            early_buyers[buyer] = {
                                "address": buyer,
                                "block": candidate_txs[i]["block"],
                                "blockIndex": candidate_txs[i]["blockIndex"],
                                "amount": amount_raw,
                                "label": _KNOWN_WALLETS.get(buyer, ""),
                            }

        # Check if early buyers still hold
        buyer_list = list(early_buyers.values())[:15]
        hold_tasks = []
        for b in buyer_list:
            padded = b["address"].replace("0x", "").zfill(64)
            hold_tasks.append(
                _rpc_call("eth_call",
                          [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{padded}"}, "latest"],
                          ttl=15)
            )
        hold_results = await asyncio.gather(*hold_tasks, return_exceptions=True)

        for i, hr in enumerate(hold_results):
            if isinstance(hr, Exception):
                buyer_list[i]["stillHolds"] = False
            else:
                bal = _safe_int(hr.get("result"))
                buyer_list[i]["stillHolds"] = bal > 0

        # Calculate sniper score
        # High score if many buys in first 2-3 blocks
        first_block_buys = sum(1 for b in buyer_list if b["blockIndex"] >= 17)  # earliest blocks
        first_3_block_buys = sum(1 for b in buyer_list if b["blockIndex"] >= 15)
        total_buys = len(buyer_list)

        sniper_score = 0
        if total_buys > 0:
            concentration = first_3_block_buys / max(total_buys, 1)
            sniper_score = min(100, int(concentration * 60 + first_block_buys * 15))

        return {
            "address": addr,
            "symbol": token_symbol,
            "pairAddress": pair_addr,
            "sniperScore": sniper_score,
            "totalEarlyBuyers": total_buys,
            "earlyBuyers": [
                {
                    "address": b["address"],
                    "block": b["block"],
                    "amount": b["amount"],
                    "stillHolds": b.get("stillHolds", False),
                    "label": b["label"],
                }
                for b in buyer_list
            ],
            "blocksScanned": 20,
            "candidateTxCount": len(candidate_txs),
        }
    except Exception as e:
        return {"error": str(e), "address": addr}


# ── 2. Wallet Cluster ───────────────────────────────────────────────

@router.get("/mefai/wallet-cluster")
async def mefai_wallet_cluster(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Find connected wallets by analyzing BNB transfers and shared token holdings."""
    import asyncio

    seed = address.lower()
    try:
        # Get latest block
        bn = await _rpc_call("eth_blockNumber", [], ttl=5)
        latest = _safe_int(bn.get("result"))
        if latest == 0:
            return {"error": "Cannot fetch block number"}

        # Scan last 30 blocks for direct transfers to/from seed
        block_tasks = [
            _rpc_call("eth_getBlockByNumber", [hex(latest - i), True], ttl=10)
            for i in range(30)
        ]
        block_results = await asyncio.gather(*block_tasks, return_exceptions=True)

        counterparties = {}
        for br in block_results:
            if isinstance(br, Exception) or not br.get("result"):
                continue
            for tx in (br["result"].get("transactions") or []):
                from_addr = (tx.get("from") or "").lower()
                to_addr = (tx.get("to") or "").lower()
                value = _safe_int(tx.get("value"))
                if value == 0:
                    continue
                if from_addr == seed and to_addr:
                    cp = counterparties.setdefault(to_addr, {"txCount": 0})
                    cp["txCount"] += 1
                elif to_addr == seed and from_addr:
                    cp = counterparties.setdefault(from_addr, {"txCount": 0})
                    cp["txCount"] += 1

        # Remove known contracts/routers
        skip = {_PANCAKE_ROUTER.lower(), _1INCH_ROUTER.lower(),
                "0x000000000000000000000000000000000000dead",
                "0x0000000000000000000000000000000000000000", seed}
        counterparties = {k: v for k, v in counterparties.items() if k not in skip}

        # Get BNB balances + top token balances for seed + counterparties (max 10)
        wallets = [seed] + list(counterparties.keys())[:10]
        token_list = list(_TOP_BSC_PORTFOLIO.items())[:6]

        bal_tasks = []
        for w in wallets:
            bal_tasks.append(_rpc_call("eth_getBalance", [w, "latest"], ttl=15))
            padded = w.replace("0x", "").zfill(64)
            for contract, _ in token_list:
                bal_tasks.append(
                    _rpc_call("eth_call",
                              [{"to": contract.lower(), "data": f"{_ERC20_BALANCE_OF}{padded}"}, "latest"],
                              ttl=30)
                )

        bal_results = await asyncio.gather(*bal_tasks, return_exceptions=True)

        stride = 1 + len(token_list)
        wallet_holdings = {}
        for wi, w in enumerate(wallets):
            offset = wi * stride
            bnb_raw = _safe_int(bal_results[offset].get("result") if not isinstance(bal_results[offset], Exception) else "0x0")
            bnb = bnb_raw / 1e18

            held_tokens = []
            for ti, (contract, symbol) in enumerate(token_list):
                r = bal_results[offset + 1 + ti]
                if isinstance(r, Exception):
                    continue
                bal = _safe_int(r.get("result"))
                if bal > 0:
                    held_tokens.append(symbol)

            wallet_holdings[w] = {"bnb": bnb, "tokens": held_tokens}

        seed_tokens = set(wallet_holdings.get(seed, {}).get("tokens", []))

        cluster = []
        total_value = wallet_holdings.get(seed, {}).get("bnb", 0)
        for w in wallets[1:]:
            info = wallet_holdings.get(w, {})
            shared = list(set(info.get("tokens", [])) & seed_tokens)
            is_cluster = len(shared) >= 2
            entry = {
                "address": w,
                "bnbBalance": round(info.get("bnb", 0), 6),
                "sharedTokens": shared,
                "txCount": counterparties.get(w, {}).get("txCount", 0),
                "label": _KNOWN_WALLETS.get(w, ""),
                "isCluster": is_cluster,
            }
            if is_cluster:
                cluster.append(entry)
                total_value += info.get("bnb", 0)

        return {
            "seedWallet": {
                "address": seed,
                "bnbBalance": round(wallet_holdings.get(seed, {}).get("bnb", 0), 6),
                "tokens": wallet_holdings.get(seed, {}).get("tokens", []),
                "label": _KNOWN_WALLETS.get(seed, ""),
            },
            "clusterWallets": cluster,
            "totalClusterValue": round(total_value, 6),
            "counterpartiesScanned": len(counterparties),
            "blocksScanned": 30,
        }
    except Exception as e:
        return {"error": str(e), "address": seed}


# ── 3. Honeypot Check ───────────────────────────────────────────────

@router.get("/mefai/honeypot-check")
async def mefai_honeypot_check(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Combined honeypot detection: bytecode analysis, owner concentration, DEX data."""
    import asyncio

    addr = address.lower()
    try:
        # Dangerous function selectors
        dangerous_selectors = {
            "44337ea1": "blacklist",
            "8456cb59": "pause",
            "49bd5a5e": "maxTxAmount",
            "5342acb4": "excludeFromFee",
            "715018a6": "renounceOwnership",
            "a9059cbb": "transfer",
            "dd62ed3e": "allowance",
        }
        trap_selectors = {"44337ea1", "8456cb59", "49bd5a5e", "5342acb4"}

        dead_padded = "000000000000000000000000000000000000000000000000000000000000dead"

        # Parallel: code, owner, totalSupply, name, symbol, decimals, DexScreener
        tasks = [
            _rpc_call("eth_getCode", [addr, "latest"], ttl=300),          # 0
            _rpc_call("eth_call", [{"to": addr, "data": "0x8da5cb5b"}, "latest"], ttl=60),  # 1 owner
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_TOTAL_SUPPLY}, "latest"], ttl=60),  # 2
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_NAME}, "latest"], ttl=300),  # 3
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_SYMBOL}, "latest"], ttl=300),  # 4
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_DECIMALS}, "latest"], ttl=300),  # 5
            fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addr}", ttl=30),  # 6
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        code_hex = results[0].get("result", "0x") if not isinstance(results[0], Exception) else "0x"
        has_code = code_hex not in ("0x", "0x0", None, "")

        # Decode owner
        owner = ""
        if not isinstance(results[1], Exception):
            owner_raw = results[1].get("result", "0x")
            if owner_raw and len(owner_raw) >= 42:
                owner = "0x" + owner_raw[-40:]
                if owner == "0x" + "0" * 40:
                    owner = ""

        # Decode token info
        name = _dec_str_util(results[3].get("result") if not isinstance(results[3], Exception) else None)
        symbol = _dec_str_util(results[4].get("result") if not isinstance(results[4], Exception) else None)
        decimals = 18
        if not isinstance(results[5], Exception):
            d = _safe_int(results[5].get("result"))
            if 0 < d <= 18:
                decimals = d
        total_supply_raw = _safe_int(results[2].get("result") if not isinstance(results[2], Exception) else "0x0")
        total_supply = total_supply_raw / (10 ** decimals) if total_supply_raw else 0

        # Owner balance
        owner_pct = 0
        if owner:
            owner_padded = owner.replace("0x", "").zfill(64)
            ob = await _rpc_call("eth_call",
                                 [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{owner_padded}"}, "latest"],
                                 ttl=30)
            owner_bal = _safe_int(ob.get("result"))
            owner_supply = owner_bal / (10 ** decimals) if owner_bal else 0
            owner_pct = (owner_supply / total_supply * 100) if total_supply > 0 else 0

        # Scan bytecode for dangerous selectors
        code_lower = code_hex.lower() if code_hex else ""
        found_dangerous = []
        for sel, fname in dangerous_selectors.items():
            if sel in code_lower:
                found_dangerous.append({"selector": sel, "function": fname})
        trap_count = sum(1 for sel in trap_selectors if sel in code_lower)

        # DexScreener data
        dex_data = results[6] if not isinstance(results[6], Exception) else {}
        pairs = [p for p in (dex_data.get("pairs") or []) if p.get("chainId") == "bsc"]
        top_pair = pairs[0] if pairs else {}

        buy_count = 0
        sell_count = 0
        volume_buy = 0
        volume_sell = 0
        pair_age_hours = 0
        if top_pair:
            txns = top_pair.get("txns", {}).get("h24", {})
            buy_count = txns.get("buys", 0)
            sell_count = txns.get("sells", 0)
            volume = top_pair.get("volume", {})
            volume_buy = volume.get("h24", 0) or 0
            created = top_pair.get("pairCreatedAt")
            if created:
                import time
                pair_age_hours = (time.time() * 1000 - created) / 3600000

        # Calculate trapScore
        risk_factors = []
        trap_score = 50  # start neutral

        # Buy/sell asymmetry
        if buy_count > 0 and sell_count == 0:
            trap_score += 30
            risk_factors.append({"name": "No sells detected", "value": f"{buy_count} buys, 0 sells", "severity": "HIGH"})
        elif sell_count > 0:
            ratio = buy_count / sell_count
            if ratio > 5:
                trap_score += 20
                risk_factors.append({"name": "Buy/sell asymmetry", "value": f"{ratio:.1f}x", "severity": "HIGH"})
            elif ratio > 2:
                trap_score += 10
                risk_factors.append({"name": "Buy/sell asymmetry", "value": f"{ratio:.1f}x", "severity": "MEDIUM"})
            else:
                trap_score -= 10

        # Dangerous selectors
        if trap_count >= 3:
            trap_score += 25
            risk_factors.append({"name": "Dangerous functions", "value": f"{trap_count} found", "severity": "HIGH"})
        elif trap_count >= 1:
            trap_score += 10 * trap_count
            risk_factors.append({"name": "Dangerous functions", "value": f"{trap_count} found", "severity": "MEDIUM"})
        else:
            trap_score -= 10

        # Owner concentration
        if owner_pct > 50:
            trap_score += 20
            risk_factors.append({"name": "Owner concentration", "value": f"{owner_pct:.1f}%", "severity": "HIGH"})
        elif owner_pct > 20:
            trap_score += 10
            risk_factors.append({"name": "Owner concentration", "value": f"{owner_pct:.1f}%", "severity": "MEDIUM"})
        elif owner_pct > 0:
            risk_factors.append({"name": "Owner concentration", "value": f"{owner_pct:.1f}%", "severity": "LOW"})

        # Pair age
        if pair_age_hours < 1:
            trap_score += 15
            risk_factors.append({"name": "Very new pair", "value": f"{pair_age_hours:.1f}h", "severity": "HIGH"})
        elif pair_age_hours < 24:
            trap_score += 5
            risk_factors.append({"name": "New pair", "value": f"{pair_age_hours:.1f}h", "severity": "MEDIUM"})
        else:
            trap_score -= 5

        trap_score = max(0, min(100, trap_score))
        if trap_score >= 70:
            verdict = "DANGER"
        elif trap_score >= 40:
            verdict = "CAUTION"
        else:
            verdict = "SAFE"

        return {
            "address": addr,
            "trapScore": trap_score,
            "verdict": verdict,
            "riskFactors": risk_factors,
            "tokenInfo": {
                "name": name,
                "symbol": symbol,
                "decimals": decimals,
                "totalSupply": total_supply,
                "ownerAddress": owner or None,
                "ownerLabel": _KNOWN_WALLETS.get(owner, "") if owner else None,
                "ownerConcentration": round(owner_pct, 2),
            },
            "dangerousFunctions": found_dangerous,
            "dexData": {
                "pairCount": len(pairs),
                "buys24h": buy_count,
                "sells24h": sell_count,
                "volume24h": volume_buy,
                "price": float(top_pair.get("priceUsd", 0)) if top_pair.get("priceUsd") else None,
                "liquidity": top_pair.get("liquidity", {}).get("usd"),
                "pairAgeHours": round(pair_age_hours, 1),
            },
        }
    except Exception as e:
        return {"error": str(e), "address": addr}


# ── 4. Validator Map ────────────────────────────────────────────────

@router.get("/mefai/validator-map")
async def mefai_validator_map():
    """BSC validator analysis: block production, gas utilization, MEV detection."""
    import asyncio

    try:
        bn = await _rpc_call("eth_blockNumber", [], ttl=5)
        latest = _safe_int(bn.get("result"))
        if latest == 0:
            return {"error": "Cannot fetch block number"}

        # Fetch 63 blocks (3 rounds of 21 validators)
        block_tasks = [
            _rpc_call("eth_getBlockByNumber", [hex(latest - i), False], ttl=10)
            for i in range(63)
        ]
        block_results = await asyncio.gather(*block_tasks, return_exceptions=True)

        validators = {}
        rotation = []
        timestamps = []
        total_gas_used = 0
        total_gas_limit = 0
        total_txs = 0
        gas_prices = []

        for idx, br in enumerate(block_results):
            if isinstance(br, Exception) or not br.get("result"):
                continue
            block = br["result"]
            miner = (block.get("miner") or "").lower()
            gas_used = _safe_int(block.get("gasUsed"))
            gas_limit = _safe_int(block.get("gasLimit"))
            timestamp = _safe_int(block.get("timestamp"))
            tx_count = len(block.get("transactions") or [])
            block_num = _safe_int(block.get("number"))

            rotation.append(miner)
            timestamps.append(timestamp)
            total_gas_used += gas_used
            total_gas_limit += gas_limit
            total_txs += tx_count

            gas_util = (gas_used / gas_limit * 100) if gas_limit > 0 else 0

            if miner not in validators:
                validators[miner] = {
                    "blocks": [],
                    "gasUtils": [],
                    "txCounts": [],
                    "timestamps": [],
                }
            v = validators[miner]
            v["blocks"].append(block_num)
            v["gasUtils"].append(gas_util)
            v["txCounts"].append(tx_count)
            v["timestamps"].append(timestamp)

        # Calculate block times
        block_times = []
        for i in range(len(timestamps) - 1):
            dt = abs(timestamps[i] - timestamps[i + 1])
            if 0 < dt < 30:
                block_times.append(dt)

        avg_block_time = sum(block_times) / len(block_times) if block_times else 3.0

        # Detect MEV: gas utilization spikes
        all_gas_utils = []
        for v in validators.values():
            all_gas_utils.extend(v["gasUtils"])
        median_util = sorted(all_gas_utils)[len(all_gas_utils) // 2] if all_gas_utils else 50

        mev_alerts = []
        validator_list = []
        for miner, data in validators.items():
            label = _BSC_VALIDATORS.get(miner, _KNOWN_WALLETS.get(miner, "Unknown"))
            blocks_produced = len(data["blocks"])
            avg_gas = sum(data["gasUtils"]) / len(data["gasUtils"]) if data["gasUtils"] else 0
            avg_tps = sum(data["txCounts"]) / (blocks_produced * avg_block_time) if blocks_produced > 0 else 0

            # Timing consistency
            if len(data["timestamps"]) >= 2:
                intervals = [abs(data["timestamps"][i] - data["timestamps"][i + 1])
                             for i in range(len(data["timestamps"]) - 1)]
                timing_var = max(intervals) - min(intervals) if intervals else 0
            else:
                timing_var = 0

            validator_list.append({
                "address": miner,
                "label": label,
                "blocksProduced": blocks_produced,
                "avgGasUtil": round(avg_gas, 2),
                "avgTps": round(avg_tps, 2),
                "timing": timing_var,
            })

            # MEV detection: blocks with gas util significantly above median
            for gu in data["gasUtils"]:
                if gu > median_util * 1.5 and gu > 80:
                    mev_alerts.append({
                        "validator": label,
                        "gasUtil": round(gu, 2),
                        "medianUtil": round(median_util, 2),
                    })

        validator_list.sort(key=lambda x: x["blocksProduced"], reverse=True)

        overall_tps = total_txs / (len(timestamps) * avg_block_time) if timestamps else 0
        overall_gas_util = (total_gas_used / total_gas_limit * 100) if total_gas_limit > 0 else 0

        return {
            "validators": validator_list,
            "rotationPattern": rotation,
            "mevAlerts": mev_alerts[:10],
            "networkStats": {
                "blocksAnalyzed": 63,
                "uniqueValidators": len(validators),
                "avgBlockTime": round(avg_block_time, 3),
                "avgTps": round(overall_tps, 2),
                "avgGasUtilization": round(overall_gas_util, 2),
                "latestBlock": latest,
            },
        }
    except Exception as e:
        return {"error": str(e)}


# ── 5. DEX Arb ──────────────────────────────────────────────────────

@router.get("/mefai/dex-arb")
async def mefai_dex_arb(
    address: str = Query(None, min_length=42, max_length=42),
):
    """Find cross-DEX price discrepancies for BSC tokens."""
    import asyncio

    try:
        # Determine tokens to scan
        if address:
            tokens_to_check = {address.lower(): "CUSTOM"}
        else:
            tokens_to_check = {k.lower(): v for k, v in _TOP_BSC_PORTFOLIO.items()}

        # Fetch DexScreener data for all tokens
        dex_tasks = [
            fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addr}", ttl=30)
            for addr in tokens_to_check
        ]
        dex_results = await asyncio.gather(*dex_tasks, return_exceptions=True)

        # Estimate gas cost in USD
        gas_price_resp = await _rpc_call("eth_gasPrice", [], ttl=15)
        gas_gwei = _safe_int(gas_price_resp.get("result")) / 1e9
        # Typical swap ~150k gas, arb needs 2 swaps = 300k gas
        gas_cost_bnb = (gas_gwei * 300000) / 1e9
        # Get BNB price
        bnb_resp = await fetch_json(
            f"{DEXSCREENER}/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            ttl=60)
        bnb_price = 0
        for p in (bnb_resp.get("pairs") or []):
            if p.get("chainId") == "bsc" and p.get("priceUsd"):
                bnb_price = float(p["priceUsd"])
                break
        gas_cost_usd = gas_cost_bnb * bnb_price

        opportunities = []
        for (addr, symbol), dex_data in zip(tokens_to_check.items(), dex_results):
            if isinstance(dex_data, Exception) or not dex_data:
                continue
            pairs = [p for p in (dex_data.get("pairs") or []) if p.get("chainId") == "bsc" and p.get("priceUsd")]
            if len(pairs) < 2:
                continue

            # Resolve symbol
            if symbol == "CUSTOM":
                symbol = pairs[0].get("baseToken", {}).get("symbol", "UNKNOWN")

            # Group by DEX
            by_dex = {}
            for p in pairs:
                dex_id = p.get("dexId", "unknown")
                price = float(p["priceUsd"])
                liq = p.get("liquidity", {}).get("usd", 0) or 0
                if liq < 1000:
                    continue  # skip illiquid pairs
                if dex_id not in by_dex or price < by_dex[dex_id]["price"]:
                    by_dex[dex_id] = {"price": price, "pair": p.get("pairAddress"), "liquidity": liq}

            if len(by_dex) < 2:
                continue

            # Find cheapest and most expensive
            sorted_dexes = sorted(by_dex.items(), key=lambda x: x[1]["price"])
            cheapest_dex, cheapest_info = sorted_dexes[0]
            expensive_dex, expensive_info = sorted_dexes[-1]

            spread_pct = ((expensive_info["price"] - cheapest_info["price"]) / cheapest_info["price"]) * 100
            # Estimate profit on $1000 trade
            profit_on_1k = 1000 * (spread_pct / 100) - gas_cost_usd

            if spread_pct > 0.1:  # minimum 0.1% spread
                opportunities.append({
                    "token": addr,
                    "symbol": symbol,
                    "cheapestDex": cheapest_dex,
                    "cheapestPrice": cheapest_info["price"],
                    "expensiveDex": expensive_dex,
                    "expensivePrice": expensive_info["price"],
                    "spreadPct": round(spread_pct, 4),
                    "estimatedProfitUsd": round(profit_on_1k, 2),
                    "gasEstimate": round(gas_cost_usd, 4),
                })

        opportunities.sort(key=lambda x: x["spreadPct"], reverse=True)

        return {
            "opportunities": opportunities[:20],
            "tokensScanned": len(tokens_to_check),
            "gasPrice": round(gas_gwei, 2),
            "gasCostUsd": round(gas_cost_usd, 4),
            "bnbPrice": bnb_price,
        }
    except Exception as e:
        return {"error": str(e)}


# ── 6. Token Birth ──────────────────────────────────────────────────

@router.get("/mefai/token-birth")
async def mefai_token_birth(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Token genesis analysis: creator profile, supply distribution, market data."""
    import asyncio
    import time

    addr = address.lower()
    dead_padded = "000000000000000000000000000000000000000000000000000000000000dead"
    zero_padded = "0" * 64

    try:
        # Parallel: name, symbol, decimals, totalSupply, owner, balanceOf(dead), balanceOf(zero), DexScreener
        tasks = [
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_NAME}, "latest"], ttl=300),           # 0
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_SYMBOL}, "latest"], ttl=300),          # 1
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_DECIMALS}, "latest"], ttl=300),        # 2
            _rpc_call("eth_call", [{"to": addr, "data": _ERC20_TOTAL_SUPPLY}, "latest"], ttl=60),     # 3
            _rpc_call("eth_call", [{"to": addr, "data": "0x8da5cb5b"}, "latest"], ttl=60),            # 4 owner
            _rpc_call("eth_call", [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{dead_padded}"}, "latest"], ttl=60),  # 5
            _rpc_call("eth_call", [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{zero_padded}"}, "latest"], ttl=60),  # 6
            fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addr}", ttl=30),                             # 7
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        name = _dec_str_util(results[0].get("result") if not isinstance(results[0], Exception) else None)
        symbol = _dec_str_util(results[1].get("result") if not isinstance(results[1], Exception) else None)
        decimals = 18
        if not isinstance(results[2], Exception):
            d = _safe_int(results[2].get("result"))
            if 0 < d <= 18:
                decimals = d
        total_supply_raw = _safe_int(results[3].get("result") if not isinstance(results[3], Exception) else "0x0")
        total_supply = total_supply_raw / (10 ** decimals) if total_supply_raw else 0

        # Owner
        owner = ""
        if not isinstance(results[4], Exception):
            owner_raw = results[4].get("result", "0x")
            if owner_raw and len(owner_raw) >= 42:
                owner = "0x" + owner_raw[-40:]
                if owner == "0x" + "0" * 40:
                    owner = ""

        dead_bal = _safe_int(results[5].get("result") if not isinstance(results[5], Exception) else "0x0")
        zero_bal = _safe_int(results[6].get("result") if not isinstance(results[6], Exception) else "0x0")
        burned = (dead_bal + zero_bal) / (10 ** decimals) if (dead_bal + zero_bal) else 0

        # DexScreener
        dex_data = results[7] if not isinstance(results[7], Exception) else {}
        pairs = [p for p in (dex_data.get("pairs") or []) if p.get("chainId") == "bsc"]
        top_pair = pairs[0] if pairs else {}

        created_at = top_pair.get("pairCreatedAt")
        age_hours = 0
        if created_at:
            age_hours = (time.time() * 1000 - created_at) / 3600000

        price = float(top_pair.get("priceUsd", 0)) if top_pair.get("priceUsd") else None
        volume24h = top_pair.get("volume", {}).get("h24")
        liquidity = top_pair.get("liquidity", {}).get("usd")
        change24h = top_pair.get("priceChange", {}).get("h24")

        # Owner profile
        owner_profile = None
        owner_hold_pct = 0
        if owner:
            owner_padded = owner.replace("0x", "").zfill(64)
            owner_tasks = [
                _rpc_call("eth_getBalance", [owner, "latest"], ttl=15),
                _rpc_call("eth_getTransactionCount", [owner, "latest"], ttl=15),
                _rpc_call("eth_call", [{"to": addr, "data": f"{_ERC20_BALANCE_OF}{owner_padded}"}, "latest"], ttl=30),
            ]
            oresults = await asyncio.gather(*owner_tasks, return_exceptions=True)
            owner_bnb = _safe_int(oresults[0].get("result") if not isinstance(oresults[0], Exception) else "0x0") / 1e18
            owner_txs = _safe_int(oresults[1].get("result") if not isinstance(oresults[1], Exception) else "0x0")
            owner_token_bal = _safe_int(oresults[2].get("result") if not isinstance(oresults[2], Exception) else "0x0") / (10 ** decimals)
            owner_hold_pct = (owner_token_bal / total_supply * 100) if total_supply > 0 else 0

            owner_profile = {
                "address": owner,
                "label": _KNOWN_WALLETS.get(owner, ""),
                "bnbBalance": round(owner_bnb, 6),
                "txCount": owner_txs,
                "tokenHoldPct": round(owner_hold_pct, 2),
            }

        burned_pct = (burned / total_supply * 100) if total_supply > 0 else 0
        circulating = total_supply - burned - (total_supply * owner_hold_pct / 100 if total_supply > 0 else 0)

        return {
            "address": addr,
            "name": name,
            "symbol": symbol,
            "decimals": decimals,
            "creatorProfile": owner_profile,
            "supplyBreakdown": {
                "total": total_supply,
                "burned": burned,
                "burnedPct": round(burned_pct, 2),
                "owner": round(total_supply * owner_hold_pct / 100, 2) if total_supply else 0,
                "ownerPct": round(owner_hold_pct, 2),
                "circulating": max(0, circulating),
            },
            "marketData": {
                "price": price,
                "volume24h": volume24h,
                "liquidity": liquidity,
                "change24h": change24h,
            },
            "pairCount": len(pairs),
            "ageHours": round(age_hours, 1),
            "ageDays": round(age_hours / 24, 1) if age_hours else 0,
        }
    except Exception as e:
        return {"error": str(e), "address": addr}


# ── 7. Network Pulse ────────────────────────────────────────────────

@router.get("/mefai/network-pulse")
async def mefai_network_pulse():
    """Network congestion gauge: gas utilization, block timing, TPS trend."""
    import asyncio

    try:
        bn = await _rpc_call("eth_blockNumber", [], ttl=5)
        latest = _safe_int(bn.get("result"))
        if latest == 0:
            return {"error": "Cannot fetch block number"}

        # Fetch 20 blocks + gas price
        tasks = [
            _rpc_call("eth_gasPrice", [], ttl=10),
        ]
        for i in range(20):
            tasks.append(_rpc_call("eth_getBlockByNumber", [hex(latest - i), False], ttl=10))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        gas_price_wei = _safe_int(results[0].get("result") if not isinstance(results[0], Exception) else "0x0")
        gas_price_gwei = gas_price_wei / 1e9

        block_stats = []
        timestamps = []
        gas_utils = []
        tx_counts = []

        for i in range(1, 21):
            r = results[i]
            if isinstance(r, Exception) or not r.get("result"):
                continue
            block = r["result"]
            gas_used = _safe_int(block.get("gasUsed"))
            gas_limit = _safe_int(block.get("gasLimit"))
            ts = _safe_int(block.get("timestamp"))
            tx_count = len(block.get("transactions") or [])
            block_num = _safe_int(block.get("number"))
            gas_util = (gas_used / gas_limit * 100) if gas_limit > 0 else 0

            timestamps.append(ts)
            gas_utils.append(gas_util)
            tx_counts.append(tx_count)

            block_stats.append({
                "blockNum": block_num,
                "gasUtil": round(gas_util, 2),
                "txCount": tx_count,
            })

        # Calculate block times
        block_times = []
        for i in range(len(timestamps) - 1):
            dt = abs(timestamps[i] - timestamps[i + 1])
            if 0 < dt < 30:
                block_times.append(dt)
                block_stats[i]["blockTime"] = dt

        avg_block_time = sum(block_times) / len(block_times) if block_times else 3.0
        block_time_var = 0
        if block_times:
            mean_bt = avg_block_time
            block_time_var = sum((bt - mean_bt) ** 2 for bt in block_times) / len(block_times)

        avg_gas_util = sum(gas_utils) / len(gas_utils) if gas_utils else 0
        avg_tps = sum(tx_counts) / (len(tx_counts) * avg_block_time) if tx_counts else 0

        # Pressure score 0-100
        pressure = 0
        pressure += min(40, avg_gas_util * 0.4)  # gas util contributes up to 40
        pressure += min(20, gas_price_gwei * 2)   # gas price
        pressure += min(20, block_time_var * 10)   # block time variance
        pressure += min(20, avg_tps / 50 * 20)     # TPS load
        pressure = max(0, min(100, int(pressure)))

        if pressure >= 70:
            recommendation = "CONGESTED"
        elif pressure >= 40:
            recommendation = "BUSY"
        else:
            recommendation = "OPTIMAL"

        return {
            "pressureScore": pressure,
            "recommendation": recommendation,
            "gasUtilization": round(avg_gas_util, 2),
            "avgBlockTime": round(avg_block_time, 3),
            "currentTps": round(avg_tps, 2),
            "gasPriceGwei": round(gas_price_gwei, 2),
            "blockTimeVariance": round(block_time_var, 4),
            "blockStats": block_stats,
            "latestBlock": latest,
        }
    except Exception as e:
        return {"error": str(e)}


# ── 8. Copy Trade ───────────────────────────────────────────────────

@router.get("/mefai/copy-trade")
async def mefai_copy_trade():
    """Monitor alpha wallets for recent trading activity."""
    import asyncio

    try:
        # Use first 10 known wallets as alpha wallets
        alpha_wallets = dict(list(_KNOWN_WALLETS.items())[:10])

        bn = await _rpc_call("eth_blockNumber", [], ttl=5)
        latest = _safe_int(bn.get("result"))
        if latest == 0:
            return {"error": "Cannot fetch block number"}

        # Scan last 15 blocks with full TXs
        block_tasks = [
            _rpc_call("eth_getBlockByNumber", [hex(latest - i), True], ttl=10)
            for i in range(15)
        ]
        block_results = await asyncio.gather(*block_tasks, return_exceptions=True)

        # Find transactions from/to alpha wallets
        matching_txs = []
        for br in block_results:
            if isinstance(br, Exception) or not br.get("result"):
                continue
            block = br["result"]
            block_ts = _safe_int(block.get("timestamp"))
            for tx in (block.get("transactions") or []):
                from_addr = (tx.get("from") or "").lower()
                to_addr = (tx.get("to") or "").lower()
                if from_addr in alpha_wallets or to_addr in alpha_wallets:
                    wallet = from_addr if from_addr in alpha_wallets else to_addr
                    matching_txs.append({
                        "hash": tx["hash"],
                        "wallet": wallet,
                        "walletLabel": alpha_wallets[wallet],
                        "from": from_addr,
                        "to": to_addr,
                        "value": _safe_int(tx.get("value")),
                        "timestamp": block_ts,
                        "input": tx.get("input", "0x")[:10],
                    })

        # Fetch receipts for matching TXs to find Transfer events
        receipt_tasks = [
            _rpc_call("eth_getTransactionReceipt", [tx["hash"]], ttl=30)
            for tx in matching_txs[:20]
        ]
        receipts = await asyncio.gather(*receipt_tasks, return_exceptions=True)

        # Collect token addresses involved
        token_addrs = set()
        signals = []
        import time as _time
        now = int(_time.time())

        for i, rcpt in enumerate(receipts):
            if isinstance(rcpt, Exception) or not rcpt.get("result"):
                continue
            tx = matching_txs[i]
            logs = rcpt["result"].get("logs") or []

            for log in logs:
                topics = log.get("topics") or []
                if len(topics) >= 3 and topics[0] == _TRANSFER_TOPIC:
                    token_addr = (log.get("address") or "").lower()
                    from_t = "0x" + topics[1][-40:]
                    to_t = "0x" + topics[2][-40:]
                    amount_raw = _safe_int(log.get("data"))
                    token_addrs.add(token_addr)

                    # Determine action
                    if from_t.lower() == tx["wallet"]:
                        action = "sell"
                    elif to_t.lower() == tx["wallet"]:
                        action = "buy"
                    else:
                        action = "transfer"

                    signals.append({
                        "wallet": tx["wallet"],
                        "walletLabel": tx["walletLabel"],
                        "action": action,
                        "token": token_addr,
                        "amount": amount_raw,
                        "timeAgo": now - tx["timestamp"],
                        "txHash": tx["hash"],
                    })

        # Enrich with DexScreener data (batch up to 30 tokens)
        token_list = list(token_addrs)[:30]
        if token_list:
            batch_url = f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(token_list[:30])
            try:
                token_data = await fetch_json(batch_url, ttl=30)
                pair_map = {}
                for p in (token_data.get("pairs") or []):
                    if p.get("chainId") == "bsc":
                        base = p.get("baseToken", {}).get("address", "").lower()
                        if base not in pair_map:
                            pair_map[base] = p
            except Exception:
                pair_map = {}
        else:
            pair_map = {}

        for sig in signals:
            pair = pair_map.get(sig["token"], {})
            sig["tokenSymbol"] = pair.get("baseToken", {}).get("symbol", "UNKNOWN")
            sig["tokenPrice"] = float(pair["priceUsd"]) if pair.get("priceUsd") else None
            sig["tokenChange24h"] = pair.get("priceChange", {}).get("h24")

        active_wallets = len(set(s["wallet"] for s in signals))

        return {
            "signals": signals[:30],
            "activeWallets": active_wallets,
            "totalSignals": len(signals),
            "blocksScanned": 15,
            "alphaWalletsMonitored": len(alpha_wallets),
        }
    except Exception as e:
        return {"error": str(e)}


# ── 9. Upgrade Monitor ─────────────────────────────────────────────

@router.get("/mefai/upgrade-monitor")
async def mefai_upgrade_monitor(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Proxy contract detection and upgrade risk assessment."""
    import asyncio

    addr = address.lower()
    # EIP-1967 slots
    impl_slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
    admin_slot = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"

    try:
        tasks = [
            _rpc_call("eth_getCode", [addr, "latest"], ttl=300),                          # 0
            _rpc_call("eth_getStorageAt", [addr, impl_slot, "latest"], ttl=30),            # 1
            _rpc_call("eth_getStorageAt", [addr, admin_slot, "latest"], ttl=30),           # 2
            _rpc_call("eth_call", [{"to": addr, "data": "0x8da5cb5b"}, "latest"], ttl=60),# 3 owner
            fetch_json(f"{DEXSCREENER}/latest/dex/tokens/{addr}", ttl=30),                 # 4
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Check code
        code_hex = results[0].get("result", "0x") if not isinstance(results[0], Exception) else "0x"
        has_code = code_hex not in ("0x", "0x0", None, "")
        code_size = (len(code_hex) - 2) // 2 if has_code else 0

        if not has_code:
            return {"error": "Not a contract", "address": addr, "isProxy": False, "codeSize": 0}

        # Implementation address
        impl_raw = results[1].get("result", "0x" + "0" * 64) if not isinstance(results[1], Exception) else "0x" + "0" * 64
        impl_addr = "0x" + impl_raw[-40:] if impl_raw and len(impl_raw) >= 42 else ""
        is_proxy = impl_addr != "" and impl_addr != "0x" + "0" * 40

        # Admin address
        admin_raw = results[2].get("result", "0x" + "0" * 64) if not isinstance(results[2], Exception) else "0x" + "0" * 64
        admin_addr = "0x" + admin_raw[-40:] if admin_raw and len(admin_raw) >= 42 else ""
        if admin_addr == "0x" + "0" * 40:
            admin_addr = ""

        # Owner
        owner = ""
        if not isinstance(results[3], Exception):
            owner_raw = results[3].get("result", "0x")
            if owner_raw and len(owner_raw) >= 42:
                owner = "0x" + owner_raw[-40:]
                if owner == "0x" + "0" * 40:
                    owner = ""

        # If proxy, get implementation code size
        impl_code_size = 0
        if is_proxy:
            impl_code = await _rpc_call("eth_getCode", [impl_addr, "latest"], ttl=300)
            impl_hex = impl_code.get("result", "0x")
            if impl_hex and impl_hex not in ("0x", "0x0"):
                impl_code_size = (len(impl_hex) - 2) // 2

        # Market context
        dex_data = results[4] if not isinstance(results[4], Exception) else {}
        pairs = [p for p in (dex_data.get("pairs") or []) if p.get("chainId") == "bsc"]
        top_pair = pairs[0] if pairs else {}

        market_context = None
        if top_pair:
            market_context = {
                "symbol": top_pair.get("baseToken", {}).get("symbol"),
                "price": float(top_pair["priceUsd"]) if top_pair.get("priceUsd") else None,
                "liquidity": top_pair.get("liquidity", {}).get("usd"),
                "volume24h": top_pair.get("volume", {}).get("h24"),
            }

        # Upgrade risk assessment
        risk = "LOW"
        if is_proxy:
            if admin_addr and admin_addr != "0x" + "0" * 40:
                risk = "HIGH"  # has admin that can upgrade
            else:
                risk = "MEDIUM"  # proxy but no admin slot (might use different pattern)
            # If market context with significant liquidity, upgrade is critical
            if market_context and (market_context.get("liquidity") or 0) > 100000:
                risk = "CRITICAL"
        elif owner:
            risk = "MEDIUM"  # has owner but not proxy

        return {
            "address": addr,
            "isProxy": is_proxy,
            "implementationAddress": impl_addr if is_proxy else None,
            "adminAddress": admin_addr if admin_addr else None,
            "adminLabel": _KNOWN_WALLETS.get(admin_addr.lower(), "") if admin_addr else None,
            "ownerAddress": owner or None,
            "ownerLabel": _KNOWN_WALLETS.get(owner.lower(), "") if owner else None,
            "codeSize": code_size,
            "implCodeSize": impl_code_size if is_proxy else None,
            "upgradeRisk": risk,
            "marketContext": market_context,
        }
    except Exception as e:
        return {"error": str(e), "address": addr}


# ── 10. Portfolio Heatmap ───────────────────────────────────────────

@router.get("/mefai/portfolio-heatmap")
async def mefai_portfolio_heatmap(
    address: str = Query(..., min_length=42, max_length=42),
):
    """Portfolio heatmap with performance: balances, USD values, 24h changes."""
    import asyncio

    addr = address.lower()
    addr_padded = addr.replace("0x", "").zfill(64)

    # Merge token lists: _TOP_BSC_PORTFOLIO + _EXTENDED_TOKENS (15 total)
    all_tokens = {**_TOP_BSC_PORTFOLIO, **_EXTENDED_TOKENS}

    try:
        # BNB balance + all token balances in parallel
        tasks = [_rpc_call("eth_getBalance", [addr, "latest"], ttl=15)]
        token_list = list(all_tokens.items())
        for contract, _ in token_list:
            tasks.append(
                _rpc_call("eth_call",
                          [{"to": contract.lower(), "data": f"{_ERC20_BALANCE_OF}{addr_padded}"}, "latest"],
                          ttl=30)
            )

        # Also get BNB price
        tasks.append(fetch_json(
            f"{DEXSCREENER}/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            ttl=60))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Parse BNB balance
        bnb_raw = _safe_int(results[0].get("result") if not isinstance(results[0], Exception) else "0x0")
        bnb_balance = bnb_raw / 1e18

        # BNB price
        bnb_price = 0
        bnb_change = 0
        bnb_dex = results[-1]
        if not isinstance(bnb_dex, Exception):
            for p in (bnb_dex.get("pairs") or []):
                if p.get("chainId") == "bsc" and p.get("priceUsd"):
                    bnb_price = float(p["priceUsd"])
                    bnb_change = p.get("priceChange", {}).get("h24", 0) or 0
                    break

        # Parse token balances
        held_tokens = []
        token_addrs = []
        for idx, (contract, symbol) in enumerate(token_list):
            r = results[1 + idx]
            if isinstance(r, Exception):
                continue
            bal = _safe_int(r.get("result"))
            if bal > 0:
                held_tokens.append({"contract": contract.lower(), "symbol": symbol, "rawBalance": bal})
                token_addrs.append(contract.lower())

        # Fetch DexScreener data for held tokens
        price_map = {}
        if token_addrs:
            batch_url = f"{DEXSCREENER}/latest/dex/tokens/" + ",".join(token_addrs[:30])
            try:
                dex_data = await fetch_json(batch_url, ttl=30)
                for p in (dex_data.get("pairs") or []):
                    if p.get("chainId") == "bsc":
                        base = p.get("baseToken", {}).get("address", "").lower()
                        if base not in price_map:
                            price_map[base] = {
                                "price": float(p["priceUsd"]) if p.get("priceUsd") else 0,
                                "change24h": p.get("priceChange", {}).get("h24", 0) or 0,
                                "logo": p.get("info", {}).get("imageUrl", ""),
                            }
            except Exception:
                pass

        # Build holdings list
        holdings = []
        # BNB first
        bnb_value = bnb_balance * bnb_price
        holdings.append({
            "symbol": "BNB",
            "balance": round(bnb_balance, 6),
            "valueUsd": round(bnb_value, 2),
            "change24h": bnb_change,
            "pctOfPortfolio": 0,  # will calculate after total
            "logo": "",
        })

        total_value = bnb_value
        for tok in held_tokens:
            pinfo = price_map.get(tok["contract"], {})
            price = pinfo.get("price", 0)
            # Assume 18 decimals for simplicity (most BSC tokens)
            balance = tok["rawBalance"] / 1e18
            value = balance * price
            total_value += value
            holdings.append({
                "symbol": tok["symbol"],
                "balance": round(balance, 6),
                "valueUsd": round(value, 2),
                "change24h": pinfo.get("change24h", 0),
                "pctOfPortfolio": 0,
                "logo": pinfo.get("logo", ""),
            })

        # Calculate percentages and sort
        for h in holdings:
            h["pctOfPortfolio"] = round((h["valueUsd"] / total_value * 100) if total_value > 0 else 0, 2)
        holdings.sort(key=lambda x: x["valueUsd"], reverse=True)

        # 24h weighted P&L
        weighted_change = 0
        for h in holdings:
            weight = h["pctOfPortfolio"] / 100
            weighted_change += (h.get("change24h") or 0) * weight

        # Concentration risk
        top_pct = holdings[0]["pctOfPortfolio"] if holdings else 0
        if top_pct > 80:
            concentration_risk = "HIGH"
        elif top_pct > 50:
            concentration_risk = "MEDIUM"
        else:
            concentration_risk = "LOW"

        # Health score: penalize high concentration + negative change
        health = 70
        health -= max(0, top_pct - 50)  # penalize over-concentration
        health += min(15, max(-15, weighted_change))  # boost/penalize by performance
        health += min(15, len([h for h in holdings if h["valueUsd"] > 1]) * 3)  # diversity bonus
        health = max(0, min(100, int(health)))

        return {
            "address": addr,
            "totalValueUsd": round(total_value, 2),
            "change24hPct": round(weighted_change, 2),
            "holdings": [h for h in holdings if h["valueUsd"] > 0.01],
            "healthScore": health,
            "concentrationRisk": concentration_risk,
            "topHolding": holdings[0]["symbol"] if holdings else None,
            "tokenCount": len([h for h in holdings if h["valueUsd"] > 0.01]),
        }
    except Exception as e:
        return {"error": str(e), "address": addr}
