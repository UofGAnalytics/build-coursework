import { saveState } from '../util';
import { state } from './state';

const current = `platform-${state.platform}`;

document.documentElement.classList.add(current);

document.querySelectorAll('#platforms input').forEach((elem) => {
  const input = elem as HTMLInputElement;
  input.checked = input.value === state.platform;
});

document.querySelectorAll('#platforms label').forEach((elem) => {
  elem.addEventListener('click', setPlatform);
});

function setPlatform(e: Event) {
  const target = e.currentTarget as Element;
  const platform = target.getAttribute('data-platform') as string;
  const newClass = `platform-${platform}`;

  console.log({ platform, newClass });

  if (document.documentElement.classList.contains(newClass)) {
    return;
  }

  document.documentElement.classList.replace(current, newClass);
  state.platform = platform;
  saveState('environment', state);
}
