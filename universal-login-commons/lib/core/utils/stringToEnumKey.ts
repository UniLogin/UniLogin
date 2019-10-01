export const stringToEnumKey = (anEnum: any, keyAsString: string) => {
  return anEnum[keyAsString as any] as any;
};
