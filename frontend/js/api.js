// BNB Chain Skills — API layer with persistent cache + stale-while-revalidate

const API_BASE = '/superbsc/api/bnbchain';
const CACHE_KEY = 'bnbchain-cache';
const CACHE_MAX_AGE = 300000; // 5 min

const _c = new Map();

// Restore from localStorage
try {
  const stored = localStorage.getItem(CACHE_KEY);
  if (stored) {
    const entries = JSON.parse(stored);
    const now = Date.now();
    for (const [k, v] of entries) {
      if (now - v.t < CACHE_MAX_AGE) _c.set(k, v);
    }
  }
} catch {}

let _saveTimer = null;
function _persist() {
  if (_saveTimer) return;
  _saveTimer = setTimeout(() => {
    _saveTimer = null;
    try {
      const entries = [];
      const now = Date.now();
      for (const [k, v] of _c) {
        if (now - v.t < CACHE_MAX_AGE) entries.push([k, v]);
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(entries.slice(-100)));
    } catch {}
  }, 1000);
}

function _cg(k, ttl, stale) {
  const e = _c.get(k);
  if (!e) return null;
  if (Date.now() - e.t < ttl) return e.d;
  return stale ? e.d : null;
}

function _cs(k, d) {
  _c.set(k, { d, t: Date.now() });
  if (_c.size > 200) {
    const now = Date.now();
    for (const [ek, ev] of _c) { if (now - ev.t > 60000) { _c.delete(ek); if (_c.size <= 150) break; } }
  }
  _persist();
}

const _inflight = new Map();

function _url(path, params = {}) {
  const u = new URL(API_BASE + path, window.location.origin);
  for (const [k, v] of Object.entries(params))
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v);
  return u.href;
}

async function _fetchGet(url) {
  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ac.signal });
    clearTimeout(tid);
    let d;
    try { d = await r.json(); } catch { return { error: true, status: r.status }; }
    if (r.ok && !d?.error) _cs(url, d);
    return d;
  } catch (e) {
    clearTimeout(tid);
    if (e.name === 'AbortError') return { error: true, status: 408, detail: 'timeout' };
    throw e;
  } finally {
    _inflight.delete(url);
  }
}

async function get(path, params = {}, ttl = 30000) {
  const url = _url(path, params);
  const fresh = _cg(url, ttl, false);
  if (fresh) return fresh;
  const stale = _cg(url, CACHE_MAX_AGE, true);
  if (stale) {
    if (!_inflight.has(url)) {
      const p = _fetchGet(url);
      _inflight.set(url, p);
      p.catch(() => {});
    }
    return stale;
  }
  if (_inflight.has(url)) return _inflight.get(url);
  const p = _fetchGet(url);
  _inflight.set(url, p);
  return p;
}

// Public API
window.bnbApi = {
  blockNumber: () => get('/block-number', {}, 5000),
  block: (n) => get('/block', { number: n || 'latest' }, 15000),
  blockFull: (n) => get('/block', { number: n || 'latest', full: true }, 15000),
  tx: (hash) => get('/tx', { hash }, 60000),
  receipt: (hash) => get('/receipt', { hash }, 60000),
  balance: (addr) => get('/balance', { address: addr }, 15000),
  gasPrice: () => get('/gas-price', {}, 10000),
  chainId: () => get('/chain-id', {}, 3600000),
  peerCount: () => get('/peer-count', {}, 30000),
  syncing: () => get('/syncing', {}, 10000),
  supportedNetworks: () => get('/supported-networks', {}, 3600000),
  estimateGas: (to, data, value) => get('/estimate-gas', { to, data, value }, 10000),
  code: (addr) => get('/code', { address: addr }, 60000),
  tokenInfo: (contract) => get('/token-info', { contract }, 60000),
  tokenBalance: (contract, addr) => get('/token-balance', { contract, address: addr }, 15000),
  readContract: (contract, data) => get('/read-contract', { contract, data }, 15000),
  nftBalance: (owner, contract) => get('/nft-balance', { owner, contract }, 30000),
  nftTokens: (owner, contract, count) => get('/nft-tokens', { owner, contract, count: count || 10 }, 60000),
  greenfieldStatus: () => get('/greenfield/status', {}, 30000),
  greenfieldBuckets: (addr) => get('/greenfield/buckets', { address: addr }, 60000),
  erc8004Agent: (tokenId) => get('/erc8004/agent', { token_id: tokenId }, 60000),
  erc8004Balance: (addr) => get('/erc8004/balance', { address: addr }, 30000),
  addressProfile: (addr) => get('/address-profile', { address: addr }, 15000),
  marketTopTokens: () => get('/market/top-tokens', {}, 60000),
  marketSearch: (q) => get('/market/search', { q }, 30000),
  marketToken: (addr) => get('/market/token', { address: addr }, 30000),
  mefaiWalletScanner: (addr) => get('/mefai/wallet-scanner', { address: addr }, 30000),
  mefaiContractAudit: (addr) => get('/mefai/contract-audit', { address: addr }, 30000),
  mefaiLiquidityPulse: () => get('/mefai/liquidity-pulse', {}, 60000),
  mefaiBurnTracker: () => get('/mefai/burn-tracker', {}, 120000),
  mefaiPancakeswapArena: () => get('/mefai/pancakeswap-arena', {}, 30000),
  mefaiChainVitals: () => get('/mefai/chain-vitals', {}, 10000),
  mefaiTokenTrends: () => get('/mefai/token-trends', {}, 60000),
  mefaiDefiLeaderboard: () => get('/mefai/defi-leaderboard', {}, 60000),
  mefaiBscSupremacy: () => get('/mefai/bsc-supremacy', {}, 15000),
  mefaiSmartMoney: () => get('/mefai/smart-money', {}, 15000),
  mefaiTxDecoder: (hash) => get('/mefai/tx-decoder', { hash }, 120000),
  mefaiContractXray: (addr) => get('/mefai/contract-xray', { address: addr }, 300000),
  mefaiApprovalScanner: (addr) => get('/mefai/approval-scanner', { address: addr }, 30000),
  mefaiBlockAutopsy: (n) => get('/mefai/block-autopsy', n ? { number: n } : {}, 15000),
  mefaiGasCalculator: () => get('/mefai/gas-calculator', {}, 15000),
  mefaiTokenBattle: (tokens) => get('/mefai/token-battle', { tokens }, 60000),
  mefaiPairAnalytics: (addr) => get('/mefai/pair-analytics', { address: addr }, 30000),
  mefaiTokenFlow: (addr) => get('/mefai/token-flow', { contract: addr }, 15000),
  mefaiYieldFinder: () => get('/mefai/yield-finder', {}, 60000),
  mefaiRiskRadar: (addr) => get('/mefai/risk-radar', { address: addr }, 60000),
  mefaiSniperDetector: (addr) => get('/mefai/sniper-detector', { address: addr }, 30000),
  mefaiWalletCluster: (addr) => get('/mefai/wallet-cluster', { address: addr }, 30000),
  mefaiHoneypotCheck: (addr) => get('/mefai/honeypot-check', { address: addr }, 30000),
  mefaiValidatorMap: () => get('/mefai/validator-map', {}, 15000),
  mefaiDexArb: (addr) => get('/mefai/dex-arb', addr ? { address: addr } : {}, 30000),
  mefaiTokenBirth: (addr) => get('/mefai/token-birth', { address: addr }, 60000),
  mefaiNetworkPulse: () => get('/mefai/network-pulse', {}, 10000),
  mefaiCopyTrade: () => get('/mefai/copy-trade', {}, 15000),
  mefaiUpgradeMonitor: (addr) => get('/mefai/upgrade-monitor', { address: addr }, 30000),
  mefaiPortfolioHeatmap: (addr) => get('/mefai/portfolio-heatmap', { address: addr }, 30000),
};
