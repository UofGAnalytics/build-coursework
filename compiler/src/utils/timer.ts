export function createTimer() {
  const start = process.hrtime();
  return {
    stop() {
      const hrtime = process.hrtime(start);
      return (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
    },
  };
}
