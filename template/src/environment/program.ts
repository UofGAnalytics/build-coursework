import { saveState } from '../util';
import { state } from './state';

const current = `program-${state.program}`;

document.documentElement.classList.add(current);

document.querySelectorAll('#programs input').forEach((elem) => {
  const input = elem as HTMLInputElement;
  input.checked = input.value === state.program;
});

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

  document.documentElement.classList.replace(current, newClass);
  state.program = program;
  saveState('environment', state);
}
