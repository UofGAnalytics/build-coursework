document.querySelector('#root > .hamburger-icon')?.addEventListener('click', openSidebar);
document.querySelector('.logo > .hamburger-icon')?.addEventListener('click', closeSidebar);

function openSidebar() {
  document.documentElement.classList.remove('hide-sidebar');
}

function closeSidebar() {
  document.documentElement.classList.add('hide-sidebar');
}
