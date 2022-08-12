import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(`program-${state.program}`);

document.querySelectorAll('#programs input').forEach((elem) => {
  const input = elem as HTMLInputElement;
  input.checked = input.value === state.program;
  elem.addEventListener('change', setProgram);
});

function setProgram(e: Event) {
  const target = e.currentTarget as HTMLInputElement;
  const program = target.value as string;
  const newClass = `program-${program}`;

  if (!document.documentElement.classList.contains(newClass)) {
    const oldClass = `program-${state.program}`;
    document.documentElement.classList.replace(oldClass, newClass);
    state.program = program;
    saveState('environment', state);
  }
}
