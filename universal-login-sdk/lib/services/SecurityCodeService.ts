import {utils} from 'ethers';
import deepEqual from 'deep-equal';
import {InvalidAddress} from '../utils/errors';
import {ensure, isProperAddress, slices, shuffle} from '@universal-login/commons';



export class SecurityCodeService {
  alphabetSize = 1024;
  securityCodeLength = 6;
  securityKeyboardSize = 30;
  mask: number;

  constructor() {
    this.mask = this.alphabetSize - 1;
  }

  encode(address: string): number[] {
    ensure(isProperAddress(address), InvalidAddress, address);
    return this.generateCode(address)
      .slice(0, this.securityCodeLength)
      .map((codeElement) => codeElement & this.mask);
  }

  getSecurityCode(address: string): number[] {
    const encoding = this.encode(address);
    const randomNumbers = Array.from(
      {length: this.securityKeyboardSize - this.securityCodeLength},
      () => Math.floor(Math.random() * this.alphabetSize)
    );
    const securityCode = encoding.concat(randomNumbers);
    return shuffle(securityCode);
  }

  isCodeValid(encoding: number[], address: string): boolean {
    const encodedAddress = this.encode(address);
    return deepEqual(encodedAddress, encoding);
  }

  generateCode = (address: string) => {
    const addressBytes = Array.from(utils.arrayify(address));
    return Array.from(slices(addressBytes, 2))
      .map(([hi, low]) => ((hi << 8) | low) & this.mask);
  }
}
