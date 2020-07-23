import {SerializableConfirmedWallet} from '@unilogin/commons';

export class ConfirmedWallet implements SerializableConfirmedWallet {
  constructor(
    readonly email: string,
    readonly ensName: string,
    readonly code: string,
  ) {}

  get asSerializableRequestedWallet(): SerializableConfirmedWallet {
    return {
      email: this.email,
      ensName: this.ensName,
      code: this.code,
    };
  }
}
