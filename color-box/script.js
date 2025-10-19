export default (element, config) => {
  const box = document.createElement('div');
  box.style.width = '100%';
  box.style.height = '150px';
  box.style.borderRadius = '8px';
  box.style.display = 'flex';
  box.style.alignItems = 'center';
  box.style.justifyContent = 'center';
  box.style.fontSize = '18px';
  box.style.fontWeight = 'bold';
  box.style.color = '#fff';
  box.style.cursor = 'pointer';
  box.style.transition = 'background 0.3s';
  box.textContent = config.label || 'Click me!';
  box.style.backgroundColor = getRandomColor();

  box.onclick = () => { box.style.backgroundColor = getRandomColor(); };

  element.appendChild(box);

  function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
};
