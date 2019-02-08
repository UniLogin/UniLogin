import {utils} from 'ethers';

const DEFAULT_PAYMENT_OPTIONS = {
  gasPrice: utils.bigNumberify(110000000),
  gasLimit: utils.bigNumberify(1000000),
};

export default DEFAULT_PAYMENT_OPTIONS;
