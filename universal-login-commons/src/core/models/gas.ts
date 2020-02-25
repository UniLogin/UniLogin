import {TokenDetails} from './TokenData';
import {utils} from 'ethers';
import {TokensPrices} from './CurrencyData';

export interface GasOption {
  token: TokenDetails;
  gasPrice: utils.BigNumber;
}

export interface GasMode {
  name: string;
  usdAmount: utils.BigNumberish;
  timeEstimation: number;
  gasOptions: GasOption[];
}

export interface GasParameters {
  gasToken: string;
  gasPrice: utils.BigNumber;
}

export type GasModesWithPrices = {
  modes: GasMode[];
  prices: TokensPrices;
};

export type OnGasParametersChanged = (gasParameters: GasParameters) => void;
