type Store = Record<string, number>;

export type Counter = {
  increment: (key: string) => number;
};

export function createCounter() {
  const store: Store = {};
  return {
    increment(key: string) {
      const value = (store[key] || 0) + 1;
      store[key] = value;
      return value;
    },
  };
}
