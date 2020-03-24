import {utils} from 'ethers';
import {SAFE_MULTIPLY_UNITS_NORMALIZE} from '../constants/normalization';

export const safeMultiplyAndFormatEther = (valueInWei: utils.BigNumber, multiplier: utils.BigNumberish) => {
  const normalizedMultiplier = utils.parseEther(multiplier.toString());
  const resultE18 = normalizedMultiplier.mul(valueInWei);
  return utils.formatUnits(resultE18, SAFE_MULTIPLY_UNITS_NORMALIZE);
};
