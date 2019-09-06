import {ApplicationWallet} from '@universal-login/commons';

export class DeployedWallet implements ApplicationWallet {
  constructor(
    public readonly contractAddress: string,
    public readonly name: string,
    public readonly privateKey: string,
  ) {
  }

}
