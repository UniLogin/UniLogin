export function *slices(array: number[], sliceSize: number) {
  for (let i = 0; i < array.length; i++) {
    if (i % sliceSize === 0) {
      yield array.slice(i, i + sliceSize);
    }
  }
}
