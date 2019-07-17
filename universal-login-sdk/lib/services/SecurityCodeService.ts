import {utils} from 'ethers';
import deepEqual from 'deep-equal';
import {InvalidAddress} from '../utils/errors';
import {ensure, isProperAddress, shuffle, reverseHexString, array8bitTo16bit} from '@universal-login/commons';
import {  } from '@universal-login/commons/lib';

export class SecurityCodeService {
  alphabetSize = 1024;
  securityCodeLength = 6;
  mask: number;

  constructor() {
    this.mask = this.alphabetSize - 1;
  }

  generateCodeWithFakes(publicKey: string): number[] {
    ensure(isProperAddress(publicKey), InvalidAddress, publicKey);
    const code = this.generateCode(publicKey);
    const redundantCode = this.generateCode(reverseHexString(publicKey));
    return shuffle([...code, ...redundantCode]);
  }

  generateCode(publicKey: string): number[] {
    const hash = utils.keccak256(publicKey);
    const bytes8bit = Array.from(utils.arrayify(hash));
    const bytes16bit = array8bitTo16bit(bytes8bit);

    return bytes16bit
      .slice(0, this.securityCodeLength)
      .map((e) => e & this.mask);
  }

  isValidCode(code: number[], publicKey: string): boolean {
    const expectedCode = this.generateCode(publicKey);
    return deepEqual(expectedCode, code);
  }
}
