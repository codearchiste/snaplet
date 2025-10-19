(function(){
  window.SnapletComponents = window.SnapletComponents || {};

  SnapletComponents['product-grid'] = async function(element, config){
    const products = config.products || [];
    if (!products.length) return;

    if (!config.html) throw new Error("template.html URL is required");

    try {
      // Fetch the template
      const response = await fetch(config.html);
      if (!response.ok) throw new Error("Failed to fetch template.html");
      const templateHTML = await response.text();

      // Create grid container
      const grid = document.createElement('div');
      grid.className = 'snaplet-product-grid';

      products.forEach(function(product){
        // Replace placeholders in template
        const cardHTML = templateHTML
          .replace(/{{image}}/g, product.image)
          .replace(/{{name}}/g, product.name)
          .replace(/{{price}}/g, product.price.toFixed(2))
          .replace(/{{buttonText}}/g, config.buttonText || 'Add');

        // Convert string to DOM and append only elements
        const temp = document.createElement('div');
        temp.innerHTML = cardHTML;

        Array.from(temp.children).forEach(function(node){
          // Optional: handle button click inside template
          const btn = node.querySelector('button');
          if (btn) btn.onclick = () => alert(product.name + ' added to cart');

          grid.appendChild(node);
        });
      });

      element.appendChild(grid);
    } catch(err){
      console.error("Snaplet error:", err);
      const errorBox = document.createElement('div');
      errorBox.style.border = '1px solid red';
      errorBox.style.padding = '10px';
      errorBox.style.backgroundColor = '#fee';
      errorBox.textContent = 'Snaplet Load Error: ' + err.message;
      element.appendChild(errorBox);
    }
  };
})();
