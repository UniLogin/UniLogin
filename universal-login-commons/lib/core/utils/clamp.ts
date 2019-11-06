export const clamp = (val: number, min: number, max: number) =>
  Math.max(Math.min(val, max), min);
