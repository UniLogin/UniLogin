import {bigNumberifyDecimal, GasPriceOracle, safeMultiply} from '@unilogin/commons';
import {utils} from 'ethers';

export class TransactionGasPriceComputator {
  constructor(private gasPriceOracle: GasPriceOracle) {}

  async getGasPrice(gasPrice: utils.BigNumberish) {
    if (utils.bigNumberify(gasPrice).isZero()) {
      const {fast} = await this.gasPriceOracle.getGasPrices();
      return fast.gasPrice;
    } else {
      return utils.bigNumberify(gasPrice);
    }
  }

  async getGasPriceInEth(givenGasPrice: utils.BigNumberish, tokenPriceInEth: utils.BigNumberish) {
    const gasPrice = await this.getGasPrice(givenGasPrice);
    return bigNumberifyDecimal(safeMultiply(gasPrice, tokenPriceInEth));
  }
}
