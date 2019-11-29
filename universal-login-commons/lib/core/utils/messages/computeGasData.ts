import {ensure} from '../errors/heplers';
import {isProperHexString} from '../hexStrings';

export const ZERO_BYTE_GAS_COST = 4;
export const NON_ZERO_BYTE_GAS_COST = 68;
export const NEW_NON_ZERO_BYTE_GAS_COST = 16;
export const GAS_FIXED = '50000';

const gasCostFor = (istanbul: boolean) => (byte: string) => {
  return byte === '00' ? ZERO_BYTE_GAS_COST : getNonZeroByteCost(istanbul);
};

const getNonZeroByteCost = (istanbul: boolean) => istanbul ? NEW_NON_ZERO_BYTE_GAS_COST : NON_ZERO_BYTE_GAS_COST;

export const computeGasDataBase = (data: string, gasCost: (byte: string) => number) => {
  ensure(isProperHexString(data), Error, 'Not a valid hex string');
  return data
    .match(/.{2}/g)!
    .slice(1)
    .reduce((totalGasCost, byte) => totalGasCost + gasCost(byte), 0);
};

export const computeGasData = (data: string) => {
  return computeGasDataBase(data, gasCostFor(false));
};

export const computeNewGasData = (data: string) => {
  return computeGasDataBase(data, gasCostFor(true));
};
