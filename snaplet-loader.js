class SnapLet extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.config = null;
    this.container = document.createElement('div');
    this.shadow.appendChild(this.container);
  }

  connectedCallback() {
    this._init().catch(err => this._showError(err));
  }

  /** Initialize Snaplet */
  async _init() {
    this.config = this._parseConfig();
    if (!this.config) return;

    if (this.config.lazy) {
      this._observeLazyLoad();
    } else {
      await this._loadSnaplet();
    }
  }

  /** Parse JSON config from <script> or data-config attribute */
  _parseConfig() {
    let config = null;
    try {
      const scriptTag = this.querySelector('script[type="application/json"]');
      if (scriptTag) {
        config = JSON.parse(scriptTag.textContent);
        scriptTag.remove();
      } else if (this.dataset.config) {
        config = JSON.parse(this.dataset.config);
      } else {
        throw new Error('Missing Snaplet configuration');
      }
      if (this.config?.debug) console.log('[Snaplet] Config loaded:', config);
    } catch (err) {
      this._showError(err);
    }
    return config;
  }

  /** Lazy load using IntersectionObserver */
  _observeLazyLoad() {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        this._loadSnaplet().catch(err => this._showError(err));
      }
    }, { rootMargin: '200px' });
    observer.observe(this);
  }

  /** Load CSS, HTML, and JS module */
  async _loadSnaplet() {
    if (!this.config) return;

    await this._loadCSS(this.config.css);

    if (this.config.html) await this._loadHTML(this.config.html);

    if (!this.config.entry) throw new Error('Missing JS entry module');

    await this._loadJSModule(this.config.entry, this.config);

    this.dispatchEvent(new CustomEvent('snaplet-ready', { detail: this.config }));

    if (this.config.debug) console.log('[Snaplet] Loaded successfully');
  }

  /** Load CSS */
  async _loadCSS(css) {
    if (!css) return;
    const links = Array.isArray(css) ? css : [css];
    links.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      this.shadow.appendChild(link);
    });
  }

  /** Load HTML template */
  async _loadHTML(html) {
    try {
      if (html.startsWith('data:text/html;base64,')) {
        const decoded = atob(html.split(',')[1]);
        this.container.innerHTML = decoded;
      } else {
        const res = await fetch(html);
        if (!res.ok) throw new Error(`Failed to load HTML: ${res.status}`);
        const text = await res.text();
        this.container.innerHTML = text;
      }
    } catch (err) {
      console.warn('[Snaplet] Failed to load HTML:', err);
    }
  }

  /** Load JS module */
  async _loadJSModule(entry, config) {
    try {
      let module;
      if (entry.startsWith('data:text/javascript;base64,')) {
        const scriptContent = atob(entry.split(',')[1]);
        const blob = new Blob([scriptContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        module = await import(url);
        URL.revokeObjectURL(url);
      } else {
        module = await import(entry + (config.version ? `?v=${config.version}` : ''));
      }

      if (module.default && typeof module.default === 'function') {
        await module.default(this.container, config);
      } else {
        throw new Error('JS module must export default function');
      }
    } catch (err) {
      throw new Error('Failed to load JS module: ' + err.message);
    }
  }

  /** Show error box */
  _showError(err) {
    console.error('[Snaplet Load Error]', err);
    this.container.innerHTML = '';
    const box = document.createElement('div');
    box.style.border = '1px solid red';
    box.style.background = '#fee';
    box.style.padding = '10px';
    box.style.fontFamily = 'sans-serif';
    box.style.whiteSpace = 'pre-wrap';
    box.textContent = 'Snaplet Load Error: ' + (err.message || err);
    this.shadow.appendChild(box);
    this.dispatchEvent(new CustomEvent('snaplet-error', { detail: err }));
  }

  /** Public API to refresh/update config dynamically */
  async refresh(newConfig) {
    if (!newConfig) return;
    this.config = { ...this.config, ...newConfig };
    this.container.innerHTML = '';
    await this._loadSnaplet().catch(err => this._showError(err));
  }
}

customElements.define('snap-let', SnapLet);