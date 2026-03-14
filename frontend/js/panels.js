// BNB Chain Skills — All 16 Panels
// Each panel shows skill number(s) it demonstrates

// ── Well-known BSC addresses for examples ──────────────────────────
const EX = {
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  USDT: '0x55d398326f99059fF775485246999027B3197955',
  CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  PANCAKE_ROUTER: '0x10ED43C718714eb63d5aA57B78B54917c3e6fE49',
  DEAD: '0x000000000000000000000000000000000000dEaD',
  BINANCE_HOT: '0x8894E0a0c962CB723c1ef8a1B6737B4E1e2AE02b',
  CZ_WALLET: '0x4B16c5dE96EB2117bBE5fd171E4d203624B014aa',
  NFT_PANCAKE: '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07',
  ERC8004_REG: '0x5901DeB30816E210B2C4cFeDC21De5f288Ec4C73',
};

// Token logos from TrustWallet assets CDN
function tokenLogo(addr) {
  if (!addr) return '';
  return 'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/' + addr + '/logo.png';
}

// ── Shared CSS fragments ────────────────────────────────────────────
const S = {
  tabs: '.p-tabs{display:flex;gap:4px;margin-bottom:8px}.p-tab{padding:3px 10px;font-size:10px;font-weight:600;border:1px solid var(--border);border-radius:4px;background:transparent;color:var(--text-muted);cursor:pointer;text-transform:uppercase;transition:all .15s;box-shadow:0 2px 0 var(--border)}.p-tab:hover{color:var(--text);transform:translateY(-1px);box-shadow:0 3px 0 var(--border)}.p-tab:active{transform:translateY(1px);box-shadow:none}.p-tab.active{background:var(--accent);color:#0b0e11;border-color:var(--accent);box-shadow:0 2px 0 #c99700}',
  cards: '.p-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}.p-cards-2{grid-template-columns:repeat(2,1fr)}.p-card{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px;text-align:center}.p-label{font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px}.p-val{font-size:14px;font-weight:700;color:var(--text);margin-top:2px}.p-sub{font-size:9px;margin-top:1px;color:var(--text-muted)}',
  search: '.p-search{display:flex;gap:4px;margin-bottom:10px}.p-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:6px 8px;font-size:11px;color:var(--text);font-family:inherit}.p-input:focus{border-color:var(--accent);outline:none}.p-btn{padding:6px 12px;background:var(--accent);color:#0b0e11;border:none;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;text-transform:uppercase;transition:all .15s;box-shadow:0 3px 0 #c99700,0 4px 8px rgba(0,0,0,.3)}.p-btn:hover{transform:translateY(-1px);box-shadow:0 4px 0 #c99700,0 6px 12px rgba(0,0,0,.4)}.p-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #c99700}.p-btn-sm{padding:4px 8px;font-size:9px}',
  detail: '.p-detail{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:10px;font-size:11px;overflow-wrap:break-word;word-wrap:break-word}.p-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border)}.p-row:last-child{border-bottom:none}.p-key{color:var(--text-muted);font-size:10px;min-width:80px}.p-value{color:var(--text);font-size:10px;text-align:right;max-width:65%;overflow:hidden;text-overflow:ellipsis;overflow-wrap:break-word;word-wrap:break-word}.p-mono{font-family:monospace;font-size:9px;color:var(--accent)}',
  info: '.p-info{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:12px;font-size:11px;line-height:1.6;overflow-wrap:break-word;word-wrap:break-word}.p-feat{padding:6px 0;border-bottom:1px solid var(--border)}.p-feat:last-child{border-bottom:none}.p-feat-t{font-weight:700;font-size:11px;color:var(--text)}.p-feat-d{font-size:9px;color:var(--text-muted);margin-top:1px}.p-badge{display:inline-block;padding:2px 6px;border-radius:3px;font-size:8px;font-weight:700;text-transform:uppercase}.p-badge-ok{background:rgba(14,203,129,.15);color:#0ecb81}.p-badge-warn{background:rgba(240,185,11,.15);color:#f0b90b}.p-badge-write{background:rgba(246,70,93,.12);color:#f6465d}.p-param{font-family:monospace;font-size:10px;color:var(--accent);background:var(--bg);padding:2px 5px;border-radius:3px;display:inline-block;margin:2px 0}',
  examples: '.p-examples{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}.p-ex{padding:3px 8px;font-size:9px;background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text-muted);cursor:pointer;transition:all .15s;box-shadow:0 2px 0 var(--border);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.p-ex:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-1px);box-shadow:0 3px 0 var(--border)}.p-ex:active{transform:translateY(1px);box-shadow:none}',
  table: '.p-table{width:100%;border-collapse:collapse;font-size:10px}.p-table th{text-align:left;padding:4px 6px;font-weight:600;font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--bg2);white-space:nowrap}.p-table td{padding:4px 6px;border-bottom:1px solid var(--border);white-space:nowrap}.p-table tr:hover td{background:rgba(240,185,11,.04)}.p-table .t-right{text-align:right}.p-table .t-green{color:#0ecb81}.p-table .t-red{color:#f6465d}.p-table .t-mono{font-family:monospace;font-size:9px}.p-table .t-name{font-weight:600;color:var(--text)}.p-table .t-sym{color:var(--accent);font-weight:700;font-size:10px}.p-table .t-muted{color:var(--text-muted);font-size:9px}',
};

function css(...keys) { return '<style scoped>' + keys.map(k => S[k]).join('') + '</style>'; }

function tabsHTML(tabs, active) {
  return '<div class="p-tabs">' + tabs.map(t =>
    `<button class="p-tab ${t.id === active ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
  ).join('') + '</div>';
}

function bindTabs(body, panel) {
  body.querySelectorAll('.p-tab').forEach(t => t.addEventListener('click', () => {
    panel._tab = t.dataset.tab;
    body.innerHTML = panel.renderContent(panel._data);
    panel.afterRender(body);
  }));
}

function examplesHTML(items, inputId) {
  return '<div class="p-examples">' + items.map(e =>
    `<button class="p-ex" data-val="${e.val}" data-input="${inputId}" title="${e.val}">${e.label}</button>`
  ).join('') + '</div>';
}

function bindExamples(body, panel, searchFn) {
  body.querySelectorAll('.p-ex').forEach(btn => btn.addEventListener('click', () => {
    const inputId = btn.dataset.input;
    const val = btn.dataset.val;
    const inp = body.querySelector('#' + inputId);
    if (inp) inp.value = val;
    // Store value so it persists after re-render
    if (!panel._inputVals) panel._inputVals = {};
    panel._inputVals[inputId] = val;
    if (searchFn) searchFn(val);
  }));
}

// Restore stored input values after re-render
function restoreInputs(body, panel) {
  if (!panel._inputVals) return;
  for (const [id, val] of Object.entries(panel._inputVals)) {
    const inp = body.querySelector('#' + id);
    if (inp && !inp.value) inp.value = val;
  }
}

function decodeString(hex) {
  if (!hex || hex === '0x' || hex.length < 66) return '';
  try {
    const raw = hex.replace('0x', '');
    const offset = parseInt(raw.slice(0, 64), 16) * 2;
    const len = parseInt(raw.slice(offset, offset + 64), 16);
    const data = raw.slice(offset + 64, offset + 64 + len * 2);
    let str = '';
    for (let i = 0; i < data.length; i += 2) {
      const c = parseInt(data.slice(i, i + 2), 16);
      if (c > 0) str += String.fromCharCode(c);
    }
    return str;
  } catch { return ''; }
}

function shortAddr(a) { return a ? a.slice(0, 8) + '...' + a.slice(-6) : ''; }

// ═══════════════════════════════════════════════════════════════════
// 1. Network Status — Skills #1-#5
// ═══════════════════════════════════════════════════════════════════
class NetworkStatusPanel extends BasePanel {
  static skill = 'Skill #1-#5';
  static defaultTitle = 'Network Status';
  constructor() { super(); this._refreshRate = 15000; this._tab = 'status'; }

  async fetchData() {
    const [blk, gas, chain, sync, nets] = await Promise.allSettled([
      bnbApi.blockNumber(), bnbApi.gasPrice(), bnbApi.chainId(), bnbApi.syncing(), bnbApi.supportedNetworks(),
    ]);
    return {
      blockNum: blk.status === 'fulfilled' && blk.value?.result ? parseInt(blk.value.result, 16) : 0,
      gasPrice: gas.status === 'fulfilled' && gas.value?.result ? parseInt(gas.value.result, 16) / 1e9 : 0,
      chainId: chain.status === 'fulfilled' && chain.value?.result ? parseInt(chain.value.result, 16) : 0,
      syncing: sync.status === 'fulfilled' ? sync.value?.result : false,
      networks: nets.status === 'fulfilled' && nets.value?.networks ? nets.value.networks : [],
    };
  }

  renderContent(d) {
    if (!d) return '<div class="panel-loading">Loading...</div>';
    let h = css('tabs', 'cards', 'detail');
    h += '<div class="p-cards">';
    h += `<div class="p-card"><div class="p-label">Block</div><div class="p-val">${_fmt(d.blockNum)}</div></div>`;
    h += `<div class="p-card"><div class="p-label">Gas</div><div class="p-val">${d.gasPrice.toFixed(1)}</div><div class="p-sub">Gwei</div></div>`;
    h += `<div class="p-card"><div class="p-label">Status</div><div class="p-val"><span class="p-badge ${d.syncing === false ? 'p-badge-ok' : 'p-badge-warn'}">${d.syncing === false ? 'Synced' : 'Syncing'}</span></div></div>`;
    h += '</div>';
    h += tabsHTML([{id:'status',label:'Chain'},{id:'networks',label:'Networks'}], this._tab);
    if (this._tab === 'status') {
      h += '<div class="p-cards p-cards-2">';
      h += `<div class="p-card"><div class="p-label">Chain ID</div><div class="p-val">${d.chainId}</div><div class="p-sub">BNB Smart Chain</div></div>`;
      h += `<div class="p-card"><div class="p-label">Consensus</div><div class="p-val" style="font-size:12px">PoSA</div><div class="p-sub">21 Validators</div></div>`;
      h += '</div>';
    } else {
      h += '<div class="p-detail">';
      for (const n of d.networks) {
        h += `<div class="p-row"><span class="p-key">${_esc(n.name)}</span><span class="p-value">Chain ${n.chainId} / ${_esc(n.symbol)}</span></div>`;
      }
      h += '</div>';
    }
    return h;
  }
  afterRender(b) { bindTabs(b, this); }
}
customElements.define('network-status-panel', NetworkStatusPanel);

// ═══════════════════════════════════════════════════════════════════
// 2. Block Explorer — Skills #6-#8
// ═══════════════════════════════════════════════════════════════════
class BlockExplorerPanel extends BasePanel {
  static skill = 'Skill #6-#8';
  static defaultTitle = 'Block Explorer';
  constructor() { super(); this._refreshRate = 30000; this._searchResult = null; }

  async fetchData() {
    const blkNum = await bnbApi.blockNumber();
    const num = blkNum?.result ? parseInt(blkNum.result, 16) : 0;
    let block = null;
    if (num > 0) {
      const res = await bnbApi.block('0x' + num.toString(16));
      if (res?.result) {
        const b = res.result;
        block = { number: parseInt(b.number, 16), timestamp: new Date(parseInt(b.timestamp, 16) * 1000), txCount: b.transactions?.length || 0, gasUsed: parseInt(b.gasUsed, 16), gasLimit: parseInt(b.gasLimit, 16), miner: b.miner, hash: b.hash };
      }
    }
    return { blockNum: num, block, searchResult: this._searchResult };
  }

  renderContent(d) {
    if (!d) return '<div class="panel-loading">Loading...</div>';
    let h = css('cards', 'search', 'detail', 'examples');
    h += '<div class="p-cards">';
    h += `<div class="p-card"><div class="p-label">Latest Block</div><div class="p-val">${_fmt(d.blockNum)}</div></div>`;
    h += `<div class="p-card"><div class="p-label">TXs in Block</div><div class="p-val">${d.block ? d.block.txCount : '—'}</div></div>`;
    h += `<div class="p-card"><div class="p-label">Gas Used</div><div class="p-val">${d.block ? _fmt(d.block.gasUsed) : '—'}</div></div>`;
    h += '</div>';
    h += '<div class="p-search"><input class="p-input" id="blk-input" placeholder="Block number (decimal)"><button class="p-btn" id="blk-btn">Search</button></div>';
    // Example buttons
    const exBlocks = d.blockNum > 0 ? [
      {label: 'Latest', val: String(d.blockNum)},
      {label: 'Latest -10', val: String(d.blockNum - 10)},
      {label: 'Latest -100', val: String(d.blockNum - 100)},
      {label: 'Block 1', val: '1'},
    ] : [{label: 'Block 1', val: '1'}];
    h += examplesHTML(exBlocks, 'blk-input');
    if (d.block && !d.searchResult) {
      const b = d.block;
      const pct = b.gasLimit > 0 ? (b.gasUsed / b.gasLimit * 100).toFixed(1) : 0;
      h += '<div class="p-detail">';
      h += `<div class="p-row"><span class="p-key">Block</span><span class="p-value">#${_fmt(b.number)}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Time</span><span class="p-value">${b.timestamp.toLocaleTimeString()}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Gas</span><span class="p-value">${_fmt(b.gasUsed)} (${pct}%)</span></div>`;
      h += `<div class="p-row"><span class="p-key">Validator</span><span class="p-value p-mono">${b.miner}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Hash</span><span class="p-value p-mono">${b.hash}</span></div>`;
      h += '</div>';
    }
    if (d.searchResult) {
      const b = d.searchResult;
      h += '<div class="p-detail">';
      h += `<div class="p-row"><span class="p-key">Block</span><span class="p-value">#${_fmt(b.number)}</span></div>`;
      h += `<div class="p-row"><span class="p-key">TXs</span><span class="p-value">${b.txCount}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Time</span><span class="p-value">${b.timestamp.toLocaleTimeString()}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Hash</span><span class="p-value p-mono">${b.hash}</span></div>`;
      h += '</div>';
    }
    return h;
  }

  async _search(num) {
    if (!num) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['blk-input'] = num;
    const hex = '0x' + parseInt(num).toString(16);
    const res = await bnbApi.block(hex);
    if (res?.result) {
      const b = res.result;
      this._searchResult = { number: parseInt(b.number, 16), txCount: b.transactions?.length || 0, timestamp: new Date(parseInt(b.timestamp, 16) * 1000), hash: b.hash };
    }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    const btn = b.querySelector('#blk-btn'), inp = b.querySelector('#blk-input');
    if (btn && inp) {
      btn.addEventListener('click', () => this._search(inp.value.trim()));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._search(inp.value.trim()); });
    }
    bindExamples(b, this, v => this._search(v));
    restoreInputs(b, this);
  }
}
customElements.define('block-explorer-panel', BlockExplorerPanel);

// ═══════════════════════════════════════════════════════════════════
// 3. TX Explorer — Skills #9-#11
// ═══════════════════════════════════════════════════════════════════
class TxExplorerPanel extends BasePanel {
  static skill = 'Skill #9-#11';
  static defaultTitle = 'TX Explorer';
  constructor() { super(); this._refreshRate = 0; this._result = null; this._autoLoaded = false; }

  async fetchData() {
    // Auto-load a recent TX from the latest block on first load
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      try {
        const blkNum = await bnbApi.blockNumber();
        if (blkNum?.result) {
          const blk = await bnbApi.block(blkNum.result);
          if (blk?.result?.transactions?.length > 0) {
            const txHash = typeof blk.result.transactions[0] === 'string' ? blk.result.transactions[0] : blk.result.transactions[0].hash;
            if (txHash) {
              const [tx, receipt] = await Promise.allSettled([bnbApi.tx(txHash), bnbApi.receipt(txHash)]);
              const txData = tx.status === 'fulfilled' && tx.value?.result ? tx.value.result : null;
              if (txData) {
                if (receipt.status === 'fulfilled' && receipt.value?.result) txData._receipt = receipt.value.result;
                this._result = txData;
              }
            }
          }
        }
      } catch {}
    }
    return { result: this._result };
  }

  renderContent(d) {
    let h = css('search', 'detail', 'examples');
    h += '<div class="p-search"><input class="p-input" id="tx-input" placeholder="Transaction hash (0x...)"><button class="p-btn" id="tx-btn">Search</button></div>';
    // Show current TX hash as example if available
    const txExamples = [];
    if (d?.result?.hash) txExamples.push({label: 'Current TX', val: d.result.hash});
    if (txExamples.length > 0) h += examplesHTML(txExamples, 'tx-input');
    if (d?.result && !d.result.error) {
      const r = d.result;
      const val = r.value ? (parseInt(r.value, 16) / 1e18).toFixed(6) : '0';
      const gasP = r.gasPrice ? (parseInt(r.gasPrice, 16) / 1e9).toFixed(2) : '—';
      const status = r._receipt?.status === '0x1' ? '<span class="p-badge p-badge-ok">Success</span>' : r._receipt?.status === '0x0' ? '<span class="p-badge p-badge-write">Failed</span>' : '<span class="p-badge p-badge-warn">Pending</span>';
      h += '<div class="p-detail">';
      h += `<div class="p-row"><span class="p-key">Status</span><span class="p-value">${status}</span></div>`;
      h += `<div class="p-row"><span class="p-key">From</span><span class="p-value p-mono">${r.from || '—'}</span></div>`;
      h += `<div class="p-row"><span class="p-key">To</span><span class="p-value p-mono">${r.to || 'Contract Creation'}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Value</span><span class="p-value">${val} BNB</span></div>`;
      h += `<div class="p-row"><span class="p-key">Gas Price</span><span class="p-value">${gasP} Gwei</span></div>`;
      h += `<div class="p-row"><span class="p-key">Block</span><span class="p-value">${r.blockNumber ? _fmt(parseInt(r.blockNumber, 16)) : 'Pending'}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Hash</span><span class="p-value p-mono">${r.hash || '—'}</span></div>`;
      h += '</div>';
    } else if (d?.result?.error) {
      h += '<div class="p-detail" style="color:var(--text-muted)">Transaction not found</div>';
    } else {
      h += '<div class="p-detail" style="text-align:center;color:var(--text-muted)">Loading latest transaction...</div>';
    }
    return h;
  }

  async _search(hash) {
    if (!hash || hash.length !== 66) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['tx-input'] = hash;
    try {
      const [tx, receipt] = await Promise.allSettled([bnbApi.tx(hash), bnbApi.receipt(hash)]);
      const txData = tx.status === 'fulfilled' && tx.value?.result ? tx.value.result : null;
      if (txData) {
        if (receipt.status === 'fulfilled' && receipt.value?.result) txData._receipt = receipt.value.result;
        this._result = txData;
      } else { this._result = { error: true }; }
    } catch { this._result = { error: true }; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    const btn = b.querySelector('#tx-btn'), inp = b.querySelector('#tx-input');
    if (btn && inp) {
      btn.addEventListener('click', () => this._search(inp.value.trim()));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._search(inp.value.trim()); });
    }
    bindExamples(b, this, v => this._search(v));
    restoreInputs(b, this);
  }
}
customElements.define('tx-explorer-panel', TxExplorerPanel);

// ═══════════════════════════════════════════════════════════════════
// 4. Gas Estimator — Skills #12-#13
// ═══════════════════════════════════════════════════════════════════
class GasEstimatorPanel extends BasePanel {
  static skill = 'Skill #12-#13';
  static defaultTitle = 'Gas Estimator';
  constructor() { super(); this._refreshRate = 10000; this._estResult = null; this._autoEstimated = false; }

  async fetchData() {
    const gas = await bnbApi.gasPrice();
    const price = gas?.result ? parseInt(gas.result, 16) / 1e9 : 0;
    // Auto-estimate for WBNB on first load
    if (!this._autoEstimated && price > 0) {
      this._autoEstimated = true;
      try { this._estResult = await bnbApi.estimateGas(EX.WBNB, '0x', '0x0'); } catch {}
    }
    return { gasPrice: price, estResult: this._estResult };
  }

  renderContent(d) {
    if (!d) return '<div class="panel-loading">Loading...</div>';
    let h = css('cards', 'search', 'detail', 'examples');
    h += '<div class="p-cards p-cards-2">';
    h += `<div class="p-card"><div class="p-label">Current Gas Price</div><div class="p-val" style="color:var(--accent)">${d.gasPrice.toFixed(2)}</div><div class="p-sub">Gwei</div></div>`;
    const txCost = (d.gasPrice * 21000 / 1e9).toFixed(6);
    h += `<div class="p-card"><div class="p-label">Simple Transfer</div><div class="p-val" style="font-size:12px">${txCost}</div><div class="p-sub">BNB (21,000 gas)</div></div>`;
    h += '</div>';
    h += '<div class="p-search"><input class="p-input" id="gas-to" placeholder="To address (0x...)"><button class="p-btn" id="gas-btn">Estimate</button></div>';
    h += examplesHTML([
      {label: 'WBNB (BNB)', val: EX.WBNB},
      {label: 'CZ Wallet', val: EX.CZ_WALLET},
      {label: 'USDT', val: EX.USDT},
      {label: 'PancakeRouter', val: EX.PANCAKE_ROUTER},
    ], 'gas-to');
    if (d.estResult) {
      const est = d.estResult;
      if (est.result) {
        const gasUnits = parseInt(est.result, 16);
        const cost = (d.gasPrice * gasUnits / 1e9).toFixed(6);
        h += '<div class="p-detail">';
        h += `<div class="p-row"><span class="p-key">Gas Units</span><span class="p-value">${_fmt(gasUnits)}</span></div>`;
        h += `<div class="p-row"><span class="p-key">Estimated Cost</span><span class="p-value" style="color:var(--accent)">${cost} BNB</span></div>`;
        h += '</div>';
      } else {
        h += '<div class="p-detail" style="color:var(--text-muted)">Could not estimate gas</div>';
      }
    }
    return h;
  }

  async _estimate(to) {
    if (!to || to.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['gas-to'] = to;
    try { this._estResult = await bnbApi.estimateGas(to, '0x', '0x0'); } catch { this._estResult = null; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    const btn = b.querySelector('#gas-btn'), inp = b.querySelector('#gas-to');
    if (btn && inp) {
      btn.addEventListener('click', () => this._estimate(inp.value.trim()));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._estimate(inp.value.trim()); });
    }
    bindExamples(b, this, v => this._estimate(v));
    restoreInputs(b, this);
  }
}
customElements.define('gas-estimator-panel', GasEstimatorPanel);

// ═══════════════════════════════════════════════════════════════════
// 5. Address Profiler — Skills #14-#16
// ═══════════════════════════════════════════════════════════════════
class AddressProfilerPanel extends BasePanel {
  static skill = 'Skill #14-#16';
  static defaultTitle = 'Address Profiler';
  constructor() { super(); this._refreshRate = 0; this._profile = null; this._autoLoaded = false; }

  async fetchData() {
    // Auto-load CZ wallet on first load
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      try { this._profile = await bnbApi.addressProfile(EX.CZ_WALLET); } catch {}
    }
    return { profile: this._profile };
  }

  renderContent(d) {
    let h = css('search', 'cards', 'detail', 'info', 'examples');
    h += '<div class="p-search"><input class="p-input" id="ap-input" placeholder="BSC address (0x...)"><button class="p-btn" id="ap-btn">Profile</button></div>';
    h += examplesHTML([
      {label: 'CZ Wallet', val: EX.CZ_WALLET},
      {label: 'Binance Hot', val: EX.BINANCE_HOT},
      {label: 'WBNB Contract', val: EX.WBNB},
      {label: 'Burn Address', val: EX.DEAD},
    ], 'ap-input');
    if (d?.profile) {
      const p = d.profile;
      const bal = p.balance?.result ? (parseInt(p.balance.result, 16) / 1e18).toFixed(6) : '0';
      const txCount = p.transactionCount?.result ? parseInt(p.transactionCount.result, 16) : 0;
      h += '<div class="p-cards p-cards-2">';
      h += `<div class="p-card"><div class="p-label">BNB Balance</div><div class="p-val" style="color:var(--accent)">${bal}</div></div>`;
      h += `<div class="p-card"><div class="p-label">TX Count</div><div class="p-val">${_fmt(txCount)}</div></div>`;
      h += '</div>';
      h += '<div class="p-detail">';
      h += `<div class="p-row"><span class="p-key">Address</span><span class="p-value p-mono">${_esc(p.address)}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Type</span><span class="p-value"><span class="p-badge ${p.isContract ? 'p-badge-warn' : 'p-badge-ok'}">${p.isContract ? 'Contract' : 'EOA'}</span></span></div>`;
      if (p.isContract && p.codeSize > 0) h += `<div class="p-row"><span class="p-key">Code Size</span><span class="p-value">${_fmt(p.codeSize)} bytes</span></div>`;
      h += '</div>';
    }
    return h;
  }

  async _search(addr) {
    if (!addr || addr.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['ap-input'] = addr;
    try { this._profile = await bnbApi.addressProfile(addr); } catch { this._profile = null; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    const btn = b.querySelector('#ap-btn'), inp = b.querySelector('#ap-input');
    if (btn && inp) {
      btn.addEventListener('click', () => this._search(inp.value.trim()));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._search(inp.value.trim()); });
    }
    bindExamples(b, this, v => this._search(v));
    restoreInputs(b, this);
  }
}
customElements.define('address-profiler-panel', AddressProfilerPanel);

// ═══════════════════════════════════════════════════════════════════
// 6. Token Inspector — Skills #17-#18
// ═══════════════════════════════════════════════════════════════════
class TokenInspectorPanel extends BasePanel {
  static skill = 'Skill #17-#18';
  static defaultTitle = 'Token Inspector';
  constructor() { super(); this._refreshRate = 0; this._tab = 'info'; this._tokenData = null; this._balData = null; this._autoLoaded = false; }

  async fetchData() {
    // Auto-load WBNB (BNB) token info + CZ balance on first load
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      try {
        this._tokenData = await bnbApi.tokenInfo(EX.WBNB);
        const balRes = await bnbApi.tokenBalance(EX.WBNB, EX.CZ_WALLET);
        if (balRes?.result) this._balData = BigInt(balRes.result).toString();
        this._autoContract = EX.WBNB;
        this._autoAddr = EX.CZ_WALLET;
      } catch {}
    }
    return { tokenData: this._tokenData, balData: this._balData, autoContract: this._autoContract, autoAddr: this._autoAddr };
  }

  renderContent(d) {
    let h = css('tabs', 'search', 'cards', 'detail', 'examples');
    h += tabsHTML([{id:'info',label:'Token Info'},{id:'balance',label:'Balance'}], this._tab);
    if (this._tab === 'info') {
      h += '<div class="p-search"><input class="p-input" id="ti-addr" placeholder="ERC20 contract (0x...)"><button class="p-btn" id="ti-btn">Lookup</button></div>';
      h += examplesHTML([
        {label: 'WBNB (BNB)', val: EX.WBNB},
        {label: 'USDT', val: EX.USDT},
        {label: 'BUSD', val: EX.BUSD},
        {label: 'CAKE', val: EX.CAKE},
      ], 'ti-addr');
      if (d?.tokenData) {
        const t = d.tokenData;
        const name = decodeString(t.name?.result);
        const symbol = decodeString(t.symbol?.result);
        const decimals = t.decimals?.result ? parseInt(t.decimals.result, 16) : '?';
        h += '<div class="p-cards p-cards-2">';
        h += `<div class="p-card"><div class="p-label">Name</div><div class="p-val" style="font-size:12px">${_esc(name || 'Unknown')}</div></div>`;
        h += `<div class="p-card"><div class="p-label">Symbol</div><div class="p-val">${_esc(symbol || '?')}</div></div>`;
        h += '</div>';
        h += '<div class="p-detail">';
        h += `<div class="p-row"><span class="p-key">Decimals</span><span class="p-value">${decimals}</span></div>`;
        h += `<div class="p-row"><span class="p-key">Contract</span><span class="p-value p-mono">${_esc(t.contract)}</span></div>`;
        h += '</div>';
      }
    } else {
      h += '<div class="p-search"><input class="p-input" id="tb-contract" placeholder="Token contract (0x...)"></div>';
      h += '<div class="p-search"><input class="p-input" id="tb-addr" placeholder="Wallet address (0x...)"><button class="p-btn" id="tb-btn">Check</button></div>';
      h += examplesHTML([
        {label: 'WBNB (BNB)', val: EX.WBNB},
        {label: 'USDT', val: EX.USDT},
      ], 'tb-contract');
      if (d?.balData) {
        h += '<div class="p-detail">';
        h += `<div class="p-row"><span class="p-key">Balance (raw)</span><span class="p-value" style="color:var(--accent)">${d.balData}</span></div>`;
        if (d.autoContract) h += `<div class="p-row"><span class="p-key">Token</span><span class="p-value p-mono">${_esc(d.autoContract)}</span></div>`;
        if (d.autoAddr) h += `<div class="p-row"><span class="p-key">Wallet</span><span class="p-value p-mono">${_esc(d.autoAddr)}</span></div>`;
        h += '</div>';
      }
    }
    return h;
  }

  async _lookupToken(addr) {
    if (!addr || addr.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['ti-addr'] = addr;
    try { this._tokenData = await bnbApi.tokenInfo(addr); } catch {}
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  async _checkBalance(contract, addr) {
    if (!contract || !addr) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['tb-contract'] = contract;
    this._inputVals['tb-addr'] = addr;
    try {
      const res = await bnbApi.tokenBalance(contract, addr);
      this._balData = res?.result ? BigInt(res.result).toString() : '0';
    } catch { this._balData = 'Error'; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    bindTabs(b, this);
    const tiBtn = b.querySelector('#ti-btn'), tiInp = b.querySelector('#ti-addr');
    if (tiBtn && tiInp) { tiBtn.addEventListener('click', () => this._lookupToken(tiInp.value.trim())); tiInp.addEventListener('keydown', e => { if (e.key === 'Enter') this._lookupToken(tiInp.value.trim()); }); }
    const tbBtn = b.querySelector('#tb-btn'), tbC = b.querySelector('#tb-contract'), tbA = b.querySelector('#tb-addr');
    if (tbBtn && tbC && tbA) { tbBtn.addEventListener('click', () => this._checkBalance(tbC.value.trim(), tbA.value.trim())); }
    bindExamples(b, this, v => {
      if (this._tab === 'info') this._lookupToken(v);
      else if (this._tab === 'balance') {
        if (!this._inputVals) this._inputVals = {};
        this._inputVals['tb-contract'] = v;
        const c = b.querySelector('#tb-contract');
        if (c) c.value = v;
      }
    });
    restoreInputs(b, this);
  }
}
customElements.define('token-inspector-panel', TokenInspectorPanel);

// ═══════════════════════════════════════════════════════════════════
// 7. Contract Reader — Skills #19-#20
// ═══════════════════════════════════════════════════════════════════
class ContractReaderPanel extends BasePanel {
  static skill = 'Skill #19-#20';
  static defaultTitle = 'Contract Reader';
  constructor() { super(); this._refreshRate = 0; this._result = null; this._codeResult = null; this._autoLoaded = false; }

  async fetchData() {
    // Auto-check WBNB contract + call name() on first load
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      try {
        const res = await bnbApi.code(EX.WBNB);
        this._codeResult = res?.result && res.result !== '0x';
        this._checkedAddr = EX.WBNB;
        // Call name() = 0x06fdde03
        this._result = await bnbApi.readContract(EX.WBNB, '0x06fdde03');
      } catch { this._codeResult = false; }
    }
    return { result: this._result, codeResult: this._codeResult, checkedAddr: this._checkedAddr };
  }

  renderContent(d) {
    let h = css('search', 'detail', 'examples');
    h += '<div class="p-search"><input class="p-input" id="cr-addr" placeholder="Contract address (0x...)"><button class="p-btn" id="cr-code-btn">Check</button></div>';
    h += examplesHTML([
      {label: 'WBNB (BNB)', val: EX.WBNB},
      {label: 'PancakeSwap', val: EX.PANCAKE_ROUTER},
      {label: 'USDT', val: EX.USDT},
      {label: 'CZ Wallet (EOA)', val: EX.CZ_WALLET},
    ], 'cr-addr');
    if (d?.codeResult !== null && d?.codeResult !== undefined) {
      const isC = d.codeResult;
      h += `<div class="p-detail"><div class="p-row"><span class="p-key">Type</span><span class="p-value"><span class="p-badge ${isC ? 'p-badge-warn' : 'p-badge-ok'}">${isC ? 'Smart Contract' : 'EOA (Wallet)'}</span></span></div>`;
      if (d.checkedAddr) h += `<div class="p-row"><span class="p-key">Address</span><span class="p-value p-mono">${_esc(d.checkedAddr)}</span></div>`;
      h += '</div>';
    }
    h += '<div style="margin-top:8px"></div>';
    h += '<div class="p-search"><input class="p-input" id="cr-data" placeholder="ABI-encoded call data (0x...)"><button class="p-btn" id="cr-call-btn">Call</button></div>';
    if (d?.result) {
      h += '<div class="p-detail">';
      h += `<div class="p-row"><span class="p-key">Result</span><span class="p-value p-mono" style="max-width:75%">${_esc(d.result.result || 'Error')}</span></div>`;
      h += '</div>';
    } else {
      h += '<div class="p-detail" style="text-align:center;color:var(--text-muted)">Call any view/pure function using ABI-encoded data</div>';
    }
    return h;
  }

  async _checkCode(addr) {
    if (!addr || addr.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['cr-addr'] = addr;
    try {
      const res = await bnbApi.code(addr);
      this._codeResult = res?.result && res.result !== '0x';
      this._checkedAddr = addr;
    } catch { this._codeResult = false; this._checkedAddr = addr; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  async _call(addr, data) {
    if (!addr || !data) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['cr-addr'] = addr;
    this._inputVals['cr-data'] = data;
    try { this._result = await bnbApi.readContract(addr, data); } catch { this._result = { result: 'Error' }; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    const codeBtn = b.querySelector('#cr-code-btn'), codeInp = b.querySelector('#cr-addr');
    if (codeBtn && codeInp) { codeBtn.addEventListener('click', () => this._checkCode(codeInp.value.trim())); codeInp.addEventListener('keydown', e => { if (e.key === 'Enter') this._checkCode(codeInp.value.trim()); }); }
    const callBtn = b.querySelector('#cr-call-btn'), dataInp = b.querySelector('#cr-data');
    if (callBtn && dataInp && codeInp) { callBtn.addEventListener('click', () => this._call(codeInp.value.trim(), dataInp.value.trim())); }
    bindExamples(b, this, v => this._checkCode(v));
    restoreInputs(b, this);
  }
}
customElements.define('contract-reader-panel', ContractReaderPanel);

// ═══════════════════════════════════════════════════════════════════
// 8. NFT Explorer — Skills #21-#24
// ═══════════════════════════════════════════════════════════════════
class NftExplorerPanel extends BasePanel {
  static skill = 'Skill #21-#24';
  static defaultTitle = 'NFT Explorer';
  constructor() { super(); this._refreshRate = 0; this._balResult = null; this._autoLoaded = false; }

  async fetchData() {
    // Auto-check PancakeSwap NFT for CZ wallet
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      try {
        const [balRes, tokRes] = await Promise.allSettled([bnbApi.nftBalance(EX.CZ_WALLET, EX.NFT_PANCAKE), bnbApi.nftTokens(EX.CZ_WALLET, EX.NFT_PANCAKE, 5)]);
        const balance = balRes.status === 'fulfilled' && balRes.value?.result ? parseInt(balRes.value.result, 16) : 0;
        const tokens = tokRes.status === 'fulfilled' && tokRes.value?.tokens ? tokRes.value.tokens.map(t => parseInt(t.tokenId, 16)) : [];
        this._balResult = { balance, tokens, contract: EX.NFT_PANCAKE, owner: EX.CZ_WALLET };
      } catch {}
    }
    return { balResult: this._balResult };
  }

  renderContent(d) {
    let h = css('search', 'cards', 'detail', 'examples');
    h += '<div class="p-search"><input class="p-input" id="nft-contract" placeholder="NFT contract (0x...)"></div>';
    h += '<div class="p-search"><input class="p-input" id="nft-owner" placeholder="Owner address (0x...)"><button class="p-btn" id="nft-btn">Check</button></div>';
    h += examplesHTML([
      {label: 'PancakeSquad', val: EX.NFT_PANCAKE},
    ], 'nft-contract');
    if (d?.balResult) {
      const r = d.balResult;
      h += '<div class="p-cards p-cards-2">';
      h += `<div class="p-card"><div class="p-label">NFT Balance</div><div class="p-val" style="color:var(--accent)">${r.balance}</div></div>`;
      h += `<div class="p-card"><div class="p-label">Token IDs</div><div class="p-val" style="font-size:11px">${r.tokens.length > 0 ? r.tokens.slice(0, 5).join(', ') : 'None'}</div></div>`;
      h += '</div>';
      h += '<div class="p-detail">';
      h += `<div class="p-row"><span class="p-key">Contract</span><span class="p-value p-mono">${_esc(r.contract)}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Owner</span><span class="p-value p-mono">${_esc(r.owner)}</span></div>`;
      h += '</div>';
    }
    return h;
  }

  async _check(contract, owner) {
    if (!contract || !owner || contract.length !== 42 || owner.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['nft-contract'] = contract;
    this._inputVals['nft-owner'] = owner;
    try {
      const [balRes, tokRes] = await Promise.allSettled([bnbApi.nftBalance(owner, contract), bnbApi.nftTokens(owner, contract, 5)]);
      const balance = balRes.status === 'fulfilled' && balRes.value?.result ? parseInt(balRes.value.result, 16) : 0;
      const tokens = tokRes.status === 'fulfilled' && tokRes.value?.tokens ? tokRes.value.tokens.map(t => parseInt(t.tokenId, 16)) : [];
      this._balResult = { balance, tokens, contract, owner };
    } catch { this._balResult = { balance: 0, tokens: [], contract, owner }; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    const btn = b.querySelector('#nft-btn'), c = b.querySelector('#nft-contract'), o = b.querySelector('#nft-owner');
    if (btn && c && o) { btn.addEventListener('click', () => this._check(c.value.trim(), o.value.trim())); }
    bindExamples(b, this, v => {
      if (!this._inputVals) this._inputVals = {};
      this._inputVals['nft-contract'] = v;
      const c2 = b.querySelector('#nft-contract');
      if (c2) c2.value = v;
    });
    restoreInputs(b, this);
  }
}
customElements.define('nft-explorer-panel', NftExplorerPanel);

// ═══════════════════════════════════════════════════════════════════
// 9. Transfer Operations — Skills #25-#28
// ═══════════════════════════════════════════════════════════════════
class TransferOpsPanel extends BasePanel {
  static skill = 'Skill #25-#28';
  static defaultTitle = 'Transfer Operations';
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return {}; }

  renderContent() {
    let h = css('info');
    const ops = [
      { name: 'transfer_native_token', desc: 'Send BNB to another address', params: 'to, amount, network' },
      { name: 'transfer_erc20', desc: 'Transfer ERC20 tokens', params: 'contractAddress, to, amount, network' },
      { name: 'transfer_nft', desc: 'Send an ERC721 NFT', params: 'contractAddress, to, tokenId, network' },
      { name: 'transfer_erc1155', desc: 'Transfer ERC1155 multi-tokens', params: 'contractAddress, to, tokenId, amount, network' },
    ];
    h += '<div class="p-info">';
    h += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px">State-changing operations — require PRIVATE_KEY in MCP server environment</div>';
    for (const o of ops) {
      h += '<div class="p-feat">';
      h += `<div class="p-feat-t"><span class="p-mono">${o.name}</span> <span class="p-badge p-badge-write">Write</span></div>`;
      h += `<div class="p-feat-d">${o.desc}</div>`;
      h += `<div style="margin-top:3px">${o.params.split(', ').map(p => `<span class="p-param">${p}</span>`).join(' ')}</div>`;
      h += '</div>';
    }
    h += '</div>';
    return h;
  }
}
customElements.define('transfer-ops-panel', TransferOpsPanel);

// ═══════════════════════════════════════════════════════════════════
// 10. Contract Writing — Skills #29-#30
// ═══════════════════════════════════════════════════════════════════
class ContractWritingPanel extends BasePanel {
  static skill = 'Skill #29-#30';
  static defaultTitle = 'Contract Writing';
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return {}; }

  renderContent() {
    let h = css('info');
    const ops = [
      { name: 'write_contract', desc: 'Execute any state-changing smart contract function', params: 'contractAddress, functionName, args, abi, value, network' },
      { name: 'approve_token_spending', desc: 'Grant a spender contract allowance for your tokens', params: 'contractAddress, spender, amount, network' },
    ];
    h += '<div class="p-info">';
    h += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px">State-changing operations — require explicit network confirmation</div>';
    for (const o of ops) {
      h += '<div class="p-feat">';
      h += `<div class="p-feat-t"><span class="p-mono">${o.name}</span> <span class="p-badge p-badge-write">Write</span></div>`;
      h += `<div class="p-feat-d">${o.desc}</div>`;
      h += `<div style="margin-top:3px">${o.params.split(', ').map(p => `<span class="p-param">${p}</span>`).join(' ')}</div>`;
      h += '</div>';
    }
    h += '</div>';
    return h;
  }
}
customElements.define('contract-writing-panel', ContractWritingPanel);

// ═══════════════════════════════════════════════════════════════════
// 11. ERC-8004 Agents — Skills #31-#34
// ═══════════════════════════════════════════════════════════════════
class Erc8004Panel extends BasePanel {
  static skill = 'Skill #31-#34';
  static defaultTitle = 'ERC-8004 Agents';
  constructor() { super(); this._refreshRate = 0; this._tab = 'lookup'; this._agentResult = null; this._balResult = null; this._autoLoaded = false; }

  async fetchData() {
    // Auto-lookup agent #1 on first load
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      try { this._agentResult = await bnbApi.erc8004Agent('1'); } catch { this._agentResult = { tokenId: '1' }; }
    }
    return { agentResult: this._agentResult, balResult: this._balResult };
  }

  renderContent(d) {
    let h = css('tabs', 'search', 'detail', 'info', 'examples');
    h += tabsHTML([{id:'lookup',label:'Lookup'},{id:'owner',label:'By Owner'},{id:'about',label:'About'}], this._tab);
    if (this._tab === 'lookup') {
      h += '<div class="p-search"><input class="p-input" id="ag-id" placeholder="Agent Token ID (1, 2, 3...)"><button class="p-btn" id="ag-btn">Lookup</button></div>';
      h += examplesHTML([
        {label: 'Agent #1', val: '1'},
        {label: 'Agent #2', val: '2'},
        {label: 'Agent #5', val: '5'},
        {label: 'Agent #10', val: '10'},
      ], 'ag-id');
      if (d?.agentResult) {
        const r = d.agentResult;
        h += '<div class="p-detail">';
        h += `<div class="p-row"><span class="p-key">Token ID</span><span class="p-value">${_esc(r.tokenId)}</span></div>`;
        const hasData = r.tokenURI?.result && r.tokenURI.result !== '0x';
        h += `<div class="p-row"><span class="p-key">Status</span><span class="p-value"><span class="p-badge ${hasData ? 'p-badge-ok' : 'p-badge-warn'}">${hasData ? 'Registered' : 'Not Found'}</span></span></div>`;
        if (hasData) h += `<div class="p-row"><span class="p-key">URI Data</span><span class="p-value p-mono" style="max-width:70%">${_esc(r.tokenURI.result.slice(0, 80))}...</span></div>`;
        h += '</div>';
      }
    } else if (this._tab === 'owner') {
      h += '<div class="p-search"><input class="p-input" id="ag-owner" placeholder="Owner address (0x...)"><button class="p-btn" id="ag-own-btn">Check</button></div>';
      h += examplesHTML([
        {label: 'CZ Wallet', val: EX.CZ_WALLET},
        {label: 'Binance Hot', val: EX.BINANCE_HOT},
      ], 'ag-owner');
      if (d?.balResult !== null && d?.balResult !== undefined) {
        h += `<div class="p-detail"><div class="p-row"><span class="p-key">Registered Agents</span><span class="p-value" style="font-weight:700;color:var(--accent)">${d.balResult}</span></div></div>`;
      }
    } else {
      h += '<div class="p-info">';
      h += '<div style="font-weight:700;margin-bottom:6px;color:var(--accent)">ERC-8004 Identity Registry</div>';
      const feats = [
        { t: 'On-Chain Agent Identity', d: 'NFT-based identity tokens for AI agents on BSC, Ethereum, Base, Polygon' },
        { t: 'Agent Metadata Profile', d: 'Name, description, image, service endpoints via agentURI format' },
        { t: 'Payment Wallet (x402)', d: 'Verified payment wallets for autonomous agent-to-agent payments' },
        { t: 'register_erc8004_agent', d: 'Register your MCP server on-chain. Requires PRIVATE_KEY.' },
        { t: 'set_erc8004_agent_uri', d: 'Update metadata URI. Owner only. Requires PRIVATE_KEY.' },
      ];
      for (const f of feats) {
        h += `<div class="p-feat"><div class="p-feat-t">${f.t}</div><div class="p-feat-d">${f.d}</div></div>`;
      }
      h += '</div>';
    }
    return h;
  }

  async _lookup(id) {
    if (!id) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['ag-id'] = id;
    try { this._agentResult = await bnbApi.erc8004Agent(id); } catch { this._agentResult = { tokenId: id }; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  async _checkOwner(addr) {
    if (!addr || addr.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['ag-owner'] = addr;
    try {
      const res = await bnbApi.erc8004Balance(addr);
      this._balResult = res?.result ? parseInt(res.result, 16) : 0;
    } catch { this._balResult = 0; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    bindTabs(b, this);
    const btn = b.querySelector('#ag-btn'), inp = b.querySelector('#ag-id');
    if (btn && inp) { btn.addEventListener('click', () => this._lookup(inp.value.trim())); inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._lookup(inp.value.trim()); }); }
    const obtn = b.querySelector('#ag-own-btn'), oinp = b.querySelector('#ag-owner');
    if (obtn && oinp) { obtn.addEventListener('click', () => this._checkOwner(oinp.value.trim())); oinp.addEventListener('keydown', e => { if (e.key === 'Enter') this._checkOwner(oinp.value.trim()); }); }
    bindExamples(b, this, v => {
      if (this._tab === 'lookup') this._lookup(v);
      else if (this._tab === 'owner') this._checkOwner(v);
    });
    restoreInputs(b, this);
  }
}
customElements.define('erc8004-panel', Erc8004Panel);

// ═══════════════════════════════════════════════════════════════════
// 12. Greenfield Overview — Skill #35
// ═══════════════════════════════════════════════════════════════════
class GreenfieldOverviewPanel extends BasePanel {
  static skill = 'Skill #35';
  static defaultTitle = 'Greenfield Overview';
  constructor() { super(); this._refreshRate = 60000; }

  async fetchData() {
    let status = null;
    try { const res = await bnbApi.greenfieldStatus(); if (res && !res.error) status = res; } catch {}
    return { status };
  }

  renderContent(d) {
    if (!d) return '<div class="panel-loading">Loading...</div>';
    let h = css('cards', 'info');
    h += '<div class="p-cards p-cards-2">';
    h += `<div class="p-card"><div class="p-label">Network</div><div class="p-val" style="font-size:12px">BNB Greenfield</div><div class="p-sub">Decentralized Storage</div></div>`;
    if (d.status) {
      const ver = d.status.node_info?.version || d.status.version || 'Active';
      h += `<div class="p-card"><div class="p-label">Status</div><div class="p-val"><span class="p-badge p-badge-ok">Online</span></div><div class="p-sub">v${_esc(String(ver))}</div></div>`;
    } else {
      h += `<div class="p-card"><div class="p-label">Status</div><div class="p-val"><span class="p-badge p-badge-warn">Checking</span></div></div>`;
    }
    h += '</div>';
    h += '<div class="p-info">';
    h += '<div style="color:var(--text-muted);font-size:10px;margin-bottom:6px">Decentralized data storage for the BNB ecosystem. Reed-Solomon erasure coding, Tendermint consensus, cross-chain programmability with BSC.</div>';
    h += '<div class="p-cards p-cards-2" style="margin-top:6px">';
    h += '<div class="p-card"><div class="p-label">Encoding</div><div class="p-val" style="font-size:11px">Reed-Solomon EC</div></div>';
    h += '<div class="p-card"><div class="p-label">Consensus</div><div class="p-val" style="font-size:11px">Tendermint PoS</div></div>';
    h += '</div></div>';
    return h;
  }
}
customElements.define('greenfield-overview-panel', GreenfieldOverviewPanel);

// ═══════════════════════════════════════════════════════════════════
// 13. Greenfield Buckets — Skills #36-#40
// ═══════════════════════════════════════════════════════════════════
class GreenfieldBucketsPanel extends BasePanel {
  static skill = 'Skill #36-#40';
  static defaultTitle = 'Greenfield Buckets';
  constructor() { super(); this._refreshRate = 0; this._buckets = null; this._autoLoaded = false; }

  async fetchData() {
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      try {
        const res = await bnbApi.greenfieldBuckets(EX.CZ_WALLET);
        if (res && !res.error) { this._buckets = Array.isArray(res) ? res : (res.buckets || res.GfSpGetUserBucketsResponse?.Buckets || []); }
        else { this._buckets = { error: true }; }
      } catch { this._buckets = { error: true }; }
    }
    return { buckets: this._buckets };
  }

  renderContent(d) {
    let h = css('search', 'detail', 'info', 'examples');
    h += '<div class="p-search"><input class="p-input" id="gf-addr" placeholder="Greenfield account address (0x...)"><button class="p-btn" id="gf-btn">Browse</button></div>';
    h += examplesHTML([
      {label: 'CZ Wallet', val: EX.CZ_WALLET},
      {label: 'Binance Hot', val: EX.BINANCE_HOT},
    ], 'gf-addr');
    if (d?.buckets) {
      if (d.buckets.error) {
        h += '<div class="p-detail" style="color:var(--text-muted)">No buckets found or SP not reachable</div>';
      } else if (Array.isArray(d.buckets) && d.buckets.length > 0) {
        h += '<div class="p-info">';
        h += `<div style="font-weight:700;margin-bottom:6px">${d.buckets.length} Bucket(s)</div>`;
        for (const b of d.buckets) {
          const name = b.bucket_info?.bucket_name || b.BucketName || b.name || 'Unknown';
          h += `<div class="p-feat"><div class="p-feat-t">${_esc(String(name))}</div></div>`;
        }
        h += '</div>';
      } else {
        h += '<div class="p-detail" style="color:var(--text-muted)">No buckets found for this address</div>';
      }
    } else {
      h += '<div class="p-info" style="text-align:center;color:var(--text-muted)">Enter a Greenfield address to list storage buckets<div style="margin-top:8px;font-size:10px">Write operations (gnfd_create_bucket, gnfd_delete_bucket) require PRIVATE_KEY in MCP server</div></div>';
    }
    return h;
  }

  async _browse(addr) {
    if (!addr || addr.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['gf-addr'] = addr;
    try {
      const res = await bnbApi.greenfieldBuckets(addr);
      if (res && !res.error) { this._buckets = Array.isArray(res) ? res : (res.buckets || res.GfSpGetUserBucketsResponse?.Buckets || []); }
      else { this._buckets = { error: true }; }
    } catch { this._buckets = { error: true }; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    const btn = b.querySelector('#gf-btn'), inp = b.querySelector('#gf-addr');
    if (btn && inp) {
      btn.addEventListener('click', () => this._browse(inp.value.trim()));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._browse(inp.value.trim()); });
    }
    bindExamples(b, this, v => this._browse(v));
    restoreInputs(b, this);
  }
}
customElements.define('greenfield-buckets-panel', GreenfieldBucketsPanel);

// ═══════════════════════════════════════════════════════════════════
// 14. Greenfield Objects — Skills #41-#47
// ═══════════════════════════════════════════════════════════════════
class GreenfieldObjectsPanel extends BasePanel {
  static skill = 'Skill #41-#47';
  static defaultTitle = 'Greenfield Objects';
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return {}; }

  renderContent() {
    let h = css('info');
    const ops = [
      { name: 'gnfd_list_objects', desc: 'List all objects in a bucket', type: 'Read' },
      { name: 'gnfd_get_object_info', desc: 'Get object metadata and details', type: 'Read' },
      { name: 'gnfd_upload_object', desc: 'Upload a file to a bucket', type: 'Write' },
      { name: 'gnfd_create_file', desc: 'Create and upload a file (alternate)', type: 'Write' },
      { name: 'gnfd_download_object', desc: 'Download object to local disk', type: 'Read' },
      { name: 'gnfd_delete_object', desc: 'Remove an object from bucket', type: 'Write' },
      { name: 'gnfd_create_folder', desc: 'Create a folder in a bucket', type: 'Write' },
    ];
    h += '<div class="p-info">';
    for (const o of ops) {
      h += '<div class="p-feat">';
      h += `<div class="p-feat-t"><span class="p-mono">${o.name}</span> <span class="p-badge ${o.type === 'Write' ? 'p-badge-write' : 'p-badge-ok'}">${o.type}</span></div>`;
      h += `<div class="p-feat-d">${o.desc}</div>`;
      h += '</div>';
    }
    h += '</div>';
    return h;
  }
}
customElements.define('greenfield-objects-panel', GreenfieldObjectsPanel);

// ═══════════════════════════════════════════════════════════════════
// 15. Greenfield Payments — Skills #48-#54
// ═══════════════════════════════════════════════════════════════════
class GreenfieldPaymentsPanel extends BasePanel {
  static skill = 'Skill #48-#54';
  static defaultTitle = 'Greenfield Payments';
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return {}; }

  renderContent() {
    let h = css('info');
    const ops = [
      { name: 'gnfd_get_payment_accounts', desc: 'List payment accounts for an address', type: 'Read' },
      { name: 'gnfd_get_payment_account_info', desc: 'Payment account details', type: 'Read' },
      { name: 'gnfd_get_payment_balance', desc: 'Check payment account balance', type: 'Read' },
      { name: 'gnfd_create_payment', desc: 'Create new payment account', type: 'Write' },
      { name: 'gnfd_deposit_to_payment', desc: 'Deposit BNB for storage fees', type: 'Write' },
      { name: 'gnfd_withdraw_from_payment', desc: 'Withdraw BNB from payment', type: 'Write' },
      { name: 'gnfd_disable_refund', desc: 'Permanently disable refunds (irreversible)', type: 'Write' },
    ];
    h += '<div class="p-info">';
    h += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px">Greenfield storage billing — payment accounts fund bucket storage costs</div>';
    for (const o of ops) {
      h += '<div class="p-feat">';
      h += `<div class="p-feat-t"><span class="p-mono">${o.name}</span> <span class="p-badge ${o.type === 'Write' ? 'p-badge-write' : 'p-badge-ok'}">${o.type}</span></div>`;
      h += `<div class="p-feat-d">${o.desc}</div>`;
      h += '</div>';
    }
    h += '</div>';
    return h;
  }
}
customElements.define('greenfield-payments-panel', GreenfieldPaymentsPanel);

// ═══════════════════════════════════════════════════════════════════
// 16. MCP Prompts — Skills #55-#62
// ═══════════════════════════════════════════════════════════════════
class McpPromptsPanel extends BasePanel {
  static skill = 'Skill #55-#62';
  static defaultTitle = 'MCP Prompts';
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return {}; }

  renderContent() {
    let h = css('info');
    const prompts = [
      { name: 'analyze_block', desc: 'Detailed block analysis — transactions, gas, validator' },
      { name: 'analyze_transaction', desc: 'Transaction breakdown — status, value, gas, events' },
      { name: 'analyze_address', desc: 'Address investigation — balance, activity, type' },
      { name: 'interact_with_contract', desc: 'Smart contract interaction guidance with ABI' },
      { name: 'explain_evm_concept', desc: 'EVM concepts — gas, opcodes, ABI encoding' },
      { name: 'compare_networks', desc: 'Compare BSC, opBNB, Ethereum, other chains' },
      { name: 'analyze_token', desc: 'ERC20 or NFT analysis — supply, metadata, standards' },
      { name: 'how_to_register_mcp_as_erc8004_agent', desc: 'Guide to register MCP as ERC-8004 agent' },
    ];
    h += '<div class="p-info">';
    h += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px">Guided analysis prompts — contextual AI workflows for BNB Chain</div>';
    for (const p of prompts) {
      h += '<div class="p-feat">';
      h += `<div class="p-feat-t"><span class="p-mono">${p.name}</span></div>`;
      h += `<div class="p-feat-d">${p.desc}</div>`;
      h += '</div>';
    }
    h += '</div>';
    return h;
  }
}
customElements.define('mcp-prompts-panel', McpPromptsPanel);

// ═══════════════════════════════════════════════════════════════════
// 17. Market Pack (Community PR #2) — Skills #63-#80
// ═══════════════════════════════════════════════════════════════════

function _fmtPrice(p) {
  if (!p) return '—';
  const n = parseFloat(p);
  if (n >= 1000) return '$' + n.toLocaleString('en-US', {maximumFractionDigits:2});
  if (n >= 1) return '$' + n.toFixed(2);
  if (n >= 0.01) return '$' + n.toFixed(4);
  return '$' + n.toPrecision(3);
}

function _fmtVol(v) {
  if (!v) return '—';
  if (v >= 1e9) return '$' + (v/1e9).toFixed(1) + 'B';
  if (v >= 1e6) return '$' + (v/1e6).toFixed(1) + 'M';
  if (v >= 1e3) return '$' + (v/1e3).toFixed(1) + 'K';
  return '$' + v.toFixed(0);
}

function _fmtChg(v) {
  if (v === null || v === undefined) return '<span class="t-muted">—</span>';
  const n = parseFloat(v);
  const cls = n >= 0 ? 't-green' : 't-red';
  const sign = n >= 0 ? '+' : '';
  return `<span class="${cls}">${sign}${n.toFixed(2)}%</span>`;
}

class MarketPackPanel extends BasePanel {
  static skill = 'Skill #63-#80';
  static defaultTitle = 'Market Pack';
  constructor() { super(); this._refreshRate = 60000; this._tab = 'market'; this._searchResult = null; this._fmSearchResult = null; this._fmLoaded = false; }

  async fetchData() {
    const data = await bnbApi.marketTopTokens();
    // Auto-load meme tokens for Four.meme tab
    if (!this._fmLoaded) {
      this._fmLoaded = true;
      try {
        const res = await bnbApi.marketSearch('meme bsc');
        const bscPairs = (res?.pairs || []).filter(p => p.chainId === 'bsc');
        if (bscPairs.length > 0) this._fmSearchResult = bscPairs;
      } catch {}
    }
    return { pairs: data?.pairs || [] };
  }

  renderContent(d) {
    let h = css('tabs', 'search', 'cards', 'table', 'detail', 'info', 'examples');
    h += tabsHTML([{id:'market',label:'Live Market'},{id:'fourmeme',label:'Four.meme'},{id:'search',label:'Search'}], this._tab);

    if (this._tab === 'market') {
      // Deduplicate pairs by base token symbol, keep highest volume
      const seen = new Map();
      for (const p of (d?.pairs || [])) {
        const sym = p.baseToken?.symbol;
        if (!sym) continue;
        if (!seen.has(sym) || (p.volume?.h24 || 0) > (seen.get(sym).volume?.h24 || 0)) seen.set(sym, p);
      }
      const top = [...seen.values()].sort((a,b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0)).slice(0, 12);

      if (top.length > 0) {
        h += '<div style="font-size:9px;color:var(--text-muted);margin-bottom:6px">BSC DEX — Live prices from DexScreener (auto-refresh 60s)</div>';
        h += '<table class="p-table"><thead><tr><th>Token</th><th>DEX</th><th class="t-right">Price</th><th class="t-right">24h</th><th class="t-right">Volume</th><th class="t-right">Liquidity</th></tr></thead><tbody>';
        for (const p of top) {
          const name = p.baseToken?.name || '';
          const sym = p.baseToken?.symbol || '?';
          const dex = p.dexId || '?';
          const chg = p.priceChange?.h24;
          const addr = p.baseToken?.address || '';
          const logo = p.info?.imageUrl || (addr ? tokenLogo(addr) : '');
          h += '<tr>';
          h += `<td style="display:flex;align-items:center;gap:4px">`;
          if (logo) h += `<img src="${_esc(logo)}" width="14" height="14" style="border-radius:50%" onerror="this.style.display='none'">`;
          h += `<span class="t-sym">${_esc(sym)}</span> <span class="t-muted">${_esc(name.length > 12 ? name.slice(0,12)+'...' : name)}</span></td>`;
          h += `<td class="t-muted">${_esc(dex)}</td>`;
          h += `<td class="t-right t-mono">${_fmtPrice(p.priceUsd)}</td>`;
          h += `<td class="t-right">${_fmtChg(chg)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.volume?.h24)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.liquidity?.usd)}</td>`;
          h += '</tr>';
        }
        h += '</tbody></table>';
      } else {
        h += '<div class="p-info" style="text-align:center;color:var(--text-muted)">Loading BSC market data...</div>';
      }

      h += '<div style="margin-top:8px"></div>';
      h += '<div class="p-info">';
      h += '<div style="font-size:9px;color:var(--text-muted);margin-bottom:4px">Market Skills (Community PR #2 by brief-onchain)</div>';
      const skills = [
        'price_snapshot', 'top_movers', 'kline_brief', 'symbol_status',
        'funding_watch', 'open_interest_scan', 'liquidation_heatmap',
        'crowding_risk_scan', 'funding_basis_carry_scan', 'bsc_honeypot_check', 'bsc_rpc_fanout_check',
      ];
      h += '<div style="display:flex;flex-wrap:wrap;gap:3px">';
      for (const s of skills) h += `<span class="p-param">${s}</span>`;
      h += '</div></div>';

    } else if (this._tab === 'fourmeme') {
      // Show BSC meme tokens from the market data
      const memeKeywords = ['PEPE','DOGE','SHIB','FLOKI','BONK','MEME','BOME','WIF','BRETT','NEIRO','BABYDOGE','TURBO','MOG','WOJAK'];
      const memePairs = (d?.pairs || []).filter(p => {
        const sym = (p.baseToken?.symbol || '').toUpperCase();
        return memeKeywords.some(k => sym.includes(k));
      });
      // Also search for Four.meme tokens if we have search results
      const fmResult = this._fmSearchResult;

      h += '<div style="font-size:9px;color:var(--text-muted);margin-bottom:6px">Four.meme — BSC meme token launch platform. Agentic workflows for token creation, trading, and graduation.</div>';

      // Show Four.meme skill cards
      const fmSkills = [
        { name: 'Trade Playbook', desc: 'Quote-first buy/sell with slippage limits', badge: 'Agentic' },
        { name: 'Create Pipeline', desc: 'Two-step token creation with fee checks', badge: 'Agentic' },
        { name: 'Graduation Radar', desc: 'Bonding curve to Pancake migration', badge: 'Agentic' },
        { name: 'Mempool Sentinel', desc: 'Pending TX watchlists with events', badge: 'Agentic' },
        { name: 'One-Stop BSC', desc: 'Launch + buy + tweet + ERC-8004', badge: 'Agentic' },
        { name: 'Tax Token Guard', desc: 'Anti-sniping and fee-split checks', badge: 'Agentic' },
        { name: 'Agentic Ops', desc: 'Discover, score, confirm, execute', badge: 'Agentic' },
      ];
      h += '<div class="p-cards" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:4px;margin-bottom:8px">';
      for (const s of fmSkills) {
        h += `<div class="p-card" style="padding:6px;text-align:left"><div style="font-size:9px;font-weight:700;color:var(--text)">${s.name}</div><div style="font-size:8px;color:var(--text-muted);margin-top:2px">${s.desc}</div><div style="margin-top:3px"><span class="p-badge p-badge-write">${s.badge}</span></div></div>`;
      }
      h += '</div>';

      // Show meme tokens from market data if available
      if (fmResult && fmResult.length > 0) {
        h += '<div style="font-size:9px;color:var(--text-muted);margin:6px 0 4px">BSC Meme Tokens</div>';
        h += '<table class="p-table"><thead><tr><th>Token</th><th class="t-right">Price</th><th class="t-right">24h</th><th class="t-right">Volume</th><th class="t-right">Liq</th></tr></thead><tbody>';
        for (const p of fmResult.slice(0, 8)) {
          const chg = p.priceChange?.h24;
          h += '<tr>';
          h += `<td><span class="t-sym">${_esc(p.baseToken?.symbol || '?')}</span></td>`;
          h += `<td class="t-right t-mono">${_fmtPrice(p.priceUsd)}</td>`;
          h += `<td class="t-right">${_fmtChg(chg)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.volume?.h24)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.liquidity?.usd)}</td>`;
          h += '</tr>';
        }
        h += '</tbody></table>';
      } else if (memePairs.length > 0) {
        h += '<div style="font-size:9px;color:var(--text-muted);margin:6px 0 4px">BSC Meme Tokens (from market data)</div>';
        h += '<table class="p-table"><thead><tr><th>Token</th><th class="t-right">Price</th><th class="t-right">24h</th><th class="t-right">Volume</th></tr></thead><tbody>';
        for (const p of memePairs.slice(0, 6)) {
          h += '<tr>';
          h += `<td><span class="t-sym">${_esc(p.baseToken?.symbol || '?')}</span></td>`;
          h += `<td class="t-right t-mono">${_fmtPrice(p.priceUsd)}</td>`;
          h += `<td class="t-right">${_fmtChg(p.priceChange?.h24)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.volume?.h24)}</td>`;
          h += '</tr>';
        }
        h += '</tbody></table>';
      }

    } else {
      // Search tab
      h += '<div class="p-search"><input class="p-input" id="mp-search" placeholder="Token name or contract address (0x...)"><button class="p-btn" id="mp-btn">Search</button></div>';
      h += examplesHTML([
        {label: 'CAKE', val: EX.CAKE},
        {label: 'WBNB', val: EX.WBNB},
        {label: 'USDT', val: EX.USDT},
        {label: 'FLOKI', val: 'FLOKI'},
        {label: 'PEPE', val: 'PEPE'},
      ], 'mp-search');

      if (this._searchResult && this._searchResult.length > 0) {
        h += '<table class="p-table"><thead><tr><th>Pair</th><th>DEX</th><th class="t-right">Price</th><th class="t-right">24h</th><th class="t-right">Volume</th><th class="t-right">Liq</th></tr></thead><tbody>';
        for (const p of this._searchResult.slice(0, 15)) {
          const base = p.baseToken?.symbol || '?';
          const quote = p.quoteToken?.symbol || '?';
          const chain = p.chainId || '';
          if (chain !== 'bsc') continue;
          h += '<tr>';
          h += `<td><span class="t-sym">${_esc(base)}</span><span class="t-muted">/${_esc(quote)}</span></td>`;
          h += `<td class="t-muted">${_esc(p.dexId || '?')}</td>`;
          h += `<td class="t-right t-mono">${_fmtPrice(p.priceUsd)}</td>`;
          h += `<td class="t-right">${_fmtChg(p.priceChange?.h24)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.volume?.h24)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.liquidity?.usd)}</td>`;
          h += '</tr>';
        }
        h += '</tbody></table>';
      } else if (this._searchResult !== null) {
        h += '<div class="p-info" style="text-align:center;color:var(--text-muted)">No BSC pairs found</div>';
      }
    }
    return h;
  }

  async _searchToken(q) {
    if (!q) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['mp-search'] = q;
    try {
      // If it looks like an address, use token endpoint; otherwise search
      const isAddr = q.startsWith('0x') && q.length === 42;
      const res = isAddr ? await bnbApi.marketToken(q) : await bnbApi.marketSearch(q);
      this._searchResult = res?.pairs || [];
    } catch { this._searchResult = []; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent(this._data); this.afterRender(body); }
  }

  afterRender(b) {
    bindTabs(b, this);
    const btn = b.querySelector('#mp-btn'), inp = b.querySelector('#mp-search');
    if (btn && inp) {
      btn.addEventListener('click', () => this._searchToken(inp.value.trim()));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._searchToken(inp.value.trim()); });
    }
    bindExamples(b, this, v => this._searchToken(v));
    restoreInputs(b, this);
  }
}
customElements.define('market-pack-panel', MarketPackPanel);

// ═══════════════════════════════════════════════════════════════════
// 18. SyncX Cross-Posting (Community PR #1) — Skill #81
// ═══════════════════════════════════════════════════════════════════
class SyncxPanel extends BasePanel {
  static skill = 'Skill #81';
  static defaultTitle = 'SyncX Cross-Post';
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return {}; }

  renderContent() {
    let h = css('info');
    h += '<div class="p-info">';
    h += '<div style="font-weight:700;margin-bottom:6px;color:var(--accent)">SyncX — Cross-Platform Content Posting</div>';
    h += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:10px">Community PR #1 — One-stop crypto creator autopost workflow by SyncX2026</div>';
    const feats = [
      { t: 'Binance Square', d: 'Auto-post content to Binance Square with proper formatting' },
      { t: 'X / Twitter', d: 'Cross-post to X with thread support and media handling' },
      { t: 'Telegram', d: 'Optional channel broadcast with markdown formatting' },
      { t: 'Threads', d: 'Meta Threads cross-posting with image support' },
      { t: 'Farcaster', d: 'Decentralized social via Neynar API integration' },
      { t: 'Single Command', d: 'Sync the same post across all platforms in one action' },
    ];
    for (const f of feats) {
      h += `<div class="p-feat"><div class="p-feat-t">${f.t}</div><div class="p-feat-d">${f.d}</div></div>`;
    }
    h += '</div>';
    return h;
  }
}
customElements.define('syncx-panel', SyncxPanel);

// ═══════════════════════════════════════════════════════════════════
// 19. Whale Radar — Skill #82
// Scans latest blocks for high-value BNB transfers
// ═══════════════════════════════════════════════════════════════════
class WhaleRadarPanel extends BasePanel {
  static skill = 'Skill #82';
  static defaultTitle = 'Whale Radar';
  constructor() { super(); this._refreshRate = 15000; this._whales = []; }

  async fetchData() {
    const blkNum = await bnbApi.blockNumber();
    const num = blkNum?.result ? parseInt(blkNum.result, 16) : 0;
    if (num === 0) return { whales: [], blockNum: 0 };
    // Scan last 3 blocks for high-value TXs (full TX objects)
    const blocks = [];
    for (let i = 0; i < 3; i++) {
      const hex = '0x' + (num - i).toString(16);
      try { blocks.push(bnbApi.blockFull(hex)); } catch {}
    }
    const results = await Promise.allSettled(blocks);
    const whales = [];
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value?.result) continue;
      const b = r.value.result;
      const blockNum = parseInt(b.number, 16);
      const blockTime = new Date(parseInt(b.timestamp, 16) * 1000);
      const txs = b.transactions || [];
      for (const tx of txs) {
        if (typeof tx === 'string') continue; // need full TX objects
        const val = tx.value ? parseInt(tx.value, 16) / 1e18 : 0;
        if (val >= 0.5) {
          whales.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: val,
            block: blockNum,
            time: blockTime,
            isContract: tx.input && tx.input !== '0x' && tx.input.length > 2,
          });
        }
      }
    }
    // Sort by value descending
    whales.sort((a, b) => b.value - a.value);
    this._whales = whales.slice(0, 20);
    return { whales: this._whales, blockNum: num };
  }

  renderContent(d) {
    if (!d) return '<div class="panel-loading">Scanning blocks...</div>';
    let h = css('cards', 'table');
    h += '<div class="p-cards">';
    h += `<div class="p-card"><div class="p-label">Latest Block</div><div class="p-val">${_fmt(d.blockNum)}</div></div>`;
    h += `<div class="p-card"><div class="p-label">Whales Found</div><div class="p-val" style="color:var(--accent)">${d.whales.length}</div></div>`;
    const total = d.whales.reduce((s, w) => s + w.value, 0);
    h += `<div class="p-card"><div class="p-label">Total Value</div><div class="p-val" style="color:var(--green)">${total.toFixed(2)}</div><div class="p-sub">BNB</div></div>`;
    h += '</div>';
    h += '<div style="font-size:9px;color:var(--text-muted);margin-bottom:4px">Transfers over 0.5 BNB in last 3 blocks (auto-refresh 15s)</div>';
    if (d.whales.length > 0) {
      h += '<table class="p-table"><thead><tr><th>Value</th><th>From</th><th>To</th><th>Type</th><th>Block</th></tr></thead><tbody>';
      for (const w of d.whales) {
        const cls = w.value >= 10 ? 't-green' : w.value >= 2 ? 'style="color:var(--accent)"' : '';
        const valStr = w.value >= 1000 ? _fmt(Math.round(w.value)) : w.value.toFixed(4);
        h += '<tr>';
        h += `<td><span class="${w.value >= 10 ? 't-green' : ''}" style="font-weight:700;font-size:10px">${valStr} BNB</span></td>`;
        h += `<td class="t-mono t-muted">${shortAddr(w.from)}</td>`;
        h += `<td class="t-mono t-muted">${w.to ? shortAddr(w.to) : '<span class="p-badge p-badge-warn">Create</span>'}</td>`;
        h += `<td>${w.isContract ? '<span class="p-badge p-badge-warn">Contract</span>' : '<span class="p-badge p-badge-ok">Transfer</span>'}</td>`;
        h += `<td class="t-muted">${_fmt(w.block)}</td>`;
        h += '</tr>';
      }
      h += '</tbody></table>';
    } else {
      h += '<div class="p-info" style="text-align:center;color:var(--text-muted)">No whale transfers in recent blocks. Waiting for next scan...</div>';
    }
    return h;
  }
}
customElements.define('whale-radar-panel', WhaleRadarPanel);

// ═══════════════════════════════════════════════════════════════════
// 20. Token X-Ray — Skill #83
// Deep token analysis: on-chain + market data + logo
// ═══════════════════════════════════════════════════════════════════
class TokenXrayPanel extends BasePanel {
  static skill = 'Skill #83';
  static defaultTitle = 'Token X-Ray';
  constructor() { super(); this._refreshRate = 0; this._result = null; this._autoLoaded = false; }

  async fetchData() {
    if (!this._autoLoaded) {
      this._autoLoaded = true;
      await this._analyze(EX.CAKE);
    }
    return { result: this._result };
  }

  renderContent(d) {
    let h = css('search', 'cards', 'detail', 'table', 'examples');
    h += '<div class="p-search"><input class="p-input" id="xr-addr" placeholder="BSC token contract (0x...)"><button class="p-btn" id="xr-btn">X-Ray</button></div>';
    h += examplesHTML([
      {label: 'CAKE', val: EX.CAKE},
      {label: 'WBNB', val: EX.WBNB},
      {label: 'USDT', val: EX.USDT},
      {label: 'BUSD', val: EX.BUSD},
    ], 'xr-addr');

    if (d?.result) {
      const r = d.result;
      // Header with logo
      const logoUrl = r.logo;
      h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">';
      if (logoUrl) h += `<img src="${_esc(logoUrl)}" width="28" height="28" style="border-radius:50%;border:1px solid var(--border)" onerror="this.style.display='none'">`;
      h += `<div><div style="font-size:14px;font-weight:700;color:var(--text)">${_esc(r.name || 'Unknown')}</div>`;
      h += `<div style="font-size:10px;color:var(--accent)">${_esc(r.symbol || '?')} ${r.priceUsd ? '— ' + _fmtPrice(r.priceUsd) : ''}</div></div>`;
      h += '</div>';

      // Stats cards
      h += '<div class="p-cards">';
      h += `<div class="p-card"><div class="p-label">Price</div><div class="p-val" style="font-size:12px;color:var(--accent)">${r.priceUsd ? _fmtPrice(r.priceUsd) : '—'}</div></div>`;
      h += `<div class="p-card"><div class="p-label">24h Change</div><div class="p-val" style="font-size:12px">${r.change24h !== null ? _fmtChg(r.change24h) : '—'}</div></div>`;
      h += `<div class="p-card"><div class="p-label">Volume 24h</div><div class="p-val" style="font-size:12px">${r.volume24h ? _fmtVol(r.volume24h) : '—'}</div></div>`;
      h += '</div>';

      // On-chain details
      h += '<div class="p-detail">';
      h += `<div class="p-row"><span class="p-key">Contract</span><span class="p-value p-mono">${_esc(r.contract)}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Decimals</span><span class="p-value">${r.decimals ?? '—'}</span></div>`;
      if (r.totalSupply) h += `<div class="p-row"><span class="p-key">Total Supply</span><span class="p-value">${r.totalSupply}</span></div>`;
      h += `<div class="p-row"><span class="p-key">Contract Code</span><span class="p-value"><span class="p-badge ${r.isContract ? 'p-badge-ok' : 'p-badge-write'}">${r.isContract ? 'Verified' : 'No Code'}</span></span></div>`;
      if (r.liquidity) h += `<div class="p-row"><span class="p-key">Liquidity</span><span class="p-value" style="color:var(--green)">${_fmtVol(r.liquidity)}</span></div>`;
      if (r.pairCount) h += `<div class="p-row"><span class="p-key">DEX Pairs</span><span class="p-value">${r.pairCount}</span></div>`;
      if (r.dex) h += `<div class="p-row"><span class="p-key">Main DEX</span><span class="p-value">${_esc(r.dex)}</span></div>`;
      h += '</div>';

      // DEX pairs table if available
      if (r.pairs && r.pairs.length > 1) {
        h += '<div style="margin-top:6px;font-size:9px;color:var(--text-muted);margin-bottom:3px">DEX Pairs</div>';
        h += '<table class="p-table"><thead><tr><th>Pair</th><th>DEX</th><th class="t-right">Price</th><th class="t-right">Liq</th></tr></thead><tbody>';
        for (const p of r.pairs.slice(0, 5)) {
          h += '<tr>';
          h += `<td><span class="t-sym">${_esc(p.base)}</span><span class="t-muted">/${_esc(p.quote)}</span></td>`;
          h += `<td class="t-muted">${_esc(p.dex)}</td>`;
          h += `<td class="t-right t-mono">${_fmtPrice(p.price)}</td>`;
          h += `<td class="t-right t-mono">${_fmtVol(p.liq)}</td>`;
          h += '</tr>';
        }
        h += '</tbody></table>';
      }
    } else {
      h += '<div class="p-info" style="text-align:center;color:var(--text-muted)">Loading token analysis...</div>';
    }
    return h;
  }

  async _analyze(addr) {
    if (!addr || addr.length !== 42) return;
    if (!this._inputVals) this._inputVals = {};
    this._inputVals['xr-addr'] = addr;
    try {
      // Fetch on-chain + market data in parallel
      const [tokenInfo, codeRes, marketRes] = await Promise.allSettled([
        bnbApi.tokenInfo(addr),
        bnbApi.code(addr),
        bnbApi.marketToken(addr),
      ]);

      const token = tokenInfo.status === 'fulfilled' ? tokenInfo.value : null;
      const code = codeRes.status === 'fulfilled' ? codeRes.value : null;
      const market = marketRes.status === 'fulfilled' ? marketRes.value : null;

      const name = token ? decodeString(token.name?.result) : '';
      const symbol = token ? decodeString(token.symbol?.result) : '';
      const decimals = token?.decimals?.result ? parseInt(token.decimals.result, 16) : null;
      let totalSupply = '';
      if (token?.totalSupply?.result) {
        try {
          const raw = BigInt(token.totalSupply.result);
          const dec = decimals || 18;
          const whole = raw / BigInt(10 ** dec);
          totalSupply = whole.toLocaleString('en-US');
        } catch { totalSupply = ''; }
      }

      const isContract = code?.result && code.result !== '0x';
      const bscPairs = (market?.pairs || []).filter(p => p.chainId === 'bsc');
      const topPair = bscPairs[0];

      this._result = {
        contract: addr,
        name: topPair?.baseToken?.name || name || 'Unknown',
        symbol: topPair?.baseToken?.symbol || symbol || '?',
        decimals,
        totalSupply,
        isContract,
        priceUsd: topPair?.priceUsd || null,
        change24h: topPair?.priceChange?.h24 ?? null,
        volume24h: topPair?.volume?.h24 || null,
        liquidity: topPair?.liquidity?.usd || null,
        dex: topPair?.dexId || null,
        pairCount: bscPairs.length,
        logo: topPair?.info?.imageUrl || tokenLogo(addr),
        pairs: bscPairs.map(p => ({
          base: p.baseToken?.symbol || '?',
          quote: p.quoteToken?.symbol || '?',
          dex: p.dexId || '?',
          price: p.priceUsd,
          liq: p.liquidity?.usd,
        })),
      };
    } catch { this._result = null; }
    const body = this.querySelector('.panel-body');
    if (body) { body.innerHTML = this.renderContent({ result: this._result }); this.afterRender(body); }
  }

  afterRender(b) {
    const btn = b.querySelector('#xr-btn'), inp = b.querySelector('#xr-addr');
    if (btn && inp) {
      btn.addEventListener('click', () => this._analyze(inp.value.trim()));
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') this._analyze(inp.value.trim()); });
    }
    bindExamples(b, this, v => this._analyze(v));
    restoreInputs(b, this);
  }
}
customElements.define('token-xray-panel', TokenXrayPanel);

// ═══════════════════════════════════════════════════════════════════
// 21. BSC Live Feed — Skill #84
// Real-time block feed with visual gas bars
// ═══════════════════════════════════════════════════════════════════
class BscLiveFeedPanel extends BasePanel {
  static skill = 'Skill #84';
  static defaultTitle = 'BSC Live Feed';
  constructor() { super(); this._refreshRate = 3000; this._blocks = []; this._maxBlocks = 15; }

  async fetchData() {
    const blkNum = await bnbApi.blockNumber();
    const num = blkNum?.result ? parseInt(blkNum.result, 16) : 0;
    if (num === 0) return { blocks: [], latestBlock: 0 };

    // Fetch latest block if we don't have it
    if (this._blocks.length === 0 || this._blocks[0].number < num) {
      const hex = '0x' + num.toString(16);
      try {
        const res = await bnbApi.block(hex);
        if (res?.result) {
          const b = res.result;
          const blockData = {
            number: parseInt(b.number, 16),
            txCount: b.transactions?.length || 0,
            gasUsed: parseInt(b.gasUsed, 16),
            gasLimit: parseInt(b.gasLimit, 16),
            time: new Date(parseInt(b.timestamp, 16) * 1000),
            miner: b.miner,
            hash: b.hash,
          };
          // Don't add duplicates
          if (!this._blocks.find(x => x.number === blockData.number)) {
            this._blocks.unshift(blockData);
            if (this._blocks.length > this._maxBlocks) this._blocks.pop();
          }
        }
      } catch {}
    }
    const gas = await bnbApi.gasPrice();
    const gasPrice = gas?.result ? parseInt(gas.result, 16) / 1e9 : 0;
    return { blocks: this._blocks, latestBlock: num, gasPrice };
  }

  renderContent(d) {
    if (!d || !d.blocks) return '<div class="panel-loading">Connecting to BSC...</div>';
    let h = css('cards', 'table');
    h += '<div class="p-cards">';
    h += `<div class="p-card"><div class="p-label">Latest Block</div><div class="p-val">${_fmt(d.latestBlock)}</div></div>`;
    h += `<div class="p-card"><div class="p-label">Gas Price</div><div class="p-val">${d.gasPrice.toFixed(1)}</div><div class="p-sub">Gwei</div></div>`;
    const avgTx = d.blocks.length > 0 ? Math.round(d.blocks.reduce((s, b) => s + b.txCount, 0) / d.blocks.length) : 0;
    h += `<div class="p-card"><div class="p-label">Avg TXs/Block</div><div class="p-val">${avgTx}</div></div>`;
    h += '</div>';
    h += '<div style="font-size:9px;color:var(--text-muted);margin-bottom:4px">Live block stream (auto-refresh 3s)</div>';
    if (d.blocks.length > 0) {
      h += '<table class="p-table"><thead><tr><th>Block</th><th>Time</th><th class="t-right">TXs</th><th>Gas Usage</th><th>Validator</th></tr></thead><tbody>';
      for (const b of d.blocks) {
        const pct = b.gasLimit > 0 ? (b.gasUsed / b.gasLimit * 100) : 0;
        const barColor = pct > 80 ? '#f6465d' : pct > 50 ? '#f0b90b' : '#0ecb81';
        const barW = Math.min(pct, 100);
        h += '<tr>';
        h += `<td class="t-mono" style="color:var(--accent)">${_fmt(b.number)}</td>`;
        h += `<td class="t-muted">${b.time.toLocaleTimeString()}</td>`;
        h += `<td class="t-right" style="font-weight:700">${b.txCount}</td>`;
        h += `<td><div style="display:flex;align-items:center;gap:4px"><div style="width:60px;height:6px;background:var(--bg);border-radius:3px;overflow:hidden"><div style="width:${barW}%;height:100%;background:${barColor};border-radius:3px"></div></div><span class="t-muted" style="font-size:8px">${pct.toFixed(0)}%</span></div></td>`;
        h += `<td class="t-mono t-muted">${shortAddr(b.miner)}</td>`;
        h += '</tr>';
      }
      h += '</tbody></table>';
    }
    return h;
  }
}
customElements.define('bsc-live-feed-panel', BscLiveFeedPanel);

// ═══════════════════════════════════════════════════════════════════
// 22. Wallet Scanner — Mefai Skill: Multi-token portfolio scanner
// ═══════════════════════════════════════════════════════════════════
class WalletScannerPanel extends BasePanel {
  get panelTitle() { return 'Wallet Scanner'; }
  get skillLabel() { return 'MEFAI · PORTFOLIO'; }

  constructor() { super(); this._refreshRate = 0; }

  async fetchData() {
    if (!this._addr) return null;
    return bnbApi.mefaiWalletScanner(this._addr);
  }

  renderContent(d) {
    const addr = this._addr || '';
    let h = css('search', 'examples', 'cards', 'table', 'detail');
    h += '<div class="p-search"><input class="p-input" id="ws-addr" placeholder="Wallet address (0x...)" value="' + addr + '"><button class="p-btn" id="ws-go">Scan</button></div>';
    h += examplesHTML([
      { label: 'Binance Hot', val: EX.BINANCE_HOT },
      { label: 'CZ Wallet', val: EX.CZ_WALLET },
    ], 'ws-addr');

    if (!d) return h + '<div class="p-info" style="text-align:center;color:var(--text-muted)">Enter a BSC wallet address to scan portfolio</div>';

    // BNB balance card
    h += '<div class="p-cards p-cards-2">';
    h += `<div class="p-card"><div class="p-label">BNB Balance</div><div class="p-val">${(d.bnb?.balance || 0).toFixed(4)}</div><div class="p-sub">$${(d.bnb?.valueUsd || 0).toLocaleString(undefined, {maximumFractionDigits:2})}</div></div>`;
    const totalUsd = (d.bnb?.valueUsd || 0) + (d.tokens || []).reduce((s, t) => s + (t.valueUsd || 0), 0);
    h += `<div class="p-card"><div class="p-label">Total Value</div><div class="p-val c-accent">$${totalUsd.toLocaleString(undefined, {maximumFractionDigits:2})}</div><div class="p-sub">BNB @ $${(d.bnb?.priceUsd || 0).toFixed(2)}</div></div>`;
    h += '</div>';

    if (d.tokens && d.tokens.length > 0) {
      h += '<table class="p-table"><thead><tr><th>Token</th><th class="t-right">Balance</th><th class="t-right">Price</th><th class="t-right">Value</th></tr></thead><tbody>';
      for (const t of d.tokens) {
        const logo = tokenLogo(t.address);
        h += '<tr>';
        h += `<td><div style="display:flex;align-items:center;gap:4px"><img src="${logo}" width="14" height="14" style="border-radius:50%" onerror="this.style.display='none'"><span class="t-sym">${t.symbol || '?'}</span></div></td>`;
        h += `<td class="t-right t-mono">${Number(t.balance || 0).toLocaleString(undefined, {maximumFractionDigits:4})}</td>`;
        h += `<td class="t-right">$${Number(t.priceUsd || 0).toFixed(4)}</td>`;
        h += `<td class="t-right" style="font-weight:700">$${Number(t.valueUsd || 0).toLocaleString(undefined, {maximumFractionDigits:2})}</td>`;
        h += '</tr>';
      }
      h += '</tbody></table>';
    } else {
      h += '<div class="p-info" style="text-align:center;color:var(--text-muted);margin-top:8px">No top tokens found in this wallet</div>';
    }
    return h;
  }

  afterRender(body) {
    restoreInputs(body, this);
    const go = () => {
      const v = body.querySelector('#ws-addr')?.value?.trim();
      if (v && v.length === 42) {
        if (!this._inputVals) this._inputVals = {};
        this._inputVals['ws-addr'] = v;
        this._addr = v;
        this.refresh();
      }
    };
    body.querySelector('#ws-go')?.addEventListener('click', go);
    body.querySelector('#ws-addr')?.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    bindExamples(body, this, v => { this._addr = v; this.refresh(); });
  }
}
customElements.define('wallet-scanner-panel', WalletScannerPanel);

// ═══════════════════════════════════════════════════════════════════
// 23. Contract Audit — Mefai Skill: On-chain + market safety scoring
// ═══════════════════════════════════════════════════════════════════
class ContractAuditPanel extends BasePanel {
  get panelTitle() { return 'Contract Audit'; }
  get skillLabel() { return 'MEFAI · SAFETY'; }

  constructor() { super(); this._refreshRate = 0; }

  async fetchData() {
    if (!this._addr) return null;
    return bnbApi.mefaiContractAudit(this._addr);
  }

  renderContent(d) {
    const addr = this._addr || '';
    let h = css('search', 'examples', 'cards', 'detail');
    h += '<div class="p-search"><input class="p-input" id="ca-addr" placeholder="Token contract address (0x...)" value="' + addr + '"><button class="p-btn" id="ca-go">Audit</button></div>';
    h += examplesHTML([
      { label: 'CAKE', val: EX.CAKE },
      { label: 'WBNB', val: EX.WBNB },
      { label: 'USDT', val: EX.USDT },
    ], 'ca-addr');

    if (!d) return h + '<div class="p-info" style="text-align:center;color:var(--text-muted)">Enter a BSC token contract to run safety audit</div>';

    const gradeColors = { A: '#0ecb81', B: '#3cc68a', C: '#f0b90b', D: '#e8961e', F: '#f6465d' };
    const gc = gradeColors[d.grade] || '#848e9c';
    const logo = tokenLogo(d.address);

    // Header with score
    h += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">';
    h += `<div style="width:52px;height:52px;border-radius:50%;border:3px solid ${gc};display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-size:20px;font-weight:800;color:${gc}">${d.grade}</span></div>`;
    h += '<div style="flex:1">';
    h += `<div style="display:flex;align-items:center;gap:6px"><img src="${logo}" width="18" height="18" style="border-radius:50%" onerror="this.style.display='none'"><span style="font-weight:700;font-size:13px">${d.name || 'Unknown'}</span><span style="color:var(--accent);font-size:11px">${d.symbol || ''}</span></div>`;
    h += `<div style="font-size:10px;color:var(--text-muted);margin-top:2px">Score: <span style="color:${gc};font-weight:700">${d.score}/100</span> · ${d.pairCount || 0} pairs on ${d.dex || 'DEX'}</div>`;
    if (d.price) h += `<div style="font-size:10px;color:var(--text-muted)">Price: $${d.price} · Vol: $${Number(d.volume24h || 0).toLocaleString()} · Liq: $${Number(d.liquidity || 0).toLocaleString()}</div>`;
    h += '</div></div>';

    // Score bar
    h += `<div style="height:6px;background:var(--bg);border-radius:3px;margin-bottom:10px;overflow:hidden"><div style="width:${d.score}%;height:100%;background:${gc};border-radius:3px"></div></div>`;

    // Checks
    if (d.checks && d.checks.length > 0) {
      h += '<div class="p-detail">';
      for (const c of d.checks) {
        const icon = c.pass ? '&#10003;' : '&#10007;';
        const color = c.pass ? '#0ecb81' : '#f6465d';
        h += `<div class="p-row"><span class="p-key"><span style="color:${color};font-weight:700">${icon}</span> ${c.name}</span><span class="p-value">${c.detail || ''}</span></div>`;
      }
      h += '</div>';
    }

    // Burn info
    if (d.burnedPct > 0) {
      h += `<div style="margin-top:6px;font-size:9px;color:var(--text-muted)">Burned: ${d.burnedPct.toFixed(2)}% of total supply · Supply: ${Number(d.totalSupply || 0).toLocaleString()}</div>`;
    }

    return h;
  }

  afterRender(body) {
    restoreInputs(body, this);
    const go = () => {
      const v = body.querySelector('#ca-addr')?.value?.trim();
      if (v && v.length === 42) {
        if (!this._inputVals) this._inputVals = {};
        this._inputVals['ca-addr'] = v;
        this._addr = v;
        this.refresh();
      }
    };
    body.querySelector('#ca-go')?.addEventListener('click', go);
    body.querySelector('#ca-addr')?.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    bindExamples(body, this, v => { this._addr = v; this.refresh(); });
  }
}
customElements.define('contract-audit-panel', ContractAuditPanel);

// ═══════════════════════════════════════════════════════════════════
// 24. Liquidity Pulse — Mefai Skill: BSC token liquidity heatmap
// ═══════════════════════════════════════════════════════════════════
class LiquidityPulsePanel extends BasePanel {
  get panelTitle() { return 'Liquidity Pulse'; }
  get skillLabel() { return 'MEFAI · LIQUIDITY'; }

  constructor() { super(); this._refreshRate = 60000; }

  async fetchData() {
    return bnbApi.mefaiLiquidityPulse();
  }

  renderContent(d) {
    if (!d || !d.tokens) return '<div class="panel-loading">Loading liquidity data...</div>';
    let h = css('table', 'cards');
    const tokens = d.tokens;
    if (tokens.length === 0) return h + '<div class="panel-loading">No token data available</div>';

    // Summary cards
    const avgVL = tokens.reduce((s, t) => s + (t.vlRatio || 0), 0) / tokens.length;
    const totalVol = tokens.reduce((s, t) => s + (t.volume24h || 0), 0);
    const totalLiq = tokens.reduce((s, t) => s + (t.liquidity || 0), 0);
    h += '<div class="p-cards">';
    h += `<div class="p-card"><div class="p-label">Tokens Tracked</div><div class="p-val">${tokens.length}</div></div>`;
    h += `<div class="p-card"><div class="p-label">Total Volume 24h</div><div class="p-val">$${(totalVol/1e6).toFixed(1)}M</div></div>`;
    h += `<div class="p-card"><div class="p-label">Avg V/L Ratio</div><div class="p-val">${avgVL.toFixed(2)}</div></div>`;
    h += '</div>';

    h += '<div style="font-size:9px;color:var(--text-muted);margin-bottom:4px">BSC tokens ranked by volume/liquidity ratio (higher = more active trading)</div>';
    h += '<table class="p-table"><thead><tr><th>Token</th><th class="t-right">Price</th><th class="t-right">24h %</th><th class="t-right">Volume</th><th class="t-right">Liquidity</th><th class="t-right">V/L</th><th class="t-right">Buy/Sell</th></tr></thead><tbody>';
    for (const t of tokens) {
      const logo = tokenLogo(t.address);
      const chgClass = (t.change24h || 0) >= 0 ? 't-green' : 't-red';
      const chgSign = (t.change24h || 0) >= 0 ? '+' : '';
      const vlColor = (t.vlRatio || 0) > 1 ? '#0ecb81' : (t.vlRatio || 0) > 0.3 ? '#f0b90b' : '#f6465d';
      h += '<tr>';
      h += `<td><div style="display:flex;align-items:center;gap:4px"><img src="${logo}" width="14" height="14" style="border-radius:50%" onerror="this.style.display='none'"><span class="t-sym">${t.symbol}</span></div></td>`;
      h += `<td class="t-right t-mono">$${t.price}</td>`;
      h += `<td class="t-right ${chgClass}">${chgSign}${(t.change24h || 0).toFixed(2)}%</td>`;
      h += `<td class="t-right">$${(t.volume24h/1e3).toFixed(0)}K</td>`;
      h += `<td class="t-right">$${(t.liquidity/1e3).toFixed(0)}K</td>`;
      h += `<td class="t-right" style="color:${vlColor};font-weight:700">${(t.vlRatio || 0).toFixed(2)}</td>`;
      h += `<td class="t-right"><span class="t-green">${t.buys24h || 0}</span>/<span class="t-red">${t.sells24h || 0}</span></td>`;
      h += '</tr>';
    }
    h += '</tbody></table>';
    return h;
  }
}
customElements.define('liquidity-pulse-panel', LiquidityPulsePanel);

// ═══════════════════════════════════════════════════════════════════
// MEFAI EXCLUSIVE STYLES — Premium visual system
// ═══════════════════════════════════════════════════════════════════
const _MX = `
<style>
.mx-hero{background:linear-gradient(135deg,#1a1d23 0%,#0b0e11 100%);border:1px solid #2e3440;border-radius:8px;padding:14px;margin-bottom:10px;position:relative;overflow:hidden}
.mx-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent)}
.mx-hero-num{font-size:28px;font-weight:900;letter-spacing:-1px;line-height:1}
.mx-hero-label{font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
.mx-hero-sub{font-size:10px;color:var(--text-muted);margin-top:2px}
.mx-gauge{position:relative;width:64px;height:64px;flex-shrink:0}
.mx-gauge svg{transform:rotate(-90deg)}
.mx-gauge-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.mx-gauge-val{font-size:16px;font-weight:800;line-height:1}
.mx-gauge-sub{font-size:7px;color:var(--text-muted);text-transform:uppercase}
.mx-bar{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)}
.mx-bar:last-child{border-bottom:none}
.mx-bar-label{font-size:10px;color:var(--text-muted);min-width:70px}
.mx-bar-track{flex:1;height:8px;background:var(--bg);border-radius:4px;overflow:hidden;position:relative}
.mx-bar-fill{height:100%;border-radius:4px;transition:width .6s ease}
.mx-bar-val{font-size:10px;font-weight:700;min-width:50px;text-align:right}
.mx-vs{display:grid;grid-template-columns:1fr auto 1fr;gap:0;margin-bottom:10px}
.mx-vs-side{padding:10px;border-radius:8px}
.mx-vs-bsc{background:linear-gradient(135deg,rgba(14,203,129,.08),rgba(14,203,129,.02));border:1px solid rgba(14,203,129,.2)}
.mx-vs-eth{background:linear-gradient(135deg,rgba(98,126,234,.08),rgba(98,126,234,.02));border:1px solid rgba(98,126,234,.15)}
.mx-vs-mid{display:flex;align-items:center;justify-content:center;padding:0 6px;font-size:10px;font-weight:800;color:var(--text-muted)}
.mx-vs-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
.mx-vs-row{display:flex;justify-content:space-between;padding:3px 0;font-size:10px}
.mx-vs-k{color:var(--text-muted)}
.mx-vs-v{font-weight:700;font-family:monospace}
.mx-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.5px}
.mx-badge-win{background:linear-gradient(135deg,rgba(14,203,129,.2),rgba(14,203,129,.1));color:#0ecb81;border:1px solid rgba(14,203,129,.3)}
.mx-badge-hot{background:linear-gradient(135deg,rgba(240,185,11,.2),rgba(240,185,11,.1));color:#f0b90b;border:1px solid rgba(240,185,11,.3)}
.mx-badge-danger{background:linear-gradient(135deg,rgba(246,70,93,.2),rgba(246,70,93,.1));color:#f6465d;border:1px solid rgba(246,70,93,.3)}
.mx-pulse{display:inline-block;width:6px;height:6px;border-radius:50%;background:#0ecb81;animation:mx-blink 1.5s infinite}
@keyframes mx-blink{0%,100%{opacity:1}50%{opacity:.3}}
.mx-flow{display:flex;gap:6px;margin:8px 0}
.mx-flow-card{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px;text-align:center}
.mx-flow-dir{font-size:18px;font-weight:900;margin:2px 0}
.mx-whale-row{display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid var(--border);font-size:10px}
.mx-whale-row:last-child{border-bottom:none}
.mx-whale-val{font-weight:800;min-width:65px;text-align:right}
.mx-whale-addr{font-family:monospace;font-size:9px;color:var(--text-muted)}
.mx-whale-label{background:rgba(240,185,11,.12);color:#f0b90b;padding:1px 5px;border-radius:3px;font-size:8px;font-weight:700}
.mx-burn-ring{position:relative;width:80px;height:80px;flex-shrink:0}
.mx-burn-ring svg{transform:rotate(-90deg)}
.mx-burn-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
.mx-burn-val{font-size:11px;font-weight:900;line-height:1}
.mx-burn-sub{font-size:7px;color:var(--text-muted)}
.mx-fire{background:linear-gradient(180deg,rgba(240,185,11,.06),rgba(246,70,93,.04));border:1px solid rgba(240,185,11,.15);border-radius:8px;padding:12px}
.mx-fire::before{content:'';display:block;height:2px;background:linear-gradient(90deg,#f6465d,#f0b90b,#f6465d);border-radius:1px;margin-bottom:10px}
.mx-medal{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;font-size:9px;font-weight:900;margin-right:4px}
.mx-medal-1{background:linear-gradient(135deg,#ffd700,#ffaa00);color:#0b0e11}
.mx-medal-2{background:linear-gradient(135deg,#c0c0c0,#999);color:#0b0e11}
.mx-medal-3{background:linear-gradient(135deg,#cd7f32,#a0522d);color:#fff}
</style>`;

function _gauge(pct, color, val, sub, size = 64) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct, 100) / 100;
  return `<div class="mx-gauge" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--bg3)" stroke-width="5"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="${dash} ${circ}" stroke-linecap="round"/></svg>
    <div class="mx-gauge-label"><div class="mx-gauge-val" style="color:${color}">${val}</div><div class="mx-gauge-sub">${sub}</div></div></div>`;
}

// ═══════════════════════════════════════════════════════════════════
// 25. BNB Burn Engine — $12B+ burned, visual fire dashboard
// ═══════════════════════════════════════════════════════════════════
class BurnTrackerPanel extends BasePanel {
  get panelTitle() { return 'BNB Burn Engine'; }
  get skillLabel() { return 'MEFAI · DEFLATIONARY'; }
  constructor() { super(); this._refreshRate = 120000; }
  async fetchData() { return bnbApi.mefaiBurnTracker(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Loading burn data...</div>';
    let h = _MX + css('table');
    const bnb = d.bnb || {};
    const totalUsd = d.totalBurnedUsd || 0;

    // Hero: massive burn counter with gauge
    h += '<div class="mx-fire">';
    h += '<div style="display:flex;align-items:center;gap:16px">';
    const burnPctOfMax = Math.min((bnb.totalBurned || 0) / 200000000 * 100, 100);
    h += _gauge(burnPctOfMax, '#f0b90b', Math.round(burnPctOfMax) + '%', 'of 200M', 80);
    h += '<div style="flex:1">';
    h += '<div class="mx-hero-label">Total Value Burned</div>';
    h += `<div class="mx-hero-num" style="color:#f0b90b">$${_fmtM(totalUsd)}</div>`;
    h += `<div class="mx-hero-sub">${_fmt(Math.round(bnb.totalBurned||0))} BNB permanently removed from circulation</div>`;
    h += `<div class="mx-hero-sub">BNB Price: <span style="color:#0ecb81;font-weight:700">$${(bnb.priceUsd||0).toFixed(2)}</span></div>`;
    h += '</div></div>';

    // Burn sources
    h += '<div style="display:flex;gap:8px;margin-top:10px">';
    h += `<div class="mx-flow-card"><div class="mx-hero-label">Dead Address</div><div style="font-size:13px;font-weight:800;color:var(--text)">${_fmtShort(bnb.deadBalance||0)}</div><div style="font-size:8px;color:var(--text-muted)">BNB</div></div>`;
    h += `<div class="mx-flow-card"><div class="mx-hero-label">Zero Address</div><div style="font-size:13px;font-weight:800;color:var(--text)">${_fmtShort(bnb.zeroBalance||0)}</div><div style="font-size:8px;color:var(--text-muted)">BNB</div></div>`;
    h += `<div class="mx-flow-card" style="border-color:rgba(240,185,11,.3)"><div class="mx-hero-label">BNB Burned USD</div><div style="font-size:13px;font-weight:800;color:#f0b90b">$${_fmtM(bnb.burnedValueUsd||0)}</div></div>`;
    h += '</div></div>';

    // Token burns with visual burn bars
    const tokens = (d.tokens || []).filter(t => t.burned > 0);
    if (tokens.length > 0) {
      h += '<div style="margin-top:10px">';
      for (const t of tokens) {
        const logo = tokenLogo(t.address);
        const pct = Math.min(t.burnedPct, 100);
        const barColor = pct > 50 ? '#f6465d' : pct > 10 ? '#f0b90b' : '#0ecb81';
        h += '<div class="mx-bar">';
        h += `<div style="display:flex;align-items:center;gap:4px;min-width:55px"><img src="${logo}" width="14" height="14" style="border-radius:50%" onerror="this.style.display='none'"><span style="font-weight:700;font-size:10px;color:var(--accent)">${t.symbol}</span></div>`;
        h += `<div class="mx-bar-track"><div class="mx-bar-fill" style="width:${pct}%;background:${barColor}"></div></div>`;
        h += `<div class="mx-bar-val" style="color:${barColor}">${pct.toFixed(1)}%</div>`;
        h += `<div style="min-width:60px;text-align:right;font-size:9px;color:var(--text-muted)">$${_fmtM(t.burnedValueUsd)}</div>`;
        h += '</div>';
      }
      h += '</div>';
    }
    return h;
  }
}
customElements.define('burn-tracker-panel', BurnTrackerPanel);

// ═══════════════════════════════════════════════════════════════════
// 26. BSC vs ETH Showdown — Real-time superiority proof
// ═══════════════════════════════════════════════════════════════════
class BscSupremacyPanel extends BasePanel {
  get panelTitle() { return 'BSC vs ETH Showdown'; }
  get skillLabel() { return 'MEFAI · SUPREMACY'; }
  constructor() { super(); this._refreshRate = 15000; }
  async fetchData() { return bnbApi.mefaiBscSupremacy(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Comparing chains...</div>';
    let h = _MX;
    const bsc = d.bsc || {};
    const eth = d.eth || {};
    const adv = d.advantage || {};

    // Advantage hero
    h += '<div class="mx-hero" style="text-align:center">';
    h += '<div class="mx-hero-label">BSC Advantage</div>';
    h += '<div style="display:flex;justify-content:center;gap:16px;margin-top:6px">';
    h += `<div><div class="mx-hero-num" style="color:#0ecb81">${adv.speedMultiplier}x</div><div class="mx-hero-sub">FASTER</div></div>`;
    h += `<div><div class="mx-hero-num" style="color:#0ecb81">${adv.tpsMultiplier}x</div><div class="mx-hero-sub">MORE TPS</div></div>`;
    h += `<div><div class="mx-hero-num" style="color:#0ecb81">${adv.costMultiplier}x</div><div class="mx-hero-sub">CHEAPER</div></div>`;
    h += '</div></div>';

    // Side by side comparison
    h += '<div class="mx-vs">';
    // BSC side
    h += '<div class="mx-vs-side mx-vs-bsc">';
    h += '<div class="mx-vs-title" style="color:#0ecb81"><span class="mx-pulse"></span> BNB Smart Chain</div>';
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Block Time</span><span class="mx-vs-v" style="color:#0ecb81">${bsc.blockTime}s</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">TPS</span><span class="mx-vs-v" style="color:#0ecb81">${bsc.tps}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Gas</span><span class="mx-vs-v" style="color:#0ecb81">${bsc.gasGwei} Gwei</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Transfer</span><span class="mx-vs-v" style="color:#0ecb81">$${bsc.transferCost}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Swap</span><span class="mx-vs-v" style="color:#0ecb81">$${bsc.swapCost}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Finality</span><span class="mx-vs-v" style="color:#0ecb81;font-size:8px">${bsc.finality}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">BNB</span><span class="mx-vs-v" style="color:#f0b90b">$${bsc.nativePrice?.toFixed(2)}</span></div>`;
    h += '</div>';
    // VS
    h += '<div class="mx-vs-mid">VS</div>';
    // ETH side
    h += '<div class="mx-vs-side mx-vs-eth">';
    h += '<div class="mx-vs-title" style="color:#627eea">Ethereum</div>';
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Block Time</span><span class="mx-vs-v" style="color:#627eea">${eth.blockTime}s</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">TPS</span><span class="mx-vs-v" style="color:#627eea">${eth.tps}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Gas</span><span class="mx-vs-v" style="color:#627eea">${eth.gasGwei} Gwei</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Transfer</span><span class="mx-vs-v" style="color:#f6465d">$${eth.transferCost}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Swap</span><span class="mx-vs-v" style="color:#f6465d">$${eth.swapCost}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">Finality</span><span class="mx-vs-v" style="color:#627eea;font-size:8px">${eth.finality}</span></div>`;
    h += `<div class="mx-vs-row"><span class="mx-vs-k">ETH</span><span class="mx-vs-v" style="color:#627eea">$${eth.nativePrice?.toFixed(2)}</span></div>`;
    h += '</div>';
    h += '</div>';

    // Savings callout
    h += '<div style="background:rgba(14,203,129,.06);border:1px solid rgba(14,203,129,.15);border-radius:6px;padding:8px;text-align:center;font-size:10px">';
    h += `<span style="color:var(--text-muted)">You save</span> <span style="color:#0ecb81;font-weight:800;font-size:12px">$${adv.swapSavings?.toFixed(4)}</span> <span style="color:var(--text-muted)">per swap on BSC vs Ethereum</span>`;
    h += '</div>';
    return h;
  }
}
customElements.define('bsc-supremacy-panel', BscSupremacyPanel);

// ═══════════════════════════════════════════════════════════════════
// 27. Smart Money Radar — Live whale tracking with flow analysis
// ═══════════════════════════════════════════════════════════════════
class SmartMoneyPanel extends BasePanel {
  get panelTitle() { return 'Smart Money Radar'; }
  get skillLabel() { return 'MEFAI · WHALE INTEL'; }
  constructor() { super(); this._refreshRate = 15000; }
  async fetchData() { return bnbApi.mefaiSmartMoney(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Scanning whale activity...</div>';
    let h = _MX;

    // Hero: flow direction
    const flowColor = d.flowDirection === 'accumulation' ? '#0ecb81' : d.flowDirection === 'distribution' ? '#f6465d' : '#f0b90b';
    const flowText = d.flowDirection === 'accumulation' ? 'ACCUMULATION' : d.flowDirection === 'distribution' ? 'DISTRIBUTION' : 'NEUTRAL';
    h += '<div class="mx-hero">';
    h += '<div style="display:flex;align-items:center;justify-content:space-between">';
    h += '<div>';
    h += `<div class="mx-hero-label"><span class="mx-pulse"></span> Live Flow Direction</div>`;
    h += `<div class="mx-hero-num" style="color:${flowColor}">${flowText}</div>`;
    h += `<div class="mx-hero-sub">Net: ${d.netFlow >= 0 ? '+' : ''}${_fmt(d.netFlow)} BNB ($${_fmtM(Math.abs(d.netFlowUsd))})</div>`;
    h += '</div>';
    h += _gauge(d.whaleCount > 0 ? Math.min(d.whaleCount * 4, 100) : 5, flowColor, d.whaleCount, 'WHALES', 56);
    h += '</div></div>';

    // Flow cards
    h += '<div class="mx-flow">';
    h += `<div class="mx-flow-card"><div class="mx-hero-label">Inflow</div><div class="mx-flow-dir" style="color:#0ecb81">${_fmtShort(d.inflow)}</div><div style="font-size:8px;color:var(--text-muted)">BNB to known wallets</div></div>`;
    h += `<div class="mx-flow-card"><div class="mx-hero-label">Outflow</div><div class="mx-flow-dir" style="color:#f6465d">${_fmtShort(d.outflow)}</div><div style="font-size:8px;color:var(--text-muted)">BNB from known wallets</div></div>`;
    h += `<div class="mx-flow-card"><div class="mx-hero-label">Total Volume</div><div class="mx-flow-dir" style="color:var(--accent)">${_fmtShort(d.totalVolume)}</div><div style="font-size:8px;color:var(--text-muted)">$${_fmtM(d.totalVolumeUsd)}</div></div>`;
    h += '</div>';

    // Whale transactions
    const whales = d.whales || [];
    if (whales.length > 0) {
      h += `<div style="font-size:9px;color:var(--text-muted);margin-bottom:4px">${whales.length} BNB transfers in last ${d.blocksScanned} blocks</div>`;
      for (const w of whales.slice(0, 12)) {
        const valColor = w.value >= 100 ? '#f6465d' : w.value >= 50 ? '#f0b90b' : '#0ecb81';
        h += '<div class="mx-whale-row">';
        h += `<div class="mx-whale-val" style="color:${valColor}">${w.value.toLocaleString()} BNB</div>`;
        h += '<div style="flex:1;min-width:0">';
        if (w.fromLabel) h += `<span class="mx-whale-label">${w.fromLabel}</span> `;
        else h += `<span class="mx-whale-addr">${shortAddr(w.from)}</span> `;
        h += `<span style="color:var(--text-muted);font-size:9px">-></span> `;
        if (w.toLabel) h += `<span class="mx-whale-label">${w.toLabel}</span>`;
        else h += `<span class="mx-whale-addr">${shortAddr(w.to)}</span>`;
        h += '</div>';
        h += `<div style="font-size:8px;color:var(--text-muted)">$${_fmtM(w.valueUsd)}</div>`;
        h += '</div>';
      }
    } else {
      h += '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:8px">No whale transactions in recent blocks</div>';
    }
    return h;
  }
}
customElements.define('smart-money-panel', SmartMoneyPanel);

// ═══════════════════════════════════════════════════════════════════
// 28. PancakeSwap Arena — Enhanced with visual volume bars
// ═══════════════════════════════════════════════════════════════════
class PancakeswapArenaPanel extends BasePanel {
  get panelTitle() { return 'PancakeSwap Arena'; }
  get skillLabel() { return 'MEFAI · PANCAKESWAP'; }
  constructor() { super(); this._refreshRate = 30000; }
  async fetchData() { return bnbApi.mefaiPancakeswapArena(); }
  renderContent(d) {
    if (!d || !d.pairs) return '<div class="panel-loading">Loading PancakeSwap data...</div>';
    let h = _MX + css('table');
    const pairs = d.pairs || [];
    if (pairs.length === 0) return h + '<div class="panel-loading">No pairs found</div>';

    const totalVol = pairs.reduce((s, p) => s + (p.volume24h || 0), 0);
    const totalLiq = pairs.reduce((s, p) => s + (p.liquidity || 0), 0);
    const maxVol = Math.max(...pairs.map(p => p.volume24h || 0));

    // Hero
    h += '<div class="mx-hero" style="display:flex;justify-content:space-around;text-align:center">';
    h += `<div><div class="mx-hero-label">Active Pairs</div><div class="mx-hero-num" style="color:var(--accent)">${pairs.length}</div></div>`;
    h += `<div><div class="mx-hero-label">24h Volume</div><div class="mx-hero-num" style="color:#0ecb81">$${_fmtM(totalVol)}</div></div>`;
    h += `<div><div class="mx-hero-label">Liquidity</div><div class="mx-hero-num" style="color:var(--text)">$${_fmtM(totalLiq)}</div></div>`;
    h += '</div>';

    h += '<table class="p-table"><thead><tr><th>Pair</th><th class="t-right">Price</th><th class="t-right">5m</th><th class="t-right">1h</th><th class="t-right">24h</th><th>Volume</th><th class="t-right">Txns</th></tr></thead><tbody>';
    for (const p of pairs) {
      const logo = tokenLogo(p.baseAddress);
      const c5 = _chgClass(p.change5m);
      const c1 = _chgClass(p.change1h);
      const c24 = _chgClass(p.change24h);
      const volPct = maxVol > 0 ? (p.volume24h / maxVol * 100) : 0;
      h += '<tr>';
      h += `<td><div style="display:flex;align-items:center;gap:4px"><img src="${logo}" width="14" height="14" style="border-radius:50%" onerror="this.style.display='none'"><span class="t-sym">${p.pair}</span></div></td>`;
      h += `<td class="t-right t-mono">$${p.price || '?'}</td>`;
      h += `<td class="t-right ${c5}">${_chgFmt(p.change5m)}</td>`;
      h += `<td class="t-right ${c1}">${_chgFmt(p.change1h)}</td>`;
      h += `<td class="t-right ${c24}">${_chgFmt(p.change24h)}</td>`;
      h += `<td><div style="display:flex;align-items:center;gap:4px"><div style="width:40px;height:6px;background:var(--bg);border-radius:3px;overflow:hidden"><div style="width:${volPct}%;height:100%;background:#0ecb81;border-radius:3px"></div></div><span style="font-size:9px;font-weight:600">$${_fmtM(p.volume24h)}</span></div></td>`;
      h += `<td class="t-right"><span class="t-green">${p.buys24h}</span>/<span class="t-red">${p.sells24h}</span></td>`;
      h += '</tr>';
    }
    h += '</tbody></table>';
    return h;
  }
}
customElements.define('pancakeswap-arena-panel', PancakeswapArenaPanel);

// ═══════════════════════════════════════════════════════════════════
// 29. DeFi Leaderboard — With medals and visual dominance bars
// ═══════════════════════════════════════════════════════════════════
class DefiLeaderboardPanel extends BasePanel {
  get panelTitle() { return 'DeFi Leaderboard'; }
  get skillLabel() { return 'MEFAI · DEFI'; }
  constructor() { super(); this._refreshRate = 60000; }
  async fetchData() { return bnbApi.mefaiDefiLeaderboard(); }
  renderContent(d) {
    if (!d || !d.tokens) return '<div class="panel-loading">Loading DeFi data...</div>';
    let h = _MX;
    const tokens = d.tokens || [];
    if (tokens.length === 0) return h + '<div class="panel-loading">No DeFi data</div>';

    const totalVol = tokens.reduce((s, t) => s + (t.totalVolume24h || 0), 0);
    const totalLiq = tokens.reduce((s, t) => s + (t.totalLiquidity || 0), 0);
    const maxVol = Math.max(...tokens.map(t => t.totalVolume24h || 0));

    h += '<div class="mx-hero" style="display:flex;justify-content:space-around;text-align:center">';
    h += `<div><div class="mx-hero-label">Protocols</div><div class="mx-hero-num" style="color:var(--accent)">${tokens.length}</div></div>`;
    h += `<div><div class="mx-hero-label">24h Volume</div><div class="mx-hero-num" style="color:#0ecb81">$${_fmtM(totalVol)}</div></div>`;
    h += `<div><div class="mx-hero-label">Liquidity</div><div class="mx-hero-num" style="color:var(--text)">$${_fmtM(totalLiq)}</div></div>`;
    h += '</div>';

    for (const [i, t] of tokens.entries()) {
      const logo = tokenLogo(t.address);
      const volPct = maxVol > 0 ? (t.totalVolume24h / maxVol * 100) : 0;
      const medal = i === 0 ? '<span class="mx-medal mx-medal-1">1</span>' : i === 1 ? '<span class="mx-medal mx-medal-2">2</span>' : i === 2 ? '<span class="mx-medal mx-medal-3">3</span>' : `<span style="display:inline-flex;width:18px;justify-content:center;margin-right:4px;font-size:9px;color:var(--text-muted)">${i+1}</span>`;
      const c24 = _chgClass(t.change24h);

      h += '<div style="display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid var(--border)">';
      h += medal;
      h += `<img src="${logo}" width="18" height="18" style="border-radius:50%;flex-shrink:0" onerror="this.style.display='none'">`;
      h += '<div style="flex:1;min-width:0">';
      h += `<div style="display:flex;justify-content:space-between"><span style="font-weight:700;font-size:11px;color:var(--accent)">${t.symbol}</span><span class="${c24}" style="font-size:10px">${_chgFmt(t.change24h)}</span></div>`;
      h += `<div style="display:flex;align-items:center;gap:4px;margin-top:2px"><div style="flex:1;height:6px;background:var(--bg);border-radius:3px;overflow:hidden"><div style="width:${volPct}%;height:100%;background:linear-gradient(90deg,#0ecb81,#f0b90b);border-radius:3px"></div></div><span style="font-size:9px;font-weight:600;color:var(--text)">$${_fmtM(t.totalVolume24h)}</span></div>`;
      h += `<div style="font-size:8px;color:var(--text-muted)">${t.pairCount} pairs · $${_fmtM(t.totalLiquidity)} liq · <span class="t-green">${t.totalBuys}</span>/<span class="t-red">${t.totalSells}</span></div>`;
      h += '</div></div>';
    }
    return h;
  }
}
customElements.define('defi-leaderboard-panel', DefiLeaderboardPanel);

// ═══════════════════════════════════════════════════════════════════
// 30. Mefai Hub — Tab-based skill selector (SuperBSC style)
// ═══════════════════════════════════════════════════════════════════
const _MEFAI_SKILLS = [
  { id: 'burn',       label: 'Burn Engine',    tag: 'burn-tracker-panel' },
  { id: 'supremacy',  label: 'BSC vs ETH',     tag: 'bsc-supremacy-panel' },
  { id: 'smart',      label: 'Smart Money',    tag: 'smart-money-panel' },
  { id: 'pancake',    label: 'PancakeSwap',    tag: 'pancakeswap-arena-panel' },
  { id: 'defi',       label: 'DeFi Board',     tag: 'defi-leaderboard-panel' },
  { id: 'wallet',     label: 'Wallet Scanner', tag: 'wallet-scanner-panel' },
  { id: 'audit',      label: 'Contract Audit', tag: 'contract-audit-panel' },
  { id: 'pulse',      label: 'Liquidity Pulse',tag: 'liquidity-pulse-panel' },
  { id: 'txdecode',   label: 'TX Decoder',     tag: 'tx-decoder-panel' },
  { id: 'xray',       label: 'Contract X-Ray', tag: 'contract-xray-panel' },
  { id: 'approvals',  label: 'Approvals',      tag: 'approval-scanner-panel' },
  { id: 'autopsy',    label: 'Block Autopsy',  tag: 'block-autopsy-panel' },
  { id: 'gascalc',    label: 'Gas Calculator', tag: 'gas-calculator-panel' },
  { id: 'battle',     label: 'Token Battle',   tag: 'token-battle-panel' },
  { id: 'pairdeep',   label: 'Pair Analytics', tag: 'pair-analytics-panel' },
  { id: 'tokenflow',  label: 'Token Flow',     tag: 'token-flow-panel' },
  { id: 'yield',      label: 'Yield Finder',   tag: 'yield-finder-panel' },
  { id: 'risk',       label: 'Risk Radar',     tag: 'risk-radar-panel' },
  { id: 'sniper',     label: 'Sniper Detector',  tag: 'sniper-detector-panel' },
  { id: 'cluster',    label: 'Wallet Cluster',    tag: 'wallet-cluster-panel' },
  { id: 'honeypot',   label: 'Honeypot Check',    tag: 'honeypot-check-panel' },
  { id: 'validators', label: 'Validators',        tag: 'validator-map-panel' },
  { id: 'arb',        label: 'DEX Arbitrage',     tag: 'dex-arb-panel' },
  { id: 'birth',      label: 'Token Birth',       tag: 'token-birth-panel' },
  { id: 'netpulse',   label: 'Network Pulse',     tag: 'network-pulse-panel' },
  { id: 'copytrade',  label: 'Copy Trade',        tag: 'copy-trade-panel' },
  { id: 'upgrade',    label: 'Upgrade Monitor',   tag: 'upgrade-monitor-panel' },
  { id: 'heatmap',    label: 'Portfolio Heatmap',  tag: 'portfolio-heatmap-panel' },
];

class MefaiHubPanel extends BasePanel {
  get panelTitle() { return 'Mefai Skills'; }
  get skillLabel() { return 'MEFAI · HUB'; }
  constructor() {
    super();
    this._refreshRate = 0;
    this._activeSkill = 'burn';
    this._childPanel = null;
  }

  async fetchData() { return {}; }

  renderContent() {
    let h = `<style>
.mh-tabs{display:flex;gap:3px;flex-wrap:wrap;padding:0 0 8px 0;border-bottom:1px solid var(--border);margin-bottom:8px}
.mh-tab{padding:5px 12px;font-size:10px;font-weight:700;border:1px solid var(--border);border-radius:5px;background:var(--bg);color:var(--text-muted);cursor:pointer;transition:all .15s;text-transform:uppercase;letter-spacing:.5px;box-shadow:0 2px 0 var(--border)}
.mh-tab:hover{color:var(--text);border-color:var(--accent);transform:translateY(-1px);box-shadow:0 3px 0 var(--border)}
.mh-tab:active{transform:translateY(1px);box-shadow:none}
.mh-tab.active{background:linear-gradient(135deg,#f0b90b,#d4a50a);color:#0b0e11;border-color:#f0b90b;box-shadow:0 2px 0 #c99700}
.mh-content{flex:1;overflow:auto}
</style>`;
    h += '<div class="mh-tabs">';
    for (const s of _MEFAI_SKILLS) {
      h += `<button class="mh-tab ${s.id === this._activeSkill ? 'active' : ''}" data-skill="${s.id}">${s.label}</button>`;
    }
    h += '</div>';
    h += '<div class="mh-content" id="mh-slot"></div>';
    return h;
  }

  afterRender(body) {
    // Bind tabs
    body.querySelectorAll('.mh-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this._activeSkill = btn.dataset.skill;
        // Update tab visual
        body.querySelectorAll('.mh-tab').forEach(b => b.classList.toggle('active', b.dataset.skill === this._activeSkill));
        this._mountChild(body);
      });
    });
    this._mountChild(body);
  }

  _mountChild(body) {
    const slot = body.querySelector('#mh-slot');
    if (!slot) return;
    // Remove old child
    if (this._childPanel && this._childPanel.parentNode) {
      if (this._childPanel._timer) clearInterval(this._childPanel._timer);
      this._childPanel.remove();
    }
    const skill = _MEFAI_SKILLS.find(s => s.id === this._activeSkill);
    if (!skill) return;
    slot.innerHTML = '';
    const el = document.createElement(skill.tag);
    // Override panel's own border/header styling to fit inside hub
    el.style.border = 'none';
    el.style.background = 'transparent';
    slot.appendChild(el);
    this._childPanel = el;
  }

  disconnectedCallback() {
    if (this._childPanel) {
      if (this._childPanel._timer) clearInterval(this._childPanel._timer);
    }
    super.disconnectedCallback && super.disconnectedCallback();
  }
}
customElements.define('mefai-hub-panel', MefaiHubPanel);

// ── Shared formatting helpers ──────────────────────────────────
function _fmt(n) { return n ? n.toLocaleString() : '0'; }
function _fmtM(n) { if (!n) return '0'; if (n >= 1e9) return (n/1e9).toFixed(2)+'B'; if (n >= 1e6) return (n/1e6).toFixed(2)+'M'; if (n >= 1e3) return (n/1e3).toFixed(1)+'K'; return n.toFixed(2); }
function _fmtShort(n) { if (!n) return '0'; if (n >= 1e9) return (n/1e9).toFixed(1)+'B'; if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; if (n >= 1e3) return (n/1e3).toFixed(0)+'K'; return String(Math.round(n)); }
function _chgClass(v) { return v == null ? 't-muted' : v >= 0 ? 't-green' : 't-red'; }
function _chgFmt(v) { if (v == null) return '-'; return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; }

// ═══════════════════════════════════════════════════════════════════
// BATCH 3: 10 Professional Developer Tools
// ═══════════════════════════════════════════════════════════════════

// Helper: search panel template (reusable)
function _searchPanel(id, placeholder, btnText, exArr, exInputId) {
  let h = css('search', 'examples');
  h += `<div class="p-search"><input class="p-input" id="${id}" placeholder="${placeholder}"><button class="p-btn" id="${id}-go">${btnText}</button></div>`;
  if (exArr && exArr.length) h += examplesHTML(exArr, id);
  return h;
}
function _bindSearch(body, panel, inputId, fn) {
  const go = () => { const v = body.querySelector('#'+inputId)?.value?.trim(); if (v) { if(!panel._inputVals) panel._inputVals={}; panel._inputVals[inputId]=v; panel._q=v; fn(v); }};
  body.querySelector('#'+inputId+'-go')?.addEventListener('click', go);
  body.querySelector('#'+inputId)?.addEventListener('keydown', e => { if(e.key==='Enter') go(); });
  restoreInputs(body, panel);
  bindExamples(body, panel, v => { panel._q=v; fn(v); });
}

// 31. TX Decoder
class TxDecoderPanel extends BasePanel {
  get panelTitle() { return 'TX Decoder'; }
  get skillLabel() { return 'MEFAI · DECODE'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiTxDecoder(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('txd-hash', 'Transaction hash (0x...)', 'Decode', [
      { label: 'Latest Block TX', val: '__latest_tx__' },
    ], 'txd-hash');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Paste any BSC transaction hash to decode function calls, events, and transfers</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    // Status + Gas
    const ok = d.status === 'success' || d.status === '0x1' || d.status === true;
    h += '<div class="mx-hero">';
    h += `<div style="display:flex;justify-content:space-between;align-items:center"><span class="mx-badge ${ok?'mx-badge-win':'mx-badge-danger'}">${ok?'SUCCESS':'FAILED'}</span>`;
    h += `<span style="font-size:10px;color:var(--text-muted)">Block ${_fmt(d.blockNumber || 0)}</span></div>`;
    h += `<div style="margin-top:6px;font-size:10px"><span style="color:var(--text-muted)">Function:</span> <span style="color:var(--accent);font-weight:700">${d.function || d.functionName || d.functionSelector || 'Unknown'}</span></div>`;
    h += `<div style="font-size:9px;color:var(--text-muted);margin-top:2px">Gas: ${_fmt(d.gasUsed||0)} · Price: ${d.gasPrice||0} Gwei · Cost: ${d.gasCostBnb||0} BNB</div>`;
    if (d.value > 0) h += `<div style="font-size:9px;color:#0ecb81;margin-top:2px">Value: ${d.value} BNB</div>`;
    h += '</div>';

    // From/To
    h += '<div style="font-size:10px;margin-bottom:8px">';
    h += `<div class="mx-bar"><span class="mx-bar-label">From</span><span style="font-family:monospace;font-size:9px;color:var(--text)">${d.from||''}</span></div>`;
    h += `<div class="mx-bar"><span class="mx-bar-label">To</span><span style="font-family:monospace;font-size:9px;color:var(--accent)">${d.to||''}</span></div>`;
    h += '</div>';

    // Events
    const events = d.events || [];
    if (events.length > 0) {
      h += `<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">${events.length} EVENTS</div>`;
      for (const e of events.slice(0, 10)) {
        const ename = e.event || e.name || 'Event';
        const ec = ename === 'Transfer' ? '#0ecb81' : ename === 'Approval' ? '#f0b90b' : ename === 'Swap' ? '#e040fb' : 'var(--text)';
        h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 6px;margin-bottom:3px;font-size:9px">`;
        h += `<span style="color:${ec};font-weight:700">${ename}</span>`;
        h += ` <span class="t-mono t-muted">${shortAddr(e.address||'')}</span>`;
        if (e.decoded) h += `<div style="color:var(--text-muted);margin-top:1px">${e.decoded}</div>`;
        h += '</div>';
      }
    }

    // Token Transfers
    const transfers = d.tokenTransfers || [];
    if (transfers.length > 0) {
      h += `<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin:6px 0 4px">${transfers.length} TOKEN TRANSFERS</div>`;
      for (const t of transfers) {
        h += `<div class="mx-whale-row"><span style="color:#0ecb81;font-weight:700;font-size:9px">${shortAddr(t.from)}</span><span style="color:var(--text-muted);font-size:8px;margin:0 4px">-></span><span style="color:var(--accent);font-size:9px">${shortAddr(t.to)}</span><span style="margin-left:auto;font-weight:600;font-size:9px">${t.amount || '?'}</span></div>`;
      }
    }
    return h;
  }
  afterRender(body) {
    _bindSearch(body, this, 'txd-hash', () => this.refresh());
    // Handle dynamic example
    body.querySelectorAll('.ex-btn').forEach(btn => {
      if (btn.dataset.val === '__latest_tx__') {
        btn.addEventListener('click', async (e) => {
          e.stopImmediatePropagation();
          btn.textContent = 'Loading...';
          try {
            const block = await bnbApi.block();
            const txs = block?.result?.transactions || [];
            if (txs.length > 0) {
              const hash = typeof txs[0] === 'string' ? txs[0] : txs[0].hash;
              this._q = hash;
              const input = body.querySelector('#txd-hash');
              if (input) input.value = hash;
              this.refresh();
            }
          } catch(e) { btn.textContent = 'Error'; }
        }, { once: true });
      }
    });
  }
}
customElements.define('tx-decoder-panel', TxDecoderPanel);

// 32. Contract X-Ray
class ContractXrayPanel extends BasePanel {
  get panelTitle() { return 'Contract X-Ray'; }
  get skillLabel() { return 'MEFAI · FORENSICS'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiContractXray(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('cx-addr', 'Contract address (0x...)', 'X-Ray', [
      { label: 'CAKE', val: EX.CAKE }, { label: 'PancakeRouter', val: EX.PANCAKE_ROUTER }, { label: 'WBNB', val: EX.WBNB },
    ], 'cx-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Deep bytecode analysis: proxy detection, function scanning, ownership, dangerous patterns</div>';

    const logo = tokenLogo(d.address);
    h += '<div class="mx-hero">';
    h += '<div style="display:flex;align-items:center;gap:8px">';
    h += `<img src="${logo}" width="24" height="24" style="border-radius:50%" onerror="this.style.display='none'">`;
    h += '<div>';
    h += `<div style="font-weight:700;font-size:12px">${d.erc20Info?.name || 'Contract'} <span style="color:var(--accent)">${d.erc20Info?.symbol || ''}</span></div>`;
    h += `<div style="font-size:9px;color:var(--text-muted)">${_fmt(d.codeSize||0)} bytes · ${(d.detectedFunctions||[]).length} functions detected</div>`;
    h += '</div></div>';
    if (d.isProxy) h += `<div style="margin-top:4px"><span class="mx-badge mx-badge-hot">PROXY</span> <span style="font-size:9px;color:var(--text-muted)">Impl: ${shortAddr(d.implementationAddress||'')}</span></div>`;
    if (d.owner && d.owner !== '0x0000000000000000000000000000000000000000') h += `<div style="margin-top:2px;font-size:9px;color:var(--text-muted)">Owner: <span style="color:var(--accent);font-family:monospace">${shortAddr(d.owner)}</span></div>`;
    h += '</div>';

    // Patterns
    const p = d.hasPatterns || {};
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">';
    h += `<span class="mx-badge ${p.mintable?'mx-badge-danger':'mx-badge-win'}">${p.mintable?'MINTABLE':'NO MINT'}</span>`;
    h += `<span class="mx-badge ${p.pausable?'mx-badge-danger':'mx-badge-win'}">${p.pausable?'PAUSABLE':'NO PAUSE'}</span>`;
    h += `<span class="mx-badge ${p.blacklistable?'mx-badge-danger':'mx-badge-win'}">${p.blacklistable?'BLACKLIST':'NO BLACKLIST'}</span>`;
    h += `<span class="mx-badge ${p.burnable?'mx-badge-win':'mx-badge-hot'}">${p.burnable?'BURNABLE':'NO BURN'}</span>`;
    h += '</div>';

    // Functions
    const funcs = d.detectedFunctions || [];
    if (funcs.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">DETECTED FUNCTIONS</div>';
      h += '<div style="display:flex;flex-wrap:wrap;gap:3px">';
      for (const f of funcs) {
        const isKnown = f.name && f.name !== f.selector;
        h += `<span style="font-family:monospace;font-size:8px;padding:2px 5px;border-radius:3px;background:var(--bg);border:1px solid var(--border);color:${isKnown?'var(--accent)':'var(--text-muted)'}">${f.name || f.selector}</span>`;
      }
      h += '</div>';
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'cx-addr', () => this.refresh()); }
}
customElements.define('contract-xray-panel', ContractXrayPanel);

// 33. Approval Scanner
class ApprovalScannerPanel extends BasePanel {
  get panelTitle() { return 'Approval Scanner'; }
  get skillLabel() { return 'MEFAI · SECURITY'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiApprovalScanner(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('as-addr', 'Wallet address (0x...)', 'Scan', [
      { label: 'Paste Your Wallet', val: '' },
    ], 'as-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Paste your BSC wallet to check token approvals against 9 major DEX routers (PancakeSwap V1/V2/V3, 1inch, Biswap, ApeSwap, ParaSwap)</div>';

    const approvals = d.approvals || [];
    const unlimited = approvals.filter(a => a.isUnlimited).length;
    const active = approvals.length;

    h += '<div class="mx-hero" style="display:flex;justify-content:space-around;text-align:center">';
    h += `<div><div class="mx-hero-label">Tokens Checked</div><div class="mx-hero-num">${d.tokensChecked||approvals.length}</div></div>`;
    h += `<div><div class="mx-hero-label">Active Approvals</div><div class="mx-hero-num" style="color:${active>0?'#f0b90b':'#0ecb81'}">${active}</div></div>`;
    h += `<div><div class="mx-hero-label">Unlimited</div><div class="mx-hero-num" style="color:${unlimited>0?'#f6465d':'#0ecb81'}">${unlimited}</div></div>`;
    h += '</div>';

    for (const a of approvals) {
      const logo = tokenLogo(a.token || a.tokenAddress);
      const danger = a.isUnlimited;
      h += `<div style="display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid var(--border)">`;
      h += `<img src="${logo}" width="16" height="16" style="border-radius:50%" onerror="this.style.display='none'">`;
      h += `<div style="flex:1;min-width:0">`;
      h += `<div style="display:flex;justify-content:space-between"><span style="font-weight:700;font-size:10px;color:var(--accent)">${a.symbol||'?'}</span><span class="mx-badge ${danger?'mx-badge-danger':'mx-badge-hot'}">${danger?'UNLIMITED':_fmtShort(a.allowance)}</span></div>`;
      h += `<div style="font-size:8px;color:var(--text-muted)">Spender: ${a.spenderLabel||shortAddr(a.spender||'')}</div>`;
      h += '</div></div>';
    }
    if (active === 0) h += '<div style="text-align:center;color:#0ecb81;font-size:10px;padding:8px">No active approvals — wallet is clean</div>';
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'as-addr', () => this.refresh()); }
}
customElements.define('approval-scanner-panel', ApprovalScannerPanel);

// 34. Block Autopsy
class BlockAutopsyPanel extends BasePanel {
  get panelTitle() { return 'Block Autopsy'; }
  get skillLabel() { return 'MEFAI · BLOCK'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return bnbApi.mefaiBlockAutopsy(this._q || ''); }
  renderContent(d) {
    let h = _MX + _searchPanel('ba-num', 'Block number (leave empty for latest)', 'Analyze', [], 'ba-num');
    if (!d || d.error) return h + '<div class="panel-loading">Analyzing block...</div>';

    h += '<div class="mx-hero">';
    h += `<div class="mx-hero-label">Block #${_fmt(d.blockNumber)}</div>`;
    h += `<div style="display:flex;justify-content:space-around;text-align:center;margin-top:6px">`;
    h += `<div><div class="mx-hero-num">${d.txCount}</div><div class="mx-hero-sub">TXs</div></div>`;
    h += `<div><div class="mx-hero-num" style="color:#0ecb81">${_fmtShort(d.gasUsed)}</div><div class="mx-hero-sub">Gas Used</div></div>`;
    h += `<div><div class="mx-hero-num" style="color:var(--accent)">${d.totalValue?.toFixed(2)||0}</div><div class="mx-hero-sub">BNB Value</div></div>`;
    h += '</div></div>';

    // TX type breakdown
    const types = d.txTypes || {};
    const total = d.txCount || 1;
    h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">TRANSACTION TYPES</div>';
    const typeColors = { swap:'#e040fb', transfer:'#0ecb81', approve:'#f0b90b', other:'var(--text-muted)' };
    for (const [type, count] of Object.entries(types)) {
      const pct = (count / total * 100);
      h += '<div class="mx-bar">';
      h += `<span class="mx-bar-label" style="text-transform:capitalize">${type}</span>`;
      h += `<div class="mx-bar-track"><div class="mx-bar-fill" style="width:${pct}%;background:${typeColors[type]||'var(--text-muted)'}"></div></div>`;
      h += `<span class="mx-bar-val">${count} <span style="color:var(--text-muted);font-size:8px">(${pct.toFixed(0)}%)</span></span>`;
      h += '</div>';
    }

    // Top gas consumers
    const top = d.topGasConsumers || [];
    if (top.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin:8px 0 4px">TOP GAS CONSUMERS</div>';
      for (const c of top) {
        const gasPct = d.gasUsed > 0 ? (c.gasUsed / d.gasUsed * 100) : 0;
        h += '<div class="mx-bar">';
        h += `<span style="font-family:monospace;font-size:8px;color:var(--accent);min-width:90px">${shortAddr(c.address)}</span>`;
        h += `<div class="mx-bar-track"><div class="mx-bar-fill" style="width:${gasPct}%;background:linear-gradient(90deg,#f0b90b,#f6465d)"></div></div>`;
        h += `<span class="mx-bar-val">${_fmtShort(c.gasUsed)} <span style="color:var(--text-muted);font-size:8px">${c.txCount}tx</span></span>`;
        h += '</div>';
      }
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'ba-num', v => { this._q = v; this.refresh(); }); }
}
customElements.define('block-autopsy-panel', BlockAutopsyPanel);

// 35. Gas Calculator
class GasCalculatorPanel extends BasePanel {
  get panelTitle() { return 'Gas Calculator'; }
  get skillLabel() { return 'MEFAI · GAS'; }
  constructor() { super(); this._refreshRate = 15000; }
  async fetchData() { return bnbApi.mefaiGasCalculator(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Loading gas data...</div>';
    let h = _MX;

    h += '<div class="mx-hero" style="display:flex;justify-content:space-around;text-align:center">';
    h += `<div><div class="mx-hero-label">BSC Gas</div><div class="mx-hero-num" style="color:#0ecb81">${d.bscGasGwei||d.gasPriceGwei||'?'} Gwei</div></div>`;
    h += `<div><div class="mx-hero-label">BNB Price</div><div class="mx-hero-num" style="color:var(--accent)">$${(d.bnbPrice||0).toFixed(0)}</div></div>`;
    h += `<div><div class="mx-hero-label">ETH Gas</div><div class="mx-hero-num" style="color:#627eea">${d.ethGasGwei||8} Gwei</div></div>`;
    h += '</div>';

    const ops = d.operations || [];
    if (ops.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">OPERATION COSTS</div>';
      h += `<table class="p-table"><thead><tr><th>Operation</th><th class="t-right">Gas</th><th class="t-right">BSC Cost</th><th class="t-right">ETH Cost</th><th class="t-right">Savings</th></tr></thead><tbody>`;
      for (const op of ops) {
        const bscUsd = op.bsc?.costUsd ?? op.bscCostUsd ?? 0;
        const ethUsd = op.eth?.costUsd ?? op.ethCostUsd ?? 0;
        const save = ethUsd - bscUsd;
        const savePct = ethUsd > 0 ? (save / ethUsd * 100) : 0;
        h += '<tr>';
        h += `<td style="font-weight:600;font-size:9px">${op.operation||op.name||'?'}</td>`;
        h += `<td class="t-right t-mono t-muted">${_fmtShort(op.gasUnits)}</td>`;
        h += `<td class="t-right" style="color:#0ecb81;font-weight:700">$${bscUsd.toFixed(4)}</td>`;
        h += `<td class="t-right" style="color:#627eea">$${ethUsd.toFixed(4)}</td>`;
        h += `<td class="t-right" style="color:#0ecb81;font-weight:600">${savePct > 0 ? '-' : ''}${savePct.toFixed(0)}%</td>`;
        h += '</tr>';
      }
      h += '</tbody></table>';
    }
    return h;
  }
}
customElements.define('gas-calculator-panel', GasCalculatorPanel);

// 36. Multi-Token Battle
class TokenBattlePanel extends BasePanel {
  get panelTitle() { return 'Token Battle'; }
  get skillLabel() { return 'MEFAI · COMPARE'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiTokenBattle(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('tb-addrs', 'Token addresses (comma-separated, max 4)', 'Battle', [
      { label: 'CAKE vs WBNB', val: EX.CAKE+','+EX.WBNB },
      { label: 'USDT vs BUSD', val: EX.USDT+','+EX.BUSD },
    ], 'tb-addrs');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Compare up to 4 tokens side-by-side: price, volume, liquidity, burn rate</div>';
    const tokens = d.tokens || [];
    if (tokens.length === 0) return h + '<div style="color:#f6465d;font-size:10px;padding:8px">No token data found</div>';

    // Cards grid
    h += `<div style="display:grid;grid-template-columns:repeat(${Math.min(tokens.length,4)},1fr);gap:6px">`;
    for (const t of tokens) {
      const logo = tokenLogo(t.address);
      const c24 = _chgClass(t.change24h);
      h += '<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px">';
      h += `<div style="display:flex;align-items:center;gap:4px;margin-bottom:6px"><img src="${logo}" width="20" height="20" style="border-radius:50%" onerror="this.style.display='none'"><div><div style="font-weight:800;font-size:11px;color:var(--accent)">${t.symbol||'?'}</div><div style="font-size:8px;color:var(--text-muted)">${t.name||''}</div></div></div>`;
      h += `<div style="font-size:16px;font-weight:800">$${t.price||'?'}</div>`;
      h += `<div class="${c24}" style="font-size:10px">${_chgFmt(t.change24h)}</div>`;
      h += `<div style="margin-top:4px;font-size:8px;color:var(--text-muted)">`;
      h += `Vol: $${_fmtM(t.volume24h||0)}<br>`;
      h += `Liq: $${_fmtM(t.liquidity||0)}<br>`;
      h += `Pairs: ${t.pairCount||0}<br>`;
      if (t.burnedPct > 0) h += `Burned: ${t.burnedPct?.toFixed(1)}%<br>`;
      h += `Code: ${_fmtShort(t.codeSize||0)} B`;
      h += '</div></div>';
    }
    h += '</div>';

    // Comparison bars
    const metrics = [
      { key: 'volume24h', label: 'Volume 24h', fmt: v => '$'+_fmtM(v) },
      { key: 'liquidity', label: 'Liquidity', fmt: v => '$'+_fmtM(v) },
      { key: 'pairCount', label: 'Pairs', fmt: v => String(v||0) },
    ];
    const colors = ['#f0b90b','#0ecb81','#e040fb','#1e88e5'];
    for (const m of metrics) {
      const max = Math.max(...tokens.map(t => t[m.key]||0), 1);
      h += `<div style="font-size:8px;color:var(--text-muted);margin-top:6px">${m.label}</div>`;
      tokens.forEach((t, i) => {
        const pct = ((t[m.key]||0) / max * 100);
        h += `<div style="display:flex;align-items:center;gap:4px;margin-top:2px"><span style="width:40px;font-size:8px;font-weight:700;color:${colors[i]}">${t.symbol}</span><div style="flex:1;height:6px;background:var(--bg);border-radius:3px;overflow:hidden"><div style="width:${pct}%;height:100%;background:${colors[i]};border-radius:3px"></div></div><span style="font-size:8px;color:var(--text)">${m.fmt(t[m.key]||0)}</span></div>`;
      });
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'tb-addrs', () => this.refresh()); }
}
customElements.define('token-battle-panel', TokenBattlePanel);

// 37. Pair Analytics
class PairAnalyticsPanel extends BasePanel {
  get panelTitle() { return 'Pair Analytics'; }
  get skillLabel() { return 'MEFAI · PAIRS'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiPairAnalytics(this._q) : null; }
  renderContent(d) {
    let h = _MX + css('table') + _searchPanel('pa-addr', 'Token contract address (0x...)', 'Analyze', [
      { label: 'CAKE', val: EX.CAKE }, { label: 'WBNB', val: EX.WBNB },
    ], 'pa-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Deep DEX pair analysis: volume distribution, liquidity depth, trade metrics</div>';

    const pairs = d.pairs || [];
    const agg = d.aggregate || {};
    h += '<div class="mx-hero" style="display:flex;justify-content:space-around;text-align:center">';
    h += `<div><div class="mx-hero-label">Pairs</div><div class="mx-hero-num" style="color:var(--accent)">${agg.pairCount||0}</div></div>`;
    h += `<div><div class="mx-hero-label">Total Volume</div><div class="mx-hero-num" style="color:#0ecb81">$${_fmtM(agg.totalVolume||0)}</div></div>`;
    h += `<div><div class="mx-hero-label">Total Liquidity</div><div class="mx-hero-num">$${_fmtM(agg.totalLiquidity||0)}</div></div>`;
    h += '</div>';

    if (pairs.length > 0) {
      h += '<table class="p-table"><thead><tr><th>Pair</th><th>DEX</th><th class="t-right">Price</th><th class="t-right">24h</th><th class="t-right">Volume</th><th class="t-right">Liq</th><th class="t-right">Txns</th></tr></thead><tbody>';
      for (const p of pairs.slice(0, 15)) {
        const c24 = _chgClass(p.change24h);
        h += '<tr>';
        h += `<td class="t-sym">${p.pair||'?'}</td>`;
        h += `<td class="t-muted" style="font-size:8px">${p.dex||''}</td>`;
        h += `<td class="t-right t-mono">$${p.price||'?'}</td>`;
        h += `<td class="t-right ${c24}">${_chgFmt(p.change24h)}</td>`;
        h += `<td class="t-right" style="font-weight:600">$${_fmtM(p.volume24h||0)}</td>`;
        h += `<td class="t-right t-muted">$${_fmtM(p.liquidity||0)}</td>`;
        h += `<td class="t-right"><span class="t-green">${p.buys24h||0}</span>/<span class="t-red">${p.sells24h||0}</span></td>`;
        h += '</tr>';
      }
      h += '</tbody></table>';
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'pa-addr', () => this.refresh()); }
}
customElements.define('pair-analytics-panel', PairAnalyticsPanel);

// 38. Token Flow Radar
class TokenFlowPanel extends BasePanel {
  get panelTitle() { return 'Token Flow'; }
  get skillLabel() { return 'MEFAI · FLOW'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiTokenFlow(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('tf-addr', 'Token contract address (0x...)', 'Track', [
      { label: 'CAKE', val: EX.CAKE }, { label: 'USDT', val: EX.USDT },
    ], 'tf-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Track real-time token transfers from latest BSC blocks</div>';

    const transfers = d.transfers || [];
    h += '<div class="mx-hero" style="display:flex;justify-content:space-around;text-align:center">';
    h += `<div><div class="mx-hero-label"><span class="mx-pulse"></span> Transfers</div><div class="mx-hero-num" style="color:var(--accent)">${d.totalTransfers||0}</div></div>`;
    h += `<div><div class="mx-hero-label">Unique Addrs</div><div class="mx-hero-num">${d.uniqueAddresses||0}</div></div>`;
    h += `<div><div class="mx-hero-label">Blocks Scanned</div><div class="mx-hero-num">${d.blocksScanned||0}</div></div>`;
    h += '</div>';

    if (d.largestTransfer) {
      const lg = typeof d.largestTransfer === 'object' ? (d.largestTransfer.amount || d.largestTransfer.rawAmount || '?') : _fmtShort(Number(d.largestTransfer) / 1e18);
      h += `<div style="background:rgba(240,185,11,.06);border:1px solid rgba(240,185,11,.15);border-radius:4px;padding:6px;margin-bottom:6px;font-size:9px;text-align:center">Largest: <span style="color:var(--accent);font-weight:800">${lg}</span> tokens</div>`;
    }

    for (const t of transfers.slice(0, 12)) {
      const amt = t.amount || _fmtShort(Number(t.rawAmount || 0) / 1e18);
      h += '<div class="mx-whale-row">';
      h += `<span style="color:#0ecb81;font-size:8px;font-family:monospace">${shortAddr(t.from)}</span>`;
      h += '<span style="color:var(--text-muted);font-size:8px;margin:0 3px">-></span>';
      h += `<span style="color:var(--accent);font-size:8px;font-family:monospace">${shortAddr(t.to)}</span>`;
      h += `<span style="margin-left:auto;font-weight:700;font-size:9px">${amt}</span>`;
      h += '</div>';
    }
    if (transfers.length === 0) h += '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:8px">No transfers in recent blocks</div>';
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'tf-addr', () => this.refresh()); }
}
customElements.define('token-flow-panel', TokenFlowPanel);

// 39. Yield Finder
class YieldFinderPanel extends BasePanel {
  get panelTitle() { return 'Yield Finder'; }
  get skillLabel() { return 'MEFAI · YIELD'; }
  constructor() { super(); this._refreshRate = 60000; }
  async fetchData() { return bnbApi.mefaiYieldFinder(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Scanning yield opportunities...</div>';
    let h = _MX + css('table');
    const opps = d.opportunities || [];
    if (opps.length === 0) return h + '<div class="panel-loading">No opportunities found</div>';

    const best = opps[0];
    h += '<div class="mx-hero" style="text-align:center">';
    h += `<div class="mx-hero-label">Best Estimated APY</div>`;
    h += `<div class="mx-hero-num" style="color:#0ecb81">${(best.estimatedApy||0).toFixed(1)}%</div>`;
    h += `<div class="mx-hero-sub">${best.pair||''} on ${best.dex||''}</div>`;
    h += '</div>';

    h += '<table class="p-table"><thead><tr><th>#</th><th>Pair</th><th class="t-right">APY Est.</th><th class="t-right">Volume</th><th class="t-right">Liq</th><th class="t-right">V/L</th><th class="t-right">Buy%</th></tr></thead><tbody>';
    opps.forEach((o, i) => {
      const apyColor = o.estimatedApy > 100 ? '#0ecb81' : o.estimatedApy > 30 ? '#f0b90b' : 'var(--text)';
      const medal = i < 3 ? `<span class="mx-medal mx-medal-${i+1}">${i+1}</span>` : `<span style="font-size:9px;color:var(--text-muted)">${i+1}</span>`;
      h += '<tr>';
      h += `<td>${medal}</td>`;
      h += `<td><div style="display:flex;align-items:center;gap:3px"><img src="${tokenLogo(o.baseAddress)}" width="12" height="12" style="border-radius:50%" onerror="this.style.display='none'"><span class="t-sym" style="font-size:9px">${o.pair}</span></div></td>`;
      h += `<td class="t-right" style="color:${apyColor};font-weight:800">${o.estimatedApy?.toFixed(1)}%</td>`;
      h += `<td class="t-right">$${_fmtM(o.volume24h||0)}</td>`;
      h += `<td class="t-right t-muted">$${_fmtM(o.liquidity||0)}</td>`;
      h += `<td class="t-right" style="font-weight:600">${o.vlRatio?.toFixed(2)||0}</td>`;
      h += `<td class="t-right" style="color:${(o.buyPressure||50)>55?'#0ecb81':'var(--text)'}">${(o.buyPressure||0).toFixed(0)}%</td>`;
      h += '</tr>';
    });
    h += '</tbody></table>';
    h += '<div style="font-size:8px;color:var(--text-muted);margin-top:4px;text-align:center">APY estimated from trading fee revenue (0.3% fee). Not financial advice.</div>';
    return h;
  }
}
customElements.define('yield-finder-panel', YieldFinderPanel);

// 40. Risk Radar
class RiskRadarPanel extends BasePanel {
  get panelTitle() { return 'Risk Radar'; }
  get skillLabel() { return 'MEFAI · RISK'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiRiskRadar(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('rr-addr', 'Address or contract (0x...)', 'Analyze', [
      { label: 'CAKE', val: EX.CAKE }, { label: 'WBNB', val: EX.WBNB }, { label: 'Dead', val: EX.DEAD },
    ], 'rr-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Comprehensive risk assessment: contract analysis, market health, danger patterns</div>';

    const gc = { A:'#0ecb81', B:'#3cc68a', C:'#f0b90b', D:'#e8961e', F:'#f6465d' };
    const color = gc[d.grade] || '#848e9c';

    h += '<div class="mx-hero" style="display:flex;align-items:center;gap:16px">';
    h += _gauge(d.riskScore||0, color, d.riskScore||0, d.grade||'?', 72);
    h += '<div style="flex:1">';
    h += `<div style="font-weight:800;font-size:14px;color:${color}">Grade ${d.grade} — ${d.riskScore}/100</div>`;
    h += `<div style="font-size:9px;color:var(--text-muted);margin-top:2px">${d.isContract?'Smart Contract':'EOA Wallet'} · ${_fmtShort(d.codeSize||0)} bytes · ${d.txCount||0} txs</div>`;
    h += `<div style="font-size:9px;color:var(--text-muted)">Balance: ${(d.balance||0).toFixed(4)} BNB</div>`;
    h += '</div></div>';

    // Risks
    const risks = d.risks || [];
    const positives = d.positives || [];
    if (positives.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:#0ecb81;margin-bottom:3px">SAFE INDICATORS</div>';
      for (const p of positives) {
        h += `<div style="font-size:9px;padding:2px 0;color:#0ecb81">&#10003; ${p}</div>`;
      }
    }
    if (risks.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:#f6465d;margin:6px 0 3px">RISK FACTORS</div>';
      for (const r of risks) {
        h += `<div style="font-size:9px;padding:2px 0;color:#f6465d">&#10007; ${r}</div>`;
      }
    }

    // Market data
    if (d.marketData && d.marketData.price) {
      const md = d.marketData;
      h += '<div style="margin-top:6px;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:6px">';
      h += `<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:3px">MARKET DATA</div>`;
      h += `<div style="display:flex;justify-content:space-between;font-size:9px"><span>Price</span><span style="font-weight:700">$${md.price}</span></div>`;
      h += `<div style="display:flex;justify-content:space-between;font-size:9px"><span>Volume</span><span>$${_fmtM(md.volume24h||0)}</span></div>`;
      h += `<div style="display:flex;justify-content:space-between;font-size:9px"><span>Liquidity</span><span>$${_fmtM(md.liquidity||0)}</span></div>`;
      h += '</div>';
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'rr-addr', () => this.refresh()); }
}
customElements.define('risk-radar-panel', RiskRadarPanel);

// ═══════════════════════════════════════════════════════════════════
// BATCH 4: 10 Advanced On-Chain Intelligence Panels (19-28)
// ═══════════════════════════════════════════════════════════════════

// 19. Sniper Detector — Detect early buyers / snipers on token launches
class SniperDetectorPanel extends BasePanel {
  get panelTitle() { return 'Sniper Detector'; }
  get skillLabel() { return 'MEFAI · SNIPER'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiSniperDetector(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('snp-addr', 'Token address (0x...)', 'Scan', [
      { label: 'CAKE', val: EX.CAKE },
      { label: 'WBNB', val: EX.WBNB },
    ], 'snp-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Enter a token address to detect sniper bots and early buyers</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    const score = d.sniperScore || 0;
    const gColor = score > 70 ? '#f6465d' : score > 40 ? '#f0b90b' : '#0ecb81';
    const verdict = score > 70 ? 'HIGH RISK' : score > 40 ? 'MODERATE' : 'LOW RISK';
    const vClass = score > 70 ? 'mx-badge-danger' : score > 40 ? 'mx-badge-hot' : 'mx-badge-win';

    h += '<div class="mx-hero" style="display:flex;align-items:center;gap:16px">';
    h += _gauge(score, gColor, score, 'SNIPER', 80);
    h += '<div style="flex:1">';
    h += `<div class="mx-hero-label">Sniper Score</div>`;
    h += `<span class="mx-badge ${vClass}">${verdict}</span>`;
    h += `<div class="mx-hero-sub">${d.tokenName || 'Token'} · ${d.totalBuyers || 0} early buyers analyzed</div>`;
    h += '</div></div>';

    // Stats row
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px">';
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px;text-align:center"><div style="font-size:8px;color:var(--text-muted)">BLOCK 0 BUYS</div><div style="font-size:14px;font-weight:800;color:#f6465d">${d.block0Buys || 0}</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px;text-align:center"><div style="font-size:8px;color:var(--text-muted)">BOT WALLETS</div><div style="font-size:14px;font-weight:800;color:#f0b90b">${d.botWallets || 0}</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px;text-align:center"><div style="font-size:8px;color:var(--text-muted)">DUMPED</div><div style="font-size:14px;font-weight:800;color:#f6465d">${d.dumpedCount || 0}</div></div>`;
    h += '</div>';

    // Early buyers list
    const buyers = d.earlyBuyers || [];
    if (buyers.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">EARLY BUYERS</div>';
      for (const b of buyers.slice(0, 12)) {
        const statusColor = b.status === 'DUMPED' ? '#f6465d' : b.status === 'HOLDING' ? '#0ecb81' : '#f0b90b';
        const statusBg = b.status === 'DUMPED' ? 'rgba(246,70,93,.12)' : b.status === 'HOLDING' ? 'rgba(14,203,129,.12)' : 'rgba(240,185,11,.12)';
        h += '<div class="mx-whale-row">';
        h += `<span class="mx-whale-addr">${shortAddr(b.address || '')}</span>`;
        h += `<span style="background:${statusBg};color:${statusColor};padding:1px 5px;border-radius:3px;font-size:8px;font-weight:700">${b.status || 'UNKNOWN'}</span>`;
        h += `<span style="font-size:9px;color:var(--text-muted)">Block +${b.blockDelay || 0}</span>`;
        h += `<span class="mx-whale-val" style="color:${statusColor}">${b.amount ? _fmtShort(b.amount) : '?'}</span>`;
        h += '</div>';
      }
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'snp-addr', () => this.refresh()); }
}
customElements.define('sniper-detector-panel', SniperDetectorPanel);

// 20. Wallet Cluster — Find related wallets via on-chain patterns
class WalletClusterPanel extends BasePanel {
  get panelTitle() { return 'Wallet Cluster'; }
  get skillLabel() { return 'MEFAI · CLUSTER'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiWalletCluster(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('wc-addr', 'Wallet address (0x...)', 'Cluster', [
      { label: 'Binance Hot', val: EX.BINANCE_HOT },
      { label: 'CZ Wallet', val: EX.CZ_WALLET },
    ], 'wc-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Enter a wallet address to discover related wallet clusters</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    // Seed wallet hero
    h += '<div class="mx-hero">';
    h += `<div class="mx-hero-label">SEED WALLET</div>`;
    h += `<div style="font-family:monospace;font-size:11px;color:var(--accent);word-break:break-all">${d.seedAddress || this._q}</div>`;
    h += `<div style="display:flex;gap:12px;margin-top:6px">`;
    h += `<div><span style="font-size:9px;color:var(--text-muted)">Cluster Size</span><div style="font-size:18px;font-weight:900;color:#0ecb81">${d.clusterSize || 0}</div></div>`;
    h += `<div><span style="font-size:9px;color:var(--text-muted)">Total Value</span><div style="font-size:18px;font-weight:900;color:var(--accent)">$${_fmtM(d.totalValue || 0)}</div></div>`;
    h += `<div><span style="font-size:9px;color:var(--text-muted)">Shared Tokens</span><div style="font-size:18px;font-weight:900;color:#e040fb">${d.sharedTokens || 0}</div></div>`;
    h += '</div></div>';

    // Cluster wallets
    const wallets = d.wallets || [];
    if (wallets.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">CLUSTER WALLETS</div>';
      for (const w of wallets.slice(0, 10)) {
        h += '<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px;margin-bottom:4px">';
        h += `<div style="display:flex;justify-content:space-between;align-items:center">`;
        h += `<span style="font-family:monospace;font-size:9px;color:var(--accent)">${shortAddr(w.address || '')}</span>`;
        h += `<span style="font-weight:700;font-size:10px">$${_fmtM(w.value || 0)}</span>`;
        h += '</div>';
        h += `<div style="font-size:8px;color:var(--text-muted);margin-top:2px">Link: ${w.linkType || 'funding'} · TXs: ${w.txCount || 0} · Similarity: ${w.similarity || 0}%</div>`;
        const tokens = w.sharedTokens || [];
        if (tokens.length > 0) {
          h += '<div style="display:flex;gap:3px;margin-top:3px;flex-wrap:wrap">';
          for (const t of tokens.slice(0, 5)) {
            h += `<span style="background:rgba(224,64,251,.1);color:#e040fb;padding:1px 4px;border-radius:3px;font-size:7px;font-weight:600">${t}</span>`;
          }
          h += '</div>';
        }
        h += '</div>';
      }
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'wc-addr', () => this.refresh()); }
}
customElements.define('wallet-cluster-panel', WalletClusterPanel);

// 21. Honeypot Check — Detect honeypot / rug pull tokens
class HoneypotCheckPanel extends BasePanel {
  get panelTitle() { return 'Honeypot Check'; }
  get skillLabel() { return 'MEFAI · HONEYPOT'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiHoneypotCheck(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('hp-addr', 'Token address (0x...)', 'Check', [
      { label: 'CAKE', val: EX.CAKE },
      { label: 'USDT', val: EX.USDT },
    ], 'hp-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Enter a token address to check for honeypot / rug pull risks</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    const score = d.trapScore || 0;
    const gColor = score > 70 ? '#f6465d' : score > 40 ? '#f0b90b' : '#0ecb81';
    const verdict = score > 70 ? 'DANGER' : score > 40 ? 'CAUTION' : 'SAFE';
    const vClass = score > 70 ? 'mx-badge-danger' : score > 40 ? 'mx-badge-hot' : 'mx-badge-win';

    // Big gauge center
    h += '<div style="text-align:center;margin-bottom:10px">';
    h += `<div style="display:inline-block">${_gauge(score, gColor, score, 'TRAP', 100)}</div>`;
    h += `<div style="margin-top:8px"><span class="mx-badge ${vClass}" style="font-size:11px;padding:4px 14px">${verdict}</span></div>`;
    h += `<div style="font-size:10px;color:var(--text-muted);margin-top:4px">${d.tokenName || 'Token'} · ${d.tokenSymbol || '?'}</div>`;
    h += '</div>';

    // Risk factors
    const risks = d.riskFactors || [];
    if (risks.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">RISK FACTORS</div>';
      for (const r of risks) {
        const rPct = r.severity || 0;
        const rColor = rPct > 70 ? '#f6465d' : rPct > 40 ? '#f0b90b' : '#0ecb81';
        h += '<div class="mx-bar">';
        h += `<span class="mx-bar-label" style="min-width:90px;font-size:9px">${r.name || 'Risk'}</span>`;
        h += `<div class="mx-bar-track"><div class="mx-bar-fill" style="width:${rPct}%;background:${rColor}"></div></div>`;
        h += `<span class="mx-bar-val" style="color:${rColor}">${rPct}%</span>`;
        h += '</div>';
      }
    }

    // Checks grid
    const checks = d.checks || {};
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;margin-top:8px">';
    const checkItems = [
      ['Buy Tax', checks.buyTax],
      ['Sell Tax', checks.sellTax],
      ['Can Sell', checks.canSell],
      ['Ownership', checks.ownershipRenounced],
      ['Liquidity Lock', checks.liquidityLocked],
      ['Verified', checks.verified],
    ];
    for (const [lbl, val] of checkItems) {
      const isGood = val === true || val === 'Yes' || val === 'Renounced' || val === 'Locked' || val === 'Verified' || (typeof val === 'number' && val < 10);
      const ic = isGood ? '#0ecb81' : '#f6465d';
      const display = typeof val === 'number' ? val + '%' : (val === true ? 'Yes' : val === false ? 'No' : (val || '?'));
      h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 6px;display:flex;justify-content:space-between">`;
      h += `<span style="font-size:8px;color:var(--text-muted)">${lbl}</span>`;
      h += `<span style="font-size:9px;font-weight:700;color:${ic}">${display}</span>`;
      h += '</div>';
    }
    h += '</div>';
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'hp-addr', () => this.refresh()); }
}
customElements.define('honeypot-check-panel', HoneypotCheckPanel);

// 22. Validator Map — BSC validator network overview
class ValidatorMapPanel extends BasePanel {
  get panelTitle() { return 'Validator Map'; }
  get skillLabel() { return 'MEFAI · VALIDATORS'; }
  constructor() { super(); this._refreshRate = 30000; }
  async fetchData() { return bnbApi.mefaiValidatorMap(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Loading validator data...</div>';
    let h = _MX;

    // Network stats hero
    h += '<div class="mx-hero" style="display:flex;justify-content:space-around;text-align:center">';
    h += `<div><div class="mx-hero-label">Active</div><div class="mx-hero-num" style="color:#0ecb81">${d.activeValidators || 21}</div></div>`;
    h += `<div><div class="mx-hero-label">Gas Util</div><div class="mx-hero-num" style="color:var(--accent)">${(d.avgGasUtil || 0).toFixed(1)}%</div></div>`;
    h += `<div><div class="mx-hero-label">Block Time</div><div class="mx-hero-num" style="color:#627eea">${(d.avgBlockTime || 3).toFixed(1)}s</div></div>`;
    h += '</div>';

    // Validator grid
    const validators = d.validators || [];
    if (validators.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">VALIDATORS <span style="color:var(--accent)">' + validators.length + '</span></div>';
      h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px">';
      for (const v of validators.slice(0, 21)) {
        const util = v.gasUtil || 0;
        const borderColor = util > 80 ? '#f6465d' : util > 50 ? '#f0b90b' : '#0ecb81';
        const pulseColor = v.active !== false ? '#0ecb81' : '#f6465d';
        h += `<div style="background:var(--bg);border:1px solid ${borderColor}30;border-left:3px solid ${borderColor};border-radius:4px;padding:5px 6px">`;
        h += `<div style="display:flex;align-items:center;gap:3px;margin-bottom:2px">`;
        h += `<span class="mx-pulse" style="background:${pulseColor};width:5px;height:5px"></span>`;
        h += `<span style="font-size:8px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v.label || v.name || shortAddr(v.address || '')}</span>`;
        h += '</div>';
        h += `<div style="font-size:8px;color:var(--text-muted)">${_fmtShort(v.blocksProduced || 0)} blk</div>`;
        h += `<div style="font-size:8px;color:${borderColor};font-weight:600">${util.toFixed(1)}% gas</div>`;
        h += '</div>';
      }
      h += '</div>';
    }
    return h;
  }
}
customElements.define('validator-map-panel', ValidatorMapPanel);

// 23. DEX Arbitrage — Cross-DEX spread opportunities
class DexArbPanel extends BasePanel {
  get panelTitle() { return 'DEX Arbitrage'; }
  get skillLabel() { return 'MEFAI · ARB'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return bnbApi.mefaiDexArb(this._q); }
  renderContent(d) {
    let h = _MX + _searchPanel('arb-addr', 'Token address (optional)', 'Scan', [
      { label: 'CAKE', val: EX.CAKE },
      { label: 'All Pairs', val: '' },
    ], 'arb-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Scan for cross-DEX arbitrage opportunities on BSC</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    // Best spread hero
    const best = d.bestOpportunity || d.opportunities?.[0] || {};
    if (best.spread) {
      h += '<div class="mx-hero">';
      h += `<div class="mx-hero-label">BEST SPREAD</div>`;
      h += `<div class="mx-hero-num" style="color:#0ecb81">${(best.spread || 0).toFixed(2)}%</div>`;
      h += `<div class="mx-hero-sub">${best.token || '?'}: ${best.cheapDex || '?'} → ${best.expensiveDex || '?'} · Est. $${_fmtShort(best.estProfit || 0)}</div>`;
      h += '</div>';
    }

    // Opportunities table
    const opps = d.opportunities || [];
    if (opps.length > 0) {
      h += css('table');
      h += '<div style="overflow-x:auto"><table class="p-table"><thead><tr>';
      h += '<th>Token</th><th>Buy</th><th>Sell</th><th class="t-right">Spread</th><th class="t-right">Profit</th>';
      h += '</tr></thead><tbody>';
      for (const o of opps.slice(0, 15)) {
        const spreadColor = (o.spread || 0) >= 1 ? '#0ecb81' : (o.spread || 0) >= 0.3 ? '#f0b90b' : 'var(--text-muted)';
        h += '<tr>';
        h += `<td class="t-sym">${o.token || o.symbol || '?'}</td>`;
        h += `<td style="font-size:9px">${o.cheapDex || '?'}</td>`;
        h += `<td style="font-size:9px">${o.expensiveDex || '?'}</td>`;
        h += `<td class="t-right" style="color:${spreadColor};font-weight:700">${(o.spread || 0).toFixed(2)}%</td>`;
        h += `<td class="t-right" style="color:#0ecb81">$${_fmtShort(o.estProfit || 0)}</td>`;
        h += '</tr>';
      }
      h += '</tbody></table></div>';
    }

    // Summary
    if (d.totalOpportunities) {
      h += `<div style="text-align:center;font-size:9px;color:var(--text-muted);margin-top:6px">${d.totalOpportunities} opportunities found · Avg spread ${(d.avgSpread || 0).toFixed(2)}%</div>`;
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'arb-addr', () => this.refresh()); }
}
customElements.define('dex-arb-panel', DexArbPanel);

// 24. Token Birth — Deep origin analysis for any token
class TokenBirthPanel extends BasePanel {
  get panelTitle() { return 'Token Birth'; }
  get skillLabel() { return 'MEFAI · BIRTH'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiTokenBirth(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('tb-addr', 'Token address (0x...)', 'Analyze', [
      { label: 'CAKE', val: EX.CAKE },
      { label: 'WBNB', val: EX.WBNB },
    ], 'tb-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Enter a token address to trace its creation and origin</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    // Token hero with logo
    const logo = d.address ? tokenLogo(d.address) : '';
    h += '<div class="mx-hero" style="display:flex;align-items:center;gap:12px">';
    if (logo) h += `<img src="${logo}" onerror="this.style.display='none'" style="width:36px;height:36px;border-radius:50%;border:2px solid var(--accent)" />`;
    h += '<div style="flex:1">';
    h += `<div style="font-size:14px;font-weight:800;color:var(--text)">${d.tokenName || 'Token'} <span style="color:var(--accent);font-size:11px">${d.tokenSymbol || ''}</span></div>`;
    const ageDays = d.ageDays || 0;
    const ageLabel = ageDays > 365 ? Math.floor(ageDays / 365) + ' years' : ageDays + ' days';
    h += `<span class="mx-badge mx-badge-hot">Born ${ageLabel} ago</span>`;
    h += `<div class="mx-hero-sub">Block #${_fmt(d.creationBlock || 0)} · ${d.creationDate || ''}</div>`;
    h += '</div></div>';

    // Creator wallet card
    const creator = d.creator || {};
    h += '<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:8px">';
    h += `<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">CREATOR WALLET</div>`;
    h += `<div style="font-family:monospace;font-size:9px;color:var(--accent);word-break:break-all">${creator.address || d.creatorAddress || '?'}</div>`;
    h += '<div style="display:flex;gap:10px;margin-top:4px">';
    h += `<div><span style="font-size:8px;color:var(--text-muted)">BNB</span><div style="font-weight:700;font-size:11px">${(creator.bnbBalance || 0).toFixed(2)}</div></div>`;
    h += `<div><span style="font-size:8px;color:var(--text-muted)">TXs</span><div style="font-weight:700;font-size:11px">${_fmtShort(creator.txCount || 0)}</div></div>`;
    h += `<div><span style="font-size:8px;color:var(--text-muted)">Holds</span><div style="font-weight:700;font-size:11px;color:var(--accent)">${(creator.holdPct || 0).toFixed(1)}%</div></div>`;
    h += '</div></div>';

    // Supply breakdown bars
    const supply = d.supply || {};
    h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">SUPPLY DISTRIBUTION</div>';
    const circ = supply.circulatingPct || 0;
    const burned = supply.burnedPct || 0;
    const owner = supply.ownerPct || 0;
    h += '<div style="display:flex;height:12px;border-radius:6px;overflow:hidden;margin-bottom:6px">';
    if (circ > 0) h += `<div style="width:${circ}%;background:#0ecb81" title="Circulating ${circ}%"></div>`;
    if (burned > 0) h += `<div style="width:${burned}%;background:#f6465d" title="Burned ${burned}%"></div>`;
    if (owner > 0) h += `<div style="width:${owner}%;background:#f0b90b" title="Owner ${owner}%"></div>`;
    h += '</div>';
    h += '<div style="display:flex;gap:8px;font-size:8px;margin-bottom:8px">';
    h += `<span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#0ecb81;margin-right:2px"></span>Circ ${circ}%</span>`;
    h += `<span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f6465d;margin-right:2px"></span>Burned ${burned}%</span>`;
    h += `<span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#f0b90b;margin-right:2px"></span>Owner ${owner}%</span>`;
    h += '</div>';

    // Market stats
    const mkt = d.market || {};
    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px">';
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 6px"><div style="font-size:8px;color:var(--text-muted)">Price</div><div style="font-weight:700;font-size:10px">$${mkt.price || '?'}</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 6px"><div style="font-size:8px;color:var(--text-muted)">Volume 24h</div><div style="font-weight:700;font-size:10px">$${_fmtM(mkt.volume24h || 0)}</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 6px"><div style="font-size:8px;color:var(--text-muted)">Liquidity</div><div style="font-weight:700;font-size:10px">$${_fmtM(mkt.liquidity || 0)}</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 6px"><div style="font-size:8px;color:var(--text-muted)">Pairs</div><div style="font-weight:700;font-size:10px">${mkt.pairCount || 0}</div></div>`;
    h += '</div>';
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'tb-addr', () => this.refresh()); }
}
customElements.define('token-birth-panel', TokenBirthPanel);

// 25. Network Pulse — Real-time BSC network health
class NetworkPulsePanel extends BasePanel {
  get panelTitle() { return 'Network Pulse'; }
  get skillLabel() { return 'MEFAI · PULSE'; }
  constructor() { super(); this._refreshRate = 10000; }
  async fetchData() { return bnbApi.mefaiNetworkPulse(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Loading network pulse...</div>';
    let h = _MX;

    const pressure = d.pressure || 0;
    const pColor = pressure > 80 ? '#f6465d' : pressure > 50 ? '#f0b90b' : '#0ecb81';
    const rec = pressure > 80 ? 'CONGESTED' : pressure > 50 ? 'BUSY' : 'OPTIMAL';
    const recClass = pressure > 80 ? 'mx-badge-danger' : pressure > 50 ? 'mx-badge-hot' : 'mx-badge-win';

    // Big pressure gauge
    h += '<div style="text-align:center;margin-bottom:8px">';
    h += `<div style="display:inline-block">${_gauge(pressure, pColor, pressure, 'PRESSURE', 90)}</div>`;
    h += `<div style="margin-top:6px"><span class="mx-badge ${recClass}" style="font-size:10px;padding:3px 12px">${rec}</span></div>`;
    h += '</div>';

    // Mini stats
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:8px">';
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px;text-align:center"><div style="font-size:7px;color:var(--text-muted)">GAS UTIL</div><div style="font-size:12px;font-weight:800;color:${pColor}">${(d.gasUtilization || 0).toFixed(1)}%</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px;text-align:center"><div style="font-size:7px;color:var(--text-muted)">BLOCK</div><div style="font-size:12px;font-weight:800;color:var(--text)">${(d.blockTime || 3).toFixed(1)}s</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px;text-align:center"><div style="font-size:7px;color:var(--text-muted)">TPS</div><div style="font-size:12px;font-weight:800;color:#627eea">${_fmtShort(d.tps || 0)}</div></div>`;
    h += `<div style="background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px;text-align:center"><div style="font-size:7px;color:var(--text-muted)">GAS</div><div style="font-size:12px;font-weight:800;color:var(--accent)">${d.gasPrice || '?'} Gwei</div></div>`;
    h += '</div>';

    // Recent blocks as colored cells
    const blocks = d.recentBlocks || [];
    if (blocks.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">RECENT BLOCKS</div>';
      h += '<div style="display:flex;gap:2px;flex-wrap:wrap">';
      for (const b of blocks.slice(0, 20)) {
        const bUtil = b.gasUtil || b.gasUtilization || 0;
        const bColor = bUtil > 80 ? '#f6465d' : bUtil > 50 ? '#f0b90b' : '#0ecb81';
        h += `<div style="width:20px;height:20px;background:${bColor}20;border:1px solid ${bColor}40;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:${bColor}" title="Block ${b.number || '?'}: ${bUtil.toFixed(0)}% gas">${bUtil.toFixed(0)}</div>`;
      }
      h += '</div>';
    }
    return h;
  }
}
customElements.define('network-pulse-panel', NetworkPulsePanel);

// 26. Copy Trade — Alpha wallet signal feed
class CopyTradePanel extends BasePanel {
  get panelTitle() { return 'Copy Trade'; }
  get skillLabel() { return 'MEFAI · COPY'; }
  constructor() { super(); this._refreshRate = 15000; }
  async fetchData() { return bnbApi.mefaiCopyTrade(); }
  renderContent(d) {
    if (!d || d.error) return '<div class="panel-loading">Loading copy trade signals...</div>';
    let h = _MX;

    // Hero
    const activeCount = d.activeWallets || 0;
    h += '<div class="mx-hero" style="display:flex;align-items:center;gap:12px">';
    h += `<div><div class="mx-hero-label">ALPHA WALLETS</div><div class="mx-hero-num" style="color:#0ecb81;display:flex;align-items:center;gap:6px">${activeCount} <span class="mx-pulse"></span></div></div>`;
    h += `<div style="flex:1;text-align:right"><div style="font-size:9px;color:var(--text-muted)">Signals 24h</div><div style="font-size:18px;font-weight:800;color:var(--accent)">${d.signals24h || 0}</div></div>`;
    h += '</div>';

    // Signal feed
    const signals = d.signals || [];
    if (signals.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">LIVE SIGNALS</div>';
      for (const s of signals.slice(0, 12)) {
        const isBuy = (s.action || '').toUpperCase() === 'BUY';
        const actionColor = isBuy ? '#0ecb81' : '#f6465d';
        const actionBg = isBuy ? 'rgba(14,203,129,.12)' : 'rgba(246,70,93,.12)';
        const logo = s.tokenAddress ? tokenLogo(s.tokenAddress) : '';
        h += '<div class="mx-whale-row" style="gap:4px">';
        h += `<span class="mx-whale-label" style="min-width:50px;text-align:center;font-size:7px">${s.walletLabel || shortAddr(s.wallet || '')}</span>`;
        h += `<span style="background:${actionBg};color:${actionColor};padding:1px 5px;border-radius:3px;font-size:8px;font-weight:800">${(s.action || 'BUY').toUpperCase()}</span>`;
        if (logo) h += `<img src="${logo}" onerror="this.style.display='none'" style="width:14px;height:14px;border-radius:50%" />`;
        h += `<span style="font-size:9px;font-weight:700;color:var(--text);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.tokenName || s.token || '?'}</span>`;
        h += `<span class="mx-whale-val" style="font-size:9px;color:var(--text)">$${_fmtShort(s.amount || 0)}</span>`;
        h += `<span style="font-size:7px;color:var(--text-muted);min-width:28px;text-align:right">${s.timeAgo || '?'}</span>`;
        h += '</div>';
      }
    } else {
      h += '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:12px">No recent signals detected</div>';
    }
    return h;
  }
}
customElements.define('copy-trade-panel', CopyTradePanel);

// 27. Upgrade Monitor — Proxy contract upgrade detection
class UpgradeMonitorPanel extends BasePanel {
  get panelTitle() { return 'Upgrade Monitor'; }
  get skillLabel() { return 'MEFAI · UPGRADE'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiUpgradeMonitor(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('um-addr', 'Contract address (0x...)', 'Check', [
      { label: 'PancakeRouter', val: EX.PANCAKE_ROUTER },
      { label: 'CAKE', val: EX.CAKE },
    ], 'um-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Enter a contract address to check proxy / upgrade status</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    const isProxy = d.isProxy || false;
    const vClass = isProxy ? 'mx-badge-hot' : 'mx-badge-win';
    const vText = isProxy ? 'PROXY' : 'NOT PROXY';

    // Verdict
    h += '<div style="text-align:center;margin-bottom:10px">';
    h += `<span class="mx-badge ${vClass}" style="font-size:12px;padding:5px 18px">${vText}</span>`;
    h += `<div style="font-size:10px;color:var(--text-muted);margin-top:4px">${d.contractName || shortAddr(this._q || '')}</div>`;
    h += '</div>';

    if (isProxy) {
      // Proxy details
      h += '<div class="mx-hero">';
      h += '<div style="display:flex;justify-content:space-between;margin-bottom:6px">';
      h += `<div><div class="mx-hero-label">IMPLEMENTATION</div><div style="font-family:monospace;font-size:9px;color:var(--accent);word-break:break-all">${d.implementation || '?'}</div></div>`;
      h += '</div>';
      h += `<div style="font-size:9px;color:var(--text-muted)">Admin: <span style="font-family:monospace;color:var(--text)">${shortAddr(d.admin || '')}</span></div>`;
      h += `<div style="font-size:9px;color:var(--text-muted);margin-top:2px">Proxy Type: <span style="color:var(--text);font-weight:600">${d.proxyType || 'Unknown'}</span></div>`;
      h += '</div>';

      // Upgrade risk gauge
      const risk = d.upgradeRisk || 0;
      const rColor = risk > 70 ? '#f6465d' : risk > 40 ? '#f0b90b' : '#0ecb81';
      h += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">';
      h += _gauge(risk, rColor, risk, 'RISK', 56);
      h += '<div style="flex:1">';
      h += `<div style="font-size:9px;font-weight:700;color:var(--text-muted)">UPGRADE RISK</div>`;
      h += `<div style="font-size:10px;color:var(--text);margin-top:2px">${d.riskDescription || 'Admin can modify contract logic'}</div>`;
      h += '</div></div>';

      // Upgrade history
      const history = d.upgradeHistory || [];
      if (history.length > 0) {
        h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:3px">UPGRADE HISTORY</div>';
        for (const u of history.slice(0, 5)) {
          h += `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid var(--border);font-size:9px">`;
          h += `<span style="color:var(--text-muted)">${u.date || '?'}</span>`;
          h += `<span style="font-family:monospace;color:var(--accent)">${shortAddr(u.newImpl || '')}</span>`;
          h += '</div>';
        }
      }
    }

    // Market context
    const mkt = d.market || {};
    if (mkt.price) {
      h += '<div style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px;margin-top:8px">';
      h += `<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:3px">MARKET CONTEXT</div>`;
      h += `<div style="display:flex;justify-content:space-between;font-size:9px"><span>Price</span><span style="font-weight:700">$${mkt.price}</span></div>`;
      h += `<div style="display:flex;justify-content:space-between;font-size:9px"><span>Volume</span><span>$${_fmtM(mkt.volume24h || 0)}</span></div>`;
      h += '</div>';
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'um-addr', () => this.refresh()); }
}
customElements.define('upgrade-monitor-panel', UpgradeMonitorPanel);

// 28. Portfolio Heatmap — Visual portfolio analysis
class PortfolioHeatmapPanel extends BasePanel {
  get panelTitle() { return 'Portfolio Heatmap'; }
  get skillLabel() { return 'MEFAI · PORTFOLIO'; }
  constructor() { super(); this._refreshRate = 0; }
  async fetchData() { return this._q ? bnbApi.mefaiPortfolioHeatmap(this._q) : null; }
  renderContent(d) {
    let h = _MX + _searchPanel('ph-addr', 'Wallet address (0x...)', 'Analyze', [
      { label: 'Binance Hot', val: EX.BINANCE_HOT },
      { label: 'CZ Wallet', val: EX.CZ_WALLET },
    ], 'ph-addr');
    if (!d) return h + '<div style="text-align:center;color:var(--text-muted);font-size:10px;padding:20px">Enter a wallet address to visualize portfolio as a heatmap</div>';
    if (d.error) return h + `<div style="color:#f6465d;font-size:10px;padding:8px">${d.detail || d.error}</div>`;

    // Hero: total value, P&L, health
    const pnl = d.pnl24h || 0;
    const pnlColor = pnl >= 0 ? '#0ecb81' : '#f6465d';
    const health = d.healthScore || 0;
    const hColor = health > 70 ? '#0ecb81' : health > 40 ? '#f0b90b' : '#f6465d';

    h += '<div class="mx-hero" style="display:flex;align-items:center;gap:10px">';
    h += '<div style="flex:1">';
    h += `<div class="mx-hero-label">TOTAL VALUE</div>`;
    h += `<div class="mx-hero-num" style="color:var(--accent)">$${_fmtM(d.totalValue || 0)}</div>`;
    h += `<div style="font-size:11px;font-weight:700;color:${pnlColor};margin-top:2px">${pnl >= 0 ? '+' : ''}$${_fmtShort(Math.abs(pnl))} <span style="font-size:9px">(${_chgFmt(d.pnl24hPct)})</span></div>`;
    h += '</div>';
    h += _gauge(health, hColor, health, 'HEALTH', 56);
    h += '</div>';

    // Holdings heatmap grid
    const holdings = d.holdings || [];
    if (holdings.length > 0) {
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:4px">HOLDINGS HEATMAP</div>';
      const maxVal = Math.max(...holdings.map(x => x.value || 0), 1);
      h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(50px,1fr));gap:3px;margin-bottom:8px">';
      for (const t of holdings.slice(0, 20)) {
        const chg = t.change24h || 0;
        const bg = chg >= 5 ? 'rgba(14,203,129,.35)' : chg >= 0 ? 'rgba(14,203,129,.15)' : chg >= -5 ? 'rgba(246,70,93,.15)' : 'rgba(246,70,93,.35)';
        const tc = chg >= 0 ? '#0ecb81' : '#f6465d';
        const sizePct = Math.max(40, Math.min(100, ((t.value || 0) / maxVal) * 100));
        h += `<div style="background:${bg};border-radius:4px;padding:4px;text-align:center;min-height:${sizePct * 0.5 + 20}px;display:flex;flex-direction:column;justify-content:center">`;
        h += `<div style="font-size:8px;font-weight:800;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.symbol || '?'}</div>`;
        h += `<div style="font-size:7px;color:var(--text-muted)">$${_fmtShort(t.value || 0)}</div>`;
        h += `<div style="font-size:7px;font-weight:700;color:${tc}">${chg >= 0 ? '+' : ''}${chg.toFixed(1)}%</div>`;
        h += '</div>';
      }
      h += '</div>';

      // Concentration bar
      const top3 = holdings.slice(0, 3);
      const totalVal = d.totalValue || 1;
      h += '<div style="font-size:9px;font-weight:700;color:var(--text-muted);margin-bottom:3px">CONCENTRATION</div>';
      h += '<div style="display:flex;height:10px;border-radius:5px;overflow:hidden;margin-bottom:2px">';
      const concColors = ['#f0b90b', '#0ecb81', '#627eea'];
      for (let i = 0; i < top3.length; i++) {
        const pct = ((top3[i].value || 0) / totalVal * 100).toFixed(1);
        h += `<div style="width:${pct}%;background:${concColors[i]}" title="${top3[i].symbol} ${pct}%"></div>`;
      }
      h += '</div>';
      h += '<div style="display:flex;gap:6px;font-size:7px;margin-bottom:8px">';
      for (let i = 0; i < top3.length; i++) {
        const pct = ((top3[i].value || 0) / totalVal * 100).toFixed(1);
        h += `<span><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:${concColors[i]};margin-right:2px"></span>${top3[i].symbol || '?'} ${pct}%</span>`;
      }
      h += '</div>';

      // Mini table
      h += css('table');
      h += '<div style="overflow-x:auto"><table class="p-table"><thead><tr>';
      h += '<th>Token</th><th class="t-right">Value</th><th class="t-right">24h</th><th class="t-right">%</th>';
      h += '</tr></thead><tbody>';
      for (const t of holdings.slice(0, 10)) {
        const chg = t.change24h || 0;
        const pct = ((t.value || 0) / totalVal * 100).toFixed(1);
        h += '<tr>';
        h += `<td class="t-sym">${t.symbol || '?'}</td>`;
        h += `<td class="t-right">$${_fmtShort(t.value || 0)}</td>`;
        h += `<td class="t-right ${chg >= 0 ? 't-green' : 't-red'}">${chg >= 0 ? '+' : ''}${chg.toFixed(1)}%</td>`;
        h += `<td class="t-right t-muted">${pct}%</td>`;
        h += '</tr>';
      }
      h += '</tbody></table></div>';
    }
    return h;
  }
  afterRender(body) { _bindSearch(body, this, 'ph-addr', () => this.refresh()); }
}
customElements.define('portfolio-heatmap-panel', PortfolioHeatmapPanel);
