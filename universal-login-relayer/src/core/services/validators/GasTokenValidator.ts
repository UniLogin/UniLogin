import {utils} from 'ethers';
import {GasPriceOption, GasPriceOracle, ensure, safeMultiply, ETHER_NATIVE_TOKEN, ValueRounder} from '@unilogin/commons';
import {InvalidTolerance, NotEnoughGasPrice} from '../../utils/errors';

export interface GasPriceDetails {
  gasPrice: string;
  gasToken: string;
  tokenPriceInETH: string;
}

export class GasTokenValidator {
  constructor(private oracle: GasPriceOracle) {}

  async validate(gasPriceDetails: GasPriceDetails, tolerance = 0, gasPriceOption: GasPriceOption = 'fast') {
    const {gasPrice, gasToken, tokenPriceInETH} = gasPriceDetails;
    if (gasPrice === '0' && gasToken === ETHER_NATIVE_TOKEN.address) return;
    const gasPriceInEth = safeMultiply(utils.bigNumberify(gasPrice), tokenPriceInETH);
    const roundedToWeiGasPrice = utils.bigNumberify(ValueRounder.floor(gasPriceInEth, 0));
    const gasPrices = await this.oracle.getGasPrices();
    const minimumGasPriceAllowed = calculateTolerancedValue(gasPrices[gasPriceOption].gasPrice, tolerance);
    ensure(roundedToWeiGasPrice.gte(minimumGasPriceAllowed), NotEnoughGasPrice);
  }
}

export const calculateTolerancedValue = (value: utils.BigNumber, tolerance: number) => {
  ensure(tolerance >= 0 && tolerance <= 1, InvalidTolerance, tolerance);
  const bigNumber100 = utils.bigNumberify(100);
  const multiplier = safeMultiply(bigNumber100, tolerance);
  const percentage = bigNumber100.sub(multiplier);
  return value.mul(percentage).div(100);
};
