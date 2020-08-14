import {SerializableRequestedRestoringWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';

export class RequestedRestoringWallet implements SerializableRequestedRestoringWallet {
  constructor(
    readonly sdk: UniLoginSdk,
    readonly ensNameOrEmail: string,
  ) {};

  get asSerializableRequestedRestoringWallet(): SerializableRequestedRestoringWallet {
    return {
      ensNameOrEmail: this.ensNameOrEmail,
    };
  }

  requestEmailConfirmation() {
    return this.sdk.relayerApi.requestEmailConfirmationForRestoring(this.asSerializableRequestedRestoringWallet);
  };
};
