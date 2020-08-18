import {utils} from 'ethers';
import {GasParameters} from './gas';
import {TokenDetails} from './TokenData';

export type TransferToken = Pick<TokenDetails, 'address' | 'decimals'>;

export interface TransferDetails {
  to: string;
  amount: string;
  token: TransferToken;
  gasParameters: GasParameters;
}

export type TransactionOverrides = {
  gasLimit?: utils.BigNumber;
  gasPrice?: utils.BigNumber;
  nonce?: utils.BigNumber;
};
