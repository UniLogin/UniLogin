import {providers} from 'ethers';
import ObserverRunner from './ObserverRunner';
import {SupportedToken, getBalance, ensure} from '@universal-login/commons';

export type BalanceChangedCallback = (tokenAddress: string, contractAddress: string) => void;

export class BalanceObserver extends ObserverRunner {
  private contractAddress?: string;
  private callback?: BalanceChangedCallback;

  constructor(private supportedTokens: SupportedToken[], private provider: providers.Provider) {
    super();
  }

  async startAndSubscribe(contractAddress: string, callback: BalanceChangedCallback) {
    ensure(!this.isRunning(), Error, 'Other wallet waiting for counterfactual deployment. Stop BalanceObserver to cancel old wallet instantialisation.');
    this.contractAddress = contractAddress;
    this.callback = callback;
    this.start();
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
      const balance = await getBalance(this.provider, contractAddress, address);
      if (balance.gte(minimalAmount)) {
        this.onBalanceChanged(contractAddress, address);
      }
    }
  }

  onBalanceChanged(contractAddress: string, tokenAddress: string) {
    this.callback!(tokenAddress, contractAddress);
    this.contractAddress = undefined;
    this.stop();
  }
}
