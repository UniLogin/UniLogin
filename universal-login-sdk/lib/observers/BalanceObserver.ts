import {providers, Contract} from 'ethers';
import ObserverRunner from './ObserverRunner';
import {SupportedToken, ETHER_NATIVE_TOKEN, ensure} from '@universal-login/commons';
import ERC20 from '@universal-login/contracts/build/ERC20.json';

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
      const balance = await this.getBalance(contractAddress, address)
      if (balance.gte(minimalAmount)) {
        this.onBalanceChanged(contractAddress, address);
      }
    }
  }

  async getBalance(contractAddress: string, tokenAddress: string) {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return this.getEtherBalance(contractAddress);
    } else {
      return this.getTokenBalance(contractAddress, tokenAddress);
    }
  }

  async getEtherBalance(contractAddress: string) {
    return this.provider.getBalance(contractAddress);
  }

  async getTokenBalance(contractAddress: string, tokenAddress: string) {
    const token = new Contract(tokenAddress, ERC20.interface, this.provider);
    return token.balanceOf(contractAddress);
  }

  onBalanceChanged(contractAddress: string, tokenAddress: string) {
    this.callback!(tokenAddress, contractAddress);
    this.contractAddress = undefined;
    this.stop();
  }
}
