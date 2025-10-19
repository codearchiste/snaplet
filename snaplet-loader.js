class SnapLet extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    try {
      const config = this._getConfig();
      if (!config) return;

      await this._loadCSS(config.css);
      if (config.html) this._injectHTML(config.html);

      await this._loadJSModule(config.entry, config);
    } catch (err) {
      this._showError(err);
    }
  }

  /** Parse JSON config from child <script type="application/json"> */
  _getConfig() {
    const scriptTag = this.querySelector('script[type="application/json"]');
    if (!scriptTag) {
      this._showError(new Error('Missing <script type="application/json">'));
      return null;
    }
    let config;
    try {
      config = JSON.parse(scriptTag.textContent);
    } catch (err) {
      this._showError(new Error('Invalid JSON in <script>: ' + err.message));
      return null;
    }
    scriptTag.remove(); // Remove script tag from DOM
    return config;
  }

  /** Load external CSS into shadow root */
  async _loadCSS(href) {
    if (!href) return;
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      this.shadow.appendChild(link);
    } catch (err) {
      console.warn('Failed to load CSS:', err);
    }
  }

  /** Inject optional HTML template */
  _injectHTML(html) {
    if (!html) return;
    const container = document.createElement('div');
    container.innerHTML = html;
    this.shadow.appendChild(container);
  }

  /** Load JS module dynamically and execute default export */
  async _loadJSModule(entry, config) {
    if (!entry) throw new Error('Missing entry JS module');
    try {
      const module = await import(entry);
      if (module.default && typeof module.default === 'function') {
        await module.default(this.shadow, config);
      } else {
        throw new Error('Entry module must export a default function');
      }
    } catch (err) {
      throw new Error('JS module load failed: ' + err.message);
    }
  }

  /** Display error box in shadow DOM */
  _showError(err) {
    console.error('Snaplet Load Error:', err);
    const box = document.createElement('div');
    box.style.border = '1px solid red';
    box.style.background = '#fee';
    box.style.padding = '10px';
    box.style.fontFamily = 'sans-serif';
    box.style.whiteSpace = 'pre-wrap';
    box.textContent = 'Snaplet Load Error: ' + (err.message || err);
    this.shadow.appendChild(box);
  }
}

customElements.define('snap-let', SnapLet);
