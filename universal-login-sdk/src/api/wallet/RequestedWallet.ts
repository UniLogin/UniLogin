import {SerializableRequestedWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';

export class RequestedWallet implements SerializableRequestedWallet {
  constructor(
    readonly sdk: UniLoginSdk,
    readonly email: string,
    readonly ensName: string,
  ) {}

  get asSerializableRequestedWallet(): SerializableRequestedWallet {
    return {
      email: this.email,
      ensName: this.ensName,
    };
  }

  requestEmailConfirmation() {
    return this.sdk.relayerApi.requestEmailConfirmation(this.asSerializableRequestedWallet);
  }
}
