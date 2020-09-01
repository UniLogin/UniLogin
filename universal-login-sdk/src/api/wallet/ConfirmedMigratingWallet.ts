import {SerializableConfirmedMigratingWallet, StoredEncryptedWallet} from '@unilogin/commons';
import UniLoginSdk from '../sdk';
import {DeployedWallet} from './DeployedWallet';
import {Wallet} from 'ethers';

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

  async setPassword(password: string) {
    const wallet = new Wallet(this.privateKey);
    const storedEncryptedWallet: StoredEncryptedWallet = {
      email: this.email,
      ensName: this.ensName,
      walletJSON: JSON.parse(await wallet.encrypt(password)),
      contractAddress: this.contractAddress,
      publicKey: wallet.address,
    };
    const {email} = await this.sdk.relayerApi.storeEncryptedWallet(storedEncryptedWallet, this.code);
    if (email === this.email) {
      return new DeployedWallet(this.contractAddress, this.ensName, this.privateKey, this.sdk, this.email);
    }
  }
};
