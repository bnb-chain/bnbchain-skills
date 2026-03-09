// BNB Chain Skills — Layout engine & panel registry

const panelRegistry = {
  'network-status':     'network-status-panel',
  'block-explorer':     'block-explorer-panel',
  'tx-explorer':        'tx-explorer-panel',
  'gas-estimator':      'gas-estimator-panel',
  'address-profiler':   'address-profiler-panel',
  'token-inspector':    'token-inspector-panel',
  'contract-reader':    'contract-reader-panel',
  'nft-explorer':       'nft-explorer-panel',
  'transfer-ops':       'transfer-ops-panel',
  'contract-writing':   'contract-writing-panel',
  'erc8004':            'erc8004-panel',
  'greenfield-overview':'greenfield-overview-panel',
  'greenfield-buckets': 'greenfield-buckets-panel',
  'greenfield-objects': 'greenfield-objects-panel',
  'greenfield-payments':'greenfield-payments-panel',
  'mcp-prompts':        'mcp-prompts-panel',
  'market-pack':        'market-pack-panel',
  'syncx':              'syncx-panel',
  'whale-radar':        'whale-radar-panel',
  'token-xray':         'token-xray-panel',
  'bsc-live-feed':      'bsc-live-feed-panel',
  'wallet-scanner':     'wallet-scanner-panel',
  'contract-audit':     'contract-audit-panel',
  'liquidity-pulse':    'liquidity-pulse-panel',
  'burn-tracker':       'burn-tracker-panel',
  'pancakeswap-arena':  'pancakeswap-arena-panel',
  'chain-vitals':       'chain-vitals-panel',
  'token-trends':       'token-trends-panel',
  'defi-leaderboard':   'defi-leaderboard-panel',
  'bsc-supremacy':      'bsc-supremacy-panel',
  'smart-money':        'smart-money-panel',
  'mefai-hub':          'mefai-hub-panel',
  'tx-decoder':         'tx-decoder-panel',
  'contract-xray':      'contract-xray-panel',
  'approval-scanner':   'approval-scanner-panel',
  'block-autopsy':      'block-autopsy-panel',
  'gas-calculator':     'gas-calculator-panel',
  'token-battle':       'token-battle-panel',
  'pair-analytics':     'pair-analytics-panel',
  'token-flow':         'token-flow-panel',
  'yield-finder':       'yield-finder-panel',
  'risk-radar':         'risk-radar-panel',
  'sniper-detector':    'sniper-detector-panel',
  'wallet-cluster':     'wallet-cluster-panel',
  'honeypot-check':     'honeypot-check-panel',
  'validator-map':      'validator-map-panel',
  'dex-arb':            'dex-arb-panel',
  'token-birth':        'token-birth-panel',
  'network-pulse':      'network-pulse-panel',
  'copy-trade':         'copy-trade-panel',
  'upgrade-monitor':    'upgrade-monitor-panel',
  'portfolio-heatmap':  'portfolio-heatmap-panel',
};

const layouts = {
  'all': {
    name: 'All',
    grid: 'grid-2x4',
    panels: [
      'network-status', 'block-explorer', 'tx-explorer', 'gas-estimator',
      'address-profiler', 'token-inspector', 'contract-reader', 'nft-explorer',
    ],
  },
  'evm': {
    name: 'EVM',
    grid: 'grid-2x3',
    panels: [
      'network-status', 'block-explorer', 'tx-explorer',
      'gas-estimator', 'transfer-ops', 'contract-writing',
    ],
  },
  'tokens': {
    name: 'Tokens',
    grid: 'grid-2x2',
    panels: ['token-inspector', 'nft-explorer', 'contract-reader', 'address-profiler'],
  },
  'greenfield': {
    name: 'Greenfield',
    grid: 'grid-2x2',
    panels: ['greenfield-overview', 'greenfield-buckets', 'greenfield-objects', 'greenfield-payments'],
  },
  'erc8004': {
    name: 'ERC-8004',
    grid: 'grid-1x2',
    panels: ['erc8004', 'mcp-prompts'],
  },
  'live': {
    name: 'Live',
    grid: 'grid-2x3',
    panels: ['bsc-live-feed', 'smart-money', 'bsc-supremacy', 'burn-tracker', 'token-xray', 'market-pack'],
  },
  'community': {
    name: 'Community',
    grid: 'grid-1x3',
    panels: ['market-pack', 'syncx', 'token-xray'],
  },
  'mefai': {
    name: 'Mefai',
    grid: 'grid-1x1',
    panels: ['mefai-hub'],
    isMefaiHub: true,
  },
};

const grid = document.getElementById('grid');
const PREF_KEY = 'bnbchain-layout';

function setLayout(key) {
  const layout = layouts[key];
  if (!layout) return;

  grid.innerHTML = '';
  grid.className = 'grid ' + layout.grid;

  layout.panels.forEach(name => {
    const tag = panelRegistry[name];
    if (tag && customElements.get(tag)) {
      grid.appendChild(document.createElement(tag));
    } else {
      const div = document.createElement('div');
      div.className = 'panel';
      div.innerHTML = `
        <div class="panel-header"><span class="panel-title">${name}</span></div>
        <div class="panel-body"><div class="panel-loading">Panel not loaded</div></div>`;
      grid.appendChild(div);
    }
  });

  document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layout === key);
  });

  try { localStorage.setItem(PREF_KEY, key); } catch {}
}

// Nav clicks
document.querySelectorAll('.layout-btn[data-layout]').forEach(btn => {
  btn.addEventListener('click', () => setLayout(btn.dataset.layout));
});

// Keyboard: r = refresh all, 1-5 = switch layout
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'r') {
    document.querySelectorAll('.panel').forEach(p => { if (p.refresh) p.refresh(); });
    return;
  }
  const n = parseInt(e.key);
  if (n >= 1 && n <= 9) {
    const keys = Object.keys(layouts);
    if (keys[n - 1]) setLayout(keys[n - 1]);
  }
});

// Init
function init() {
  const urlLayout = new URLSearchParams(window.location.search).get('layout');
  let saved = null;
  try { saved = localStorage.getItem(PREF_KEY); } catch {}
  const key = (urlLayout && layouts[urlLayout]) ? urlLayout
            : (saved && layouts[saved]) ? saved
            : 'all';
  setLayout(key);
}

document.addEventListener('DOMContentLoaded', init);
