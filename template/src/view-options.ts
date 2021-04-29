import { openModal } from './modal';

type State = {
  theme: string;
};

const defaultState: State = {
  theme: 'theme-light',
};

const state = getSavedState();
document.documentElement.classList.add(state.theme);

const openBtn = document.getElementById('view-options') as Element;
openBtn.addEventListener('click', () => {
  openModal(template);
  init();
});

function init() {
  const theme = document.getElementById('select-theme') as HTMLSelectElement;
  theme.value = state.theme;
  theme.addEventListener('change', setTheme);
}

function setTheme(e: Event) {
  const { value } = e.target as HTMLSelectElement;
  document.documentElement.classList.replace(state.theme, value);
  state.theme = value;
  saveState(state);
}

function saveState(state: State) {
  localStorage.setItem('view-options', JSON.stringify(state));
}

function getSavedState(): State {
  const saved = localStorage.getItem('view-options');
  return saved === null ? defaultState : JSON.parse(saved);
}

const template = `
  <div class="form-block">
    <label for="select-theme">Select theme</label>
    <select id="select-theme">
      <option value="theme-light">Light</option>
      <option value="theme-dark">Dark</option>
    </select>
  </div>
`;
