import {SerializableRequestedMigratingWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';

export class RequestedMigratingWallet implements SerializableRequestedMigratingWallet {
  constructor(
    readonly contractAddress: string,
    readonly ensName: string,
    readonly privateKey: string,
    readonly email: string,
    public readonly sdk: UniLoginSdk,
  ) {};

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
    const {ensNameOrEmail} = await this.sdk.relayerApi.confirmCode(code, this.email);
    return ensNameOrEmail;
  }
};
