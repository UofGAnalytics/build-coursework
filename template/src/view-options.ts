import { openModal } from './modal';

const state = {
  theme: 'theme-light',
};

const template = `
  <div class="form-block">
    <label for="select-theme">Select theme</label>
    <select id="select-theme">
      <option value="theme-light">Light</option>
      <option value="theme-dark">Dark</option>
    </select>
  </div>
`;

document.getElementById('view-options')?.addEventListener('click', () => {
  openModal(template);
  init();
});

function init() {
  const themeSelect = document.getElementById('select-theme');
  if (themeSelect) {
    const elem = themeSelect as HTMLSelectElement;
    elem.value = state.theme;
    elem.addEventListener('change', setTheme);
  }
}

function setTheme(e: Event) {
  const { value } = e.target as HTMLSelectElement;
  document.documentElement.classList.replace(state.theme, value);
  state.theme = value;
}
