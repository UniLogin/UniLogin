import {Contract, Wallet} from 'ethers';
import {TransactionOverrides} from '@unilogin/commons';
import {ProxyFactoryInterface} from '@unilogin/contracts';

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
