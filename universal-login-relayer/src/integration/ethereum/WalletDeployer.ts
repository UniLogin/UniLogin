import {Contract, Wallet} from 'ethers';
import {TransactionOverrides} from '@universal-login/commons';
import {ProxyFactoryInterface} from '@universal-login/contracts';

export class WalletDeployer {
  private factoryContract: Contract;

  constructor(factoryAddress: string, public readonly wallet: Wallet) {
    this.factoryContract = new Contract(factoryAddress, ProxyFactoryInterface, this.wallet);
  }

  deploy(gnosisSafeAddress: string, setupData: string, nonce: string, overrides: TransactionOverrides) {
    return this.factoryContract.createProxyWithNonce(gnosisSafeAddress, setupData, nonce, overrides);
  }

  getInitCode = () => this.factoryContract.initCode();
}
