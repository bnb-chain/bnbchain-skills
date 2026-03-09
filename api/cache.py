"""
BNB Chain Skills — In-memory cache with stale-while-revalidate.

Strategy:
- Fresh TTL (configurable per call): serve from cache instantly
- Stale TTL (300s): serve stale data instantly, refresh in background
- Beyond stale: fetch new data (blocking)
"""

import asyncio
import time
import hashlib
import json
import logging
from collections import OrderedDict
from typing import Any

import httpx

logger = logging.getLogger("bnbchain.cache")

_cache: OrderedDict[str, tuple[float, Any]] = OrderedDict()
_refreshing: set[str] = set()
_client: httpx.AsyncClient | None = None

FRESH_TTL = 60
STALE_TTL = 300
MAX_CACHE_ENTRIES = 5000


def _key(url: str, params: dict | None = None, body: dict | None = None) -> str:
    raw = (
        url
        + json.dumps(params or {}, sort_keys=True)
        + json.dumps(body or {}, sort_keys=True)
    )
    return hashlib.md5(raw.encode()).hexdigest()


def get_cached(
    url: str, params: dict | None = None, body: dict | None = None, ttl: int = FRESH_TTL
) -> tuple[Any | None, bool]:
    """Returns (data, is_fresh). data=None if nothing cached."""
    if ttl <= 0:
        return None, False
    k = _key(url, params, body)
    if k in _cache:
        ts, data = _cache[k]
        age = time.time() - ts
        if age < ttl:
            _cache.move_to_end(k)
            return data, True
        if age < STALE_TTL:
            return data, False
        del _cache[k]
    return None, False


def set_cached(
    url: str, data: Any, params: dict | None = None, body: dict | None = None
) -> None:
    k = _key(url, params, body)
    _cache[k] = (time.time(), data)
    _cache.move_to_end(k)
    while len(_cache) > MAX_CACHE_ENTRIES:
        _cache.popitem(last=False)


async def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        pool_limits = httpx.Limits(max_connections=200, max_keepalive_connections=60)
        _client = httpx.AsyncClient(
            timeout=httpx.Timeout(15.0, connect=5.0),
            follow_redirects=True,
            limits=pool_limits,
            http2=True,
        )
    return _client


_RETRYABLE_STATUSES = {429, 503}


async def _do_fetch(url: str, params: dict | None, headers: dict) -> Any:
    client = await get_client()
    resp = None
    for attempt in range(3):
        try:
            resp = await client.get(url, params=params, headers=headers)
        except (httpx.ConnectTimeout, httpx.ReadTimeout, httpx.ConnectError) as e:
            if attempt < 2:
                await asyncio.sleep(0.5 * (attempt + 1))
                continue
            return {"error": True, "status": 0, "detail": str(e), "_no_cache": True}
        if resp.status_code in _RETRYABLE_STATUSES:
            if attempt < 2:
                delay = float(resp.headers.get("Retry-After", 1 + attempt))
                await asyncio.sleep(delay)
                continue
        break
    if resp is None:
        return {"error": True, "status": 0, "detail": "No response"}
    if resp.status_code >= 400:
        try:
            err = resp.json()
        except Exception:
            err = {"error": resp.text, "status": resp.status_code}
        result = {"error": True, "status": resp.status_code, "detail": err}
        if resp.status_code in _RETRYABLE_STATUSES:
            result["_no_cache"] = True
        return result
    return resp.json()


async def _do_post(
    url: str, body: dict | None, params: dict | None, headers: dict
) -> Any:
    client = await get_client()
    resp = None
    for attempt in range(3):
        try:
            resp = await client.post(url, json=body, params=params, headers=headers)
        except (httpx.ConnectTimeout, httpx.ReadTimeout, httpx.ConnectError) as e:
            if attempt < 2:
                await asyncio.sleep(0.5 * (attempt + 1))
                continue
            return {"error": True, "status": 0, "detail": str(e), "_no_cache": True}
        if resp.status_code in _RETRYABLE_STATUSES:
            if attempt < 2:
                delay = float(resp.headers.get("Retry-After", 1 + attempt))
                await asyncio.sleep(delay)
                continue
        break
    if resp is None:
        return {"error": True, "status": 0, "detail": "No response"}
    if resp.status_code >= 400:
        try:
            err = resp.json()
        except Exception:
            err = {"error": resp.text, "status": resp.status_code}
        result = {"error": True, "status": resp.status_code, "detail": err}
        if resp.status_code in _RETRYABLE_STATUSES:
            result["_no_cache"] = True
        return result
    return resp.json()


def _bg_refresh_get(url: str, params: dict | None, headers: dict):
    k = _key(url, params)
    if k in _refreshing:
        return
    _refreshing.add(k)

    async def _refresh():
        try:
            data = await _do_fetch(url, params, headers)
            if not (isinstance(data, dict) and data.get("error")):
                set_cached(url, data, params=params)
        except Exception as e:
            logger.debug(f"Background refresh failed for {url}: {e}")
        finally:
            _refreshing.discard(k)

    asyncio.get_event_loop().create_task(_refresh())


def _bg_refresh_post(url: str, body: dict | None, params: dict | None, headers: dict):
    k = _key(url, params, body)
    if k in _refreshing:
        return
    _refreshing.add(k)

    async def _refresh():
        try:
            data = await _do_post(url, body, params, headers)
            if not (isinstance(data, dict) and data.get("error")):
                set_cached(url, data, params=params, body=body)
        except Exception as e:
            logger.debug(f"Background refresh failed for {url}: {e}")
        finally:
            _refreshing.discard(k)

    asyncio.get_event_loop().create_task(_refresh())


async def fetch_json(
    url: str, params: dict | None = None, ttl: int = FRESH_TTL, headers: dict | None = None
) -> Any:
    """GET with stale-while-revalidate cache."""
    cached, is_fresh = get_cached(url, params=params, ttl=ttl)
    h = {}
    if headers:
        h.update(headers)

    if cached is not None:
        if is_fresh:
            return cached
        _bg_refresh_get(url, params, h)
        return cached

    data = await _do_fetch(url, params, h)
    if isinstance(data, dict) and data.get("_no_cache"):
        return data
    if not (isinstance(data, dict) and data.get("error")):
        set_cached(url, data, params=params)
    return data


async def post_json(
    url: str, body: dict | None = None, params: dict | None = None, ttl: int = FRESH_TTL
) -> Any:
    """POST with stale-while-revalidate cache."""
    cached, is_fresh = get_cached(url, params=params, body=body, ttl=ttl)
    h: dict[str, str] = {}

    if cached is not None:
        if is_fresh:
            return cached
        _bg_refresh_post(url, body, params, h)
        return cached

    data = await _do_post(url, body, params, h)
    if isinstance(data, dict) and data.get("_no_cache"):
        return data
    if not (isinstance(data, dict) and data.get("error")):
        set_cached(url, data, params=params, body=body)
    return data
