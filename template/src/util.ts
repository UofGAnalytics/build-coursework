export function saveState<T>(name: string, state: T) {
  localStorage.setItem(name, JSON.stringify(state));
}

export function getSavedState<T extends { [s: string]: unknown }>(
  name: string,
  defaultState: T,
) {
  const saved = localStorage.getItem(name);
  if (saved === null) {
    return { ...defaultState };
  }
  const savedState = JSON.parse(saved) as T;
  return Object.entries(defaultState).reduce((acc, tuple) => {
    const key = tuple[0] as keyof T;
    const value = tuple[1] as any;
    acc[key] = savedState[key] || value;
    return acc;
  }, {} as T);
}
