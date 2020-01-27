import {utils} from 'ethers';
import {CommandOverrides} from '../cli/connectAndExecute';

export const getTransactionOverrides = (overrides?: CommandOverrides) => ({
  gasPrice: overrides?.gasPrice ? utils.bigNumberify(overrides.gasPrice) : undefined,
  nonce: overrides?.nonce ? utils.bigNumberify(overrides.nonce) : undefined,
});
