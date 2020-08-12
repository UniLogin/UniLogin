import {SerializableRequestedCreatingWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';

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

  confirmEmail(code: string) {
    return this.sdk.relayerApi.confirmCode(code, this.email);
  }
}
