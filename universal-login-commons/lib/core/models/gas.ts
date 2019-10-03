import {TokenDetails} from './TokenData';
import {utils} from 'ethers';

export interface GasOption {
  token: TokenDetails;
  gasPrice: utils.BigNumber;
}

export interface GasMode {
  name: string;
  usdAmount: utils.BigNumberish;
  gasOptions: GasOption[];
}

export interface GasParameters {
  gasToken: string;
  gasPrice: utils.BigNumber;
}

export type OnGasParametersChanged = (gasParameters: GasParameters) => void;

