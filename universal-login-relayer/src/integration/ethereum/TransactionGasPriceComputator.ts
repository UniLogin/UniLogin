import {GasPriceOracle} from '@unilogin/commons';
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
}
