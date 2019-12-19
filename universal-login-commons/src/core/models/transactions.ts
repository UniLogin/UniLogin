import {utils} from 'ethers';
import {GasParameters} from './gas';

export interface TransferDetails {
  to: string;
  amount: string;
  transferToken: string;
  gasParameters: GasParameters;
}

export type TransactionOverrides = {
  gasLimit?: utils.BigNumber;
  gasPrice?: utils.BigNumber;
  nonce?: utils.BigNumber;
};
