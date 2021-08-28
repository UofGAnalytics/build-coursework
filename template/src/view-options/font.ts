import { saveState, state } from './util';

document.documentElement.classList.add(state.font);

const current = state.font.replace('font-', '');
document.querySelector(`#fonts .${current}`)?.classList.add('selected');

document.querySelectorAll('#fonts li').forEach((elem) => {
  elem.addEventListener('click', setFont);
});

function setFont(e: Event) {
  const target = e.target as Element;
  const name = `font-${target.classList[0]}`;
  const fonts = target.closest('#fonts') as Element;
  fonts.querySelectorAll('li').forEach((elem) => {
    elem.classList.remove('selected');
  });
  target.classList.add('selected');
  const main = document.querySelector('main') as Element;
  main.classList.replace(state.font, name);
  state.font = name;
  saveState(state);
}
