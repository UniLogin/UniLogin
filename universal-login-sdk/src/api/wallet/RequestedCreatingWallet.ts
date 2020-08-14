import {SerializableRequestedCreatingWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';
import {ConfirmedWallet} from './ConfirmedWallet';

export class RequestedCreatingWallet implements SerializableRequestedCreatingWallet {
  constructor(
    readonly sdk: UniLoginSdk,
    readonly email: string,
    readonly ensName: string,
  ) {}

  get asSerializableRequestedCreatingWallet(): SerializableRequestedCreatingWallet {
    return {
      email: this.email,
      ensName: this.ensName,
    };
  }

  requestEmailConfirmation() {
    return this.sdk.relayerApi.requestEmailConfirmationForCreating(this.asSerializableRequestedCreatingWallet);
  }

  async confirmEmail(code: string) {
    await this.sdk.relayerApi.confirmCode(code, this.email);
    return new ConfirmedWallet(this.email, this.ensName, code);
  }
}
