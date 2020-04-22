import {utils} from 'ethers';

export type GasPriceOption = 'fast' | 'cheap';

export type GasPriceEstimation = {
  gasPrice: utils.BigNumber;
  timeEstimation: number;
};

export type GasPriceSuggestion = Record<GasPriceOption, GasPriceEstimation>;
