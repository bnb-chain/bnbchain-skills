// BNB Chain Skills — BasePanel Web Component

class BasePanel extends HTMLElement {
  static skill = '';
  static defaultTitle = 'Panel';

  constructor() {
    super();
    this._interval = null;
    this._refreshRate = 10000;
    this._loading = false;
    this._data = null;
    this._error = null;
    this._firstLoad = true;
  }

  connectedCallback() {
    this.classList.add('panel');
    this.render();
    this.startAutoRefresh();
    this._visCb = () => {
      if (document.hidden) this.stopAutoRefresh();
      else this.startAutoRefresh();
    };
    document.addEventListener('visibilitychange', this._visCb);
  }

  disconnectedCallback() {
    this.stopAutoRefresh();
    if (this._visCb) document.removeEventListener('visibilitychange', this._visCb);
  }

  render() {
    const title = this.getAttribute('title') || this.constructor.defaultTitle;
    const skill = this.constructor.skill;
    this.innerHTML = `
      <div class="panel-header">
        <div>
          <span class="panel-title">${title}</span>
          ${skill ? `<span class="panel-skill">${skill}</span>` : ''}
        </div>
        <div class="panel-actions">
          <button class="panel-refresh" title="Refresh"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg></button>
        </div>
      </div>
      <div class="panel-body"><div class="panel-loading">Loading...</div></div>
    `;
    this.querySelector('.panel-refresh')?.addEventListener('click', () => this.refresh());
    this.refresh();
  }

  async refresh() {
    if (this._loading) return;
    this._loading = true;
    const body = this.querySelector('.panel-body');
    try {
      const data = await this.fetchData();
      this._data = data;
      this._error = null;
      this._firstLoad = false;
      if (body) {
        body.innerHTML = this.renderContent(this._data);
        this.afterRender(body);
      }
    } catch (e) {
      this._error = e;
      if (!this._data || this._firstLoad) {
        if (body) body.innerHTML = `<div class="panel-error">Error: ${_esc(e.message || 'Unknown')}</div>`;
      }
    }
    this._loading = false;
  }

  async fetchData() { return null; }
  renderContent(data) { return '<div class="panel-loading">No data</div>'; }
  afterRender(body) {}

  startAutoRefresh() {
    this.stopAutoRefresh();
    if (this._refreshRate > 0) this._interval = setInterval(() => this.refresh(), this._refreshRate);
  }

  stopAutoRefresh() {
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
  }
}

function _esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function _fmt(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString('en-US');
}

window.BasePanel = BasePanel;
window._esc = _esc;
window._fmt = _fmt;
