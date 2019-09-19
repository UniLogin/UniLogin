import {utils} from 'ethers';

export interface TransferDetails {
  to: string;
  amount: string;
  currency: string;
}

export type TransactionOverrides = {
  gasLimit?: utils.BigNumber;
  gasPrice?: utils.BigNumber;
  nonce?: utils.BigNumber;
};
