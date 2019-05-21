import {utils} from 'ethers';
import {DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@universal-login/commons';

const DEFAULT_PAYMENT_OPTIONS = {
  gasPrice: utils.bigNumberify(DEFAULT_GAS_PRICE),
  gasLimit: utils.bigNumberify(DEFAULT_GAS_LIMIT),
};

export default DEFAULT_PAYMENT_OPTIONS;
