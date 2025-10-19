export default async (element, config) => {
  try {
    // Built-in demo products
    const demoProducts = [
      { name: 'Widget A1', price: 19.20, image: 'https://picsum.photos/200?4' },
      { name: 'Widget B2', price: 29.20, image: 'https://picsum.photos/200?5' },
      { name: 'Widget C3', price: 9.20,  image: 'https://picsum.photos/200?6' }
    ];

    // Combine built-in products with config.products (if any)
    const userProducts = Array.isArray(config.products) ? config.products : [];
    const products = [...demoProducts, ...userProducts];

    if (!config.html) throw new Error("template.html URL is required");
    const res = await fetch(config.html);
    if (!res.ok) throw new Error("Failed to fetch template.html");
    const templateHTML = await res.text();

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'snaplet-product-grid';

    products.forEach(product => {
      // Replace placeholders in the template
      let cardHTML = templateHTML
        .replace(/{{image}}/g, product.image)
        .replace(/{{name}}/g, product.name)
        .replace(/{{price}}/g, product.price.toFixed(2))
        .replace(/{{buttonText}}/g, config.buttonText || 'Add');

      const template = document.createElement('template');
      template.innerHTML = cardHTML.trim();
      const card = template.content.firstElementChild;

      if (!card) return;

      // Add button handler
      const button = card.querySelector('button');
      if (button) {
        button.addEventListener('click', () => {
          alert(`You clicked on ${product.name} ($${product.price.toFixed(2)})`);
          console.log('Product clicked:', product);
        });
      }

      grid.appendChild(card);
    });

    element.appendChild(grid);

  } catch (err) {
    console.error("Snaplet Load Error:", err);
    const errorBox = document.createElement('div');
    errorBox.className = 'snaplet-error';
    errorBox.textContent = "Snaplet Load Error: " + err.message;
    element.appendChild(errorBox);
  }
};
