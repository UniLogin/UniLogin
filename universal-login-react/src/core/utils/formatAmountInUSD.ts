export const formatAmountInUSD = (amountInUSD: string, addDolarSymbol: boolean = true) => {
  const formattedAmount = Number.parseFloat(amountInUSD).toFixed(2);
  const optionalDolarSymbol = addDolarSymbol ? '$' : '';
  return `${optionalDolarSymbol}${formattedAmount}`;
};
