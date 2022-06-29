import { saveState } from '../util';
import { state } from './state';

document.documentElement.classList.add(state.platform);

document.querySelectorAll('#platforms label').forEach((elem) => {
  elem.addEventListener('click', setPlatform);
});

function setPlatform(e: Event) {
  const target = e.currentTarget as Element;
  const platform = target.getAttribute('data-platform') as string;
  const newClass = `platform-${platform}`;

  if (document.documentElement.classList.contains(newClass)) {
    return;
  }

  document.documentElement.classList.replace(state.platform, newClass);
  state.platform = newClass;
  saveState('environment', state);
}
