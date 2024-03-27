import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(
  `plot-accessibility-${state.plotAccessibility}`,
);

document
  .querySelectorAll('.plot-accessibility-switcher > ul > li')
  .forEach((elem) => {
    const element = elem as HTMLElement;
    console.log(
      element.dataset.plotAccessibility,
      state.plotAccessibility,
    );
    if (element.dataset.plotAccessibility === state.plotAccessibility) {
      element.classList.add('active');
    }
    element.addEventListener('click', setProgram);
  });

document
  .querySelectorAll('.plot-accessibility-switcher > .plot-accessibility')
  .forEach((elem) => {
    const element = elem as HTMLElement;
    if (element.dataset.plotAccessibility === state.plotAccessibility) {
      element.classList.add('show');
    }
  });

function setProgram(e: Event) {
  const target = e.currentTarget as HTMLElement;
  const plotAccessibility = target.dataset.plotAccessibility as string;
  const newClass = `plot-accessibility-${plotAccessibility}`;

  if (!document.documentElement.classList.contains(newClass)) {
    const oldClass = `plot-accessibility-${state.plotAccessibility}`;
    document.documentElement.classList.replace(oldClass, newClass);
    state.plotAccessibility = plotAccessibility;
    saveState('environment', state);
  }
}
