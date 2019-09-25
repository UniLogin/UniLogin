import {GasMode, GasOption} from '../models/gasMode';

export const getGasPriceFor = (gasModes: GasMode[], gasModeName: string, gasTokenAddress: string) => {
  const mode = gasModes.filter((gasPriceMode: GasMode) => gasPriceMode.name === gasModeName)[0];
  const {gasPrice} = mode.gasOptions.filter((gasOption: GasOption) => gasOption.token.address === gasTokenAddress)[0];
  return gasPrice;
};
