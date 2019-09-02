import {http} from '@universal-login/commons';
import {fetch} from './fetch';

export type GasPriceOption = 'fastest' | 'fast' | 'average';

const GAS_PRICE_ORACLE_URL = 'https://ethgasstation.info/json/ethgasAPI.json';

export const getGasPrices = async (): Promise<Record<GasPriceOption, number>> => {
  const {fastest, fast, average} = await http(fetch)(GAS_PRICE_ORACLE_URL)('GET', '');
  return {fastest, fast, average};
};
