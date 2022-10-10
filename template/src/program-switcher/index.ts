import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(`program-${state.program}`);

document
  .querySelectorAll('.program-switcher > ul > li')
  .forEach((elem) => {
    const element = elem as HTMLElement;
    console.log(element.dataset.program, state.program);
    if (element.dataset.program === state.program) {
      element.classList.add('active');
    }
    element.addEventListener('click', setProgram);
  });

document
  .querySelectorAll('.program-switcher > .program')
  .forEach((elem) => {
    const element = elem as HTMLElement;
    if (element.dataset.program === state.program) {
      element.classList.add('show');
    }
  });

function setProgram(e: Event) {
  const target = e.currentTarget as HTMLElement;
  const program = target.dataset.program as string;
  const newClass = `program-${program}`;

  if (!document.documentElement.classList.contains(newClass)) {
    const oldClass = `program-${state.program}`;
    document.documentElement.classList.replace(oldClass, newClass);
    state.program = program;
    saveState('environment', state);
  }
}
