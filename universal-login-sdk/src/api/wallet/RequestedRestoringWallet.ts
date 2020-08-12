import {SerializableRequestedRestoringWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';

export class RequestedRestoringWallet implements SerializableRequestedRestoringWallet {
  constructor(
    readonly sdk: UniLoginSdk,
    readonly ensNameOrEmail: string,
  ) {};

  requestEmailConfirmation(serializableRequestedRestoringWallet: SerializableRequestedRestoringWallet) {
    return this.sdk.relayerApi.requestEmailConfirmationForRestoring(serializableRequestedRestoringWallet)
  };
};
