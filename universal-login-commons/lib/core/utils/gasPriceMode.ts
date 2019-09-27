import {GasMode, GasOption} from '../models/gas';

export const getGasPriceFor = (gasModes: GasMode[], gasModeName: string, gasTokenAddress: string) => {
  const mode = findGasMode(gasModes, gasModeName);
  const {gasPrice} = mode.gasOptions.filter((gasOption: GasOption) => gasOption.token.address === gasTokenAddress)[0];
  return gasPrice;
};

export const findGasMode = (gasModes: GasMode[], gasModeName: string) =>  gasModes.filter((gasPriceMode: GasMode) => gasPriceMode.name === gasModeName)[0];
