import {utils} from 'ethers';
import deepEqual from 'deep-equal';
import {InvalidAddress} from '../utils/errors';
import {ensure, isProperAddress} from '@universal-login/commons';

function *slices(array: Uint8Array, sliceSize: number) {
  for (let i = 0; i < array.length; i++) {
    if (i % sliceSize === 0) {
      yield array.slice(i, i + sliceSize);
    }
  }
}

export class SecurityCodeService {
  highNumberMask = 0x03;
  lowNumberMask =  0xFF;
  alphabetSize = 1024;
  securityCodeLength = 6;
  securityKeyboardSize = 30;
  mask = 0x03FF;

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
    return this.shuffle(securityCode);
  }

  private shuffle(encoding: number[]): number[] {
    for (let i = encoding.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [encoding[i], encoding[j]] = [encoding[j], encoding[i]];
    }
    return encoding;
  }

  isCodeValid(encoding: number[], address: string): boolean {
    const encodedAddress = this.encode(address);
    return deepEqual(encodedAddress, encoding);
  }

  to10bitNumber = (high: number, low: number): number => {
    return ((high & this.highNumberMask) << 8) | (low & this.lowNumberMask);
  }

  generateCode = (address: string) => {
    const addressBytes = utils.arrayify(address);
    return Array.from(slices(addressBytes, 2))
      .map((element) => this.to10bitNumber(element[0], element[1]));
  }
}
