import {Contract, Wallet} from 'ethers';
import {TransactionOverrides} from '@universal-login/commons';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';

interface DeployFactoryArgs {
  publicKey: string;
  intializeData: string;
  signature: string;
}

export class WalletDeployer {
  private factoryContract: Contract;

  constructor(factoryAddress: string, private wallet: Wallet) {
    this.factoryContract = new Contract(factoryAddress, ProxyCounterfactualFactory.interface, this.wallet);
  }

  deploy(deployFactoryArgs: DeployFactoryArgs, overrideOptions: TransactionOverrides) {
    return this.factoryContract.createContract(deployFactoryArgs.publicKey, deployFactoryArgs.intializeData, deployFactoryArgs.signature, overrideOptions);
  }

  getInitCode = () => this.factoryContract.initCode();
}
