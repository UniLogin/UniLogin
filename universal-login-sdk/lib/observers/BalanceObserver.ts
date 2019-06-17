import {providers, Contract} from 'ethers';
import ObserverBase from './ObserverBase';
import {SupportedToken, ETHER_NATIVE_TOKEN, ensure} from '@universal-login/commons';
import ERC20 from '@universal-login/contracts/build/ERC20.json';

export type BalanceChangedCallback = (tokenAddress: string, contractAddress: string) => void;

export class BalanceObserver extends ObserverBase {
  private contractAddress?: string;

  constructor(private supportedTokens: SupportedToken[], private provider: providers.Provider, private callback: BalanceChangedCallback) {
    super();
  }

  async startAndSubscribe(contractAddress: string) {
    ensure(!this.isRunning(), Error, 'Other wallet waiting for counterfactual deployment. Stop BalanceObserver to cancel old wallet instantialisation.');
    this.contractAddress = contractAddress;
    super.start();
    return () => {
      this.contractAddress = undefined;
      this.stop();
    };
  }

  tick() {
    return this.checkBalances();
  }

  async checkBalances() {
    if (this.contractAddress) {
      await this.checkBalancesFor(this.contractAddress);
    }
  }

  async checkBalancesFor(contractAddress: string) {
    for (let count = 0; count < this.supportedTokens.length; count++) {
      const {address, minimalAmount} = this.supportedTokens[count];
      if (address === ETHER_NATIVE_TOKEN.address) {
        await this.etherBalanceChanged(contractAddress, minimalAmount);
      } else {
        await this.tokenBalanceChanged(contractAddress, address, minimalAmount);
      }
    }
  }

  async etherBalanceChanged(contractAddress: string, minimalAmount: string) {
    const balance = await this.provider.getBalance(contractAddress);
    if (balance.gte(minimalAmount)) {
      this.onBalanceChanged(contractAddress, ETHER_NATIVE_TOKEN.address);
    }
  }

  async tokenBalanceChanged(contractAddress: string, tokenAddress: string, minimalAmount: string) {
    const token = new Contract(tokenAddress, ERC20.interface, this.provider);
    const balance = await token.balanceOf(contractAddress);
    if (balance.gte(minimalAmount)) {
      this.onBalanceChanged(contractAddress, tokenAddress);
    }
  }

  onBalanceChanged(contractAddress: string, tokenAddress: string) {
    this.callback(tokenAddress, contractAddress);
    this.contractAddress = undefined;
    this.stop();
  }
}
