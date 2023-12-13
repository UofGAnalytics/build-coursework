import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(`language-${state.language}`);

document
  .querySelectorAll('.language-switcher > ul > li')
  .forEach((elem) => {
    const element = elem as HTMLElement;
    console.log(element.dataset.language, state.language);
    if (element.dataset.language === state.language) {
      element.classList.add('active');
    }
    element.addEventListener('click', setLanguage);
  });

document
  .querySelectorAll('.language-switcher > .language')
  .forEach((elem) => {
    const element = elem as HTMLElement;
    if (element.dataset.language === state.language) {
      element.classList.add('show');
    }
  });

function setLanguage(e: Event) {
  const target = e.currentTarget as HTMLElement;
  const language = target.dataset.language as string;
  const newClass = `language-${language}`;

  if (!document.documentElement.classList.contains(newClass)) {
    const oldClass = `language-${state.language}`;
    document.documentElement.classList.replace(oldClass, newClass);
    state.language = language;
    saveState('environment', state);
  }
}
