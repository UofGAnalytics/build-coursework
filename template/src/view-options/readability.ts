import { State, defaultState, saveState, state } from './util';

document.documentElement.style.setProperty('--fontSize', state.fontSize);
document.documentElement.style.setProperty('--lineSpacing', state.lineSpacing);
document.documentElement.style.setProperty('--letterSpacing', state.letterSpacing);
document.documentElement.style.setProperty('--lineWidth', state.lineWidth);

document.querySelectorAll('#readability .btn.minus').forEach((elem) => {
  elem.addEventListener('click', handleMinus);
});
document.querySelectorAll('#readability .btn.plus').forEach((elem) => {
  elem.addEventListener('click', handlePlus);
});

document.querySelectorAll('#readability .btn.reset').forEach((elem) => {
  elem.addEventListener('click', handleReset);
  const { currentValue, defaultValue } = getProps(elem);
  if (currentValue === Number(defaultValue)) {
    elem.classList.add('disabled');
  }
});

function handleMinus(e: Event) {
  const target = e.target as Element;
  if (target.classList.contains('disabled')) {
    return;
  }

  const props = getProps(target);

  const newValue = Math.max(props.min, props.currentValue - props.increment);
  if (newValue === props.min) {
    target.classList.add('disabled');
  } else {
    target.classList.remove('disabled');
  }

  const strValue = String(newValue);
  if (strValue === props.defaultValue) {
    props.reset.classList.add('disabled');
  } else {
    props.reset.classList.remove('disabled');
  }

  document.documentElement.style.setProperty(`--${props.name}`, strValue);
  state[props.name] = strValue;
  saveState(state);
}

function handlePlus(e: Event) {
  const target = e.target as Element;
  if (target.classList.contains('disabled')) {
    return;
  }

  const props = getProps(target);

  const newValue = Math.min(props.max, props.currentValue + props.increment);
  if (newValue === props.max) {
    target.classList.add('disabled');
  } else {
    target.classList.remove('disabled');
  }

  const strValue = String(newValue);
  if (strValue === defaultState[props.name]) {
    props.reset.classList.add('disabled');
  } else {
    props.reset.classList.remove('disabled');
  }

  document.documentElement.style.setProperty(`--${props.name}`, strValue);
  state[props.name] = strValue;
  saveState(state);
}

function handleReset(e: Event) {
  const target = e.target as Element;
  if (target.classList.contains('disabled')) {
    return;
  }

  const props = getProps(target);
  const strValue = defaultState[props.name];

  if (props.defaultValue === String(props.min)) {
    props.minus.classList.add('disabled');
  } else {
    props.minus.classList.remove('disabled');
  }

  if (props.defaultValue === String(props.max)) {
    props.plus.classList.add('disabled');
  } else {
    props.plus.classList.remove('disabled');
  }

  target.classList.add('disabled');
  document.documentElement.style.setProperty(`--${props.name}`, strValue);
  state[props.name] = String(strValue);
  saveState(state);
}

function getProps(elem: Element) {
  const li = elem.closest('li') as HTMLElement;
  const plus = li.querySelector('.btn.plus') as HTMLElement;
  const minus = li.querySelector('.btn.minus') as HTMLElement;
  const reset = li.querySelector('.btn.reset') as HTMLElement;
  const name = li.classList[0] as keyof State;
  return {
    li,
    name,
    plus,
    minus,
    reset,
    min: Number(li.dataset.min),
    max: Number(li.dataset.max),
    increment: Number(li.dataset.increment),
    currentValue: Number(state[name]),
    defaultValue: defaultState[name],
  };
}
