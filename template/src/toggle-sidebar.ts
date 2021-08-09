document
  .querySelector('#root > .hamburger-icon')
  ?.addEventListener('click', openSidebar);
document
  .querySelector('.logo > .hamburger-icon')
  ?.addEventListener('click', closeSidebar);

function openSidebar() {
  const root = document.getElementById('root') as HTMLElement;
  root.classList.remove('hide-sidebar');
}

function closeSidebar() {
  const root = document.getElementById('root') as HTMLElement;
  root.classList.add('hide-sidebar');
}
