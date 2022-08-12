import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(`platform-${state.platform}`);

document.querySelectorAll('#platforms input').forEach((elem) => {
  const input = elem as HTMLInputElement;
  input.checked = input.value === state.platform;
  elem.addEventListener('change', setPlatform);
});

function setPlatform(e: Event) {
  const target = e.currentTarget as HTMLInputElement;
  const platform = target.value as string;
  const newClass = `platform-${platform}`;

  if (!document.documentElement.classList.contains(newClass)) {
    const oldClass = `platform-${state.platform}`;
    document.documentElement.classList.replace(oldClass, newClass);
    state.platform = platform;
    saveState('environment', state);
  }
}
