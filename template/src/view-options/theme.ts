import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(state.theme);

const current = state.theme.replace('theme-', '');
document.querySelector(`#themes .${current}`)?.classList.add('selected');

document.querySelectorAll('#themes li').forEach((elem) => {
  elem.addEventListener('click', setTheme);
});

function setTheme(e: Event) {
  const target = e.target as Element;
  const name = `theme-${target.classList[0]}`;
  const themes = target.closest('#themes') as Element;
  themes.querySelectorAll('li').forEach((elem) => {
    elem.classList.remove('selected');
  });
  target.classList.add('selected');
  document.documentElement.classList.replace(state.theme, name);
  state.theme = name;
  saveState('view-options', state);
}
