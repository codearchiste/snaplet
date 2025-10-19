(() => {
  class SnapLet extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
      try {
        await this._init();
      } catch (err) {
        console.error('[Snaplet Load Error]', err);
        this.shadow.innerHTML = `<pre style="color:red;">Snaplet Load Error: ${err}</pre>`;
      }
    }

    async _init() {
      const src = this.getAttribute('src');
      if (!src) throw new Error('Missing src attribute on <snap-let>');

      // --- Get JSON config (optional) ---
      const scriptTag = this.querySelector('script[type="application/json"]');
      let config = {};
      if (scriptTag) {
        try {
          config = JSON.parse(scriptTag.textContent);
        } catch (err) {
          console.error('[Snaplet Config Error]', err);
        }
      } else {
        console.warn('[Snaplet Warning] No <script type="application/json"> found, continuing with defaults.');
      }

      // --- Load external JS (CORS-safe dynamic import) ---
      const fullSrc = this._resolveURL(src);
      let module;
      try {
        module = await import(/* @vite-ignore */ fullSrc);
      } catch (err) {
        throw new Error(`Failed to load JS module: ${fullSrc}\n${err}`);
      }

      if (!module || typeof module.default !== 'function') {
        throw new Error(`Invalid module structure for: ${fullSrc}`);
      }

      // --- Call module default export (returns HTML or function) ---
      let content;
      try {
        const output = module.default(config, this);
        if (output instanceof HTMLElement) {
          content = output.outerHTML;
        } else if (typeof output === 'string') {
          content = output;
        } else if (output instanceof Promise) {
          content = await output;
        } else {
          content = String(output);
        }
      } catch (err) {
        throw new Error(`Error running module default export: ${err}`);
      }

      // --- Inject HTML into Shadow DOM ---
      this.shadow.innerHTML = `
        <style>
          :host {
            display: block;
            contain: content;
          }
          .snaplet-content {
            all: initial;
            display: block;
            font-family: inherit;
            color: inherit;
          }
        </style>
        <div class="snaplet-content">${content}</div>
      `;
    }

    _resolveURL(src) {
      // Adds ?v=cacheBuster or keeps ?v=version already present
      const versioned = src.includes('?v=') ? src : `${src}?v=${Date.now()}`;
      if (/^https?:\/\//.test(versioned)) return versioned;
      // relative paths support (Cloudflare/GitHub/GitLab Pages)
      const base = window.location.origin;
      return `${base}/${versioned.replace(/^\//, '')}`;
    }
  }

  // --- Define custom element globally ---
  if (!customElements.get('snap-let')) {
    customElements.define('snap-let', SnapLet);
  }

  console.log('%c✅ Snaplet Engine Loaded', 'color: limegreen; font-weight: bold;');
})();
