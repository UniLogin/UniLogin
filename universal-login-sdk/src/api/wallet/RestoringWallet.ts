import {EncryptedWallet, SerializableRestoringWallet} from '@unilogin/commons';
import {Wallet} from 'ethers';

export class RestoringWallet {
  constructor(
    private encryptedWallet: EncryptedWallet,
    private ensName: string,
    private contractAddress: string) {}

  get asSerializableRestoringWallet(): SerializableRestoringWallet {
    return {
      encryptedWallet: this.encryptedWallet,
      ensName: this.ensName,
      contractAddress: this.contractAddress,
    };
  }

  async restore(password: string) {
    const wallet = await Wallet.fromEncryptedJson(JSON.stringify(this.encryptedWallet), password);
    return wallet.privateKey;
  }
}
