import {utils} from 'ethers';

export const formatAmountInUSD = (amountInUSD: string, addDolarSymbol: boolean = true) => {
  if (amountInUSD) {
    const amountAsFloat = Number.parseFloat(amountInUSD);
    const roundedAmountAsBigNumber = utils.bigNumberify(Math.floor(amountAsFloat * 100));
    const formattedNumber = utils.formatUnits(roundedAmountAsBigNumber, 2);
    const optionalDolarSymbol = addDolarSymbol ? '$' : '';
    return `${optionalDolarSymbol}${formattedNumber}`;
  }
};
