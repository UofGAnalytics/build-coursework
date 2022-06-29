import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(state.program);

document.querySelectorAll('#programs label').forEach((elem) => {
  elem.addEventListener('click', setProgram);
});

function setProgram(e: Event) {
  const target = e.currentTarget as Element;
  const program = target.getAttribute('data-program') as string;
  const newClass = `program-${program}`;

  if (document.documentElement.classList.contains(newClass)) {
    return;
  }

  document.documentElement.classList.replace(state.program, newClass);
  state.program = newClass;
  saveState('environment', state);
}
