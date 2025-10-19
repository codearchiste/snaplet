class SnapLet extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      const configAttr = this.getAttribute('data-config');
      if (!configAttr) return console.error('Snaplet Load Error: Missing data-config');
  
      const config = JSON.parse(configAttr);
  
      // Load CSS
      if (config.css) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = config.css;
        this.shadowRoot.appendChild(link);
      }
  
      // Load HTML template
      let container = document.createElement('div');
      if (config.html) {
        fetch(config.html)
          .then(r => r.text())
          .then(html => {
            container.innerHTML = html;
          })
          .catch(err => console.warn('Failed to load HTML', err));
      }
      this.shadowRoot.appendChild(container);
  
      // Load JS as standard script
      if (config.entry) {
        const script = document.createElement('script');
        script.src = config.entry;
        script.onload = () => {
          if (typeof window[config.name] === 'function') {
            window[config.name](container, config);
          }
        };
        script.onerror = (err) => console.error('Snaplet JS Load Error', err);
        document.body.appendChild(script);
      }
    }
  }
  
  customElements.define('snap-let', SnapLet);
  