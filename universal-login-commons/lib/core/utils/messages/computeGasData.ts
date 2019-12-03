import {ensure} from '../errors/heplers';
import {isProperHexString} from '../hexStrings';

export const ZERO_BYTE_GAS_COST = 4;
export const NON_ZERO_BYTE_GAS_COST = 68;
export const NEW_NON_ZERO_BYTE_GAS_COST = 16;
export const GAS_FIXED = '50000';

export type ChainVersion = 'istanbul' | 'constantinople';

export class GasComputation {
  constructor(private chainVersion: ChainVersion) {
  }

  private getNonZeroByteCost() {
    return this.chainVersion === 'istanbul' ? NEW_NON_ZERO_BYTE_GAS_COST : NON_ZERO_BYTE_GAS_COST;
  }

  private gasCostFor(byte: string) {
    return byte === '00' ? ZERO_BYTE_GAS_COST : this.getNonZeroByteCost();
  }

  computeGasData(data: string) {
    ensure(isProperHexString(data), Error, 'Not a valid hex string');
    return data
      .match(/.{2}/g)!
      .slice(1)
      .reduce((totalGasCost, byte) => totalGasCost + this.gasCostFor(byte), 0);
  }
}

export const computeGasData = (data: string) => new GasComputation('constantinople').computeGasData(data);
