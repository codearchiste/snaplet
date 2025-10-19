export default async (element, config) => {
  const products = config.products || [];
  if (!products.length) return;

  if (!config.html) throw new Error("template.html URL is required");
  const response = await fetch(config.html);
  if (!response.ok) throw new Error("Failed to fetch template.html");
  const templateHTML = await response.text();

  // Create grid container
  const grid = document.createElement('div');
  grid.className = 'snaplet-product-grid';

  products.forEach(product => {
    // Replace all placeholders
    const cardHTML = templateHTML
      .replace(/{{image}}/g, product.image)
      .replace(/{{name}}/g, product.name)
      .replace(/{{price}}/g, product.price.toFixed(2))
      .replace(/{{buttonText}}/g, config.buttonText || 'Add');

    // Convert string to DOM and append only elements
    const temp = document.createElement('div');
    temp.innerHTML = cardHTML;

    Array.from(temp.childNodes)
      .filter(node => node.nodeType === Node.ELEMENT_NODE)
      .forEach(node => grid.appendChild(node));
  });

  element.appendChild(grid);
};
