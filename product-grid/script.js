window.SnapletInit = async (element, config) => {
  const products = config.products || [];
  if (!products.length) return;

  if (!config.html) throw new Error("template.html URL is required");
  const response = await fetch(config.html);
  if (!response.ok) throw new Error("Failed to fetch template.html");
  const templateHTML = await response.text();

  const grid = document.createElement('div');
  grid.className = 'snaplet-product-grid';

  products.forEach(product => {
    const cardHTML = templateHTML
      .replace(/{{image}}/g, product.image)
      .replace(/{{name}}/g, product.name)
      .replace(/{{price}}/g, product.price.toFixed(2))
      .replace(/{{buttonText}}/g, config.buttonText || 'Add');

    const temp = document.createElement('div');
    temp.innerHTML = cardHTML;

    Array.from(temp.children).forEach(node => {
      const btn = node.querySelector('button');
      if (btn) btn.onclick = () => alert(product.name + ' added to cart');
      grid.appendChild(node);
    });
  });

  element.appendChild(grid);
};
