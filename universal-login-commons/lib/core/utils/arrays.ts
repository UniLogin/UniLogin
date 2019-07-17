export function *slices(array: number[], sliceSize: number) {
  for (let i = 0; i < array.length; i++) {
    if (i % sliceSize === 0) {
      yield array.slice(i, i + sliceSize);
    }
  }
}

export const shuffle = (array: number[]): number[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
