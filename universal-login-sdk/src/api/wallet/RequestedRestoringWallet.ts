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
    const {ensName, contractAddress, encryptedWallet} = await this.sdk.relayerApi.restoreWallet(code, this.ensNameOrEmail);
    const restoringWallet = new RestoringWallet(encryptedWallet, ensName, contractAddress, this.sdk);
    return restoringWallet;
  }
};
