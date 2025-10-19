class SnapLet extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    try {
      const scriptTag = this.querySelector('script[type="application/json"]');
      if (!scriptTag) throw new Error("Missing <script type=\"application/json\"> inside <snap-let>");

      const config = JSON.parse(scriptTag.textContent);
      scriptTag.remove();

      // 🧩 Load CSS safely (works across domains)
      if (config.css) {
        try {
          const res = await fetch(config.css);
          if (!res.ok) throw new Error(`Failed to load CSS: ${res.status}`);
          const cssText = await res.text();
          const style = document.createElement('style');
          style.textContent = cssText;
          this.shadow.appendChild(style);
        } catch (cssErr) {
          console.warn("[Snaplet] CSS load failed:", cssErr);
        }
      }

      // 🧠 Load HTML (optional)
      if (config.html) {
        try {
          const res = await fetch(config.html);
          if (!res.ok) throw new Error(`Failed to load HTML: ${res.status}`);
          const htmlText = await res.text();
          const wrapper = document.createElement('div');
          wrapper.innerHTML = htmlText;
          this.shadow.appendChild(wrapper);
        } catch (htmlErr) {
          console.warn("[Snaplet] HTML load failed:", htmlErr);
        }
      }

      // ⚙️ Load JS entry
      if (!config.entry) throw new Error("Missing entry module");
      const module = await import(config.entry);
      if (module.default && typeof module.default === "function") {
        await module.default(this.shadow, config);
      } else {
        throw new Error("Entry module must export a default function");
      }

    } catch (err) {
      console.error("[Snaplet Load Error]", err);
      const errorBox = document.createElement("div");
      errorBox.style.border = "1px solid red";
      errorBox.style.padding = "10px";
      errorBox.style.backgroundColor = "#fee";
      errorBox.textContent = "Snaplet Load Error: " + err.message;
      this.shadow.appendChild(errorBox);
    }
  }
}

customElements.define("snap-let", SnapLet);
