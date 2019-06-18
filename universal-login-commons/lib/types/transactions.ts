import {utils} from 'ethers';

export type TransactionOverrides = {
  gasLimit?: utils.BigNumber;
  gasPrice?: utils.BigNumber;
};
