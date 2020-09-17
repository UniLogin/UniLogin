import {SerializableRequestedRestoringWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';
import {RestoringWallet} from './RestoringWallet';

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

  async confirmEmail(code: string) {
    const {ensName, contractAddress, walletJSON, email, gasToken, gasPrice} = await this.sdk.relayerApi.restoreWallet(code, this.ensNameOrEmail);
    return new RestoringWallet(walletJSON, email, ensName, contractAddress, gasToken, gasPrice, this.sdk);
  }
};
