export default (element, config) => {
  const targetDate = new Date(config.targetDate || new Date().getTime() + 60000);
  const label = config.label || 'Countdown:';

  const container = document.createElement('div');
  container.style.textAlign = 'center';
  const title = document.createElement('div');
  title.textContent = label;
  title.style.fontWeight = 'bold';
  const timer = document.createElement('div');
  timer.style.fontSize = '18px';

  container.append(title, timer);
  element.appendChild(container);

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      timer.textContent = 'Time\'s up!';
      clearInterval(interval);
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    timer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
};
