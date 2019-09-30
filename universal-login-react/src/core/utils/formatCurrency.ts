const withPrecision = (value: number, fixed: number) => {
  const magnitude = Math.pow(10, fixed);
  return Math.floor(value * magnitude) / magnitude;
};

export const formatCurrency = (value: string, currency: string = 'USD') : string => {
  const maximumFractionDigits = 2;
  const style = currency ? 'currency' : 'decimal';
  const formatter = new Intl.NumberFormat('en-US', {currency: 'USD', style});
  return formatter.format(withPrecision(Number.parseFloat(value || '0'), maximumFractionDigits));
};
