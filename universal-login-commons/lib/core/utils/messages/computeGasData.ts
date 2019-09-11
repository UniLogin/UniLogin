import {ensure} from '../errors';
import {isProperHexString} from '../hexStrings';

export const ZERO_BYTE_GAS_COST = 4;
export const NON_ZERO_BYTE_GAS_COST = 68;

export const computeGasData = (data: string) => {
  ensure(isProperHexString(data), Error, 'Not a valid hex string');

  if (data === '0x') {
    return 0;
  }

  return data
    .slice(2)
    .match(/.{2}/g)!
    .reduce((totalGasCost, byte) =>  totalGasCost + gasCostFor(byte), 0);
};

const gasCostFor = (byte: string) => {
  return byte === '00' ? ZERO_BYTE_GAS_COST : NON_ZERO_BYTE_GAS_COST;
};
