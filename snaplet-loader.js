// Snaplet Loader v0
// Author: Archiste
// License: Apache 2.0
// https://snaplet-web.github.io/

class SnapLet extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    try {
      const scriptTag = this.querySelector('script[type="application/json"]');
      if (!scriptTag) throw new Error('Missing <script type="application/json"> inside <snap-let>');

      const config = JSON.parse(scriptTag.textContent);
      scriptTag.remove();

      const debug = config.debug || false;

      const log = (...args) => { if (debug) console.log('[Snaplet]', ...args); };

      const reportError = (message, error = null) => {
        console.error('[Snaplet Error]', message, error);
        const errorBox = document.createElement('div');
        errorBox.style.border = '1px solid red';
        errorBox.style.background = '#fee';
        errorBox.style.color = '#900';
        errorBox.style.padding = '10px';
        errorBox.style.margin = '5px 0';
        errorBox.style.borderRadius = '4px';
        errorBox.style.fontFamily = 'monospace';
        errorBox.textContent = 'Snaplet Load Error: ' + message;
        this.shadow.appendChild(errorBox);
        if (debug && error?.stack) {
          const stack = document.createElement('pre');
          stack.style.whiteSpace = 'pre-wrap';
          stack.style.color = '#900';
          stack.textContent = error.stack;
          this.shadow.appendChild(stack);
        }
      };

      const fetchWithRetry = async (url, retries = 2, delay = 500) => {
        for (let i = 0; i <= retries; i++) {
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP error ' + res.status);
            return res;
          } catch (err) {
            if (i < retries) await new Promise(r => setTimeout(r, delay));
            else throw err;
          }
        }
      };

      // Load CSS
      if (config.css) {
        try {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = config.css;
          this.shadow.appendChild(link);
          log('CSS loaded:', config.css);
        } catch (err) {
          reportError('Failed to load CSS: ' + config.css, err);
        }
      }

      // Load HTML template
      let templateHTML = '';
      if (config.html) {
        try {
          const response = await fetchWithRetry(config.html);
          templateHTML = await response.text();
          log('HTML template loaded:', config.html);
        } catch (err) {
          reportError('Failed to load HTML template: ' + config.html, err);
        }
      }

      // Load JS module
      if (!config.entry) throw new Error('Missing entry JS module');
      try {
        // Using dynamic import
        const module = await import(config.entry);
        if (module?.default && typeof module.default === 'function') {
          await module.default(this.shadow, { ...config, templateHTML });
          log('JS module executed:', config.entry);
        } else {
          throw new Error('Entry module must export default function');
        }
      } catch (err) {
        reportError('Failed to load JS module: ' + config.entry, err);
      }

    } catch (err) {
      const msg = err.message || err;
      const errorBox = document.createElement('div');
      errorBox.style.border = "1px solid red";
      errorBox.style.padding = "10px";
      errorBox.style.backgroundColor = "#fee";
      errorBox.textContent = "Snaplet Load Error: " + msg;
      this.shadow.appendChild(errorBox);
      console.error('[Snaplet Load Error]', err);
    }
  }
}

// Define custom element
if (!customElements.get('snap-let')) {
  customElements.define('snap-let', SnapLet);
}
