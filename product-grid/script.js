window.snaplets = window.snaplets || {};
window.snaplets["product-grid"] = (root, config) => {
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="product-grid">
      ${config.products.map(p => `
        <div class="product">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button>${config.buttonText || 'Buy'}</button>
        </div>
      `).join('')}
    </div>
  `;
  root.appendChild(container);
};
