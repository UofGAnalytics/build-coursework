export type Timer = {
  seconds: () => string;
};

export function createTimer(): Timer {
  const start = process.hrtime();
  return {
    seconds() {
      const hrtime = process.hrtime(start);
      return (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
    },
  };
}
