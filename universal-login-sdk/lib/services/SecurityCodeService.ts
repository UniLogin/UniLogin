import { utils } from 'ethers';
import deepEqual from 'deep-equal';
import { InvalidAddress } from '../utils/errors';

export class SecurityCodeService {
  maxCodeNumber: number;
  securityCodeLength: number;
  securityKeyboardSize: number;
  mask: number;
  highNumberMask: number;
  lowNumberMask: number;

  constructor() {
    this.maxCodeNumber = 1024;
    this.securityCodeLength = 6;
    this.securityKeyboardSize = 30;
    this.mask = 0x03FF;
    this.highNumberMask = 0x03;
    this.lowNumberMask = 0xFF;
  }

  encode(address: string): number[] {
    if (!address.match(/0x[0-9A-Fa-f]{40}/)) {
      throw new InvalidAddress(address);
    }
    const addressBytes = utils.arrayify(address);
    const code = [];
    for (let i = 0; i !== addressBytes.length; i += 2) {
      code.push(this.to10bitNumber(addressBytes[i], addressBytes[i + 1]));
    }

    return code
      .slice(0, this.securityCodeLength)
      .map((codeElement) => codeElement & 0x03FF);
  }

  getSecurityCode(address: string): number[] {
    const encoding = this.encode(address);
    const randomNumbers = Array.from(
      {length: this.securityKeyboardSize - this.securityCodeLength},
      () => Math.floor(Math.random() * this.maxCodeNumber)
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

  to10bitNumber(high: number, low: number): number {
    return ((high & this.highNumberMask) << 8) | (low & this.lowNumberMask);
  }
}
