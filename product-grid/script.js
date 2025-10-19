export default async (element, config) => {
  try {
    // Always use these 3 demo products
    const products = [
      { name: 'Widget A', price: 19.99, image: 'https://picsum.photos/200?1' },
      { name: 'Widget B', price: 29.99, image: 'https://picsum.photos/200?2' },
      { name: 'Widget C', price: 9.99,  image: 'https://picsum.photos/200?3' }
    ];

    // Inline template for product card
    const templateHTML = `
      <div class="product-card">
        <img src="{{image}}" alt="{{name}}" />
        <h3>{{name}}</h3>
        <p>$ {{price}}</p>
        <button>{{buttonText}}</button>
      </div>
    `;

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'snaplet-product-grid';

    products.forEach(product => {
      let cardHTML = templateHTML
        .replace(/{{image}}/g, product.image)
        .replace(/{{name}}/g, product.name)
        .replace(/{{price}}/g, product.price.toFixed(2))
        .replace(/{{buttonText}}/g, config.buttonText || 'Add');

      const template = document.createElement('template');
      template.innerHTML = cardHTML.trim();
      const card = template.content.firstElementChild;

      // Add button click handlers
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
