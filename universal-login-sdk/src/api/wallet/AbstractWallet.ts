import {ApplicationWallet} from '@unilogin/commons';
import {utils} from 'ethers';

export class AbstractWallet implements ApplicationWallet {
  constructor(
    public readonly contractAddress: string,
    public readonly name: string,
    public readonly privateKey: string,
  ) { }

  get publicKey() {
    return utils.computeAddress(this.privateKey);
  }
}
