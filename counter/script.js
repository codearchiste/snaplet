export default (element, config) => {
  let count = 0;
  const container = document.createElement('div');
  const label = document.createElement('span');
  label.textContent = config.label || 'Count: ';
  const value = document.createElement('span');
  value.textContent = count;
  const button = document.createElement('button');
  button.textContent = config.buttonText || 'Increase';
  button.onclick = () => value.textContent = ++count;
  container.append(label, value, button);
  element.appendChild(container);
};
