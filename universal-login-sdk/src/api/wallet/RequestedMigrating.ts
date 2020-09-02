import {SerializableRequestedMigratingWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';
import {DeployedWallet} from './DeployedWallet';
import {ConfirmedMigratingWallet} from './ConfirmedMigratingWallet';

export class RequestedMigratingWallet extends DeployedWallet implements SerializableRequestedMigratingWallet {
  constructor(
    readonly contractAddress: string,
    readonly ensName: string,
    readonly privateKey: string,
    readonly email: string,
    public readonly sdk: UniLoginSdk,
  ) {
    super(contractAddress, ensName, privateKey, sdk, email);
  };

  get asSerializableRequestedMigratingWallet(): SerializableRequestedMigratingWallet {
    return {
      contractAddress: this.contractAddress,
      ensName: this.ensName,
      privateKey: this.privateKey,
      email: this.email,
    };
  }

  requestEmailConfirmation() {
    return this.sdk.relayerApi.requestEmailConfirmationForCreating(this.asSerializableRequestedMigratingWallet);
  };

  async confirmEmail(code: string) {
    await this.sdk.relayerApi.confirmCode(code, this.email);
    return new ConfirmedMigratingWallet(this.contractAddress, this.ensName, this.privateKey, this.email, code, this.sdk);
  }
};
