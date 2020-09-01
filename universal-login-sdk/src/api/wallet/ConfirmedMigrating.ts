import {SerializableConfirmedMigratingWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';
import {DeployedWallet} from './DeployedWallet';

export class ConfirmedMigratingWallet extends DeployedWallet implements SerializableConfirmedMigratingWallet {
  constructor(
    readonly contractAddress: string,
    readonly ensName: string,
    readonly privateKey: string,
    readonly email: string,
    readonly code: string,
    public readonly sdk: UniLoginSdk,
  ) {
    super(contractAddress, ensName, privateKey, sdk, email);
  };

  get asSerializableConfirmedMigratingWallet(): SerializableConfirmedMigratingWallet {
    return {
      contractAddress: this.contractAddress,
      ensName: this.ensName,
      privateKey: this.privateKey,
      email: this.email,
      code: this.code,
    };
  }
};
