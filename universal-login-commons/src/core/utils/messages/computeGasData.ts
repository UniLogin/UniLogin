import {ensure} from '../errors/ensure';
import {isProperHexString} from '../hexStrings';
import {ISTANBUL_NON_ZERO_BYTE_GAS_COST, NON_ZERO_BYTE_GAS_COST, ZERO_BYTE_GAS_COST} from '../../constants/gas';

export type NetworkVersion = 'istanbul' | 'constantinople';

export class GasDataComputation {
  constructor(private chainVersion: NetworkVersion) {
  }

  private getNonZeroByteCost() {
    return this.chainVersion === 'istanbul' ? ISTANBUL_NON_ZERO_BYTE_GAS_COST : NON_ZERO_BYTE_GAS_COST;
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
