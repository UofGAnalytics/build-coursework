setHtmlFontSize();
window.addEventListener('resize', setHtmlFontSize, false);

function setHtmlFontSize() {
  const min = 14;
  const max = 30;
  const width = Math.min(window.innerWidth, 1000 * 1.5);
  const fontSize = width / 80;
  const clamped = Math.max(min, Math.min(max, fontSize));
  document.documentElement.style.fontSize = `${clamped}px`;
}
