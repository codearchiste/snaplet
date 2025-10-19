// snaplet-loader.js (non-module version)
(function () {
  class SnapLet extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this._init();
    }

    async _init() {
      try {
        const scriptTag = this.querySelector('script[type="application/json"]');
        if (!scriptTag) throw new Error('Missing <script type="application/json"> inside <snap-let>');

        const config = JSON.parse(scriptTag.textContent);
        scriptTag.remove();

        // Load CSS
        if (config.css) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = config.css;
          this.shadow.appendChild(link);
        }

        // Load HTML (if any)
        let htmlContent = '';
        if (config.html) {
          try {
            const res = await fetch(config.html);
            if (!res.ok) throw new Error('Failed to load HTML: ' + res.status);
            htmlContent = await res.text();
          } catch (err) {
            console.error('[Snaplet] Failed to load HTML:', err);
          }
        }

        // Render HTML if provided
        if (htmlContent) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = htmlContent;
          this.shadow.appendChild(wrapper);
        }

        // Load JS script dynamically (non-module safe)
        if (config.entry) {
          await this._loadScript(config.entry, config);
        } else {
          throw new Error('Missing entry script');
        }
      } catch (err) {
        console.error('[Snaplet Load Error]', err);
        const errorBox = document.createElement('div');
        errorBox.style.border = '1px solid red';
        errorBox.style.padding = '10px';
        errorBox.style.background = '#fee';
        errorBox.textContent = '[Snaplet Error] ' + err.message;
        this.shadow.appendChild(errorBox);
      }
    }

    _loadScript(src, config) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src + (src.includes('?') ? '&' : '?') + 'v=' + (config.version || '1.0');
        script.onload = () => {
          if (window.snaplets && typeof window.snaplets[config.name] === 'function') {
            try {
              window.snaplets[config.name](this.shadow, config);
              resolve();
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error('Snaplet "' + config.name + '" not registered'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load ' + src));
        document.head.appendChild(script);
      });
    }
  }

  window.snaplets = window.snaplets || {};
  customElements.define('snap-let', SnapLet);
})();
