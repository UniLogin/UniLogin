import {EncryptedWallet, SerializableRestoringWallet, ensure} from '@unilogin/commons';
import {Wallet} from 'ethers';
import UniLoginSdk from '../sdk';
import {DeployedWallet} from './DeployedWallet';
import {InvalidPrivateKey} from '../../core/utils/errors';

export class RestoringWallet {
  constructor(
    readonly encryptedWallet: EncryptedWallet,
    readonly email: string,
    readonly ensName: string,
    readonly contractAddress: string,
    readonly gasToken: string,
    readonly gasPrice: string,
    private sdk: UniLoginSdk) {}

  get asSerializableRestoringWallet(): SerializableRestoringWallet {
    return {
      encryptedWallet: this.encryptedWallet,
      ensName: this.ensName,
      contractAddress: this.contractAddress,
      email: this.email,
      gasToken: this.gasToken,
      gasPrice: this.gasPrice,
    };
  }

  async restore(password: string) {
    const wallet = await Wallet.fromEncryptedJson(JSON.stringify(this.encryptedWallet), password);
    if (await this.sdk.providerService.isContract(this.contractAddress)) {
      const deployedWallet = new DeployedWallet(this.contractAddress, this.ensName, wallet.privateKey, this.sdk, this.email);
      ensure(await deployedWallet.keyExist(wallet.address), InvalidPrivateKey, this.contractAddress);
      return deployedWallet;
    } else {
      return this.sdk.getFutureWalletFactory().createFrom({
        privateKey: wallet.privateKey,
        contractAddress: this.contractAddress,
        ensName: this.ensName,
        gasPrice: this.gasPrice,
        gasToken: this.gasToken,
        email: this.email,
      });
    }
  }
}
