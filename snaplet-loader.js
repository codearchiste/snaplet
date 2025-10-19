class SnapLet extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    try {
      const scriptTag = this.querySelector('script[type="application/json"]');
      if (!scriptTag) throw new Error('Missing <script type="application/json">');

      const config = JSON.parse(scriptTag.textContent);
      scriptTag.remove(); // Remove script tag to prevent display

      // Load CSS
      if (config.css) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = config.css;
        this.shadow.appendChild(link);
      }

      // Load JS module
      if (!config.entry) throw new Error("Missing entry JS module");
      const module = await import(config.entry);
      if (module.default && typeof module.default === 'function') {
        await module.default(this.shadow, config); // Pass Shadow DOM root
      } else {
        throw new Error("Entry module must export default function");
      }
    } catch (err) {
      console.error("Snaplet Load Error:", err);
      const errorBox = document.createElement('div');
      errorBox.style.border = "1px solid red";
      errorBox.style.padding = "10px";
      errorBox.style.backgroundColor = "#fee";
      errorBox.textContent = "Snaplet Load Error: " + err.message;
      this.shadow.appendChild(errorBox);
    }
  }
}

customElements.define('snap-let', SnapLet);
