export type State = {
  theme: string;
  font: string;
  fontSize: string;
  lineSpacing: string;
  letterSpacing: string;
  lineWidth: string;
};

export const defaultState: State = {
  theme: 'theme-light',
  font: 'font-default',
  fontSize: '1',
  lineSpacing: '1',
  letterSpacing: '1',
  lineWidth: '1',
};

export const state = getSavedState();

export function saveState(state: State) {
  localStorage.setItem('view-options', JSON.stringify(state));
}

function getSavedState() {
  const saved = localStorage.getItem('view-options');
  if (saved === null) {
    return defaultState;
  }
  const savedState = JSON.parse(saved) as State;
  return Object.entries(defaultState).reduce((acc, tuple) => {
    const key = tuple[0] as keyof State;
    const value = tuple[1] as string;
    acc[key] = savedState[key] || value;
    return acc;
  }, {} as State);
}
