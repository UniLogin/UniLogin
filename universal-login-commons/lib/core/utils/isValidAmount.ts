export const isValidAmount = (amount: any): boolean => {
  return !!amount.match(/(^[0-9]+(\.?[0-9])*$)/);
};
