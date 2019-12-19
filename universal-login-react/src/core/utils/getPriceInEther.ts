import {utils} from 'ethers';
import {WeiPerEther} from 'ethers/constants';

const {parseUnits} = utils;

const DECIMALS_TO_NORMALIZE = 20;

export const getPriceInEther = (priceInFiat: string, etherPriceInFiat: string): utils.BigNumber => {
  const etherPriceNormalizedToInteger = parseUnits(etherPriceInFiat, DECIMALS_TO_NORMALIZE);
  const etherPriceNormalizedToUnits = etherPriceNormalizedToInteger.div(WeiPerEther.toString());
  const priceInFiatNormalized = parseUnits(priceInFiat, DECIMALS_TO_NORMALIZE);
  return (priceInFiatNormalized).div(etherPriceNormalizedToUnits);
};
