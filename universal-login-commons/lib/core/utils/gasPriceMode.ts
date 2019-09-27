import {GasMode, GasOption} from '../models/gas';

export const getGasPriceFor = (gasModes: GasMode[], gasModeName: string, gasTokenAddress: string) => {
  const mode = findGasMode(gasModes, gasModeName);
  const {gasPrice} = findGasOption(mode.gasOptions, gasTokenAddress);
  return gasPrice;
};

export const findGasOption = (gasOptions: GasOption[], gasTokenAddress: string) => gasOptions.filter((gasOption: GasOption) => gasOption.token.address === gasTokenAddress)[0];

export const findGasMode = (gasModes: GasMode[], gasModeName: string) =>  gasModes.filter((gasPriceMode: GasMode) => gasPriceMode.name === gasModeName)[0];
