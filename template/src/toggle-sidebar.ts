document.querySelector('#root > .hamburger')?.addEventListener('click', openSidebar);
document.querySelector('.logo > .hamburger')?.addEventListener('click', closeSidebar);

function openSidebar() {
  document.documentElement.classList.remove('hide-sidebar');
}

function closeSidebar() {
  document.documentElement.classList.add('hide-sidebar');
}
