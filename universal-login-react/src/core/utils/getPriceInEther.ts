import {utils} from 'ethers';
import {GET_PRICE_IN_ETHER_NORMALIZE_TO_INTEGER, GET_PRICE_IN_ETHER_NORMALIZE_TO_UNITS} from '../constants/normalization';

export const getPriceInEther = (priceInFiat: string, etherPriceInFiat: string): utils.BigNumber => {
  const etherPriceInFiatAsBigNumber = utils.parseEther(etherPriceInFiat);
  const etherPriceNormalizedToInteger = etherPriceInFiatAsBigNumber.mul(GET_PRICE_IN_ETHER_NORMALIZE_TO_INTEGER);
  const etherPriceNormalizedToUnits = etherPriceNormalizedToInteger.div(GET_PRICE_IN_ETHER_NORMALIZE_TO_UNITS);
  const priceInFiatAsWei = utils.parseEther(priceInFiat);
  const priceInFiatNormalized = priceInFiatAsWei.mul(GET_PRICE_IN_ETHER_NORMALIZE_TO_INTEGER);
  return (priceInFiatNormalized).div(etherPriceNormalizedToUnits);
};
