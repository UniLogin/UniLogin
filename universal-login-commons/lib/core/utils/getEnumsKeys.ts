export const getEnumKeys = (anEnum: any) => {
  return Object.keys(anEnum).filter((k) => typeof anEnum[k as any] === 'number');
};
