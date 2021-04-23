import './styles/index.scss';

import { setHtmlFontSize } from './html-font-size';

// import { closeModal, openModal } from './modal';

setHtmlFontSize();
window.addEventListener('resize', setHtmlFontSize, false);

const $modalWrapper = document.getElementById('modal') as HTMLElement;
// const $modalContent = document.getElementById(
//   'modal-content'
// ) as HTMLElement;

document
  .getElementById('modal-close')
  ?.addEventListener('click', handleModalCloseClick);
document
  .getElementById('modal-bg')
  ?.addEventListener('click', handleModalCloseClick);

// TODO: this is a hack for dev environment and isn't
// necessary in production build
setTimeout(() => {
  document
    .getElementById('view-options')
    ?.addEventListener('click', handleViewOptionsClick);
}, 1000);

function handleViewOptionsClick() {
  $modalWrapper.classList.add('show');
}

function handleModalCloseClick() {
  $modalWrapper.classList.remove('show');
}

document
  .getElementById('select-theme')
  ?.addEventListener('change', handleSelectThemeChange);

let currentTheme = 'theme-light';
function handleSelectThemeChange(e: Event) {
  const $html = document.documentElement;
  const target = e.target as HTMLSelectElement;
  const newTheme = target.value;
  $html.classList.replace(currentTheme, newTheme);
  currentTheme = newTheme;
}
