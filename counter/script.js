export default (element, config = {}) => {
  let count = 0;

  const container = document.createElement('div');
  container.className = 'snaplet-counter';

  const label = document.createElement('span');
  label.className = 'counter-label';
  label.textContent = config.label || 'Count: ';

  const value = document.createElement('span');
  value.className = 'counter-value';
  value.textContent = count;

  const button = document.createElement('button');
  button.className = 'counter-button';
  button.textContent = config.buttonText || 'Increase';
  button.onclick = () => {
    value.textContent = ++count;
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 150);
  };

  container.append(label, value, button);
  element.appendChild(container);
};
