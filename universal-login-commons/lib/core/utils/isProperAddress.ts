export const isProperAddress = (address: string) => {
  return !!address.match(/^0x[0-9A-Fa-f]{40}$/);
};
