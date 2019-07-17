import {utils} from 'ethers';
import deepEqual from 'deep-equal';
import {InvalidAddress} from '../utils/errors';
import {ensure, isProperAddress, slices, shuffle} from '@universal-login/commons';

export class SecurityCodeService {
  alphabetSize = 1024;
  securityCodeLength = 6;
  securityKeyboardSize = 12;
  mask: number;

  constructor() {
    this.mask = this.alphabetSize - 1;
  }

  getSecurityCode(publicKey: string): number[] {
    const encoding = this.encode(publicKey);
    const randomNumbers = Array.from(
      {length: this.securityKeyboardSize - this.securityCodeLength},
      () => Math.floor(Math.random() * this.alphabetSize)
    );
    const securityCode = encoding.concat(randomNumbers);
    return shuffle(securityCode);
  }

  isCodeValid(code: number[], publicKey: string): boolean {
    const expectedCode = this.encode(publicKey);
    return deepEqual(expectedCode, code);
  }

  encode(publicKey: string): number[] {
    ensure(isProperAddress(publicKey), InvalidAddress, publicKey);
    return this.generateCode(publicKey)
      .slice(0, this.securityCodeLength)
      .map((codeElement) => codeElement & this.mask);
  }

  generateCode = (publicKey: string) => {
    const addressBytes = Array.from(utils.arrayify(publicKey));
    return Array.from(slices(addressBytes, 2))
      .map(([hi, low]) => ((hi << 8) | low) & this.mask);
  }
}
