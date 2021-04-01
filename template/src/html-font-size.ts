setHtmlFontSize();
window.addEventListener('resize', setHtmlFontSize, false);

function setHtmlFontSize() {
  const min = 14;
  const max = 30;
  const fontSize = window.innerWidth / 80;
  const clamped = Math.max(min, Math.min(max, fontSize));
  document.documentElement.style.fontSize = `${clamped}px`;
}
