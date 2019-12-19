import {utils} from 'ethers';
import {WeiPerEther} from 'ethers/constants';
import {GET_PRICE_IN_ETHER_NORMALIZE_WEI_INTEGER} from '../constants/normalization';

const {parseUnits} = utils;

export const getPriceInEther = (priceInFiat: string, etherPriceInFiat: string): utils.BigNumber => {
  const etherPriceNormalizedToInteger = parseUnits(etherPriceInFiat, GET_PRICE_IN_ETHER_NORMALIZE_WEI_INTEGER);
  const etherPriceNormalizedToUnits = etherPriceNormalizedToInteger.div(WeiPerEther.toString());
  const priceInFiatNormalized = parseUnits(priceInFiat, GET_PRICE_IN_ETHER_NORMALIZE_WEI_INTEGER);
  return (priceInFiatNormalized).div(etherPriceNormalizedToUnits);
};
