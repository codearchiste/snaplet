// script.js for Snaplet Product Grid
export default async (element, config) => {
  try {
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
      // Replace placeholders
      const cardHTML = templateHTML
        .replace(/{{image}}/g, product.image)
        .replace(/{{name}}/g, product.name)
        .replace(/{{price}}/g, product.price.toFixed(2))
        .replace(/{{buttonText}}/g, config.buttonText || 'Add');

      // Use <template> for safe parsing
      const template = document.createElement('template');
      template.innerHTML = cardHTML.trim();
      const card = template.content.firstElementChild;

      if (!card) return; // skip if template is empty

      // Attach button click handler
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
