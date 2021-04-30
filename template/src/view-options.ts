type State = {
  theme: string;
};

const defaultState: State = {
  theme: 'theme-light',
};

// initialise
const state = getSavedState();
document.documentElement.classList.add(...Object.values(state));

// elements
const openBtn = document.getElementById('view-options-trigger') as Element;
const theme = document.getElementById('select-theme') as HTMLSelectElement;

// events
openBtn.addEventListener('click', toggleOpen);
// theme.addEventListener('change', setTheme);

function toggleOpen() {
  document.documentElement.classList.toggle('view-options-open');
}

function setTheme(e: Event) {
  const { value } = e.target as HTMLSelectElement;
  document.documentElement.classList.replace(state.theme, value);
  state.theme = value;
  saveState(state);
}

function getSavedState(): State {
  const saved = localStorage.getItem('view-options');
  return saved ? JSON.parse(saved) : defaultState;
}

function saveState(state: State) {
  localStorage.setItem('view-options', JSON.stringify(state));
}
