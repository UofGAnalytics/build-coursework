import { State, defaultState, saveState, state } from './util';

document.documentElement.style.setProperty('--fontSize', state.fontSize);
document.documentElement.style.setProperty(
  '--lineSpacing',
  state.lineSpacing
);
document.documentElement.style.setProperty(
  '--letterSpacing',
  state.letterSpacing
);
document.documentElement.style.setProperty('--lineWidth', state.lineWidth);

document.querySelectorAll('#readability .btn.minus').forEach((elem) => {
  elem.addEventListener('click', handleMinus);
});
document.querySelectorAll('#readability .btn.plus').forEach((elem) => {
  elem.addEventListener('click', handlePlus);
});

document.querySelectorAll('#readability .btn.reset').forEach((elem) => {
  elem.addEventListener('click', handleReset);
  const { currentValue, defaultValue } = getProps(elem as HTMLElement);
  if (currentValue === Number(defaultValue)) {
    elem.classList.add('disabled');
  }
});

function handleMinus(e: Event) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('disabled')) {
    return;
  }

  const props = getProps(target);

  const newValue = Math.max(
    props.min,
    props.currentValue - props.increment
  );

  setDisabledClasses(newValue, props);

  const strValue = String(newValue);
  document.documentElement.style.setProperty(`--${props.name}`, strValue);
  state[props.name] = strValue;
  saveState(state);
}

function handlePlus(e: Event) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('disabled')) {
    return;
  }

  const props = getProps(target);

  const newValue = Math.min(
    props.max,
    props.currentValue + props.increment
  );

  setDisabledClasses(newValue, props);

  const strValue = String(newValue);
  document.documentElement.style.setProperty(`--${props.name}`, strValue);
  state[props.name] = strValue;
  saveState(state);
}

function handleReset(e: Event) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('disabled')) {
    return;
  }

  const props = getProps(target);
  setDisabledClasses(Number(props.defaultValue), props);

  target.classList.add('disabled');
  document.documentElement.style.setProperty(
    `--${props.name}`,
    props.defaultValue
  );
  state[props.name] = props.defaultValue;
  saveState(state);
}

function setDisabledClasses(newValue: number, props: Props) {
  const tolerance = 0.01;

  if (Math.abs(newValue - props.min) < tolerance) {
    props.minus.classList.add('disabled');
  } else {
    props.minus.classList.remove('disabled');
  }

  if (Math.abs(props.max - newValue) < tolerance) {
    props.plus.classList.add('disabled');
  } else {
    props.plus.classList.remove('disabled');
  }

  if (Math.abs(Number(props.defaultValue) - newValue) < tolerance) {
    props.reset.classList.add('disabled');
  } else {
    props.reset.classList.remove('disabled');
  }
}

type Props = {
  li: HTMLLIElement;
  name: keyof State;
  plus: HTMLElement;
  minus: HTMLElement;
  reset: HTMLElement;
  min: number;
  max: number;
  increment: number;
  currentValue: number;
  defaultValue: string;
};

function getProps(elem: HTMLElement): Props {
  const li = elem.closest('li') as HTMLLIElement;
  const name = li.classList[0] as keyof State;
  return {
    li,
    name,
    plus: li.querySelector('.btn.plus') as HTMLElement,
    minus: li.querySelector('.btn.minus') as HTMLElement,
    reset: li.querySelector('.btn.reset') as HTMLElement,
    min: Number(li.dataset.min),
    max: Number(li.dataset.max),
    increment: Number(li.dataset.increment),
    currentValue: Number(state[name]),
    defaultValue: defaultState[name],
  };
}
