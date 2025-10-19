// product-grid/script.js (plain JS)
window['productGrid'] = (element, config) => {
  const products = config.products || [];
  if (!products.length) return;

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
  grid.style.gap = '10px';

  products.forEach(p => {
    const card = document.createElement('div');
    card.style.border = '1px solid #ccc';
    card.style.borderRadius = '6px';
    card.style.padding = '5px';
    card.style.textAlign = 'center';

    const img = document.createElement('img');
    img.src = p.image;
    img.style.width = '100%';
    img.style.borderRadius = '4px';

    const name = document.createElement('div');
    name.textContent = p.name;

    const price = document.createElement('div');
    price.textContent = '$' + p.price.toFixed(2);

    const btn = document.createElement('button');
    btn.textContent = config.buttonText || 'Add';
    btn.onclick = () => alert(p.name + ' added to cart');

    card.append(img, name, price, btn);
    grid.appendChild(card);
  });

  element.appendChild(grid);
};
